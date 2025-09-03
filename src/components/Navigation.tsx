import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles,
  Home,
  Upload,
  Compass,
  Menu,
  X,
  TrendingUp,
  Search,
  Settings
} from 'lucide-react';
import type { User as UserType } from '../types';

interface NavigationProps {
  user: UserType | null;
}

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Ana Sayfa' },
    { path: '/feed', icon: Compass, label: 'Keşfet' },
    { path: '/upload', icon: Upload, label: 'Yükle' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card m-4 rounded-2xl backdrop-blur-3xl border border-white/10"
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold gradient-text">FindOut</span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActivePath(item.path)
                      ? 'text-neon-orange bg-neon-orange/10'
                      : 'text-white/70 hover:text-neon-orange hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
                
                {/* Active indicator */}
                {isActivePath(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-orange rounded-full"
                    initial={false}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Section & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl glass-card hover:bg-white/10 transition-colors"
            >
              <Search className="w-5 h-5 text-white/70" />
            </motion.button>

            {/* User Profile */}
            {user ? (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 glass-card px-3 py-2 rounded-xl cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-neon-gradient flex items-center justify-center text-xs font-bold text-white">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="hidden lg:block text-sm">
                  <div className="font-medium text-white">{user.username}</div>
                  <div className="text-xs text-neon-orange">₺{user.total_earnings.toFixed(2)}</div>
                </div>
                <TrendingUp className="w-4 h-4 text-neon-orange group-hover:scale-110 transition-transform" />
              </motion.div>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="neon-button px-6 py-2"
              >
                Giriş Yap
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-xl glass-card"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 md:hidden"
          >
            <div className="glass-card rounded-2xl p-6 backdrop-blur-3xl border border-white/10">
              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                        isActivePath(item.path)
                          ? 'text-neon-orange bg-neon-orange/10 border border-neon-orange/20'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {isActivePath(item.path) && (
                        <div className="w-2 h-2 bg-neon-orange rounded-full ml-auto" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile User Info */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <div className="flex items-center space-x-4 p-4 glass-card rounded-xl">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-neon-gradient flex items-center justify-center text-sm font-bold text-white">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{user.full_name || user.username}</div>
                      <div className="text-sm text-white/60">@{user.username}</div>
                      <div className="text-xs text-neon-orange mt-1">
                        Kazanç: ₺{user.total_earnings.toFixed(2)}
                      </div>
                    </div>
                    <Settings className="w-5 h-5 text-white/40" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;