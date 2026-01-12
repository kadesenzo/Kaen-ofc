
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Wrench, CheckCircle, ClipboardList, Plus, Trash2, ArrowRight, Car, Package, X } from 'lucide-react';
import type { ServiceItem, ChecklistItem } from '../types';

const MechanicTerminal: React.FC = () => {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'service' | 'checklist'>('service');
  
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [km, setKm] = useState('');
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [itemType, setItemType] = useState<'service' | 'part'>('service');

  const [checklistVehicleId, setChecklistVehicleId] = useState('');
  const [checklistKm, setChecklistKm] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { label: 'Óleo do Motor', status: 'ok' },
    { label: 'Nível de Arrefecimento', status: 'ok' },
    { label: 'Pastilhas de Freio', status: 'ok' },
    { label: 'Pneus e Calibragem', status: 'ok' },
    { label: 'Iluminação Externa', status: 'ok' },
    { label: 'Suspensão Geral', status: 'ok' },
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
    if (!selectedVehicleId || serviceItems.length === 0) return alert('Selecione veículo e adicione itens.');
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
    alert('Serviço lançado com sucesso!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111111] p-8 rounded-[2.5rem] border border-zinc-800/40 shadow-2xl">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Terminal Operacional</h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Lançamento de campo em tempo real.</p>
        </div>
        <div className="flex bg-black p-2 rounded-2xl border border-zinc-800/40">
          <button 
            onClick={() => setActiveTab('service')}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'service' ? 'bg-[#cc1d1d] text-white shadow-lg shadow-[#cc1d1d]/20' : 'text-zinc-600'}`}
          >
            <Wrench size={16} /> Lançar Serviço
          </button>
          <button 
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'checklist' ? 'bg-[#cc1d1d] text-white shadow-lg shadow-[#cc1d1d]/20' : 'text-zinc-600'}`}
          >
            <ClipboardList size={16} /> Checklist
          </button>
        </div>
      </header>

      {activeTab === 'service' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-[#111111] border border-zinc-800/40 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
               <h3 className="text-lg font-black text-white italic uppercase tracking-widest border-b border-zinc-800/40 pb-4">Dados Entrada</h3>
               <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1">Veículo Alvo</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold appearance-none focus:border-[#cc1d1d] transition-all"
                        value={selectedVehicleId}
                        onChange={(e) => setSelectedVehicleId(e.target.value)}
                      >
                        <option value="">Buscar veículo...</option>
                        {context.vehicles.map(v => (
                          <option key={v.id} value={v.id}>{v.model} - {v.plate}</option>
                        ))}
                      </select>
                      <Car className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 pointer-events-none" size={20} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1">Odômetro Atual</label>
                    <input 
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none"
                      placeholder="000.000 KM"
                      value={km}
                      onChange={(e) => setKm(e.target.value)}
                    />
                 </div>
               </div>
            </section>

            <section className="bg-[#111111] border border-zinc-800/40 rounded-[2.5rem] p-10 space-y-6 shadow-2xl">
               <h3 className="text-lg font-black text-white italic uppercase tracking-widest border-b border-zinc-800/40 pb-4">Lançar Item</h3>
               <div className="flex gap-2 p-1 bg-black rounded-xl border border-zinc-800/40">
                  <button onClick={() => setItemType('service')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${itemType === 'service' ? 'bg-zinc-800 text-white' : 'text-zinc-700'}`}>Mão de Obra</button>
                  <button onClick={() => setItemType('part')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${itemType === 'part' ? 'bg-zinc-800 text-white' : 'text-zinc-700'}`}>Peças</button>
               </div>
               <div className="space-y-4">
                  <input 
                    className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold focus:border-[#cc1d1d] outline-none uppercase"
                    placeholder="Descrição do serviço/peça..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <input 
                      type="number"
                      className="flex-1 bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none"
                      placeholder="R$ 0,00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <button onClick={handleAddServiceItem} className="bg-[#cc1d1d] text-white p-5 rounded-2xl shadow-xl shadow-[#cc1d1d]/20 transform active:scale-95 transition-transform">
                      <Plus size={24} />
                    </button>
                  </div>
               </div>
            </section>
          </div>

          <section className="bg-[#111111] border border-zinc-800/40 rounded-[3rem] p-10 space-y-8 shadow-2xl">
             <div className="flex items-center justify-between border-b border-zinc-800/40 pb-6">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Resumo de Lançamento</h3>
                <p className="text-4xl font-black text-green-500 font-mono">R$ {serviceItems.reduce((acc, i) => acc + i.price, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
             </div>

             <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {serviceItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-black border border-zinc-800/40 rounded-2xl group hover:border-[#cc1d1d]/30 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-red-500">
                         {item.type === 'service' ? <Wrench size={20} /> : <Package size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase italic tracking-tight leading-none">{item.description}</p>
                        <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1 tracking-widest">{item.type === 'service' ? 'SERVIÇO' : 'PEÇA'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="text-xl font-black text-white font-mono">R$ {item.price.toFixed(2)}</p>
                      <button onClick={() => removeItem(idx)} className="text-zinc-800 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                {serviceItems.length === 0 && (
                   <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800/40 rounded-[2rem] opacity-20">
                      <ClipboardList size={48} className="mb-4" />
                      <p className="font-black italic uppercase text-[10px] tracking-widest">Aguardando itens...</p>
                   </div>
                )}
             </div>

             <button 
                onClick={handleFinalizeService}
                disabled={serviceItems.length === 0}
                className="w-full bg-[#cc1d1d] hover:bg-[#b01818] disabled:opacity-30 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl shadow-[#cc1d1d]/30 transition-all transform active:scale-[0.98]"
              >
                FINALIZAR E ENVIAR PARA FATURAMENTO <ArrowRight size={20} />
              </button>
          </section>
        </div>
      ) : (
        <div className="bg-[#111111] border border-zinc-800/40 rounded-[3rem] p-10 space-y-10 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1">Carro do Checklist</label>
              <select 
                className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold appearance-none"
                value={checklistVehicleId}
                onChange={(e) => setChecklistVehicleId(e.target.value)}
              >
                <option value="">Selecionar...</option>
                {context.vehicles.map(v => <option key={v.id} value={v.id}>{v.model} - {v.plate}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1">KM Atual</label>
              <input 
                className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold"
                placeholder="000.000"
                value={checklistKm}
                onChange={(e) => setChecklistKm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklistItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 bg-black border border-zinc-800/40 rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest italic">{item.label}</span>
                <div className="flex gap-2">
                   <button onClick={() => setChecklistItems(prev => prev.map((it, i) => i === idx ? { ...it, status: 'ok' } : it))} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${item.status === 'ok' ? 'bg-green-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-800 hover:text-green-500'}`}><CheckCircle size={20} /></button>
                   <button onClick={() => setChecklistItems(prev => prev.map((it, i) => i === idx ? { ...it, status: 'issue' } : it))} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${item.status === 'issue' ? 'bg-red-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-800 hover:text-red-500'}`}><X size={20} /></button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => alert('Checklist Registrado')} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black py-6 rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-xl transition-all">SALVAR CHECKLIST DE INSPEÇÃO</button>
        </div>
      )}
    </div>
  );
};

export default MechanicTerminal;
