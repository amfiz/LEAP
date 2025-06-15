from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import db, User
import re

auth = Blueprint('auth', __name__)

# Email validation regex
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Validate required fields
    if not all(key in data for key in ['username', 'email', 'password']):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    # Validate email format
    if not EMAIL_REGEX.match(data['email']):
        return jsonify({'success': False, 'message': 'Invalid email format'}), 400
    
    # Check if username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'success': False, 'message': 'Email already exists'}), 400
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email'],
        grade=data.get('grade'),
        phone_number=data.get('phone_number')
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    
    try:
        db.session.commit()
        return jsonify({'success': True, 'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error creating user: {str(e)}'}), 500

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Validate required fields
    if not all(key in data for key in ['username', 'password']):
        return jsonify({'success': False, 'message': 'Missing username or password'}), 400
    
    # Find user by username
    user = User.query.filter_by(username=data['username']).first()
    
    # Check if user exists and password is correct
    if user and user.check_password(data['password']):
        # Create access token with user ID as string
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'success': True,
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
    
    return jsonify({'success': False, 'message': 'Invalid username or password'}), 401

@auth.route('/user', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    # Convert user_id to integer if needed
    if isinstance(user_id, str):
        try:
            user_id = int(user_id)
        except ValueError:
            return jsonify({'success': False, 'message': 'Invalid user ID'}), 400
    
    user = User.query.get(user_id)
    
    if user:
        return jsonify({'success': True, 'user': user.to_dict()}), 200
    
    return jsonify({'success': False, 'message': 'User not found'}), 404