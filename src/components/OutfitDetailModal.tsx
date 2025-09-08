import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  Share2, 
  Bookmark, 
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import type { FeedItem } from '../types';

interface OutfitDetailModalProps {
  outfit: FeedItem | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (outfitId: string) => void;
  onSave: (outfitId: string) => void;
  onShare: (outfit: FeedItem) => void;
  isLiked: boolean;
  isSaved: boolean;
}

const OutfitDetailModal = ({
  outfit,
  isOpen,
  onClose,
  onLike,
  onSave,
  onShare,
  isLiked,
  isSaved
}: OutfitDetailModalProps) => {
  if (!outfit) return null;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatNumber = (num: number) => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-5xl max-h-[90vh] overflow-hidden glass-card rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col lg:flex-row h-full">
              {/* Image Section */}
              <div className="lg:w-1/2 h-96 lg:h-auto relative bg-gradient-to-br from-gray-900 to-black">
                <img
                  src={outfit.images[0]?.url}
                  alt={outfit.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                {/* Image Navigation Dots */}
                {outfit.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {outfit.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={outfit.user?.avatar_url || '/default-avatar.png'}
                        alt={outfit.user?.username}
                        className="w-12 h-12 rounded-full border-2 border-neon-orange/30"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{outfit.user?.username}</h3>
                        <p className="text-sm text-white/60">
                          {formatNumber(outfit.user?.follower_count || 0)} takipçi
                        </p>
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 bg-neon-gradient rounded-full text-white font-medium text-sm hover:opacity-90 transition-opacity">
                      Takip Et
                    </button>
                  </div>

                  <h2 className="text-xl font-bold mb-2">{outfit.title}</h2>
                  <p className="text-white/80">{outfit.description}</p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mt-4 text-sm text-white/60">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{formatNumber(outfit.like_count)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{formatNumber(outfit.comment_count || 0)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Share2 className="w-4 h-4" />
                      <span>{formatNumber(outfit.share_count)}</span>
                    </span>
                  </div>
                </div>

                {/* Products Section */}
                <div className="flex-1 overflow-y-auto p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-neon-orange" />
                    Ürünler ({outfit.products.length})
                  </h3>

                  <div className="space-y-3">
                    {outfit.products.map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-4 rounded-xl border border-white/10 hover:border-neon-orange/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <div 
                                className="w-4 h-4 rounded-full border border-white/20"
                                style={{ backgroundColor: product.color }}
                              />
                              <h4 className="font-medium">{product.name}</h4>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-white/60">
                              <span>{product.brand}</span>
                              <span>•</span>
                              <span className="text-neon-orange font-semibold">
                                {formatPrice(product.price, product.currency)}
                              </span>
                            </div>
                            {product.availability === 'in_stock' ? (
                              <span className="text-xs text-green-400 mt-1">Stokta var</span>
                            ) : (
                              <span className="text-xs text-red-400 mt-1">Tükendi</span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => {
                              // Track affiliate click
                              const affiliateUrl = `/api/affiliate/track?product_id=${product.id}&outfit_id=${outfit.id}&redirect=${encodeURIComponent(product.original_url)}`;
                              
                              // Update local click count
                              product.click_count = (product.click_count || 0) + 1;
                              
                              // Open in new tab with tracking
                              window.open(affiliateUrl, '_blank');
                              
                              // Log for analytics
                              console.log('🔗 Affiliate click tracked:', {
                                product: product.name,
                                brand: product.brand,
                                price: product.price,
                                commission: product.price * 0.1 // %10 komisyon
                              });
                            }}
                            className="p-2 bg-neon-orange/20 hover:bg-neon-orange/30 rounded-lg transition-colors group relative"
                          >
                            <ExternalLink className="w-4 h-4 text-neon-orange" />
                            
                            {/* Commission Tooltip */}
                            <div className="absolute -top-8 right-0 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              ~{formatPrice(product.price * 0.1, product.currency)} kazanç
                            </div>
                          </button>
                        </div>
                        
                        {product.click_count > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/10 text-xs text-white/40">
                            {product.click_count} kişi baktı • {product.purchase_count} kişi satın aldı
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Tags */}
                  {outfit.tags && outfit.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-sm mb-3 text-white/60">Etiketler</h3>
                      <div className="flex flex-wrap gap-2">
                        {outfit.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 hover:bg-neon-orange/20 transition-colors cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="mt-6 space-y-2 text-sm text-white/60">
                    {outfit.occasion && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Etkinlik: {outfit.occasion}</span>
                      </div>
                    )}
                    {outfit.season && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Mevsim: {outfit.season}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onLike(outfit.id)}
                        className={`p-3 rounded-full transition-all ${
                          isLiked 
                            ? 'bg-red-500/20 text-red-500' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onSave(outfit.id)}
                        className={`p-3 rounded-full transition-all ${
                          isSaved 
                            ? 'bg-neon-orange/20 text-neon-orange' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onShare(outfit)}
                        className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                      >
                        <Share2 className="w-6 h-6" />
                      </motion.button>
                    </div>

                    <button className="px-6 py-3 bg-neon-gradient rounded-full text-white font-semibold hover:opacity-90 transition-opacity">
                      Tüm Ürünleri Gör
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OutfitDetailModal;