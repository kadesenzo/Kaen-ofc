
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Wrench } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('Rafael');
  const [password, setPassword] = useState('enZo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Rafael' && password === 'enZo1234') {
      localStorage.setItem('kaenpro_auth', 'true');
      onLogin();
    } else {
      setError('Credenciais incorretas.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-[#cc1d1d]/30">
      <div className="w-full max-w-sm space-y-12 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#cc1d1d] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#cc1d1d]/30 mb-8 transform -rotate-3 transition-transform hover:rotate-0">
            <Wrench className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter leading-none uppercase italic">Kaen<span className="text-[#cc1d1d]">pro</span></h1>
          <p className="text-[9px] text-zinc-600 font-bold tracking-[0.4em] uppercase mt-4">Internal Management Suite</p>
        </div>

        <div className="bg-[#111111] border border-zinc-800/60 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#cc1d1d]/40 shadow-[0_0_20px_rgba(204,29,29,0.3)]"></div>
          
          <div className="mb-10 text-center">
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Autenticação</h2>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Insira suas credenciais internas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-1">Usuário</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none transition-all placeholder:text-zinc-800 shadow-inner"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none transition-all pr-14 shadow-inner"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-[10px] text-red-500 font-bold text-center italic animate-pulse">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-[#cc1d1d] hover:bg-[#b01818] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#cc1d1d]/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 text-[10px] tracking-widest uppercase"
            >
              LIBERAR ACESSO <Lock size={14} />
            </button>
          </form>
        </div>
        <p className="text-center text-zinc-800 text-[9px] font-bold tracking-[0.2em] uppercase">© 2025 KAENPRO ELITE v2.5</p>
      </div>
    </div>
  );
};

export default Login;
