import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import CartDrawer from './components/MarketPlace/CartDrawer';

const Home = lazy(() => import('./pages/Home'));
const Discover = lazy(() => import('./pages/Discover'));
const Events = lazy(() => import('./pages/Events'));
const MarketPlace = lazy(() => import('./pages/MarketPlace'));
const Community = lazy(() => import('./pages/Community'));
const Learn = lazy(() => import('./pages/Learn'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const ProductDetails = lazy(() => import('./pages/ProductDetails')); 
const Dashboard = lazy(() => import('./pages/Dashboard'));


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#050505] text-white">
    <Loader2 className="animate-spin text-indigo-500" size={48} />
  </div>
);

const App = () => {
  return (
    <>
      <CartDrawer />
      <Navbar />
      <ScrollToTop />
      <div className="min-h-screen bg-[#050505]">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/events" element={<Events />} />
            <Route path="/marketplace" element={<MarketPlace />} />
            <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
            <Route path="/learn" element={<PrivateRoute><Learn /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/product/:id" element={<ProductDetails />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
};

export default App;