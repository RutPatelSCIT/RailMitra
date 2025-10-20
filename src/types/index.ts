export type Hotel = {
    name: string;
    price: string;
    rating: number;
};

export type Train = {
    name: string;
    departure: string;
    arrival: string;
    price: string;
};

export type DailyPlan = {
  day: number;
  location: string;
  activities: string;
  hotels: Hotel[];
  trains?: Train[];
};

export type TravelPlan = {
  tripTitle: string;
  itinerary: DailyPlan[];
  estimatedBudget: string;
};
