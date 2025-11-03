from app import app, db

def test_register():
    with app.app_context():
        db.create_all()
        with app.test_client() as client:
            response = client.post('/api/auth/register', json={
                'name': 'Test User 2',
                'email': 'test2@example.com',
                'password': 'password',
                'role': 'user'
            })
            print('Status:', response.status_code)
            print('Response:', response.get_json())

if __name__ == '__main__':
    test_register()
