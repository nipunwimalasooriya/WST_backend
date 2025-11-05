import swaggerJSDoc from 'swagger-jsdoc';
import logger from './logger';

const port = process.env.PORT || 4000;

// 1. Declare the variable at the top level
let swaggerSpec: object;

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRUD App API',
      version: '1.0.0',
      description:
        'API documentation for the full-stack CRUD application',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
    components: {
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        example: 'Something went wrong',
                    }
                }
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            email: { type: 'string', example: 'user@example.com' },
                        }
                    }
                }
            }
        }
    }
  },
  apis: ['./src/routes/*.ts'],
};

try {
  // 2. Assign the value inside the try block
  swaggerSpec = swaggerJSDoc(options);
  logger.info('Swagger JSDoc spec generated successfully.');

} catch (error) {
  logger.error('Error generating Swagger JSDoc spec:', error);
  process.exit(1);
}

// 3. Export the variable at the top level
export default swaggerSpec;