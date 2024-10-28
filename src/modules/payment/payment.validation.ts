import Joi from 'joi';

const createPaymentBody = {
  studentId: Joi.string()
    .required()
    .min(6)
    .message('Student ID must be at least 6 characters of uppercase letters and numbers'),
  class: Joi.string()
    .required()
    .pattern(/^[1-9]|1[0-2]$/)
    .message('Class must be between 1 and 12'),
  month: Joi.string()
    .required()
    .valid(
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december'
    ),
  amount: Joi.number().required().min(1).max(100000).message('Amount must be between 1 and 100,000'),
};

export const createPayment = {
  body: Joi.object().keys(createPaymentBody),
};

export const getPayments = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string(),
    searchFields: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
  }),
};
