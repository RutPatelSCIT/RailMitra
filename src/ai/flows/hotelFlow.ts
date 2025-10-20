'use server';

import { z } from 'zod';
import { ai } from '../genkit';

const HotelInfoSchema = z.object({
  name: z.string().describe("The name of the hotel."),
  price: z.string().describe("The estimated price per night, including currency."),
  rating: z.number().describe("The hotel's rating, out of 5. Can be a decimal."),
  bookingUrl: z.string().url().describe("A search URL to book the hotel on Goibibo. This should be a direct search link, not a generic homepage link. The URL should be constructed to search for the specific hotel by name in the specified city."),
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
        - For each hotel, provide the name, estimated price per night, and a rating out of 5.
        - For each hotel, generate a search URL for Goibibo (https://www.goibibo.com/hotels/). The URL should be a search query for the specific hotel name in the specified city. For example, to search for "The Taj Mahal Palace" in "Mumbai", the URL should be something like "https://www.goibibo.com/hotels/find-hotels-in-Mumbai/The%20Taj%20Mahal%20Palace/".

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
