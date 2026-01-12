
import React, { useState, useEffect, createContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, Wrench, FilePlus, FileText, DollarSign, Users, Car, Package, UserPlus, LogOut, User as UserIcon
} from 'lucide-react';
import type { Customer, Vehicle, ServiceOrder, InventoryItem, Staff, Checklist } from './types';
import Login from './views/Login';
import LandingPage from './views/LandingPage';
import Dashboard from './views/Dashboard';
import CustomersView from './views/Customers';
import NewServiceOrder from './views/NewServiceOrder';
import InvoicesView from './views/Invoices';
import MechanicTerminal from './views/MechanicTerminal';
import VehiclesView from './views/Vehicles';
import InventoryView from './views/Inventory';
import FinancialView from './views/Financial';
import TeamView from './views/Team';

const safeLoad = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === "undefined" || saved === "null") return defaultValue;
    const parsed = JSON.parse(saved);
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) return defaultValue;
    return parsed;
  } catch (e) {
    return defaultValue;
  }
};

interface AppContextType {
  customers: Customer[];
  vehicles: Vehicle[];
  orders: ServiceOrder[];
  inventory: InventoryItem[];
  team: Staff[];
  checklists: Checklist[];
  addCustomer: (c: Omit<Customer, 'id'>) => void;
  deleteCustomer: (id: string) => void;
  addVehicle: (v: Omit<Vehicle, 'id'>) => void;
  deleteVehicle: (id: string) => void;
  addOrder: (o: Omit<ServiceOrder, 'id'>) => void;
  updateOrder: (id: string, o: Partial<ServiceOrder>) => void;
  deleteOrder: (id: string) => void;
  addChecklist: (c: Omit<Checklist, 'id'>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventory: (id: string, qty: number) => void;
  deleteInventoryItem: (id: string) => void;
  addStaff: (s: Omit<Staff, 'id'>) => void;
  deleteStaff: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('kaenpro_auth') === 'true');
  
  const [customers, setCustomers] = useState<Customer[]>(() => safeLoad('kp_customers', []));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => safeLoad('kp_vehicles', []));
  const [orders, setOrders] = useState<ServiceOrder[]>(() => safeLoad('kp_orders', []));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => safeLoad('kp_inventory', []));
  const [team, setTeam] = useState<Staff[]>(() => safeLoad('kp_team', []));
  const [checklists, setChecklists] = useState<Checklist[]>(() => safeLoad('kp_checklists', []));

  useEffect(() => {
    localStorage.setItem('kp_customers', JSON.stringify(customers));
    localStorage.setItem('kp_vehicles', JSON.stringify(vehicles));
    localStorage.setItem('kp_orders', JSON.stringify(orders));
    localStorage.setItem('kp_inventory', JSON.stringify(inventory));
    localStorage.setItem('kp_team', JSON.stringify(team));
    localStorage.setItem('kp_checklists', JSON.stringify(checklists));
  }, [customers, vehicles, orders, inventory, team, checklists]);

  const addCustomer = (c: Omit<Customer, 'id'>) => {
    setCustomers(prev => [...prev, { ...c, id: Math.random().toString(36).substring(2, 9) }]);
  };

  const deleteCustomer = (id: string) => {
    if (!window.confirm("Confirmar exclusão de cliente?")) return;
    setCustomers(prev => prev.filter(c => c.id !== id));
    setVehicles(prev => prev.filter(v => v.customerId !== id));
    setOrders(prev => prev.filter(o => o.customerId !== id));
  };

  const addVehicle = (v: Omit<Vehicle, 'id'>) => {
    setVehicles(prev => [...prev, { ...v, id: Math.random().toString(36).substring(2, 9) }]);
  };

  const deleteVehicle = (id: string) => {
    if (!window.confirm("Confirmar exclusão de veículo?")) return;
    setVehicles(prev => prev.filter(v => v.id !== id));
    setOrders(prev => prev.filter(o => o.vehicleId !== id));
  };

  const addOrder = (o: Omit<ServiceOrder, 'id'>) => {
    setOrders(prev => [{ ...o, id: `KP-${Math.floor(100000 + Math.random() * 900000)}` }, ...prev]);
  };

  const updateOrder = (id: string, updated: Partial<ServiceOrder>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o));
  };

  const deleteOrder = (id: string) => {
    if (!window.confirm("Excluir esta ordem de serviço permanentemente?")) return;
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const addChecklist = (c: Omit<Checklist, 'id'>) => {
    setChecklists(prev => [...prev, { ...c, id: `CHK-${Date.now()}` }]);
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    setInventory(prev => [...prev, { ...item, id: Math.random().toString(36).substring(2, 9), minQuantity: item.minQuantity || 5 }]);
  };

  const updateInventory = (id: string, qty: number) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const addStaff = (s: Omit<Staff, 'id'>) => {
    setTeam(prev => [...prev, { ...s, id: Math.random().toString(36).substring(2, 9) }]);
  };

  const deleteStaff = (id: string) => {
    setTeam(prev => prev.filter(s => s.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('kaenpro_auth');
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{
      customers, vehicles, orders, inventory, team, checklists,
      addCustomer, deleteCustomer, addVehicle, deleteVehicle, addOrder, updateOrder, deleteOrder, addChecklist, addInventoryItem, updateInventory, deleteInventoryItem, addStaff, deleteStaff
    }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Layout onLogout={handleLogout}><Dashboard /></Layout> : <Navigate to="/login" />} />
          <Route path="/terminal" element={isAuthenticated ? <Layout onLogout={handleLogout}><MechanicTerminal /></Layout> : <Navigate to="/login" />} />
          <Route path="/criar-nota" element={isAuthenticated ? <Layout onLogout={handleLogout}><NewServiceOrder /></Layout> : <Navigate to="/login" />} />
          <Route path="/notas" element={isAuthenticated ? <Layout onLogout={handleLogout}><InvoicesView /></Layout> : <Navigate to="/login" />} />
          <Route path="/clientes" element={isAuthenticated ? <Layout onLogout={handleLogout}><CustomersView /></Layout> : <Navigate to="/login" />} />
          <Route path="/veiculos" element={isAuthenticated ? <Layout onLogout={handleLogout}><VehiclesView /></Layout> : <Navigate to="/login" />} />
          <Route path="/estoque" element={isAuthenticated ? <Layout onLogout={handleLogout}><InventoryView /></Layout> : <Navigate to="/login" />} />
          <Route path="/financeiro" element={isAuthenticated ? <Layout onLogout={handleLogout}><FinancialView /></Layout> : <Navigate to="/login" />} />
          <Route path="/equipe" element={isAuthenticated ? <Layout onLogout={handleLogout}><TeamView /></Layout> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

const Layout: React.FC<{ children: React.ReactNode, onLogout: () => void }> = ({ children, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'PAINEL CENTRAL', path: '/dashboard', icon: LayoutDashboard },
    { name: 'TERMINAL MECÂNICO', path: '/terminal', icon: Wrench },
    { name: 'GERAR NOTA / OS', path: '/criar-nota', icon: FilePlus },
    { name: 'HISTÓRICO NOTAS', path: '/notas', icon: FileText },
    { name: 'FINANCEIRO', path: '/financeiro', icon: DollarSign },
    { name: 'CLIENTES', path: '/clientes', icon: Users },
    { name: 'VEÍCULOS', path: '/veiculos', icon: Car },
    { name: 'ALMOXARIFADO', path: '/estoque', icon: Package },
    { name: 'EQUIPE TÉCNICA', path: '/equipe', icon: UserPlus },
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-[#cc1d1d]/30 overflow-hidden">
      {/* Sidebar Elite */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#0d0d0d] border-r border-zinc-800/40 z-50 transform transition-transform duration-300 ease-in-out no-print
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-3 border-b border-zinc-800/20">
            <div className="w-10 h-10 bg-[#cc1d1d] rounded-lg flex items-center justify-center shadow-lg shadow-[#cc1d1d]/20">
              <Wrench className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter italic uppercase leading-none">Kaen<span className="text-[#cc1d1d]">pro</span></h1>
              <p className="text-[8px] text-zinc-600 font-black tracking-widest uppercase mt-0.5">Gestão Industrial</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest
                    ${isActive 
                      ? 'bg-[#cc1d1d] text-white shadow-xl shadow-[#cc1d1d]/10' 
                      : 'text-zinc-500 hover:bg-zinc-800/30 hover:text-zinc-100'}
                  `}
                >
                  <Icon size={14} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-zinc-800/40">
             <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[10px] font-bold text-zinc-600 hover:text-red-500 transition-all uppercase tracking-widest group">
              <LogOut size={14} className="group-hover:rotate-12 transition-transform" /> ENCERRAR SESSÃO
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/90 z-40 md:hidden no-print" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-zinc-800/10 flex items-center justify-between px-6 z-40 no-print bg-[#0a0a0a]/80 backdrop-blur-xl">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors">
            <Menu size={24} />
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-[10px] font-black text-white italic uppercase tracking-tighter">Administrador</p>
               <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">RAFAEL | STATUS: ATIVO</p>
             </div>
             <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center text-zinc-500 hover:text-[#cc1d1d] transition-colors cursor-pointer">
               <UserIcon size={16} />
             </div>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
