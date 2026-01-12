
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { ArrowLeft, Plus, Trash2, FileText, Package, Wrench, Clock, ChevronDown, Sparkles, BrainCircuit, Car } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import type { ServiceItem } from '../types';

const NewServiceOrder: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState('');
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [km, setKm] = useState('');
  const [problem, setProblem] = useState('');
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [laborValue, setLaborValue] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('pending');
  
  const [loadingAi, setLoadingAi] = useState(false);

  if (!context) return null;

  const handleAddItem = (type: 'service' | 'part', desc = '', pr = 0) => {
    setItems([...items, { description: desc.toUpperCase(), type, price: pr }]);
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

  const getAiDiagnosis = async () => {
    if (!problem) return alert("Descreva os sintomas para a análise.");
    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Analise: "${problem}". Sugira peças e serviços. Responda APENAS JSON: {"servicos": [{"desc": "nome", "preco": 0}], "pecas": [{"desc": "nome", "preco": 0}], "maodeobra": 0}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const cleanJson = response.text?.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanJson || "{}");

      if (result.servicos) result.servicos.forEach((s: any) => handleAddItem('service', s.desc, s.preco));
      if (result.pecas) result.pecas.forEach((p: any) => handleAddItem('part', p.desc, p.preco));
      if (result.maodeobra) setLaborValue(prev => prev + result.maodeobra);

    } catch (e) {
      alert("Erro na IA. Tente manualmente.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSave = () => {
    if (!customerId) return alert('Selecione um cliente!');
    context.addOrder({
      customerId,
      vehicleId: 'manual',
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
    alert('Ordem gerada.');
    navigate('/notas');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-fade-in">
      <header className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-zinc-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">
          <ArrowLeft size={14} /> Cancelar Operação
        </Link>
        <div className="text-center">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Gerar Nova Nota</h2>
          <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.3em] mt-1">Lançamento de campo elite</p>
        </div>
        <div className="w-40"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#111111] border border-zinc-800/40 rounded-[2rem] p-8 space-y-6">
             <div className="flex items-center gap-3">
               <div className="p-2.5 bg-[#cc1d1d]/10 text-[#cc1d1d] rounded-xl">
                 <Car size={18} />
               </div>
               <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Veículo / Proprietário</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-full">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Cliente</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold appearance-none focus:border-[#cc1d1d] outline-none"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                    >
                      <option value="">Selecione o proprietário...</option>
                      {context.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-800 pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Modelo</label>
                  <input className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none" value={model} onChange={(e) => setModel(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Placa</label>
                  <input className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-4 px-5 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none uppercase" value={plate} onChange={(e) => setPlate(e.target.value)} />
                </div>
                <div className="space-y-2 col-span-full">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">KM Atual</label>
                  <input className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-4 px-5 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none" value={km} onChange={(e) => setKm(e.target.value)} />
                </div>
             </div>
          </section>

          <section className="bg-[#111111] border border-zinc-800/40 rounded-[2rem] p-8 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Sintomas / Defeitos</h3>
                <button onClick={getAiDiagnosis} disabled={loadingAi} className="bg-[#cc1d1d]/10 hover:bg-[#cc1d1d] text-[#cc1d1d] hover:text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all">
                  <Sparkles size={14} className={loadingAi ? 'animate-spin' : ''} /> IA: SUGERIR
                </button>
             </div>
             <textarea className="w-full bg-[#050505] border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold min-h-[120px] focus:border-[#cc1d1d] outline-none resize-none leading-relaxed" value={problem} onChange={(e) => setProblem(e.target.value)} />
          </section>

          <section className="bg-[#111111] border border-zinc-800/40 rounded-[2rem] p-8 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Peças e Serviços</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleAddItem('service')} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">+ SERV</button>
                  <button onClick={() => handleAddItem('part')} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">+ PEÇA</button>
                </div>
             </div>

             <div className="space-y-3">
               {items.map((item, idx) => (
                 <div key={idx} className="flex gap-3 items-end group">
                   <div className="flex-1 space-y-1">
                     <input className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none uppercase text-xs" value={item.description} onChange={(e) => updateItem(idx, { description: e.target.value })} />
                   </div>
                   <div className="w-32 space-y-1">
                     <input type="number" className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-3 px-5 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none text-xs" value={item.price} onChange={(e) => updateItem(idx, { price: parseFloat(e.target.value) || 0 })} />
                   </div>
                   <button onClick={() => removeItem(idx)} className="bg-red-950/20 text-red-500 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                 </div>
               ))}
               {items.length === 0 && <p className="text-center py-10 text-zinc-800 font-black uppercase italic text-[9px] tracking-widest border-2 border-dashed border-zinc-800 rounded-2xl">Nenhum item lançado.</p>}
             </div>
          </section>
        </div>

        <div className="space-y-6 sticky top-6 h-fit">
           <section className="bg-[#111111] border border-zinc-800/40 rounded-[2rem] p-8 space-y-6 shadow-2xl">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Resumo Financeiro</h3>
              
              <div className="space-y-4 pt-2">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-1">Mão de Obra (R$)</label>
                    <input type="number" className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-4 px-5 text-white font-mono font-bold" value={laborValue} onChange={(e) => setLaborValue(parseFloat(e.target.value) || 0)} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest ml-1">Desconto (R$)</label>
                    <input type="number" className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-4 px-5 text-white font-mono font-bold" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
                 </div>
              </div>

              <div className="pt-6 border-t border-zinc-800/50">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Consolidado</p>
                 <p className="text-4xl font-black text-white tracking-tighter leading-none mb-8 font-mono">R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>

                 <button onClick={handleSave} className="w-full bg-[#cc1d1d] hover:bg-[#b01818] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all">
                   <FileText size={18} /> Finalizar Nota
                 </button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default NewServiceOrder;
