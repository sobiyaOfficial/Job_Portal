from app import app, db, User, Profile, Job, Application, Notification, SavedJob

def clear_all_data():
    try:
        # Clear data in order to avoid foreign key constraints
        SavedJob.query.delete()
        Application.query.delete()
        Notification.query.delete()
        Profile.query.delete()
        Job.query.delete()
        User.query.delete()

        # Commit the changes
        db.session.commit()
        print("All data has been deleted from the database successfully!")

    except Exception as e:
        db.session.rollback()
        print(f"Error clearing database: {e}")

if __name__ == '__main__':
    with app.app_context():
        clear_all_data()
