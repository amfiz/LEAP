#modules.py
from langchain_community.document_loaders import PyMuPDFLoader
import os
import traceback
import warnings
from langchain_text_splitters import RecursiveCharacterTextSplitter
import tiktoken
from langchain_ollama import OllamaEmbeddings
import faiss
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain import hub
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
import numpy as np
from typing import List
import concurrent.futures
from transformers import AutoTokenizer, AutoModel, pipeline
import torch
from sentence_transformers import SentenceTransformer
import spacy
import re
import random
import re
from typing import List, Dict, Tuple
from dotenv import load_dotenv

print("strated running")

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'
warnings.filterwarnings("ignore")

load_dotenv()



pdfs = []
for root, dirs, files in os.walk('books'):
    # print(root, dirs, files)
    for file in files:
        if file.endswith('.pdf'):
            pdfs.append(os.path.join(root, file))

docs = []
for pdf in pdfs:
    loader = PyMuPDFLoader(pdf)
    pages = loader.load()

    docs.extend(pages)

### Document Chunking

print("on document chunking")

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

chunks = text_splitter.split_documents(docs)



encoding = tiktoken.encoding_for_model("gpt-4o-mini")



print("on model configration")

# 1. Optimize embeddings with caching
embeddings = OllamaEmbeddings(
    model='nomic-embed-text', 
    base_url="http://localhost:11434",
   
)

# 2. Create and configure optimized FAISS index
dimension = 768  # Standard dimension for most embedding models
index = faiss.IndexFlatL2(dimension)
faiss.omp_set_num_threads(4)  # Utilize multiple CPU threads for FAISS

# 3. Create vector store with optimized configuration
vector_store = FAISS(
    embedding_function=embeddings,
    index=index,
    docstore=InMemoryDocstore(),
    index_to_docstore_id={},
)

# 4. Batch process documents for adding to vector store
def add_documents_in_batches(documents, batch_size=32):
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        vector_store.add_documents(documents=batch)

# Add documents using batching
add_documents_in_batches(chunks)

# 5. Optimize retriever configuration
retriever = vector_store.as_retriever(
    search_type="similarity",  # Faster than MMR
    search_kwargs={
        'k': 3,
        'fetch_k': 10,  # Reduced from 100 for faster retrieval
    }
)

# 6. Optimize prompt template
prompt = """
You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you cant answer the question
Answer in bullet points. Make sure your answer is relevant to the question and it is answered from the context only. And also make sure to keep the answer concise only answer in max 70 words.
Question: {question} 
Context: {context} 
Answer:
"""
prompt = ChatPromptTemplate.from_template(prompt)

# 7. Optimize document formatting
def format_docs(docs):
    return " ".join(doc.page_content for doc in docs)

# 8. Configure model with optimized settings
model = ChatOllama(
    model="llama3.2:1b",
    base_url="http://localhost:11434",
    num_thread=4,  # Utilize multiple CPU threads
    num_gpu=0,     # Explicitly set to CPU
    temperature=0.1,  # Lower temperature for faster responses
    num_ctx=1024,    # Reduced context window
)

# 9. Create optimized RAG chain
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

# Example usage with memory tracking
def get_answer(question):
    try:
        return rag_chain.invoke(question)
    except Exception as e:
        return f"Error processing question: {str(e)}"


#genrerate questions
print("on Question Generation")

def generate_questions_from_topic2(
    topic: str,
    retriever,
    model: ChatOllama,
    num_questions: int = 3
) -> List[str]:
    """
    Generate questions based on a topic that may include a section number
    
    Args:
        topic: The topic (may include section number like "2.1.2 PROGRAMMING LANGUAGES")
        retriever: The vector store retriever
        model: The LLM model to use
        num_questions: Number of questions to generate
    """
    try:
        print(f"Starting question generation for topic: {topic}")
        
        # Extract section number if present
        section_match = re.match(r'(\d+\.\d+\.\d+)\s+(.*)', topic)
        if section_match:
            section_number = section_match.group(1)
            clean_topic = section_match.group(2)
            print(f"Parsed section number: {section_number}, clean topic: {clean_topic}")
        else:
            section_number = None
            clean_topic = topic
            print(f"No section number found, using topic as is: {clean_topic}")
            
        # Retrieve relevant documents using both section number and topic
        search_query = f"{section_number} {clean_topic}" if section_number else clean_topic
        print(f"Searching with query: {search_query}")
        docs = retriever.get_relevant_documents(search_query)
        
        print(f"Retrieved {len(docs)} documents")
        if not docs:
            print(f"No context found for: {topic}")
            # Instead of returning empty list, try with a more general search
            print("Trying with broader search...")
            docs = retriever.get_relevant_documents(clean_topic)
            print(f"Broader search retrieved {len(docs)} documents")
            if not docs:
                # If still no results, create basic questions about the topic
                print("Still no context, generating general questions about the topic")
                generic_prompt = f"""
                Generate {num_questions} questions about {clean_topic}.
                These should be educational questions that test knowledge of key concepts.
                Each question should start with What, Why, How, etc. and end with a question mark.
                Format each question as a number followed by the question.
                """
                response = model.invoke(generic_prompt)
                response_text = response.content if hasattr(response, 'content') else str(response)
                
                # Extract questions from response
                questions = []
                for match in re.findall(r'\d+\.\s*([^\n]+)', response_text):
                    match = match.strip()
                    if match.endswith('?'):
                        questions.append(match)
                
                return questions[:num_questions] if questions else []
        
        # Extract relevant content
        relevant_content = []
        for doc in docs:
            content = doc.page_content
            if section_number and section_number in content:
                relevant_content.append(content)
            elif not section_number:
                relevant_content.append(content)
        
        if not relevant_content:
            print(f"No content found for section: {topic}")
            # Again, try with just the topic
            for doc in docs:
                content = doc.page_content
                if clean_topic.lower() in content.lower():
                    relevant_content.append(content)
        
        if not relevant_content:
            print("Still no relevant content found")
            return []
            
        context = " ".join(relevant_content)
        context_preview = context[:200] + "..." if len(context) > 200 else context
        print(f"Context preview: {context_preview}")
        
        # Create focused prompt
        question_prompt = f"""
        Generate {num_questions} specific questions about the following topic: {clean_topic}
        Use ONLY the provided context to generate questions.

        Context: {context}

        Requirements:
        1. Generate exactly {num_questions} questions
        2. Each question must be directly answerable from the provided context
        3. Questions must start with question words (What, Why, How, etc.)
        4. Questions must be specifically about {clean_topic}
        5. Format: Number each question (1., 2., etc.)
        6. Make questions clear and specific to the content

        Questions:"""
        
        # Generate questions
        print("Sending prompt to model...")
        response = model.invoke(question_prompt)
        response_text = response.content if hasattr(response, 'content') else str(response)
        response_preview = response_text[:200] + "..." if len(response_text) > 200 else response_text
        print(f"Model response preview: {response_preview}")
        
        # Extract and validate questions
        questions = []
        matches = re.findall(r'\d+\.\s*([^\n]+)', response_text)
        question_words = ['what', 'why', 'how', 'which', 'where', 'when', 'explain', 'describe']
        
        for match in matches:
            match = match.strip()
            # Only include if it's a proper question
            if any(match.lower().startswith(word) for word in question_words) and match.endswith('?'):
                questions.append(match)
        
        print(f"Extracted {len(questions)} valid questions")
        if not questions:
            print("No valid questions were generated, trying simpler approach...")
            generic_prompt = f"""
            Generate {num_questions} simple questions about {clean_topic}.
            Each question should start with What, Why, How, etc. and end with a question mark.
            """
            response = model.invoke(generic_prompt)
            response_text = response.content if hasattr(response, 'content') else str(response)
            
            for match in re.findall(r'\d+\.\s*([^\n]+)', response_text):
                match = match.strip()
                if match.endswith('?'):
                    questions.append(match)
            
            print(f"Simpler approach extracted {len(questions)} questions")
            
        return questions[:num_questions]
        
    except Exception as e:
        print(f"Error generating questions: {str(e)}")
        traceback.print_exc()  # Print full traceback
        return []
    
print("on Answer Evaluation")

class AnswerEvaluator:
    def __init__(self):
        self.qa_model = pipeline('question-answering', model='deepset/roberta-base-squad2')
        self.sentence_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        try:
            self.nlp = spacy.load('en_core_web_sm')
        except:
            spacy.cli.download('en_core_web_sm')
            self.nlp = spacy.load('en_core_web_sm')

    def is_list_question(self, question):
        """Detect if the question asks for multiple items"""
        question_lower = question.lower()
        # Check for numeric indicators
        numbers_written = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
        has_number = any(num in question_lower for num in numbers_written) or bool(re.search(r'\d+', question))

        # Check for list indicators
        list_indicators = ['what are', 'list', 'enumerate', 'name the', 'identify the']
        has_list_indicator = any(indicator in question_lower for indicator in list_indicators)

        return has_number and has_list_indicator

    def extract_required_items(self, text):
        """Extract items from a list-type answer"""
        # Convert text to lowercase for consistent matching
        text_lower = text.lower()

        # Remove common starter phrases
        starters = ['the', 'these', 'are', 'following', 'there', 'we', 'have']
        for starter in starters:
            text_lower = text_lower.replace(f"{starter} ", "")

        # Split by common delimiters
        items = re.split(r',|\band\b|;|\.|•', text_lower)

        # Clean up items
        cleaned_items = []
        for item in items:
            item = item.strip()
            if item:  # Skip empty strings
                # Remove ordinal numbers and bullet points
                item = re.sub(r'^\d+\.|^\(?\d+\)|^[-•*]', '', item).strip()
                if item:
                    cleaned_items.append(item)

        return cleaned_items

    def evaluate_list_answer(self, user_answer, model_answer, question):
        """Evaluate answers for list-type questions"""
        # Extract required items from model answer
        required_items = self.extract_required_items(model_answer)
        user_items = self.extract_required_items(user_answer)

        # Track matched and missing items
        matched_items = []
        missing_items = []

        # Check each required item
        for req_item in required_items:
            found = False
            for user_item in user_items:
                similarity = self.semantic_similarity(req_item, user_item)
                if similarity > 0.85:  # High threshold for matching
                    matched_items.append(req_item)
                    found = True
                    break
            if not found:
                missing_items.append(req_item)

        # Calculate score based on proportion of matched items
        total_required = len(required_items)
        matched_count = len(matched_items)

        # Score calculation with higher penalty for missing items
        base_score = (matched_count / total_required) * 10
        # Apply additional penalty for missing items
        penalty = len(missing_items) * (2 / total_required)  # Increased penalty
        final_score = max(0, base_score - penalty)

        # Generate feedback
        feedback = []
        if matched_items:
            feedback.append("✓ Correctly mentioned:")
            for item in matched_items:
                feedback.append(f"  - {item}")

        if missing_items:
            feedback.append("\n✗ Missing required items:")
            for item in missing_items:
                feedback.append(f"  - {item}")

        return round(final_score * 2) / 2, "\n".join(feedback)

    def evaluate_single_answer(self, user_answer, model_answer, question):
        """Evaluate non-list type answers (like the Mark 1 case)"""
        # Extract components from both answers
        qa_user = self.qa_model(question=question, context=user_answer)
        qa_model = self.qa_model(question=question, context=model_answer)

        main_answer_similarity = self.semantic_similarity(
            qa_user['answer'],
            qa_model['answer']
        )

        # If main answer is completely different, score should be very low
        if main_answer_similarity < 0.8:
            score = 2.0  # Very low score for wrong main answer
            feedback = [
                f"✗ Main answer is incorrect.",
                f"  Expected: {qa_model['answer']}",
                f"  Your answer: {qa_user['answer']}"
            ]
            return score, "\n".join(feedback)

        # If main answer is correct, give high score
        score = 10 * main_answer_similarity
        feedback = [f"✓ Correct answer: {qa_user['answer']}"]

        return round(score * 2) / 2, "\n".join(feedback)

    def semantic_similarity(self, text1, text2):
        """Calculate semantic similarity between two texts"""
        embeddings = self.sentence_model.encode([text1, text2])
        similarity = np.dot(embeddings[0], embeddings[1]) / (
            np.linalg.norm(embeddings[0]) * np.linalg.norm(embeddings[1])
        )
        return float(similarity)

    def evaluate_answer(self, user_answer, model_answer, question, max_score=10):
        """Main evaluation function"""
        if self.is_list_question(question):
            return self.evaluate_list_answer(user_answer, model_answer, question)
        else:
            return self.evaluate_single_answer(user_answer, model_answer, question)

def get_all_answers(questions, rag_chain):
    qa_pairs = []  # List to store question-answer pairs
    
    for question in questions:
        answer = get_answer(question)  # Get the answer using the get_answer function
        qa_pairs.append((question, answer))  # Append the question-answer pair to the list
    
    return qa_pairs


print("on Mcq Generation")

def parse_mcqs(response_text: str) -> List[Dict]:
    """Helper function to parse MCQs from response text"""
    mcqs = []
    question_blocks = re.split(r'Question \d+:', response_text)[1:]  # Skip empty first split
    
    for block in question_blocks:
        if not block.strip():
            continue
            
        lines = block.strip().split('\n')
        current_mcq = {
            'question': lines[0].strip(),
            'options': {'A': '', 'B': '', 'C': '', 'D': ''}  # Initialize with empty options
        }
        
        for line in lines[1:]:
            line = line.strip()
            if not line:
                continue
                
            # Match options A) B) C) D)
            option_match = re.match(r'([A-D])\)(.*)', line)
            if option_match:
                option_letter = option_match.group(1)
                option_text = option_match.group(2).strip()
                current_mcq['options'][option_letter] = option_text
                
            # Match correct answer
            correct_match = re.match(r'Correct:\s*([A-D])', line)
            if correct_match:
                current_mcq['correct_answer'] = correct_match.group(1)
        
        # Only add MCQs with a question and a correct answer
        if current_mcq['question'] and 'correct_answer' in current_mcq:
            # Ensure all options have some value (even if empty)
            if not all(option in current_mcq['options'] for option in ['A', 'B', 'C', 'D']):
                for option in ['A', 'B', 'C', 'D']:
                    if option not in current_mcq['options']:
                        current_mcq['options'][option] = f"Option {option}"
            
            mcqs.append(current_mcq)
    
    return mcqs

def generate_mcq_from_topic(
    topic: str,
    retriever,
    model: ChatOllama,
    num_questions: int = 5
) -> List[Dict]:
    """
    Generate MCQs based on a topic that may include a section number.
    If not enough context-based questions can be generated, creates additional
    topic-based questions to reach the desired number.
    
    Returns list of dicts containing:
    - question: str
    - options: Dict[str, str] (A, B, C, D as keys)
    - correct_answer: str (A, B, C, or D)
    """
    try:
        # Extract section number if present
        section_match = re.match(r'(\d+\.\d+\.\d+)\s+(.*)', topic)
        if section_match:
            section_number = section_match.group(1)
            clean_topic = section_match.group(2)
        else:
            section_number = None
            clean_topic = topic
            
        # Retrieve relevant documents
        search_query = f"{section_number} {clean_topic}" if section_number else clean_topic
        docs = retriever.get_relevant_documents(search_query)
        
        # Extract relevant content with improved matching
        relevant_content = []
        if docs:
            for doc in docs:
                content = doc.page_content
                if section_number:
                    section_pattern = rf"{section_number}\s+{re.escape(clean_topic)}"
                    section_start = re.search(section_pattern, content, re.IGNORECASE)
                    
                    if section_start:
                        start_idx = section_start.start()
                        next_section = re.search(r'\d+\.\d+\.\d+\s+[A-Z\s]+', content[start_idx + 1:])
                        if next_section:
                            end_idx = start_idx + next_section.start()
                            relevant_content.append(content[start_idx:end_idx])
                        else:
                            relevant_content.append(content[start_idx:])
                else:
                    # If no section number, check if content is relevant to topic
                    if any(word.lower() in content.lower() for word in clean_topic.split()):
                        relevant_content.append(content)
        
        context = " ".join(relevant_content) if relevant_content else ""
        
        # First try to generate context-based MCQs
        context_questions = []
        if context:
            context_prompt = f"""
            Generate multiple choice questions about: {clean_topic}
            Use the provided context to generate questions.

            Context: {context}

            Requirements:
            1. Generate EXACTLY {num_questions} MCQs
            2. Questions MUST be based on the context
            3. If context is limited, create questions about fundamental concepts mentioned in the context
            4. Each MCQ must follow this EXACT format:
            
            Question 1: [Question text]
            A) [Option A]
            B) [Option B]
            C) [Option C]
            D) [Option D]
            Correct: [A/B/C/D]

            Important: Generate all {num_questions} questions even if context is limited.
            Generate the MCQs now:"""
            
            response = model.invoke(context_prompt)
            context_questions = parse_mcqs(response.content if hasattr(response, 'content') else str(response))
        
        # If not enough context questions or no context available, generate topic-based ones
        remaining_questions = num_questions - len(context_questions)
        topic_questions = []
        
        if remaining_questions > 0:
            # Modified prompt to ensure relevant questions
            topic_prompt = f"""
            Generate {remaining_questions} multiple choice questions about: {clean_topic}

            Requirements:
            1. Generate EXACTLY {remaining_questions} MCQs
            2. Questions MUST be directly related to {clean_topic}
            3. Focus on fundamental concepts and core principles of {clean_topic}
            4. Include some basic definition or concept-based questions
            5. Each MCQ must follow this EXACT format:
            
            Question 1: [Question text]
            A) [Option A]
            B) [Option B]
            C) [Option C]
            D) [Option D]
            Correct: [A/B/C/D]

            Important: Questions must be accurate and relevant to the topic.
            Generate the MCQs now:"""
            
            response = model.invoke(topic_prompt)
            topic_questions = parse_mcqs(response.content if hasattr(response, 'content') else str(response))
            
            # If still don't have enough questions, try one more time with simpler questions
            if len(context_questions) + len(topic_questions) < num_questions:
                basic_prompt = f"""
                Generate {num_questions - len(context_questions) - len(topic_questions)} basic multiple choice questions about {clean_topic}.
                Focus on fundamental definitions and concepts.
                Follow the exact same format as before.
                These questions MUST be generated to complete the set."""
                
                response = model.invoke(basic_prompt)
                basic_questions = parse_mcqs(response.content if hasattr(response, 'content') else str(response))
                topic_questions.extend(basic_questions)
        
        # Combine questions and ensure we have exactly num_questions
        all_questions = context_questions + topic_questions
        
        # Create default questions if needed
        while len(all_questions) < num_questions:
            default_question = {
                'question': f"What is the primary focus of {clean_topic}?",
                'options': {
                    'A': f"Understanding {clean_topic} fundamentals",
                    'B': f"Exploring advanced {clean_topic} concepts",
                    'C': f"Analyzing {clean_topic} applications",
                    'D': f"Comparing {clean_topic} with other topics"
                },
                'correct_answer': 'A'
            }
            all_questions.append(default_question)
            
        # Ensure all questions have the correct format expected by the frontend
        formatted_questions = []
        for q in all_questions[:num_questions]:
            # Ensure the question has all required fields
            if 'question' in q and 'options' in q and 'correct_answer' in q:
                # Ensure options has exactly the keys A, B, C, D
                if set(q['options'].keys()) == {'A', 'B', 'C', 'D'}:
                    formatted_questions.append(q)
                else:
                    # Fix incomplete options
                    complete_options = {'A': '', 'B': '', 'C': '', 'D': ''}
                    for key, value in q['options'].items():
                        if key in complete_options:
                            complete_options[key] = value
                    
                    # Create new question with complete options
                    q['options'] = complete_options
                    formatted_questions.append(q)
            
        # Make sure we're returning exactly num_questions
        return formatted_questions[:num_questions]
        
    except Exception as e:
        print(f"Error generating MCQs: {str(e)}")
        # Return a list of default questions instead of empty list
        default_questions = []
        for i in range(num_questions):
            default_questions.append({
                'question': f"Question about {clean_topic} (#{i+1})",
                'options': {
                    'A': f"Option A for question {i+1}",
                    'B': f"Option B for question {i+1}",
                    'C': f"Option C for question {i+1}",
                    'D': f"Option D for question {i+1}"
                },
                'correct_answer': 'A'
            })
        return default_questions

def evaluate_mcq_answer(user_answer: str, correct_answer: str) -> Tuple[int, str]:
    """Evaluate MCQ answer and return score and feedback"""
    user_answer = user_answer.strip().upper()
    if user_answer == correct_answer:
        return 10, "Correct! Well done!"
    return 0, f"Incorrect. The correct answer was {correct_answer}."

print("done")