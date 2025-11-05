import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import logger, { morganStream } from './config/logger';
import { testConnection } from './db/mysql';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes'; 
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev', { stream: morganStream }));

// --- Setup Swagger UI Route ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test route
app.get('/api', (req: Request, res: Response) => {
  logger.debug('Test route /api was called');
  res.json({ message: 'Hello from the backend!' });
});

// --- Use our API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, async () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`API Docs available at http://localhost:${PORT}/api-docs`);
  try {
    await testConnection();
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
});