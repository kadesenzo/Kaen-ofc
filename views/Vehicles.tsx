
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Plus, Search, Car, User, Milestone, X, CarFront, Trash2 } from 'lucide-react';

const Vehicles: React.FC = () => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [customerId, setCustomerId] = useState('');
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [km, setKm] = useState('');

  if (!context) return null;

  const filteredVehicles = context.vehicles.filter(v => 
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !model || !plate) return;
    context.addVehicle({ customerId, model, plate, km });
    setModel('');
    setPlate('');
    setKm('');
    setCustomerId('');
    setIsModalOpen(false);
  };

  const confirmDelete = (id: string) => {
    if (window.confirm("Deseja realmente excluir este veículo? Isso também removerá todas as notas ligadas a ele.")) {
      context.deleteVehicle(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Frota de Veículos</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Gerenciamento técnico de automóveis cadastrados.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#cc1d1d] hover:bg-[#b01818] text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-2xl shadow-red-900/30 transition-all active:scale-[0.98]"
        >
          <Plus size={20} /> ADICIONAR VEÍCULO
        </button>
      </header>

      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="Pesquisar por modelo ou placa..."
          className="w-full bg-[#141414] border border-zinc-800/50 rounded-2xl py-5 pl-14 pr-6 text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-[#cc1d1d] transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map(vehicle => {
          const owner = context.customers.find(c => c.id === vehicle.customerId);
          return (
            <div key={vehicle.id} className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-8 group hover:border-red-600/30 transition-all relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:text-red-500 transition-colors border border-zinc-800/50 shadow-inner">
                    <Car size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{vehicle.model}</h3>
                    <div className="mt-2 bg-red-600/10 border border-red-600/20 px-3 py-0.5 rounded-lg inline-block">
                      <p className="text-red-500 font-mono text-sm font-black tracking-widest uppercase">{vehicle.plate}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => confirmDelete(vehicle.id)}
                  className="text-zinc-700 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-zinc-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <User size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Proprietário</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-200">{owner?.name || 'Não identificado'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Milestone size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Quilometragem</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-200">{vehicle.km || '0'} KM</span>
                </div>
              </div>

              <div className="mt-8">
                 <button className="w-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                   VER HISTÓRICO DE SERVIÇOS
                 </button>
              </div>
            </div>
          );
        })}
        
        {filteredVehicles.length === 0 && (
          <div className="col-span-full py-32 bg-[#141414]/50 border-2 border-dashed border-zinc-800/50 rounded-[3rem] text-center">
             <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-zinc-700">
               <Car size={40} />
             </div>
             <h4 className="text-xl font-black text-zinc-400 uppercase italic">Nenhum veículo encontrado.</h4>
             <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest mt-2">Cadastre um novo veículo para iniciar o acompanhamento.</p>
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
                   <CarFront size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Cadastrar Veículo</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Proprietário</label>
                  <select 
                    required
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:outline-none focus:border-[#cc1d1d] transition-all appearance-none"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  >
                    <option value="">Selecione o proprietário...</option>
                    {context.customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Modelo</label>
                    <input 
                      required
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:outline-none focus:border-[#cc1d1d] transition-all"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Ex: Golf GTI"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Placa</label>
                    <input 
                      required
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:outline-none focus:border-[#cc1d1d] transition-all"
                      value={plate}
                      onChange={(e) => setPlate(e.target.value)}
                      placeholder="ABC-1234"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">KM Inicial</label>
                  <input 
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:outline-none focus:border-[#cc1d1d] transition-all"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    placeholder="000.000"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#cc1d1d] hover:bg-[#b01818] text-white font-black py-5 rounded-2xl shadow-2xl shadow-red-900/40 transform active:scale-[0.98] transition-all"
                >
                  CONCLUIR CADASTRO
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
