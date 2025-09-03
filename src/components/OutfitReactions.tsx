import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Flame, 
  Sparkles, 
  Crown, 
  Star,
  Zap
} from 'lucide-react';

interface OutfitReactionsProps {
  outfitId: string;
  onReactionAdd?: (reaction: string, count: number) => void;
}

const OutfitReactions: React.FC<OutfitReactionsProps> = ({ outfitId, onReactionAdd }) => {
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [floatingReactions, setFloatingReactions] = useState<Array<{
    id: string;
    emoji: string;
    x: number;
    y: number;
  }>>([]);

  const reactionTypes = [
    { 
      id: 'fire', 
      icon: Flame, 
      emoji: '🔥', 
      label: 'Ateş', 
      color: 'text-red-400',
      gradient: 'from-red-500 to-orange-500'
    },
    { 
      id: 'heart', 
      icon: Heart, 
      emoji: '❤️', 
      label: 'Aşk', 
      color: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      id: 'sparkles', 
      icon: Sparkles, 
      emoji: '✨', 
      label: 'Büyülü', 
      color: 'text-yellow-400',
      gradient: 'from-yellow-400 to-yellow-500'
    },
    { 
      id: 'crown', 
      icon: Crown, 
      emoji: '👑', 
      label: 'Kraliçe', 
      color: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500'
    },
    { 
      id: 'star', 
      icon: Star, 
      emoji: '⭐', 
      label: 'Yıldız', 
      color: 'text-blue-400',
      gradient: 'from-blue-400 to-cyan-500'
    },
    { 
      id: 'zap', 
      icon: Zap, 
      emoji: '⚡', 
      label: 'Enerji', 
      color: 'text-neon-orange',
      gradient: 'from-neon-orange to-neon-orange-bright'
    }
  ];

  // Initialize reactions with mock data
  useEffect(() => {
    const mockReactions = {
      fire: 156,
      heart: 342,
      sparkles: 89,
      crown: 67,
      star: 234,
      zap: 123
    };
    setReactions(mockReactions);
  }, [outfitId]);

  // Simulate real-time reactions from other users
  useEffect(() => {
    const interval = setInterval(() => {
      const randomReaction = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
      if (Math.random() < 0.3) { // 30% chance of new reaction
        setReactions(prev => ({
          ...prev,
          [randomReaction.id]: (prev[randomReaction.id] || 0) + 1
        }));

        // Add floating reaction animation
        addFloatingReaction(randomReaction.emoji);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const addFloatingReaction = (emoji: string) => {
    const id = `reaction_${Date.now()}_${Math.random()}`;
    const newReaction = {
      id,
      emoji,
      x: Math.random() * 300 + 50, // Random position
      y: Math.random() * 100 + 50
    };

    setFloatingReactions(prev => [...prev, newReaction]);

    // Remove after animation
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  const handleReactionClick = (reactionId: string, emoji: string) => {
    const isAlreadyReacted = userReactions.has(reactionId);
    
    if (isAlreadyReacted) {
      // Remove reaction
      setUserReactions(prev => {
        const newSet = new Set(prev);
        newSet.delete(reactionId);
        return newSet;
      });
      setReactions(prev => ({
        ...prev,
        [reactionId]: Math.max(0, (prev[reactionId] || 0) - 1)
      }));
    } else {
      // Add reaction
      setUserReactions(prev => new Set([...prev, reactionId]));
      setReactions(prev => ({
        ...prev,
        [reactionId]: (prev[reactionId] || 0) + 1
      }));
      
      // Add floating animation
      addFloatingReaction(emoji);
      onReactionAdd?.(reactionId, (reactions[reactionId] || 0) + 1);
    }
  };

  const getTotalReactions = () => {
    return Object.values(reactions).reduce((sum, count) => sum + count, 0);
  };

  const getTopReactions = () => {
    return Object.entries(reactions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  return (
    <div className="space-y-4">
      {/* Total Reactions Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon-gradient rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {getTotalReactions().toLocaleString()}
            </div>
            <div className="text-xs text-white/60">toplam reaksiyon</div>
          </div>
        </div>

        {/* Top Reactions Preview */}
        <div className="flex items-center space-x-1">
          {getTopReactions().map(([reactionId, count]) => {
            const reaction = reactionTypes.find(r => r.id === reactionId);
            return (
              <div key={reactionId} className="flex items-center space-x-1">
                <span className="text-lg">{reaction?.emoji}</span>
                <span className="text-xs text-white/60">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reaction Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {reactionTypes.map((reaction) => {
          const count = reactions[reaction.id] || 0;
          const isActive = userReactions.has(reaction.id);
          
          return (
            <motion.button
              key={reaction.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReactionClick(reaction.id, reaction.emoji)}
              className={`relative p-3 glass-card rounded-2xl border-2 transition-all ${
                isActive 
                  ? `border-transparent bg-gradient-to-r ${reaction.gradient}` 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-center">
                <div className="text-xl mb-1">{reaction.emoji}</div>
                <div className={`text-xs font-medium ${
                  isActive ? 'text-white' : 'text-white/80'
                }`}>
                  {reaction.label}
                </div>
                {count > 0 && (
                  <div className={`text-xs mt-1 ${
                    isActive ? 'text-white/90' : 'text-white/60'
                  }`}>
                    {count}
                  </div>
                )}
              </div>

              {/* Pulse animation for active reactions */}
              {isActive && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-orange/30 to-transparent"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Floating Reactions */}
      <div className="relative h-20 overflow-hidden pointer-events-none">
        <AnimatePresence>
          {floatingReactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              initial={{ 
                x: reaction.x, 
                y: reaction.y + 50,
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                y: reaction.y - 100,
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.8],
                rotate: [0, 10, -10, 0]
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 2,
                ease: "easeOut"
              }}
              className="absolute text-2xl"
              style={{ left: reaction.x, top: reaction.y }}
            >
              {reaction.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Recent Reactions Activity */}
      <div className="glass-card p-4 rounded-2xl">
        <h4 className="text-sm font-medium text-white/80 mb-3">Son Dakika Reaksiyonları</h4>
        <div className="space-y-2">
          {[
            { user: 'moda_asi', reaction: '🔥', time: '2 sn önce' },
            { user: 'style_guru', reaction: '👑', time: '5 sn önce' },
            { user: 'istanbul_chic', reaction: '✨', time: '12 sn önce' },
            { user: 'fashion_lover', reaction: '❤️', time: '18 sn önce' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{activity.reaction}</span>
                <span className="text-white/70">@{activity.user}</span>
              </div>
              <span className="text-xs text-white/50">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reaction Leaderboard */}
      <div className="glass-card p-4 rounded-2xl">
        <h4 className="text-sm font-medium text-white/80 mb-3">En Çok Reaction Alanlar</h4>
        <div className="space-y-2">
          {[
            { rank: 1, user: 'zeynep_style', reactions: 2847, growth: '+12%' },
            { rank: 2, user: 'moda_krali', reactions: 2156, growth: '+8%' },
            { rank: 3, user: 'stil_rehberi', reactions: 1923, growth: '+15%' }
          ].map((leader, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  'bg-orange-500 text-black'
                }`}>
                  {leader.rank}
                </div>
                <span className="text-white/80 text-sm">@{leader.user}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">{leader.reactions.toLocaleString()}</div>
                <div className="text-xs text-green-400">{leader.growth}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutfitReactions;