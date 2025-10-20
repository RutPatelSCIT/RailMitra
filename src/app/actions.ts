'use server';
import { travelPlannerFlow } from '@/ai/flows/travelPlanner';
import { z } from 'zod';

const InputSchema = z.object({
    destination: z.string().min(1, "Destination cannot be empty."),
});

export async function generatePlan(destination: string): Promise<any> {
    const validation = InputSchema.safeParse({ destination });
    if (!validation.success) {
        throw new Error(validation.error.errors.map(e => e.message).join(', '));
    }

    try {
        const results = await travelPlannerFlow({ query: destination });
        return results;
    } catch (error) {
        console.error('Error running travelPlannerFlow:', error);
        throw new Error('Failed to generate travel plan.');
    }
}
