from app import app, db, User, bcrypt

with app.app_context():
    # Create test users if they don't exist
    test_users = [
        {'name': 'User A', 'email': 'usera@test.com', 'password': 'password', 'role': 'user'},
        {'name': 'User B', 'email': 'userb@test.com', 'password': 'password', 'role': 'user'},
        {'name': 'Admin User', 'email': 'admin@test.com', 'password': 'password', 'role': 'admin'}
    ]

    for user_data in test_users:
        existing_user = User.query.filter_by(email=user_data['email']).first()
        if not existing_user:
            hashed_password = bcrypt.generate_password_hash(user_data['password']).decode('utf-8')
            user = User(
                name=user_data['name'],
                email=user_data['email'],
                password=hashed_password,
                role=user_data['role']
            )
            db.session.add(user)
            print(f"Created user: {user_data['email']}")
        else:
            # Update password if user exists but password is wrong
            if not bcrypt.check_password_hash(existing_user.password, user_data['password']):
                existing_user.password = bcrypt.generate_password_hash(user_data['password']).decode('utf-8')
                print(f"Updated password for user: {user_data['email']}")
            else:
                print(f"User already exists with correct password: {user_data['email']}")

    db.session.commit()
    print("Test users creation completed")
