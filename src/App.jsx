import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';

// Main App component
function App() {
  return (
    // Wrap the entire application in BrowserRouter to enable routing
    <BrowserRouter>
      {/* Main layout wrapper: column on mobile, row on tablet/desktop, centered on 1440px+ */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row mx-auto max-w-[1440px] w-full">
        {/* Persistent Sidebar on the left (or bottom/top on mobile) */}
        <Sidebar />

        {/* Main content area takes up the remaining width. 
            Added top and bottom padding on mobile for fixed headers/navbars */}
        <main className="flex-1 w-full overflow-y-auto pt-16 pb-16 md:pt-0 md:pb-0">
          {/* AppRoutes contains all route definitions and their corresponding components */}
          <AppRoutes />
        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;
