# Foodie Meknes - Restaurant Website

A professional restaurant website built with React, TypeScript, Express.js, and Supabase. Features include online ordering, admin dashboard, and real-time order management.

## 🚀 Features

### Customer Features
- **Responsive Design**: Mobile-first, fully responsive interface
- **Home Page**: Hero section with featured meals and popular items
- **Menu Page**: Dynamic food catalog with categories and filtering
- **Cart & Checkout**: Seamless ordering with customization options
- **Order Tracking**: Real-time order status updates
- **Cash on Delivery**: Secure payment on delivery option

### Admin Features
- **Secure Login**: Protected admin dashboard access
- **Order Management**: View and update order statuses (Pending → Confirmed → Preparing → Ready → Delivered)
- **Menu Management**: Add, edit, and delete menu items
- **Category Management**: Organize products by categories
- **Image Upload**: Upload and optimize product images
- **Real-time Updates**: Live order notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Zustand** for state management
- **React Router** for navigation
- **Lucide React** for icons
- **Sonner** for notifications

### Backend
- **Express.js** with TypeScript
- **Supabase** for database and authentication
- **Node.js** runtime
- **CORS** for cross-origin requests
- **Helmet** for security
- **Compression** for performance

### Database
- **PostgreSQL** via Supabase
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foodie-meknes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials in the `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

4. **Database Setup**
   
   Run the SQL migrations provided in the technical documentation to set up your database schema.

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   This will start both frontend and backend servers concurrently.

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   Add your Supabase credentials in the Vercel dashboard.

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

## 📱 Usage

### Customer Flow
1. Visit the website
2. Browse the menu by categories
3. Add items to cart with customizations
4. Proceed to checkout
5. Fill in delivery details
6. Place order with cash on delivery

### Admin Flow
1. Navigate to `/admin/login`
2. Login with admin credentials (demo: admin@foodiemeknes.com / admin123)
3. View and manage orders in the dashboard
4. Update order statuses as they progress
5. Manage menu items and categories

## 🔧 API Endpoints

### Restaurant API
- `GET /api/categories` - Get all categories
- `GET /api/products` - Get all products
- `GET /api/products/category/:categoryId` - Get products by category
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:orderId/status` - Update order status (admin)

### Authentication API
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/login` - Customer login (future)
- `POST /api/auth/register` - Customer registration (future)
- `POST /api/auth/logout` - User logout

## 🎨 Customization

### Colors
The website uses a warm color scheme:
- Primary: Orange (#FF6B35)
- Secondary: Red (#D32F2F)
- Background: White (#FFFFFF)
- Text: Dark Gray (#424242)

### Images
Images are automatically generated using AI for demonstration purposes. Replace with your actual food photography.

### Content
- Update restaurant name and branding in `src/components/Layout.tsx`
- Modify menu items in the admin dashboard
- Customize contact information in the footer

## 🔒 Security

- Supabase Row Level Security (RLS) enabled
- Environment variables for sensitive data
- Input validation and sanitization
- CORS protection
- Helmet security headers

## 📊 Performance

- Image optimization and lazy loading
- Code splitting with Vite
- Compression middleware
- Efficient database queries
- Real-time updates without page refresh

## 🧪 Testing

Run the development server and test all features:
- Browse menu and add items to cart
- Complete checkout process
- Login as admin and manage orders
- Test responsive design on mobile devices

## 📝 License

This project is licensed under the MIT License.

## 🤝 Support

For support, please contact: contact@foodiemeknes.com

---

Built with ❤️ for Meknes food lovers
