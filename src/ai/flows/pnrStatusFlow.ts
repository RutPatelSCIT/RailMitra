'use server';

import { z } from 'zod';
import { ai } from '../genkit';

const PassengerStatusSchema = z.object({
  passenger: z.string().describe("The passenger identifier, e.g., 'Passenger 1'."),
  bookingStatus: z.string().describe("The status at the time of booking, e.g., 'CNF/S4/72'."),
  currentStatus: z.string().describe("The current status of the ticket, e.g., 'CNF'."),
});

const PnrStatusSchema = z.object({
  pnrNumber: z.string().length(10).describe("The 10-digit PNR number."),
  trainName: z.string().describe("The name of the train."),
  trainNumber: z.string().describe("The train number."),
  departureStation: z.string().describe("The departure station code and name."),
  arrivalStation: z.string().describe("The arrival station code and name."),
  journeyDate: z.string().describe("The date of the journey in 'DD-MM-YYYY' format."),
  passengers: z.array(PassengerStatusSchema).describe("A list of passengers and their ticket status."),
});

const PnrStatusFlowInputSchema = z.object({ 
    pnr: z.string().describe("The 10-digit PNR number to check."), 
});

const pnrStatusPrompt = ai.definePrompt({
    name: 'pnrStatusPrompt',
    input: { schema: PnrStatusFlowInputSchema },
    output: { schema: PnrStatusSchema },
    prompt: `
        You are an expert travel agent named "RailMitra". Your task is to provide the status of a train PNR.
        The user wants to check the status for PNR: "{{pnr}}".

        - Generate a realistic, example PNR status based on the provided PNR number.
        - Include details like train name, number, stations, journey date, and the status for one or more example passengers.
        - The booking and current status should be typical for Indian Railways (e.g., CNF, RAC, WL).

        Present the output in the requested JSON format.
    `,
});

export const pnrStatusFlow = ai.defineFlow(
  {
    name: 'pnrStatusFlow',
    inputSchema: PnrStatusFlowInputSchema,
    outputSchema: PnrStatusSchema,
  },
  async (input) => {
    const response = await pnrStatusPrompt(input);
    const output = response.output!;
    // Ensure the output PNR matches the input PNR
    output.pnrNumber = input.pnr;
    return output;
  }
);
