import Joi from 'joi';

// Validation schema for fetching entries
export const filterEntriesSchema = Joi.object({
  itemsPerPage: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1),
  category: Joi.string(),
});
