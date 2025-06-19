from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='citizen')  # citizen, lawyer, judge, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active
        }

class Case(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    case_number = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    case_type = db.Column(db.String(50), nullable=False)  # civil, criminal, family, probate
    status = db.Column(db.String(50), default='open')  # open, closed, pending, suspended
    plaintiff = db.Column(db.String(200), nullable=False)
    defendant = db.Column(db.String(200), nullable=False)
    judge_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    lawyer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    filing_date = db.Column(db.DateTime, default=datetime.utcnow)
    next_hearing = db.Column(db.DateTime)
    description = db.Column(db.Text)
    is_public = db.Column(db.Boolean, default=True)

    judge = db.relationship('User', foreign_keys=[judge_id], backref='cases_as_judge')
    lawyer = db.relationship('User', foreign_keys=[lawyer_id], backref='cases_as_lawyer')

    def __repr__(self):
        return f'<Case {self.case_number}>'

    def to_dict(self):
        return {
            'id': self.id,
            'case_number': self.case_number,
            'title': self.title,
            'case_type': self.case_type,
            'status': self.status,
            'plaintiff': self.plaintiff,
            'defendant': self.defendant,
            'judge': self.judge.username if self.judge else None,
            'lawyer': self.lawyer.username if self.lawyer else None,
            'filing_date': self.filing_date.isoformat() if self.filing_date else None,
            'next_hearing': self.next_hearing.isoformat() if self.next_hearing else None,
            'description': self.description,
            'is_public': self.is_public
        }

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('case.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    document_type = db.Column(db.String(50), nullable=False)  # petition, motion, order, judgment
    file_path = db.Column(db.String(500))
    uploaded_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_public = db.Column(db.Boolean, default=False)

    case = db.relationship('Case', backref='documents')
    uploader = db.relationship('User', backref='uploaded_documents')

    def __repr__(self):
        return f'<Document {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'case_id': self.case_id,
            'title': self.title,
            'document_type': self.document_type,
            'file_path': self.file_path,
            'uploaded_by': self.uploader.username if self.uploader else None,
            'upload_date': self.upload_date.isoformat() if self.upload_date else None,
            'is_public': self.is_public
        }

class Hearing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('case.id'), nullable=False)
    hearing_date = db.Column(db.DateTime, nullable=False)
    hearing_type = db.Column(db.String(50), nullable=False)  # preliminary, trial, sentencing
    courtroom = db.Column(db.String(50))
    judge_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    status = db.Column(db.String(50), default='scheduled')  # scheduled, completed, postponed, cancelled
    notes = db.Column(db.Text)

    case = db.relationship('Case', backref='hearings')
    judge = db.relationship('User', backref='hearings_as_judge')

    def __repr__(self):
        return f'<Hearing {self.case.case_number} - {self.hearing_date}>'

    def to_dict(self):
        return {
            'id': self.id,
            'case_id': self.case_id,
            'case_number': self.case.case_number if self.case else None,
            'hearing_date': self.hearing_date.isoformat() if self.hearing_date else None,
            'hearing_type': self.hearing_type,
            'courtroom': self.courtroom,
            'judge': self.judge.username if self.judge else None,
            'status': self.status,
            'notes': self.notes
        }

class Form(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # civil, criminal, family, probate
    description = db.Column(db.Text)
    file_path = db.Column(db.String(500))
    version = db.Column(db.String(20), default='1.0')
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<Form {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'description': self.description,
            'file_path': self.file_path,
            'version': self.version,
            'created_date': self.created_date.isoformat() if self.created_date else None,
            'updated_date': self.updated_date.isoformat() if self.updated_date else None,
            'is_active': self.is_active
        }

