import Joi from 'joi';

// Validation schema for admin login
export const validateAdminLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// Validation schema for item creation
export const validateItem = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().positive().required(),
    category: Joi.string().required(),
    available: Joi.boolean().required(),
  });
  return schema.validate(data);
};

// Validation schema for promotions
export const validatePromotion = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    discount: Joi.number().min(0).max(100).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required(),
    isActive: Joi.boolean(),
  });
  return schema.validate(data);
};
