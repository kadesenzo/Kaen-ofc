
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Wrench, CheckCircle, ClipboardList, Plus, Trash2, ArrowRight, Car, Package, X, Gauge } from 'lucide-react';
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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111111] p-10 rounded-[2.5rem] border border-zinc-800/40 shadow-2xl">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Terminal de Oficina</h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Lançamento operacional em tempo real.</p>
        </div>
        <div className="flex bg-black p-2 rounded-2xl border border-zinc-800/40">
          <button 
            onClick={() => setActiveTab('service')}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'service' ? 'bg-[#cc1d1d] text-white shadow-lg shadow-[#cc1d1d]/20' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <Wrench size={16} /> LANÇAR SERVIÇO
          </button>
          <button 
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${activeTab === 'checklist' ? 'bg-[#cc1d1d] text-white shadow-lg shadow-[#cc1d1d]/20' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <ClipboardList size={16} /> CHECKLIST
          </button>
        </div>
      </header>

      {activeTab === 'service' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-[#111111] border border-zinc-800/40 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
               <h3 className="text-lg font-black text-white italic uppercase tracking-widest border-b border-zinc-800/20 pb-5 flex items-center gap-3">
                 <Car size={20} className="text-[#cc1d1d]" /> Dados Técnicos
               </h3>
               <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1">Selecione o Veículo</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold appearance-none focus:border-[#cc1d1d] transition-all outline-none"
                        value={selectedVehicleId}
                        onChange={(e) => setSelectedVehicleId(e.target.value)}
                      >
                        <option value="">Buscar veículo em pátio...</option>
                        {context.vehicles.map(v => (
                          <option key={v.id} value={v.id}>{v.model} - {v.plate}</option>
                        ))}
                      </select>
                      <X className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 pointer-events-none" size={20} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1">Odômetro (KM)</label>
                    <div className="relative">
                       <input 
                        className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none pl-14"
                        placeholder="000.000"
                        value={km}
                        onChange={(e) => setKm(e.target.value)}
                      />
                      <Gauge className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800" size={20} />
                    </div>
                 </div>
               </div>
            </section>

            <section className="bg-[#111111] border border-zinc-800/40 rounded-[2.5rem] p-10 space-y-6 shadow-2xl">
               <h3 className="text-lg font-black text-white italic uppercase tracking-widest border-b border-zinc-800/20 pb-5">Adicionar Itens</h3>
               <div className="flex gap-2 p-1.5 bg-black rounded-2xl border border-zinc-800/40">
                  <button onClick={() => setItemType('service')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${itemType === 'service' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600'}`}>Mão de Obra</button>
                  <button onClick={() => setItemType('part')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${itemType === 'part' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600'}`}>Peças / Insumos</button>
               </div>
               <div className="space-y-4 pt-2">
                  <input 
                    className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold focus:border-[#cc1d1d] outline-none uppercase"
                    placeholder="Descrição do item..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <div className="flex gap-4">
                    <input 
                      type="number"
                      className="flex-1 bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none"
                      placeholder="Valor Unit. R$"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <button onClick={handleAddServiceItem} className="bg-[#cc1d1d] hover:bg-[#b01818] text-white p-6 rounded-2xl shadow-xl shadow-[#cc1d1d]/20 transition-all transform active:scale-90">
                      <Plus size={24} />
                    </button>
                  </div>
               </div>
            </section>
          </div>

          <section className="bg-[#111111] border border-zinc-800/40 rounded-[3rem] p-10 space-y-10 shadow-2xl">
             <div className="flex items-center justify-between border-b border-zinc-800/10 pb-8">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Resumo da Manutenção</h3>
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Parcial</p>
                  <p className="text-5xl font-black text-[#cc1d1d] font-mono tracking-tighter italic">R$ {serviceItems.reduce((acc, i) => acc + i.price, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-4 max-h-[450px] overflow-y-auto custom-scrollbar pr-3">
                {serviceItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-black border border-zinc-800/40 rounded-3xl group hover:border-zinc-700 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-white transition-colors">
                         {item.type === 'service' ? <Wrench size={22} /> : <Package size={22} />}
                      </div>
                      <div>
                        <p className="text-base font-black text-white uppercase italic tracking-tight leading-none">{item.description}</p>
                        <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1.5 tracking-widest">{item.type === 'service' ? 'MÃO DE OBRA' : 'COMPONENTE / PEÇA'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <p className="text-2xl font-black text-white font-mono tracking-tighter">R$ {item.price.toFixed(2)}</p>
                      <button onClick={() => removeItem(idx)} className="text-zinc-800 hover:text-red-500 transition-colors p-3">
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                ))}
                {serviceItems.length === 0 && (
                   <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800/40 rounded-[3rem] opacity-20">
                      <ClipboardList size={56} className="mb-6" />
                      <p className="font-black italic uppercase text-[11px] tracking-widest">Aguardando lançamento de itens...</p>
                   </div>
                )}
             </div>

             <button 
                onClick={handleFinalizeService}
                disabled={serviceItems.length === 0}
                className="w-full bg-[#cc1d1d] hover:bg-[#b01818] disabled:opacity-20 text-white py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-5 shadow-2xl shadow-[#cc1d1d]/30 transition-all transform active:scale-[0.98]"
              >
                FINALIZAR E GERAR ORDEM <ArrowRight size={22} />
              </button>
          </section>
        </div>
      ) : (
        <div className="bg-[#111111] border border-zinc-800/40 rounded-[3rem] p-12 space-y-12 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1">Carro do Checklist</label>
              <select 
                className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold appearance-none outline-none focus:border-[#cc1d1d] transition-all"
                value={checklistVehicleId}
                onChange={(e) => setChecklistVehicleId(e.target.value)}
              >
                <option value="">Selecionar veículo...</option>
                {context.vehicles.map(v => <option key={v.id} value={v.id}>{v.model} - {v.plate}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-1">KM Atual</label>
              <input 
                className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold font-mono focus:border-[#cc1d1d] outline-none"
                placeholder="000.000"
                value={checklistKm}
                onChange={(e) => setChecklistKm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {checklistItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-7 bg-black border border-zinc-800/40 rounded-[2rem] hover:border-zinc-700 transition-all">
                <span className="text-[11px] font-black uppercase tracking-widest italic text-zinc-400">{item.label}</span>
                <div className="flex gap-3">
                   <button onClick={() => setChecklistItems(prev => prev.map((it, i) => i === idx ? { ...it, status: 'ok' } : it))} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${item.status === 'ok' ? 'bg-green-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-800 hover:text-green-500'}`}><CheckCircle size={22} /></button>
                   <button onClick={() => setChecklistItems(prev => prev.map((it, i) => i === idx ? { ...it, status: 'issue' } : it))} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${item.status === 'issue' ? 'bg-red-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-800 hover:text-red-500'}`}><X size={22} /></button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => alert('Checklist Registrado')} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black py-7 rounded-[2.5rem] uppercase tracking-[0.4em] text-[11px] shadow-xl transition-all">REGISTRAR INSPEÇÃO TÉCNICA</button>
        </div>
      )}
    </div>
  );
};

export default MechanicTerminal;
