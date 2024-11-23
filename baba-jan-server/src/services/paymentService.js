const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const paymentService = {};

// Create a payment intent
paymentService.createPaymentIntent = async (amount, currency = 'eur', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe Payment Error: ${error.message}`);
  }
};

// Refund a payment
paymentService.refundPayment = async (paymentIntentId, amount) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    });
    return refund;
  } catch (error) {
    throw new Error(`Stripe Refund Error: ${error.message}`);
  }
};

module.exports = paymentService;
