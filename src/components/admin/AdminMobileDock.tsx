import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Warehouse, Menu, Sparkles
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

interface AdminMobileDockProps {
  onOpenMobileSidebar: () => void;
}

export const AdminMobileDock: React.FC<AdminMobileDockProps> = ({
  onOpenMobileSidebar
}) => {
  const { theme } = useUIStore();
  const location = useLocation();

  const dockItems = [
    {
      name: 'Overview',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
    },
    {
      name: 'Stock Audit',
      path: '/admin/inventory',
      icon: Warehouse,
    },
  ];

  return (
    <div className={`fixed bottom-0 inset-x-0 z-40 lg:hidden transition-all duration-300 border-t ${
      theme === 'dark'
        ? 'bg-slate-950/95 border-slate-800/90 text-slate-300 shadow-2xl shadow-black/90 backdrop-blur-2xl'
        : 'bg-white/95 border-slate-200/90 text-slate-700 shadow-xl backdrop-blur-2xl'
    }`}>
      {/* Safe bottom area for iOS home bar */}
      <div className="px-2 py-1.5 flex items-center justify-around max-w-md mx-auto">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 relative group cursor-pointer active:scale-95 ${
                isActive
                  ? theme === 'dark'
                    ? 'text-emerald-400 font-black'
                    : 'text-emerald-600 font-black'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {/* Top Active Indicator Glow Bar */}
              {isActive && (
                <div className="absolute -top-1.5 w-8 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-xs shadow-emerald-500/50" />
              )}

              {/* Icon Container with subtle background when active */}
              <div className={`p-1.5 rounded-xl transition-transform duration-200 ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 scale-105'
                    : 'bg-emerald-50 border border-emerald-200 scale-105'
                  : ''
              }`}>
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>

              {/* Label */}
              <span className={`text-[10px] mt-0.5 tracking-tight truncate ${isActive ? 'font-black' : 'font-medium'}`}>
                {item.name}
              </span>
            </NavLink>
          );
        })}

        {/* Mobile Menu Drawer Trigger Button */}
        <button
          onClick={onOpenMobileSidebar}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
            theme === 'dark'
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Open Full Admin Navigation Drawer"
          title="All Tools Menu"
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            theme === 'dark' ? 'bg-slate-900 border border-slate-800 text-emerald-400' : 'bg-slate-100 border border-slate-200 text-emerald-600'
          }`}>
            <Menu className="w-5 h-5 stroke-[2.2px]" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight text-emerald-500">
            More Tools
          </span>
        </button>
      </div>
    </div>
  );
};
