import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import completed components
import LandingPage from './pages/LandingPage';
import OutfitUpload from './components/OutfitUpload';
import InfiniteOutfitFeed from './components/InfiniteOutfitFeed';
import Navigation from './components/Navigation';
import { affiliateTracker } from './services/affiliateTracker';

// Initialize services on app load

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize demo user session
        const demoUser = {
          id: 'demo_user_' + Date.now(),
          username: 'style_explorer',
          full_name: 'Demo User',
          avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b5ad8d64?w=100&h=100&fit=crop&crop=face',
          follower_count: 125,
          following_count: 89,
          outfit_count: 23,
          total_earnings: 156.50,
          subscription_tier: 'free' as const,
          verification_status: 'unverified' as const
        };
        
        setUser(demoUser);
        affiliateTracker.setUserId(demoUser.id);
        
        // Simulate loading time for smooth UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="text-center relative"
        >
          {/* Animated background glow */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-neon-orange/20 rounded-full blur-xl -z-10"
          />
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6 border-4 border-neon-orange border-t-transparent rounded-full relative"
          >
            <div className="absolute inset-2 border-2 border-neon-orange/30 border-b-transparent rounded-full animate-spin-reverse" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-display font-bold gradient-text mb-4"
          >
            FindOut
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-white/70 text-lg font-body mb-2"
          >
            Moda keşfinin geleceği yükleniyor...
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center space-x-1 mt-6"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-neon-orange rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <Router basename="/FindOut">
      <div className="min-h-screen bg-void text-white overflow-x-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 hero-bg pointer-events-none" />
        
        {/* Global Navigation */}
        <Navigation user={user} />
        
        {/* Route Configuration */}
        <Routes>
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/upload" element={
            <OutfitUpload 
              onClose={() => window.history.back()} 
              onSubmit={async (data) => {
                console.log('Outfit uploaded:', data);
                // Simulate upload success
                await new Promise(resolve => setTimeout(resolve, 1000));
                return Promise.resolve();
              }} 
            />
          } />
          <Route path="/feed" element={<InfiniteOutfitFeed />} />
          <Route path="/discover" element={<InfiniteOutfitFeed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;