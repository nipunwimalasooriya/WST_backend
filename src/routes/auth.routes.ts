import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * components:
 * schemas:
 * UserRegister:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * description: The user's email address.
 * example: user@example.com
 * password:
 * type: string
 * description: The user's password (min 6 characters).
 * example: password123
 * UserLogin:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * example: user@example.com
 * password:
 * type: string
 * example: password123
 */

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserRegister'
 * responses:
 * '201':
 * description: User registered successfully.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
 * '400':
 * description: Email and password are required
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * '409':
 * description: User already exists
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Log in an existing user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserLogin'
 * responses:
 * '200':
 * description: User logged in successfully.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
 * '400':
 * description: Email and password are required
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * '401':
 * description: Invalid credentials
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', loginUser);

export default router;