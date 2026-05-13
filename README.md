# ApplyFlow — Full-Stack Job Application Tracker

ApplyFlow is a full-stack web application that helps users track their job applications throughout the hiring process.

Users can create, view, and manage applications by storing information such as company name, role, application status, application date, and notes.

This application is designed for job seekers who want to stay organized during their job search.

---

# User Stories

## Auth

- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

## Applications

- A logged-in user can view all of their job applications
- A logged-in user can create a new job application
- A logged-in user can delete a job application
- A logged-in user can track the status of each application
- A logged-in user can add notes to an application

---

# Schema

## users

```txt
users
─────────────────────────────
user_id         SERIAL PRIMARY KEY
username        TEXT UNIQUE NOT NULL
password_hash   TEXT NOT NULL
```

## applications

```txt
applications
─────────────────────────────
application_id   SERIAL PRIMARY KEY
company          TEXT NOT NULL
role             TEXT NOT NULL
status           TEXT NOT NULL
date_applied     DATE
notes            TEXT
user_id          INTEGER REFERENCES users(user_id) ON DELETE CASCADE
```

A user has many job applications. Deleting a user cascades to delete all of their applications.

---

# API Contract

# Auth Endpoints

| Method | Endpoint           | Request Body           | Response                      |
| ------ | ------------------ | ---------------------- | ----------------------------- |
| POST   | /api/auth/register | { username, password } | { user_id, username }         |
| POST   | /api/auth/login    | { username, password } | { user_id, username }         |
| DELETE | /api/auth/logout   | —                      | { message }                   |
| GET    | /api/auth/me       | —                      | { user_id, username } or null |

---

# Application Endpoints (all require authentication)

| Method | Endpoint                          | Request Body                                   | Response                                                    |
| ------ | --------------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| GET    | /api/applications                 | —                                              | [{ application_id, company, role, status, notes, user_id }] |
| POST   | /api/applications                 | { company, role, status, date_applied, notes } | { application_id, company, role, status, notes, user_id }   |
| DELETE | /api/applications/:application_id | —                                              | { application_id, company, role, status, notes, user_id }   |

---

# Setup

## 1. Database

Create a local Postgres database:

```bash
createdb applyflow
```

---

## 2. Server

```bash
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and session secret.

Then seed the database:

```bash
npm run db:seed
```

Start the server:

```bash
npm run dev
```

The server runs on `http://localhost:8080`.

---

## 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

---

# Seed Users

After running `npm run db:seed`, these accounts are available:

| Username  | Password    |
| --------- | ----------- |
| demoUser  | password123 |
| recruiter | password123 |

---

# Application Structure

```txt
applyflow/
├── frontend/                  # React app (Vite)
│   ├── src/
│   │   ├── App.jsx            # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js
│   │   │   └── application-adapters.js
│   │   └── components/
│   │       ├── AuthPage.jsx
│   │       ├── ApplicationPage.jsx
│   │       ├── AddApplicationForm.jsx
│   │       ├── ApplicationList.jsx
│   │       └── ApplicationCard.jsx
│   └── vite.config.js
│
└── server/                    # Express + Postgres API
    ├── index.js
    ├── controllers/
    │   ├── authControllers.js
    │   └── applicationControllers.js
    ├── models/
    │   ├── userModel.js
    │   └── applicationModel.js
    ├── middleware/
    │   ├── checkAuthentication.js
    │   └── logRoutes.js
    └── db/
        ├── pool.js
        └── seed.js
```
