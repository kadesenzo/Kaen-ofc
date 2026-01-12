
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Printer, Trash2, Eye, X, MessageCircle, FileText, Share2, Wrench, Package } from 'lucide-react';
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
    const msg = `Olá ${customer.name}, a OS #${order.id.split('-')[1] || order.id} do veículo ${vehicle?.model || ''} está pronta.\nTotal: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.\nAtenciosamente, Kaen Mecânica.`;
    window.open(`https://wa.me/55${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Histórico de Notas</h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Gestão de faturamento e serviços arquivados.</p>
        </div>
      </header>

      {/* Tabela de Histórico - Visual Industrial */}
      <div className="bg-[#111111] border border-zinc-800/40 rounded-[2.5rem] overflow-hidden no-print shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#161616] border-b border-zinc-800/40">
              <tr>
                <th className="px-8 py-6 text-[9px] font-black uppercase text-zinc-500 tracking-widest">Identificação OS</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase text-zinc-500 tracking-widest">Proprietário / Veículo</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase text-zinc-500 tracking-widest">Total Líquido</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase text-zinc-500 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/10">
              {context.orders.map((order) => {
                const customer = context.customers.find(c => c.id === order.customerId);
                const vehicle = context.vehicles.find(v => v.id === order.vehicleId);
                const total = calculateTotal(order);
                
                return (
                  <tr key={order.id} className="hover:bg-zinc-800/10 transition-colors group">
                    <td className="px-8 py-7">
                      <p className="text-xs font-black text-white italic tracking-tighter">#{order.id.split('-')[1] || order.id}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">{new Date(order.date).toLocaleDateString('pt-BR')}</p>
                    </td>
                    <td className="px-8 py-7">
                      <p className="text-xs font-bold text-zinc-200">{customer?.name || 'Cliente Geral'}</p>
                      <p className="text-[10px] text-[#cc1d1d] font-black font-mono tracking-widest uppercase mt-1">{vehicle?.plate || 'S/ PLACA'}</p>
                    </td>
                    <td className="px-8 py-7">
                      <p className="text-base font-black text-white font-mono tracking-tighter">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </td>
                    <td className="px-8 py-7 text-right">
                      <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all">
                        <button onClick={() => setViewingOrder(order)} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white transition-all shadow-lg" title="Visualizar Documento"><Eye size={16} /></button>
                        <button onClick={() => handleWhatsAppShare(order)} className="p-3 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-lg" title="Notificar via WhatsApp"><MessageCircle size={16} /></button>
                        <button onClick={() => context.deleteOrder(order.id)} className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-lg" title="Excluir OS"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {context.orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center text-zinc-800 font-black uppercase italic text-[11px] tracking-widest">Não há ordens de serviço registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOCUMENTO OS - OTIMIZADO PARA A4 E IMPRESSÃO PROFISSIONAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-[60] overflow-auto bg-[#050505]/95 backdrop-blur-2xl flex items-start justify-center p-0 md:p-10 no-print animate-fade-in">
          <div className="relative bg-white text-black w-full max-w-[210mm] min-h-[297mm] shadow-[0_0_100px_rgba(0,0,0,0.5)] invoice-content rounded-sm overflow-hidden mb-20 flex flex-col">
            
            {/* Controles Flutuantes */}
            <div className="absolute top-6 right-6 flex gap-3 no-print">
              <button onClick={handlePrint} className="bg-[#cc1d1d] hover:bg-[#b01818] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl transition-all transform active:scale-95">
                <Printer size={16} /> IMPRIMIR NOTA A4
              </button>
              <button onClick={() => setViewingOrder(null)} className="bg-black text-white p-4 rounded-2xl hover:bg-zinc-900 transition-colors shadow-xl">
                <X size={20} />
              </button>
            </div>

            <div className="p-12 md:p-20 flex-1 flex flex-col space-y-12">
              {/* Header da Nota Profissional */}
              <header className="flex justify-between items-start border-b-8 border-black pb-12">
                <div>
                  <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-2">KAEN MECÂNICA</h1>
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Alta Performance & Gestão Especializada</p>
                  <div className="mt-8 text-[11px] font-black text-gray-700 leading-relaxed uppercase tracking-widest space-y-1">
                    <p>Rua Joaquim Marques Alves, 765 | Mogi Guaçu - SP</p>
                    <p>CNPJ: 00.000.000/0001-00 | Fone: (19) 99876-5432</p>
                    <p>E-mail: administrativo@kaenmecanica.com.br</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-black text-white px-6 py-2.5 inline-block mb-6">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.5em]">ORDEM DE SERVIÇO</h2>
                  </div>
                  <p className="text-6xl font-black font-mono leading-none tracking-tighter">#{viewingOrder.id.split('-')[1] || viewingOrder.id}</p>
                  <p className="mt-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400 italic">Emissão: {new Date(viewingOrder.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </header>

              {/* Informações da Nota */}
              <div className="grid grid-cols-2 gap-12">
                <div className="bg-gray-100 p-10 rounded-[2rem] border-l-8 border-gray-200">
                  <h3 className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-widest">DADOS DO CLIENTE</h3>
                  {(() => {
                    const c = context.customers.find(c => c.id === viewingOrder.customerId);
                    return (
                      <div className="space-y-2">
                        <p className="text-3xl font-black uppercase italic leading-none">{c?.name || 'Consumidor Geral'}</p>
                        <p className="text-sm font-bold text-gray-600 font-mono tracking-tight pt-2">DOC: {c?.document || 'Isento/Não Informado'}</p>
                        <p className="text-sm font-bold text-gray-600">FONE: {c?.phone || '---'}</p>
                      </div>
                    );
                  })()}
                </div>
                <div className="bg-gray-100 p-10 rounded-[2rem] border-l-8 border-black">
                  <h3 className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-widest">DADOS DO VEÍCULO</h3>
                  {(() => {
                    const v = context.vehicles.find(v => v.id === viewingOrder.vehicleId);
                    return (
                      <div className="space-y-4">
                        <p className="text-3xl font-black uppercase italic leading-none">{v?.model || 'ENTRADA MANUAL'}</p>
                        <div className="flex gap-10">
                          <div>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">PLACA</span>
                            <p className="font-mono text-2xl font-black leading-none mt-1">{v?.plate.toUpperCase() || 'S/ PLACA'}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">KM ENTRADA</span>
                            <p className="font-mono text-2xl font-black leading-none mt-1">{viewingOrder.km} KM</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Tabela de Itens OS - Escala Automática para A4 */}
              <div className="flex-1 min-h-[500px]">
                <table className="w-full text-left">
                  <thead className="border-b-4 border-black">
                    <tr>
                      <th className="py-5 text-[11px] font-black uppercase tracking-widest">Descrição Técnica do Item / Serviço</th>
                      <th className="py-5 text-[11px] font-black uppercase tracking-widest">Tipo</th>
                      <th className="py-5 text-[11px] font-black uppercase tracking-widest text-right">Valor Líquido</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-gray-200 ${viewingOrder.items.length > 18 ? 'text-[10px]' : 'text-[14px]'}`}>
                    {viewingOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-4 pr-10">
                          <p className="font-black uppercase italic leading-tight tracking-tighter">{item.description}</p>
                        </td>
                        <td className="py-4">
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.type === 'service' ? 'SERVIÇO' : 'PEÇA'}</span>
                        </td>
                        <td className="py-4 text-right font-mono font-black">
                          R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumo Financeiro da Nota */}
              <div className="flex justify-end pt-12 border-t-4 border-black">
                <div className="w-96 space-y-4">
                  <div className="flex justify-between font-black text-gray-400 text-[11px] uppercase tracking-widest">
                    <span>Subtotal de Itens</span>
                    <span className="font-mono">R$ {viewingOrder.items.reduce((sum, i) => sum + i.price, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {viewingOrder.laborValue ? (
                    <div className="flex justify-between font-black text-gray-600 text-[11px] uppercase tracking-widest">
                      <span>Mão de Obra Especializada</span>
                      <span className="font-mono">R$ {viewingOrder.laborValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ) : null}
                  {viewingOrder.discount ? (
                    <div className="flex justify-between font-black text-red-600 text-[11px] uppercase tracking-widest">
                      <span>Descontos Aplicados</span>
                      <span className="font-mono">- R$ {viewingOrder.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between items-baseline pt-8 border-t-2 border-black">
                    <span className="text-4xl font-black italic uppercase tracking-tighter">VALOR TOTAL</span>
                    <span className="text-4xl font-black font-mono">R$ {calculateTotal(viewingOrder).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Rodapé de Validação */}
              <footer className="mt-20 pt-16 border-t border-gray-100 flex justify-between items-end">
                <div className="w-80 border-t-2 border-black pt-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Responsável Técnico</p>
                </div>
                <div className="text-center space-y-2 mb-1">
                   <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic">Documento emitido via Kaenpro Elite v2.5</p>
                </div>
                <div className="w-80 border-t-2 border-black pt-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Assinatura do Cliente</p>
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
            padding: 30px !important;
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
