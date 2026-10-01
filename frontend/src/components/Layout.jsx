import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { Package, ShoppingCart, Truck, Zap, LogOut, Menu } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Package },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/shipments', label: 'Shipments', icon: Truck },
    { path: '/ai-insights', label: 'AI Insights', icon: Zap },
  ];

  return (
    <div className="dashboard-canvas min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 shadow-lg shadow-black/20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-100">Inventory Pro</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-slate-300">
                  {user.name}
                  <span className="ml-2 rounded-full bg-blue-500/15 px-2 py-1 text-xs text-blue-300 ring-1 ring-blue-400/30">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-orange-300 transition hover:bg-orange-500/10"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-4">
          {/* Sidebar */}
          <aside className={`dashboard-panel rounded-lg p-4 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <nav className="space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive(path)
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/50'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 border-t border-slate-800 pt-6">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-orange-300 transition hover:bg-orange-500/10"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="dashboard-panel rounded-lg p-6 md:col-span-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
