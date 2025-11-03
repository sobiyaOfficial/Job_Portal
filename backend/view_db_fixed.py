import psycopg2

def view_database():
    try:
        conn = psycopg2.connect('postgresql://postgres:1234@localhost:5433/hh')
        cursor = conn.cursor()

        # View users
        cursor.execute('SELECT * FROM "user"')
        users = cursor.fetchall()
        print('Users table:')
        for user in users:
            print(f'ID: {user[0]}, Name: {user[1]}, Email: {user[2]}, Role: {user[4]}, Created: {user[6]}')

        # View jobs
        cursor.execute('SELECT * FROM job')
        jobs = cursor.fetchall()
        print('\nJobs table:')
        for job in jobs:
            print(f'Job: {job}')

        # View applications
        cursor.execute('SELECT * FROM application')
        applications = cursor.fetchall()
        print('\nApplications table:')
        for app in applications:
            print(f'Application: {app}')

        # View profiles
        cursor.execute('SELECT * FROM profile')
        profiles = cursor.fetchall()
        print('\nProfiles table:')
        for profile in profiles:
            print(f'Profile: {profile}')

        # View notifications
        cursor.execute('SELECT * FROM notification')
        notifications = cursor.fetchall()
        print('\nNotifications table:')
        for notif in notifications:
            print(f'Notification: {notif}')

        cursor.close()
        conn.close()

    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    view_database()
