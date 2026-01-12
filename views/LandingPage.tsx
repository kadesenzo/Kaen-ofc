
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Car, ShieldCheck, MapPin, Phone, Instagram, Clock, ChevronRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-[#cc1d1d]/30">
      {/* Header Público */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#cc1d1d] rounded-lg flex items-center justify-center">
              <Wrench className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter italic uppercase leading-none">Kaen<span className="text-[#cc1d1d]">pro</span></h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#servicos" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#cc1d1d] transition-colors">Serviços</a>
            <a href="#sobre" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#cc1d1d] transition-colors">Sobre Nós</a>
            <a href="#contato" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#cc1d1d] transition-colors">Contato</a>
          </nav>

          <Link 
            to="/login" 
            className="bg-zinc-900 border border-zinc-800 hover:border-[#cc1d1d] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
          >
            Acessar Sistema <ChevronRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,#cc1d1d15,transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <span className="text-[#cc1d1d] font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Performance & Precisão</span>
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">
              CUIDAMOS DO SEU <span className="text-[#cc1d1d]">LEGADO.</span>
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-xl">
              Oficina especializada em mecânica de alta performance, diagnósticos avançados e manutenção preventiva de elite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://wa.me/5519998765432" 
                target="_blank"
                className="bg-[#cc1d1d] hover:bg-[#b01818] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#cc1d1d]/20 transition-all text-center"
              >
                Agendar Manutenção
              </a>
              <a 
                href="#servicos"
                className="bg-zinc-900 border border-zinc-800 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-center hover:bg-zinc-800"
              >
                Nossos Serviços
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-32 px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">Serviços <span className="text-[#cc1d1d]">Especializados</span></h3>
            <div className="w-20 h-1 bg-[#cc1d1d] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Car, title: 'Injeção & Performance', desc: 'Remapeamento, limpeza de bicos e diagnósticos computadorizados de última geração.' },
              { icon: Wrench, title: 'Mecânica Geral', desc: 'Revisão de motores, câmbio, suspensão e freios com peças genuínas.' },
              { icon: ShieldCheck, title: 'Checklist Premium', desc: 'Inspeção rigorosa de mais de 50 itens para garantir sua total segurança nas pistas.' }
            ].map((s, i) => (
              <div key={i} className="bg-[#111111] border border-zinc-800/50 p-10 rounded-[2.5rem] hover:border-[#cc1d1d]/30 transition-all group">
                <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:text-[#cc1d1d] mb-8 transition-colors">
                  <s.icon size={28} />
                </div>
                <h4 className="text-xl font-black uppercase italic mb-4">{s.title}</h4>
                <p className="text-zinc-500 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Público */}
      <footer id="contato" className="py-20 px-6 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#cc1d1d] rounded flex items-center justify-center">
                <Wrench className="text-white" size={16} />
              </div>
              <h1 className="text-xl font-black text-white tracking-tighter italic uppercase leading-none">Kaen<span className="text-[#cc1d1d]">pro</span></h1>
            </div>
            <p className="text-zinc-600 text-sm font-medium">Sua oficina de confiança para projetos especiais e manutenção de rotina.</p>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Localização & Contato</h5>
            <ul className="space-y-4 text-sm text-zinc-500 font-medium">
              <li className="flex items-center gap-3"><MapPin size={16} className="text-[#cc1d1d]" /> Rua Joaquim Marques Alves, 765 - Mogi Guaçu</li>
              <li className="flex items-center gap-3"><Phone size={16} className="text-[#cc1d1d]" /> (19) 99876-5432</li>
              <li className="flex items-center gap-3"><Clock size={16} className="text-[#cc1d1d]" /> Seg - Sex: 08:00 às 18:00</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Siga-nos</h5>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-[#cc1d1d] transition-all shadow-xl">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-800/30 text-center">
          <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">© 2025 KAENPRO ELITE MECÂNICA • DESENVOLVIDO PARA ALTA PERFORMANCE</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
