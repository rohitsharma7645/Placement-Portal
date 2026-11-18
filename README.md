# Student Management and Placement Portal

A React web application for a college placement office to manage student placement records, company opportunities, and placement activity. The project contains a Vite frontend and an Express API backed by Firebase Realtime Database.

## Features

- Placement dashboard with student and company summaries and charts
- Student directory, profile view, create, edit, and delete actions
- Export of the student placement list to Excel and PDF
- Company directory and create, edit, and delete actions
- Analytics and placement notifications generated from the current student and company records
- Login screen and protected dashboard routes

## Project layout

```text
.
├── backend/       Express API and Firebase Admin integration
└── frontend/      React, Vite, and Material UI application
```

## Requirements

- Node.js 20 or newer
- npm
- A Firebase Realtime Database and service-account credentials for the backend

## Run locally

1. Configure Firebase for the backend as described below.
2. In one terminal, start the API:

   ```sh
   cd backend
   npm install
   npm start
   ```

   The API listens on `http://localhost:8000` by default.

3. In a second terminal, start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite (usually `http://localhost:5173`). The frontend API client currently targets `http://localhost:8000`.

## Firebase configuration

The API uses Firebase Admin SDK and the Realtime Database URL configured in `backend/server.js`. By default, it looks for a service account JSON at `backend/firebase_key.json`. Keep that file private; it is excluded by `.gitignore`.

Alternatively, set these environment variables before starting the backend:

- `GOOGLE_APPLICATION_CREDENTIALS`: absolute path to a Firebase service-account JSON file. If omitted, the API checks the default `backend/firebase_key.json` path and then uses Application Default Credentials.
- `FIREBASE_DATABASE_URL`: Realtime Database URL. The source currently has a project-specific default.
- `PORT`: API port (defaults to `8000`).

The database uses `users`, `students`, and `companies` paths. User records are used by the login endpoint; student and company records are managed by the portal.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/` | API health check |
| `POST` | `/register` | Add a user record |
| `POST` | `/login` | Check an email/password against user records |
| `GET`, `POST` | `/students` | List or add students |
| `PUT`, `DELETE` | `/students/:studentId` | Update or remove a student |
| `GET`, `POST` | `/companies` | List or add companies |
| `PUT`, `DELETE` | `/companies/:companyId` | Update or remove a company |

## Authentication notes

The frontend stores a simple `isLoggedIn` flag in browser local storage for route guarding. The API currently compares submitted passwords directly with Firebase user records, and `/register` stores the submitted request body. This is a basic project implementation, not production-grade authentication. Before using real accounts or deploying publicly, replace it with a secure authentication provider, hashed passwords, authorization checks on API routes, and appropriately restricted Firebase rules.

See [CREDENTIALS.md](CREDENTIALS.md) for the account and credential status. No passwords are included in this repository.
