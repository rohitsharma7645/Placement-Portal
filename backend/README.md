# Student Management API (Node.js)

The API is implemented with Express and Firebase Admin SDK. It listens on port `8000` by default, matching the frontend API URL.

## Run

From this directory, install dependencies with `npm install`, then start the server with `npm start`. For automatic restarts during development, use `npm run dev` (Node.js 20+).

Start the frontend separately from `../frontend` with `npm run dev`; Vite serves it at `http://localhost:5173` by default.

## Firebase configuration

The server loads the service-account JSON from `backend/firebase_key.json` by default. Keep this credential file private; it is excluded by this directory's `.gitignore`. Alternatively, set `GOOGLE_APPLICATION_CREDENTIALS` to its absolute path and `FIREBASE_DATABASE_URL` to the Realtime Database URL. `PORT` can override the API port.

## API routes

- `GET /` — health check
- `POST /register`, `POST /login`
- `GET /students`, `POST /students`, `PUT /students/:studentId`, `DELETE /students/:studentId`
- `GET /companies`, `POST /companies`, `PUT /companies/:companyId`, `DELETE /companies/:companyId`
