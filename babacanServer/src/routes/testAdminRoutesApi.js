const axios = require('axios');

// Base URL of your API
const BASE_URL = 'http://localhost:5000/api';

// Admin credentials for login
const adminEmail = 'admin@example.com';
const adminPassword = 'password123';
const newAdminEmail = 'newadmin@example.com';
const newAdminPassword = 'password123';

// Function to register an admin (Super Admin Only)
async function registerAdmin() {
  try {
    const response = await axios.post(`${BASE_URL}/admin/register`, {
      email: newAdminEmail,
      password: newAdminPassword,
      role: 'admin'
    });
    console.log('Admin Registration Response:', response.data);
  } catch (error) {
    console.error('Error during registration:', error.response ? error.response.data : error.message);
  }
}

// Function to login and get Bearer Token
async function loginAdmin() {
  try {
    const response = await axios.post(`${BASE_URL}/admin/login`, {
      email: adminEmail,
      password: adminPassword
    });
    const token = response.data.token;
    console.log('Login successful, Bearer Token:', token);
    return token; // Return the token to use in other requests
  } catch (error) {
    console.error('Error during login:', error.response ? error.response.data : error.message);
  }
}

// Function to get all users (requires Bearer Token)
async function getAllUsers(token) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('All Users:', response.data);
  } catch (error) {
    console.error('Error getting users:', error.response ? error.response.data : error.message);
  }
}

// Function to delete a user (requires Bearer Token)
async function deleteUser(token, userId) {
  try {
    const response = await axios.delete(`${BASE_URL}/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Deleted User:', response.data);
  } catch (error) {
    console.error('Error deleting user:', error.response ? error.response.data : error.message);
  }
}

// Function to update a user (requires Bearer Token)
async function updateUser(token, userId) {
  try {
    const response = await axios.patch(`${BASE_URL}/admin/users/${userId}`, {
      firstName: 'UpdatedName',
      lastName: 'UpdatedLastName'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Updated User:', response.data);
  } catch (error) {
    console.error('Error updating user:', error.response ? error.response.data : error.message);
  }
}

// Function to get order details (requires Bearer Token)
async function getOrderDetails(token, orderId) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Order Details:', response.data);
  } catch (error) {
    console.error('Error getting order details:', error.response ? error.response.data : error.message);
  }
}

// Function to update order status (requires Bearer Token)
async function updateOrderStatus(token, orderId) {
  try {
    const response = await axios.patch(`${BASE_URL}/admin/orders/${orderId}/status`, {
      status: 'shipped'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Updated Order Status:', response.data);
  } catch (error) {
    console.error('Error updating order status:', error.response ? error.response.data : error.message);
  }
}

// Function to create or update promotion (requires Bearer Token)
async function createOrUpdatePromotion(token) {
  try {
    const response = await axios.post(`${BASE_URL}/admin/promotions`, {
      title: 'Holiday Sale',
      discount: 20,
      validUntil: '2024-12-31'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Created or Updated Promotion:', response.data);
  } catch (error) {
    console.error('Error creating/updating promotion:', error.response ? error.response.data : error.message);
  }
}

// Function to get analytics (requires Bearer Token)
async function getAnalytics(token) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Analytics:', response.data);
  } catch (error) {
    console.error('Error getting analytics:', error.response ? error.response.data : error.message);
  }
}

// Function to delete a promotion (requires Bearer Token)
async function deletePromotion(token, promoId) {
  try {
    const response = await axios.delete(`${BASE_URL}/admin/promotions/${promoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Deleted Promotion:', response.data);
  } catch (error) {
    console.error('Error deleting promotion:', error.response ? error.response.data : error.message);
  }
}

// Main function to go through all the steps
async function runTests() {
  // Step 1: Register Admin
  await registerAdmin();

  // Step 2: Login and get Bearer Token
  const token = await loginAdmin();
  
  // Step 3: Test other endpoints with the token
  if (token) {
    await getAllUsers(token);
    await deleteUser(token, 'USER_ID'); // Replace with actual user ID
    await updateUser(token, 'USER_ID'); // Replace with actual user ID
    await getOrderDetails(token, 'ORDER_ID'); // Replace with actual order ID
    await updateOrderStatus(token, 'ORDER_ID'); // Replace with actual order ID
    await createOrUpdatePromotion(token);
    await getAnalytics(token);
    await deletePromotion(token, 'PROMO_ID'); // Replace with actual promo ID
  }
}

// Run all tests
runTests();
