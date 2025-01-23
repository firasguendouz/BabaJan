const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User'); // Adjust the path based on your project structure
require('dotenv').config(); // Load environment variables if required

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database.');

    // Super Admin Details
    const superAdmin = {
      name: {
        firstName: 'Super',
        lastName: 'Admin',
      },
      email: 'superadmin@example.com', // Change to your preferred email
      phone: '+491234567890', // Change to your preferred phone number
      password: 'SuperSecurePassword123!', // Change to a secure password
      role: 'super-admin',
    };

    // Check if a super-admin already exists
    const existingSuperAdmin = await User.findOne({ email: superAdmin.email });
    if (existingSuperAdmin) {
      console.log('Super-admin already exists.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(superAdmin.password, 10);

    // Create and save the super-admin
    const newSuperAdmin = new User({
      ...superAdmin,
      password: hashedPassword, // Use the hashed password
    });

    await newSuperAdmin.save();
    console.log('Super-admin injected successfully:', newSuperAdmin);
  } catch (err) {
    console.error('Error injecting super-admin:', err.message);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
})();
