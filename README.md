# Vibe Commerce - Full Stack E-Commerce Application

A modern, fully-responsive MERN stack e-commerce application with beautiful animations, smooth scrolling effects, and premium UI/UX design.

## Features

- **Product Browsing**: Browse 8 premium tech products with detailed information
- **Shopping Cart**: Add/remove items, update quantities with real-time total calculation
- **Checkout System**: Simple checkout form with order confirmation receipt
- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion animations throughout the app
- **Modern UI**: Premium design with gradient accents and smooth transitions
- **Real-time Updates**: Cart updates instantly across all pages
- **Error Handling**: Comprehensive error handling and validation

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB (or local mock data)
- CORS enabled for frontend communication

### Frontend
- React 18
- React Router v6
- Framer Motion (animations)
- Lucide React (icons)
- CSS3 with custom properties

## Project Structure

\`\`\`
vibe-commerce/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── checkoutRoutes.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProductCard.js
│   │   │   └── (CSS files)
│   │   ├── pages/
│   │   │   ├── Products.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   └── (CSS files)
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── README.md
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional - app uses mock data by default)

### Backend Setup

1. Navigate to backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file (optional):
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vibe-commerce
\`\`\`

4. Start the server:
\`\`\`bash
npm start
\`\`\`

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

The frontend will open at `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart?userId=guest` - Get cart items
- `POST /api/cart?userId=guest` - Add item to cart
- `PUT /api/cart/:productId?userId=guest` - Update cart item quantity
- `DELETE /api/cart/:productId?userId=guest` - Remove item from cart

### Checkout
- `POST /api/checkout?userId=guest` - Place order

## Features Breakdown

### Animations
- Smooth page transitions with Framer Motion
- Product card hover effects with scale and shadow
- Cart item animations on add/remove
- Receipt confirmation animation
- Scroll-triggered animations for products
- Button hover and tap animations

### Responsive Design
- Mobile-first approach
- Breakpoints at 480px, 768px, and 1200px
- Flexible grid layouts
- Touch-friendly buttons and interactions
- Optimized images for all screen sizes

### User Experience
- Loading spinners during API calls
- Error messages with clear feedback
- Form validation with helpful messages
- Empty cart state with call-to-action
- Order confirmation with receipt details
- Sticky cart summary on checkout page

## Mock Data

The application includes 8 pre-loaded products:
1. Wireless Headphones Pro - ₹1,999
2. Smart Watch Ultra - ₹2,499
3. USB-C Fast Charger - ₹799
4. Portable SSD 1TB - ₹3,499
5. Mechanical Keyboard RGB - ₹1,299
6. 4K Webcam Pro - ₹1,599
7. Wireless Mouse Pro - ₹599
8. Phone Stand Premium - ₹399

## Customization

### Colors
Edit CSS variables in `frontend/src/index.css`:
\`\`\`css
:root {
  --primary: #1a1a1a;
  --secondary: #ffffff;
  --accent: #6366f1;
  /* ... more colors ... */
}
\`\`\`

### Products
Edit mock products in `backend/routes/productRoutes.js` or connect to MongoDB

### Animations
Adjust Framer Motion settings in component files for different animation speeds and effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Lazy loading of product images
- Optimized CSS with custom properties
- Efficient state management in React
- Smooth scrolling behavior
- Minimal re-renders with proper React hooks

## Future Enhancements

- User authentication and profiles
- Product search and filtering
- Wishlist functionality
- Payment gateway integration
- Order history and tracking
- Product reviews and ratings
- Admin dashboard

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ using React, Node.js, and MongoDB
