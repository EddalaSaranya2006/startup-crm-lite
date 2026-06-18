import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';

// NotFound component to handle 404 errors for unknown routes
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageContainer className="min-h-[80vh] flex flex-col items-center justify-center py-4 md:py-6 lg:py-8">
      {/* Error Code */}
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      
      {/* Error Message */}
      <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8">Oops! Page Not Found</p>
      
      {/* Return Home Link */}
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </Link>
      </PageContainer>
    </div>
  );
};

export default NotFound;
