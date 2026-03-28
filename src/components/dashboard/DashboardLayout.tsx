/**
 * Dashboard Layout
 * Persistent sidebar navigation + header + content area
 * Used as a wrapper for all /dashboard/* routes
 */

import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Heart,
  Users,
  Scale,
  FileText,
  Menu,
  X,
  LogOut,
  Home,
  Plus,
  Banknote,
  ShieldCheck,
  ScrollText
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { GoogleTranslate } from '../ui/GoogleTranslate';
import { useAuth } from '../../context/AuthContext';
import { useUserProfileStore } from '../../store/useUserProfileStore';
import { useAppStore } from '../../store/useAppStore';
import { DEMO_PARTNER_NAMES } from '../../lib/demoData';
import { deletePartner } from '../../lib/userProfileService';
import { supabase } from '../../lib/supabase';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/self-analysis', icon: User, label: 'Self Analysis' },
  { to: '/dashboard/partners', icon: Users, label: 'Partners' },
  { to: '/dashboard/compatibility', icon: Heart, label: 'Compatibility' },
  { to: '/dashboard/compare', icon: Scale, label: 'Compare' },
  { to: '/dashboard/reports', icon: FileText, label: 'Saved Reports' },
];

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { selfChart, isDemoMode, isAdmin } = useUserProfileStore();
  const currentReport = useAppStore((s) => s.currentReport);
  const navigate = useNavigate();

  const displayName = isDemoMode
    ? 'Demo Mode'
    : (user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User');
  const avatarUrl = isDemoMode ? undefined : user?.user_metadata?.avatar_url;

  const exitDemoMode = async () => {
    const store = useUserProfileStore.getState();
    const saved = store._preDemoState;

    // Clean up demo partners from cloud if they were accidentally saved
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const demoPartners = store.partners.filter(p => DEMO_PARTNER_NAMES.has(p.name));
        for (const p of demoPartners) {
          try { await deletePartner(p.id); } catch { /* ignore */ }
        }
      }
    } catch { /* ignore cleanup errors */ }

    // Restore pre-demo state if available, then load from cloud
    if (saved) {
      useUserProfileStore.setState({
        selfChart: saved.selfChart,
        selfBirthData: saved.selfBirthData,
        selfReport: saved.selfReport,
        partners: saved.partners,
        isDemoMode: false,
        _preDemoState: null,
      });
    } else {
      store.reset();
    }

    // Load real user data from cloud (will merge/override if available)
    store.loadFromCloud();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-700/50'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-850 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--sidebar-bg, inherit)' }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <NavLink to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClasses}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}

          {currentReport && (
            <NavLink
              to="/report"
              className={navLinkClasses}
              onClick={() => setSidebarOpen(false)}
            >
              <ScrollText className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">
                {currentReport.chartA.name} &amp; {currentReport.chartB.name}
              </span>
            </NavLink>
          )}

          {/* Quick Actions */}
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Quick Actions
            </p>
            {!selfChart && (
              <NavLink
                to="/self-calculator"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <User className="w-5 h-5" />
                Create Profile
              </NavLink>
            )}
            <NavLink
              to="/add-partner"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <Plus className="w-5 h-5" />
              Add Partner
            </NavLink>
            <NavLink
              to="/affiliate"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <Banknote className="w-5 h-5" />
              Earn with Us
            </NavLink>
            <button
              onClick={() => {
                setSidebarOpen(false);
                navigate('/', { state: { fromDashboard: true } });
              }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </nav>

        {/* User section at bottom */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center gap-3 px-3 py-2">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-9 h-9 rounded-full border-2 border-indigo-300 dark:border-indigo-600"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
            {isAdmin && (
              <NavLink
                to="/admin"
                className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                title="Admin Panel"
                onClick={() => setSidebarOpen(false)}
              >
                <ShieldCheck className="w-4 h-4" />
              </NavLink>
            )}
            <button
              onClick={handleSignOut}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <GoogleTranslate />
          <ThemeToggle />
        </header>

        {/* Demo mode banner */}
        {isDemoMode && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 sm:px-6 py-2.5 flex items-center justify-between">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <span className="font-semibold">Demo Mode</span> — You're viewing sample data. This is not your real profile.
            </p>
            <button
              onClick={exitDemoMode}
              className="px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              Exit Demo
            </button>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
