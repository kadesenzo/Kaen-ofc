
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';

const Financial: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const today = new Date().toISOString().split('T')[0];
  
  const dailyOrders = context.orders.filter(o => o.date === today && o.status === 'finished');
  const dailyEarnings = dailyOrders.reduce((acc, o) => {
    const itemsTotal = o.items.reduce((sum, i) => sum + i.price, 0);
    return acc + itemsTotal + (o.laborValue || 0) - (o.discount || 0);
  }, 0);

  const currentMonth = new Date().getMonth();
  const monthlyOrders = context.orders.filter(o => {
    const orderDate = new Date(o.date);
    return orderDate.getMonth() === currentMonth && o.status === 'finished';
  });
  const monthlyEarnings = monthlyOrders.reduce((acc, o) => {
    const itemsTotal = o.items.reduce((sum, i) => sum + i.price, 0);
    return acc + itemsTotal + (o.laborValue || 0) - (o.discount || 0);
  }, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Financeiro</h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Análise de lucratividade e faturamento consolidado.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#141414] border border-zinc-800/50 p-10 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 text-green-500/5 group-hover:scale-110 transition-transform">
            <TrendingUp size={160} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-green-500/10 text-green-500">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Faturamento Hoje</h3>
            </div>
            <p className="text-6xl font-black text-white tracking-tighter mb-4">R$ {dailyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black bg-green-500/10 text-green-500 px-2 py-0.5 rounded uppercase tracking-widest">Ativo</span>
               <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{dailyOrders.length} Ordens Finalizadas</p>
            </div>
          </div>
        </div>

        <div className="bg-[#141414] border border-zinc-800/50 p-10 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 text-blue-500/5 group-hover:scale-110 transition-transform">
            <Calendar size={160} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Faturamento Mensal</h3>
            </div>
            <p className="text-6xl font-black text-white tracking-tighter mb-4">R$ {monthlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded uppercase tracking-widest">Estimado</span>
               <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Baseado em {monthlyOrders.length} serviços</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-10">
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3">
          <DollarSign className="text-[#cc1d1d]" size={20} /> Histórico de Transações
        </h3>
        <div className="space-y-4">
          {context.orders.filter(o => o.status === 'finished').slice(0, 8).map((order) => {
            const total = order.items.reduce((sum, i) => sum + i.price, 0) + (order.laborValue || 0) - (order.discount || 0);
            return (
              <div key={order.id} className="flex items-center justify-between p-5 bg-[#0a0a0a] border border-zinc-800/30 rounded-2xl group hover:border-red-600/20 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-green-500 shadow-inner">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase italic tracking-tight">OS #{order.id.split('-')[1] || order.id}</p>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white font-mono">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-[8px] font-black text-green-500 uppercase tracking-widest">Compensado</p>
                </div>
              </div>
            );
          })}
          {context.orders.filter(o => o.status === 'finished').length === 0 && (
             <div className="text-center py-20 text-zinc-700 italic uppercase font-black text-[10px] tracking-widest">
               Nenhuma transação concluída no histórico.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Financial;
