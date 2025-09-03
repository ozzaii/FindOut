import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Target, 
  Shuffle, 
  Heart,
  Eye,
  TrendingUp,
  User,
  Palette,
  Crown,
  Flame
} from 'lucide-react';

interface AIStyleMatcherProps {
  currentOutfit: any;
  onMatchFound: (matches: any[]) => void;
}

const AIStyleMatcher: React.FC<AIStyleMatcherProps> = ({ currentOutfit, onMatchFound }) => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [matchType, setMatchType] = useState<'color' | 'style' | 'vibe' | 'trend'>('style');

  const matchTypes = [
    { id: 'style', label: 'Stil Benzerliği', icon: Crown, color: 'text-purple-400', description: 'Benzer stil DNA\'sı' },
    { id: 'color', label: 'Renk Uyumu', icon: Palette, color: 'text-blue-400', description: 'Renk paleti uyumlu' },
    { id: 'vibe', label: 'Enerji Uyumu', icon: Zap, color: 'text-yellow-400', description: 'Aynı enerji seviyesi' },
    { id: 'trend', label: 'Trend Benzerliği', icon: TrendingUp, color: 'text-green-400', description: 'Trendte benzer' }
  ];

  const runAIMatching = async () => {
    setIsMatching(true);
    
    // Simulate AI processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI matching results with different algorithms
    const mockMatches = [
      {
        id: 'match_1',
        user: { username: 'elif_chic', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b5ad8d64?w=100', followers: '23.4K' },
        outfit: {
          id: 'outfit_match_1',
          image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop',
          title: 'Sonbahar Minimalizm',
          matchScore: 94,
          matchReasons: ['Benzer renk paleti', 'Aynı stil yaklaşımı', 'Mevsim uyumu']
        },
        stats: { likes: 2847, views: 12543, saves: 892 }
      },
      {
        id: 'match_2',
        user: { username: 'moda_asi', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', followers: '18.9K' },
        outfit: {
          id: 'outfit_match_2',
          image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=400&fit=crop',
          title: 'Şık Günlük',
          matchScore: 89,
          matchReasons: ['Benzer aksesuar kullanımı', 'Uyumlu renkler', 'Stil DNA uyumu']
        },
        stats: { likes: 1923, views: 8967, saves: 654 }
      },
      {
        id: 'match_3',
        user: { username: 'istanbul_style', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', followers: '31.2K' },
        outfit: {
          id: 'outfit_match_3',
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
          title: 'Urban Elegance',
          matchScore: 87,
          matchReasons: ['Trend uyumu', 'Benzer siluet', 'Vibe match']
        },
        stats: { likes: 3456, views: 15678, saves: 1234 }
      }
    ];

    setMatchResults(mockMatches);
    onMatchFound(mockMatches);
    setIsMatching(false);
  };

  useEffect(() => {
    if (currentOutfit) {
      runAIMatching();
    }
  }, [currentOutfit, matchType]);

  return (
    <div className="space-y-6">
      {/* AI Matching Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold gradient-text">AI Stil Eşleştirme</h3>
          <p className="text-white/60 text-sm">Seninle uyumlu stiller bulalım</p>
        </div>
      </div>

      {/* Match Type Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {matchTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMatchType(type.id as any)}
            className={`p-4 glass-card rounded-2xl border-2 transition-all ${
              matchType === type.id
                ? 'border-neon-orange bg-neon-orange/10'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <type.icon className={`w-6 h-6 ${type.color} mx-auto mb-2`} />
            <div className="text-sm font-medium text-white">{type.label}</div>
            <div className="text-xs text-white/50 mt-1">{type.description}</div>
          </motion.button>
        ))}
      </div>

      {/* AI Processing Animation */}
      <AnimatePresence>
        {isMatching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl text-center"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity }
              }}
              className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h4 className="text-lg font-bold text-white mb-2">AI Analiz Ediyor...</h4>
            <p className="text-white/60 text-sm mb-4">
              {matchType === 'style' && 'Stil DNA\'nı analiz ediyorum...'}
              {matchType === 'color' && 'Renk paletini tarayıyorum...'}
              {matchType === 'vibe' && 'Enerji uyumunu hesaplıyorum...'}
              {matchType === 'trend' && 'Trend verilerini karşılaştırıyorum...'}
            </p>
            <div className="flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match Results */}
      <AnimatePresence>
        {matchResults.length > 0 && !isMatching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-white">
                🎯 {matchResults.length} Süper Uyum Buldu!
              </h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runAIMatching}
                className="flex items-center space-x-2 px-4 py-2 glass-card rounded-xl hover:bg-white/10 transition-colors"
              >
                <Shuffle className="w-4 h-4 text-neon-orange" />
                <span className="text-sm text-white">Yenile</span>
              </motion.button>
            </div>

            <div className="grid gap-4">
              {matchResults.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex space-x-4">
                    {/* Match Image */}
                    <div className="relative">
                      <img 
                        src={match.outfit.image} 
                        alt={match.outfit.title}
                        className="w-20 h-24 object-cover rounded-xl"
                      />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-gradient rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{match.outfit.matchScore}</span>
                      </div>
                    </div>

                    {/* Match Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-bold text-white">{match.outfit.title}</h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <img 
                              src={match.user.avatar} 
                              alt={match.user.username}
                              className="w-5 h-5 rounded-full"
                            />
                            <span className="text-sm text-white/70">@{match.user.username}</span>
                            <span className="text-xs text-white/50">{match.user.followers}</span>
                          </div>
                        </div>
                        <Flame className="w-5 h-5 text-neon-orange" />
                      </div>

                      {/* Match Reasons */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {match.outfit.matchReasons.map((reason: string, i: number) => (
                          <span 
                            key={i}
                            className="text-xs px-2 py-1 bg-neon-orange/20 text-neon-orange rounded-full"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>

                      {/* Match Stats */}
                      <div className="flex items-center space-x-4 text-xs text-white/60">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{match.stats.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{match.stats.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{match.stats.saves}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Actions */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: 1, 
                      height: 'auto'
                    }}
                    className="mt-4 pt-3 border-t border-white/10 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button className="flex-1 py-2 px-4 bg-neon-orange/20 text-neon-orange rounded-xl text-sm font-medium hover:bg-neon-orange/30 transition-colors">
                      Profili Gör
                    </button>
                    <button className="flex-1 py-2 px-4 glass-card rounded-xl text-sm text-white hover:bg-white/10 transition-colors">
                      Outfit'i Aç
                    </button>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Load More Matches */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 glass-card rounded-2xl border-2 border-dashed border-white/20 hover:border-neon-orange/50 transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5 text-neon-orange" />
                <span className="text-white font-medium">Daha Fazla Eşleşme Bul</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIStyleMatcher;