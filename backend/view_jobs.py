import psycopg2

def view_jobs():
    try:
        conn = psycopg2.connect('postgresql://postgres:1234@localhost:5433/hh')
        cursor = conn.cursor()

        cursor.execute('SELECT id, title, company, location, salary, description, applicants, created_at FROM job')
        jobs = cursor.fetchall()

        print('Jobs in Database:')
        print('=================')
        for job in jobs:
            print(f'ID: {job[0]}')
            print(f'Title: {job[1]}')
            print(f'Company: {job[2]}')
            print(f'Location: {job[3]}')
            print(f'Salary: {job[4]}')
            print(f'Description: {job[5]}')
            print(f'Applicants: {job[6]}')
            print(f'Created: {job[7]}')
            print('---')

        cursor.close()
        conn.close()

    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    view_jobs()
