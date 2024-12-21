exports.validatePhoneNumber = (phone) => /^\+49\d{10}$/.test(phone);
