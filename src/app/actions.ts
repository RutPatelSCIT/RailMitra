'use server';
import { travelPlannerFlow } from '@/ai/flows/travelPlanner';
import { transportationFlow } from '@/ai/flows/transportationFlow';
import { z } from 'zod';

const TravelPlanInputSchema = z.object({
    destination: z.string().min(1, "Destination cannot be empty."),
    queryType: z.literal("full_trip"),
});

const TransportationInputSchema = z.object({
    destination: z.string().min(1, "Query cannot be empty."),
    queryType: z.enum(["train_info", "flight_info"]),
    date: z.string().optional(),
});

const InputSchema = z.union([TravelPlanInputSchema, TransportationInputSchema]);


export async function generatePlan(prevState: any, formData: FormData): Promise<any> {
    const rawData = {
        destination: formData.get('destination'),
        queryType: formData.get('queryType'),
        date: formData.get('date'),
    };
    
    const validation = InputSchema.safeParse(rawData);
    
    if (!validation.success) {
        return {
            ...prevState,
            error: validation.error.errors.map(e => e.message).join(', '),
        }
    }
    
    const { destination, queryType } = validation.data;

    try {
        if (validation.data.queryType === 'full_trip') {
            const results = await travelPlannerFlow({ query: destination });
            return { plan: results, planType: 'trip' };
        } else {
             const { date } = validation.data;
             const results = await transportationFlow({ query: destination, queryType, date });
             return { plan: results, planType: 'transport', date: date };
        }
    } catch (error) {
        console.error('Error running flow:', error);
        return {
             ...prevState,
             error: 'Failed to generate plan.',
        }
    }
}
