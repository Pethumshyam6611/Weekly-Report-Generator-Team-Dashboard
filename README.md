# Weekly Report Generator & Team Dashboard

Full-stack web application for weekly team reporting, manager dashboards, project tracking, and AI-assisted report analysis.

## Project Structure

```text
backend/   Express.js + Sequelize + MySQL REST API
frontend/  Next.js + TypeScript + TailwindCSS client app
```

## Prerequisites

- Node.js LTS, version 20 or newer recommended
- MySQL 8.0 or newer
- npm
- Google Gemini API key, only required for the AI assistant feature

## Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example` and update the database credentials and secrets.

Create the MySQL database:

```sql
CREATE DATABASE weekly_reports CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations and seeders:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

Seeded login users:

```text
Manager:      manager@gmail.com          / Password1234
Team member:  pethumshayam66@gmail.com  / Password1234
Team member:  akashuvindu@gmail.com     / Password1234
```

To register a new manager from the frontend register page, set `MANAGER_INVITE_CODE` in `backend/.env` and enter the same private code when selecting the Manager account type.

## Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local` from `frontend/.env.local.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

## Main Features

- User registration and login
- JWT access token and refresh token authentication
- Role-based access for team members and managers
- Team member weekly report creation, draft editing, submission, and history
- Manager dashboard with summary metrics, charts, recent activity, and submission status
- Project management and project member assignment
- Gemini-powered AI assistant for manager questions about report data

## Documentation

More detailed setup and API notes are available in:

- `backend/README.md`
- `frontend/README.md`
