import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';

// Main App component
function App() {
  return (
    // Wrap the entire application in BrowserRouter to enable routing
    <BrowserRouter>
      {/* Main layout wrapper changed to row direction (flex) for sidebar layout */}
      <div className="min-h-screen bg-gray-50 flex">
        {/* Persistent Sidebar on the left */}
        <Sidebar />

        {/* Main content area takes up the remaining width */}
        <main className="flex-1 w-full overflow-y-auto">
          {/* AppRoutes contains all route definitions and their corresponding components */}
          <AppRoutes />
        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;
