import requests

def test_user_profiles():
    # Login as User A
    login_response = requests.post('http://localhost:5000/api/auth/login', json={
        'email': 'usera@test.com',
        'password': 'password'
    })
    if login_response.status_code != 200:
        print(f"User A login failed: {login_response.status_code} - {login_response.text}")
        return
    user_a_token = login_response.json()['access_token']
    print("User A logged in")

    # Login as User B
    login_response = requests.post('http://localhost:5000/api/auth/login', json={
        'email': 'userb@test.com',
        'password': 'password'
    })
    if login_response.status_code != 200:
        print(f"User B login failed: {login_response.status_code} - {login_response.text}")
        return
    user_b_token = login_response.json()['access_token']
    print("User B logged in")

    # Get initial profiles
    profile_response = requests.get('http://localhost:5000/api/profile', headers={'Authorization': f'Bearer {user_a_token}'})
    print(f"User A initial profile: {profile_response.json()}")

    profile_response = requests.get('http://localhost:5000/api/profile', headers={'Authorization': f'Bearer {user_b_token}'})
    print(f"User B initial profile: {profile_response.json()}")

    # User A updates profile
    update_response = requests.put('http://localhost:5000/api/profile', json={
        'name': 'User A Updated',
        'email': 'usera@test.com',
        'phone': '123-456-7890',
        'location': 'New York',
        'experience': '5 years',
        'skills': ['Python', 'React']
    }, headers={'Authorization': f'Bearer {user_a_token}'})
    print(f"User A profile update status: {update_response.status_code}")

    # User B updates profile
    update_response = requests.put('http://localhost:5000/api/profile', json={
        'name': 'User B Updated',
        'email': 'userb@test.com',
        'phone': '987-654-3210',
        'location': 'California',
        'experience': '3 years',
        'skills': ['JavaScript', 'Node.js']
    }, headers={'Authorization': f'Bearer {user_b_token}'})
    print(f"User B profile update status: {update_response.status_code}")

    # Check User A profile
    profile_response = requests.get('http://localhost:5000/api/profile', headers={'Authorization': f'Bearer {user_a_token}'})
    user_a_profile = profile_response.json()
    print(f"User A profile: {user_a_profile}")

    # Check User B profile
    profile_response = requests.get('http://localhost:5000/api/profile', headers={'Authorization': f'Bearer {user_b_token}'})
    user_b_profile = profile_response.json()
    print(f"User B profile: {user_b_profile}")

    # Verify profiles are separate
    assert user_a_profile['name'] == 'User A Updated'
    assert user_b_profile['name'] == 'User B Updated'
    assert user_a_profile['phone'] == '123-456-7890'
    assert user_b_profile['phone'] == '987-654-3210'
    print("Test passed: User profiles are properly isolated")

if __name__ == '__main__':
    test_user_profiles()
