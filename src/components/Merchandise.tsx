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
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const goodsCategories = ['All', 'Hair', 'Skin', 'Accessories'];
  const swagCategories = ['All', 'Hats', 'Tees', 'Jackets', 'Hoodies', 'Mugs'];

  const filteredProducts = products.filter(p => {
    if (p.type !== activeTab) return false;
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    return true;
  });

  const nextSlide = () => {
    if (filteredProducts.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
    resetSelections();
  };

  const prevSlide = () => {
    if (filteredProducts.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
    resetSelections();
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
          <div className="flex flex-wrap justify-center gap-2">
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

          {/* Controls (Arrows) */}
          {filteredProducts.length > 1 && (
            <div className="flex justify-center gap-8 mt-4">
              <button 
                onClick={prevSlide} 
                className="flex items-center justify-center text-white/50 hover:text-brand-green transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={nextSlide} 
                className="flex items-center justify-center text-white/50 hover:text-brand-green transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-white/50 uppercase tracking-widest">
            No products found in this category.
          </div>
        ) : (
          <>
            {/* Slider Area */}
            <div className="relative h-[600px] flex items-center justify-center mb-12">
              
              {/* Previous Slide (Partial) */}
              {filteredProducts.length > 1 && (
                <div 
                  className="absolute left-0 w-1/3 h-[400px] opacity-30 scale-75 -translate-x-1/2 cursor-pointer z-0 hidden md:block"
                  onClick={prevSlide}
                >
                  <img src={filteredProducts[getSlideIndex(-1)].image} alt="Previous" className="w-full h-full object-cover rounded-3xl grayscale transition-all duration-700" referrerPolicy="no-referrer" />
                </div>
              )}

              {/* Current Slide */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`${activeTab}-${activeCategory}-${currentIndex}`}
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 w-full md:w-1/2 h-[500px] glass rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
                >
                  <img src={currentProduct.image} alt={currentProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  
                  {/* Product Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8 pt-32">
                     <div className="flex justify-between items-end mb-4">
                       <div>
                         <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold mb-1">{currentProduct.category}</p>
                         <h3 className="text-3xl font-bold uppercase">{currentProduct.name}</h3>
                       </div>
                       <span className="text-3xl font-bold text-brand-green">${currentProduct.price}</span>
                     </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Next Slide (Partial) */}
              {filteredProducts.length > 1 && (
                <div 
                  className="absolute right-0 w-1/3 h-[400px] opacity-30 scale-75 translate-x-1/2 cursor-pointer z-0 hidden md:block"
                  onClick={nextSlide}
                >
                  <img src={filteredProducts[getSlideIndex(1)].image} alt="Next" className="w-full h-full object-cover rounded-3xl grayscale transition-all duration-700" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>

            {/* Pagination Dots */}
            {filteredProducts.length > 1 && (
              <div className="flex justify-center gap-4 mb-12">
                {filteredProducts.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setCurrentIndex(idx); resetSelections(); }}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      idx === currentIndex ? "w-8 bg-brand-green" : "w-2 bg-white/20 hover:bg-white/50"
                    )}
                  />
                ))}
              </div>
            )}

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
