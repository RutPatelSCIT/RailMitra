'use server';
import { extractDataFlow } from '@/ai/flows/extractData';
import { z } from 'zod';

const InputSchema = z.object({
    query: z.string().min(1, "Query cannot be empty."),
});

export async function getSerpResults(query: string): Promise<any> {
    const validation = InputSchema.safeParse({ query });
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }

    try {
        const results = await extractDataFlow({ query });
        return results;
    } catch (error) {
        console.error('Error running extractDataFlow:', error);
        throw new Error('Failed to fetch and extract SERP data.');
    }
}
