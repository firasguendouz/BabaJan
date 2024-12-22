const User = require('../../../models/User');
const bcrypt = require('bcryptjs');

// Admin Registration (Requires a code from Super Admin)
exports.registerAdmin = async (req, res) => {
  const { firstName, lastName, email, phone, password, code } = req.body;

  try {
    // Verify the provided code
    if (code !== process.env.SUPER_ADMIN_CODE) {
      return res.status(403).json({ success: false, message: 'Invalid Super Admin code.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Admin with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const adminUser = await User.create({
      name: { firstName, lastName },
      email,
      phone,
      password: hashedPassword,
      role: 'admin',
    });

    res.status(201).json({ success: true, message: 'Admin registered successfully.', data: adminUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during admin registration.' });
  }
};
