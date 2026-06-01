# Todo REST API Documentation

This document provides detailed information about all available API endpoints, their request/response payloads, and authentication rules.

---

## Authentication Rules

All endpoints except **Login** and **Register** require authentication.
To access protected endpoints:
1. Obtain a JWT token by logging in or registering.
2. Include the token in the HTTP `Authorization` header of all subsequent requests:
   ```http
   Authorization: Bearer <rick2004>
   ```

---

## 🔑 Authentication Endpoints

### 1. Register User
Creates a new account in the system.
- **Route**: `POST /api/v1/auth/register`
- **Access**: Public
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "user" 
  }
  ```
  *(Note: `role` defaults to `"user"` if omitted. Can also be set to `"admin"`).*
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "data": {
      "user": {
        "_id": "658f8b8a...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isActive": true,
        "createdAt": "2026-06-02T00:00:00.000Z",
        "updatedAt": "2026-06-02T00:00:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure (e.g., email invalid, password too short) or email already exists.

---

### 2. Login User
Logs in an existing user and returns a token.
- **Route**: `POST /api/v1/auth/login`
- **Access**: Public
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "user": {
        "_id": "658f8b8a...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isActive": true
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid credentials or account has been deactivated by an admin.

---

### 3. Get Current User (Me)
Retrieves the profile data of the logged-in user.
- **Route**: `GET /api/v1/auth/me`
- **Access**: Protected
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User profile fetched.",
    "data": {
      "user": {
        "_id": "658f8b8a...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isActive": true,
        "createdAt": "2026-06-02T00:00:00.000Z",
        "updatedAt": "2026-06-02T00:00:00.000Z"
      }
    }
  }
  ```

---

## 📋 Task Endpoints

### 1. Fetch Paginated & Filtered Tasks
Retrieves a list of tasks owned by the logged-in user.
- **Route**: `GET /api/v1/tasks`
- **Access**: Protected
- **Query Parameters (Optional)**:
  - `page`: Page number (default: `1`)
  - `limit`: Number of tasks per page (default: `10`, max: `100`)
  - `status`: Filter by status (`todo` | `in-progress` | `done`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Tasks fetched.",
    "data": {
      "tasks": [
        {
          "_id": "658f8c8a...",
          "title": "Complete Assignment",
          "description": "Deploy to Vercel and document API.",
          "status": "in-progress",
          "priority": "high",
          "dueDate": "2026-06-05T00:00:00.000Z",
          "owner": "658f8b8a...",
          "createdAt": "2026-06-02T00:10:00.000Z",
          "updatedAt": "2026-06-02T00:15:00.000Z"
        }
      ],
      "total": 1,
      "page": 1,
      "pages": 1
    }
  }
  ```

---

### 2. Create Task
Adds a new task for the logged-in user.
- **Route**: `POST /api/v1/tasks`
- **Access**: Protected
- **Request Body**:
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "status": "todo",
    "priority": "medium",
    "dueDate": "2026-06-10T00:00:00.000Z"
  }
  ```
  *(Note: `title` is required (min 3 chars). `status` must be `todo`, `in-progress`, or `done`. `priority` must be `low`, `medium`, or `high`)*
- **Success Response (210 Created)**:
  ```json
  {
    "success": true,
    "message": "Task created.",
    "data": {
      "task": {
        "_id": "658f8d...",
        "title": "Task Title",
        "description": "Task Description",
        "status": "todo",
        "priority": "medium",
        "dueDate": "2026-06-10T00:00:00.000Z",
        "owner": "658f8b8a...",
        "createdAt": "2026-06-02T00:20:00.000Z",
        "updatedAt": "2026-06-02T00:20:00.000Z"
      }
    }
  }
  ```

---

### 3. Get Single Task
Fetches a single task by ID.
- **Route**: `GET /api/v1/tasks/:id`
- **Access**: Protected (Owner only)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Task fetched.",
    "data": {
      "task": { ... }
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Task not found.
  - `403 Forbidden`: Authenticated user does not own this task.

---

### 4. Update Task
Modifies an existing task.
- **Route**: `PUT /api/v1/tasks/:id`
- **Access**: Protected (Owner only)
- **Request Body**: (Include only the fields you wish to update)
  ```json
  {
    "status": "done",
    "priority": "low"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Task updated.",
    "data": {
      "task": { ... }
    }
  }
  ```

---

### 5. Delete Task
Removes a task from the system.
- **Route**: `DELETE /api/v1/tasks/:id`
- **Access**: Protected (Owner only)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Task deleted."
  }
  ```

---

## 🛠️ Admin Endpoints

### 1. View All System Tasks
Fetches all tasks in the database across all users.
- **Route**: `GET /api/v1/tasks/admin/all`
- **Access**: Admin only
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "All tasks fetched.",
    "data": {
      "tasks": [
        {
          "_id": "658f8c8a...",
          "title": "Complete Assignment",
          "owner": {
            "_id": "658f8b8a...",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "status": "in-progress",
          "priority": "high",
          "dueDate": "2026-06-05T00:00:00.000Z"
        }
      ],
      "total": 1
    }
  }
  ```

---

### 2. View All Users
Lists all registered users.
- **Route**: `GET /api/v1/admin/users`
- **Access**: Admin only
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Users fetched.",
    "data": {
      "users": [
        {
          "_id": "658f8b8a...",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "user",
          "isActive": true
        }
      ],
      "total": 1
    }
  }
  ```

---

### 3. Toggle User Account Status
Blocks or unblocks a user. Blocked users cannot log in.
- **Route**: `PATCH /api/v1/admin/users/:id/toggle`
- **Access**: Admin only
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User deactivated.",
    "data": {
      "user": {
        "_id": "658f8b8a...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isActive": false
      }
    }
  }
  ```
