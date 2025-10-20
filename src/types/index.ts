export type Hotel = {
    name: string;
    price: string;
    rating: number;
};

export type DailyPlan = {
  day: number;
  location: string;
  activities: string;
  hotels: Hotel[];
};

export type TravelPlan = {
  tripTitle: string;
  itinerary: DailyPlan[];
  estimatedBudget: string;
};
