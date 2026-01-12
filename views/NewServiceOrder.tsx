
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { ArrowLeft, Plus, Trash2, FileText, Package, Wrench, Clock, ChevronDown, Sparkles, BrainCircuit, Car } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import type { ServiceItem } from '../types';

const NewServiceOrder: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  // Form State
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
    if (!problem) return alert("Descreva os sintomas do veículo para a IA analisar.");
    setLoadingAi(true);
    try {
      // Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Analise os seguintes sintomas de um veículo e sugira peças e serviços técnicos necessários: "${problem}". 
        Responda em JSON apenas com este formato: {"servicos": [{"desc": "nome", "preco": 0}], "pecas": [{"desc": "nome", "preco": 0}], "maodeobra": 0}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // Extract generated text directly from response.text property
      const cleanJson = response.text?.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanJson || "{}");

      if (result.servicos) result.servicos.forEach((s: any) => handleAddItem('service', s.desc, s.preco));
      if (result.pecas) result.pecas.forEach((p: any) => handleAddItem('part', p.desc, p.preco));
      if (result.maodeobra) setLaborValue(prev => prev + result.maodeobra);

    } catch (e) {
      alert("Erro ao conectar com a IA Inteligente. Tente novamente.");
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

    alert('Ordem de Serviço gerada com sucesso!');
    navigate('/notas');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-fade-in">
      <header className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-zinc-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={16} /> CANCELAR OPERAÇÃO
        </Link>
        <div className="text-center">
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Gerar Ordem <span className="text-[#cc1d1d]">Elite</span></h2>
          <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.3em] mt-1">Sincronização em tempo real</p>
        </div>
        <div className="w-40"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Identificação Section */}
          <section className="bg-[#111111] border border-zinc-800/50 rounded-[3rem] p-10 space-y-8 shadow-2xl">
             <div className="flex items-center gap-3">
               <div className="p-2.5 bg-[#cc1d1d]/10 text-[#cc1d1d] rounded-xl shadow-inner">
                 <Car size={20} />
               </div>
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Dados do Veículo</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Proprietário</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-[#050505] border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold appearance-none focus:outline-none focus:border-[#cc1d1d] transition-all"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                    >
                      <option value="">Buscar proprietário no banco de dados...</option>
                      {context.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none" size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Modelo / Marca</label>
                  <input className="w-full bg-[#050505] border border-zinc-800 rounded-2xl py-5 px-6 text-white font-bold focus:border-[#cc1d1d] outline-none transition-all" placeholder="Ex: BMW M3 E46" value={model} onChange={(e) => setModel(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Placa Oficial</label>
                  <input className="w-full bg-[#050505] border border-zinc-800 rounded-2xl py-5 px-6 text-white font-mono font-bold tracking-widest focus:border-[#cc1d1d] outline-none transition-all uppercase" placeholder="ABC-1234" value={plate} onChange={(e) => setPlate(e.target.value)} />
                </div>
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Quilometragem Atual</label>
                  <input className="w-full bg-[#050505] border border-zinc-800 rounded-2xl py-5 px-6 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none transition-all" placeholder="000.000 KM" value={km} onChange={(e) => setKm(e.target.value)} />
                </div>
             </div>
          </section>

          {/* Problema + AI Diagnostics */}
          <section className="bg-[#111111] border border-zinc-800/50 rounded-[3rem] p-10 space-y-6 shadow-2xl">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Relato Técnico</h3>
                <button 
                  onClick={getAiDiagnosis}
                  disabled={loadingAi}
                  className="bg-[#cc1d1d]/10 hover:bg-[#cc1d1d] text-[#cc1d1d] hover:text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all border border-[#cc1d1d]/20"
                >
                  <Sparkles size={16} className={loadingAi ? 'animate-spin' : ''} /> 
                  {loadingAi ? "ANALISANDO..." : "DIAGNÓSTICO IA"}
                </button>
             </div>
             <textarea 
               placeholder="Descreva detalhadamente o problema ou serviço solicitado..."
               className="w-full bg-[#050505] border border-zinc-800 rounded-3xl py-6 px-8 text-white font-bold min-h-[160px] focus:border-[#cc1d1d] outline-none transition-all resize-none leading-relaxed"
               value={problem}
               onChange={(e) => setProblem(e.target.value)}
             />
          </section>

          {/* Peças e Serviços Section */}
          <section className="bg-[#111111] border border-zinc-800/50 rounded-[3rem] p-10 space-y-8 shadow-2xl">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#cc1d1d]/10 text-[#cc1d1d] rounded-lg">
                    <Wrench size={18} />
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Checklist de Itens</h3>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleAddItem('service')} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">+ SERVIÇO</button>
                  <button onClick={() => handleAddItem('part')} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">+ PEÇA</button>
                </div>
             </div>

             <div className="space-y-4">
               {items.map((item, idx) => (
                 <div key={idx} className="flex gap-4 items-end animate-in slide-in-from-top-4 duration-300 group">
                   <div className="flex-1 space-y-2">
                     <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Descrição</label>
                     <input 
                       className="w-full bg-[#050505] border border-zinc-800 rounded-2xl py-4 px-6 text-white font-bold focus:border-[#cc1d1d] outline-none transition-all uppercase"
                       value={item.description}
                       onChange={(e) => updateItem(idx, { description: e.target.value })}
                     />
                   </div>
                   <div className="w-40 space-y-2">
                     <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Preço (R$)</label>
                     <input 
                       type="number"
                       className="w-full bg-[#050505] border border-zinc-800 rounded-2xl py-4 px-6 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none transition-all"
                       value={item.price}
                       onChange={(e) => updateItem(idx, { price: parseFloat(e.target.value) || 0 })}
                     />
                   </div>
                   <button onClick={() => removeItem(idx)} className="bg-red-950/20 text-red-500 p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg group-hover:scale-105">
                     <Trash2 size={20} />
                   </button>
                 </div>
               ))}
               {items.length === 0 && (
                 <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl opacity-20">
                    <FileText size={48} className="mb-4" />
                    <p className="font-black italic uppercase text-[10px] tracking-[0.3em]">Nenhum item lançado ainda.</p>
                 </div>
               )}
             </div>
          </section>
        </div>

        {/* Financial Flow Card */}
        <div className="space-y-8 sticky top-10 h-fit">
           <section className="bg-[#111111] border border-zinc-800/50 rounded-[3rem] p-10 space-y-8 shadow-2xl">
              <div className="flex items-center gap-3">
                <BrainCircuit className="text-zinc-500" size={20} />
                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Condição Financeira</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setPaymentStatus('paid')}
                  className={`py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest border transition-all ${paymentStatus === 'paid' ? 'bg-green-600 text-white border-green-600 shadow-xl shadow-green-900/20' : 'bg-[#050505] border-zinc-800 text-zinc-600 hover:text-white'}`}
                >
                  JÁ PAGO
                </button>
                <button 
                  onClick={() => setPaymentStatus('pending')}
                  className={`py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest border transition-all ${paymentStatus === 'pending' ? 'bg-[#cc1d1d] text-white border-[#cc1d1d] shadow-xl shadow-[#cc1d1d]/20' : 'bg-[#050505] border-zinc-800 text-zinc-600 hover:text-white'}`}
                >
                  PENDENTE
                </button>
              </div>
              
              <div className="space-y-6 pt-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Mão de Obra Geral (R$)</label>
                    <input 
                      type="number"
                      className="w-full bg-[#050505] border border-zinc-800 rounded-2xl py-4 px-6 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none"
                      value={laborValue}
                      onChange={(e) => setLaborValue(parseFloat(e.target.value) || 0)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Desconto Aplicado (R$)</label>
                    <input 
                      type="number"
                      className="w-full bg-[#050505] border border-zinc-800 rounded-2xl py-4 px-6 text-white font-mono font-bold focus:border-[#cc1d1d] outline-none"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    />
                 </div>
              </div>

              <div className="pt-8 border-t border-zinc-800/50">
                 <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Consolidado</p>
                 <p className="text-5xl font-black text-white tracking-tighter leading-none mb-10">R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>

                 <button 
                  onClick={handleSave}
                  className="w-full bg-[#cc1d1d] hover:bg-[#b01818] text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl shadow-[#cc1d1d]/30 transition-all transform active:scale-95"
                 >
                   <FileText size={22} /> FINALIZAR NOTA
                 </button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default NewServiceOrder;
