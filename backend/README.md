# Weekly Report Generator & Team Dashboard Backend

Backend-only Express API for weekly team reports, manager dashboards, and Gemini-powered report Q&A.

## Prerequisites

- Node.js LTS, version 20 or newer recommended
- MySQL 8.0 or newer
- npm
- A Google Gemini API key for `/api/ai-chat/*`

## Install

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure these values:

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development`, `test`, or `production`. |
| `PORT` | HTTP port for the Express server. |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | MySQL connection settings. |
| `DB_LOGGING` | Set to `true` to print Sequelize SQL logs. |
| `JWT_ACCESS_SECRET` | Long random secret used for 15 minute access tokens. |
| `JWT_REFRESH_SECRET` | Long random secret used for refresh tokens. |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime, default `15m`. |
| `JWT_REFRESH_EXPIRES_IN` | Refresh JWT lifetime, default `7d`. |
| `JWT_REFRESH_DAYS` | Refresh-token database expiry window in days. |
| `BCRYPT_SALT_ROUNDS` | Password hashing cost, minimum enforced value is 10. |
| `CORS_ORIGIN` | Comma-separated list of frontend origins allowed by CORS. |
| `MANAGER_INVITE_CODE` | Required when registering a user with role `manager`. Without this code, registration defaults to `team_member`. |
| `REPORT_GRACE_DAYS` | Days after `weekEnd` before a submitted report is marked `late`. Default is 1. |
| `GEMINI_API_KEY` | Google Gemini API key. Required for AI chat endpoints. |
| `GEMINI_MODEL` | Gemini model name. `.env.example` uses `gemini-2.5-flash`. |

## Create Database

Log into MySQL and create the database named in `.env`:

```sql
CREATE DATABASE weekly_reports CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Migrations And Seeders

Run migrations:

```bash
npm run migrate
```

Seed sample data:

```bash
npm run seed
```

Seeded users:

| Role | Name | Email | Password |
| --- | --- | --- | --- |
| Manager | Maya Manager | `manager@gmail.com` | `Password1234` |
| Team member | Pethum Shyam | `pethumshayam66@gmail.com` | `Password1234` |
| Team member | Akash Uvindu | `akashuvindu@gmail.com` | `Password1234` |
| Team member | Hiruni Perera | `hiruniperera@gmail.com` | `Password1234` |
| Team member | Kasun Silva | `kasunsilva@gmail.com` | `Password1234` |
| Team member | Nethmi Fernando | `nethmifernando@gmail.com` | `Password1234` |
| Team member | Dinuka Jayasinghe | `dinukajayasinghe@gmail.com` | `Password1234` |
| Team member | Tharushi Wijesinghe | `tharushiwijesinghe@gmail.com` | `Password1234` |
| Team member | Ravindu Perera | `ravinduperera@gmail.com` | `Password1234` |
| Team member | Sahan Madushan | `sahanmadushan@gmail.com` | `Password1234` |

The seeder also creates these projects:

| Project | Status |
| --- | --- |
| Internal Dashboard | Active |
| Inventory | Active |
| API Stabilization | Active |
| Client Portal | Active |
| Mobile Timesheets | Active |
| QA Automation | Active |
| Legacy CRM Migration | Inactive |

The sample dataset includes multiple project assignments and submitted, draft, and late weekly reports across the seeded team members. This seeder is intended for local demo preparation: it clears existing application data from `users`, `projects`, `user_projects`, `reports`, `refresh_tokens`, and `ai_query_logs` before inserting the fresh sample dataset. Do not run it against production data.

Manager self-registration:

```json
{
  "name": "New Manager",
  "email": "newmanager@gmail.com",
  "password": "Password1234",
  "role": "manager",
  "managerInviteCode": "value_from_MANAGER_INVITE_CODE"
}
```

To remove seeded data:

```bash
npm run seed:undo
```

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Health check:

```http
GET /health
```

## Business Rules

- New registrations default to `team_member`.
- A user can register as `manager` only when the request includes `managerInviteCode` matching `MANAGER_INVITE_CODE`.
- Team members can create reports only for projects they are assigned to.
- Team members can edit only their own draft reports. Submitted or late reports are locked.
- Managers can assign and unassign team members from projects.
- Dashboard endpoints accept `projectId` where relevant so summary metrics, charts, activity, and submission status can be filtered to one project.
- Submitting a report sets `submitted_at`. If the submit time is later than `weekEnd + REPORT_GRACE_DAYS`, the status becomes `late`; otherwise it becomes `submitted`.
- Refresh tokens are stored as SHA-256 hashes. Raw refresh tokens are never stored.
- Gemini context excludes password hashes, refresh tokens, and sensitive account fields.
- Gemini answers are normalized for the chat UI so list responses use hyphen bullets instead of raw asterisk bullets.

## Response Shape

Success:

```json
{ "success": true, "data": {}, "message": "OK" }
```

Error:

```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human readable message" } }
```

## API Endpoints

| Method | Path | Role | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a user. Manager role requires `managerInviteCode`. |
| `POST` | `/api/auth/login` | Public | Login and receive access and refresh tokens. |
| `POST` | `/api/auth/refresh` | Public | Exchange a valid refresh token for a new access token. |
| `POST` | `/api/auth/logout` | Authenticated | Delete the provided refresh token. |
| `GET` | `/api/auth/me` | Authenticated | Return the current user profile. |
| `GET` | `/api/users/me` | Authenticated | Convenience alias for the current user profile. |
| `GET` | `/api/users/team-members` | Manager | List team members for project assignment. |
| `GET` | `/api/projects` | Authenticated | Managers see projects for management. Team members see only their assigned projects. |
| `POST` | `/api/projects` | Manager | Create a project. |
| `PUT` | `/api/projects/:id` | Manager | Edit a project. |
| `DELETE` | `/api/projects/:id` | Manager | Soft delete a project by setting `is_active = false`. |
| `POST` | `/api/projects/:id/assign` | Manager | Assign a user to a project. |
| `GET` | `/api/projects/:id/members` | Manager | List project members. |
| `DELETE` | `/api/projects/:id/members/:userId` | Manager | Remove a team member assignment from a project. |
| `POST` | `/api/reports` | Team member | Create a draft report for an assigned project. |
| `PUT` | `/api/reports/:id` | Owner | Edit an owned draft report. |
| `POST` | `/api/reports/:id/submit` | Owner | Submit an owned draft report and set status. |
| `GET` | `/api/reports/me` | Authenticated | Paginated report history for the logged-in user. Filters: `projectId`, `startDate`, `endDate`. |
| `GET` | `/api/reports` | Manager | Paginated team reports. Filters: `week`, `userId`, `projectId`, `startDate`, `endDate`. |
| `GET` | `/api/reports/:id` | Owner or manager | Fetch one report. |
| `GET` | `/api/dashboard/summary` | Manager | Weekly submitted count, expected count, compliance rate, and open blockers. Filters: `week`, `projectId`. |
| `GET` | `/api/dashboard/submission-status` | Manager | Per-member and per-project submission status for a week. Filters: `week`, `projectId`. |
| `GET` | `/api/dashboard/tasks-trend` | Manager | Weekly report count and hours trend. Filters: `userId`, `projectId`, `startDate`, `endDate`. |
| `GET` | `/api/dashboard/workload-distribution` | Manager | Report, hour, and blocker counts grouped by project. Filters: `week`, `projectId`. |
| `GET` | `/api/dashboard/recent-activity` | Manager | Recent submitted reports, paginated. Filters: `projectId`. |
| `POST` | `/api/ai-chat/query` | Manager | Ask Gemini a question over filtered report context. Body: `{ "question": "..." }`. |
| `GET` | `/api/ai-chat/history` | Manager | Paginated AI query history for the current manager. |

## Useful Request Bodies

Register:

```json
{
  "name": "New Member",
  "email": "member2@example.com",
  "password": "Password123!"
}
```

Create report:

```json
{
  "projectId": 1,
  "weekStart": "2026-06-29",
  "weekEnd": "2026-07-05",
  "tasksCompleted": "Finished auth middleware and report filters.",
  "tasksPlanned": "Add dashboard chart endpoints.",
  "blockers": null,
  "hoursWorked": 32,
  "notes": "Ready for review."
}
```

AI query:

```json
{
  "question": "What blockers were reported for Internal Dashboard last week?"
}
```
