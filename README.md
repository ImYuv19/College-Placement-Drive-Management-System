# College Placement Drive Management System

A complete **B.Tech Computer Science Engineering** academic project for managing on-campus college placement drives.

Built with **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, and **React**.

---

## 📋 Problem Statement

Colleges conduct placement drives where companies visit the campus to recruit students. This system manages the entire placement process:

- **Placement Officers** create and manage placement drives
- **Students** browse drives, check eligibility, and apply
- **College Management** manages student data, batches, and accounts

The system enforces **CGPA-based eligibility** — a student whose CGPA is below the minimum required by a drive **cannot apply**.

---

## ✨ Features

### Student
- View available placement drives
- Check CGPA eligibility for each drive
- Apply for eligible drives
- Track application status (Applied → Shortlisted → Selected / Rejected)
- View personal profile

### Placement Officer
- Create, update, and close placement drives
- Add new companies
- View applications for each drive
- Update application status

### College Management
- View and edit student information
- Import student data via CSV/XLSX files
- Manage academic batches (create, activate)
- Manage placement officer account credentials
- Update own account credentials

### Security
- JWT-based authentication
- Role-based authorization (never trust frontend role)
- bcrypt password hashing
- No password exposure in API responses

---

## 🛠️ Technology Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Backend    | Node.js, Express.js           |
| Database   | MongoDB, Mongoose             |
| Auth       | JWT (jsonwebtoken), bcrypt    |
| Frontend   | React (Vite)                  |
| HTTP       | Axios                         |
| File Upload| Multer, xlsx                  |
| Routing    | React Router DOM              |

---

## 📁 Folder Structure

```
Backend project/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Login, profile
│   │   ├── companyController.js     # Company CRUD
│   │   ├── driveController.js       # Drive CRUD
│   │   ├── applicationController.js # Apply, status management
│   │   └── managementController.js  # Students, batches, accounts
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── roleMiddleware.js        # Role authorization
│   │   └── validationMiddleware.js  # Input validation
│   ├── models/
│   │   ├── User.js                  # Users (all roles)
│   │   ├── Company.js               # Companies
│   │   ├── Drive.js                 # Placement drives
│   │   ├── Application.js           # Student applications
│   │   └── Batch.js                 # Academic batches
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── driveRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── managementRoutes.js
│   ├── seed/
│   │   └── seedData.js              # Demo data (43 students)
│   ├── .env                         # Environment variables
│   ├── .env.example
│   ├── server.js                    # Main server entry
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── DriveCard.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── StudentLogin.jsx
│   │   │   ├── OfficerLogin.jsx
│   │   │   ├── ManagementLogin.jsx
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Drives.jsx
│   │   │   │   ├── DriveDetails.jsx
│   │   │   │   ├── Applications.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── officer/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Drives.jsx
│   │   │   │   ├── CreateDrive.jsx
│   │   │   │   ├── EditDrive.jsx
│   │   │   │   └── Applications.jsx
│   │   │   └── management/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Students.jsx
│   │   │       ├── ImportBatch.jsx
│   │   │       ├── Batches.jsx
│   │   │       ├── OfficerAccount.jsx
│   │   │       └── ManagementAccount.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or above)
- MongoDB (local or Atlas)
- npm

### Step 1: Clone or download the project

### Step 2: Setup Backend

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set:

```
MONGO_URI=mongodb://127.0.0.1:27017/placement_db
JWT_SECRET=placement_system_jwt_secret_key_2024
PORT=5001
```

**For MongoDB Atlas:**
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/placement_db?retryWrites=true&w=majority
```

### Step 4: Seed the Database

```bash
npm run seed
```

This creates:
- 43 dummy students
- 1 placement officer
- 1 college management account
- 3 batches
- 5 companies
- 6 placement drives
- 9 sample applications

### Step 5: Start Backend

```bash
npm run dev
```

Backend runs on: `http://localhost:5001`

### Step 6: Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role        | Username          | Password      |
|-------------|-------------------|---------------|
| Student     | `student001`      | `Student@123` |
| Officer     | `placement.officer`| `Officer@123` |
| Management  | `college.admin`   | `Admin@123`   |

All 43 students share the password `Student@123`.

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint          | Access    | Description         |
|--------|-------------------|-----------|---------------------|
| POST   | /api/auth/login   | Public    | Login (all roles)   |
| GET    | /api/auth/me      | Auth      | Get current profile |

### Companies
| Method | Endpoint          | Access    | Description         |
|--------|-------------------|-----------|---------------------|
| GET    | /api/companies    | Auth      | List companies      |
| POST   | /api/companies    | Officer   | Create company      |

### Drives
| Method | Endpoint                      | Access    | Description             |
|--------|-------------------------------|-----------|-------------------------|
| GET    | /api/drives                   | Auth      | List drives             |
| POST   | /api/drives                   | Officer   | Create drive            |
| GET    | /api/drives/:id               | Auth      | Get drive details       |
| PUT    | /api/drives/:id               | Officer   | Update drive            |
| DELETE | /api/drives/:id               | Officer   | Delete/close drive      |
| POST   | /api/drives/:id/apply         | Student   | Apply (CGPA check)      |
| GET    | /api/drives/:id/applications  | Officer   | View drive applications |

### Applications
| Method | Endpoint                      | Access    | Description               |
|--------|-------------------------------|-----------|---------------------------|
| GET    | /api/applications/my          | Student   | My applications           |
| PUT    | /api/applications/:id/status  | Officer   | Update application status |

### Management
| Method | Endpoint                            | Access     | Description            |
|--------|-------------------------------------|------------|------------------------|
| GET    | /api/management/students            | Management | List students          |
| GET    | /api/management/students/:id        | Management | Get student            |
| PUT    | /api/management/students/:id        | Management | Update student         |
| POST   | /api/management/students/import     | Management | Import from CSV/XLSX   |
| GET    | /api/management/batches             | Management | List batches           |
| POST   | /api/management/batches             | Management | Create batch           |
| PUT    | /api/management/batches/:id/activate| Management | Activate batch         |
| PUT    | /api/management/officer             | Management | Update officer account |
| PUT    | /api/management/account             | Management | Update own account     |

---

## 📊 Database Models

### User
Contains all three roles (student, officer, management).
- Students have: studentId, cgpa, batch
- Password is hashed with bcrypt (never returned in API)

### Company
Represents companies that conduct drives (name, location, description).

### Drive
A placement drive linked to a Company and Officer.
- Has minCgpa requirement
- Status: active or closed

### Application
Links a Student to a Drive.
- Status: Applied → Shortlisted → Selected / Rejected
- Unique constraint on student + drive (prevents duplicates)

### Batch
Academic year groups (e.g., 2026-27).
- Only one can be active at a time

---

## 🔒 How CGPA Eligibility Works

This is one of the **most important features** of the system.

When a student applies for a drive:

1. Backend verifies the JWT token
2. Backend verifies user role is `student`
3. Backend fetches student's CGPA from the **database** (not frontend)
4. Backend fetches drive's `minCgpa`
5. Compares: `student.cgpa >= drive.minCgpa`
6. If eligible → Application is created
7. If NOT eligible → Request is **rejected** with clear message:

```json
{
  "message": "You are not eligible for this placement drive.",
  "requiredCgpa": 7.0,
  "yourCgpa": 6.4
}
```

**Important:** Even though the frontend shows eligibility, the backend **always** performs the final check. Frontend validation alone is never trusted.

---

## 📖 Key Concepts Explained

### What is a REST API?
REST (Representational State Transfer) API is a way for the frontend and backend to communicate using HTTP methods (GET, POST, PUT, DELETE). Each URL represents a resource (like `/api/drives`), and the method determines the action.

### What is Express.js?
Express.js is a minimal web framework for Node.js. It makes it easy to create API endpoints, handle requests, use middleware, and send responses.

### What is MongoDB?
MongoDB is a NoSQL database that stores data as JSON-like documents. Unlike SQL databases, it doesn't use fixed tables and rows — instead, it uses collections and documents.

### What is Mongoose?
Mongoose is an ODM (Object Data Modeling) library for MongoDB. It lets us define schemas (structure) for our data and provides methods to create, read, update, and delete documents.

### What is JWT?
JSON Web Token (JWT) is a token format used for authentication. After login, the server creates a signed token containing the user's ID and role. The client sends this token with every request to prove identity.

### What is Middleware?
Middleware functions run between receiving a request and sending a response. Examples: checking if a user is logged in (auth middleware), checking if a user has the right role (role middleware).

### What is Authentication vs Authorization?
- **Authentication** = "Who are you?" (verifying identity via username/password)
- **Authorization** = "What can you do?" (checking if your role allows the action)

---

## 🧪 Testing Instructions

### Test CGPA Eligibility
1. Login as `student001` (CGPA: 9.5) → Should be able to apply to all drives
2. Login as `student030` (CGPA: 5.0) → Should be rejected from most drives
3. Login as `student016` (CGPA: 7.0) → Should apply to Wipro drive (minCgpa = 7.0, exactly at boundary)

### Test Role Authorization
1. Login as student → Try accessing officer or management pages → Should redirect
2. A student JWT cannot access `/api/management/students` → Returns 403

### Test Duplicate Applications
1. Login as student → Apply to a drive → Try applying again → Should see "already applied"

### Test Drive Management
1. Login as officer → Create, edit, close drives
2. Delete a drive with applications → Drive should be closed, not deleted

### Test Batch Import
1. Login as management → Go to Import Batch → Upload a CSV file

---

## ⚠️ Environment Configuration Required

Before running:
1. Ensure MongoDB is running (local) or MongoDB Atlas URI is configured
2. Set `MONGO_URI` in `backend/.env`
3. Set `JWT_SECRET` in `backend/.env`
4. Run `npm run seed` to populate demo data

---

## 📝 License

Academic project for educational purposes only. Not intended for production use.
