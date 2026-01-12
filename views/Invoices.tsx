
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { FileText, Printer, Trash2, CheckCircle, Eye, X, MessageCircle } from 'lucide-react';
import type { ServiceOrder } from '../types';

const Invoices: React.FC = () => {
  const context = useContext(AppContext);
  const [viewingOrder, setViewingOrder] = useState<ServiceOrder | null>(null);

  if (!context) return null;

  const handleFinishOrder = (id: string) => {
    context.updateOrder(id, { status: 'finished' });
  };

  const calculateTotal = (order: ServiceOrder) => {
    const itemsTotal = order.items.reduce((sum, item) => sum + item.price, 0);
    return itemsTotal + (order.laborValue || 0) - (order.discount || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = (order: ServiceOrder) => {
    const customer = context.customers.find(c => c.id === order.customerId);
    const vehicle = context.vehicles.find(v => v.id === order.vehicleId);
    if (!customer) return;

    const total = calculateTotal(order);
    const message = `Olá ${customer.name}, segue o valor do serviço realizado no seu veículo ${vehicle?.model || ''} (${vehicle?.plate || ''}).\n\nTotal: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\nQualquer dúvida estamos à disposição.\nKaen Mecânica`;
    
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = customer.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  const confirmDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta Nota/OS permanentemente? Esta ação não pode ser desfeita.")) {
      context.deleteOrder(id);
      setViewingOrder(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="no-print">
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Notas Geradas</h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Histórico de ordens de serviço e faturamento.</p>
      </header>

      <div className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] overflow-hidden no-print shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#111111] border-b border-zinc-800/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">ID / Data</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Cliente / Veículo</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Total</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {context.orders.map((order) => {
                const customer = context.customers.find(c => c.id === order.customerId);
                const vehicle = context.vehicles.find(v => v.id === order.vehicleId);
                const total = calculateTotal(order);
                
                return (
                  <tr key={order.id} className="hover:bg-zinc-800/20 transition-all group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-white italic tracking-tighter">{order.id}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">{new Date(order.date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-zinc-200">{customer?.name || 'Cliente Geral'}</p>
                      <p className="text-[10px] text-red-500 font-black font-mono tracking-widest uppercase">{vehicle?.plate || 'S/ PLACA'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-lg font-black text-green-500 font-mono">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${order.status === 'finished' ? 'bg-green-600/10 text-green-500 border-green-500/20' : 'bg-orange-600/10 text-orange-500 border-orange-500/20'}`}>
                        {order.status === 'finished' ? 'Finalizada' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setViewingOrder(order)}
                          className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white transition-all"
                          title="Ver Nota"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleWhatsAppShare(order)}
                          className="p-2.5 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white rounded-xl transition-all"
                          title="Enviar Cobrança WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </button>
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => handleFinishOrder(order.id)}
                            className="p-2.5 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white rounded-xl transition-all"
                            title="Finalizar OS"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => confirmDelete(order.id)}
                          className="p-2.5 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                          title="Excluir Nota"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {context.orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-zinc-700 font-black uppercase italic text-xs tracking-widest">
                    Nenhuma nota registrada no sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail / Print Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-auto bg-[#0a0a0a]/95 backdrop-blur-xl flex items-start justify-center p-0 md:p-8 no-print animate-in zoom-in-95 duration-300">
          <div className="relative bg-white text-black w-full max-w-[210mm] min-h-[297mm] shadow-[0_0_100px_rgba(0,0,0,0.5)] p-10 md:p-16 mb-20 invoice-content rounded-sm">
            
            {/* Modal Controls */}
            <div className="absolute -top-14 right-0 flex gap-4 no-print">
               <button onClick={() => handleWhatsAppShare(viewingOrder)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <MessageCircle size={18} /> WHATSAPP
              </button>
              <button onClick={handlePrint} className="bg-[#cc1d1d] hover:bg-[#b01818] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Printer size={18} /> IMPRIMIR A4
              </button>
              <button onClick={() => confirmDelete(viewingOrder.id)} className="bg-zinc-200 hover:bg-red-100 text-red-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Trash2 size={18} /> EXCLUIR
              </button>
              <button onClick={() => setViewingOrder(null)} className="bg-zinc-800 text-white p-3 rounded-2xl">
                <X size={24} />
              </button>
            </div>

            {/* PRINTABLE AREA */}
            <div className="space-y-12">
              <header className="flex justify-between items-start border-b-[6px] border-black pb-10">
                <div>
                  <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">KAEN MECÂNICA</h1>
                  <p className="text-xl font-bold uppercase tracking-widest mt-2">Oficina Especializada</p>
                  <div className="mt-6 text-sm font-bold text-gray-700">
                    <p>Rua Joaquim Marques Alves, 765</p>
                    <p>Mogi Guaçu - SP</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-black uppercase tracking-widest bg-black text-white px-4 py-1 inline-block">ORDEM DE SERVIÇO</h2>
                  <p className="text-4xl font-mono font-black mt-4">#{viewingOrder.id.split('-')[1] || viewingOrder.id}</p>
                  <p className="mt-4 font-black uppercase text-xs tracking-widest">Data: {new Date(viewingOrder.date).toLocaleDateString()}</p>
                </div>
              </header>

              <div className="grid grid-cols-2 gap-10">
                <div className="bg-gray-100 p-8 rounded-3xl">
                  <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">PROPRIETÁRIO</h3>
                  <p className="text-2xl font-black uppercase">{(context.customers.find(c => c.id === viewingOrder.customerId))?.name}</p>
                  <p className="text-lg font-bold mt-2 text-gray-600">Tel: {(context.customers.find(c => c.id === viewingOrder.customerId))?.phone}</p>
                </div>
                <div className="bg-gray-100 p-8 rounded-3xl border-l-[12px] border-black">
                  <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">VEÍCULO</h3>
                  {(() => {
                    const v = context.vehicles.find(v => v.id === viewingOrder.vehicleId);
                    return (
                      <>
                        <p className="text-2xl font-black uppercase italic">{v?.model || 'Manual Entry'}</p>
                        <div className="flex justify-between mt-4 font-black text-xs tracking-widest">
                          <span>PLACA: <span className="font-mono text-lg">{v?.plate.toUpperCase() || viewingOrder.id.split('-')[1]}</span></span>
                          <span>KM: {viewingOrder.km}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {viewingOrder.problemDescription && (
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl">
                  <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-[0.2em]">RELATO DO SERVIÇO</h3>
                  <p className="text-gray-800 font-medium leading-relaxed italic">"{viewingOrder.problemDescription}"</p>
                </div>
              )}

              <div className="min-h-[400px]">
                <table className="w-full text-left">
                  <thead className="border-b-4 border-black">
                    <tr>
                      <th className="py-4 text-[10px] font-black uppercase tracking-[0.2em]">ITEM / DESCRIÇÃO</th>
                      <th className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-right">VALOR UNITÁRIO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {viewingOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-5">
                          <p className="font-black text-xl uppercase italic tracking-tighter">{item.description}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.type === 'service' ? 'Mão de Obra' : 'Peça'}</p>
                        </td>
                        <td className="py-5 text-right font-mono text-2xl font-black">
                          R$ {item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-10 border-t-8 border-black">
                <div className="w-80 space-y-4">
                  <div className="flex justify-between font-black text-gray-400 text-xs tracking-[0.2em]">
                    <span>SUBTOTAL</span>
                    <span>R$ {viewingOrder.items.reduce((sum, i) => sum + i.price, 0).toFixed(2)}</span>
                  </div>
                  {viewingOrder.laborValue ? (
                    <div className="flex justify-between font-black text-gray-600 text-xs tracking-[0.2em]">
                      <span>MÃO DE OBRA ADICIONAL</span>
                      <span>R$ {viewingOrder.laborValue.toFixed(2)}</span>
                    </div>
                  ) : null}
                  {viewingOrder.discount ? (
                    <div className="flex justify-between font-black text-red-600 text-xs tracking-[0.2em]">
                      <span>DESCONTO</span>
                      <span>- R$ {viewingOrder.discount.toFixed(2)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-5xl font-black pt-6 border-t border-gray-100">
                    <span className="tracking-tighter italic">TOTAL</span>
                    <span className="font-mono">R$ {calculateTotal(viewingOrder).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <footer className="mt-24 grid grid-cols-2 gap-20 pt-10">
                <div className="border-t-2 border-black text-center pt-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">RESPONSÁVEL TÉCNICO</p>
                </div>
                <div className="border-t-2 border-black text-center pt-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">ASSINATURA CLIENTE</p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body { visibility: hidden; }
          .invoice-content { 
            visibility: visible; 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Invoices;
