import os

# Define the base directory
base_dir = "src"

# Define the structure as a dictionary
structure = {
    "src": {
        "api": [
            "apiEndpoints.js",
            "axiosInstance.js",
            "userApi.js",
            "orderApi.js",
            "itemApi.js",
            "promotionApi.js",
            "notificationApi.js"
        ],
        "assets": {
            "images": [],
            "icons": [],
            "styles": []
        },
        "components": {
            "common": [
                "Header.jsx",
                "Footer.jsx",
                "Button.jsx",
                "InputField.jsx",
                "Modal.jsx"
            ],
            "user": [
                "LoginForm.jsx",
                "RegisterForm.jsx",
                "Profile.jsx",
                "ChangePassword.jsx"
            ],
            "order": [
                "OrderList.jsx",
                "OrderDetails.jsx",
                "OrderSummary.jsx"
            ],
            "item": [
                "ItemList.jsx",
                "ItemDetails.jsx",
                "ItemCard.jsx"
            ],
            "promotion": [
                "PromotionList.jsx",
                "PromotionCard.jsx"
            ],
            "notification": [
                "NotificationList.jsx",
                "NotificationItem.jsx"
            ]
        },
        "context": [
            "AuthContext.jsx",
            "CartContext.jsx",
            "NotificationContext.jsx"
        ],
        "hooks": [
            "useAuth.js",
            "useFetch.js",
            "useNotifications.js"
        ],
        "pages": [
            "Home.jsx",
            "Login.jsx",
            "Register.jsx",
            "Profile.jsx",
            "Orders.jsx",
            "OrderDetails.jsx",
            "Items.jsx",
            "ItemDetails.jsx",
            "Promotions.jsx",
            "AdminDashboard.jsx"
        ],
        "routes": [
            "AppRoutes.jsx",
            "PrivateRoute.jsx",
            "AdminRoute.jsx"
        ],
        "state": [
            "store.js",
            "userSlice.js",
            "orderSlice.js",
            "itemSlice.js",
            "promotionSlice.js",
            "notificationSlice.js"
        ],
        "utils": [
            "helpers.js",
            "constants.js",
            "validations.js",
            "dateFormatter.js"
        ],
        "": ["App.jsx", "index.js", "main.css"]  # Root-level files
    }
}

# Function to create folders and files recursively
def create_structure(base, structure):
    for key, value in structure.items():
        if isinstance(value, dict):
            # If value is a dictionary, create a folder and recurse
            folder_path = os.path.join(base, key)
            os.makedirs(folder_path, exist_ok=True)
            create_structure(folder_path, value)
        elif isinstance(value, list):
            # If value is a list, create files in the current folder
            folder_path = os.path.join(base, key)
            os.makedirs(folder_path, exist_ok=True)
            for file in value:
                file_path = os.path.join(folder_path, file)
                with open(file_path, "w") as f:
                    f.write("")  # Create an empty file
        else:
            # If it's a string, create a file
            file_path = os.path.join(base, key)
            with open(file_path, "w") as f:
                f.write("")  # Create an empty file

# Create the structure
create_structure(".", structure)

print(f"Frontend structure has been generated under the '{base_dir}' directory.")
