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
            print(f'ID: {job[0]}, Title: {job[1]}, Company: {job[2]}, Location: {job[3]}, Salary: {job[4]}, Created: {job[10]}')

        # View applications
        cursor.execute('SELECT * FROM application')
        applications = cursor.fetchall()
        print('\nApplications table:')
        for app in applications:
            print(f'ID: {app[0]}, User ID: {app[1]}, Job ID: {app[2]}, Status: {app[3]}, Applied: {app[4]}')

        # View notifications
        cursor.execute('SELECT * FROM notification')
        notifications = cursor.fetchall()
        print('\nNotifications table:')
        for notif in notifications:
            print(f'ID: {notif[0]}, Type: {notif[1]}, Message: {notif[2]}, User ID: {notif[3]}, Job ID: {notif[4]}, Read: {notif[5]}')

        cursor.close()
        conn.close()

    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    view_database()
