'use server';

import { z } from 'zod';
import { ai } from '../genkit';

const DailyPlanSchema = z.object({
  day: z.number().describe("The day number of the itinerary, e.g., 1, 2, 3."),
  location: z.string().describe("The primary city or area for the day's activities."),
  activities: z.string().describe("A detailed description of the day's activities, including scenic places, things to do, and suggested times."),
  hotel: z.string().describe("A suggestion for a hotel or type of accommodation for the night."),
});

const TravelPlanSchema = z.object({
  tripTitle: z.string().describe("A creative and descriptive title for the travel plan."),
  itinerary: z.array(DailyPlanSchema).describe("The day-by-day itinerary for the trip."),
  estimatedBudget: z.string().describe("The total estimated budget for the entire trip, including a currency symbol."),
});

const travelPlannerPrompt = ai.definePrompt({
    name: 'travelPlannerPrompt',
    input: { schema: z.object({ query: z.string() }) },
    output: { schema: TravelPlanSchema },
    prompt: `
        You are an expert travel agent named "RailMitra". Your task is to create a detailed travel itinerary based on the user's request.
        The user's request is: "{{query}}".
        
        Generate a comprehensive travel plan that includes:
        1. A day-by-day plan with locations, activities (including scenic places), and hotel suggestions.
        2. A total estimated budget for the trip.
        
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
