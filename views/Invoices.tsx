
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Printer, Trash2, Eye, X, MessageCircle, FileText, Share2 } from 'lucide-react';
import type { ServiceOrder } from '../types';

const Invoices: React.FC = () => {
  const context = useContext(AppContext);
  const [viewingOrder, setViewingOrder] = useState<ServiceOrder | null>(null);

  if (!context) return null;

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
    const msg = `Olá ${customer.name}, a OS #${order.id.split('-')[1]} do veículo ${vehicle?.model || ''} (${vehicle?.plate || ''}) está pronta.\nTotal: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.\nAtenciosamente, Kaen Mecânica.`;
    window.open(`https://wa.me/55${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Histórico de Ordens</h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Gestão de faturamento e serviços concluídos.</p>
        </div>
      </header>

      {/* Tabela de Histórico Industrial */}
      <div className="bg-[#111111] border border-zinc-800/40 rounded-[2rem] overflow-hidden no-print shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#161616] border-b border-zinc-800/40">
              <tr>
                <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-500 tracking-widest">Código OS / Data</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-500 tracking-widest">Proprietário / Placa</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-500 tracking-widest">Total Líquido</th>
                <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-500 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/20">
              {context.orders.map((order) => {
                const customer = context.customers.find(c => c.id === order.customerId);
                const vehicle = context.vehicles.find(v => v.id === order.vehicleId);
                const total = calculateTotal(order);
                
                return (
                  <tr key={order.id} className="hover:bg-zinc-800/10 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-xs font-black text-white italic tracking-tighter">#{order.id.split('-')[1]}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">{new Date(order.date).toLocaleDateString('pt-BR')}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-zinc-200">{customer?.name || 'Cliente Geral'}</p>
                      <p className="text-[10px] text-red-500 font-black font-mono tracking-widest uppercase mt-1">{vehicle?.plate || 'S/ PLACA'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-white font-mono">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewingOrder(order)} className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white transition-all shadow-lg" title="Ver Detalhes"><Eye size={16} /></button>
                        <button onClick={() => handleWhatsAppShare(order)} className="p-2.5 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-lg" title="Enviar Cobrança"><MessageCircle size={16} /></button>
                        <button onClick={() => context.deleteOrder(order.id)} className="p-2.5 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-lg" title="Excluir"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {context.orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center text-zinc-800 font-black uppercase italic text-[10px] tracking-widest">Nenhuma ordem de serviço registrada no banco.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE NOTA REAL - OTIMIZADO PARA A4 */}
      {viewingOrder && (
        <div className="fixed inset-0 z-[60] overflow-auto bg-[#050505]/95 backdrop-blur-xl flex items-start justify-center p-0 md:p-8 no-print animate-in zoom-in-95 duration-200">
          <div className="relative bg-white text-black w-full max-w-[210mm] min-h-[297mm] shadow-2xl p-8 md:p-14 invoice-content rounded-sm overflow-hidden mb-20">
            
            {/* Controles do Modal */}
            <div className="absolute top-4 right-4 flex gap-2 no-print">
              <button onClick={handlePrint} className="bg-[#cc1d1d] hover:bg-[#b01818] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl">
                <Printer size={16} /> Imprimir A4
              </button>
              <button onClick={() => setViewingOrder(null)} className="bg-zinc-900 text-white p-3 rounded-xl hover:bg-black transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Layout da Nota Fiscal Real */}
            <div className="space-y-10">
              <header className="flex justify-between items-start border-b-8 border-black pb-10">
                <div>
                  <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-1">KAEN MECÂNICA</h1>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-600">Alta Performance e Manutenção Especializada</p>
                  <div className="mt-6 text-[10px] font-black text-gray-800 leading-relaxed uppercase tracking-widest">
                    <p>Rua Joaquim Marques Alves, 765 | Mogi Guaçu - SP</p>
                    <p>CEP: 13840-000 | CNPJ: 00.000.000/0001-00</p>
                    <p>Telefone: (19) 99876-5432 | E-mail: contato@kaen.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-black text-white px-5 py-2 inline-block mb-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em]">ORDEM DE SERVIÇO</h2>
                  </div>
                  <p className="text-5xl font-mono font-black leading-none">#{viewingOrder.id.split('-')[1]}</p>
                  <p className="mt-4 font-black uppercase text-[10px] tracking-widest text-gray-500">Emissão: {new Date(viewingOrder.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </header>

              <div className="grid grid-cols-2 gap-10">
                <div className="bg-gray-100 p-8 rounded-2xl border border-gray-200">
                  <h3 className="text-[9px] font-black uppercase text-gray-400 mb-4 tracking-widest">IDENTIFICAÇÃO DO PROPRIETÁRIO</h3>
                  <p className="text-2xl font-black uppercase italic leading-none">{(context.customers.find(c => c.id === viewingOrder.customerId))?.name}</p>
                  <p className="text-sm font-bold text-gray-600 mt-2 font-mono">DOC: {(context.customers.find(c => c.id === viewingOrder.customerId))?.document || '---'}</p>
                  <p className="text-sm font-bold text-gray-600 mt-1">CEL: {(context.customers.find(c => c.id === viewingOrder.customerId))?.phone}</p>
                </div>
                <div className="bg-gray-100 p-8 rounded-2xl border-l-8 border-black">
                  <h3 className="text-[9px] font-black uppercase text-gray-400 mb-4 tracking-widest">DETALHES DO VEÍCULO</h3>
                  {(() => {
                    const v = context.vehicles.find(v => v.id === viewingOrder.vehicleId);
                    return (
                      <>
                        <p className="text-2xl font-black uppercase italic leading-none">{v?.model || 'MANUAL'}</p>
                        <div className="grid grid-cols-2 mt-4 font-black text-[10px] tracking-widest uppercase">
                          <div>PLACA: <span className="font-mono text-xl block mt-1">{v?.plate.toUpperCase() || 'S/ PLACA'}</span></div>
                          <div>ODÔMETRO: <span className="font-mono text-xl block mt-1">{viewingOrder.km} KM</span></div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Tabela de Itens OS - Fonte auto-ajustável */}
              <div className="min-h-[480px]">
                <table className="w-full text-left table-auto">
                  <thead className="border-b-4 border-black">
                    <tr>
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest">Descritivo Técnico do Serviço / Peças</th>
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest text-right">Preço Unit.</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-gray-200 ${viewingOrder.items.length > 15 ? 'text-[11px]' : 'text-base'}`}>
                    {viewingOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-5 pr-10">
                          <p className="font-black uppercase italic tracking-tighter leading-tight">{item.description}</p>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{item.type === 'service' ? 'Mão de Obra Especializada' : 'Peça / Componente de Reposição'}</p>
                        </td>
                        <td className="py-5 text-right font-mono font-black">
                          {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-10 border-t-4 border-black">
                <div className="w-80 space-y-3">
                  <div className="flex justify-between font-black text-gray-400 text-[10px] uppercase tracking-widest">
                    <span>Subtotal de Itens</span>
                    <span className="font-mono">R$ {viewingOrder.items.reduce((sum, i) => sum + i.price, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {viewingOrder.laborValue ? (
                    <div className="flex justify-between font-black text-gray-600 text-[10px] uppercase tracking-widest">
                      <span>Mão de Obra Adicional</span>
                      <span className="font-mono">R$ {viewingOrder.laborValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ) : null}
                  {viewingOrder.discount ? (
                    <div className="flex justify-between font-black text-red-600 text-[10px] uppercase tracking-widest">
                      <span>Desconto Concedido</span>
                      <span className="font-mono">- R$ {viewingOrder.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-5xl font-black pt-6 border-t-2 border-black items-baseline">
                    <span className="italic tracking-tighter">TOTAL</span>
                    <span className="font-mono">R$ {calculateTotal(viewingOrder).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <footer className="mt-24 grid grid-cols-2 gap-20 pt-16">
                <div className="border-t-2 border-black text-center pt-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">Responsável Técnico</p>
                </div>
                <div className="border-t-2 border-black text-center pt-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">Assinatura do Cliente</p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body { visibility: hidden !important; background: white !important; padding: 0 !important; margin: 0 !important; }
          .invoice-content { 
            visibility: visible !important; 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important;
            margin: 0 !important;
            padding: 40px !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Invoices;
