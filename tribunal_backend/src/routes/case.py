from flask import Blueprint, request, jsonify
from src.models.user import db, Case, User, Hearing
from datetime import datetime
from sqlalchemy import or_, and_

case_bp = Blueprint('case', __name__)

@case_bp.route('/cases/search', methods=['GET'])
def search_cases():
    """Pesquisar processos com vários critérios"""
    try:
        # Parâmetros de pesquisa
        case_number = request.args.get('case_number', '').strip()
        party_name = request.args.get('party_name', '').strip()
        case_type = request.args.get('case_type', '').strip()
        status = request.args.get('status', '').strip()
        date_from = request.args.get('date_from', '').strip()
        date_to = request.args.get('date_to', '').strip()
        
        # Paginação
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Construir query
        query = Case.query.filter(Case.is_public == True)
        
        if case_number:
            query = query.filter(Case.case_number.ilike(f'%{case_number}%'))
        
        if party_name:
            query = query.filter(
                or_(
                    Case.plaintiff.ilike(f'%{party_name}%'),
                    Case.defendant.ilike(f'%{party_name}%')
                )
            )
        
        if case_type:
            query = query.filter(Case.case_type == case_type)
        
        if status:
            query = query.filter(Case.status == status)
        
        if date_from:
            date_from_obj = datetime.fromisoformat(date_from)
            query = query.filter(Case.filing_date >= date_from_obj)
        
        if date_to:
            date_to_obj = datetime.fromisoformat(date_to)
            query = query.filter(Case.filing_date <= date_to_obj)
        
        # Ordenar por data de registo (mais recentes primeiro)
        query = query.order_by(Case.filing_date.desc())
        
        # Paginação
        paginated_cases = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'cases': [case.to_dict() for case in paginated_cases.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated_cases.total,
                'pages': paginated_cases.pages,
                'has_next': paginated_cases.has_next,
                'has_prev': paginated_cases.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@case_bp.route('/cases/<int:case_id>', methods=['GET'])
def get_case_details(case_id):
    """Obter detalhes de um processo específico"""
    try:
        case = Case.query.get_or_404(case_id)
        
        if not case.is_public:
            return jsonify({
                'success': False,
                'error': 'Acesso negado a este processo'
            }), 403
        
        return jsonify({
            'success': True,
            'case': case.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@case_bp.route('/cases/types', methods=['GET'])
def get_case_types():
    """Obter tipos de processo disponíveis"""
    case_types = [
        {'value': 'civil', 'label': 'Civil'},
        {'value': 'criminal', 'label': 'Criminal'},
        {'value': 'family', 'label': 'Família'},
        {'value': 'probate', 'label': 'Sucessões'}
    ]
    
    return jsonify({
        'success': True,
        'case_types': case_types
    })

@case_bp.route('/cases/statuses', methods=['GET'])
def get_case_statuses():
    """Obter estados de processo disponíveis"""
    statuses = [
        {'value': 'open', 'label': 'Aberto'},
        {'value': 'pending', 'label': 'Pendente'},
        {'value': 'closed', 'label': 'Encerrado'},
        {'value': 'suspended', 'label': 'Suspenso'}
    ]
    
    return jsonify({
        'success': True,
        'statuses': statuses
    })

@case_bp.route('/hearings', methods=['GET'])
def get_hearings():
    """Obter audiências agendadas"""
    try:
        # Parâmetros de filtro
        date_from = request.args.get('date_from', '').strip()
        date_to = request.args.get('date_to', '').strip()
        courtroom = request.args.get('courtroom', '').strip()
        
        # Construir query
        query = Hearing.query.join(Case).filter(Case.is_public == True)
        
        if date_from:
            date_from_obj = datetime.fromisoformat(date_from)
            query = query.filter(Hearing.hearing_date >= date_from_obj)
        
        if date_to:
            date_to_obj = datetime.fromisoformat(date_to)
            query = query.filter(Hearing.hearing_date <= date_to_obj)
        
        if courtroom:
            query = query.filter(Hearing.courtroom.ilike(f'%{courtroom}%'))
        
        # Ordenar por data da audiência
        query = query.order_by(Hearing.hearing_date.asc())
        
        hearings = query.all()
        
        return jsonify({
            'success': True,
            'hearings': [hearing.to_dict() for hearing in hearings]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

