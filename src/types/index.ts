export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
  role: UserRole;
}

export interface Product {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  price: number;
  imageData: string | null; 
  created_at: string;
  updated_at: string;
}

export type NewProduct = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type NewUser = Omit<User, 'id' | 'created_at'>;
export interface UserPayload {
  id: number;
  email: string;
  role: UserRole;
}