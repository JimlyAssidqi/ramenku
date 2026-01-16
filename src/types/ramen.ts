export interface RamenItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  spiceLevels: string[];
  toppings: Topping[];
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  ramen: RamenItem;
  quantity: number;
  spiceLevel: string;
  selectedToppings: Topping[];
  specialNotes: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalPrice: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'delivered';
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface RegisteredUser extends User {
  password: string;
}
