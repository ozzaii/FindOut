import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shuffle, 
  Layers, 
  Palette, 
  Wand2,
  Plus,
  RotateCcw,
  Download,
  Share2,
  Sparkles,
  Target,
  Zap,
  Crown
} from 'lucide-react';

interface OutfitRemixerProps {
  baseOutfit: any;
  onRemixCreated: (remix: any) => void;
}

const OutfitRemixer: React.FC<OutfitRemixerProps> = ({ baseOutfit, onRemixCreated }) => {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [remixMode, setRemixMode] = useState<'color' | 'layer' | 'style' | 'ai'>('style');
  const [isRemixing, setIsRemixing] = useState(false);
  const [remixResults, setRemixResults] = useState<any[]>([]);
  
  // Prevent unused variable warning
  console.log('Base outfit:', baseOutfit);
  console.log('On remix created:', onRemixCreated);

  const remixModes = [
    {
      id: 'style',
      name: 'Stil Değiştir',
      icon: Crown,
      color: 'from-purple-500 to-indigo-500',
      description: 'Stil DNA\'sını değiştir'
    },
    {
      id: 'color',
      name: 'Renk Paleti',
      icon: Palette,
      color: 'from-blue-500 to-cyan-500',
      description: 'Renkleri yeniden düzenle'
    },
    {
      id: 'layer',
      name: 'Katman Oyunu',
      icon: Layers,
      color: 'from-green-500 to-emerald-500',
      description: 'Katmanları karıştır'
    },
    {
      id: 'ai',
      name: 'AI Yaratık',
      icon: Wand2,
      color: 'from-neon-orange to-red-500',
      description: 'Yapay zeka ile sürpriz'
    }
  ];

  const outfitElements = [
    { id: 'top', name: 'Üst', selected: true },
    { id: 'bottom', name: 'Alt', selected: true },
    { id: 'shoes', name: 'Ayakkabı', selected: false },
    { id: 'accessories', name: 'Aksesuar', selected: false },
    { id: 'bag', name: 'Çanta', selected: false },
    { id: 'jewelry', name: 'Takı', selected: false }
  ];

  const colorPalettes = [
    { name: 'Sonbahar Sıcaklığı', colors: ['#8B4513', '#D2691E', '#DAA520', '#CD853F'] },
    { name: 'Kış Soğukları', colors: ['#4682B4', '#6495ED', '#87CEEB', '#B0C4DE'] },
    { name: 'Bahar Tazesi', colors: ['#98FB98', '#90EE90', '#32CD32', '#228B22'] },
    { name: 'Yaz Ateşi', colors: ['#FF6347', '#FF4500', '#FFA500', '#FFD700'] },
    { name: 'Gece Büyüsü', colors: ['#2F2F4F', '#483D8B', '#6A5ACD', '#9370DB'] },
    { name: 'Neon Çılgınlık', colors: ['#FF1493', '#00FF7F', '#FF6600', '#7FFF00'] }
  ];

  const handleElementToggle = (elementId: string) => {
    setSelectedElements(prev => 
      prev.includes(elementId) 
        ? prev.filter(id => id !== elementId)
        : [...prev, elementId]
    );
  };

  const runRemixAI = async () => {
    setIsRemixing(true);
    
    // Simulate AI remix processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockRemixes = [
      {
        id: 'remix_1',
        title: 'Bohemian Twist',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop',
        changes: ['Flowy elements added', 'Earth tones enhanced', 'Boho accessories'],
        viralScore: 94,
        style: 'Bohemian Chic'
      },
      {
        id: 'remix_2',
        title: 'Minimalist Edge',
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=400&fit=crop',
        changes: ['Clean lines emphasized', 'Neutral palette', 'Structured silhouette'],
        viralScore: 88,
        style: 'Minimalist Modern'
      },
      {
        id: 'remix_3',
        title: 'Street Style Fusion',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
        changes: ['Urban elements', 'Bold color pops', 'Layered textures'],
        viralScore: 92,
        style: 'Urban Street'
      }
    ];

    setRemixResults(mockRemixes);
    setIsRemixing(false);
  };

  return (
    <div className="space-y-6">
      {/* Remix Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-neon-orange to-red-500 rounded-2xl flex items-center justify-center">
          <Shuffle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold gradient-text">Outfit Remix Studio</h3>
          <p className="text-white/60 text-sm">Outfitini yaratıcı şekillerde dönüştür</p>
        </div>
      </div>

      {/* Remix Mode Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {remixModes.map((mode) => (
          <motion.button
            key={mode.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRemixMode(mode.id as any)}
            className={`p-4 glass-card rounded-2xl border-2 transition-all ${
              remixMode === mode.id
                ? 'border-neon-orange bg-neon-orange/10'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className={`w-8 h-8 bg-gradient-to-r ${mode.color} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
              <mode.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm font-medium text-white">{mode.name}</div>
            <div className="text-xs text-white/50 mt-1">{mode.description}</div>
          </motion.button>
        ))}
      </div>

      {/* Element Selection */}
      <div className="glass-card p-4 rounded-2xl">
        <h4 className="text-sm font-medium text-white/80 mb-3">Hangi Parçaları Remixle?</h4>
        <div className="grid grid-cols-3 gap-3">
          {outfitElements.map((element) => (
            <motion.button
              key={element.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleElementToggle(element.id)}
              className={`p-3 rounded-xl border-2 transition-all ${
                selectedElements.includes(element.id)
                  ? 'border-neon-orange bg-neon-orange/20 text-white'
                  : 'border-white/20 text-white/70 hover:border-white/40'
              }`}
            >
              <div className="text-sm font-medium">{element.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color Palette Selection */}
      {remixMode === 'color' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-2xl"
        >
          <h4 className="text-sm font-medium text-white/80 mb-3">Renk Paleti Seç</h4>
          <div className="grid gap-3">
            {colorPalettes.map((palette, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 p-3 glass-card rounded-xl hover:bg-white/5 transition-all"
              >
                <div className="flex space-x-1">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-sm text-white font-medium">{palette.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Remix Controls */}
      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runRemixAI}
          disabled={isRemixing}
          className="flex-1 flex items-center justify-center space-x-3 p-4 neon-gradient rounded-2xl hover:shadow-lg hover:shadow-neon-orange/25 transition-all disabled:opacity-50"
        >
          {isRemixing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-white font-medium">AI Remixliyor...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 text-white" />
              <span className="text-white font-medium">AI Remix Yap</span>
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-4 glass-card rounded-2xl hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* AI Processing Animation */}
      <AnimatePresence>
        {isRemixing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl text-center"
          >
            <div className="space-y-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
                className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center mx-auto"
              >
                <Layers className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h4 className="text-lg font-bold text-white mb-2">AI Remix Sihri Yaratıyor...</h4>
                <div className="space-y-2 text-sm text-white/60">
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Stil DNA'nı analiz ediyor...
                  </motion.p>
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    Trendlerle karşılaştırıyor...
                  </motion.p>
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    Sürpriz kombinasyonlar yaratıyor...
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remix Results */}
      <AnimatePresence>
        {remixResults.length > 0 && !isRemixing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-white">🎨 {remixResults.length} Süper Remix!</h4>
              <div className="flex items-center space-x-2 text-sm text-white/60">
                <Target className="w-4 h-4" />
                <span>Viral potansiyelli</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {remixResults.map((remix, index) => (
                <motion.div
                  key={remix.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl overflow-hidden group hover:bg-white/5 transition-all cursor-pointer"
                >
                  {/* Remix Image */}
                  <div className="relative">
                    <img 
                      src={remix.image} 
                      alt={remix.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center space-x-2">
                      <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white">
                        {remix.style}
                      </div>
                      <div className="w-8 h-8 bg-neon-gradient rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{remix.viralScore}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 glass-card p-2 rounded-xl">
                      <div className="text-white font-medium text-sm">{remix.title}</div>
                    </div>
                  </div>

                  {/* Remix Details */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium text-white/80">Değişiklikler:</h5>
                      {remix.changes.map((change: string, i: number) => (
                        <div key={i} className="text-xs text-white/60 flex items-center space-x-2">
                          <Sparkles className="w-3 h-3 text-neon-orange" />
                          <span>{change}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 px-3 bg-neon-orange/20 text-neon-orange rounded-xl text-xs font-medium hover:bg-neon-orange/30 transition-colors">
                        <Download className="w-3 h-3 inline mr-1" />
                        İndir
                      </button>
                      <button className="flex-1 py-2 px-3 glass-card rounded-xl text-xs text-white hover:bg-white/10 transition-colors">
                        <Share2 className="w-3 h-3 inline mr-1" />
                        Paylaş
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Create More Remixes */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runRemixAI}
              className="w-full py-4 glass-card rounded-2xl border-2 border-dashed border-white/20 hover:border-neon-orange/50 transition-colors"
            >
              <div className="flex items-center justify-center space-x-3">
                <Plus className="w-5 h-5 text-neon-orange" />
                <span className="text-white font-medium">Daha Fazla Remix Yarat</span>
                <Zap className="w-5 h-5 text-neon-orange" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OutfitRemixer;