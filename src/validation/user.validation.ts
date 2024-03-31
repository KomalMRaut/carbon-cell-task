// Import necessary modules and dependencies
import Joi from 'joi';

// Validation schema for user registration
export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
      ),
    )
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base':
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 numeric digit, and 1 special character',
      'any.required': 'Password is required',
    }),
});

// Validation schema for user login
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
