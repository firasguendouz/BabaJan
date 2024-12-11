# Fix: Ensure directories exist before creating files

import os

# Define the structure
structure = {
    "src": [
        "api",
        "assets",
        {
            "components": [
                "common",
                "users",
                "orders",
                "items",
                "promotions",
                "notifications"
            ]
        },
        "context",
        "hooks",
        {
            "pages": [
                "Dashboard",
                "Users",
                "Orders",
                "Items",
                "Promotions",
                "Notifications"
            ]
        },
        "routes",
        "utils"
    ]
}

# Create directories and files
def create_structure(base_path, structure):
    for key in structure:
        if isinstance(key, str):
            path = os.path.join(base_path, key)
            os.makedirs(path, exist_ok=True)
        elif isinstance(key, dict):
            for folder, subfolders in key.items():
                folder_path = os.path.join(base_path, folder)
                os.makedirs(folder_path, exist_ok=True)
                create_structure(folder_path, subfolders)

# Base path for the project
base_path = "src"

# Generate the structure
create_structure(base_path, structure)

# Create placeholder files
placeholder_files = [
    "src/App.js",
    "src/index.js",
    "src/api/axiosInstance.js",
    "src/components/common/Table.js",
    "src/components/common/Modal.js",
    "src/components/common/Form.js",
    "src/pages/Dashboard/Dashboard.js",
    "src/pages/Users/UserList.js",
    "src/pages/Orders/OrderList.js",
    "src/pages/Items/ItemList.js",
    "src/pages/Promotions/PromotionList.js",
    "src/pages/Notifications/NotificationList.js",
    "src/utils/dateFormatter.js",
    "src/utils/validations.js",
    "src/utils/helpers.js"
]

# Ensure directories exist for placeholder files
for file_path in placeholder_files:
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w') as file:
        file.write("// Placeholder for " + file_path.split("/")[-1])

print("Project structure has been created!")
