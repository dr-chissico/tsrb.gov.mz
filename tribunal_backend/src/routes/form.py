from flask import Blueprint, request, jsonify, send_file
from src.models.user import db, Form
import os

form_bp = Blueprint('form', __name__)

@form_bp.route('/forms', methods=['GET'])
def get_forms():
    """Obter lista de formulários disponíveis"""
    try:
        category = request.args.get('category', '').strip()
        search = request.args.get('search', '').strip()
        
        # Construir query
        query = Form.query.filter(Form.is_active == True)
        
        if category:
            query = query.filter(Form.category == category)
        
        if search:
            query = query.filter(Form.title.ilike(f'%{search}%'))
        
        # Ordenar por categoria e título
        query = query.order_by(Form.category.asc(), Form.title.asc())
        
        forms = query.all()
        
        # Agrupar por categoria
        forms_by_category = {}
        for form in forms:
            if form.category not in forms_by_category:
                forms_by_category[form.category] = []
            forms_by_category[form.category].append(form.to_dict())
        
        return jsonify({
            'success': True,
            'forms': forms_by_category,
            'total': len(forms)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@form_bp.route('/forms/categories', methods=['GET'])
def get_form_categories():
    """Obter categorias de formulários disponíveis"""
    categories = [
        {'value': 'civil', 'label': 'Formulários Cíveis', 'description': 'Formulários para processos cíveis'},
        {'value': 'criminal', 'label': 'Formulários Criminais', 'description': 'Formulários para processos criminais'},
        {'value': 'family', 'label': 'Formulários de Família', 'description': 'Formulários para processos de família'},
        {'value': 'probate', 'label': 'Formulários de Sucessões', 'description': 'Formulários para processos de sucessões'}
    ]
    
    return jsonify({
        'success': True,
        'categories': categories
    })

@form_bp.route('/forms/<int:form_id>', methods=['GET'])
def get_form_details(form_id):
    """Obter detalhes de um formulário específico"""
    try:
        form = Form.query.get_or_404(form_id)
        
        if not form.is_active:
            return jsonify({
                'success': False,
                'error': 'Formulário não disponível'
            }), 404
        
        return jsonify({
            'success': True,
            'form': form.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@form_bp.route('/forms/<int:form_id>/download', methods=['GET'])
def download_form(form_id):
    """Fazer download de um formulário"""
    try:
        form = Form.query.get_or_404(form_id)
        
        if not form.is_active:
            return jsonify({
                'success': False,
                'error': 'Formulário não disponível'
            }), 404
        
        if not form.file_path or not os.path.exists(form.file_path):
            return jsonify({
                'success': False,
                'error': 'Ficheiro do formulário não encontrado'
            }), 404
        
        return send_file(
            form.file_path,
            as_attachment=True,
            download_name=f"{form.title}.pdf"
        )
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

