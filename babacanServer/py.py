import requests

# Define the base URL and headers
base_url = "http://localhost:5000/api"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDI1MGU3MzQ3NWMzMjdhNGE2ZmNiNCIsInJvbGUiOiJzdXBlci1hZG1pbiIsImlhdCI6MTczMjQ3MTQ4MCwiZXhwIjoxNzMyNTU3ODgwfQ.zX8BzCQcoVTd8Pz30gK7lq-zrgh__LJq6iNB4EAm9Ds"
}

# Step 1: Create the product in the `Item` collection
item_payload = {
    "sku": "11018350",
    "name": "Chiquita Bananen 5 Stk. (Costa Rica)",
    "slug": "chiquita-bananen-5-stk-costa-rica",
    "quantity": 50,
    "thumbnail": "https://res.cloudinary.com/goflink/image/upload/b_rgb:F8F8F8/w_800,ar_1:1,c_fill,g_south/product-images-prod/b5574d05-d273-447a-8994-23b3b668d518.png",
    "price": {
        "amount": 2.59,
        "currency": "EUR"
    },
    "base_price": {
        "amount": 0.52,
        "currency": "EUR"
    },
    "base_unit": {
        "unit": "Stk.",
        "amount": 1
    }
}

item_response = requests.post(f"{base_url}/items/categories/6743a5ad34d750a8afadb816/subcategories/6743b388e8e94e088e169aa6/products", json=item_payload, headers=headers)

if item_response.status_code == 201:
    # Extract the generated ObjectId for the item
    item_id = item_response.json()["data"]["_id"]
    print(f"Item created successfully with ID: {item_id}")

    # Step 2: Add the product ObjectId to the subcategory
    subcategory_url = f"{base_url}/categories/6743a5ad34d750a8afadb816/subcategories/6743b388e8e94e088e169aa6/products"
    subcategory_payload = {"productId": item_id}

    subcategory_response = requests.post(subcategory_url, json=subcategory_payload, headers=headers)

    if subcategory_response.status_code == 200:
        print("Product added to subcategory successfully:", subcategory_response.json())
    else:
        print("Failed to add product to subcategory:", subcategory_response.status_code, subcategory_response.json())
else:
    print("Failed to create item:", item_response.status_code, item_response.json())
