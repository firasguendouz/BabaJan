/**
 * Update user profile by user ID.
 * 
 * Finds the user by req.params.userId, updates their fields, 
 * and saves the changes in the database.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.userId - The ID of the user to update.
 * @param {Object} req.body - The update fields.
 * @param {Object} res - Express response object.
 */
const User = require('../../models/User');

async function updateUserProfile(req, res) {
  const { userId } = req.params;
  console.log('Received userId:', userId);

  try {
    // Find user in database
    const user = await User.findById(userId);
    console.log('Found user:', user);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Merge req.body into user object
    Object.assign(user, req.body);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: user,
    });
  } catch (err) {
    console.error('Error finding or updating user:', err.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred.',
    });
  }
}

module.exports = updateUserProfile;
