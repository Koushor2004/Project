# Todo Backend API


🔗 **Live Deployment:** [https://project-i2hhfi6x0-koushors-projects.vercel.app](https://project-i2hhfi6x0-koushors-projects.vercel.app)


A secure, modular, and scalable REST API for the TaskManager application, built on **Node.js, Express, and MongoDB (Mongoose)**. Designed with enterprise-grade security and production-readiness, this API provides authentication, user roles, and full task-management capabilities.

## Key Features & Architectural Highlights

- **RESTful API Design**: Structured endpoints, appropriate HTTP verbs, standard JSON responses, and consistent HTTP status codes.
- **Robust Security**: 
  - JWT (JSON Web Tokens) for stateless authentication.
  - Password hashing with `bcryptjs` (salt rounds: 12).
  - Production-ready CORS setup supporting Vercel dynamic preview domains.
  - Secure headers using `helmet`.
  - Rate limiting to protect against Bruteforce/DDoS attacks.
- **Input Validation**: Strict request payload validation using `express-validator` to guarantee database sanitization and clean data injection.
- **Modular Controller-Service-Model Pattern**: Clean separation of concerns making the codebase highly maintainable.
- **Vercel Serverless Ready**: Packaged configuration to deploy as Node serverless functions with dynamic local/serverless logger switches.

---

## 📁 Project Structure

```
Backend/
├── src/
│   ├── config/          # Database & configuration settings
│   ├── controllers/     # Route logic handlers
│   ├── middleware/      # Auth check, error handling, validation filters
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # Express route definitions (divided by version)
│   ├── utils/           # Logger, API formatting, utility helpers
│   └── validators/      # Payload schema validators
├── app.js               # Main Express application definition
├── vercel.json          # Deployment configuration for Vercel
├── package.json         # Dependencies and scripts
└── README.md            # You are here
```

---

## 🛠️ Quick Start

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (local server running on `localhost:27017` or a MongoDB Atlas connection string)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root of the `Backend/` directory and configure the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Running Locally
Run the server in development mode:
```bash
npm run dev
```
The server will boot and connect to MongoDB, outputting logs directly to the console and to the local `logs/` directory.

---

## 🛡️ Evaluation Criteria Implementation

### 1. Security Practices
- **Authentication**: Stateful tokens via JWT are parsed in authorization headers (`Bearer <token>`). The [auth.js](Project/Backend/src/middleware/auth.js) middleware validates incoming sessions and appends the user context to the request.
- **Hashing**: Users' passwords are automatically hashed with `bcryptjs` in a Mongoose `pre-save` hook in [User.js](Project/Backend/src/models/User.js).
- **Validation**: Incoming parameters are checked in [taskValidator.js](Project/Backend/src/validators/taskValidator.js) using `express-validator` to prevent SQL/NoSQL Injection and reject invalid formats before controllers process requests.

### 2. Database Schema
- **User Schema**: Includes basic user profiles (`name`, `email`, `password`), custom user authorization rules (`role: 'user' | 'admin'`), and active account checks (`isActive`).
- **Task Schema**: Stores task entities mapping back to owners via Mongoose `ObjectId` referencing the `User` model, index-optimized for query performance.

---

## Scalability & Production Readiness Note

As the system grows from hundreds to millions of users, the application can scale horizontally and vertically using these strategies:

### 1. Stateless Serverless & Auto-Scaling
By routing requests via Vercel Serverless Functions, the application runs inside stateless container instances. This allows horizontal scaling out of the box:
- As incoming traffic spikes, Vercel automatically boots new isolated serverless containers to process requests in parallel.
- Since JWT is stateless and database sessions are not stored in memory, there is no shared-state issues between separate servers.

### 2. Database Scaling (Sharding and Indexing)
MongoDB can scale to accommodate massive write throughput:
- **Indexing**: We have already implemented Mongoose indexes (e.g., `{ owner: 1, status: 1 }`). This ensures MongoDB can search, filter, and paginate through tasks in $O(1)$ logarithmic time rather than performing full collection scans.
- **Replication**: Configure a MongoDB Atlas Replica Set (Primary-Secondary model). Read operations can be distributed across secondary nodes, while write operations are performed on the primary.
- **Sharding**: Partition data across multiple servers using a shard key (like `owner`). This divides the database load across physical machines.

### 3. Load Balancing & Microservices Transition
- **Load Balancing**: Vercel handles serverless distribution automatically. If transitioning to a containerized infrastructure (Docker/Kubernetes on AWS), a load balancer (like AWS ALB or NGINX) can distribute incoming API traffic using Round Robin across a pool of Express servers.
- **Microservices**: If task operations and user accounts scale differently, the auth controller can be split into a dedicated `Auth Microservice` while task processing runs as a separate `Task Service`, communicating asynchronously via a message broker like **RabbitMQ** or **Apache Kafka**.

---

## 📖 API Documentation & Postman Collection

- Complete API specification details are listed in [API_DOCUMENTATION.md]
- To test the API instantly, import the pre-configured [postman_collection.json]
