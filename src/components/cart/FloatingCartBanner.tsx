import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Truck, Sparkles, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useUIStore } from '../../store/uiStore';
import { formatCurrency } from '../../utils/formatters';
import { useLocation } from 'react-router-dom';

export const FloatingCartBanner: React.FC = () => {
  const { itemCount, total, subtotal, freeShippingThreshold, setDrawerOpen, isOpen } = useCart();
  const {
    sidebarOpen,
    notifOpen,
    cartBannerDismissed,
    setCartBannerDismissed
  } = useUIStore();
  const location = useLocation();

  const [isScrolledDown, setIsScrolledDown] = useState(false);

  // Auto-hide on fast scroll-down, show on scroll-up or top of page
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY;

          // If scrolling down by >15px and past top threshold, auto-hide
          if (delta > 15 && currentScrollY > 120) {
            setIsScrolledDown(true);
          } else if (delta < -15 || currentScrollY <= 80) {
            // Restore visibility when scrolling up or near top
            setIsScrolledDown(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const amountForFreeDelivery = Math.max(0, freeShippingThreshold - subtotal);

  // Pages where the floating cart banner should NOT appear
  const suppressedPaths = [
    '/cart',
    '/checkout',
    '/orders',
    '/diagnose',
    '/planner',
    '/profile',
    '/order-success',
    '/payment-verification',
    '/login',
    '/register'
  ];
  const isSuppressed = suppressedPaths.some(
    p => location.pathname === p || location.pathname.startsWith(p + '/')
  );

  // Hide when cart is empty, cart drawer is open, suppressed page, header actions open, dismissed, or scrolling down
  const shouldShow =
    itemCount > 0 &&
    !isOpen &&
    !isSuppressed &&
    !sidebarOpen &&
    !notifOpen &&
    !cartBannerDismissed &&
    !isScrolledDown;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="fixed bottom-[74px] left-2.5 right-2.5 z-40 md:hidden"
        >
          <div
            onClick={() => setDrawerOpen(true)}
            className="bg-slate-950/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_35px_rgba(0,0,0,0.6)] text-white flex items-center justify-between gap-2.5 relative overflow-hidden cursor-pointer select-none active:scale-[0.99] transition-transform"
          >
            {/* Subtle Ambient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Left Info Section */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/30 text-slate-950 font-black">
                  <ShoppingBag className="w-4.5 h-4.5 text-slate-950" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md border-2 border-slate-950">
                  {itemCount}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                    {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                  </span>
                  <span className="text-sm font-black text-white">
                    {formatCurrency(total)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-200/90 font-medium truncate mt-0.5">
                  <Truck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {amountForFreeDelivery > 0 ? (
                      <>Add <strong className="text-emerald-300">{formatCurrency(amountForFreeDelivery)}</strong> for FREE Delivery</>
                    ) : (
                      <span className="text-emerald-300 font-bold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        Unlocked FREE Delivery!
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Section */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDrawerOpen(true);
                }}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-1 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>View Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Close / Dismiss Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCartBannerDismissed(true);
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg active:scale-90 transition-all cursor-pointer"
                title="Dismiss cart banner"
                aria-label="Dismiss cart banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
