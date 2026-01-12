
import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Wrench } from 'lucide-react';

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
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 selection:bg-red-600/30">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-[#cc1d1d] rounded-2xl flex items-center justify-center shadow-2xl shadow-red-900/40 transform -rotate-6 mb-6">
            <Wrench className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none uppercase">Kaen<span className="text-[#cc1d1d]">pro</span></h1>
          <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase">Sistema Interno de Gestão</p>
        </div>

        <div className="bg-[#141414] border border-zinc-800/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#cc1d1d]"></div>
          
          <div className="mb-8">
            <h2 className="text-xl font-black text-white italic tracking-tighter">Acesso Restrito</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Insira suas credenciais para acessar o painel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Usuário</label>
              <div className="relative">
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#cc1d1d]/50 focus:border-[#cc1d1d] transition-all"
                  placeholder="Seu usuário"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#cc1d1d]/50 focus:border-[#cc1d1d] transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative w-4 h-4 rounded border border-zinc-700 bg-zinc-900 group-hover:border-[#cc1d1d] transition-colors overflow-hidden">
                  <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" defaultChecked />
                  <div className="absolute inset-0 bg-[#cc1d1d] scale-0 peer-checked:scale-100 transition-transform flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Lembrar acesso</span>
              </label>
              <a href="#" className="text-[10px] text-red-500 font-black uppercase tracking-widest hover:underline">Esqueci minha senha</a>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#cc1d1d] hover:bg-[#b01818] text-white font-black py-4 rounded-xl shadow-xl shadow-red-900/30 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
            >
              ACESSAR SISTEMA
              <Lock size={16} />
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-700 text-[10px] font-bold tracking-widest uppercase">
          © 2024 KAENPRO MANAGEMENT SUITE • V 2.1.0
        </p>
      </div>
    </div>
  );
};

export default Login;
