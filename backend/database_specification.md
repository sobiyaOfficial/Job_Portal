# Database Specification - Job Portal Application

## Overview

This document outlines the database schema for the Job Portal application built with Flask and PostgreSQL.

## Database Configuration

- **Database Type**: PostgreSQL
- **Connection String**: `postgresql://postgres:1234@localhost:5433/hh`
- **ORM**: SQLAlchemy with Flask-SQLAlchemy

## Tables and Schema

### 1. User Table

**Purpose**: Stores user account information and authentication details.

| Column     | Type         | Constraints                 | Description                   |
| ---------- | ------------ | --------------------------- | ----------------------------- |
| id         | INTEGER      | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier        |
| name       | VARCHAR(100) | NOT NULL                    | User's full name              |
| email      | VARCHAR(120) | UNIQUE, NOT NULL            | User's email address          |
| password   | VARCHAR(200) | NOT NULL                    | Hashed password               |
| role       | VARCHAR(20)  | DEFAULT 'user'              | User role ('user' or 'admin') |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Account creation timestamp    |

### 2. Profile Table

**Purpose**: Stores extended user profile information.

| Column     | Type         | Constraints                                            | Description                   |
| ---------- | ------------ | ------------------------------------------------------ | ----------------------------- |
| id         | INTEGER      | PRIMARY KEY, AUTO_INCREMENT                            | Unique profile identifier     |
| user_id    | INTEGER      | FOREIGN KEY (user.id), NOT NULL                        | Reference to user             |
| phone      | VARCHAR(20)  | NULL                                                   | User's phone number           |
| location   | VARCHAR(100) | NULL                                                   | User's location               |
| experience | VARCHAR(200) | NULL                                                   | Work experience description   |
| skills     | JSON         | NULL                                                   | Array of user skills          |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                              | Profile creation timestamp    |
| updated_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last profile update timestamp |

### 3. Job Table

**Purpose**: Stores job posting information.

| Column       | Type         | Constraints                 | Description                    |
| ------------ | ------------ | --------------------------- | ------------------------------ |
| id           | INTEGER      | PRIMARY KEY, AUTO_INCREMENT | Unique job identifier          |
| title        | VARCHAR(200) | NOT NULL                    | Job title                      |
| company      | VARCHAR(100) | NOT NULL                    | Company name                   |
| location     | VARCHAR(100) | NULL                        | Job location                   |
| salary       | VARCHAR(50)  | NULL                        | Salary information             |
| description  | TEXT         | NULL                        | Job description                |
| requirements | TEXT         | NULL                        | Job requirements               |
| benefits     | TEXT         | NULL                        | Job benefits                   |
| applicants   | INTEGER      | DEFAULT 0                   | Number of applicants           |
| created_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Job posting creation timestamp |

### 4. Application Table

**Purpose**: Tracks job applications submitted by users.

| Column       | Type        | Constraints                     | Description                                            |
| ------------ | ----------- | ------------------------------- | ------------------------------------------------------ |
| id           | INTEGER     | PRIMARY KEY, AUTO_INCREMENT     | Unique application identifier                          |
| user_id      | INTEGER     | FOREIGN KEY (user.id), NOT NULL | Reference to applicant user                            |
| job_id       | INTEGER     | FOREIGN KEY (job.id), NOT NULL  | Reference to applied job                               |
| status       | VARCHAR(20) | DEFAULT 'Applied'               | Application status ('Applied', 'Accepted', 'Rejected') |
| applied_date | TIMESTAMP   | DEFAULT CURRENT_TIMESTAMP       | Application submission timestamp                       |

### 5. Notification Table

**Purpose**: Stores notifications for users (admins and regular users).

| Column       | Type        | Constraints                     | Description                                            |
| ------------ | ----------- | ------------------------------- | ------------------------------------------------------ |
| id           | INTEGER     | PRIMARY KEY, AUTO_INCREMENT     | Unique notification identifier                         |
| type         | VARCHAR(50) | NOT NULL                        | Notification type ('application', 'job_update', etc.)  |
| message      | TEXT        | NOT NULL                        | Notification message content                           |
| user_id      | INTEGER     | FOREIGN KEY (user.id), NOT NULL | Reference to recipient user                            |
| job_id       | INTEGER     | FOREIGN KEY (job.id), NULL      | Reference to related job (if applicable)               |
| applicant_id | INTEGER     | FOREIGN KEY (user.id), NULL     | Reference to applicant (for application notifications) |
| is_read      | BOOLEAN     | DEFAULT FALSE                   | Read status of notification                            |
| created_at   | TIMESTAMP   | DEFAULT CURRENT_TIMESTAMP       | Notification creation timestamp                        |

### 6. SavedJob Table

**Purpose**: Tracks jobs saved by users for later reference.

| Column     | Type      | Constraints                     | Description                         |
| ---------- | --------- | ------------------------------- | ----------------------------------- |
| id         | INTEGER   | PRIMARY KEY, AUTO_INCREMENT     | Unique saved job identifier         |
| user_id    | INTEGER   | FOREIGN KEY (user.id), NOT NULL | Reference to user who saved the job |
| job_id     | INTEGER   | FOREIGN KEY (job.id), NOT NULL  | Reference to saved job              |
| saved_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP       | Date when job was saved             |

## Relationships

### Foreign Key Relationships

1. **Profile.user_id** → **User.id** (One-to-One)

   - Each user has one profile
   - Profile is created automatically when user accesses profile endpoint

2. **Application.user_id** → **User.id** (Many-to-One)

   - Multiple applications per user
   - Each application belongs to one user

3. **Application.job_id** → **Job.id** (Many-to-One)

   - Multiple applications per job
   - Each application belongs to one job

4. **Notification.user_id** → **User.id** (Many-to-One)

   - Multiple notifications per user
   - Each notification belongs to one recipient

5. **Notification.job_id** → **Job.id** (Many-to-One, Optional)

   - Notifications may be related to specific jobs
   - Not all notifications have job references

6. **Notification.applicant_id** → **User.id** (Many-to-One, Optional)

   - For application notifications, references the applicant
   - Only applicable for application-related notifications

7. **SavedJob.user_id** → **User.id** (Many-to-One)

   - Users can save multiple jobs
   - Each saved job belongs to one user

8. **SavedJob.job_id** → **Job.id** (Many-to-One)
   - Jobs can be saved by multiple users
   - Each saved job entry references one job

## Indexes and Constraints

### Unique Constraints

- **User.email**: Ensures unique email addresses
- **Application(user_id, job_id)**: Prevents duplicate applications for same job

### Indexes (Recommended)

- **User.email**: For fast login lookups
- **Profile.user_id**: For profile queries
- **Application.user_id**: For user's application history
- **Application.job_id**: For job's application list
- **Notification.user_id**: For user's notifications
- **SavedJob.user_id**: For user's saved jobs

## Data Types and Validation

### JSON Fields

- **Profile.skills**: Array of strings representing user skills
  - Example: `["JavaScript", "React", "Node.js"]`

### Enum Values

- **User.role**: 'user', 'admin'
- **Application.status**: 'Applied', 'Accepted', 'Rejected'
- **Notification.type**: 'application', 'job_update', etc.

### Text Length Limits

- **User.name**: 100 characters
- **User.email**: 120 characters
- **Job.title**: 200 characters
- **Job.company**: 100 characters

## Database Initialization

The database tables are created automatically when the Flask application starts using `db.create_all()`.

## Migration Strategy

For future schema changes, consider using Flask-Migrate (Alembic) for database migrations to maintain data integrity during updates.

## Security Considerations

- Passwords are hashed using Flask-Bcrypt
- JWT tokens are used for authentication (stored client-side)
- Foreign key constraints prevent orphaned records
- Input validation is handled at the API level

## Performance Considerations

- Indexes on frequently queried columns (user_id, job_id, email)
- JSON field for flexible skills storage
- Timestamp fields for audit trails
- Efficient queries using SQLAlchemy relationships
