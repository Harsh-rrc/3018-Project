import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import clientRoutes from './routes/clientRoutes';
import loanRoutes from './routes/loanRoutes';
import errorHandler from './middleware/errorHandler';

process.env.DOTENV_CONFIG_SILENT = 'true';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/loans', loanRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Financial Loan API is running',
  });
});

// Error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  // Server started
});

export default app;
