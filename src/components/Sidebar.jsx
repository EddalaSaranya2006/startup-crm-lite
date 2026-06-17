import { NavLink } from 'react-router-dom';

// Sidebar component for left navigation
const Sidebar = () => {
  // Navigation links data to render dynamically
  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/leads', label: 'Lead Management' },
    { path: '/analytics', label: 'Analytics' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col min-h-screen">
      {/* Logo / Brand Name */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 flex-shrink-0">
        <span className="text-xl font-bold text-blue-600">Startup CRM</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col space-y-2 py-6 px-4 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            // Tailwind classes for styling based on active state
            className={({ isActive }) =>
              `px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700' // Active state styling
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' // Inactive state styling
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
