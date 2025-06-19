from flask import Blueprint, request, jsonify
from src.models.user import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'success': False, 'error': 'Token em falta'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, 'asdf#FGSgvasgf$5$WGT', algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            
            if not current_user or not current_user.is_active:
                return jsonify({'success': False, 'error': 'Token inválido'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'error': 'Token inválido'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """Registar novo utilizador"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('username', 'email', 'password')):
            return jsonify({
                'success': False,
                'error': 'Dados em falta (username, email, password)'
            }), 400
        
        # Verificar se o utilizador já existe
        if User.query.filter_by(username=data['username']).first():
            return jsonify({
                'success': False,
                'error': 'Nome de utilizador já existe'
            }), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({
                'success': False,
                'error': 'Email já registado'
            }), 400
        
        # Criar novo utilizador
        password_hash = generate_password_hash(data['password'])
        
        new_user = User(
            username=data['username'],
            email=data['email'],
            password_hash=password_hash,
            role=data.get('role', 'citizen')
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Utilizador registado com sucesso',
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Autenticar utilizador"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('username', 'password')):
            return jsonify({
                'success': False,
                'error': 'Dados em falta (username, password)'
            }), 400
        
        # Verificar utilizador
        user = User.query.filter_by(username=data['username']).first()
        
        if not user or not user.is_active:
            return jsonify({
                'success': False,
                'error': 'Utilizador não encontrado ou inativo'
            }), 401
        
        if not check_password_hash(user.password_hash, data['password']):
            return jsonify({
                'success': False,
                'error': 'Password incorreta'
            }), 401
        
        # Gerar token JWT
        token = jwt.encode({
            'user_id': user.id,
            'username': user.username,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, 'asdf#FGSgvasgf$5$WGT', algorithm='HS256')
        
        return jsonify({
            'success': True,
            'message': 'Login efetuado com sucesso',
            'token': token,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@auth_bp.route('/auth/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """Obter perfil do utilizador autenticado"""
    return jsonify({
        'success': True,
        'user': current_user.to_dict()
    })

@auth_bp.route('/auth/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Atualizar perfil do utilizador"""
    try:
        data = request.get_json()
        
        if 'email' in data:
            # Verificar se o email já existe (exceto o próprio utilizador)
            existing_user = User.query.filter(
                User.email == data['email'],
                User.id != current_user.id
            ).first()
            
            if existing_user:
                return jsonify({
                    'success': False,
                    'error': 'Email já registado por outro utilizador'
                }), 400
            
            current_user.email = data['email']
        
        if 'password' in data and data['password']:
            current_user.password_hash = generate_password_hash(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Perfil atualizado com sucesso',
            'user': current_user.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

