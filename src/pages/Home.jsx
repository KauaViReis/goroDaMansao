import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import TechSpecs from '../components/TechSpecs';
import TerminalFaq from '../components/TerminalFaq';
import { db } from '../lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), limit(5));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (productsList.length > 0) {
          setProducts(productsList);
        }
      } catch (err) {
        console.error('Failed to fetch products from Firestore', err);
      }
    };

    fetchProducts();
  }, []);

  // Auto carousel effect
  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(timer);
  }, [products]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.9
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.9
      };
    }
  };

  // Fallback se não tiver produtos (ainda carregando ou erro)
  const currentProduct = products.length > 0 ? products[currentIndex] : null;

  return (
    <div className="bg-black min-h-screen text-pure-white overflow-hidden relative flex flex-col justify-center">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      
      {/* Luzes animadas baseadas no produto */}
      <motion.div 
        key={`glow-${currentIndex}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-nvidia-green/10 rounded-full blur-[120px] pointer-events-none"
      ></motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
        {currentProduct ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="space-y-8"
              >
                <div className="inline-block border border-nvidia-green bg-nvidia-green/10 px-3 py-1">
                  <span className="text-nvidia-green font-bold text-xs tracking-[0.2em] uppercase">{currentProduct.tag || "LANÇAMENTO 2026"}</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-pure-white leading-[1.1] uppercase">
                  {currentProduct.name.split(' ')[0]} <br />
                  <span className="text-nvidia-green">{currentProduct.name.split(' ').slice(1).join(' ')}</span>
                </h1>
                
                <p className="text-lg text-gray-300 max-w-lg font-body leading-relaxed h-24">
                  {currentProduct.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/catalog" className="bg-nvidia-green hover:bg-[#5a8f00] text-true-black font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all duration-200 text-center text-sm border-2 border-nvidia-green">
                    OBTER AGORA — R$ {currentProduct.price.toFixed(2)}
                  </Link>
                  <Link to="/about" className="bg-transparent hover:bg-surface-near-black text-pure-white border border-border-gray hover:border-nvidia-green font-bold tracking-widest uppercase px-8 py-4 rounded-sm transition-all duration-200 text-center text-sm">
                    VER ESPECIFICAÇÕES
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="relative flex justify-center items-center h-[500px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.img 
                  key={currentProduct.image_url}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  src={currentProduct.image_url} 
                  alt={currentProduct.name} 
                  className="absolute z-10 w-full max-w-[450px] h-auto object-contain drop-shadow-[0_0_40px_rgba(118,185,0,0.4)]"
                />
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-nvidia-green border-t-transparent"></div>
          </div>
        )}

        {/* Navigation Controls */}
        {products.length > 1 && (
          <div className="absolute bottom-8 right-8 flex gap-4 z-20">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 border border-border-gray bg-true-black flex items-center justify-center text-pure-white hover:border-nvidia-green hover:text-nvidia-green transition-colors rounded-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 border border-border-gray bg-true-black flex items-center justify-center text-pure-white hover:border-nvidia-green hover:text-nvidia-green transition-colors rounded-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
        
        {/* Progress Indicators */}
        {products.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {products.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 transition-all duration-300 rounded-full ${
                  idx === currentIndex ? 'w-8 bg-nvidia-green shadow-[0_0_10px_rgba(118,185,0,0.8)]' : 'w-2 bg-border-gray'
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>

      <TechSpecs />
      <TerminalFaq />
    </div>
  );
}
