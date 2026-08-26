export type Offer = {
  platform: string;
  type: "subscription" | "rent" | "buy";
  price?: number;
  currency?: "INR" | "USD";
};

export type MovieResult = {
  id: number;
  title: string;
  year: string;
  poster: string;
  genres: number[];
  offers: Offer[];
};