
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
// Added X to imports
import { Wrench, CheckCircle, ClipboardList, Plus, Trash2, ArrowRight, Car, Package, X } from 'lucide-react';
import type { ServiceItem, ChecklistItem } from '../types';

const MechanicTerminal: React.FC = () => {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'service' | 'checklist'>('service');
  
  // Service Launch State
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [km, setKm] = useState('');
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [itemType, setItemType] = useState<'service' | 'part'>('service');

  // Checklist State
  const [checklistVehicleId, setChecklistVehicleId] = useState('');
  const [checklistKm, setChecklistKm] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { label: 'Óleo do Motor', status: 'ok' },
    { label: 'Nível de Arrefecimento', status: 'ok' },
    { label: 'Pastilhas de Freio', status: 'ok' },
    { label: 'Pneus e Calibragem', status: 'ok' },
    { label: 'Lâmpadas / Iluminação', status: 'ok' },
    { label: 'Suspensão', status: 'ok' },
    { label: 'Correia Dentada', status: 'ok' },
  ]);

  if (!context) return null;

  const handleAddServiceItem = () => {
    if (!desc || !price) return;
    setServiceItems([...serviceItems, { description: desc.toUpperCase(), price: parseFloat(price), type: itemType }]);
    setDesc('');
    setPrice('');
  };

  const removeItem = (index: number) => {
    setServiceItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinalizeService = () => {
    if (!selectedVehicleId || serviceItems.length === 0) return alert('Selecione um veículo e adicione ao menos um item.');
    const vehicle = context.vehicles.find(v => v.id === selectedVehicleId);
    if (!vehicle) return;

    context.addOrder({
      vehicleId: selectedVehicleId,
      customerId: vehicle.customerId,
      date: new Date().toISOString().split('T')[0],
      km,
      items: serviceItems,
      notes: '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    setServiceItems([]);
    setSelectedVehicleId('');
    setKm('');
    alert('Serviço enviado com sucesso para a área de Notas!');
  };

  const handleFinalizeChecklist = () => {
    if (!checklistVehicleId) return alert('Selecione um veículo.');
    context.addChecklist({
      vehicleId: checklistVehicleId,
      date: new Date().toISOString().split('T')[0],
      km: checklistKm,
      items: checklistItems,
      generalNotes: ''
    });
    setChecklistVehicleId('');
    setChecklistKm('');
    alert('Checklist salvo com sucesso!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#141414] p-8 rounded-[2.5rem] border border-zinc-800/50 shadow-2xl">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Terminal Mecânico</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Painel operacional para lançamento técnico.</p>
        </div>
        <div className="flex bg-[#0a0a0a] p-1.5 rounded-2xl border border-zinc-800/50">
          <button 
            onClick={() => setActiveTab('service')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'service' ? 'bg-[#cc1d1d] text-white shadow-xl shadow-red-900/20' : 'text-zinc-500 hover:text-white'}`}
          >
            <Wrench size={18} /> LANÇAR SERVIÇO
          </button>
          <button 
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'checklist' ? 'bg-[#cc1d1d] text-white shadow-xl shadow-red-900/20' : 'text-zinc-500 hover:text-white'}`}
          >
            <ClipboardList size={18} /> CHECKLIST
          </button>
        </div>
      </header>

      {activeTab === 'service' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-10 space-y-6 shadow-2xl">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-red-600/10 text-red-500 rounded-2xl">
                   <Car size={20} />
                 </div>
                 <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Veículo em Manutenção</h3>
               </div>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Selecionar Carro</label>
                    <select 
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none transition-all appearance-none"
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                    >
                      <option value="">Buscar veículo...</option>
                      {context.vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.model} - {v.plate}</option>
                      ))}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Quilometragem (KM)</label>
                    <input 
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none"
                      placeholder="000.000"
                      value={km}
                      onChange={(e) => setKm(e.target.value)}
                    />
                 </div>
               </div>
            </section>

            <section className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-10 space-y-6 shadow-2xl">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
                   <Plus size={20} />
                 </div>
                 <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Registrar Operação</h3>
               </div>

               <div className="flex gap-2 p-1.5 bg-[#0a0a0a] rounded-xl border border-zinc-800/50">
                  <button onClick={() => setItemType('service')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${itemType === 'service' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>Mão de Obra</button>
                  <button onClick={() => setItemType('part')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${itemType === 'part' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>Peça / Insumo</button>
               </div>

               <div className="space-y-4">
                  <input 
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none"
                    placeholder="O que foi feito?"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <input 
                      type="number"
                      className="flex-1 bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none"
                      placeholder="Valor R$"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <button 
                      onClick={handleAddServiceItem}
                      className="bg-[#cc1d1d] text-white p-4 rounded-xl shadow-xl shadow-red-900/20 active:scale-95 transition-all"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
               </div>
            </section>
          </div>

          <section className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Itens Lançados</h3>
                <div className="text-right">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Parcial</p>
                   <p className="text-3xl font-black text-green-500 font-mono">R$ {serviceItems.reduce((acc, i) => acc + i.price, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
             </div>

             <div className="space-y-3">
                {serviceItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-[#0a0a0a] border border-zinc-800/30 rounded-2xl group hover:border-red-600/20 transition-all">
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'service' ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-800 text-blue-500'}`}>
                         {item.type === 'service' ? <Wrench size={18} /> : <Package size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase italic tracking-tight">{item.description}</p>
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{item.type === 'service' ? 'MÃO DE OBRA' : 'PEÇA'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="text-xl font-black text-white font-mono">R$ {item.price.toFixed(2)}</p>
                      <button 
                        onClick={() => removeItem(idx)}
                        className="text-zinc-700 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                {serviceItems.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed border-zinc-800/50 rounded-[2rem]">
                    <p className="text-zinc-700 font-black uppercase italic text-xs tracking-[0.2em]">Aguardando lançamentos...</p>
                  </div>
                )}
             </div>

             <div className="flex justify-end pt-4">
                <button 
                  onClick={handleFinalizeService}
                  disabled={serviceItems.length === 0}
                  className="bg-[#cc1d1d] hover:bg-[#b01818] disabled:opacity-30 disabled:hover:bg-[#cc1d1d] text-white px-12 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-red-900/30 transition-all active:scale-95"
                >
                  CONCLUIR E ENVIAR PARA NOTA <ArrowRight size={20} />
                </button>
             </div>
          </section>
        </div>
      ) : (
        <div className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-10 space-y-10 shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Veículo do Checklist</label>
               <select 
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none transition-all appearance-none"
                  value={checklistVehicleId}
                  onChange={(e) => setChecklistVehicleId(e.target.value)}
                >
                  <option value="">Selecionar carro...</option>
                  {context.vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.model} - {v.plate}</option>
                  ))}
                </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Quilometragem (KM)</label>
               <input 
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none"
                  placeholder="000.000"
                  value={checklistKm}
                  onChange={(e) => setChecklistKm(e.target.value)}
                />
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xl font-black text-white italic uppercase tracking-tighter border-b border-zinc-800/50 pb-4">Verificação Pré-Serviço</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {checklistItems.map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between p-6 bg-[#0a0a0a] border border-zinc-800/30 rounded-2xl">
                    <span className="text-sm font-black uppercase italic tracking-tight">{item.label}</span>
                    <div className="flex gap-3">
                       <button 
                        onClick={() => setChecklistItems(prev => prev.map((it, i) => i === idx ? { ...it, status: 'ok' } : it))}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${item.status === 'ok' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'bg-zinc-900 text-zinc-700 hover:text-zinc-500'}`}
                       >
                         <CheckCircle size={20} />
                       </button>
                       <button 
                        onClick={() => setChecklistItems(prev => prev.map((it, i) => i === idx ? { ...it, status: 'issue' } : it))}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${item.status === 'issue' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-zinc-900 text-zinc-700 hover:text-zinc-500'}`}
                       >
                         <X size={20} />
                       </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          <button 
            onClick={handleFinalizeChecklist}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black py-6 rounded-[2rem] uppercase tracking-widest text-xs transition-all shadow-xl"
          >
            CONCLUIR E REGISTRAR CHECKLIST
          </button>
        </div>
      )}
    </div>
  );
};

export default MechanicTerminal;
