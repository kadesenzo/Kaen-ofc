
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { DollarSign, Car, Package, Clock, FilePlus, FileText, TrendingUp, Sparkles, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  if (!context) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const finishedToday = context.orders.filter(o => o.date === todayStr && o.status === 'finished');
  
  const dailyTotal = finishedToday.reduce((acc, o) => {
    const itemsTotal = o.items.reduce((sum, i) => sum + i.price, 0);
    return acc + itemsTotal + (o.laborValue || 0) - (o.discount || 0);
  }, 0);

  const stats = [
    { label: 'FATURAMENTO HOJE', value: `R$ ${dailyTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'SERVIÇOS CONCLUÍDOS', value: finishedToday.length.toString(), icon: Car, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'ESTOQUE BAIXO', value: context.inventory.filter(i => i.quantity <= i.minQuantity).length.toString(), icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'ORDENS PENDENTES', value: context.orders.filter(o => o.status === 'pending').length.toString(), icon: Clock, color: 'text-[#cc1d1d]', bg: 'bg-[#cc1d1d]/10' },
  ];

  const getAiInsights = async () => {
    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Como um consultor de gestão de oficina mecânica de elite, analise estes dados e dê uma dica rápida de negócio em 2 frases: 
        Faturamento hoje: R$ ${dailyTotal.toFixed(2)}. 
        Ordens pendentes: ${context.orders.filter(o => o.status === 'pending').length}. 
        Peças abaixo do estoque mínimo: ${context.inventory.filter(i => i.quantity <= i.minQuantity).length}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiInsight(response.text || "Continue o excelente trabalho.");
    } catch (e) {
      setAiInsight("Mantenha o foco na produtividade e no controle de estoque.");
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    getAiInsights();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Performance Central</h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1">Visão operacional consolidada.</p>
        </div>
        <Link to="/criar-nota" className="bg-[#cc1d1d] hover:bg-[#b01818] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl transition-all transform active:scale-95">
          <FilePlus size={16} /> GERAR NOVA NOTA
        </Link>
      </header>

      {/* AI Box */}
      <div className="bg-[#111111] border border-[#cc1d1d]/20 rounded-[2rem] p-6 flex items-center gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 text-[#cc1d1d]/5 pointer-events-none transition-transform group-hover:scale-110">
          <BrainCircuit size={100} />
        </div>
        <div className="w-12 h-12 bg-[#cc1d1d]/10 rounded-xl flex items-center justify-center text-[#cc1d1d]">
          <Sparkles size={24} className={loadingAi ? 'animate-pulse' : ''} />
        </div>
        <div className="flex-1">
          <h3 className="text-[9px] font-black text-[#cc1d1d] uppercase tracking-widest">Dica da Inteligência Artificial</h3>
          <p className="text-zinc-200 font-bold italic text-base mt-1 tracking-tight">
            {loadingAi ? "Analisando performance..." : aiInsight}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#111111] border border-zinc-800/40 p-8 rounded-[2rem] relative overflow-hidden group hover:border-[#cc1d1d]/30 transition-all">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} inline-block mb-6`}>
                <Icon size={20} />
              </div>
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white mt-1 font-mono tracking-tighter">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#111111] border border-zinc-800/40 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black text-white italic uppercase tracking-widest flex items-center gap-3">
              <TrendingUp size={16} className="text-[#cc1d1d]" /> Movimentação Recente
            </h3>
            <Link to="/notas" className="text-[9px] font-black text-zinc-600 hover:text-[#cc1d1d] transition-colors uppercase tracking-widest">Histórico Completo</Link>
          </div>
          <div className="space-y-4">
            {context.orders.slice(0, 5).map((order) => {
              const customer = context.customers.find(c => c.id === order.customerId);
              const total = order.items.reduce((sum, i) => sum + i.price, 0) + (order.laborValue || 0) - (order.discount || 0);
              return (
                <div key={order.id} className="flex items-center justify-between p-5 bg-[#0d0d0d] rounded-2xl border border-zinc-800/20 hover:border-zinc-800/60 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-red-500 transition-colors"><FileText size={18} /></div>
                    <div>
                      <p className="text-xs font-black text-white uppercase italic">{customer?.name || 'Cliente Geral'}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase">{order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-green-500 font-mono">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${order.status === 'finished' ? 'bg-green-500/10 text-green-500' : 'bg-[#cc1d1d]/10 text-[#cc1d1d]'}`}>
                      {order.status === 'finished' ? 'CONCLUÍDO' : 'PENDENTE'}
                    </span>
                  </div>
                </div>
              );
            })}
            {context.orders.length === 0 && <p className="text-center py-16 text-zinc-800 font-black uppercase italic text-[10px] tracking-widest">Sem atividades.</p>}
          </div>
        </div>

        <div className="bg-[#111111] border border-zinc-800/40 rounded-[2.5rem] p-8 flex flex-col">
          <h3 className="text-xs font-black text-white italic uppercase tracking-widest mb-8">Alertas de Estoque</h3>
          <div className="flex-1 space-y-6">
            {context.inventory.filter(i => i.quantity <= i.minQuantity).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-20">
                <Package size={40} className="mb-4" />
                <p className="text-center font-bold italic text-[9px] uppercase tracking-widest">Estoque equilibrado.</p>
              </div>
            ) : (
              context.inventory.filter(i => i.quantity <= i.minQuantity).slice(0, 6).map(item => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-zinc-800/20 group">
                  <p className="text-[10px] font-black text-zinc-500 uppercase italic group-hover:text-white transition-colors">{item.name}</p>
                  <span className="text-[9px] font-black text-[#cc1d1d] font-mono bg-[#cc1d1d]/10 px-2 py-0.5 rounded">{item.quantity} un</span>
                </div>
              ))
            )}
          </div>
          <Link to="/estoque" className="mt-8 text-center text-[9px] font-black text-[#cc1d1d] hover:bg-[#cc1d1d] hover:text-white uppercase tracking-widest py-4 border border-[#cc1d1d]/20 rounded-xl transition-all">Ver Almoxarifado</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
