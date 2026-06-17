import React, { Suspense, lazy, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import CreativePulse from './components/CreativePulse';
import CreativeMode from './components/CreativeMode';
import FloatingInspiration from './components/FloatingInspiration';

const CartDrawer = lazy(() => import('./components/MarketPlace/CartDrawer'));
const Home = lazy(() => import('./pages/Home'));
const Discover = lazy(() => import('./pages/Discover'));
const Events = lazy(() => import('./pages/Events'));
const EventDetails = lazy(() => import('./components/Events/EventDetails'));
const MarketPlace = lazy(() => import('./pages/MarketPlace'));
const Community = lazy(() => import('./pages/Community'));
const Learn = lazy(() => import('./pages/Learn'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings').then((module) => ({ default: module.Settings })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then((module) => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then((module) => ({ default: module.ResetPassword })));
const PublicProfile = lazy(() => import('./pages/PublicProfile').then((module) => ({ default: module.PublicProfile })));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Messages = lazy(() => import('./pages/Messages'));
const SavedCollections = lazy(() => import('./pages/SavedCollections'));
const Wallet = lazy(() => import('./pages/Wallet'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual';
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const frame = requestAnimationFrame(() => {
      resetScroll();
    });
    const delay = window.setTimeout(resetScroll, 80);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(delay);
    };
  }, [pathname, search]);
  return null;
};

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#050505] text-white">
    <Loader2 className="animate-spin text-indigo-500" size={48} />
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Suspense fallback={null}>
            <CartDrawer />
          </Suspense>
          <Navbar />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 2600,
              removeDelay: 400,
              style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' }
            }}
          />
          <ScrollToTop />
          <div className="min-h-screen bg-[#050505]">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/events" element={<Events />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/marketplace" element={<MarketPlace />} />
                <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
                <Route path="/learn" element={<PrivateRoute><Learn /></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-profile" element={<Profile />} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/profile/:id" element={<PublicProfile />} />
                <Route path="/portfolio/:id" element={<Portfolio />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/saved" element={<SavedCollections />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
          <CreativeMode />
          <FloatingInspiration />
          <CreativePulse />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
