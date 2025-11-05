// For data coming from the database
export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface Product {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  price: number;
  imageData: string | null; // Base64 data is a string
  created_at: string;
  updated_at: string;
}

// For creating new items (omits id, created_at, etc.)
export type NewProduct = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type NewUser = Omit<User, 'id' | 'created_at'>;

// For the data we'll store in the JWT
export interface UserPayload {
  id: number;
  email: string;
}