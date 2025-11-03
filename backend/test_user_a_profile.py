import requests

def test_user_a_profile():
    # Login as User A
    login_response = requests.post('http://localhost:5000/api/auth/login', json={
        'email': 'usera@test.com',
        'password': 'password'
    })
    if login_response.status_code != 200:
        print(f"User A login failed: {login_response.status_code} - {login_response.text}")
        return
    user_a_token = login_response.json()['access_token']
    print("User A logged in successfully")

    # Fetch User A profile
    profile_response = requests.get('http://localhost:5000/api/profile', headers={'Authorization': f'Bearer {user_a_token}'})
    if profile_response.status_code == 200:
        user_a_profile = profile_response.json()
        print("User A Profile Data:")
        print(f"  Name: {user_a_profile.get('name')}")
        print(f"  Email: {user_a_profile.get('email')}")
        print(f"  Phone: {user_a_profile.get('phone')}")
        print(f"  Location: {user_a_profile.get('location')}")
        print(f"  Experience: {user_a_profile.get('experience')}")
        print(f"  Skills: {user_a_profile.get('skills')}")
    else:
        print(f"Failed to fetch profile: {profile_response.status_code} - {profile_response.text}")

if __name__ == '__main__':
    test_user_a_profile()
