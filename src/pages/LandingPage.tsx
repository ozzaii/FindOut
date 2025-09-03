import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Heart, 
  Share2, 
  ShoppingBag, 
  Users, 
  Zap, 
  TrendingUp,
  Star,
  ArrowRight,
  Play,
  Camera
} from 'lucide-react';
import type { User } from '../types';

interface LandingPageProps {
  user: User | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ user: _user }) => {
  const navigate = useNavigate();
  const [currentOutfit, setCurrentOutfit] = useState(0);

  // Demo outfit data
  const outfits = [
    {
      id: 1,
      user: "Zeynep",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop",
      likes: 2345,
      products: [
        { name: "Cream Sweater", price: "₺299", brand: "Zara" },
        { name: "Black Midi Skirt", price: "₺189", brand: "H&M" },
        { name: "Ankle Boots", price: "₺450", brand: "Mango" }
      ]
    },
    {
      id: 2,
      user: "Ayşe",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop",
      likes: 1876,
      products: [
        { name: "Denim Jacket", price: "₺399", brand: "Trendyol" },
        { name: "White Tee", price: "₺79", brand: "LC Waikiki" },
        { name: "Black Jeans", price: "₺249", brand: "Zara" }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleExploreClick = () => {
    navigate('/feed');
  };

  const handleUploadClick = () => {
    navigate('/upload');
  };

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex items-center justify-center relative"
      >
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants} className="space-y-8">
            <motion.h1 
              className="text-6xl lg:text-8xl font-display font-black leading-none"
            >
              <span className="text-white">Style</span>
              <br />
              <span className="gradient-text">Keşfinin</span>
              <br />
              <span className="text-neon-orange">Geleceği</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-white/80 max-w-lg leading-relaxed font-body"
            >
              Gerçek insanların üzerinde gördüğünüz kıyafetleri bulun. 
              AI destekli stil önerilerimizle moda yolculuğunuzu başlatın.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={handleExploreClick}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="neon-button flex items-center space-x-3 px-8 py-4 text-lg"
              >
                <Play className="w-6 h-6" />
                <span>Keşfet</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={handleUploadClick}
                whileHover={{ scale: 1.05 }}
                className="glass-card px-8 py-4 rounded-2xl border-2 border-white/10 hover:border-neon-orange/50 transition-all duration-300 flex items-center space-x-3"
              >
                <Camera className="w-6 h-6 text-neon-orange" />
                <span>İlk Outfit'ini Yükle</span>
              </motion.button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-orange">10K+</div>
                <div className="text-white/60 text-sm">Aktif Kullanıcı</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-orange">50K+</div>
                <div className="text-white/60 text-sm">Outfit Keşfi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-orange">99%</div>
                <div className="text-white/60 text-sm">Memnuniyet</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Outfit Card */}
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentOutfit}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="outfit-card p-6 max-w-md mx-auto"
              >
                <div className="relative mb-4">
                  <img 
                    src={outfits[currentOutfit].image}
                    alt="Outfit"
                    className="w-full h-80 object-cover rounded-xl"
                  />
                  <div className="absolute top-3 right-3 glass-card p-2 rounded-xl">
                    <Heart className="w-5 h-5 text-neon-orange" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 glass-card p-3 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-neon-gradient rounded-full flex items-center justify-center text-xs font-bold">
                          {outfits[currentOutfit].user[0]}
                        </div>
                        <span className="font-medium">{outfits[currentOutfit].user}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-white/80">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{outfits[currentOutfit].likes}</span>
                        </span>
                        <Share2 className="w-4 h-4 cursor-pointer hover:text-neon-orange" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-white mb-3">Shop the look</h3>
                  {outfits[currentOutfit].products.map((product, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-3 glass-card rounded-xl cursor-pointer hover:border-neon-orange/30"
                    >
                      <div>
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-white/60">{product.brand}</div>
                      </div>
                      <div className="text-neon-orange font-bold">{product.price}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Outfit Navigation */}
            <div className="flex justify-center space-x-2 mt-6">
              {outfits.map((_, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentOutfit(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentOutfit ? 'bg-neon-orange shadow-neon' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="w-6 h-10 border-2 border-neon-orange rounded-full flex justify-center">
            <div className="w-1 h-3 bg-neon-orange rounded-full mt-2 animate-pulse" />
          </div>
          <p className="text-xs text-white/60 mt-2">Kaydır</p>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-display font-bold text-center mb-16"
          >
            <span className="gradient-text">Neden FindOut?</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "AI Powered Search",
                description: "Görüntü bazlı arama ile istediğiniz kıyafeti anında bulun"
              },
              {
                icon: Users,
                title: "Gerçek İnsanlar",
                description: "Modellerden değil, sizin gibi gerçek insanlardan ilham alın"
              },
              {
                icon: TrendingUp,
                title: "Trend Analizi",
                description: "AI ile gelecekteki trendleri önceden keşfedin"
              },
              {
                icon: ShoppingBag,
                title: "Direkt Alışveriş",
                description: "Beğendiğiniz her ürünün linkine anında ulaşın"
              },
              {
                icon: Star,
                title: "Kişisel Stil",
                description: "Size özel stil önerileri alın ve profilinizi geliştirin"
              },
              {
                icon: Zap,
                title: "Anlık Bildirimler",
                description: "Favori markalarınızdan yeni ürünler çıktığında haber alın"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card p-8 rounded-2xl text-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-neon-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-neon-orange">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6 text-center"
      >
        <div className="max-w-4xl mx-auto glass-card p-12 rounded-3xl">
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-display font-bold mb-6 gradient-text"
          >
            Stilinizi Keşfetmeye Hazır mısınız?
          </motion.h2>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Binlerce kullanıcı zaten FindOut ile moda yolculuğunu başlattı. 
            Siz de katılın ve stilinizi bir üst seviyeye taşıyın.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={handleExploreClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="neon-button text-lg px-8 py-4"
            >
              Hemen Başla
            </motion.button>
            <motion.button
              onClick={handleUploadClick}
              whileHover={{ scale: 1.05 }}
              className="glass-card px-8 py-4 rounded-2xl border-2 border-white/10 hover:border-neon-orange/50 transition-all duration-300"
            >
              İlk Outfit'ini Yükle
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">FindOut</span>
          </div>
          <p className="text-white/60 mb-6">Moda keşfinin geleceği, bugün başlıyor.</p>
          <p className="text-sm text-white/40">
            © 2024 FindOut. Tüm hakları saklıdır. Made with ❤️ in Turkey.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;