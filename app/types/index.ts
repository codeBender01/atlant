export interface TyreCard {
  Category: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  axis: string;
  categoryId: number;
  createdAt: string;
  id: number;
  image: string;
  layers: number;
  load_index: string;
  manufacturer: string;
  price: number;
  seasonless: boolean;
  size: string;
  speed_index: string;
  tread_depth: number;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  lastname: string;
  phone_number: string;
  region: string;
  company: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  items: {
    id: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    userId: number;
    tierId: number;
    Tier: TyreCard;
    subtotal: number;
  }[];
  total: number;
  itemCount: number;
}

export interface Liked {
  userId: number;
  tierId: number;
  createdAt: string;
  updatedAt: string;
  Tier: TyreCard;
}
[];
