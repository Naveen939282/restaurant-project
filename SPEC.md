# Gongura Hotel - Restaurant Management System Specification

## 1. Project Overview

**Project Name:** Gongura Hotel - Restaurant Management & Online Ordering System
**Project Type:** Full-stack Web Application
**Core Functionality:** A complete restaurant platform with online ordering, payment processing, and admin management dashboard
**Target Users:** Restaurant customers in Madanapalle, Andhra Pradesh, and restaurant administrators

## 2. Technology Stack

### Frontend
- React.js 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Redux Toolkit for state management
- React Icons for icons
- Razorpay Checkout for payments

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- CORS for cross-origin requests

### Database
- MongoDB Atlas (cloud)
- Collections: users, menuItems, orders, reviews

## 3. UI/UX Specification

### Color Palette
- **Primary:** #E63946 (Red - Gongura color)
- **Secondary:** #1D3557 (Deep Blue)
- **Accent:** #F4A261 (Orange)
- **Background:** #FEFEFE (Off-white)
- **Dark Mode Background:** #1A1A2E
- **Text Primary:** #2D3436
- **Text Secondary:** #636E72

### Typography
- **Headings:** Poppins (Bold)
- **Body:** Inter (Regular)
- **Accent:** Playfair Display (for brand name)

### Layout
- Mobile-first responsive design
- Max container width: 1280px
- Grid system: 12 columns
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

### Visual Effects
- Smooth transitions (300ms ease)
- Card hover effects with shadow
- Loading skeletons
- Page transition animations

## 4. Page Structure

### Customer Website

#### 4.1 Home Page
- **Navbar:** Logo, Menu, About, Contact, Cart icon, User icon, Dark mode toggle
- **Hero Section:** Full-width image with overlay, restaurant name, tagline, "Order Now" CTA
- **Featured Dishes:** Grid of 4 featured items with images
- **Popular Menu:** Horizontal scroll or grid of top items
- **Reviews Section:** Customer testimonials with ratings
- **Location Section:** Google Maps embed, address, hours
- **WhatsApp Float:** Fixed button bottom-right
- **Footer:** Links, social media, copyright

#### 4.2 Menu Page
- **Category Tabs:** Sticky navigation for categories
- **Search Bar:** Search menu items
- **Filter Dropdown:** Filter by category
- **Menu Grid:** Cards with image, name, description, price, add to cart
- **Cart Sidebar:** Slide-in cart with items

#### 4.3 Cart Page
- **Cart Items:** List with images, quantities, remove buttons
- **Quantity Controls:** +/- buttons
- **Order Summary:** Subtotal, delivery fee, total
- **Checkout Button:** Proceed to checkout

#### 4.4 Checkout Page
- **Delivery Details Form:** Name, phone, address
- **Payment Options:** Online (Razorpay) / Cash on Delivery
- **Place Order Button**

#### 4.5 User Account
- **Login/Signup Forms:** Modal or separate page
- **Order History:** List of past orders
- **Order Tracking:** Status display

### Admin Dashboard

#### 5.1 Login Page
- Secure admin login

#### 5.2 Dashboard Home
- **Stats Cards:** Total orders, revenue, pending orders
- **Recent Orders:** Quick view table

#### 5.3 Menu Management
- **Add Item Form:** Name, category, price, description, image upload
- **Edit/Delete:** Table with actions
- **Categories:** Manage categories

#### 5.4 Order Management
- **Orders Table:** All orders with status
- **Status Update:** Dropdown to change status (Received → Preparing → Ready → Delivered)

#### 5.5 Analytics
- **Charts:** Orders by day, revenue trends
- **Popular Dishes:** Top 5 items

## 6. Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  phone: String,
  address: String,
  role: String (enum: ['user', 'admin']),
  createdAt: Date
}
```

### MenuItem Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  isAvailable: Boolean,
  isFeatured: Boolean,
  createdAt: Date
}
```

### Order Schema
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    menuItem: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  deliveryAddress: String,
  phone: String,
  paymentMethod: String (enum: ['online', 'cod']),
  paymentStatus: String (enum: ['pending', 'paid', 'failed']),
  status: String (enum: ['received', 'preparing', 'ready', 'delivered', 'cancelled']),
  createdAt: Date
}
```

### Review Schema
```javascript
{
  user: ObjectId (ref: User),
  name: String,
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

## 7. API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Menu
- GET /api/menu
- GET /api/menu/:id
- POST /api/menu (admin)
- PUT /api/menu/:id (admin)
- DELETE /api/menu/:id (admin)

### Orders
- POST /api/orders
- GET /api/orders (user - own orders, admin - all)
- GET /api/orders/:id
- PUT /api/orders/:id/status (admin)

### Reviews
- GET /api/reviews
- POST /api/reviews

## 8. Features Checklist

- [x] Modern responsive UI
- [x] Dark mode toggle
- [x] WhatsApp floating button
- [x] Search and filter menu
- [x] Cart functionality
- [x] User authentication
- [x] Order placement (COD + Online)
- [x] Order tracking
- [x] Admin dashboard
- [x] Menu management
- [x] Order management
- [x] Analytics

## 9. Acceptance Criteria

1. Website loads without errors
2. Menu items display correctly with images
3. Cart add/remove works
4. Checkout flow completes
5. Razorpay payment integration works
6. Admin can add/edit/delete menu
7. Admin can update order status
8. Responsive on all devices
9. Dark mode toggles correctly
10. All API endpoints respond correctly

