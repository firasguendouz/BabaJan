# Admin Registration
curl -X POST <BASE_URL>/admin/register -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{ "adminData": "values" }'

# Admin Login
curl -X POST <BASE_URL>/admin/login -H "Content-Type: application/json" -d '{ "email": "admin@example.com", "password": "password123" }'

# Get all users
curl -X GET <BASE_URL>/admin/users -H "Authorization: Bearer <TOKEN>"

# Delete a user
curl -X DELETE <BASE_URL>/admin/users/<USER_ID> -H "Authorization: Bearer <TOKEN>"

# Update a user profile
curl -X PATCH <BASE_URL>/admin/users/<USER_ID> -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{ "profileUpdates": "values" }'

# Get all orders
curl -X GET <BASE_URL>/admin/orders -H "Authorization: Bearer <TOKEN>"

# Update order status
curl -X PATCH <BASE_URL>/admin/orders/status -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{ "statusUpdates": "values" }'

# Create an item
curl -X POST <BASE_URL>/admin/items -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{ "itemDetails": "values" }'

# Update an item
curl -X PUT <BASE_URL>/admin/items/<ITEM_ID> -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{ "updates": "values" }'

# Delete an item
curl -X DELETE <BASE_URL>/admin/items/<ITEM_ID> -H "Authorization: Bearer <TOKEN>"

# Get all promotions
curl -X GET <BASE_URL>/admin/promotions -H "Authorization: Bearer <TOKEN>"

# Create/Update a promotion
curl -X POST <BASE_URL>/admin/promotions -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{ "promotionDetails": "values" }'

# Delete a promotion
curl -X DELETE <BASE_URL>/admin/promotions/<PROMO_ID> -H "Authorization: Bearer <TOKEN>"

# Get analytics
curl -X GET <BASE_URL>/admin/analytics -H "Authorization: Bearer <TOKEN>"
