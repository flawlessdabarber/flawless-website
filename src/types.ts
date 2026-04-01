export type UserRole = 'admin' | 'barber' | 'client';
export type MembershipType = 'none' | 'kids' | 'adults' | 'corporate' | 'investment';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type AppointmentType = 'in-store' | 'mobile';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  membershipType: MembershipType;
  createdAt: string;
}

export interface Appointment {
  id?: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string;
  status: AppointmentStatus;
  type: AppointmentType;
  location?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}
