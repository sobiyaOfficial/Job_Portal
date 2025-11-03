from app import app, db, User

with app.app_context():
    users = User.query.all()
    print('Users in DB:', len(users))
    for u in users:
        print(f'ID: {u.id}, Email: {u.email}, Role: {u.role}')
