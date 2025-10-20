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

export type TrainInfo = {
    name: string;
    number: string;
    departureStation: string;
    departureTime: string;
    arrivalStation: string;
    arrivalTime: string;
    duration: string;
    price: string;
}

export type FlightInfo = {
    airline: string;
    flightNumber: string;
    departureAirport: string;
    departureTime: string;
    arrivalAirport: string;
    arrivalTime: string;
    duration: string;
    price: string;
}

export type TransportationPlan = {
    trains?: TrainInfo[];
    flights?: FlightInfo[];
}

export type HotelInfo = {
    name: string;
    price: string;
    rating: number;
    bookingUrl: string;
};

export type HotelPlan = {
    hotels: HotelInfo[];
    city: string;
};
