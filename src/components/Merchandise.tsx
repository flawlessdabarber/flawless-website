import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAI } from '../lib/AIContext';
import { useCart } from '../lib/CartContext';
import { cn } from '../lib/utils';

const products = [
  // GOODS
  {
    id: 'pomade-1',
    name: 'Signature Pomade',
    price: 28,
    category: 'Hair',
    type: 'Goods',
    image: 'https://picsum.photos/seed/pomade/800/600',
    sizes: ['2oz', '4oz'],
    colors: ['Original'],
    deliveryDate: '2-3 Business Days'
  },
  {
    id: 'elixir-1',
    name: 'Beard Elixir',
    price: 35,
    category: 'Skin',
    type: 'Goods',
    image: 'https://picsum.photos/seed/beard/800/600',
    sizes: ['1oz', '2oz'],
    colors: ['Amber'],
    deliveryDate: '2-3 Business Days'
  },
  {
    id: 'comb-1',
    name: 'Carbon Fiber Comb',
    price: 15,
    category: 'Accessories',
    type: 'Goods',
    image: 'https://picsum.photos/seed/comb/800/600',
    sizes: [],
    colors: ['Black'],
    deliveryDate: '2-3 Business Days'
  },
  {
    id: 'brush-1',
    name: 'Boar Bristle Brush',
    price: 25,
    category: 'Accessories',
    type: 'Goods',
    image: 'https://picsum.photos/seed/brush/800/600',
    sizes: [],
    colors: ['Wood'],
    deliveryDate: '2-3 Business Days'
  },
  {
    id: 'durag-1',
    name: 'Silky Du-Rag',
    price: 12,
    category: 'Accessories',
    type: 'Goods',
    image: 'https://picsum.photos/seed/durag/800/600',
    sizes: [],
    colors: ['Black', 'White', 'Navy'],
    deliveryDate: '2-3 Business Days'
  },
  // SWAG
  {
    id: 'tee-1',
    name: 'Flawless Tee',
    price: 45,
    category: 'Tees',
    type: 'Swag',
    image: 'https://picsum.photos/seed/tee/800/600',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Olive'],
    deliveryDate: '3-5 Business Days'
  },
  {
    id: 'hoodie-1',
    name: 'Premium Hoodie',
    price: 85,
    category: 'Hoodies',
    type: 'Swag',
    image: 'https://picsum.photos/seed/hoodie/800/600',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey'],
    deliveryDate: '3-5 Business Days'
  },
  {
    id: 'hat-1',
    name: 'Signature Snapback',
    price: 30,
    category: 'Hats',
    type: 'Swag',
    image: 'https://picsum.photos/seed/hat/800/600',
    sizes: ['One Size'],
    colors: ['Black', 'Navy'],
    deliveryDate: '3-5 Business Days'
  },
  {
    id: 'jacket-1',
    name: 'Barber Bomber Jacket',
    price: 120,
    category: 'Jackets',
    type: 'Swag',
    image: 'https://picsum.photos/seed/jacket/800/600',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Olive'],
    deliveryDate: '3-5 Business Days'
  },
  {
    id: 'mug-1',
    name: 'Ceramic Mug',
    price: 18,
    category: 'Mugs',
    type: 'Swag',
    image: 'https://picsum.photos/seed/mug/800/600',
    sizes: [],
    colors: ['Matte Black', 'White'],
    deliveryDate: '3-5 Business Days'
  }
];

export default function Merchandise() {
  const { setSelectedProduct } = useAI();
  const { addItem } = useCart();
  
  const [activeTab, setActiveTab] = useState<'Goods' | 'Swag'>('Goods');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leftClicks, setLeftClicks] = useState(0);
  const [rightClicks, setRightClicks] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const goodsCategories = ['All', 'Hair', 'Skin', 'Accessories'];
  const swagCategories = ['All', 'Hats', 'Tees', 'Jackets', 'Hoodies', 'Mugs'];

  const filteredProducts = products.filter(p => {
    if (p.type !== activeTab) return false;
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    return true;
  });

  const nextSlide = () => {
    if (filteredProducts.length === 0) return;
    setRightClicks(c => c + 1);
    setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
    resetSelections();
    setSelectedId(null);
  };

  const prevSlide = () => {
    if (filteredProducts.length === 0) return;
    setLeftClicks(c => c + 1);
    setCurrentIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
    resetSelections();
    setSelectedId(null);
  };

  const resetSelections = () => {
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  };

  const handleTabChange = (tab: 'Goods' | 'Swag') => {
    setActiveTab(tab);
    setActiveCategory('All');
    setCurrentIndex(0);
    resetSelections();
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentIndex(0);
    resetSelections();
  };

  const currentProduct = filteredProducts[currentIndex];

  const handleAddToCart = () => {
    if (!currentProduct) return;
    
    if (currentProduct.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    if (currentProduct.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }

    addItem({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      category: currentProduct.category,
      image: currentProduct.image,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity,
      deliveryDate: currentProduct.deliveryDate,
      tracking: 'Pending'
    });
    
    setSelectedProduct(`${currentProduct.name} added to cart`);
    resetSelections();
  };

  const getSlideIndex = (offset: number) => {
    if (filteredProducts.length === 0) return 0;
    return (currentIndex + offset + filteredProducts.length) % filteredProducts.length;
  };

  return (
    <section id="merchandise" className="py-24 bg-brand-gray/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center md:text-left mb-12">
          <span className="text-brand-green font-mono text-xs tracking-widest uppercase mb-4 block">The Shop</span>
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter">Premium <br className="hidden md:block" /> Goods & Swag</h2>
        </div>

        {/* Controls (Tabs + Filters) Centered above product */}
        <div className="flex flex-col items-center justify-center gap-6 mb-12">
          {/* Goods | Swag Tabs */}
          <div className="flex items-center gap-4 bg-black/30 p-2 rounded-2xl backdrop-blur-sm border border-white/5">
            <button 
              onClick={() => handleTabChange('Goods')}
              className={cn(
                "px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                activeTab === 'Goods' ? "bg-brand-green text-black" : "text-white/50 hover:text-white"
              )}
            >
              Goods
            </button>
            <button 
              onClick={() => handleTabChange('Swag')}
              className={cn(
                "px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                activeTab === 'Swag' ? "bg-brand-green text-black" : "text-white/50 hover:text-white"
              )}
            >
              Swag
            </button>
          </div>

          {/* Subcategories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(activeTab === 'Goods' ? goodsCategories : swagCategories).map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                  activeCategory === category 
                    ? "border-brand-green text-brand-green bg-brand-green/10" 
                    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-white/50 uppercase tracking-widest">
            No products found in this category.
          </div>
        ) : (
          <>
            {/* Slider Area */}
            <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center py-12 mb-12">
              <button 
                onClick={prevSlide}
                className="absolute left-0 md:left-12 z-20 p-4 glass rounded-full hover:bg-white/10 transition-colors"
              >
                <motion.div
                  key={leftClicks}
                  initial={{ color: "#ffffff", scale: 1, filter: "drop-shadow(0 0 0px #00ff00)" }}
                  animate={leftClicks > 0 ? { 
                    color: ["#ffffff", "#00ff00", "#ffffff", "#808080", "#00ff00", "#ffffff", "#ffffff"],
                    scale: [1, 1.6, 0.7, 1.4, 0.8, 1.2, 1],
                    x: [0, -8, 8, -4, 4, -2, 0],
                    y: [0, 4, -4, 2, -2, 1, 0],
                    skewX: [0, 30, -30, 15, -15, 5, 0],
                    opacity: [1, 0, 1, 0.2, 1, 0.5, 1],
                    filter: [
                      "drop-shadow(0 0 0px #00ff00)",
                      "drop-shadow(0 0 40px #00ff00)",
                      "drop-shadow(0 0 10px #ffffff)",
                      "drop-shadow(0 0 50px #00ff00)",
                      "drop-shadow(0 0 20px #808080)",
                      "drop-shadow(0 0 30px #00ff00)",
                      "drop-shadow(0 0 0px #00ff00)"
                    ]
                  } : { color: "#ffffff" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <ChevronLeft size={32} />
                </motion.div>
              </button>

              <div className="flex items-center justify-center gap-4 md:gap-8 overflow-hidden w-full px-12 py-8">
                {[-1, 0, 1].map((offset) => {
                  let index = (currentIndex + offset) % filteredProducts.length;
                  if (index < 0) index += filteredProducts.length;
                  const product = filteredProducts[index];
                  const isCenter = offset === 0;

                  if (!product) return null;

                  return (
                    <button
                      key={`${product.id}-${offset}`}
                      onClick={() => {
                        if (isCenter) {
                          setSelectedId(product.id);
                        } else if (offset === -1) {
                          prevSlide();
                        } else if (offset === 1) {
                          nextSlide();
                        }
                      }}
                      className={cn(
                        "relative flex flex-col items-center transition-all duration-500",
                        isCenter ? "w-64 md:w-80 opacity-100 scale-110 z-10" : "w-40 md:w-56 opacity-30 scale-90 blur-[2px] hidden sm:flex",
                        isCenter && selectedId === product.id ? "ring-2 ring-brand-green ring-offset-4 ring-offset-black rounded-3xl" : ""
                      )}
                    >
                      <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-black group">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                        
                        {isCenter && (
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-left z-20">
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold mb-1">{product.category}</p>
                                <h3 className="text-xl md:text-2xl font-bold uppercase text-white">{product.name}</h3>
                              </div>
                              <span className="text-2xl font-bold text-brand-green">${product.price}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={nextSlide}
                className="absolute right-0 md:right-12 z-20 p-4 glass rounded-full hover:bg-white/10 transition-colors"
              >
                <motion.div
                  key={rightClicks}
                  initial={{ color: "#ffffff", scale: 1, filter: "drop-shadow(0 0 0px #00ff00)" }}
                  animate={rightClicks > 0 ? { 
                    color: ["#ffffff", "#00ff00", "#ffffff", "#808080", "#00ff00", "#ffffff", "#ffffff"],
                    scale: [1, 1.6, 0.7, 1.4, 0.8, 1.2, 1],
                    x: [0, 8, -8, 4, -4, 2, 0],
                    y: [0, 4, -4, 2, -2, 1, 0],
                    skewX: [0, -30, 30, -15, 15, -5, 0],
                    opacity: [1, 0, 1, 0.2, 1, 0.5, 1],
                    filter: [
                      "drop-shadow(0 0 0px #00ff00)",
                      "drop-shadow(0 0 40px #00ff00)",
                      "drop-shadow(0 0 10px #ffffff)",
                      "drop-shadow(0 0 50px #00ff00)",
                      "drop-shadow(0 0 20px #808080)",
                      "drop-shadow(0 0 30px #00ff00)",
                      "drop-shadow(0 0 0px #00ff00)"
                    ]
                  } : { color: "#ffffff" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <ChevronRight size={32} />
                </motion.div>
              </button>
            </div>

            {/* Options & Add to Cart */}
            <div className="max-w-3xl mx-auto glass p-8 rounded-3xl border-white/5">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Options */}
                <div className="space-y-6">
                  {currentProduct.sizes.length > 0 && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Size</label>
                      <div className="flex flex-wrap gap-2">
                        {currentProduct.sizes.map(size => (
                          <button 
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={cn(
                              "px-4 py-2 rounded-lg border text-sm font-bold transition-colors",
                              selectedSize === size ? "bg-brand-green text-black border-brand-green" : "border-white/10 hover:border-white/30"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentProduct.colors.length > 0 && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Color</label>
                      <div className="flex flex-wrap gap-2">
                        {currentProduct.colors.map(color => (
                          <button 
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                              "px-4 py-2 rounded-lg border text-sm font-bold transition-colors",
                              selectedColor === color ? "bg-brand-green text-black border-brand-green" : "border-white/10 hover:border-white/30"
                            )}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5">-</button>
                      <span className="font-bold w-8 text-center">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5">+</button>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-black/30 p-6 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Total Price:</span>
                      <span className="font-bold text-brand-green">${currentProduct.price * quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Est. Delivery:</span>
                      <span className="font-bold">{currentProduct.deliveryDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Tracking:</span>
                      <span className="font-bold">Provided via email</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-brand-green text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </section>
  );
}
