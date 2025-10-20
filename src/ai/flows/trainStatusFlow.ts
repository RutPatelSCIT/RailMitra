'use server';

import { z } from 'zod';
import { ai } from '../genkit';

const TrainStatusSchema = z.object({
  trainName: z.string().describe("The name of the train."),
  trainNumber: z.string().describe("The train number."),
  currentStation: z.string().describe("The last reported station the train has arrived at or departed from."),
  lastUpdated: z.string().describe("The time the status was last updated, e.g., '5 minutes ago'."),
  status: z.string().describe("The current operational status, e.g., 'Running On Time', 'Delayed'."),
  delay: z.string().describe("The delay duration, e.g., '15 minutes' or 'On Time'."),
  nextStation: z.string().describe("The next scheduled stop."),
  etaNextStation: z.string().describe("The estimated time of arrival at the next station."),
});

const TrainStatusFlowInputSchema = z.object({ 
    train: z.string().describe("The train number or name to check the live status for."), 
});

const trainStatusPrompt = ai.definePrompt({
    name: 'trainStatusPrompt',
    input: { schema: TrainStatusFlowInputSchema },
    output: { schema: TrainStatusSchema },
    prompt: `
        You are an expert travel agent named "RailMitra". Your task is to provide the live running status of a train.
        The user wants to check the status for train: "{{train}}".

        - Generate a realistic, example live train status based on the provided train number or name.
        - Include details like current station, delay information, next station, and ETA.
        - The status should be plausible for a train running in India.

        Present the output in the requested JSON format.
    `,
});

export const trainStatusFlow = ai.defineFlow(
  {
    name: 'trainStatusFlow',
    inputSchema: TrainStatusFlowInputSchema,
    outputSchema: TrainStatusSchema,
  },
  async (input) => {
    const response = await trainStatusPrompt(input);
    return response.output!;
  }
);
