import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      login(data.user, data.token);
      navigate('/catalog');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <div className="max-w-md w-full space-y-8 bg-surface-near-black p-10 rounded-sm border border-border-gray relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold tracking-widest text-pure-white uppercase">
            AUTENTICAÇÃO
          </h2>
          <p className="mt-2 text-center text-xs font-bold tracking-widest text-gray-300 uppercase">
            SISTEMA RESTRITO.{' '}
            <Link to="/register" className="font-bold text-nvidia-green hover:text-pure-white transition-colors underline">
              CRIAR CREDENCIAIS
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-sm text-xs font-bold tracking-widest uppercase">{error}</div>}
          <div className="rounded-sm shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-300 mb-1 uppercase">E-mail</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-true-black border border-border-gray placeholder-gray-500 text-pure-white rounded-sm focus:outline-none focus:ring-1 focus:ring-nvidia-green focus:border-nvidia-green sm:text-sm font-body"
                placeholder="SEU@EMAIL.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-300 mb-1 uppercase">Senha</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-true-black border border-border-gray placeholder-gray-500 text-pure-white rounded-sm focus:outline-none focus:ring-1 focus:ring-nvidia-green focus:border-nvidia-green sm:text-sm font-body"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border-2 border-nvidia-green text-xs tracking-widest font-bold rounded-sm text-true-black bg-nvidia-green hover:bg-[#5a8f00] hover:border-[#5a8f00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-nvidia-green transition-colors uppercase"
            >
              INICIAR SESSÃO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
