# Finance Data Processing & Access Control Backend System

## Overview

This is a backend system designed to manage financial records with role-based access control. It provides APIs for handling transactions (income and expenses), along with summary endpoints for a dashboard.

## Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JSON Web Tokens (JWT) for authentication

## Setup Instructions

1. Clone the repository:

```bash
git clone <your-repo-link>
cd <project-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/financeDB
JWT_SECRET=your_secret_key
```

4. Start the server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`.

## Authentication and Roles

The system uses JWT-based authentication. After logging in, the token must be included in request headers:

```
Authorization: Bearer <token>
```

### Roles

**Role	Permissions**
Admin	Full access (CRUD records + user management)
Analyst	Read records + access dashboard insights
Viewer	Read-only access to dashboard

**Authentication Flow**

- User registers
- Logs in to receive JWT token
- Token is passed in headers:
- Authorization: Bearer <token>

## API Endpoints

### Auth

**POST /api/auth/register**

Registers a new user.

```json
{
  "name": "User",
  "email": "user@gmail.com",
  "password": "123456",
  "role": "viewer"
}
```

**POST /api/auth/login**

Returns a JWT token.

```json
{
  "email": "user@gmail.com",
  "password": "123456"
}
```

### Records

**POST /api/records** (Admin only)

Create a new financial record.

```json
{
  "amount": 500,
  "type": "expense",
  "category": "food",
  "date": "2026-04-04",
  "note": "dinner"
}
```

**GET /api/records**

Fetch records with support for:

* Filtering (`type`, `category`, date range)
* Search (`search` on category and notes)
* Pagination (`page`, `limit`)

Example:

```
/api/records?search=food&type=expense&page=1
```

**PUT /api/records/:id** (Admin only)

Update an existing record.


**DELETE /api/records/:id**

Records are not permanently deleted. Instead, they are marked using an `isDeleted` flag and excluded from all queries.

A restore endpoint is provided to revert a soft delete.

**PUT /api/records/restore/:id** (Admin only)

Restores a soft-deleted record by setting `isDeleted` back to `false`.

Response:

```json
{
  "message": "Record restored successfully",
  "record": { ... }
}
```

### Dashboard

**GET /api/dashboard**

Returns a summary including:

* Total income
* Total expenses
* Net balance
* Category-wise totals
* Monthly trends (income vs expense)
* Recent records

**GET /api/dashboard/category**

Category-wise totals.

**GET /api/dashboard/monthly**

Monthly aggregation with separate income and expense values.

**GET /api/dashboard/recent**

Latest records (limited set).


## Key Features

### 1. Search and Filtering

Records can be filtered by type, category, and date range. A simple search is implemented using case-insensitive matching on category and notes.

### 2. Pagination

Pagination is supported to avoid returning large datasets in a single request.

### 3. Soft Delete

Records are not permanently removed. Instead, they are marked using an `isDeleted` flag and excluded from all queries.

### 3. Restore Functionality

Records are not permanently removed. Restore functionality to recover deleted records.

## Assumptions

* Roles are assigned during registration.
* Admin users are trusted to manage data and roles.
* Soft delete is preferred to avoid permanent data loss.

## Tradeoffs

* The project uses a simple structure (routes + controllers) instead of a more layered architecture to keep things easy to follow.
* Role assignment is not restricted at the API level during registration (in a real system, this would be controlled).


## Author

Shamba Saha
