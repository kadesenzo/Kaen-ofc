
export interface Customer {
  id: string;
  name: string;
  phone: string;
  document?: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  model: string;
  plate: string;
  km: string;
}

export interface ServiceItem {
  description: string;
  type: 'service' | 'part';
  price: number;
}

export interface ServiceOrder {
  id: string;
  vehicleId: string;
  customerId: string;
  date: string;
  km: string;
  problemDescription?: string;
  items: ServiceItem[];
  notes: string;
  status: 'pending' | 'finished';
  paymentStatus: 'paid' | 'pending';
  laborValue?: number;
  discount?: number;
}

export interface ChecklistItem {
  label: string;
  status: 'ok' | 'issue' | 'not_applicable';
  notes?: string;
}

export interface Checklist {
  id: string;
  vehicleId: string;
  date: string;
  km: string;
  items: ChecklistItem[];
  generalNotes: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  price?: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
}
