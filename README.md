# Backend_BloggingPlatform_Assignment_MindBrowser
Built a full-stack blog application using React (frontend) and Node.js with Express (backend), with a focus on clean architecture, secure authentication, and a smooth user experience.

📦 Blog App Backend

This is the backend of the Full-Stack Blog Application, built with Node.js, Express.js, and MySQL using Sequelize ORM. It provides a RESTful API for user authentication and blog post management.

🚀 Technologies Used

- Node.js – JavaScript runtime environment
- Express.js – Fast, unopinionated web framework
- MySQL – Relational database system
- Sequelize – ORM for MySQL
- JWT (JSON Web Tokens) – Stateless authentication
- bcryptjs – Password hashing
- dotenv – Environment variable management
- CORS – Cross-origin requests
- cookie-parser – Parsing cookies

🔧 Setup Instructions

1. 📥 Clone and Navigate

git clone <repository-url>
cd blog-app/backend

2. 📦 Install Dependencies

npm install

Required packages:
npm install express sequelize mysql2 bcryptjs jsonwebtoken cors dotenv cookie-parser

3. 🗄️ Setup Database

Create a MySQL database (e.g., blog_db):

CREATE DATABASE blog_db;

4. ⚙️ Environment Variables

Create a .env file in the backend/ directory:

PORT=5000
JWT_SECRET=your-super-secret-jwt-key
DB_NAME=blog_db
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_HOST=localhost
DB_PORT=3306

5. 🔁 Sync Sequelize Models

node sync.js

This will create the Users and Posts tables automatically.

6. ▶️ Start the Server

node server.js

API server will be running at: http://localhost:5000

🔐 Authentication Flow

- Signup: /api/auth/signup
- Login: /api/auth/login
- Logout: /api/auth/logout

JWT is used for authentication. Tokens are returned upon login and must be sent in headers like:

Authorization: Bearer <your_token>

🔒 Security Measures

- Passwords are hashed using bcryptjs
- JWT authentication with expiry time
- Only post owners can edit/delete their posts
- Middleware enforces route protection
- Input validation and sanitization

🛠 Utility Scripts

- sync.js: Syncs Sequelize models with the database (creates tables if not exists)

🧪 Testing

Use Postman or any REST client to test API endpoints. Ensure to include the JWT token in the Authorization header for protected routes.
