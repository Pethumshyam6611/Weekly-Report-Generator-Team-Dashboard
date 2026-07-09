# Weekly Report Generator & Team Dashboard Frontend

Next.js App Router frontend for weekly personal reports, manager analytics, project management, and AI-assisted report queries.

## Prerequisites

- Node.js LTS, version 20 or newer recommended
- The backend API running separately

## Install

```bash
npm install
```

## Environment Setup

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Set:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API, for example `http://localhost:5000/api`. |

## Run

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Auth Token Storage

The backend returns JWT access and refresh tokens in JSON. This frontend stores those tokens in `localStorage` so the configured axios client can attach `Authorization: Bearer <access_token>` and silently retry one request after refreshing on a 401.

Because Next.js middleware cannot read `localStorage`, the app also writes non-sensitive cookies named `wr_auth` and `wr_role` for route redirects. These cookies do not contain JWTs. The tradeoff is that localStorage tokens are accessible to JavaScript, so production deployments should use strong XSS protections and can later switch to httpOnly cookies if the backend supports them.

## Role And Route Rules

- Unauthenticated users are redirected to `/login`.
- Team members can access `/reports`, `/reports/new`, and `/reports/[id]`.
- Managers are redirected away from member report routes to `/dashboard`.
- Team members are redirected away from manager routes to `/reports`.
- Manager accounts are not created through the public register form. The backend supports manager registration through `MANAGER_INVITE_CODE` or seed data.

## Report Editing Rule

The frontend matches the backend rule: only draft reports are editable. Once a report is submitted, the form becomes read-only and shows a submitted-report banner.

## Project Assignment Rule

Managers can assign team members to projects and remove existing assignments from the project management screen. Team members only see projects assigned to them, and inactive projects are displayed as unavailable for new reports.

## AI Response Formatting

The AI assistant displays report answers as readable chat messages. Lines returned as `- item` or `* item` are rendered as bullet lists so manager summaries stay easy to scan.

## Pages

| Path | Role | Purpose |
| --- | --- | --- |
| `/login` | Public | Log in and route by role. |
| `/register` | Public | Create a team member account. |
| `/reports` | Team member | Personal report history grouped by week. |
| `/reports/new` | Team member | Create a draft report or submit immediately. |
| `/reports/[id]` | Team member | View or edit an owned draft report. |
| `/dashboard` | Manager | Summary metrics, charts, filters, and recent activity. |
| `/team-reports` | Manager | Filterable team report inbox with selected-report detail review. |
| `/projects` | Manager | Project CRUD, member assignment, and member unassignment. |
| `/ai-assistant` | Manager | Gemini-backed report assistant with scrollable chat history. |

## API Integration

All HTTP calls live in `lib/api/*.api.ts`. Components and pages call typed API helper functions rather than axios or fetch directly.

Project management uses:

- `assignUserToProject(projectId, userId)` for `POST /projects/:id/assign`
- `unassignUserFromProject(projectId, userId)` for `DELETE /projects/:id/members/:userId`

Dashboard data accepts `projectId` where supported by the backend so charts, submission status, and activity match the selected project filter.

The axios client in `lib/api/axiosClient.ts`:

- Reads the API base URL from `NEXT_PUBLIC_API_URL`.
- Attaches the access token to requests automatically.
- Attempts one silent refresh on `401`.
- Redirects to `/login` if refresh fails.
