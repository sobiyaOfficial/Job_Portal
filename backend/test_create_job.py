from app import app

def test_create_job():
    with app.app_context():
        with app.test_client() as client:
            # First login to get token
            login_response = client.post('/api/auth/login', json={
                'email': 'admin@test.com',
                'password': 'password'
            })
            print('Login Response:', login_response.get_json())
            token = login_response.get_json()['access_token']

            # Create job with Authorization header
            response = client.post('/api/jobs', json={
                'title': 'Software Engineer',
                'company': 'Tech Corp',
                'location': 'New York',
                'salary': '$100k',
                'description': 'Great job opportunity',
                'requirements': 'Bachelor degree in CS, 3+ years experience',
                'benefits': 'Health insurance, 401k, flexible hours'
            }, headers={'Authorization': f'Bearer {token}'})

            print('Create Job Status:', response.status_code)
            print('Create Job Response:', response.get_json())

if __name__ == '__main__':
    test_create_job()
