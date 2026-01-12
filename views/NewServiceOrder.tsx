
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { ArrowLeft, Plus, Trash2, FileText, Package, Wrench, Clock, CheckCircle, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { ServiceItem } from '../types';

const NewServiceOrder: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  // Form State
  const [customerId, setCustomerId] = useState('');
  const [plate, setPlate] = useState('ABC-1234');
  const [model, setModel] = useState('Ex: Corolla');
  const [km, setKm] = useState('000000');
  const [problem, setProblem] = useState('');
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [laborValue, setLaborValue] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('pending');

  if (!context) return null;

  const handleAddItem = (type: 'service' | 'part') => {
    setItems([...items, { description: '', type, price: 0 }]);
  };

  const updateItem = (index: number, updates: Partial<ServiceItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const itemsTotal = items.reduce((sum, i) => sum + i.price, 0);
    return itemsTotal + laborValue - discount;
  };

  const handleSave = () => {
    if (!customerId) return alert('Selecione um cliente!');
    
    context.addOrder({
      customerId,
      vehicleId: 'manual', // In a real app we'd map this better
      date: new Date().toISOString().split('T')[0],
      km,
      problemDescription: problem,
      items,
      laborValue,
      discount,
      notes: '',
      status: 'pending',
      paymentStatus
    });

    alert('Nota gerada com sucesso!');
    navigate('/notas');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
          <ArrowLeft size={16} /> VOLTAR
        </Link>
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Gerar Nota <span className="text-[#cc1d1d]">Elite</span></h2>
        <div className="w-20"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Identificação Section */}
          <section className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-10 space-y-8">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-red-600/10 text-red-500 rounded-lg">
                 <Plus size={18} />
               </div>
               <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Identificação</h3>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Cliente</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold appearance-none focus:outline-none focus:border-[#cc1d1d] transition-all"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                    >
                      <option value="">Selecione um cliente...</option>
                      {context.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={18} />
                  </div>
                  {context.customers.length === 0 && <p className="text-[10px] text-zinc-600 italic">Nenhum cliente cadastrado. Vá em "Clientes" primeiro.</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Placa</label>
                    <input className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none" value={plate} onChange={(e) => setPlate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Modelo</label>
                    <input className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none" value={model} onChange={(e) => setModel(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">KM</label>
                  <input className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none" value={km} onChange={(e) => setKm(e.target.value)} />
                </div>
             </div>
          </section>

          {/* Relato do Problema Section */}
          <section className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-10 space-y-6">
             <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Relato do Problema / Serviço</h3>
             <textarea 
               placeholder="Descreva o serviço solicitado..."
               className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold min-h-[120px] focus:border-[#cc1d1d] outline-none transition-all resize-none"
               value={problem}
               onChange={(e) => setProblem(e.target.value)}
             />
          </section>

          {/* Peças e Serviços Section */}
          <section className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-10 space-y-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-red-500" size={18} />
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Peças e Serviços</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAddItem('service')} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">+ SERVIÇO</button>
                  <button onClick={() => handleAddItem('part')} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">+ PEÇA</button>
                </div>
             </div>

             <div className="space-y-4">
               {items.map((item, idx) => (
                 <div key={idx} className="flex gap-4 items-end animate-in slide-in-from-top-2 duration-300">
                   <div className="flex-1 space-y-2">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Descrição do Item</label>
                     <input 
                       className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-3 px-4 text-white font-bold focus:border-[#cc1d1d] outline-none"
                       value={item.description}
                       onChange={(e) => updateItem(idx, { description: e.target.value })}
                     />
                   </div>
                   <div className="w-32 space-y-2">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Valor</label>
                     <input 
                       type="number"
                       className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-3 px-4 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none"
                       value={item.price}
                       onChange={(e) => updateItem(idx, { price: parseFloat(e.target.value) || 0 })}
                     />
                   </div>
                   <button onClick={() => removeItem(idx)} className="bg-red-950/20 text-red-500 p-3 rounded-xl hover:bg-red-900/30 transition-all mb-0.5">
                     <Trash2 size={18} />
                   </button>
                 </div>
               ))}
               {items.length === 0 && (
                 <p className="text-center py-10 text-zinc-700 font-bold italic uppercase text-[10px] tracking-widest">Nenhum item adicionado.</p>
               )}
             </div>
          </section>
        </div>

        {/* Right Column - Summary & Payment */}
        <div className="space-y-8">
           
           {/* Pagamento Card */}
           <section className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center gap-3">
                <Package className="text-zinc-500" size={18} />
                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Pagamento</h3>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => setPaymentStatus('paid')}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest border transition-all ${paymentStatus === 'paid' ? 'bg-green-600/10 border-green-500 text-green-500' : 'bg-transparent border-zinc-800 text-zinc-700 hover:text-zinc-500'}`}
                >
                  JÁ PAGO
                </button>
                <button 
                  onClick={() => setPaymentStatus('pending')}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest border flex items-center justify-between px-6 transition-all ${paymentStatus === 'pending' ? 'bg-[#cc1d1d]/10 border-[#cc1d1d] text-[#cc1d1d]' : 'bg-transparent border-zinc-800 text-zinc-700 hover:text-zinc-500'}`}
                >
                  PENDENTE
                  <Clock size={16} />
                </button>
              </div>
           </section>

           {/* Financial Summary Card */}
           <section className="bg-[#cc1d1d] border border-red-700/50 rounded-[2.5rem] p-10 shadow-2xl shadow-red-900/40 space-y-10">
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-white/60">
                    <span className="text-[10px] font-black uppercase tracking-widest">Serviços/Peças</span>
                    <span className="font-bold font-mono">R$ {items.reduce((sum, i) => sum + i.price, 0).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-white/80">
                    <span className="text-[10px] font-black uppercase tracking-widest">Mão de Obra</span>
                    <input 
                      type="number"
                      className="bg-white/10 border-none rounded-lg py-1 px-3 text-right w-24 font-mono font-bold text-white focus:ring-0"
                      value={laborValue}
                      onChange={(e) => setLaborValue(parseFloat(e.target.value) || 0)}
                    />
                 </div>
                 <div className="flex justify-between items-center text-white/80">
                    <span className="text-[10px] font-black uppercase tracking-widest">Desconto</span>
                    <input 
                      type="number"
                      className="bg-white/10 border-none rounded-lg py-1 px-3 text-right w-24 font-mono font-bold text-white focus:ring-0"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    />
                 </div>
              </div>

              <div className="pt-8 border-t border-white/20">
                 <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">TOTAL</p>
                 <p className="text-5xl font-black text-white tracking-tighter">R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-white text-red-600 py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-zinc-100 transition-all transform active:scale-95"
              >
                <FileText size={20} /> GERAR NOTA
              </button>
           </section>
        </div>
      </div>
    </div>
  );
};

export default NewServiceOrder;
