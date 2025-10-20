'use server';

import { z } from 'zod';
import { ai } from '../genkit';

const TrainInfoSchema = z.object({
    name: z.string().describe("The name of the train."),
    number: z.string().describe("The train number."),
    departureStation: z.string().describe("The departure station name and code."),
    departureTime: z.string().describe("The departure time."),
    arrivalStation: z.string().describe("The arrival station name and code."),
    arrivalTime: z.string().describe("The arrival time."),
    duration: z.string().describe("The total travel duration."),
    price: z.string().describe("The estimated price for a ticket, in INR."),
    bookingUrl: z.string().url().describe("A Google search URL to find booking options for the train on IRCTC. The URL should be constructed to search for 'IRCTC' and the train number."),
});

const FlightInfoSchema = z.object({
    airline: z.string().describe("The name of the airline."),
    flightNumber: z.string().describe("The flight number."),
    departureAirport: z.string().describe("The departure airport name and IATA code."),
    departureTime: z.string().describe("The departure time."),
    arrivalAirport: z.string().describe("The arrival airport name and IATA code."),
    arrivalTime: z.string().describe("The arrival time."),
    duration: z.string().describe("The total flight duration."),
    price: z.string().describe("The estimated price for a ticket, in INR."),
    bookingUrl: z.string().url().describe("A Google search URL to find booking options for the flight. The URL should be constructed to search for the airline and flight number."),
});

const TransportationPlanSchema = z.object({
  trains: z.array(TrainInfoSchema).describe("A list of available trains for the requested route.").optional(),
  flights: z.array(FlightInfoSchema).describe("A list of available flights for the requested route.").optional(),
});

const TransportationFlowInputSchema = z.object({ 
    query: z.string(), 
    queryType: z.enum(["train_info", "flight_info"]),
    date: z.string().optional(),
});

const transportationPrompt = ai.definePrompt({
    name: 'transportationPrompt',
    input: { schema: TransportationFlowInputSchema },
    output: { schema: TransportationPlanSchema },
    prompt: `
        You are an expert travel agent named "RailMitra". Your task is to provide information about trains or flights based on the user's request.
        
        The user's request is: "{{query}}"{{#if date}} for the date {{date}}{{/if}}.
        The user is asking for: "{{queryType}}".

        - If the user asks for "train_info", provide a list of relevant trains. Do not include flights, hotels, or trip plans. Prices should be in INR. For each train, generate a Google search URL to find booking options on IRCTC. For example, for train number "12952", the URL could be "https://www.google.com/search?q=IRCTC+train+12952".
        - If the user asks for "flight_info", provide a list of relevant flights. Do not include trains, hotels, or trip plans. Prices should be in INR. For each flight, generate a Google search URL to find booking options. For example, for "IndiGo 6E 204", the URL could be "https://www.google.com/search?q=book+flight+IndiGo+6E+204".
        
        Provide several options if available.
        Present the output in the requested JSON format.
    `,
});

export const transportationFlow = ai.defineFlow(
  {
    name: 'transportationFlow',
    inputSchema: TransportationFlowInputSchema,
    outputSchema: TransportationPlanSchema,
  },
  async (input) => {
    const response = await transportationPrompt(input);
    return response.output!;
  }
);
