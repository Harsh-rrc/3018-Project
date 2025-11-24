process.env.DOTENV_CONFIG_SILENT = 'true'; // Suppress dotenv logs

import { ClientRepository } from './src/repositories/clientRepository';
import { LoanRepository } from './src/repositories/LoanRepository';

// Keep references to original console methods
const originalConsoleInfo = console.info;
const originalConsoleError = console.error;

// Suppress emailService logs during tests
beforeAll(() => {
  console.info = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('[emailService]')) return;
    originalConsoleInfo.apply(console, args);
  };
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('[emailService]')) return;
    originalConsoleError.apply(console, args);
  };
});

// Clear repositories before all tests to avoid state leak causing 404 errors
beforeAll(() => {
  ClientRepository.getInstance().clear();
  LoanRepository.getInstance().clear();
});

afterAll(() => {
  console.info = originalConsoleInfo;
  console.error = originalConsoleError;
});
