const Joi = require('joi');

const validators = {};

// User Registration Validation
validators.validateRegistration = (data) => {
  const schema = Joi.object({
    name: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    }).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+49\d{10}$/).required().messages({
      'string.pattern.base': 'Phone number must be a valid German number (+49XXXXXXXXXX).',
    }),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// User Login Validation
validators.validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

// Item Validation
validators.validateItem = (data) => {
  const schema = Joi.object({
    name: Joi.object({
      en: Joi.string().required(),
      ar: Joi.string().optional(),
    }).required(),
    category: Joi.string().valid('Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Others').required(),
    photos: Joi.array().items(Joi.string().uri()).optional(),
    variations: Joi.array().items(
      Joi.object({
        size: Joi.string().valid('Small', 'Medium', 'Large', 'Custom').optional(),
        weight: Joi.number().min(0).optional(),
        price: Joi.number().min(0).required(),
        discount: Joi.number().min(0).max(100).optional(),
        sku: Joi.string().required(),
        stock: Joi.number().min(0).optional(),
        available: Joi.boolean().optional(),
      })
    ).optional(),
    unit: Joi.string().valid('piece', 'kg', 'bunch', 'liter', 'box').default('piece'),
    tags: Joi.array().items(Joi.string().valid('Organic', 'Seasonal', 'Imported', 'Local', 'Discounted')).optional(),
  });
  return schema.validate(data);
};

// Promotion Validation
validators.validatePromotion = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    type: Joi.string().valid('percentage', 'fixed', 'quantity-based', 'buy-one-get-one', 'custom').required(),
    discountValue: Joi.number().min(0).optional(),
    condition: Joi.object().optional(),
    applicableTo: Joi.object({
      items: Joi.array().items(Joi.string().regex(/^[a-f\d]{24}$/i)).optional(),
      categories: Joi.array().items(Joi.string()).optional(),
    }).optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data);
};

module.exports = validators;
