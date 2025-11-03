from app import app, db
from sqlalchemy import text

with app.app_context():
    try:
        # Add the requirements and benefits columns to the job table
        with db.engine.connect() as conn:
            conn.execute(text("ALTER TABLE job ADD COLUMN IF NOT EXISTS requirements TEXT;"))
            conn.execute(text("ALTER TABLE job ADD COLUMN IF NOT EXISTS benefits TEXT;"))
            conn.execute(text("ALTER TABLE job ADD COLUMN IF NOT EXISTS poster_id INTEGER REFERENCES \"user\"(id);"))
            conn.commit()
        print("Columns added successfully!")
    except Exception as e:
        print(f"Error adding columns: {e}")
