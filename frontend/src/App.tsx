import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home.js';
import Search from './pages/Search.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import ProductDetail from './pages/ProductDetail.js';
import Cart from './pages/Cart.js';
import Checkout from './pages/Checkout.js';
import NotFound from './pages/NotFound.js';
import SellerDashboard from './pages/seller/Dashboard.js';
import Inventory from './pages/seller/Inventory.js';
import AddProduct from './pages/seller/AddProduct.js';
import SellerOrders from './pages/seller/Orders.js';
import AdminDashboard from './pages/admin/Dashboard.js';
import ModerationQueue from './pages/admin/ModerationQueue.js';
import Wishlist from './pages/Wishlist.js';
import { useAuthStore } from './store/authStore.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Navbar from './components/Navbar.js';
import BackgroundEffect from './components/BackgroundEffect.js';
import CursorTracker from './components/CursorTracker.js';
import PageWrapper from './components/PageWrapper.js';
import { useSocket } from './hooks/useSocket.js';


const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/products/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/cart" element={<ProtectedRoute><PageWrapper><Cart /></PageWrapper></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><PageWrapper><Checkout /></PageWrapper></ProtectedRoute>} />
        
        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={<ProtectedRoute roles={['seller', 'admin']}><PageWrapper><SellerDashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/seller/inventory" element={<ProtectedRoute roles={['seller', 'admin']}><PageWrapper><Inventory /></PageWrapper></ProtectedRoute>} />
        <Route path="/seller/add-product" element={<ProtectedRoute roles={['seller', 'admin']}><PageWrapper><AddProduct /></PageWrapper></ProtectedRoute>} />
        <Route path="/seller/orders" element={<ProtectedRoute roles={['seller', 'admin']}><PageWrapper><SellerOrders /></PageWrapper></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/admin/moderation" element={<ProtectedRoute roles={['admin']}><PageWrapper><ModerationQueue /></PageWrapper></ProtectedRoute>} />

        <Route path="/search" element={<PageWrapper><Search /></PageWrapper>} />
        <Route path="/wishlist" element={<ProtectedRoute><PageWrapper><Wishlist /></PageWrapper></ProtectedRoute>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  useSocket();
  return (
    <Router>
      <CursorTracker />
      <BackgroundEffect />
      <Navbar />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <div className="noise-overlay" />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
