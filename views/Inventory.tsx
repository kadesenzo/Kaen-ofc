
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Package, Plus, Minus, Search, ShoppingBag } from 'lucide-react';

const Inventory: React.FC = () => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  if (!context) return null;

  const filteredItems = context.inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !qty) return;
    context.addInventoryItem({ name, quantity: parseInt(qty) || 0 });
    setName('');
    setQty('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Estoque</h2>
          <p className="text-zinc-500 font-medium">Controle de peças e insumos</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Plus size={20} /> ADICIONAR ITEM
        </button>
      </div>

      <div className="relative no-print">
        <Search className="absolute left-4 top-3.5 text-zinc-500" size={20} />
        <input 
          type="text"
          placeholder="Buscar produto no estoque..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-red-600 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group hover:border-zinc-700 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-red-500">
                <Package size={24} />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">QTD</p>
                <p className={`text-2xl font-black ${item.quantity < 5 ? 'text-red-500' : 'text-white'}`}>{item.quantity}</p>
              </div>
            </div>
            <h3 className="text-xl font-black text-white uppercase italic truncate mb-6">{item.name}</h3>
            
            <div className="flex gap-2">
              <button 
                onClick={() => context.updateInventory(item.id, Math.max(0, item.quantity - 1))}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Minus size={18} /> DIMINUIR
              </button>
              <button 
                onClick={() => context.updateInventory(item.id, item.quantity + 1)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={18} /> AUMENTAR
              </button>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl text-center">
            <ShoppingBag className="mx-auto text-zinc-700 mb-4" size={48} />
            <p className="text-zinc-600 font-medium italic">Nenhum produto cadastrado no estoque.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-white uppercase italic mb-6">Novo Item de Estoque</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Nome do Produto</label>
                <input 
                  autoFocus
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Filtro de Óleo"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Quantidade Inicial</label>
                <input 
                  required
                  type="number"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 mt-1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                >
                  SALVAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
