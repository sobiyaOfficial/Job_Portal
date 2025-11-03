from app import app

def test_login():
    with app.app_context():
        with app.test_client() as client:
            response = client.post('/api/auth/login', json={
                'email': 'test@example.com',
                'password': 'password'
            })
            print('Login Status:', response.status_code)
            print('Login Response:', response.get_json())

if __name__ == '__main__':
    test_login()
