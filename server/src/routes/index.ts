import authRouter from './auth';
import standupRouter from './standups';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from '../config/swagger';

export { authRouter, standupRouter };

export function registerRoutes(app: Express) {
  app.use('/api/auth', authRouter);
  app.use('/api/standups', standupRouter);
}

export function registerSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

export function registerHealthCheck(app: Express) {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Checkpoint API is running' });
  });
}

export function registerAll(app: Express) {
  registerSwagger(app);
  registerRoutes(app);
  registerHealthCheck(app);
} 