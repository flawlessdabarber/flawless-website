import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, ArrowRight, ChevronLeft, ChevronRight, Truck, MapPin } from 'lucide-react';
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
  const [direction, setDirection] = useState(0);
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

  const paginate = (newDirection: number) => {
    if (filteredProducts.length === 0) return;
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + filteredProducts.length) % filteredProducts.length);
    resetSelections();
    setSelectedId(null);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
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
          <div className="flex flex-wrap justify-center gap-2 mb-4">
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

          {/* Size and Color Options */}
          {currentProduct && (currentProduct.sizes.length > 0 || currentProduct.colors.length > 0) && (
            <div className="flex flex-col items-center gap-6 mt-2">
              {currentProduct.sizes.length > 0 && (
                <div className="flex flex-col items-center">
                  <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Size</label>
                  <div className="flex flex-wrap justify-center gap-2">
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
                <div className="flex flex-col items-center">
                  <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Color</label>
                  <div className="flex flex-wrap justify-center gap-2">
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
            <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-12 mb-12">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="flex items-center justify-center gap-4 md:gap-8 overflow-hidden w-full px-4 md:px-12 py-8 cursor-grab active:cursor-grabbing min-h-[400px]"
              >
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  {[-1, 0, 1].map((offset) => {
                    let displayProducts = [...filteredProducts];
                    if (filteredProducts.length === 1) {
                      displayProducts = [
                        { ...filteredProducts[0], id: filteredProducts[0].id + '-1000' },
                        filteredProducts[0],
                        { ...filteredProducts[0], id: filteredProducts[0].id + '-2000' }
                      ];
                    } else if (filteredProducts.length === 2) {
                      displayProducts = [
                        filteredProducts[0],
                        filteredProducts[1],
                        { ...filteredProducts[0], id: filteredProducts[0].id + '-1000' },
                        { ...filteredProducts[1], id: filteredProducts[1].id + '-2000' }
                      ];
                    }

                    let index = (currentIndex + offset) % displayProducts.length;
                    if (index < 0) index += displayProducts.length;
                    const product = displayProducts[index];
                    const isCenter = offset === 0;

                    if (!product) return null;
                    
                    // Use original ID for selection
                    const originalId = product.id.replace('-1000', '').replace('-2000', '');

                    return (
                      <motion.div
                        layout
                        key={product.id}
                        custom={direction}
                        initial={{ 
                          x: direction > 0 ? 100 : -100, 
                          opacity: 0,
                          scale: 0.8
                        }}
                        animate={{ 
                          x: 0, 
                          opacity: isCenter ? 1 : 0.3,
                          scale: isCenter ? 1 : 0.9,
                          filter: isCenter ? "blur(0px)" : "blur(2px)"
                        }}
                        exit={{ 
                          x: direction < 0 ? 100 : -100, 
                          opacity: 0,
                          scale: 0.8,
                          filter: "blur(4px)"
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        onClick={() => {
                          if (isCenter) {
                            setSelectedId(originalId);
                          } else if (offset === -1) {
                            paginate(-1);
                          } else {
                            paginate(1);
                          }
                        }}
                        className={cn(
                          "relative flex flex-col items-center shrink-0 cursor-pointer",
                          isCenter ? "w-64 md:w-80 z-10" : "w-40 md:w-56 hidden sm:flex z-0",
                          isCenter && selectedId === originalId ? "ring-2 ring-brand-green ring-offset-4 ring-offset-black rounded-3xl" : ""
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
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Dashes Pagination */}
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {filteredProducts.map((_, idx) => {
                  const isActive = (currentIndex % filteredProducts.length) === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > (currentIndex % filteredProducts.length) ? 1 : -1);
                        setCurrentIndex(idx);
                      }}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        isActive ? "w-8 bg-brand-green" : "w-4 bg-brand-green/20 hover:bg-brand-green/40"
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* Quantity, Total Price & Add to Cart */}
            <div className="max-w-md mx-auto flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="flex flex-col items-center">
                  <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">-</button>
                    <span className="font-bold w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Total Price</label>
                  <span className="font-bold text-brand-green text-2xl">${currentProduct.price * quantity}</span>
                </div>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="w-full py-4 bg-brand-green text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>

              {/* Delivery & Tracking Icons */}
              <div className="flex items-center justify-center gap-12 mt-8">
                <div className="relative group flex items-center justify-center cursor-help">
                  <Truck size={36} className="text-brand-green transition-transform duration-300 group-hover:scale-110" />
                  {/* Tooltip */}
                  <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-black text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg pointer-events-none whitespace-nowrap z-50 border border-brand-green/30 shadow-[0_0_20px_rgba(0,255,0,0.1)]">
                    Est. Delivery: {currentProduct.deliveryDate}
                  </div>
                </div>
                <div className="relative group flex items-center justify-center cursor-help">
                  <MapPin size={36} className="text-brand-green transition-transform duration-300 group-hover:scale-110" />
                  {/* Tooltip */}
                  <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-black text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg pointer-events-none whitespace-nowrap z-50 border border-brand-green/30 shadow-[0_0_20px_rgba(0,255,0,0.1)]">
                    Tracking Available
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </section>
  );
}
