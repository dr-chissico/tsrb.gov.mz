from flask import Flask
from src.models.user import db, User, Case, Form, Hearing, Document
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import os
import sys

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

def create_sample_data():
    """Criar dados de exemplo para demonstração"""
    
    # Criar utilizadores de exemplo
    admin_user = User(
        username='admin',
        email='admin@tribunal.pt',
        password_hash=generate_password_hash('admin123'),
        role='admin'
    )
    
    judge_user = User(
        username='juiz_silva',
        email='juiz.silva@tribunal.pt',
        password_hash=generate_password_hash('judge123'),
        role='judge'
    )
    
    lawyer_user = User(
        username='advogado_santos',
        email='advogado.santos@tribunal.pt',
        password_hash=generate_password_hash('lawyer123'),
        role='lawyer'
    )
    
    citizen_user = User(
        username='cidadao_costa',
        email='cidadao.costa@email.pt',
        password_hash=generate_password_hash('citizen123'),
        role='citizen'
    )
    
    db.session.add_all([admin_user, judge_user, lawyer_user, citizen_user])
    db.session.commit()
    
    # Criar processos de exemplo
    cases = [
        Case(
            case_number='2024/CV/001',
            title='Silva vs. Santos - Ação de Cobrança',
            case_type='civil',
            status='open',
            plaintiff='João Silva',
            defendant='Maria Santos',
            judge_id=judge_user.id,
            lawyer_id=lawyer_user.id,
            filing_date=datetime.now() - timedelta(days=30),
            next_hearing=datetime.now() + timedelta(days=15),
            description='Ação de cobrança de dívida no valor de €5.000',
            is_public=True
        ),
        Case(
            case_number='2024/CR/002',
            title='Ministério Público vs. António Costa',
            case_type='criminal',
            status='pending',
            plaintiff='Ministério Público',
            defendant='António Costa',
            judge_id=judge_user.id,
            filing_date=datetime.now() - timedelta(days=45),
            next_hearing=datetime.now() + timedelta(days=7),
            description='Processo crime por condução sob influência de álcool',
            is_public=True
        ),
        Case(
            case_number='2024/FM/003',
            title='Divórcio - Ana e Pedro Oliveira',
            case_type='family',
            status='open',
            plaintiff='Ana Oliveira',
            defendant='Pedro Oliveira',
            judge_id=judge_user.id,
            lawyer_id=lawyer_user.id,
            filing_date=datetime.now() - timedelta(days=60),
            next_hearing=datetime.now() + timedelta(days=20),
            description='Processo de divórcio litigioso com regulação do poder paternal',
            is_public=False
        ),
        Case(
            case_number='2024/PR/004',
            title='Sucessão de Manuel Ferreira',
            case_type='probate',
            status='closed',
            plaintiff='Herdeiros de Manuel Ferreira',
            defendant='N/A',
            judge_id=judge_user.id,
            filing_date=datetime.now() - timedelta(days=120),
            description='Processo de inventário e partilha de bens',
            is_public=True
        )
    ]
    
    db.session.add_all(cases)
    db.session.commit()
    
    # Criar audiências de exemplo
    hearings = [
        Hearing(
            case_id=cases[0].id,
            hearing_date=datetime.now() + timedelta(days=15, hours=10),
            hearing_type='preliminary',
            courtroom='Sala 1',
            judge_id=judge_user.id,
            status='scheduled',
            notes='Audiência preliminar para tentativa de conciliação'
        ),
        Hearing(
            case_id=cases[1].id,
            hearing_date=datetime.now() + timedelta(days=7, hours=14),
            hearing_type='trial',
            courtroom='Sala 2',
            judge_id=judge_user.id,
            status='scheduled',
            notes='Julgamento - inquirição de testemunhas'
        ),
        Hearing(
            case_id=cases[2].id,
            hearing_date=datetime.now() + timedelta(days=20, hours=9),
            hearing_type='preliminary',
            courtroom='Sala 3',
            judge_id=judge_user.id,
            status='scheduled',
            notes='Conferência de pais para regulação do poder paternal'
        )
    ]
    
    db.session.add_all(hearings)
    db.session.commit()
    
    # Criar formulários de exemplo
    forms = [
        Form(
            title='Petição Inicial - Ação Declarativa',
            category='civil',
            description='Formulário para iniciar uma ação declarativa cível',
            file_path='/forms/civil/peticao_inicial_declarativa.pdf',
            version='2.1'
        ),
        Form(
            title='Requerimento de Injunção',
            category='civil',
            description='Formulário para procedimento de injunção',
            file_path='/forms/civil/requerimento_injuncao.pdf',
            version='1.5'
        ),
        Form(
            title='Queixa Crime',
            category='criminal',
            description='Formulário para apresentação de queixa crime',
            file_path='/forms/criminal/queixa_crime.pdf',
            version='3.0'
        ),
        Form(
            title='Requerimento de Divórcio',
            category='family',
            description='Formulário para requerimento de divórcio por mútuo consentimento',
            file_path='/forms/family/requerimento_divorcio.pdf',
            version='2.3'
        ),
        Form(
            title='Requerimento de Regulação do Poder Paternal',
            category='family',
            description='Formulário para regulação do exercício do poder paternal',
            file_path='/forms/family/regulacao_poder_paternal.pdf',
            version='1.8'
        ),
        Form(
            title='Requerimento de Inventário',
            category='probate',
            description='Formulário para abertura de processo de inventário',
            file_path='/forms/probate/requerimento_inventario.pdf',
            version='2.0'
        )
    ]
    
    db.session.add_all(forms)
    db.session.commit()
    
    print("Dados de exemplo criados com sucesso!")
    print("\nUtilizadores criados:")
    print("- admin / admin123 (Administrador)")
    print("- juiz_silva / judge123 (Juiz)")
    print("- advogado_santos / lawyer123 (Advogado)")
    print("- cidadao_costa / citizen123 (Cidadão)")
    print(f"\nProcessos criados: {len(cases)}")
    print(f"Audiências criadas: {len(hearings)}")
    print(f"Formulários criados: {len(forms)}")

if __name__ == '__main__':
    from src.main import app
    
    with app.app_context():
        # Limpar dados existentes (opcional)
        db.drop_all()
        db.create_all()
        
        # Criar dados de exemplo
        create_sample_data()

