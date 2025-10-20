'use server';

import { z } from 'zod';
import { ai } from '../genkit';

const SerpAPIResult = z.object({
  position: z.number(),
  title: z.string(),
  link: z.string(),
  snippet: z.string(),
});

const SerpAPIResponse = z.object({
  organic_results: z.array(SerpAPIResult),
});

// Mock response for demonstration
const mockSerpResults = {
  organic_results: [
    {
      position: 1,
      title: 'Example.com: The Best Example Website',
      link: 'https://example.com',
      snippet:
        'An example website for demonstration purposes. Learn more about examples here.',
    },
    {
      position: 2,
      title: 'Another Example - Example.org',
      link: 'https://example.org',
      snippet: 'Discover another great example at Example.org. We have many examples.',
    },
    {
      position: 3,
      title: 'Wikipedia - Example',
      link: 'https://en.wikipedia.org/wiki/Example',
      snippet:
        'An example is a thing characteristic of its kind or illustrating a general rule.',
    },
    {
      position: 4,
      title: 'Next.js by Vercel - The React Framework for the Web',
      link: 'https://nextjs.org/',
      snippet:
        "Used by some of the world's largest companies, Next.js enables you to create full-stack Web applications by extending the latest React features...",
    },
    {
      position: 5,
      title:
        'Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.',
      link: 'https://tailwindcss.com/',
      snippet:
        'A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.',
    },
  ],
};

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
        
        Analyze the following SERP results and extract the title, URL, description, and determine the type of each result.
        
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
    // In a real app, this would call the Serp API
    console.log(`Faking SERP API call for query: "${query}"`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Here we use an AI model to extract and classify the data.
    const response = await extractionPrompt({
        query,
        serpResults: JSON.stringify(mockSerpResults.organic_results, null, 2),
    });

    return response.output || [];
  }
);
