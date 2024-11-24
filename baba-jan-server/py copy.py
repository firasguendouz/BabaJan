import requests
import json

# URLs
BASE_URL = "http://localhost:5000/api"
ITEMS_URL = f"{BASE_URL}/items"

# Bearer token for authentication
BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDI1MGU3MzQ3NWMzMjdhNGE2ZmNiNCIsInJvbGUiOiJzdXBlci1hZG1pbiIsImlhdCI6MTczMjQ3MTQ4MCwiZXhwIjoxNzMyNTU3ODgwfQ.zX8BzCQcoVTd8Pz30gK7lq-zrgh__LJq6iNB4EAm9Ds"

# List of items to add
items = [
    {"name": {"en": "Apple"}, "category": "Fruits", "photos": ["https://media.istockphoto.com/id/1391983099/de/foto/roter-apfel.webp?s=612x612&w=is&k=20&c=6e7D2eZD8BrENKZqN49ght0ij4cirZD-pHfT0Mw9m84="], "unit": "kg", "price": 2.99, "stock": 100, "tags": ["Organic", "Seasonal"], "available": True}
]

# Headers for authenticated requests
headers = {"Authorization": f"Bearer {BEARER_TOKEN}", "Content-Type": "application/json"}

# Step 1: Add all items
print("\nAdding items to the database...")
for item in items:
    response = requests.post(ITEMS_URL, headers=headers, json=item)
    if response.status_code == 201:
        print(f"Item '{item['name']['en']}' added successfully.")
    else:
        print(f"Failed to add item '{item['name']['en']}':", response.json())

print("\nAll items processed.")
