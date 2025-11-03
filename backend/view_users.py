import psycopg2

def view_users():
    try:
        conn = psycopg2.connect('postgresql://postgres:1234@localhost:5433/hh')
        cursor = conn.cursor()

        cursor.execute('SELECT id, name, email, role, created_at FROM "user"')
        users = cursor.fetchall()

        print('Users in Database:')
        print('==================')
        for user in users:
            print(f'ID: {user[0]}')
            print(f'Name: {user[1]}')
            print(f'Email: {user[2]}')
            print(f'Role: {user[3]}')
            print(f'Created: {user[4]}')
            print('---')

        cursor.close()
        conn.close()

    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    view_users()
