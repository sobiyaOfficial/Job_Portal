import psycopg2

def delete_test_job():
    try:
        conn = psycopg2.connect('postgresql://postgres:1234@localhost:5433/hh')
        cursor = conn.cursor()

        # Delete the test job
        cursor.execute("DELETE FROM job WHERE title = 'Software Engineer' AND company = 'Tech Corp'")
        deleted_count = cursor.rowcount

        conn.commit()

        print(f'Deleted {deleted_count} test job(s) from database.')

        cursor.close()
        conn.close()

    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    delete_test_job()
