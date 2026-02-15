# Job Portal Application

A full-stack job portal application built with Laravel (backend) and React (frontend).

## Features

### User Roles
- **Employer**: Post, edit, and manage job listings
- **Job Seeker**: Browse jobs, apply with resume, track applications
- **Admin**: Approve/reject jobs, manage users and categories

### Core Functionality
- Authentication with Laravel Sanctum
- Role-based access control
- Job posting and management
- Resume upload (PDF only)
- Application tracking
- Category management

## Tech Stack

### Backend
- Laravel 11
- MySQL
- Laravel Sanctum for API authentication
- RESTful API architecture

### Frontend
- React 18
- Vite
- React Router
- Axios
- Tailwind CSS

## Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Configure your database in `.env`:
```
DB_DATABASE=job_portal
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Run migrations and seeders:
```bash
php artisan migrate --seed
```

7. Create storage symlink:
```bash
php artisan storage:link
```

8. Start the Laravel development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Default Users

After running the seeder, you can login with these credentials:

- **Admin**
  - Email: admin@jobportal.com
  - Password: password

- **Employer**
  - Email: employer@jobportal.com
  - Password: password

- **Job Seeker**
  - Email: seeker@jobportal.com
  - Password: password

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login
- `POST /api/logout` - Logout (protected)
- `GET /api/user` - Get authenticated user (protected)

### Jobs
- `GET /api/jobs/approved` - Get all approved jobs (public)
- `GET /api/jobs` - Get jobs based on user role (protected)
- `POST /api/jobs` - Create job (employer only)
- `GET /api/jobs/{id}` - Get single job details (protected)
- `PUT /api/jobs/{id}` - Update job (employer only)
- `DELETE /api/jobs/{id}` - Delete job (employer/admin)

### Applications
- `GET /api/applications` - Get user's applications (seeker)
- `POST /api/jobs/{id}/apply` - Apply to job (seeker)
- `PATCH /api/applications/{id}/status` - Update application status (employer)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `DELETE /api/categories/{id}` - Delete category (admin only)

### Admin
- `GET /api/admin/jobs` - Get all jobs
- `PATCH /api/admin/jobs/{id}/approve` - Approve job
- `PATCH /api/admin/jobs/{id}/reject` - Reject job
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/{id}` - Delete user

## Database Schema

### users
- id, name, email, password, role (employer/seeker/admin)

### jobs
- id, title, description, salary, category_id, user_id, is_approved

### applications
- id, job_id, user_id, resume_path, status (pending/accepted/rejected)

### categories
- id, name

## Project Structure

### Backend
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   └── Policies/
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/
    └── api.php
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── employer/
│   │   ├── seeker/
│   │   └── admin/
│   ├── contexts/
│   ├── pages/
│   └── services/
└── package.json
```

## Key Features Implementation

### Authentication
- JWT token-based authentication using Laravel Sanctum
- Token stored in localStorage on frontend
- Automatic token injection in API requests

### Authorization
- Policies for resource-based authorization
- Form Request validation classes
- Middleware for route protection

### File Upload
- Resume upload with PDF validation
- Stored in `storage/app/public/resumes`
- Accessible via storage symlink

### API Resources
- Consistent JSON response format
- Proper data transformation
- Relationship loading optimization

## Development Notes

- CORS is configured for localhost:5173
- File uploads limited to 2MB PDFs
- API follows REST conventions
- Frontend uses Axios interceptors for auth
- Clean, minimal UI with Tailwind CSS

## License

This project is open-source.