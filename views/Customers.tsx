
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
// Added FileText and UserPlus to imports
import { Plus, Search, User, Phone, Car, Trash2, X, MessageCircle, FileText, UserPlus } from 'lucide-react';

const Customers: React.FC = () => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');

  if (!context) return null;

  const filteredCustomers = context.customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    // Simple logic: add customer then add vehicle
    const customerId = Math.random().toString(36).substr(2, 9);
    context.addCustomer({ name, phone, document });
    
    if (plate && model) {
      context.addVehicle({ customerId, plate, model, km: '0' });
    }

    // Reset
    setName(''); setPhone(''); setDocument(''); setPlate(''); setModel('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-4">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Clientes</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Base de dados centralizada de proprietários.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-[#cc1d1d] hover:bg-[#b01818] text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-2xl shadow-red-900/30 transition-all active:scale-[0.98]"
        >
          <Plus size={20} /> NOVO CLIENTE + VEÍCULO
        </button>
      </header>

      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="Pesquisar por nome, CPF ou telefone..."
          className="w-full bg-[#141414] border border-zinc-800/50 rounded-2xl py-5 pl-14 pr-6 text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-[#cc1d1d] transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-8 group hover:border-red-600/30 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-10">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:text-red-500 transition-colors border border-zinc-800/50">
                <User size={32} />
              </div>
              <div className="text-right">
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{customer.name.split(' ')[0]} <span className="text-[#cc1d1d]">{customer.name.split(' ')[1] || ''}</span></h3>
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-2">{customer.document || 'SEM DOCUMENTO'}</p>
              </div>
            </div>

            <div className="bg-[#0a0a0a] rounded-3xl p-6 mb-8 border border-zinc-800/30 group-hover:border-red-600/10 transition-colors relative">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">WhatsApp Principal</span>
                 <MessageCircle className="text-green-500" size={18} />
               </div>
               <p className="text-3xl font-black text-white tracking-tighter">{customer.phone}</p>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all">
                <FileText size={16} /> VER PERFIL COMPLETO
              </button>
              <button 
                onClick={() => context.deleteCustomer(customer.id)}
                className="w-full text-zinc-700 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors py-1"
              >
                Remover registro
              </button>
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-32 bg-[#141414]/50 border-2 border-dashed border-zinc-800/50 rounded-[3rem] text-center">
             <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-zinc-700">
               <User size={40} />
             </div>
             <h4 className="text-xl font-black text-zinc-400 uppercase italic">Nenhum cliente encontrado.</h4>
             <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest mt-2">Sua oficina ainda não possui registros com este filtro.</p>
          </div>
        )}
      </div>

      {/* NEW CUSTOMER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#141414] border border-zinc-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-10 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-[#cc1d1d] rounded-2xl text-white">
                   <UserPlus size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Novo Cliente & Veículo</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#cc1d1d] uppercase tracking-widest">Informações do Cliente</span>
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">* Campos obrigatórios</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Completo *</label>
                      <input 
                        autoFocus required
                        className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:outline-none focus:border-[#cc1d1d] transition-all"
                        value={name} onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">WhatsApp / Telefone *</label>
                      <input 
                        required placeholder="(00) 00000-0000"
                        className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:outline-none focus:border-[#cc1d1d] transition-all"
                        value={phone} onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">CPF / CNPJ</label>
                      <input 
                        className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:outline-none focus:border-[#cc1d1d] transition-all"
                        value={document} onChange={(e) => setDocument(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <span className="text-[10px] font-black text-[#cc1d1d] uppercase tracking-widest">Veículo de Entrada</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Placa *</label>
                      <input 
                        placeholder="ABC-1234"
                        className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:outline-none focus:border-[#cc1d1d] transition-all"
                        value={plate} onChange={(e) => setPlate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Modelo</label>
                      <input 
                        placeholder="Ex: Corolla"
                        className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:outline-none focus:border-[#cc1d1d] transition-all"
                        value={model} onChange={(e) => setModel(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#cc1d1d] hover:bg-[#b01818] text-white font-black py-5 rounded-2xl shadow-2xl shadow-red-900/40 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  EFETUAR CADASTRO
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
