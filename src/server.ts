import express, { Request, Response } from 'express';
import cors from 'cors';
import clientRoutes from './routes/clientRoutes';
import loanRoutes from './routes/loanRoutes';
import userRoutes from './routes/userRoutes';
import errorHandler from './middleware/errorHandler';
import { setupSwagger } from './docs/swagger';

// Create Express app
const app = express();
app.use(express.json());
app.use(cors());

// --- Swagger Setup ---
setupSwagger(app);

// --- Routes ---
app.use('/api/clients', clientRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/users', userRoutes);

// --- Root Route ---
app.get('/', (req: Request, res: Response) => {
  res.send('Financial Loan Management API is running...');
});

// --- Error Handler ---
app.use(errorHandler);

// --- Server Listen ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Swagger docs: http://localhost:${PORT}/api-docs`);
});

export default app;
