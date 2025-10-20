'use server';

import { z } from 'zod';
import { ai } from '../genkit';
import { getJson } from "serpapi";

const SerpAPIResult = z.object({
  position: z.number(),
  title: z.string(),
  link: z.string(),
  snippet: z.string().optional(),
});

const SerpAPIResponse = z.object({
  organic_results: z.array(SerpAPIResult),
});


const ExtractedResult = z.object({
  title: z.string(),
  url: z.string(),
  description: z.string(),
  type: z.string().optional().describe('Type of result, e.g. "Organic Result", "Ad", "Knowledge Panel"'),
});

const extractionPrompt = ai.definePrompt({
    name: 'extractionPrompt',
    input: { schema: z.object({ query: z.string(), serpResults: z.string() }) },
    output: { schema: z.array(ExtractedResult) },
    prompt: `
        You are an expert data extractor. Your task is to extract structured data from Search Engine Result Page (SERP) content.
        The user performed the query: "{{query}}".
        
        Analyze the following SERP results and extract the title, URL, and description for each result. The description should come from the snippet.
        
        SERP Results (JSON):
        {{{serpResults}}}
    `,
});


export const extractDataFlow = ai.defineFlow(
  {
    name: 'extractDataFlow',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.array(ExtractedResult),
  },
  async ({ query }) => {
    if (!process.env.SERPAPI_API_KEY) {
      throw new Error("SERPAPI_API_KEY environment variable is not set.");
    }
    
    const serpResults = await getJson({
      engine: "google",
      api_key: process.env.SERPAPI_API_KEY,
      q: query,
    });

    const response = await extractionPrompt({
        query,
        serpResults: JSON.stringify(serpResults.organic_results, null, 2),
    });

    return response.output || [];
  }
);
