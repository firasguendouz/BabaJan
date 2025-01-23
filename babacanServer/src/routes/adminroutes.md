# Admin Login
curl -X POST http://localhost:5000/admin/login -H "Content-Type: application/json" -d '{"email": "admin@example.com", "password": "password123"}'

# Admin Registration (Super Admin Only)
curl -X POST http://localhost:5000/admin/register -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" | jq . -d '{"email": "newadmin@example.com", "password": "password123", "role": "admin"}'

# Get All Users (Admin Only)
curl -X GET http://localhost:5000/admin/users -H "Authorization: Bearer TOKEN" | jq .

# Delete a User (Admin Only)
curl -X DELETE http://localhost:5000/admin/users/USER_ID -H "Authorization: Bearer TOKEN" | jq .

# Update a User (Admin Only)
curl -X PATCH http://localhost:5000/admin/users/USER_ID -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" | jq . -d '{"firstName": "UpdatedName", "lastName": "UpdatedLastName"}'

# Get Order Details (Admin Only)
curl -X GET http://localhost:5000/admin/orders/ORDER_ID -H "Authorization: Bearer TOKEN" | jq .

# Get All Orders (Admin Only)
curl -X GET http://localhost:5000/admin/orders -H "Authorization: Bearer TOKEN" | jq .

# Update Order Status (Admin Only)
curl -X PATCH http://localhost:5000/admin/orders/ORDER_ID/status -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" | jq . -d '{"status": "shipped"}'

# Update an Order (Admin Only)
curl -X PATCH http://localhost:5000/admin/orders/ORDER_ID -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" | jq . -d '{"deliveryMethod": "express"}'

# Get All Promotions (Admin Only)
curl -X GET http://localhost:5000/admin/promotions -H "Authorization: Bearer TOKEN" | jq .

# Create or Update Promotion (Admin Only)
curl -X POST http://localhost:5000/admin/promotions -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" | jq . -d '{"title": "Holiday Sale", "discount": 20, "validUntil": "2024-12-31"}'

# Delete a Promotion (Admin Only)
curl -X DELETE http://localhost:5000/admin/promotions/PROMO_ID -H "Authorization: Bearer TOKEN" | jq .

# Get Analytics (Admin Only)
curl -X GET http://localhost:5000/admin/analytics -H "Authorization: Bearer TOKEN" | jq .
