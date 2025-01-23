const mongoose = require('mongoose');
const fs = require('fs');
const axios = require('axios');

// MongoDB Category ID
const categoryId = "6743a5ad34d750a8afadb816"; // Replace with your actual Category ID

// Subcategory mapping (Subcategory slugs to MongoDB ObjectIds)
const subcategoriesMap = {
  "obst-bananen": "6743b388e8e94e088e169aa6",
  "obst-aepfel-birnen": "6743b388e8e94e088e169aaa",
  "obst-beeren": "6743b388e8e94e088e169aaf",
  "obst-exoten": "6743b388e8e94e088e169ab5",
  "obst-trauben-steinobst": "6743b388e8e94e088e169abc",
  "obst-zitrusfruechte": "6743b388e8e94e088e169ac4",
  "obst-melonen": "6743b388e8e94e088e169acd",
  "obst-snacks": "6743b388e8e94e088e169ad7"
};

// MongoDB connection string
const dbConnectionString = "mongodb://localhost:27017/yourDatabase"; // Update with your actual DB URI

// Parse products data from `details.json`
const parseProductsData = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const details = JSON.parse(fileContent);
  const productsData = {};

  details.categories.forEach(category => {
    const slug = category.slug;
    const products = category.products.products;
    productsData[slug] = products.map(product => ({
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      quantity: product.quantity,
      thumbnail: product.thumbnail,
      price: product.price,
      base_price: product.base_price,
      base_unit: product.base_unit
    }));
  });

  return productsData;
};

// Function to add a product to a subcategory
const addProductToSubcategory = async (subcategoryId, product) => {
  try {
    // Ensure subcategoryId is a valid MongoDB ObjectId
    const validSubcategoryId = new mongoose.Types.ObjectId(subcategoryId);

    const response = await axios.post(
      `http://localhost:5000/api/categories/${categoryId}/subcategories/${validSubcategoryId}/products`,
      product
    );
    console.log(`Successfully added product: ${product.name}`);
  } catch (error) {
    console.error(
      `Failed to add product: ${product.name} to subcategory ID: ${subcategoryId}`,
      error.response?.data || error.message
    );
  }
};

// Main function to process and add all products
const addAllProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const productsData = parseProductsData('./details.json'); // Path to your `details.json` file

    for (const [subcategorySlug, products] of Object.entries(productsData)) {
      const subcategoryMongoId = subcategoriesMap[subcategorySlug];
      if (!subcategoryMongoId) {
        console.error(`Subcategory not found for slug: ${subcategorySlug}`);
        continue;
      }

      for (const product of products) {
        await addProductToSubcategory(subcategoryMongoId, product);
      }
    }
  } catch (error) {
    console.error('Error occurred while adding products:', error.message);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
addAllProducts();
