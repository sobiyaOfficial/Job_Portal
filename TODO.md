# TODO: Implement Job Poster Notifications

## Pending Tasks

- [x] Add poster_id to Job model (foreign key to User)
- [x] Run database migration to add poster_id column to job table
- [x] Update job creation to set poster_id from session user_id
- [x] Update job application to create notification only for the job poster (not all admins)
- [x] Update notification fetching to filter by current admin's ID (already done)
- [x] Test the notification flow: user applies for job, admin receives notification with applicant details
- [ ] Update AdminDashboard to display job title in notifications if needed
- [ ] Ensure backward compatibility with existing notifications
