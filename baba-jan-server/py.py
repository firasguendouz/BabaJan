import requests
import json

# URLs
BASE_URL = "http://localhost:5000/api"
REGISTER_URL = f"{BASE_URL}/users/register"
LOGIN_URL = f"{BASE_URL}/users/login"
ITEMS_URL = f"{BASE_URL}/items"

# Step 2: Admin Login
admin_login_data = {
    "email": "admin@example.com",
    "password": "admin123"
}

print("\nLogging in admin...")
admin_login_response = requests.post(LOGIN_URL, json=admin_login_data)
admin_login_json = admin_login_response.json()

if admin_login_response.status_code == 200 and admin_login_json.get('success', False):
    admin_token = admin_login_json['token']
    print("Admin login successful. Token:", admin_token)
else:
    print("Admin login failed:", admin_login_json.get('message', 'Unknown error'))
    exit()

# Headers for authenticated requests
headers = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}

# Step 3: Create a new item
print("\nCreating a new item...")
item_data = {
    "name": {
        "en": "Apple",
    },
    "category": "Fruits",
    "photos": ["https://example.com/apple.jpg"],
    "unit": "kg",  # unit can be kg, piece, bunch, etc.
    "price": 2.99,  # Price per kg
    "stock": 100,
    "tags": ["Organic", "Seasonal"],
    "available": True
}

item_response = requests.post(ITEMS_URL, headers=headers, json=item_data)
if item_response.status_code == 201:
    item = item_response.json()['data']
    print("Item created successfully:", json.dumps(item, indent=2))
else:
    print("Failed to create item:", item_response.json())
    exit()

# Step 4: Update the created item
print("\nUpdating the created item...")
item_update_data = {
    "price": 3.49,  # Updated price per kg
    "stock": 150  # Updated stock
}

update_response = requests.put(f"{ITEMS_URL}/{item['_id']}", headers=headers, json=item_update_data)
if update_response.status_code == 200:
    updated_item = update_response.json()['data']
    print("Item updated successfully:", json.dumps(updated_item, indent=2))
else:
    print("Failed to update item:", update_response.json())
    exit()

# Step 5: Delete the item
print("\nDeleting the item...")
delete_response = requests.delete(f"{ITEMS_URL}/{item['_id']}", headers=headers)
if delete_response.status_code == 200:
    print("Item deleted successfully.")
else:
    print("Failed to delete item:", delete_response.json())
    exit()

# Step 6: Get all items
print("\nFetching all items...")
all_items_response = requests.get(ITEMS_URL, headers=headers)
if all_items_response.status_code == 200:
    all_items = all_items_response.json()
    print("All items fetched successfully:", json.dumps(all_items, indent=2))
else:
    print("Failed to fetch all items:", all_items_response.json())

# Step 7: Get item details by ID
print(f"\nFetching details of the created item ID: {item['_id']}...")
item_details_response = requests.get(f"{ITEMS_URL}/{item['_id']}", headers=headers)
if item_details_response.status_code == 200:
    item_details = item_details_response.json()
    print("Item details fetched successfully:", json.dumps(item_details, indent=2))
else:
    print("Failed to fetch item details:", item_details_response.json())
