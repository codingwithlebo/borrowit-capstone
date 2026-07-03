export type Category = "tools" | "garden" | "kitchen" | "electronics" | "sport" | "other";
export type PricingModel = "free" | "paid";

export interface Owner {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  neighbourhood: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  pricing: PricingModel;
  pricePerDay: number | null;
  images: string[];
  owner: Owner;
  distanceKm: number;
  available: boolean;
  tags: string[];
}

export interface BookingDraft {
  itemId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalCost: number;
  contactName: string;
  contactEmail: string;
}

export interface BookingConfirmation extends BookingDraft {
  confirmationCode: string;
  confirmedAt: string;
}

export type AuthMode = "signin" | "signup";

export type AppRoute =
  | { page: "browse" }
  | { page: "detail"; itemId: string }
  | { page: "book"; itemId: string; step: 1 | 2 }
  | { page: "confirmed"; code: string }
  | { page: "auth" };

export interface FilterState {
  search: string;
  category: Category | "all";
  pricing: PricingModel | "all";
}
