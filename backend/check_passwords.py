from app import app, db, User, bcrypt

with app.app_context():
    users = User.query.all()
    for u in users:
        print(f'ID: {u.id}, Email: {u.email}, Password hash: {u.password}')
        # Test password
        is_valid = bcrypt.check_password_hash(u.password, 'password')
        print(f'  Password "password" valid: {is_valid}')
