import requests

def test_user_a_dashboard_refresh():
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

    # Update User A profile (simulate editing in dashboard)
    update_data = {
        'name': 'User A Refreshed',
        'email': 'usera@test.com',
        'phone': '999-888-7777',
        'location': 'Boston',
        'experience': '6 years',
        'skills': ['Python', 'React', 'Node.js']
    }
    update_response = requests.put('http://localhost:5000/api/profile',
                                   json=update_data,
                                   headers={'Authorization': f'Bearer {user_a_token}'})
    if update_response.status_code != 200:
        print(f"Profile update failed: {update_response.status_code} - {update_response.text}")
        return
    print("User A profile updated successfully")

    # Fetch User A profile (simulate dashboard refresh)
    profile_response = requests.get('http://localhost:5000/api/profile', headers={'Authorization': f'Bearer {user_a_token}'})
    if profile_response.status_code == 200:
        user_a_profile = profile_response.json()
        print("User A Profile Data after refresh:")
        print(f"  Name: {user_a_profile.get('name')}")
        print(f"  Email: {user_a_profile.get('email')}")
        print(f"  Phone: {user_a_profile.get('phone')}")
        print(f"  Location: {user_a_profile.get('location')}")
        print(f"  Experience: {user_a_profile.get('experience')}")
        print(f"  Skills: {user_a_profile.get('skills')}")

        # Verify the update was applied
        if (user_a_profile.get('name') == 'User A Refreshed' and
            user_a_profile.get('phone') == '999-888-7777' and
            user_a_profile.get('location') == 'Boston'):
            print("✓ Dashboard refresh test passed: Profile data updated and fetched correctly")
        else:
            print("✗ Dashboard refresh test failed: Profile data not updated correctly")
    else:
        print(f"Failed to fetch profile after update: {profile_response.status_code} - {profile_response.text}")

if __name__ == '__main__':
    test_user_a_dashboard_refresh()
