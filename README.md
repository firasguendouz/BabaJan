src/
├── api/
│   ├── apiEndpoints.js           # Centralized API endpoints
│   ├── axiosInstance.js          # Configured Axios instance
│   ├── userApi.js                # User-related API calls
│   ├── orderApi.js               # Order-related API calls
│   ├── itemApi.js                # Item-related API calls
│   ├── promotionApi.js           # Promotion-related API calls
│   └── notificationApi.js        # Notification-related API calls
│
├── assets/
│   ├── images/                   # Application images
│   ├── icons/                    # SVG or icon assets
│   └── styles/                   # Global styles (e.g., CSS, SCSS)
│
├── components/
│   ├── common/
│   │   ├── Header.jsx            # Header component
│   │   ├── Footer.jsx            # Footer component
│   │   ├── Button.jsx            # Reusable button component
│   │   ├── InputField.jsx        # Reusable input field
│   │   └── Modal.jsx             # Reusable modal component
│   │
│   ├── user/
│   │   ├── LoginForm.jsx         # Login form
│   │   ├── RegisterForm.jsx      # Register form
│   │   ├── Profile.jsx           # User profile component
│   │   └── ChangePassword.jsx    # Change password form
│   │
│   ├── order/
│   │   ├── OrderList.jsx         # List of user orders
│   │   ├── OrderDetails.jsx      # Order details view
│   │   └── OrderSummary.jsx      # Order summary widget
│   │
│   ├── item/
│   │   ├── ItemList.jsx          # List of items
│   │   ├── ItemDetails.jsx       # Item details view
│   │   └── ItemCard.jsx          # Item card component for listing
│   │
│   ├── promotion/
│   │   ├── PromotionList.jsx     # List of promotions
│   │   └── PromotionCard.jsx     # Promotion card component
│   │
│   └── notification/
│       ├── NotificationList.jsx  # List of notifications
│       └── NotificationItem.jsx  # Individual notification item
│
├── context/
│   ├── AuthContext.jsx           # Context for user authentication
│   ├── CartContext.jsx           # Context for shopping cart
│   └── NotificationContext.jsx   # Context for notifications
│
├── hooks/
│   ├── useAuth.js                # Custom hook for authentication
│   ├── useFetch.js               # Custom hook for API fetching
│   └── useNotifications.js       # Custom hook for notifications
│
├── pages/
│   ├── Home.jsx                  # Home page
│   ├── Login.jsx                 # Login page
│   ├── Register.jsx              # Register page
│   ├── Profile.jsx               # User profile page
│   ├── Orders.jsx                # Orders page
│   ├── OrderDetails.jsx          # Specific order details page
│   ├── Items.jsx                 # Items listing page
│   ├── ItemDetails.jsx           # Item details page
│   ├── Promotions.jsx            # Promotions page
│   └── AdminDashboard.jsx        # Admin dashboard page
│
├── routes/
│   ├── AppRoutes.jsx             # Define all application routes
│   ├── PrivateRoute.jsx          # Wrapper for protected routes
│   └── AdminRoute.jsx            # Wrapper for admin-only routes
│
├── state/                        # State management (optional if using Context API)
│   ├── store.js                  # Redux store configuration
│   ├── userSlice.js              # User-related state slice
│   ├── orderSlice.js             # Order-related state slice
│   ├── itemSlice.js              # Item-related state slice
│   ├── promotionSlice.js         # Promotion-related state slice
│   └── notificationSlice.js      # Notification-related state slice
│
├── utils/
│   ├── helpers.js                # Utility functions
│   ├── constants.js              # Constant values
│   ├── validations.js            # Validation functions (e.g., Joi)
│   └── dateFormatter.js          # Date formatting functions
│
├── App.jsx                       # Root component for the app
├── index.js                      # ReactDOM render entry point
└── main.css                      # Global CSS file
