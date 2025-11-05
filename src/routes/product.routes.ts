import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { isAdmin, protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 * schemas:
 * Product:
 * type: object
 * required:
 * - name
 * - price
 * - user_id
 * properties:
 * id:
 * type: integer
 * description: The auto-generated id of the product
 * user_id:
 * type: integer
 * description: The id of the user who created the product
 * name:
 * type: string
 * description: The name of the product
 * description:
 * type: string
 * description: The product description
 * price:
 * type: number
 * format: decimal
 * description: The price of the product
 * imageData:
 * type: string
 * description: Base64 encoded image data (LONGTEXT)
 * created_at:
 * type: string
 * format: date-time
 * description: The date the product was created
 * example:
 * id: 1
 * user_id: 1
 * name: "Sample Product"
 * description: "This is a great product."
 * price: 29.99
 * imageData: "data:image/png;base64,iVBORw0KGgo..."
 * created_at: "2025-11-05T14:30:00.000Z"
 * ProductInput:
 * type: object
 * required:
 * - name
 * - price
 * properties:
 * name:
 * type: string
 * description:
 * type: string
 * price:
 * type: number
 * format: decimal
 * imageData:
 * type: string
 * example:
 * name: "New Product"
 * description: "A description for the new product."
 * price: 49.99
 * imageData: "data:image/png;base64,iVBORw0KGgo..."
 * securitySchemes:
 * bearerAuth:
 * type: http
 * scheme: bearer
 * bearerFormat: JWT
 *
 * security:
 * - bearerAuth: []
 */

/**
 * @swagger
 * tags:
 * name: Products
 * description: The product management API
 */

/**
 * @swagger
 * /api/products:
 * get:
 * summary: Returns the list of all the products
 * tags: [Products]
 * responses:
 * '200':
 * description: The list of the products
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Product'
 * post:
 * summary: Create a new product (Requires Login)
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ProductInput'
 * responses:
 * '201':
 * description: The product was successfully created
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * '400':
 * description: Name and price are required
 * '401':
 * description: Not authorized, no token or token failed
 */
router.route('/')
  .get(getAllProducts)
  .post(protect, isAdmin, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 * get:
 * summary: Get a product by its id
 * tags: [Products]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: The product id
 * responses:
 * '200':
 * description: The product description by id
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * '404':
 * description: Product not found
 * put:
 * summary: Update a product by its id (Requires Login)
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: The product id
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ProductInput'
 * responses:
 * '200':
 * description: The product was updated
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * '400':
 * description: Name and price are required
 * '401':
 * description: Not authorized, token failed
 * '403':
 * description: User not authorized to update this product
 * '404':
 * description: Product not found
 * delete:
 * summary: Delete a product by its id (Requires Login)
 * tags: [Products]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: The product id
 * responses:
 * '200':
 * description: Product removed
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Product removed
 * '401':
 * description: Not authorized, token failed
 * '403':
 * description: User not authorized to delete this product
 * '404':
 * description: Product not found
 */
router.route('/:id')
  .get(getProductById)
.put(protect, isAdmin, updateProduct)
  .delete(protect, isAdmin, deleteProduct);

export default router;