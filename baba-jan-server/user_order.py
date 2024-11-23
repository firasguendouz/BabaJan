import requests
import json
from datetime import datetime

# URLs
BASE_URL = "http://localhost:5000/api"
REGISTER_URL = f"{BASE_URL}/users/register"
LOGIN_URL = f"{BASE_URL}/users/login"
ORDER_URL = f"{BASE_URL}/orders"

# User Registration Data
user_data = {
    "name": {"firstName": "John", "lastName": "Doe"},
    "email": "john.doe@example.com",
    "phone": "+491244567890",
    "password": "password123"
}

# Step 1: Register the user
response = requests.post(REGISTER_URL, json=user_data)
if response.status_code == 201:
    print("User registration successful.")
else:
    print("User registration failed:", response.json())

# Step 2: Login the user to get the Bearer Token
login_data = {
    "email": "john.doe@example.com",
    "password": "password123"
}

login_response = requests.post(LOGIN_URL, json=login_data)
login_data = login_response.json()

if login_response.status_code == 200 and login_data.get('success', False):
    token = login_data['token']
    print("Login successful. Token:", token)
else:
    print("Login failed:", login_data.get('message', 'Unknown error'))
    exit()  # Exit if login failed

# Headers for authenticated requests
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# Step 3: Place an order
order_data = {
    "items": [
        {
            "itemId": "67411fd374c29f653761a48e",  # Replace with valid itemId
            "variationId": "67411fd374c29f653761a48f",  # Replace with valid variationId
            "quantity": 3
        }
    ],
    "paymentDetails": {
        "method": "cash-on-delivery",
        "transactionId": "cash-on-delivery",
        "paidAt": datetime.now().isoformat()
    },
    "deliveryInfo": {
        "type": "delivery",
        "address": "123 Main St, Berlin, 10115",
        "city": "Berlin",
        "postalCode": "10115",
        "country": "Germany",
        "scheduledAt": datetime.now().isoformat(),
        "deliveredAt": None
    }
}

print("Sending Order Data:", json.dumps(order_data, indent=2))
order_response = requests.post(ORDER_URL, headers=headers, json=order_data)

if order_response.status_code == 201:
    order_data = order_response.json()['data']
    order_id = order_data['_id']
    print("Order placed successfully:", order_data)
else:
    print("Order placement failed:", order_response.json())
    exit()

# Step 4: Fetch all user orders
print("\nFetching all user orders...")
user_orders_response = requests.get(ORDER_URL, headers=headers)

if user_orders_response.status_code == 200:
    print("User orders fetched successfully:", user_orders_response.json())
else:
    print("Failed to fetch user orders:", user_orders_response.json())

# Step 5: Fetch specific order details
print(f"\nFetching details for order ID: {order_id}")
order_details_response = requests.get(f"{ORDER_URL}/{order_id}", headers=headers)

if order_details_response.status_code == 200:
    print("Order details fetched successfully:", order_details_response.json())
else:
    print("Failed to fetch order details:", order_details_response.json())

# Step 6: Cancel an order
print(f"\nCanceling order ID: {order_id}")
cancel_order_response = requests.patch(f"{ORDER_URL}/{order_id}/cancel", headers=headers)

if cancel_order_response.status_code == 200:
    print("Order canceled successfully:", cancel_order_response.json())
else:
    print("Failed to cancel order:", cancel_order_response.json())
