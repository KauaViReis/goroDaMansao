import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Trash2, Plus, Minus, CheckSquare, ShieldCheck } from 'lucide-react';

export default function Checkout() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleCheckout = async () => {
    if (!user) {
      alert('Por favor, faça login para finalizar a compra.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: user.name,
          customer_email: user.email,
          total: total,
          items: items
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrderId(data.id);
      setSuccess(true);
      clearCart();
    } catch (err) {
      alert('Erro ao finalizar compra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="bg-surface-near-black border border-nvidia-green p-12 rounded-sm shadow-[0_0_50px_rgba(118,185,0,0.15)] text-center max-w-lg w-full relative z-10">
          <div className="mx-auto flex items-center justify-center h-20 w-20 border-2 border-nvidia-green rounded-sm mb-8 bg-nvidia-green/10">
            <CheckSquare className="h-10 w-10 text-nvidia-green" />
          </div>
          <h2 className="text-3xl font-display font-bold tracking-widest text-pure-white mb-4 uppercase">SISTEMA ATIVADO</h2>
          <p className="text-gray-300 mb-8 text-sm tracking-wide">
            O PEDIDO <span className="text-nvidia-green font-bold">#{orderId}</span> FOI REGISTRADO NA REDE. VOCÊ RECEBERÁ OS DADOS DE RASTREIO EM BREVE.
          </p>
          <Link
            to="/catalog"
            className="inline-block w-full bg-nvidia-green hover:bg-[#5a8f00] text-true-black font-bold tracking-widest uppercase py-4 px-8 rounded-sm transition-colors"
          >
            VOLTAR AO CATÁLOGO
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="text-center relative z-10">
          <h2 className="text-3xl font-display font-bold tracking-widest text-pure-white uppercase mb-4">CARRINHO VAZIO</h2>
          <p className="text-gray-300 mb-8 text-sm tracking-widest uppercase">NENHUMA ENERGIA DETECTADA NO SISTEMA.</p>
          <Link
            to="/catalog"
            className="inline-block bg-transparent border-2 border-nvidia-green hover:bg-nvidia-green text-nvidia-green hover:text-true-black font-bold tracking-widest uppercase py-4 px-8 rounded-sm transition-colors"
          >
            INICIAR BUSCA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-widest text-pure-white uppercase mb-10 border-l-4 border-nvidia-green pl-4">
          CARRINHO DE COMPRAS
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="flex-grow space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-surface-near-black p-4 md:p-6 rounded-sm border border-border-gray hover:border-nvidia-green/50 flex flex-col sm:flex-row items-center gap-6 transition-colors">
                <div className="h-24 w-24 flex-shrink-0 bg-true-black border border-border-gray rounded-sm p-2 flex items-center justify-center">
                  <img src={item.image_url} alt={item.name} className="max-h-full object-contain filter drop-shadow-[0_0_10px_rgba(118,185,0,0.1)]" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-xl font-display font-bold tracking-widest text-pure-white uppercase">{item.name}</h3>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-nvidia-green mt-1 uppercase">{item.profile}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-true-black border border-border-gray rounded-sm p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-nvidia-green text-gray-400 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-pure-white text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-nvidia-green text-gray-400 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="w-24 text-right">
                    <span className="font-display font-bold text-lg text-pure-white">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-border-gray hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-colors border border-transparent hover:border-red-500/50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-surface-near-black p-8 rounded-sm border border-border-gray sticky top-32">
              <div className="flex items-center gap-3 mb-6 border-b border-border-gray pb-4">
                <ShieldCheck className="text-nvidia-green" size={24} />
                <h2 className="text-xl font-display font-bold tracking-widest text-pure-white uppercase">
                  RESUMO DO SISTEMA
                </h2>
              </div>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-300 font-bold tracking-widest uppercase">
                  <span>Subtotal</span>
                  <span className="text-pure-white">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300 font-bold tracking-widest uppercase">
                  <span>Frete Logístico</span>
                  <span className="text-nvidia-green">GRÁTIS</span>
                </div>
              </div>
              
              {/* TOTAL GASTO HIGHLIGHT */}
              <div className="border border-nvidia-green bg-nvidia-green/10 p-6 mb-8 text-center rounded-sm">
                <p className="text-xs font-bold text-gray-300 tracking-widest uppercase mb-2">INVESTIMENTO TOTAL</p>
                <div className="text-4xl font-display font-bold text-nvidia-green flex justify-center items-center gap-1">
                  <span className="text-2xl">R$</span> {total.toFixed(2)}
                </div>
              </div>

              {!user && (
                <div className="mb-6 p-4 bg-true-black border border-border-gray text-gray-300 text-xs font-bold tracking-widest uppercase text-center">
                  AUTENTICAÇÃO NECESSÁRIA.{' '}
                  <Link to="/login" className="text-nvidia-green hover:underline">ENTRE AQUI</Link>.
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-nvidia-green hover:bg-[#5a8f00] disabled:bg-border-gray disabled:text-gray-400 text-true-black font-bold tracking-widest uppercase py-4 px-4 rounded-sm transition-colors flex justify-center items-center border-2 border-transparent disabled:border-border-gray"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-true-black border-t-transparent"></div>
                ) : (
                  'INICIAR SEQUÊNCIA DE COMPRA'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
