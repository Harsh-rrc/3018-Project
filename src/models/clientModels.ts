export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
