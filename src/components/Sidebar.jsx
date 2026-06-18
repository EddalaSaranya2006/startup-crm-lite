import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart2, Menu, X } from 'lucide-react';
import DarkModeToggle from './common/DarkModeToggle';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Dashboard', subLabel: 'Overview & metrics', icon: LayoutDashboard },
    { path: '/leads', label: 'Leads', subLabel: 'Manage pipeline', icon: Users },
    { path: '/analytics', label: 'Analytics', subLabel: 'Data & reports', icon: BarChart2 },
  ];

  // Common NavLink styling function
  const getNavLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-3 md:px-4 md:py-3 rounded-xl md:rounded-md transition-all duration-200 ${
      isActive
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
        : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <>
      {/* ── MOBILE TOP HEADER ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 z-40">
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">Startup CRM</span>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-gray-600 dark:text-slate-400 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex items-center justify-around px-2 z-40 pb-safe">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full min-h-[44px] min-w-[44px] transition-colors ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <link.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium leading-none">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── SIDEBAR (TABLET / DESKTOP & MOBILE DRAWER) ── */}
      <aside
        className={`fixed md:sticky top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-screen bg-white dark:bg-slate-900 shadow-xl md:shadow-md border-r border-gray-200 dark:border-slate-800 flex flex-col transition-all duration-300 z-50 ${
          isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } md:w-24 lg:w-72`}
      >
        {/* Desktop Logo */}
        <div className="hidden md:flex h-16 items-center justify-center lg:justify-start lg:px-6 border-b border-gray-200 dark:border-slate-800 shrink-0">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400 hidden lg:block truncate">Startup CRM</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400 lg:hidden text-center w-full">SC</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col space-y-2 py-6 px-4 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={getNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
              <div className="min-w-[24px] flex items-center justify-center">
                <link.icon className="w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5" />
              </div>
              <div className="flex flex-col md:hidden lg:flex truncate">
                <span className="text-sm font-semibold">{link.label}</span>
                <span className="text-xs text-gray-400 dark:text-slate-500 hidden lg:block truncate">{link.subLabel}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Footer (Theme Toggle) */}
        <div className="hidden md:flex p-4 border-t border-gray-200 dark:border-slate-800 flex-col lg:flex-row items-center lg:justify-between gap-4">
          <span className="text-sm text-gray-500 dark:text-slate-400 font-medium hidden lg:block">Theme</span>
          <DarkModeToggle />
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-900/50 z-40 top-16"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
