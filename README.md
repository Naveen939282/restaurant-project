# 🍛 Gongura Hotel - Restaurant Management System

A complete restaurant management and online ordering system for "Gongura Hotel" in Madanapalle, Andhra Pradesh, India.

## 🚀 Features

### Customer Website
- 🍽️ **Menu Page** - Browse dishes by category with search and filter
- 🛒 **Shopping Cart** - Add/remove items with quantity controls
- 💳 **Checkout** - Online payment (Razorpay) or Cash on Delivery
- 👤 **User Account** - Login, register, view order history
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 💬 **WhatsApp Order** - Floating button for quick orders
- 📍 **Location** - Google Maps integration

### Admin Dashboard
- 📊 **Dashboard** - Overview stats, revenue, popular items
- 🍲 **Menu Management** - Add, edit, delete menu items
- 📦 **Order Management** - View and update order status
- ⭐ **Review Management** - Approve/reject customer reviews

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- React Router
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

### Additional
- JWT Authentication
- Razorpay Payment Integration

## 📁 Project Structure

```
gongura-hotel/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   │   └── admin/      # Admin pages
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node backend (root files)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Server entry point
│   └── .env               # Environment variables
│
├── package.json            # Root package.json
├── seed.js               # Database seeding script
└── README.md             # This file
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd d:/restarent
   ```

2. **Install Backend Dependencies**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Configure Environment Variables**

   Edit `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ADMIN_EMAIL=admin@gongurahotel.com
   ADMIN_PASSWORD=admin123
   ```

5. **Seed the Database** (optional - creates sample data)
   ```bash
   node seed.js
   ```

6. **Start the Backend Server**
   ```bash
   # From root directory
   npm run dev
   ```
   Server runs on http://localhost:5000

7. **Start the Frontend**
   ```bash
   # From client directory
   cd client
   npm run dev
   ```
   Client runs on http://localhost:5173

## 🔑 Demo Credentials

After running the seed script:

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@gongurahotel.com | admin123 |
| User  | user@test.com | user123 |

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/categories` - Get categories
- `POST /api/menu` - Create menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get orders (user: own, admin: all)
- `GET /api/orders/myorders` - Get user's orders
- `PUT /api/orders/:id/status` - Update order status (admin)

### Reviews
- `GET /api/reviews` - Get approved reviews
- `POST /api/reviews` - Submit review
- `PUT /api/reviews/:id/approve` - Approve review (admin)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

## ☁️ Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build the React app:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Add to `.env`

## 📸 Screenshots

The application features:
- Modern responsive UI
- Mobile-first design
- Smooth animations
- Restaurant-themed colors (Red #E63946)

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Images from Unsplash
- Icons from React Icons
- Payment gateway by Razorpay

---

Made with ❤️ for Gongura Hotel, Madanapalle

