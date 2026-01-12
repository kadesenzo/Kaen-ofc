
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Plus, Search, User, Phone, Trash2, X, MessageCircle, FileText, UserPlus } from 'lucide-react';

const Customers: React.FC = () => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
    
    const customerId = Math.random().toString(36).substr(2, 9);
    context.addCustomer({ name, phone, document });
    
    if (plate && model) {
      context.addVehicle({ customerId, plate: plate.toUpperCase(), model, km: '0' });
    }

    setName(''); setPhone(''); setDocument(''); setPlate(''); setModel('');
    setIsModalOpen(false);
  };

  const confirmDelete = (id: string) => {
    if (window.confirm("Deseja apagar este cliente? Isso removerá permanentemente todos os carros e notas ligados a ele.")) {
      context.deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Clientes</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Gestão centralizada de proprietários.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#cc1d1d] hover:bg-[#b01818] text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.98]"
        >
          <Plus size={20} /> NOVO CLIENTE
        </button>
      </header>

      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="Pesquisar por nome ou telefone..."
          className="w-full bg-[#141414] border border-zinc-800/50 rounded-2xl py-5 pl-14 pr-6 text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-[#cc1d1d] transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-[#141414] border border-zinc-800/50 rounded-[2.5rem] p-8 group hover:border-red-600/30 transition-all relative">
            <div className="flex justify-between items-start mb-10">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:text-red-500 transition-colors border border-zinc-800/50">
                <User size={32} />
              </div>
              <button 
                onClick={() => confirmDelete(customer.id)}
                className="p-2 text-zinc-700 hover:text-red-500 transition-colors"
                title="Apagar Cliente"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="mb-8">
               <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{customer.name}</h3>
               <div className="mt-3 flex items-center gap-2 text-zinc-500">
                 <MessageCircle size={16} className="text-green-500" />
                 <span className="text-lg font-black tracking-tighter">{customer.phone}</span>
               </div>
               <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-2">{customer.document || 'CPF NÃO INFORMADO'}</p>
            </div>

            <button className="w-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <FileText size={16} /> Ver Histórico
            </button>
          </div>
        ))}
        
        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-24 bg-[#141414]/50 border-2 border-dashed border-zinc-800/50 rounded-[3rem] text-center">
             <User size={40} className="mx-auto text-zinc-700 mb-4" />
             <h4 className="text-xl font-black text-zinc-500 uppercase italic">Nenhum cliente na lista</h4>
          </div>
        )}
      </div>

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
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Novo Cliente</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Completo *</label>
                  <input 
                    autoFocus required
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none"
                    value={name} onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">WhatsApp *</label>
                    <input 
                      required placeholder="(00) 00000-0000"
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">CPF / CNPJ</label>
                    <input 
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none"
                      value={document} onChange={(e) => setDocument(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/50 space-y-4">
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest italic">Veículo Inicial (Opcional)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      placeholder="Placa"
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none"
                      value={plate} onChange={(e) => setPlate(e.target.value)}
                    />
                    <input 
                      placeholder="Modelo"
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-4 px-5 text-white font-bold focus:border-[#cc1d1d] outline-none"
                      value={model} onChange={(e) => setModel(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#cc1d1d] hover:bg-[#b01818] text-white font-black py-5 rounded-2xl shadow-xl transition-all"
                >
                  SALVAR CADASTRO
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
