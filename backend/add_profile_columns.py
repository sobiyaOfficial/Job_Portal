from app import app, db
from sqlalchemy import text

with app.app_context():
    try:
        # Add the missing columns to the profile table
        with db.engine.connect() as conn:
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS phone VARCHAR(20);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS location VARCHAR(100);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS experience VARCHAR(200);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS skills JSON;"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS degree VARCHAR(100);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS university VARCHAR(100);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS percentage VARCHAR(10);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS passout_year VARCHAR(4);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS backlog VARCHAR(10);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS twelfth_school VARCHAR(100);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS twelfth_percentage VARCHAR(10);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS twelfth_passout_year VARCHAR(4);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS tenth_school VARCHAR(100);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS tenth_percentage VARCHAR(10);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS tenth_passout_year VARCHAR(4);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS internship TEXT;"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS experience_details TEXT;"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS project_description TEXT;"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS project_link VARCHAR(500);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS linkedin_link VARCHAR(500);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS github_link VARCHAR(500);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS resume_path VARCHAR(500);"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
            conn.execute(text("ALTER TABLE profile ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"))
            conn.commit()
        print("Profile columns added successfully!")
    except Exception as e:
        print(f"Error adding profile columns: {e}")
