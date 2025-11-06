# Products App API (Backend)

This is the backend for a full-stack CRUD application, built with Node.js, Express, and TypeScript. It provides a RESTful API for managing users and products, featuring JWT authentication and a two-tier (User/Admin) role-based access control system.

## ✨ Features

* **JWT Authentication:** Secure user registration (`/register`) and login (`/login`) using JSON Web Tokens.
* **Role-Based Access Control (RBAC):**
    * **`USER`:** Can view products.
    * **`ADMIN`:** Can view, create, update, and delete products, as well as view and manage user roles.
* **Full CRUD API:**
    * **Auth:** Register, Login.
    * **Products:** Create, Read, Update, Delete (Admin-only).
    * **Users:** Read all users, Update user roles (Admin-only).
* **API Documentation:** Live, interactive API documentation available at `/api-docs` via Swagger UI.
* **Logging:** Detailed request and error logging using `winston` and `morgan`.
* **Database:** Uses a MySQL database (designed for Aiven) with foreign key relationships.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MySQL (`mysql2` driver)
* **Authentication:** `jsonwebtoken` (JWT), `bcryptjs` (password hashing)
* **API Docs:** `swagger-jsdoc`, `swagger-ui-express`
* **Logging:** `winston`, `morgan`
* **Other:** `cors`, `dotenv`

---

## 🚀 Local Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/my-crud-backend.git](https://github.com/your-username/my-crud-backend.git)
    cd my-crud-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the Database:**
    * Create a MySQL database (e.g., on [Aiven](https://aiven.io/), which has a free tier).
    * Run the `schema.sql` script (provided below) to create the `users` and `products` tables.

4.  **Create `.env` file:**
    Create a `.env` file in the root of the project and add your database credentials and a JWT secret.

    ```ini
    # .env.example
    
    # Database Configuration (from Aiven)
    DB_HOST=your-aiven-host.aivencloud.com
    DB_USER=your-aiven-user
    DB_PASSWORD=your-aiven-password
    DB_DATABASE=defaultdb
    DB_PORT=12345

    # Server Configuration
    PORT=4000

    # JSON Web Token
    JWT_SECRET=a_very_strong_and_long_random_secret_key
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will be running at `http://localhost:4000`.
    The API docs will be at `http://localhost:4000/api-docs`.

---

## 📜 Available Scripts

* **`npm run dev`:** Starts the server with `ts-node-dev` (hot-reloading).
* **`npm run build`:** Compiles the TypeScript code to JavaScript in the `/dist` folder.
* **`npm run start`:** Runs the compiled JavaScript code (for production).

---

## 🗺️ API Endpoints

| Method | Path                  | Access  | Description                                        |
| :----- | :-------------------- | :------ | :------------------------------------------------- |
| **Auth** | | | |
| `POST` | `/api/auth/register`  | Public  | Registers a new user (defaults to `USER` role).      |
| `POST` | `/api/auth/login`     | Public  | Logs in a user, returns a JWT and user data (incl. role). |
| **Products** | | | |
| `GET`  | `/api/products`       | Public  | Gets a list of all products.                       |
| `GET`  | `/api/products/:id`   | Public  | Gets a single product by its ID.                   |
| `POST` | `/api/products`       | **Admin** | Creates a new product.                             |
| `PUT`  | `/api/products/:id`   | **Admin** | Updates an existing product.                       |
| `DELETE`| `/api/products/:id` | **Admin** | Deletes a product.                                 |
| **Users** | | | |
| `GET`  | `/api/users`          | **Admin** | Gets a list of all users (email, role, ID, created_at). |
| `PUT`  | `/api/users/:id/role` | **Admin** | Updates a user's role (e.g., `{ "role": "ADMIN" }`). |

---

## 🗄️ Database Schema (`schema.sql`)

```sql
-- Use the database created in your cloud service (e.g., 'defaultdb' on Aiven)
USE defaultdb;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    imageData LONGTEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);