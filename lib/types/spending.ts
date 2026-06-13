export type SpendingCategory =
  | 'housing'
  | 'vehicle'
  | 'wishlist'
  | 'finance'
  | 'realEstate'
  | 'donation'
  | 'reserve';

export interface SpendingItem {
  id: string;
  category: SpendingCategory;
  name: string;
  amount: number;
  memo?: string;
}

export interface SpendingPlan {
  id: string;
  name: string;
  totalAmount: number;
  items: SpendingItem[];
  createdAt: string;
  updatedAt: string;
}
