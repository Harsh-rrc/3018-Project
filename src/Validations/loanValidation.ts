import Joi from 'joi';

export const createLoanSchema = Joi.object({
  clientId: Joi.string().required(),
  amount: Joi.number().positive().max(1000000).required(),
  interestRate: Joi.number().positive().max(100).required(),
  term: Joi.number().integer().positive().max(360).required(), // max 30 years
  status: Joi.string().valid('pending', 'approved', 'rejected', 'active', 'completed'),
});

export const updateLoanSchema = Joi.object({
  amount: Joi.number().positive().max(1000000),
  interestRate: Joi.number().positive().max(100),
  term: Joi.number().integer().positive().max(360),
  status: Joi.string().valid('pending', 'approved', 'rejected', 'active', 'completed'),
});