import requests

# Base URL and Bearer Token
BASE_URL = "http://localhost:5000/api"
CATEGORY_URL = f"{BASE_URL}/categories"
headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDI1MGU3MzQ3NWMzMjdhNGE2ZmNiNCIsInJvbGUiOiJzdXBlci1hZG1pbiIsImlhdCI6MTczMjQ3MTQ4MCwiZXhwIjoxNzMyNTU3ODgwfQ.zX8BzCQcoVTd8Pz30gK7lq-zrgh__LJq6iNB4EAm9Ds",
    "Content-Type": "application/json"
}

# Data for categories and products
categories = [
    {
        "name": "Bananen",
        "slug": "obst-bananen",
        "products": [
            {"name": "Chiquita Bananen 5 Stk. (Costa Rica)", "sku": "11018350", "price": 2.59, "quantity": 50},
            {"name": "Bananen 5 Stk. (Ecuador)", "sku": "108500171", "price": 1.49, "quantity": 19},
            {"name": "Bananen 5 Stk. (Kolumbien)", "sku": "108500200", "price": 1.49, "quantity": 37},
        ],
    },
    {
        "name": "Äpfel & Birnen",
        "slug": "obst-aepfel-birnen",
        "products": [
            {"name": "Apfel Pink Lady 1kg (Italien)", "sku": "11016403", "price": 3.99, "quantity": 11},
            {"name": "Apfel Granny Smith 4 Stk. (Italien)", "sku": "109150256", "price": 1.99, "quantity": 8},
            {"name": "Apfel Jonagold 4 Stk. (Deutschland)", "sku": "109700326", "price": 2.76, "quantity": 20},
        ],
    },
    # Add other categories with their products here...
]

# Step 1: Create Categories and Subcategories
for category in categories:
    print(f"Processing category: {category['name']}")
    # Create the category
    response = requests.post(
        CATEGORY_URL,
        headers=headers,
        json={"name": category["name"], "slug": category["slug"]}
    )
    if response.status_code == 201:
        category_id = response.json()["id"]
        print(f"Category '{category['name']}' created successfully.")
    else:
        print(f"Failed to create category '{category['name']}':", response.json())
        continue

    # Create a subcategory
    subcategory_data = {"name": category["name"], "slug": category["slug"]}
    subcategory_response = requests.post(
        f"{CATEGORY_URL}/{category_id}/subcategories",
        headers=headers,
        json=subcategory_data
    )
    if subcategory_response.status_code == 201:
        subcategory_id = subcategory_response.json()["id"]
        print(f"Subcategory '{category['name']}' created successfully.")
    else:
        print(f"Failed to create subcategory '{category['name']}':", subcategory_response.json())
        continue

    # Step 2: Add Products to Subcategory
    for product in category["products"]:
        product_data = {
            "name": product["name"],
            "sku": product["sku"],
            "price": product["price"],
            "quantity": product["quantity"]
        }
        product_response = requests.post(
            f"{CATEGORY_URL}/{category_id}/subcategories/{subcategory_id}/products",
            headers=headers,
            json=product_data
        )
        if product_response.status_code == 201:
            print(f"Product '{product['name']}' added successfully.")
        else:
            print(f"Failed to add product '{product['name']}':", product_response.json())

print("\nAll categories and products processed.")
