
import React, { useContext } from 'react';
import { AppContext } from '../App';
// Added FileText to imports
import { DollarSign, Car, Package, Clock, FilePlus, ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const finishedOrdersToday = context.orders.filter(o => o.date === todayStr && o.status === 'finished');
  
  const dailyEarnings = finishedOrdersToday.reduce((acc, o) => {
    const itemsTotal = o.items.reduce((sum, i) => sum + i.price, 0);
    return acc + itemsTotal + (o.laborValue || 0) - (o.discount || 0);
  }, 0);

  const stats = [
    { 
      label: 'FATURAMENTO REAL', 
      value: `R$ ${dailyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      icon: DollarSign, 
      color: 'text-green-500', 
      tag: 'HOJE' 
    },
    { 
      label: 'CARROS ATENDIDOS', 
      value: finishedOrdersToday.length.toString(), 
      icon: Car, 
      color: 'text-blue-500' 
    },
    { 
      label: 'ALERTAS DE ESTOQUE', 
      value: context.inventory.filter(i => i.quantity <= i.minQuantity).length.toString(), 
      icon: Package, 
      color: 'text-orange-500', 
      subValue: 'itens baixos' 
    },
    { 
      label: 'SERVIÇOS EM ABERTO', 
      value: context.orders.filter(o => o.status === 'pending').length.toString(), 
      icon: Clock, 
      color: 'text-red-500' 
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Resumo do Dia</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Relatório automático baseado em dados reais.</p>
        </div>
        <Link 
          to="/criar-nota"
          className="bg-[#cc1d1d] hover:bg-[#b01818] text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-xl shadow-red-900/20 transition-all active:scale-95"
        >
          <FilePlus size={18} /> NOVA NOTA
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#141414] border border-zinc-800/50 p-6 rounded-3xl group hover:border-red-600/30 transition-all cursor-default relative overflow-hidden">
               {stat.tag && (
                 <div className="absolute top-4 right-4 text-[8px] font-black bg-green-500/10 text-green-500 px-2 py-0.5 rounded uppercase tracking-widest">
                   {stat.tag}
                 </div>
               )}
              <div className="flex items-center justify-between mb-8">
                <div className={`p-3 rounded-2xl bg-zinc-900 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{stat.value}</span>
                  {stat.subValue && <span className="text-[10px] font-bold text-zinc-600">{stat.subValue}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#141414] border border-zinc-800/50 rounded-3xl p-8 h-full">
            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-8">Últimas Notas Geradas</h3>
            <div className="space-y-4">
              {context.orders.slice(0, 5).map((order) => {
                const customer = context.customers.find(c => c.id === order.customerId);
                const total = order.items.reduce((sum, i) => sum + i.price, 0) + (order.laborValue || 0) - (order.discount || 0);
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-zinc-800/30 rounded-2xl hover:border-red-600/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-red-500 transition-colors">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase italic">{customer?.name || 'Cliente Geral'}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{order.id} • {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-green-500 font-mono">R$ {total.toFixed(2)}</p>
                      <p className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md inline-block mt-1 ${order.status === 'finished' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {order.status === 'finished' ? 'FINALIZADO' : 'PENDENTE'}
                      </p>
                    </div>
                  </div>
                );
              })}
              {context.orders.length === 0 && (
                <div className="text-center py-12">
                   <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-700">
                     <Car size={32} />
                   </div>
                   <h4 className="text-sm font-black text-zinc-500 uppercase italic">Nenhuma atividade registrada</h4>
                   <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Cadastre clientes, veículos e crie sua primeira Nota de Serviço para começar.</p>
                   <Link to="/criar-nota" className="inline-block mt-6 text-[#cc1d1d] text-xs font-black border-b border-[#cc1d1d] pb-1 hover:text-white hover:border-white transition-all">Começar agora &rarr;</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#141414] border border-zinc-800/50 rounded-3xl p-8">
            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-8">Controle de Estoque (Principais)</h3>
            <div className="space-y-4">
               {context.inventory.length === 0 ? (
                 <p className="text-[10px] text-zinc-600 font-bold uppercase italic text-center py-10 tracking-widest">Nenhum produto cadastrado no estoque.</p>
               ) : (
                 context.inventory.slice(0, 4).map(item => (
                   <div key={item.id} className="flex items-center justify-between py-2 border-b border-zinc-800/30">
                     <div>
                       <p className="text-xs font-black text-zinc-300 uppercase italic">{item.name}</p>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase">{item.quantity} un em estoque</p>
                     </div>
                     <div className={`w-2 h-2 rounded-full ${item.quantity <= item.minQuantity ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                   </div>
                 ))
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
