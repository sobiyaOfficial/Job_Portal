from app import app, db, Job, User

def update_existing_jobs():
    with app.app_context():
        # Get the first admin user to set as poster for existing jobs
        admin_user = User.query.filter_by(role='admin').first()
        if not admin_user:
            print("No admin user found!")
            return

        # Update all jobs that have poster_id as None
        jobs_to_update = Job.query.filter(Job.poster_id.is_(None)).all()
        for job in jobs_to_update:
            job.poster_id = admin_user.id

        db.session.commit()
        print(f"Updated {len(jobs_to_update)} jobs with poster_id = {admin_user.id}")

if __name__ == '__main__':
    update_existing_jobs()
