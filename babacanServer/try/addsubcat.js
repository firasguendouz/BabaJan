const axios = require('axios');

// Define the category ID for 'obst'
const categoryId = '6743a5ad34d750a8afadb816';

// Subcategories to add
const subcategories = [
  { slug: 'obst-bananen', name: 'Bananen', products: [] },
  { slug: 'obst-aepfel-birnen', name: 'Äpfel & Birnen', products: [] },
  { slug: 'obst-beeren', name: 'Beeren', products: [] },
  { slug: 'obst-exoten', name: 'Exoten', products: [] },
  { slug: 'obst-trauben-steinobst', name: 'Trauben & Steinobst', products: [] },
  { slug: 'obst-zitrusfruechte', name: 'Zitrusfrüchte', products: [] },
  { slug: 'obst-melonen', name: 'Melonen', products: [] },
  { slug: 'obst-snacks', name: 'Snacks', products: [] },
];

// API base URL and token
const API_BASE_URL = 'http://localhost:5000/api/categories';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDI1MGU3MzQ3NWMzMjdhNGE2ZmNiNCIsInJvbGUiOiJzdXBlci1hZG1pbiIsImlhdCI6MTczMjQ3MTQ4MCwiZXhwIjoxNzMyNTU3ODgwfQ.zX8BzCQcoVTd8Pz30gK7lq-zrgh__LJq6iNB4EAm9Ds';

// Axios headers
const headers = {
  Authorization: `Bearer ${BEARER_TOKEN}`,
  'Content-Type': 'application/json',
};

// Function to add subcategories
async function addSubcategories(categoryId, subcategories) {
  for (const subcategory of subcategories) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${categoryId}/subcategories`,
        subcategory,
        { headers }
      );
      console.log(`Added subcategory: ${subcategory.name}`);
    } catch (error) {
      console.error(`Failed to add subcategory: ${subcategory.name}`, error.response?.data || error.message);
    }
  }
}

// Add subcategories
addSubcategories(categoryId, subcategories);
