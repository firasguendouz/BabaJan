import Joi from 'joi';

/**
 * Validates user login credentials.
 * @param {object} data - The login data (email and password).
 * @returns {object} Validation result.
 */
export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

/**
 * Validates user registration data.
 * @param {object} data - The registration data (name, email, password, etc.).
 * @returns {object} Validation result.
 */
export const validateRegistration = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  });
  return schema.validate(data);
};

/**
 * Validates an item before adding/updating it.
 * @param {object} data - The item data (name, price, category, etc.).
 * @returns {object} Validation result.
 */
export const validateItem = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().min(3).required(),
    stock: Joi.number().min(0).required(),
  });
  return schema.validate(data);
};
