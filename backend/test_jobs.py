from app import app

def test_get_jobs():
    with app.app_context():
        with app.test_client() as client:
            response = client.get('/api/jobs')
            print('Jobs Status:', response.status_code)
            print('Jobs Response:', response.get_json())

if __name__ == '__main__':
    test_get_jobs()
