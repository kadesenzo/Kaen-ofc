
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
      // Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Como um consultor de gestão de oficina mecânica de elite, analise estes dados e dê uma dica rápida de negócio em 2 frases: 
        Faturamento hoje: R$ ${dailyTotal.toFixed(2)}. 
        Ordens pendentes: ${context.orders.filter(o => o.status === 'pending').length}. 
        Peças abaixo do estoque mínimo: ${context.inventory.filter(i => i.quantity <= i.minQuantity).length}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      // Correctly access the .text property from the response
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
    <div className="space-y-10 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Performance Central</h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1">Gestão inteligente Kaenpro Elite.</p>
        </div>
        <Link to="/criar-nota" className="bg-[#cc1d1d] hover:bg-[#b01818] text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-[#cc1d1d]/20 transition-all transform active:scale-95">
          <FilePlus size={18} /> GERAR NOVA NOTA
        </Link>
      </header>

      {/* AI Intelligence Box */}
      <div className="bg-[#111111] border border-[#cc1d1d]/20 rounded-[2.5rem] p-8 flex items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 text-[#cc1d1d]/5 pointer-events-none group-hover:scale-110 transition-transform">
          <BrainCircuit size={120} />
        </div>
        <div className="w-14 h-14 bg-[#cc1d1d]/10 rounded-2xl flex items-center justify-center text-[#cc1d1d] shadow-inner">
          <Sparkles size={28} className={loadingAi ? 'animate-pulse' : ''} />
        </div>
        <div className="flex-1">
          <h3 className="text-[10px] font-black text-[#cc1d1d] uppercase tracking-widest flex items-center gap-2">
            Insight de Elite • IA Analítica
          </h3>
          <p className="text-white font-bold italic text-lg mt-1 tracking-tight leading-snug max-w-2xl">
            {loadingAi ? "Analisando dados operacionais..." : aiInsight}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2rem] relative overflow-hidden group hover:border-[#cc1d1d]/30 transition-all">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} inline-block mb-6`}>
                <Icon size={24} />
              </div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#111111] border border-zinc-800/50 rounded-[3rem] p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white italic uppercase tracking-widest flex items-center gap-3">
              <TrendingUp size={18} className="text-[#cc1d1d]" /> Movimentação Recente
            </h3>
            <Link to="/notas" className="text-[9px] font-black text-zinc-600 hover:text-[#cc1d1d] transition-colors uppercase tracking-widest">Acessar Histórico</Link>
          </div>
          <div className="space-y-4">
            {context.orders.slice(0, 5).map((order) => {
              const customer = context.customers.find(c => c.id === order.customerId);
              const total = order.items.reduce((sum, i) => sum + i.price, 0) + (order.laborValue || 0) - (order.discount || 0);
              return (
                <div key={order.id} className="flex items-center justify-between p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800/20 hover:bg-zinc-800/20 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-[#cc1d1d] transition-colors"><FileText size={22} /></div>
                    <div>
                      <p className="text-sm font-black text-white uppercase italic">{customer?.name || 'Cliente Geral'}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase">{order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-green-500 font-mono">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${order.status === 'finished' ? 'bg-green-500/10 text-green-500' : 'bg-[#cc1d1d]/10 text-[#cc1d1d]'}`}>
                      {order.status === 'finished' ? 'CONCLUÍDO' : 'PENDENTE'}
                    </span>
                  </div>
                </div>
              );
            })}
            {context.orders.length === 0 && <p className="text-center py-20 text-zinc-800 font-black uppercase italic text-[10px] tracking-widest">Sem operações recentes.</p>}
          </div>
        </div>

        <div className="bg-[#111111] border border-zinc-800/50 rounded-[3rem] p-10 flex flex-col">
          <h3 className="text-sm font-black text-white italic uppercase tracking-widest mb-8">Gestão de Estoque</h3>
          <div className="flex-1 space-y-6">
            {context.inventory.filter(i => i.quantity <= i.minQuantity).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10 opacity-30">
                <Package size={40} className="mb-4" />
                <p className="text-center font-bold italic text-[9px] uppercase tracking-widest">Estoque equilibrado.</p>
              </div>
            ) : (
              context.inventory.filter(i => i.quantity <= i.minQuantity).slice(0, 8).map(item => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-zinc-800/30 group">
                  <p className="text-[11px] font-black text-zinc-400 uppercase italic group-hover:text-white transition-colors">{item.name}</p>
                  <span className="text-[10px] font-black text-[#cc1d1d] font-mono bg-[#cc1d1d]/10 px-3 py-1 rounded-lg">{item.quantity} unidades</span>
                </div>
              ))
            )}
          </div>
          <Link to="/estoque" className="mt-8 text-center text-[9px] font-black text-[#cc1d1d] hover:text-white uppercase tracking-[0.2em] py-4 border border-[#cc1d1d]/20 rounded-xl transition-all">ABRIR ALMOXARIFADO</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
