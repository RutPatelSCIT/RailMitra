'use server';

import { z } from 'zod';
import { ai } from '../genkit';

const HotelInfoSchema = z.object({
  name: z.string().describe("The name of the hotel."),
  price: z.string().describe("The estimated price per night, in INR."),
  rating: z.number().describe("The hotel's rating, out of 5. Can be a decimal."),
  bookingUrl: z.string().url().describe("A Google search URL to find booking options for the hotel. The URL should be constructed to search for the hotel's name and city."),
});

const HotelPlanSchema = z.object({
  hotels: z.array(HotelInfoSchema).describe("A list of available hotels in the requested city."),
  city: z.string().describe("The city where the hotels are located."),
});

const HotelFlowInputSchema = z.object({ 
    query: z.string().describe("The city or location to search for hotels in."), 
});

const hotelPrompt = ai.definePrompt({
    name: 'hotelPrompt',
    input: { schema: HotelFlowInputSchema },
    output: { schema: HotelPlanSchema },
    prompt: `
        You are an expert travel agent named "RailMitra". Your task is to provide information about hotels based on the user's request.
        The user wants to find hotels in: "{{query}}".

        - Provide a list of 3-5 relevant hotel options in that city.
        - For each hotel, provide the name, estimated price per night in Indian Rupees (INR), and a rating out of 5.
        - For each hotel, generate a Google search URL to find booking options. For example, for "The Taj Mahal Palace" in "Mumbai", the URL should be something like "https://www.google.com/search?q=book+hotel+The+Taj+Mahal+Palace+Mumbai".

        Present the output in the requested JSON format.
    `,
});

export const hotelFlow = ai.defineFlow(
  {
    name: 'hotelFlow',
    inputSchema: HotelFlowInputSchema,
    outputSchema: HotelPlanSchema,
  },
  async (input) => {
    const response = await hotelPrompt(input);
    return response.output!;
  }
);
