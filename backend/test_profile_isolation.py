import requests
import json

BASE_URL = 'http://localhost:5000'

def create_user(name, email, password, role='user'):
    response = requests.post(f'{BASE_URL}/api/auth/register', json={
        'name': name,
        'email': email,
        'password': password,
        'role': role
    })
    return response

def login_user(email, password):
    response = requests.post(f'{BASE_URL}/api/auth/login', json={
        'email': email,
        'password': password
    })
    if response.status_code == 200:
        return response.json()['access_token']
    return None

def get_profile(token):
    response = requests.get(f'{BASE_URL}/api/profile', headers={
        'Authorization': f'Bearer {token}'
    })
    return response

def update_profile(token, profile_data):
    response = requests.put(f'{BASE_URL}/api/profile',
        headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        },
        json=profile_data
    )
    return response

def test_profile_isolation():
    print("Testing profile isolation between multiple users...")

    # Use unique emails to avoid conflicts
    import time
    timestamp = str(int(time.time()))

    # Create 3 test users with unique emails
    users = [
        {'name': 'User One', 'email': f'user1_{timestamp}@test.com', 'password': 'password1'},
        {'name': 'User Two', 'email': f'user2_{timestamp}@test.com', 'password': 'password2'},
        {'name': 'User Three', 'email': f'user3_{timestamp}@test.com', 'password': 'password3'}
    ]

    tokens = {}
    profiles = {}

    # Register and login users
    for user in users:
        print(f"\nCreating user: {user['name']}")
        create_response = create_user(user['name'], user['email'], user['password'])
        if create_response.status_code not in [200, 201]:
            print(f"Failed to create user {user['name']}: {create_response.text}")
            continue

        token = login_user(user['email'], user['password'])
        if token:
            tokens[user['email']] = token
            print(f"✓ {user['name']} logged in successfully")
        else:
            print(f"✗ Failed to login {user['name']}")

    # Check if we have all tokens
    if len(tokens) < 3:
        print("Not all users were created successfully. Skipping test.")
        return

    # Fill profile for User One
    print("\n--- Filling profile for User One ---")
    user1_profile = {
        'name': 'User One Updated',
        'phone': '111-111-1111',
        'location': 'New York',
        'experience': '2 years',
        'skills': ['JavaScript', 'React']
    }
    update_response = update_profile(tokens[users[0]['email']], user1_profile)
    if update_response.status_code == 200:
        print("✓ User One profile updated")
        profiles[users[0]['email']] = user1_profile
    else:
        print(f"✗ Failed to update User One profile: {update_response.text}")

    # Fill profile for User Two
    print("\n--- Filling profile for User Two ---")
    user2_profile = {
        'name': 'User Two Updated',
        'phone': '222-222-2222',
        'location': 'California',
        'experience': '4 years',
        'skills': ['Python', 'Django']
    }
    update_response = update_profile(tokens[users[1]['email']], user2_profile)
    if update_response.status_code == 200:
        print("✓ User Two profile updated")
        profiles[users[1]['email']] = user2_profile
    else:
        print(f"✗ Failed to update User Two profile: {update_response.text}")

    # Refresh User One (check if data is still correct)
    print("\n--- Refreshing User One profile ---")
    get_response = get_profile(tokens[users[0]['email']])
    if get_response.status_code == 200:
        current_profile = get_response.json()
        expected = profiles[users[0]['email']]
        if (current_profile['name'] == expected['name'] and
            current_profile['phone'] == expected['phone'] and
            current_profile['location'] == expected['location']):
            print("✓ User One profile data is correct after refresh")
        else:
            print(f"✗ User One profile data mismatch!")
            print(f"Expected: {expected}")
            print(f"Got: {current_profile}")
    else:
        print(f"✗ Failed to get User One profile: {get_response.text}")

    # Fill profile for User Three
    print("\n--- Filling profile for User Three ---")
    user3_profile = {
        'name': 'User Three Updated',
        'phone': '333-333-3333',
        'location': 'Texas',
        'experience': '6 years',
        'skills': ['Java', 'Spring']
    }
    update_response = update_profile(tokens[users[2]['email']], user3_profile)
    if update_response.status_code == 200:
        print("✓ User Three profile updated")
        profiles[users[2]['email']] = user3_profile
    else:
        print(f"✗ Failed to update User Three profile: {update_response.text}")

    # Refresh User One and User Two simultaneously
    print("\n--- Refreshing User One and User Two profiles simultaneously ---")

    get_response1 = get_profile(tokens[users[0]['email']])
    get_response2 = get_profile(tokens[users[1]['email']])

    if get_response1.status_code == 200 and get_response2.status_code == 200:
        profile1 = get_response1.json()
        profile2 = get_response2.json()

        expected1 = profiles[users[0]['email']]
        expected2 = profiles[users[1]['email']]

        user1_correct = (profile1['name'] == expected1['name'] and
                        profile1['phone'] == expected1['phone'] and
                        profile1['location'] == expected1['location'])

        user2_correct = (profile2['name'] == expected2['name'] and
                        profile2['phone'] == expected2['phone'] and
                        profile2['location'] == expected2['location'])

        if user1_correct and user2_correct:
            print("✓ Both User One and User Two profiles are correct - no data leakage")
        else:
            print("✗ Profile data leakage detected!")
            if not user1_correct:
                print(f"User One - Expected: {expected1}, Got: {profile1}")
            if not user2_correct:
                print(f"User Two - Expected: {expected2}, Got: {profile2}")
    else:
        print(f"✗ Failed to get profiles: User1: {get_response1.status_code}, User2: {get_response2.status_code}")

    print("\n--- Test completed ---")

if __name__ == '__main__':
    test_profile_isolation()
