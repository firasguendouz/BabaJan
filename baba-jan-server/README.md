baba-jan-server/
├── src/
│   ├── config/                # Configuration files
│   │   ├── db.js             # Database connection (e.g., MongoDB/SQL)
│   │   ├── env.js            # Environment variable handling
│   │   └── telegramBot.js    # Telegram bot integration
│   ├── models/               # Data models
│   │   ├── Item.js           # Model for fruits and vegetables
│   │   ├── Promotion.js      # Model for promotions
│   │   ├── Order.js          # Model for orders
│   │   ├── User.js           # Model for user accounts
│   │   └── Notification.js   # Model for notifications
│   ├── controllers/          # Application logic
│   │   ├── itemController.js # CRUD operations for items
│   │   ├── orderController.js# Order-related operations
│   │   ├── userController.js # User account handling
│   │   ├── promoController.js# Promotions handling
│   │   ├── adminController.js# Admin-specific operations
│   │   └── notifController.js# Notification handling
│   ├── routes/               # API route definitions
│   │   ├── itemRoutes.js     # Routes for items
│   │   ├── orderRoutes.js    # Routes for orders
│   │   ├── userRoutes.js     # Routes for users
│   │   ├── promoRoutes.js    # Routes for promotions
│   │   ├── adminRoutes.js    # Routes for admin actions
│   │   └── notifRoutes.js    # Routes for notifications
│   ├── middleware/           # Middleware functions
│   │   ├── auth.js           # Authentication middleware
│   │   └── errorHandler.js   # Global error handling
│   ├── services/             # Business logic and utilities
│   │   ├── paymentService.js # Payment integration (e.g., Stripe)
│   │   ├── telegramService.js# Telegram notification logic
│   │   ├── emailService.js   # Email notification logic
│   │   └── promoService.js   # Promo logic helper functions
│   ├── utils/                # Utility functions
│   │   ├── validators.js     # Input validation utilities
│   │   ├── logger.js         # Logging utilities
│   │   └── helpers.js        # Miscellaneous helpers
│   ├── views/                # Frontend templates (if applicable)
│   ├── app.js                # Main app file (Express configuration)
│   └── server.js             # Server initialization
├── .env                      # Environment variables
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation
