import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-nvidia-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block border border-nvidia-green bg-nvidia-green/10 px-3 py-1 mb-6">
            <span className="text-nvidia-green font-bold text-xs tracking-[0.2em] uppercase">Estoque Ativo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-pure-white tracking-widest uppercase mb-4">
            NOSSO <span className="text-nvidia-green">CATÁLOGO</span>
          </h1>
          <p className="text-sm font-bold tracking-widest text-gray-300 max-w-2xl mx-auto uppercase">
            ESCOLHA SUA FONTE DE ENERGIA. FÓRMULAS EXCLUSIVAS PARA FOCO EXTREMO E PERFORMANCE ABSURDA.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-surface-near-black rounded-sm overflow-hidden border border-border-gray flex flex-col group hover:border-nvidia-green transition-colors duration-300">
              <div className="relative h-64 bg-true-black p-6 flex items-center justify-center border-b border-border-gray">
                <div className="absolute top-4 right-4 border border-nvidia-green text-nvidia-green bg-black/50 backdrop-blur-sm text-[10px] font-bold px-2 py-1 tracking-widest uppercase z-10">
                  {product.tag}
                </div>
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="max-h-full object-contain filter drop-shadow-[0_0_15px_rgba(118,185,0,0.1)] group-hover:drop-shadow-[0_0_25px_rgba(118,185,0,0.3)] group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-[10px] font-bold text-nvidia-green uppercase tracking-[0.2em] mb-2">
                  {product.profile}
                </div>
                <h3 className="text-2xl font-display font-bold text-pure-white uppercase mb-3 tracking-wide">{product.name}</h3>
                <p className="text-gray-300 text-sm flex-grow mb-6 leading-relaxed">{product.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-gray">
                  <span className="text-xl font-display font-bold text-pure-white">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addItem(product)}
                    className="bg-transparent border-2 border-nvidia-green hover:bg-nvidia-green text-nvidia-green hover:text-true-black font-bold tracking-widest text-xs uppercase py-3 px-6 rounded-sm transition-all duration-200"
                  >
                    ADICIONAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
