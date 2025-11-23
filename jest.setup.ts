import { ClientRepository } from './src/repositories/clientRepository';
import { LoanRepository } from './src/repositories/LoanRepository';

const originalLog = console.log;
const isDotenvLog = (msg: string) =>
  msg.includes('[dotenv@') && msg.includes('injecting env');

console.log = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && isDotenvLog(args[0])) {
    return;
  }
  originalLog(...args);
};

beforeAll(() => {
  ClientRepository.getInstance().clear();
  LoanRepository.getInstance().clear();
});
