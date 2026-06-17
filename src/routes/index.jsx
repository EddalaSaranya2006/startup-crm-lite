import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load the page components for better performance (code splitting)
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Leads = lazy(() => import('../pages/Leads'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Product = lazy(() => import('../components/products/product'));

// Loading fallback component to show while lazily loaded components are being fetched
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// AppRoutes component holds all the route definitions
const AppRoutes = () => {
  return (
    // Suspense boundary wraps the routes to provide the fallback UI
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Define the main routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path='/products' element={<Product />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
