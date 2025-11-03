import requests

def test_apply_job():
    # Login as User A
    login_response = requests.post('http://localhost:5000/api/auth/login', json={
        'email': 'usera@test.com',
        'password': 'password'
    }, allow_redirects=False)
    if login_response.status_code != 200:
        print(f"User A login failed: {login_response.status_code} - {login_response.text}")
        return
    user_a_token = login_response.json()['access_token']
    print("User A logged in successfully")

    # Apply for job ID 5 (App development) - use session cookies
    session = requests.Session()
    session.post('http://localhost:5000/api/auth/login', json={
        'email': 'usera@test.com',
        'password': 'password'
    })

    apply_response = session.post('http://localhost:5000/api/jobs/5/apply')
    print(f"Apply response status: {apply_response.status_code}")
    print(f"Apply response: {apply_response.text}")

    if apply_response.status_code == 201:
        print("✓ Job application successful")
    elif apply_response.status_code == 400:
        print("✗ Job application failed - likely already applied")
    else:
        print(f"✗ Job application failed with status {apply_response.status_code}")

if __name__ == '__main__':
    test_apply_job()
