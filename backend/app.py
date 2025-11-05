from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_session import Session
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['SESSION_TYPE'] = 'filesystem'  # Store sessions on server filesystem
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # For localhost HTTP
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://postgres:1234@localhost:5433/hh"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
Session(app)  # Initialize Flask-Session
CORS(app, supports_credentials=True, origins=["http://localhost:3000", "https://job-portal-blond-six.vercel.app"])  # Enable credentials for session cookies

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    experience = db.Column(db.String(200))
    skills = db.Column(db.JSON)
    # Professional Information
    degree = db.Column(db.String(100))
    university = db.Column(db.String(100))
    percentage = db.Column(db.String(10))
    passout_year = db.Column(db.String(4))
    backlog = db.Column(db.String(10))
    # 12th Details
    twelfth_school = db.Column(db.String(100))
    twelfth_percentage = db.Column(db.String(10))
    twelfth_passout_year = db.Column(db.String(4))
    # 10th Details
    tenth_school = db.Column(db.String(100))
    tenth_percentage = db.Column(db.String(10))
    tenth_passout_year = db.Column(db.String(4))
    # Professional Details
    internship = db.Column(db.Text)
    experience_details = db.Column(db.Text)
    project_description = db.Column(db.Text)
    project_link = db.Column(db.String(500))
    linkedin_link = db.Column(db.String(500))
    github_link = db.Column(db.String(500))
    resume_path = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100))
    salary = db.Column(db.String(50))
    description = db.Column(db.Text)
    requirements = db.Column(db.Text)
    benefits = db.Column(db.Text)
    poster_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    applicants = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('job.id'), nullable=False)
    status = db.Column(db.String(20), default='Applied')  # Applied, Accepted, Rejected
    applied_date = db.Column(db.DateTime, default=datetime.utcnow)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)  # 'application', 'job_update', etc.
    message = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('job.id'))
    applicant_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # For application notifications
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('name') or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Name, email, and password are required'}), 400

        # Check if email already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'message': 'Email already registered'}), 400

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        user = User(
            name=data['name'],
            email=data['email'],
            password=hashed_password,
            role=data.get('role', 'user')
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()

        if user and bcrypt.check_password_hash(user.password, data['password']):
            # Create JWT token and store user info in session
            access_token = create_access_token(identity=user.id)
            session['user_id'] = user.id
            session['user_name'] = user.name
            session['user_email'] = user.email
            session['user_role'] = user.role

            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'role': user.role
                }
            }), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'message': 'Login failed', 'error': str(e)}), 400

@app.route('/api/auth/check', methods=['GET'])
def check_login():
    try:
        if 'user_id' in session:
            user = User.query.get(session['user_id'])
            if user:
                return jsonify({
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'role': user.role
                }), 200
        return jsonify({'message': 'Not logged in'}), 401
    except Exception as e:
        return jsonify({'message': 'Check login failed', 'error': str(e)}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({'message': 'Logged out successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Logout failed', 'error': str(e)}), 500

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        jobs = Job.query.all()
        return jsonify([{
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'location': job.location,
            'salary': job.salary,
            'description': job.description,
            'requirements': job.requirements,
            'benefits': job.benefits,
            'applicants': job.applicants
        } for job in jobs]), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch jobs', 'error': str(e)}), 500

@app.route('/api/admin/jobs', methods=['GET'])
def get_admin_jobs():
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])
        if user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        # Get only jobs posted by this admin
        jobs = Job.query.filter_by(poster_id=user.id).all()
        return jsonify([{
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'location': job.location,
            'salary': job.salary,
            'description': job.description,
            'requirements': job.requirements,
            'benefits': job.benefits,
            'applicants': job.applicants
        } for job in jobs]), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch admin jobs', 'error': str(e)}), 500

@app.route('/api/jobs', methods=['POST'])
def create_job():
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])
        if user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        data = request.get_json()
        job = Job(
            title=data['title'],
            company=data['company'],
            location=data.get('location'),
            salary=data.get('salary'),
            description=data.get('description'),
            requirements=data.get('requirements'),
            benefits=data.get('benefits'),
            poster_id=session['user_id']
        )

        db.session.add(job)
        db.session.commit()

        return jsonify({'message': 'Job created successfully', 'job_id': job.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create job', 'error': str(e)}), 400

@app.route('/api/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    try:
        job = Job.query.get_or_404(job_id)
        return jsonify({
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'location': job.location,
            'salary': job.salary,
            'description': job.description,
            'requirements': job.requirements,
            'benefits': job.benefits,
            'applicants': job.applicants
        }), 200
    except Exception as e:
        return jsonify({'message': 'Job not found', 'error': str(e)}), 404

@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])
        if user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        job = Job.query.get_or_404(job_id)

        # Delete associated applications and notifications
        Application.query.filter_by(job_id=job_id).delete()
        Notification.query.filter_by(job_id=job_id).delete()

        # Delete the job
        db.session.delete(job)
        db.session.commit()

        return jsonify({'message': 'Job deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete job', 'error': str(e)}), 400

@app.route('/api/jobs/<int:job_id>/apply', methods=['POST'])
def apply_for_job(job_id):
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])

        # Check if already applied
        existing_application = Application.query.filter_by(user_id=user.id, job_id=job_id).first()
        if existing_application:
            return jsonify({'message': 'Already applied for this job'}), 400

        # Create application
        application = Application(user_id=user.id, job_id=job_id)
        db.session.add(application)

        # Update job applicants count
        job = Job.query.get(job_id)
        job.applicants += 1

        # Create notification for the job poster (admin who posted the job)
        poster = User.query.get(job.poster_id)
        if poster and poster.role == 'admin':
            notification = Notification(
                type='application',
                message=f'User {user.name} applied for {job.title} at {job.company}',
                user_id=poster.id,
                job_id=job_id,
                applicant_id=user.id
            )
            db.session.add(notification)

        db.session.commit()

        return jsonify({'message': 'Application submitted successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Application failed', 'error': str(e)}), 400

@app.route('/api/applications', methods=['GET'])
def get_applications():
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])

        applications = Application.query.filter_by(user_id=user.id).all()
        result = []

        for app in applications:
            job = Job.query.get(app.job_id)
            result.append({
                'id': app.id,
                'job_id': app.job_id,
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'salary': job.salary,
                'status': app.status,
                'applied_date': app.applied_date.isoformat()
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch applications', 'error': str(e)}), 500

@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])

        # Get or create profile for the user
        profile = Profile.query.filter_by(user_id=user.id).first()
        if not profile:
            profile = Profile(user_id=user.id)
            db.session.add(profile)
            db.session.commit()

        return jsonify({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': profile.phone,
            'location': profile.location,
            'experience': profile.experience,
            'skills': profile.skills or [],
            # Professional Information
            'degree': profile.degree,
            'university': profile.university,
            'percentage': profile.percentage,
            'passout_year': profile.passout_year,
            'backlog': profile.backlog,
            # 12th Details
            'twelfth_school': profile.twelfth_school,
            'twelfth_percentage': profile.twelfth_percentage,
            'twelfth_passout_year': profile.twelfth_passout_year,
            # 10th Details
            'tenth_school': profile.tenth_school,
            'tenth_percentage': profile.tenth_percentage,
            'tenth_passout_year': profile.tenth_passout_year,
            # Professional Details
            'internship': profile.internship,
            'experience_details': profile.experience_details,
            'project_description': profile.project_description,
            'project_link': profile.project_link,
            'linkedin_link': profile.linkedin_link,
            'github_link': profile.github_link,
            'resume_path': profile.resume_path
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch profile', 'error': str(e)}), 500

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    try:
        print("Starting profile update")
        # Check if user is logged in via session
        if 'user_id' not in session:
            print("No user_id in session")
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])
        if not user:
            print("User not found")
            return jsonify({'message': 'User not found'}), 404

        data = request.get_json()
        print(f"Received data: {data}")

        # Update user table fields
        user.name = data.get('name', user.name)
        print(f"Updated name to: {user.name}")

        # Update email if provided and different
        if 'email' in data and data['email'] != user.email:
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user:
                print("Email already in use")
                return jsonify({'message': 'Email already in use'}), 400
            user.email = data['email']
            session['user_email'] = user.email  # Update session
            print(f"Updated email to: {user.email}")

        # Get or create profile for the user
        profile = Profile.query.filter_by(user_id=user.id).first()
        if not profile:
            profile = Profile(user_id=user.id)
            db.session.add(profile)
            print("Created new profile")

        # Update profile fields
        profile.phone = data.get('phone', profile.phone)
        profile.location = data.get('location', profile.location)
        profile.experience = data.get('experience', profile.experience)
        profile.skills = data.get('skills', profile.skills)
        # Professional Information
        profile.degree = data.get('degree', profile.degree)
        profile.university = data.get('university', profile.university)
        profile.percentage = data.get('percentage', profile.percentage)
        profile.passout_year = data.get('passout_year', profile.passout_year)
        profile.backlog = data.get('backlog', profile.backlog)
        # 12th Details
        profile.twelfth_school = data.get('twelfth_school', profile.twelfth_school)
        profile.twelfth_percentage = data.get('twelfth_percentage', profile.twelfth_percentage)
        profile.twelfth_passout_year = data.get('twelfth_passout_year', profile.twelfth_passout_year)
        # 10th Details
        profile.tenth_school = data.get('tenth_school', profile.tenth_school)
        profile.tenth_percentage = data.get('tenth_percentage', profile.tenth_percentage)
        profile.tenth_passout_year = data.get('tenth_passout_year', profile.tenth_passout_year)
        # Professional Details
        profile.internship = data.get('internship', profile.internship)
        profile.experience_details = data.get('experience_details', profile.experience_details)
        profile.project_description = data.get('project_description', profile.project_description)
        profile.project_link = data.get('project_link', profile.project_link)
        profile.linkedin_link = data.get('linkedin_link', profile.linkedin_link)
        profile.github_link = data.get('github_link', profile.github_link)
        profile.resume_path = data.get('resume_path', profile.resume_path)

        print("Committing changes")
        db.session.commit()
        print("Profile updated successfully")

        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Failed to update profile', 'error': str(e)}), 400

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        notifications = Notification.query.filter_by(user_id=session['user_id']).order_by(Notification.created_at.desc()).all()

        result = []
        for n in notifications:
            created_at_str = n.created_at.isoformat() if n.created_at else None
            result.append({
                'id': n.id,
                'type': n.type,
                'message': n.message,
                'user_id': n.user_id,
                'applicant_id': n.applicant_id,
                'job_id': n.job_id,
                'is_read': n.is_read,
                'created_at': created_at_str
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch notifications', 'error': str(e)}), 500

@app.route('/api/notifications/<int:notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])
        notification = Notification.query.filter_by(id=notification_id, user_id=user.id).first()

        if not notification:
            return jsonify({'message': 'Notification not found'}), 404

        notification.is_read = True
        db.session.commit()

        return jsonify({'message': 'Notification marked as read'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update notification', 'error': str(e)}), 400

@app.route('/api/notifications/<int:notification_id>', methods=['DELETE'])
def delete_notification(notification_id):
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])
        notification = Notification.query.filter_by(id=notification_id, user_id=user.id).first()

        if not notification:
            return jsonify({'message': 'Notification not found'}), 404

        db.session.delete(notification)
        db.session.commit()

        return jsonify({'message': 'Notification deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete notification', 'error': str(e)}), 400

@app.route('/api/admin/<int:admin_id>/notifications', methods=['GET'])
def get_admin_notifications(admin_id):
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])
        if user.role != 'admin' or user.id != admin_id:
            return jsonify({'message': 'Access denied'}), 403

        notifications = Notification.query.filter_by(user_id=admin_id).order_by(Notification.created_at.desc()).all()

        result = []
        for n in notifications:
            created_at_str = n.created_at.isoformat() if n.created_at else None
            result.append({
                'id': n.id,
                'type': n.type,
                'message': n.message,
                'user_id': n.user_id,
                'applicant_id': n.applicant_id,
                'job_id': n.job_id,
                'is_read': n.is_read,
                'created_at': created_at_str
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch admin notifications', 'error': str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user_details(user_id):
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        current_user = User.query.get(session['user_id'])
        if current_user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403

        user = User.query.get_or_404(user_id)

        # Get profile for the user
        profile = Profile.query.filter_by(user_id=user.id).first()
        if not profile:
            profile = Profile(user_id=user.id)
            db.session.add(profile)
            db.session.commit()

        return jsonify({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': profile.phone,
            'location': profile.location,
            'experience': profile.experience,
            'skills': profile.skills or [],
            # Professional Information
            'degree': profile.degree,
            'university': profile.university,
            'percentage': profile.percentage,
            'passout_year': profile.passout_year,
            'backlog': profile.backlog,
            # 12th Details
            'twelfth_school': profile.twelfth_school,
            'twelfth_percentage': profile.twelfth_percentage,
            'twelfth_passout_year': profile.twelfth_passout_year,
            # 10th Details
            'tenth_school': profile.tenth_school,
            'tenth_percentage': profile.tenth_percentage,
            'tenth_passout_year': profile.tenth_passout_year,
            # Professional Details
            'internship': profile.internship,
            'experience_details': profile.experience_details,
            'project_description': profile.project_description,
            'project_link': profile.project_link,
            'linkedin_link': profile.linkedin_link,
            'github_link': profile.github_link,
            'resume_path': profile.resume_path
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch user details', 'error': str(e)}), 500

@app.route('/api/jobs/<int:job_id>/save', methods=['POST'])
def save_job(job_id):
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])

        # Check if job is already saved
        existing_save = SavedJob.query.filter_by(user_id=user.id, job_id=job_id).first()
        if existing_save:
            return jsonify({'message': 'Job already saved'}), 400

        # Create saved job entry
        saved_job = SavedJob(user_id=user.id, job_id=job_id)
        db.session.add(saved_job)
        db.session.commit()

        return jsonify({'message': 'Job saved successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to save job', 'error': str(e)}), 400

@app.route('/api/saved-jobs', methods=['GET'])
def get_saved_jobs():
    try:
        # Check if user is logged in via session
        if 'user_id' not in session:
            return jsonify({'message': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])

        saved_jobs = SavedJob.query.filter_by(user_id=user.id).all()
        result = []

        for saved in saved_jobs:
            job = Job.query.get(saved.job_id)
            result.append({
                'id': saved.id,
                'job_id': saved.job_id,
                'job_title': job.title,
                'company': job.company,
                'saved_date': saved.saved_date.isoformat()
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch saved jobs', 'error': str(e)}), 500

# Add SavedJob model
class SavedJob(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('job.id'), nullable=False)
    saved_date = db.Column(db.DateTime, default=datetime.utcnow)

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully!")
        except Exception as e:
            print(f"Error creating database tables: {e}")
    app.run(debug=True, port=5000)
