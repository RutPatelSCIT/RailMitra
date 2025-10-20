'use server';

import { z } from 'zod';
import { ai } from '../genkit';

const HotelSchema = z.object({
  name: z.string().describe("The name of the hotel."),
  price: z.string().describe("The estimated price per night, in INR."),
  rating: z.number().describe("The hotel's rating, out of 5."),
});

const TrainSchema = z.object({
    name: z.string().describe("The name or number of the train."),
    departure: z.string().describe("The departure station and time."),
    arrival: z.string().describe("The arrival station and time."),
    price: z.string().describe("The estimated price for the train ticket, in INR."),
});

const DailyPlanSchema = z.object({
  day: z.number().describe("The day number of the itinerary, e.g., 1, 2, 3."),
  location: z.string().describe("The primary city or area for the day's activities."),
  activities: z.string().describe("A detailed description of the day's activities, including scenic places, things to do, and suggested times."),
  hotels: z.array(HotelSchema).describe("A list of suggestions for hotels for the night, including price and rating."),
  trains: z.array(TrainSchema).describe("A list of train suggestions for traveling to the next day's location, if applicable.").optional(),
});

const TravelPlanSchema = z.object({
  tripTitle: z.string().describe("A creative and descriptive title for the travel plan."),
  itinerary: z.array(DailyPlanSchema).describe("The day-by-day itinerary for the trip."),
  estimatedBudget: z.string().describe("The total estimated budget for the entire trip, in INR."),
});

const travelPlannerPrompt = ai.definePrompt({
    name: 'travelPlannerPrompt',
    input: { schema: z.object({ query: z.string() }) },
    output: { schema: TravelPlanSchema },
    prompt: `
        You are an expert travel agent named "RailMitra". Your task is to create a detailed travel itinerary based on the user's request.
        The user's request is: "{{query}}".
        
        Generate a comprehensive travel plan that includes:
        1. A day-by-day plan with locations, activities (including scenic places), a list of hotel suggestions with estimated prices and ratings, and train options for travel between locations. All prices and budgets must be in Indian Rupees (INR).
        2. A total estimated budget for the trip in INR.
        
        The plan should be well-structured, practical, and inspiring. Present the output in the requested JSON format.
    `,
});

export const travelPlannerFlow = ai.defineFlow(
  {
    name: 'travelPlannerFlow',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: TravelPlanSchema,
  },
  async ({ query }) => {
    const response = await travelPlannerPrompt({ query });
    return response.output!;
  }
);
