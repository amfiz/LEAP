# server.py with FlashCards API endpoints
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from datetime import timedelta
import re
import traceback
import os
import uuid
import tempfile
from database import db, User, QuizHistory
from auth import auth
from modules import (generate_mcq_from_topic, generate_questions_from_topic2,
                     get_all_answers, evaluate_mcq_answer, AnswerEvaluator,
                     retriever, model, rag_chain)
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate

app = Flask(__name__)
# Set up CORS with more specific configuration
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "instance", "app.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this in production!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth, url_prefix='/api/auth')

# Create database tables
with app.app_context():
    db.create_all()

# Create an instance of the AnswerEvaluator class
answer_evaluator = AnswerEvaluator()

# Store for flashcard processing jobs
flashcard_jobs = {}

def validate_topic_format(topic):
    """
    Validates if the topic is in an acceptable format.
    """
    if not topic:
        return False, "Please enter a topic"
        
    # Relaxed pattern: either section number format or just text
    section_pattern = r'^\d+(\.\d+)+\s+\S+'
    text_only_pattern = r'^[a-zA-Z]'
    
    if not (re.match(section_pattern, topic) or re.match(text_only_pattern, topic)):
        return False, "Topic must either start with a section number (e.g., '2.1.5 COMPILER') or be a text topic"
        
    return True, None

@app.route('/api/generate-questions', methods=['POST', 'OPTIONS'])
@jwt_required()
def generate_questions_api():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204
    
    # Ensure we have JSON data
    if not request.is_json:
        return jsonify({'success': False, 'message': 'Request must contain JSON data'}), 400
    
    data = request.json
    topic = data.get('topic')
    question_type = data.get('questionType')
    num_questions = data.get('numQuestions', 5)
        
    # Validate topic format
    is_valid, error_message = validate_topic_format(topic)
    if not is_valid:
        return jsonify({'success': False, 'message': error_message}), 400
        
    try:
        # Updated to match case with frontend ("MCQ" instead of "mcq")
        if question_type == "MCQ":
            app.logger.info(f"Generating MCQs for topic: {topic}")
            questions = generate_mcq_from_topic(topic, retriever, model, num_questions)
            app.logger.info(f"Generated MCQs: {len(questions)}")
            
            if not questions:
                app.logger.error("No MCQ questions generated")
                return jsonify({'success': False, 'message': 'No questions could be generated. Please try a different topic.'}), 400
                        
            return jsonify({
                'success': True,
                'questions': questions,
                'modelAnswers': []
            })
        else:
            app.logger.info(f"Generating short answer questions for topic: {topic}")
            questions = generate_questions_from_topic2(topic, retriever, model, num_questions)
            app.logger.info(f"Generated questions: {len(questions)}")
            
            if not questions:
                app.logger.error("No short answer questions generated")
                return jsonify({'success': False, 'message': 'No questions could be generated. Please try a different topic.'}), 400
                        
            model_answers = get_all_answers(questions, rag_chain)
            app.logger.info(f"Generated model answers: {len(model_answers)}")
            
            if not model_answers:
                app.logger.error("Failed to generate model answers")
                return jsonify({'success': False, 'message': 'Failed to generate model answers. Please try again.'}), 400
                        
            return jsonify({
                'success': True,
                'questions': questions,
                'modelAnswers': model_answers
            })
    except Exception as e:
        app.logger.error(f"Error generating questions: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({'success': False, 'message': f'Error generating questions: {str(e)}'}), 500

@app.route('/api/evaluate-answer', methods=['POST', 'OPTIONS'])
@jwt_required()
def evaluate_answer_api():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204
        
    # Ensure we have JSON data
    if not request.is_json:
        return jsonify({'success': False, 'message': 'Request must contain JSON data'}), 400
    
    data = request.json
    question_type = data.get('questionType')
    question = data.get('question')
    answer = data.get('answer')
    model_answer = data.get('modelAnswer')
        
    try:
        # Updated to match case with frontend ("MCQ" instead of "mcq")
        if question_type == "MCQ":
            score, feedback = evaluate_mcq_answer(answer, question['correct_answer'])
        else:
            score, feedback = answer_evaluator.evaluate_answer(
                answer,
                model_answer,
                question
            )
                
        return jsonify({
            'success': True,
            'score': score,
            'feedback': feedback
        })
    except Exception as e:
        app.logger.error(f"Error evaluating answer: {traceback.format_exc()}")
        return jsonify({'success': False, 'message': f'Error evaluating answer: {str(e)}'}), 500

# New endpoints for flashcard generation
print("here1")
def process_pdf_to_flashcards(pdf_path):
    """
    Process a PDF file to generate flashcards using Ollama and LLama model.
    Returns a list of flashcards with title and content.
    """
    try:
        # Load the PDF using the same loader as in modules.py
        loader = PyMuPDFLoader(pdf_path)
        pages = loader.load()
        
        # Split the document into chunks as in modules.py
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = text_splitter.split_documents(pages)
        
        # Create a prompt template for generating flashcards
        flashcard_prompt = """
        You are an expert at creating concise and effective study flashcards.
        I will provide you with content from a textbook or educational material.
        Please extract 1-2 key concepts or facts from the provided content and create a flashcard for each.
        
        Each flashcard should:
        1. Focus on one clear concept or fact
        2. Be concise and to the point
        3. Include only essential information
        4. Be easy to understand
        
        Here is the content:
        {content}
        
        Create 1-2 flashcards in the following JSON format:
        [
            {{"title": "Brief concept name", "content": "Concise explanation of the concept"}}
        ]
        """
        print("here2")
        
        flashcard_generator = ChatPromptTemplate.from_template(flashcard_prompt)
        
        # Process each chunk to generate flashcards
        all_flashcards = []
        
        for chunk in chunks[:10]:  # Limit to first 10 chunks for performance reasons
            # Generate flashcards using the Ollama model
            content = chunk.page_content
            full_prompt = flashcard_generator.format(content=content)
            
            response = model.invoke(full_prompt)
            
            # Extract JSON from response
            import json
            import re
            
            # Find JSON content between square brackets
            json_match = re.search(r'\[(.*?)\]', response.content, re.DOTALL)
            if json_match:
                try:
                    # Parse the JSON content
                    cards_json = json.loads('[' + json_match.group(1) + ']')
                    all_flashcards.extend(cards_json)
                except json.JSONDecodeError:
                    # If JSON parsing fails, try to extract individual card objects
                    card_matches = re.findall(r'{.*?}', json_match.group(0), re.DOTALL)
                    for card_match in card_matches:
                        try:
                            card = json.loads(card_match)
                            if 'title' in card and 'content' in card:
                                all_flashcards.append(card)
                        except json.JSONDecodeError:
                            continue
                        
        
        # Deduplicate flashcards (remove cards with identical titles)
        unique_flashcards = []
        seen_titles = set()
        print("here3")
        for card in all_flashcards:
            if card['title'] not in seen_titles:
                seen_titles.add(card['title'])
                unique_flashcards.append(card)
        
        return unique_flashcards
    
    except Exception as e:
        app.logger.error(f"Error processing PDF to flashcards: {str(e)}")
        app.logger.error(traceback.format_exc())
        return []

@app.route('/api/generate-flashcards', methods=['POST', 'OPTIONS'])
@jwt_required()
def generate_flashcards_api():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        # Check if the post request has the file part
        if 'pdf' not in request.files:
            return jsonify({'success': False, 'message': 'No file part in the request'}), 400
        
        file = request.files['pdf']
        
        # If user does not select file, browser also submits an empty part without filename
        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'}), 400
        
        if file:
            # Check if it's a PDF
            if not file.filename.lower().endswith('.pdf'):
                return jsonify({'success': False, 'message': 'File must be a PDF'}), 400
            
            # Create a temporary file to store the uploaded PDF
            temp_dir = tempfile.mkdtemp()
            temp_path = os.path.join(temp_dir, file.filename)
            file.save(temp_path)
            
            # Generate a job ID for tracking
            job_id = str(uuid.uuid4())
            
            # Store job info
            flashcard_jobs[job_id] = {
                'status': 'processing',
                'file_path': temp_path,
                'user_id': get_jwt_identity(),
                'flashcards': []
            }
            
            # Start processing in a background thread
            import threading
            
            def process_job():
                try:
                    # Process the PDF to generate flashcards
                    cards = process_pdf_to_flashcards(temp_path)
                    
                    # Update job with results
                    if cards:
                        flashcard_jobs[job_id]['status'] = 'completed'
                        flashcard_jobs[job_id]['flashcards'] = cards
                    else:
                        flashcard_jobs[job_id]['status'] = 'failed'
                        flashcard_jobs[job_id]['message'] = 'Failed to generate flashcards'
                except Exception as e:
                    flashcard_jobs[job_id]['status'] = 'failed'
                    flashcard_jobs[job_id]['message'] = str(e)
                finally:
                    # Clean up temporary file after processing
                    try:
                        os.remove(temp_path)
                        os.rmdir(temp_dir)
                    except:
                        pass
            
            # Start processing in background
            processing_thread = threading.Thread(target=process_job)
            processing_thread.start()
            
            return jsonify({
                'success': True,
                'message': 'PDF uploaded and processing started',
                'jobId': job_id
            })
            
    except Exception as e:
        app.logger.error(f"Error in generate-flashcards API: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({'success': False, 'message': f'Error processing request: {str(e)}'}), 500

@app.route('/api/flashcard-status/<job_id>', methods=['GET'])
@jwt_required()
def flashcard_status_api(job_id):
    try:
        # Check if job exists
        if job_id not in flashcard_jobs:
            return jsonify({'success': False, 'message': 'Job not found'}), 404
        
        # Check if this job belongs to the current user
        user_id = get_jwt_identity()
        if flashcard_jobs[job_id]['user_id'] != user_id:
            return jsonify({'success': False, 'message': 'Unauthorized access to job'}), 403
        
        job_info = flashcard_jobs[job_id]
        
        # Return job status
        response = {
            'success': True,
            'status': job_info['status']
        }
        
        # Include additional info based on status
        if job_info['status'] == 'completed':
            response['flashcards'] = job_info['flashcards']
        elif job_info['status'] == 'failed':
            response['message'] = job_info.get('message', 'Unknown error')
        
        return jsonify(response)
        
    except Exception as e:
        app.logger.error(f"Error in flashcard-status API: {str(e)}")
        return jsonify({'success': False, 'message': f'Error checking job status: {str(e)}'}), 500

@app.route('/api/quiz-history', methods=['GET'])
@jwt_required()
def get_quiz_history():
    user_id = get_jwt_identity()
    quizzes = QuizHistory.query.filter_by(user_id=user_id).order_by(QuizHistory.date_taken.desc()).all()
    
    history = [quiz.to_dict() for quiz in quizzes]
    
    return jsonify({
        'success': True,
        'quizHistory': history
    })

@app.route('/api/save-quiz', methods=['POST'])
@jwt_required()
def save_quiz():
    if not request.is_json:
        return jsonify({'success': False, 'message': 'Request must contain JSON data'}), 400
    
    data = request.json
    user_id = get_jwt_identity()
    
    try:
        quiz_history = QuizHistory(
            user_id=user_id,
            topic=data.get('topic'),
            question_type=data.get('questionType'),
            score=data.get('score'),
            max_score=data.get('maxScore'),
            percentage=data.get('percentage')
        )
        
        db.session.add(quiz_history)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Quiz history saved successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error saving quiz history: {str(e)}'}), 500

# Add a simple health check route
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')