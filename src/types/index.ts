export type DailyPlan = {
  day: number;
  location: string;
  activities: string;
  hotel: string;
};

export type TravelPlan = {
  tripTitle: string;
  itinerary: DailyPlan[];
  estimatedBudget: string;
};
