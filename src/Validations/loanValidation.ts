import Joi from 'joi';

export const createLoanSchema = Joi.object({
  clientId: Joi.string().alphanum().min(3).max(50).required(),
  amount: Joi.number().min(1000).max(1000000).required(),
  interestRate: Joi.number().min(0.1).max(100).required(),
  duration: Joi.number().integer().min(1).max(360).required(), // max 30 years
  status: Joi.string().valid('pending', 'approved', 'rejected', 'active', 'completed').default('pending'),
});

export const updateLoanSchema = Joi.object({
  amount: Joi.number().min(1000).max(1000000),
  interestRate: Joi.number().min(0.1).max(100),
  duration: Joi.number().integer().min(1).max(360),
  status: Joi.string().valid('pending', 'approved', 'rejected', 'active', 'completed'),
});

// Additional validation schema for filtering and sorting query params

export const loanQuerySchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected', 'active', 'completed'),
  riskStatus: Joi.string().valid('low', 'medium', 'high'),
  sortField: Joi.string().valid('amount', 'interestRate', 'duration', 'status', 'riskStatus'),
  sortOrder: Joi.string().valid('asc', 'desc'),
});
