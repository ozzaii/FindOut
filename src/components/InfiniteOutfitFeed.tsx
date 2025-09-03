import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreVertical,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Verified,
  Shuffle,
  Target,
  X
} from 'lucide-react';
import type { FeedItem } from '../types';
import ViralSharePanel from './ViralSharePanel';
import AIStyleMatcher from './AIStyleMatcher';
import OutfitReactions from './OutfitReactions';
import OutfitRemixer from './OutfitRemixer';

interface InfiniteOutfitFeedProps {
  onOutfitClick?: (outfit: FeedItem) => void;
  onUserClick?: (userId: string) => void;
  onProductClick?: (productId: string) => void;
}

// Mock data for demonstration
const mockOutfits: FeedItem[] = [
  {
    id: '1',
    user_id: 'user_1',
    user: {
      id: 'user_1',
      username: 'zeynep_style',
      full_name: 'Zeynep Kara',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a8?w=150&h=150&fit=crop&crop=face',
      follower_count: 12500,
      following_count: 890,
      outfit_count: 145,
      total_earnings: 2500,
      subscription_tier: 'pro',
      verification_status: 'influencer_verified',
      account_status: 'active',
      privacy_settings: {
        profile_visibility: 'public',
        show_follower_count: true,
        show_earnings: false,
        allow_ai_training: true,
        location_sharing: false,
        data_export_allowed: true
      },
      notification_settings: {
        email_notifications: true,
        push_notifications: true,
        sms_notifications: false,
        marketing_emails: true,
        trend_alerts: true,
        follower_updates: true,
        outfit_engagement: true
      },
      language: 'tr',
      country: 'TR',
      timezone: 'Europe/Istanbul',
      updated_at: '2024-01-15',
      last_active_at: '2024-01-15',
      created_at: '2024-01-15'
    },
    title: 'Sonbahar Ofis Kombinim 🍂',
    description: 'Profesyonel ama rahat, sonbahar renklerini seviyorum! Bu kombin hem ofiste hem de after-work etkinliklerde mükemmel.',
    images: [{
      id: 'img_1',
      url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop',
      thumbnail_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200&h=300&fit=crop',
      width: 400,
      height: 600,
      angle: 'front',
      is_primary: true,
      cloudinary_public_id: 'sample_1'
    }],
    products: [
      {
        id: 'prod_1',
        outfit_id: '1',
        name: 'Krem Boğazlı Kazak',
        brand: 'Zara',
        original_url: 'https://zara.com/example',
        price: 299,
        currency: 'TRY',
        category: 'tops',
        color: '#F5F5DC',
        click_count: 45,
        purchase_count: 8,
        revenue_generated: 120,
        availability: 'in_stock',
        created_at: '2024-01-15'
      },
      {
        id: 'prod_2',
        outfit_id: '1',
        name: 'Siyah Midi Etek',
        brand: 'H&M',
        original_url: 'https://hm.com/example',
        price: 189,
        currency: 'TRY',
        category: 'bottoms',
        color: '#000000',
        click_count: 32,
        purchase_count: 12,
        revenue_generated: 95,
        availability: 'in_stock',
        created_at: '2024-01-15'
      }
    ],
    category: 'business',
    season: 'autumn',
    tags: ['professional', 'elegant', 'comfortable'],
    occasion_tags: ['office'],
    color_palette: ['#F5F5DC', '#000000', '#8B4513'],
    style_tags: ['minimalist', 'modern'],
    price_range: 'mid_range',
    like_count: 1247,
    save_count: 398,
    share_count: 56,
    view_count: 5420,
    try_on_count: 0,
    engagement_rate: 23.5,
    trending_score: 87,
    is_sponsored: false,
    visibility: 'public',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    ai_match_score: 92
  },
  {
    id: '2',
    user_id: 'user_2',
    user: {
      id: 'user_2',
      username: 'ayse_fashion',
      full_name: 'Ayşe Demir',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      follower_count: 8900,
      following_count: 1200,
      outfit_count: 89,
      total_earnings: 1800,
      subscription_tier: 'basic',
      verification_status: 'unverified',
      account_status: 'active',
      privacy_settings: {
        profile_visibility: 'public',
        show_follower_count: true,
        show_earnings: false,
        allow_ai_training: true,
        location_sharing: false,
        data_export_allowed: true
      },
      notification_settings: {
        email_notifications: true,
        push_notifications: true,
        sms_notifications: false,
        marketing_emails: true,
        trend_alerts: true,
        follower_updates: true,
        outfit_engagement: true
      },
      language: 'tr',
      country: 'TR',
      timezone: 'Europe/Istanbul',
      updated_at: '2024-01-20',
      last_active_at: '2024-01-20',
      created_at: '2024-01-20'
    },
    title: 'Casual Weekend Vibes ✨',
    description: 'Hafta sonu rahatlığı ama stil sahibi olmaktan ödün vermeden! Denim ve crop top kombinasyonu her zaman işe yarıyor.',
    images: [{
      id: 'img_2',
      url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
      thumbnail_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=300&fit=crop',
      width: 400,
      height: 600,
      angle: 'front',
      is_primary: true,
      cloudinary_public_id: 'sample_2'
    }],
    products: [
      {
        id: 'prod_3',
        outfit_id: '2',
        name: 'Denim Ceket',
        brand: 'Trendyol',
        original_url: 'https://trendyol.com/example',
        price: 399,
        currency: 'TRY',
        category: 'outerwear',
        color: '#4169E1',
        click_count: 67,
        purchase_count: 15,
        revenue_generated: 240,
        availability: 'in_stock',
        created_at: '2024-01-20'
      }
    ],
    category: 'casual',
    season: 'all_season',
    tags: ['relaxed', 'trendy', 'everyday'],
    occasion_tags: ['weekend'],
    color_palette: ['#4169E1', '#FFFFFF', '#000000'],
    style_tags: ['casual', 'trendy'],
    price_range: 'budget',
    like_count: 892,
    save_count: 234,
    share_count: 34,
    view_count: 3210,
    try_on_count: 0,
    engagement_rate: 36.2,
    trending_score: 76,
    is_sponsored: false,
    visibility: 'public',
    created_at: '2024-01-20T15:45:00Z',
    updated_at: '2024-01-20T15:45:00Z',
    ai_match_score: 88
  }
];

const InfiniteOutfitFeed = ({ onOutfitClick, onUserClick, onProductClick }: InfiniteOutfitFeedProps) => {
  const [outfits, setOutfits] = useState<FeedItem[]>(mockOutfits);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [likedOutfits, setLikedOutfits] = useState<Set<string>>(new Set());
  const [savedOutfits, setSavedOutfits] = useState<Set<string>>(new Set());
  const [_currentlyPlaying, _setCurrentlyPlaying] = useState<string | null>(null);
  const [_muted, _setMuted] = useState(true);
  
  // Viral features state
  const [sharePanel, setSharePanel] = useState<{ isOpen: boolean; outfit: any }>({ isOpen: false, outfit: null });
  const [styleMatcherOpen, setStyleMatcherOpen] = useState<string | null>(null);
  const [reactionsOpen, setReactionsOpen] = useState<string | null>(null);
  const [remixerOpen, setRemixerOpen] = useState<string | null>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const _loadingRef = useRef<HTMLDivElement>(null);

  // Load more outfits (simulate API call)
  const loadMoreOutfits = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate more mock outfits
    const newOutfits = Array.from({ length: 5 }, (_, index) => ({
      ...mockOutfits[index % 2],
      id: `${Date.now()}_${index}`,
      created_at: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }));
    
    setOutfits(prev => [...prev, ...newOutfits]);
    setLoading(false);
    
    // Stop loading when we have enough items (simulate finite data)
    if (outfits.length > 50) {
      setHasMore(false);
    }
  }, [loading, outfits.length]);

  // Infinite scroll implementation
  const lastOutfitElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreOutfits();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, loadMoreOutfits]);

  // Handle like action
  const handleLike = (outfitId: string) => {
    setLikedOutfits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(outfitId)) {
        newSet.delete(outfitId);
        // Update outfit like count
        setOutfits(prevOutfits => 
          prevOutfits.map(outfit => 
            outfit.id === outfitId 
              ? { ...outfit, like_count: outfit.like_count - 1 }
              : outfit
          )
        );
      } else {
        newSet.add(outfitId);
        // Update outfit like count
        setOutfits(prevOutfits => 
          prevOutfits.map(outfit => 
            outfit.id === outfitId 
              ? { ...outfit, like_count: outfit.like_count + 1 }
              : outfit
          )
        );
      }
      return newSet;
    });
  };

  // Handle save action
  const handleSave = (outfitId: string) => {
    setSavedOutfits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(outfitId)) {
        newSet.delete(outfitId);
        setOutfits(prevOutfits => 
          prevOutfits.map(outfit => 
            outfit.id === outfitId 
              ? { ...outfit, save_count: outfit.save_count - 1 }
              : outfit
          )
        );
      } else {
        newSet.add(outfitId);
        setOutfits(prevOutfits => 
          prevOutfits.map(outfit => 
            outfit.id === outfitId 
              ? { ...outfit, save_count: outfit.save_count + 1 }
              : outfit
          )
        );
      }
      return newSet;
    });
  };

  // Handle share action - Updated for viral sharing
  const handleShare = (outfit: FeedItem) => {
    setSharePanel({ isOpen: true, outfit });
  };

  // Handle viral feature toggles
  const handleStyleMatch = (outfitId: string) => {
    setStyleMatcherOpen(styleMatcherOpen === outfitId ? null : outfitId);
  };

  const handleReactions = (outfitId: string) => {
    setReactionsOpen(reactionsOpen === outfitId ? null : outfitId);
  };

  const handleRemix = (outfitId: string) => {
    setRemixerOpen(remixerOpen === outfitId ? null : outfitId);
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'az önce';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}dk`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}s`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}g`;
    return date.toLocaleDateString('tr-TR');
  };

  // Format number (e.g., 1247 -> 1.2K)
  const formatNumber = (num: number) => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="max-w-md mx-auto bg-void min-h-screen">
      {/* Feed Header */}
      <div className="sticky top-0 bg-void/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-bold gradient-text">FindOut</h1>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <TrendingUp className="w-5 h-5 text-neon-orange" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Sparkles className="w-5 h-5 text-neon-orange" />
            </button>
          </div>
        </div>
      </div>

      {/* Outfit Feed */}
      <div className="pb-20">
        <AnimatePresence>
          {outfits.map((outfit, index) => (
            <motion.div
              key={outfit.id}
              ref={index === outfits.length - 1 ? lastOutfitElementRef : null}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative h-screen snap-start overflow-hidden"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={outfit.images[0]?.url}
                  alt={outfit.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="relative h-full flex flex-col justify-between p-4">
                {/* Top Actions */}
                <div className="flex justify-end">
                  <button className="p-2 bg-black/20 backdrop-blur-sm rounded-full">
                    <MoreVertical className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Bottom Content */}
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onUserClick?.(outfit.user_id)}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <img
                        src={outfit.user?.avatar_url || '/default-avatar.png'}
                        alt={outfit.user?.username}
                        className="w-10 h-10 rounded-full border-2 border-white/20"
                      />
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold text-white">
                            {outfit.user?.username}
                          </span>
                          {(outfit.user?.verification_status === 'influencer_verified' || outfit.user?.verification_status === 'brand_verified') && (
                            <Verified className="w-4 h-4 text-neon-orange" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-white/70">
                          <span>{formatTimeAgo(outfit.created_at)}</span>
                          <span>•</span>
                          <span>{formatNumber(outfit.user?.follower_count || 0)} takipçi</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Follow Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-neon-gradient rounded-full text-white font-medium text-sm"
                    >
                      Takip Et
                    </motion.button>
                  </div>

                  {/* Outfit Info */}
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-white">{outfit.title}</h2>
                    {outfit.description && (
                      <p className="text-white/80 text-sm line-clamp-2">
                        {outfit.description}
                      </p>
                    )}
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {outfit.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* AI Match Score */}
                    {outfit.ai_match_score && (
                      <div className="flex items-center space-x-2 text-xs text-neon-orange">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Uyum: %{outfit.ai_match_score}</span>
                      </div>
                    )}
                  </div>

                  {/* Products Bar */}
                  {outfit.products.length > 0 && (
                    <div className="glass-card rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white flex items-center">
                          <ShoppingBag className="w-4 h-4 mr-1" />
                          Shop the Look
                        </span>
                        <span className="text-xs text-white/60">
                          {outfit.products.length} ürün
                        </span>
                      </div>
                      <div className="flex space-x-2 overflow-x-auto">
                        {outfit.products.map((product) => (
                          <motion.button
                            key={product.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onProductClick?.(product.id)}
                            className="flex-shrink-0 bg-white/10 rounded-lg p-2 text-xs text-white text-left min-w-[120px]"
                          >
                            <div className="font-medium truncate">{product.name}</div>
                            <div className="text-white/70">{product.brand}</div>
                            <div className="text-neon-orange font-bold">
                              {product.price} {product.currency}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Side Actions */}
              <div className="absolute right-4 bottom-32 space-y-6">
                {/* Like Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(outfit.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      likedOutfits.has(outfit.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-black/20 backdrop-blur-sm text-white hover:bg-red-500/20'
                    }`}
                  >
                    <Heart 
                      className={`w-6 h-6 ${
                        likedOutfits.has(outfit.id) ? 'fill-current' : ''
                      }`} 
                    />
                  </motion.button>
                  <div className="text-xs text-white mt-1">
                    {formatNumber(outfit.like_count)}
                  </div>
                </div>

                {/* Comment Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onOutfitClick?.(outfit)}
                    className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </motion.button>
                  <div className="text-xs text-white mt-1">
                    {formatNumber(outfit.view_count / 10)} {/* Mock comment count */}
                  </div>
                </div>

                {/* Save Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSave(outfit.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      savedOutfits.has(outfit.id)
                        ? 'bg-neon-orange text-white'
                        : 'bg-black/20 backdrop-blur-sm text-white hover:bg-neon-orange/20'
                    }`}
                  >
                    <Bookmark 
                      className={`w-6 h-6 ${
                        savedOutfits.has(outfit.id) ? 'fill-current' : ''
                      }`} 
                    />
                  </motion.button>
                  <div className="text-xs text-white mt-1">
                    {formatNumber(outfit.save_count)}
                  </div>
                </div>

                {/* Share Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare(outfit)}
                    className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <Share2 className="w-6 h-6" />
                  </motion.button>
                  <div className="text-xs text-white mt-1">
                    {formatNumber(outfit.share_count)}
                  </div>
                </div>

                {/* AI Style Match Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleStyleMatch(outfit.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      styleMatcherOpen === outfit.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-black/20 backdrop-blur-sm text-white hover:bg-purple-500/20'
                    }`}
                  >
                    <Target className="w-6 h-6" />
                  </motion.button>
                  <div className="text-xs text-white mt-1">Eşleş</div>
                </div>

                {/* Reactions Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReactions(outfit.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      reactionsOpen === outfit.id
                        ? 'bg-yellow-500 text-white'
                        : 'bg-black/20 backdrop-blur-sm text-white hover:bg-yellow-500/20'
                    }`}
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.button>
                  <div className="text-xs text-white mt-1">React</div>
                </div>

                {/* Remix Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemix(outfit.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      remixerOpen === outfit.id
                        ? 'bg-neon-orange text-white'
                        : 'bg-black/20 backdrop-blur-sm text-white hover:bg-neon-orange/20'
                    }`}
                  >
                    <Shuffle className="w-6 h-6" />
                  </motion.button>
                  <div className="text-xs text-white mt-1">Remix</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {loading && (
          <div ref={_loadingRef} className="flex justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-neon-orange border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* End of Feed */}
        {!hasMore && (
          <div className="text-center py-8 text-white/60">
            <Sparkles className="w-8 h-8 mx-auto mb-2" />
            <p>Tüm kombinleri gördün! Yenileri için takipte kal 💫</p>
          </div>
        )}
      </div>

      {/* Viral Share Panel */}
      <ViralSharePanel
        outfit={sharePanel.outfit}
        isOpen={sharePanel.isOpen}
        onClose={() => setSharePanel({ isOpen: false, outfit: null })}
      />

      {/* AI Style Matcher Modal */}
      <AnimatePresence>
        {styleMatcherOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setStyleMatcherOpen(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              className="glass-card rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-bold gradient-text">AI Stil Eşleştirme</h3>
                  <button
                    onClick={() => setStyleMatcherOpen(null)}
                    className="p-2 rounded-xl glass-card hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/70" />
                  </button>
                </div>
                <AIStyleMatcher
                  currentOutfit={outfits.find(o => o.id === styleMatcherOpen)}
                  onMatchFound={(matches) => console.log('Style matches:', matches)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outfit Reactions Modal */}
      <AnimatePresence>
        {reactionsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setReactionsOpen(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              className="glass-card rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-bold gradient-text">Reaksiyonlar</h3>
                  <button
                    onClick={() => setReactionsOpen(null)}
                    className="p-2 rounded-xl glass-card hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/70" />
                  </button>
                </div>
                <OutfitReactions
                  outfitId={reactionsOpen}
                  onReactionAdd={(reaction, count) => console.log('Reaction added:', reaction, count)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outfit Remixer Modal */}
      <AnimatePresence>
        {remixerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setRemixerOpen(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              className="glass-card rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-bold gradient-text">Outfit Remixer</h3>
                  <button
                    onClick={() => setRemixerOpen(null)}
                    className="p-2 rounded-xl glass-card hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/70" />
                  </button>
                </div>
                <OutfitRemixer
                  baseOutfit={outfits.find(o => o.id === remixerOpen)}
                  onRemixCreated={(remix) => console.log('Remix created:', remix)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfiniteOutfitFeed;