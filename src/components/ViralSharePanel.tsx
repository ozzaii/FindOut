import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Copy, 
  Instagram, 
  MessageCircle,
  Heart,
  Sparkles,
  Zap,
  Camera,
  Download,
  QrCode,
  X,
  CheckCircle
} from 'lucide-react';

interface ViralSharePanelProps {
  outfit: any;
  isOpen: boolean;
  onClose: () => void;
}

const ViralSharePanel: React.FC<ViralSharePanelProps> = ({ outfit, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareStyle, setShareStyle] = useState<'story' | 'post' | 'tiktok'>('story');

  const shareUrl = `https://ozai-space.github.io/findout-app/outfit/${outfit?.id}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Future feature: Generate optimized share images for different platforms
  // const generateShareImage = (style: 'story' | 'post' | 'tiktok') => {
  //   return `/api/generate-share-image/${outfit?.id}?style=${style}`;
  // };

  const shareTemplates = [
    {
      id: 'story',
      name: 'Instagram Story',
      size: '9:16',
      icon: Instagram,
      color: 'from-purple-500 to-pink-500',
      description: 'Perfect for IG stories'
    },
    {
      id: 'post',
      name: 'Instagram Post',
      size: '1:1',
      icon: Camera,
      color: 'from-blue-500 to-cyan-500',
      description: 'Square format for feeds'
    },
    {
      id: 'tiktok',
      name: 'TikTok Style',
      size: '9:16',
      icon: Zap,
      color: 'from-neon-orange to-neon-orange-bright',
      description: 'Viral TikTok format'
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className="glass-card p-6 rounded-3xl w-full max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white">Outfit'ini Paylaş</h3>
                <p className="text-sm text-white/60">Viral olacak kombinasyon!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-card hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Share Style Selection */}
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-medium text-white/80">Platform Seç</h4>
            <div className="grid grid-cols-3 gap-3">
              {shareTemplates.map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShareStyle(template.id as any)}
                  className={`p-4 rounded-2xl glass-card border-2 transition-all ${
                    shareStyle === template.id
                      ? 'border-neon-orange bg-neon-orange/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
                    <template.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs text-white/80 font-medium">{template.name}</div>
                  <div className="text-xs text-white/50">{template.size}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Share Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-white/80 mb-3">Önizleme</h4>
            <div className="glass-card p-4 rounded-2xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-neon-gradient rounded-full flex items-center justify-center text-xs font-bold">
                  {outfit?.user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white text-sm">{outfit?.user?.username || 'user'}</div>
                  <div className="text-xs text-white/60">via FindOut ✨</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-neon-orange/20 to-purple-500/20 rounded-xl p-3 text-center">
                <Sparkles className="w-6 h-6 text-neon-orange mx-auto mb-2" />
                <div className="text-sm text-white font-medium">Harika bir stil!</div>
                <div className="text-xs text-white/70">FindOut ile keşfet</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyLink}
              className="flex items-center space-x-2 p-3 glass-card rounded-2xl hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-white/70" />
              )}
              <span className="text-sm text-white/80">
                {copied ? 'Kopyalandı!' : 'Link Kopyala'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 p-3 glass-card rounded-2xl hover:bg-white/10 transition-colors"
            >
              <QrCode className="w-4 h-4 text-white/70" />
              <span className="text-sm text-white/80">QR Kod</span>
            </motion.button>
          </div>

          {/* Platform Share Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(`https://instagram.com/stories/camera/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <Instagram className="w-5 h-5 text-white" />
              <div className="flex-1 text-left">
                <div className="font-medium text-white">Instagram'da Paylaş</div>
                <div className="text-xs text-white/80">Story veya post olarak paylaş</div>
              </div>
              <Sparkles className="w-4 h-4 text-white/70" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Bu outfiti çok beğendim! ${shareUrl}`)}`, '_blank')}
              className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <div className="flex-1 text-left">
                <div className="font-medium text-white">WhatsApp'ta Paylaş</div>
                <div className="text-xs text-white/80">Arkadaşlarına gönder</div>
              </div>
              <Heart className="w-4 h-4 text-white/70" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 p-4 neon-gradient rounded-2xl hover:shadow-lg hover:shadow-neon-orange/25 transition-all"
            >
              <Download className="w-5 h-5 text-white" />
              <div className="flex-1 text-left">
                <div className="font-medium text-white">Görsel İndir</div>
                <div className="text-xs text-white/80">Telefonuna kaydet</div>
              </div>
              <Zap className="w-4 h-4 text-white/70" />
            </motion.button>
          </div>

          {/* Viral Stats Preview */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Viral Potansiyeli</span>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 4 ? 'bg-neon-orange' : 'bg-white/20'}`} />
                  ))}
                </div>
                <span className="text-neon-orange font-medium">94%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViralSharePanel;