import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Plus, ArrowRight } from 'lucide-react';
import { useAI } from '../lib/AIContext';

const products = [
  {
    name: 'Signature Pomade',
    price: 28,
    category: 'Hair',
    image: 'https://picsum.photos/seed/pomade/400/500'
  },
  {
    name: 'Beard Elixir',
    price: 35,
    category: 'Skin',
    image: 'https://picsum.photos/seed/beard/400/500'
  },
  {
    name: 'Flawless Tee',
    price: 45,
    category: 'Apparel',
    image: 'https://picsum.photos/seed/tee/400/500'
  }
];

export default function Merchandise() {
  const { setSelectedProduct } = useAI();

  return (
    <section id="merchandise" className="py-24 bg-brand-gray/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
          <div className="text-center md:text-left">
            <span className="text-brand-green font-mono text-xs tracking-widest uppercase mb-4 block">The Shop</span>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter">Premium <br /> Goods</h2>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-brand-green transition-colors">
            Shop All Merchandise <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-[4/5] glass rounded-3xl overflow-hidden mb-6 relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => setSelectedProduct(product.name)}
                    className="w-16 h-16 bg-brand-green text-black rounded-full flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
                  >
                    <Plus size={32} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold mb-1">{product.category}</p>
                  <h4 className="text-xl font-bold uppercase">{product.name}</h4>
                </div>
                <span className="text-xl font-bold">${product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
