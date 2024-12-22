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
    phone: Joi.string().required(),
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
      en: Joi.string().required().trim().label('English Name'),
      de: Joi.string().allow('').trim().label('German Name'), // Allow empty string
    }).required().label('Name'),
    category: Joi.string().valid('Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Others').required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).default(0),
    available: Joi.boolean().default(true),
    photos: Joi.array().items(Joi.string().uri()).default([]),
    unit: Joi.string().valid('piece', 'kg', 'grams', 'liter', 'box').default('piece'),
    tags: Joi.array().items(Joi.string()).default([]),
  });

  return schema.validate(data);
};

validators.validateCategory = (data) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      slug: Joi.string().required(),
      subcategories: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          slug: Joi.string().required(),
        })
      ),
    });
    return schema.validate(data);
  };
// Order Validation
validators.validateOrder = (data) => {
  const schema = Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          itemId: Joi.string()
            .regex(/^[a-f\d]{24}$/i)
            .required()
            .messages({ 'string.pattern.base': 'Invalid itemId format.' }),
          variationId: Joi.string()
            .regex(/^[a-f\d]{24}$/i)
            .required()
            .messages({ 'string.pattern.base': 'Invalid variationId format.' }),
          quantity: Joi.number().min(1).required(),
        })
      )
      .min(1)
      .required(),
    deliveryInfo: Joi.object({
      type: Joi.string().valid('pickup', 'delivery').required(),
      address: Joi.when('type', {
        is: 'delivery',
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      city: Joi.when('type', {
        is: 'delivery',
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      postalCode: Joi.when('type', {
        is: 'delivery',
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      country: Joi.when('type', {
        is: 'delivery',
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      scheduledAt: Joi.date().optional(),
      deliveredAt: Joi.date().allow(null).optional(),
    }).required(),
    paymentDetails: Joi.object({
      method: Joi.string()
        .valid('cash-on-delivery', 'stripe', 'paypal', 'other')
        .required(),
      transactionId: Joi.when('method', {
        is: Joi.valid('stripe', 'paypal', 'other'),
        then: Joi.string().required(),
        otherwise: Joi.string().allow('').optional(),
      }),
      paidAt: Joi.date().optional(),
    }).required(),
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
