
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { UserPlus, User, ShieldCheck, Trash2, X, Briefcase } from 'lucide-react';

const Team: React.FC = () => {
  const context = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  if (!context) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;
    context.addStaff({ name, role });
    setName('');
    setRole('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Equipe Profissional</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Gestão de colaboradores e permissões de acesso.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#cc1d1d] hover:bg-[#b01818] text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-2xl shadow-red-900/30 transition-all active:scale-[0.98]"
        >
          <UserPlus size={20} /> NOVO COLABORADOR
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {context.team.map(member => (
          <div key={member.id} className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-8 group hover:border-red-600/30 transition-all relative overflow-hidden">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-red-600/30 flex items-center justify-center text-zinc-600 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl">
                <User size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{member.name}</h3>
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-2">{member.role}</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-zinc-800/30">
               <div className="flex items-center justify-between text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span>Acesso ao Sistema</span>
                  </div>
                  <span className="text-zinc-300">ATIVO</span>
               </div>
               <div className="flex items-center justify-between text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    <span>ID Funcional</span>
                  </div>
                  <span className="text-zinc-300">#{member.id.substr(0, 4).toUpperCase()}</span>
               </div>
            </div>

            <div className="mt-8">
               <button className="w-full text-zinc-700 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors py-2">
                 Desativar Colaborador
               </button>
            </div>
          </div>
        ))}

        {context.team.length === 0 && (
           <div className="col-span-full py-32 bg-[#141414]/50 border-2 border-dashed border-zinc-800/50 rounded-[3rem] text-center">
            <User className="mx-auto text-zinc-700 mb-6" size={40} />
            <h4 className="text-xl font-black text-zinc-400 uppercase italic">Equipe Vazia</h4>
            <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest mt-2">Nenhum membro da equipe registrado no sistema.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#141414] border border-zinc-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-10 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-[#cc1d1d] rounded-2xl text-white">
                   <UserPlus size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Novo Colaborador</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    autoFocus
                    required
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:outline-none focus:border-[#cc1d1d] transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome do colaborador"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Cargo / Função</label>
                  <select 
                    required
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:outline-none focus:border-[#cc1d1d] transition-all appearance-none"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Selecione a função...</option>
                    <option value="Mecânico Líder">Mecânico Líder</option>
                    <option value="Mecânico Auxiliar">Mecânico Auxiliar</option>
                    <option value="Consultor Técnico">Consultor Técnico</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Estagiário">Estagiário</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#cc1d1d] hover:bg-[#b01818] text-white font-black py-5 rounded-2xl shadow-2xl shadow-red-900/40 transform active:scale-[0.98] transition-all mt-4"
                >
                  CADASTRAR MEMBRO
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
