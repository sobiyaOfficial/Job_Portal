from app import app, db
from sqlalchemy import text

with app.app_context():
    try:
        with db.engine.connect() as conn:
            result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'profile' ORDER BY column_name;"))
            columns = [row[0] for row in result.fetchall()]
            print("Profile table columns:")
            for col in columns:
                print(f"- {col}")
    except Exception as e:
        print(f"Error checking columns: {e}")
