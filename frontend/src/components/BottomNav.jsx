import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Clock, Trophy, User } from 'lucide-react';

const TABS = [
  { key: 'home', label: 'Home', paths: ['/home', '/valet', '/fleet'], icon: Home, nav: '/home' },
  { key: 'logs', label: 'Logs', paths: ['/logs'], icon: Clock, nav: '/logs' },
  { key: 'rankings', label: 'Rankings', paths: ['/leaderboard'], icon: Trophy, nav: '/leaderboard' },
  { key: 'profile', label: 'Profile', paths: ['/profile'], icon: User, nav: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeKey = TABS.find((t) => t.paths.includes(location.pathname))?.key || '';

  return (
    <nav
      className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto z-30"
      style={{
        background: 'hsl(0 0% 7% / 0.97)',
        borderTop: '1px solid hsl(0 0% 14%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center justify-around">
        {TABS.map(({ key, label, icon: Icon, nav }) => {
          const active = activeKey === key;
          return (
            <button
              key={key}
              className="relative flex flex-col items-center gap-1 min-w-[72px] py-3 px-2"
              onClick={() => navigate(nav)}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                  style={{ backgroundColor: 'hsl(43 77% 52%)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={active ? 2 : 1.5}
                style={{
                  color: active ? 'hsl(0 0% 96%)' : 'hsl(0 0% 38%)',
                  transition: 'color 0.2s ease',
                }}
              />
              <span
                className="text-[10px] font-medium leading-none"
                style={{
                  color: active ? 'hsl(0 0% 85%)' : 'hsl(0 0% 35%)',
                  transition: 'color 0.2s ease',
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
