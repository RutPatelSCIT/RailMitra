"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { generatePlan } from "@/app/actions";
import type { TravelPlan } from "@/types";
import { TravelPlanDisplay } from "@/components/travel-plan-display";
import { Logo } from "@/components/logo";
import { Loader2, Plane } from "lucide-react";

const FormSchema = z.object({
  destination: z.string().min(3, {
    message: "Destination must be at least 3 characters.",
  }),
});

export default function Home() {
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      destination: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setPlan(null);
    try {
      const travelPlan = await generatePlan(data.destination);
      setPlan(travelPlan);
      if (!travelPlan) {
          toast({
          title: "Could not generate a plan",
          description: "There was an issue generating your travel plan. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b">
        <div className="container mx-auto flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">RailMitra</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Your AI-Powered Travel Planner
            </h2>
            <p className="text-muted-foreground">
              Enter your dream destination and let us craft the perfect itinerary for you.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <div className="relative">
                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g., 'a 5-day trip to Kerala'" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-32">
                {isLoading ? <Loader2 className="animate-spin" /> : "Plan Trip"}
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="flex justify-center items-center flex-col gap-4 text-center pt-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Crafting your itinerary... this might take a moment.</p>
            </div>
          )}
          
          {!isLoading && plan && (
            <TravelPlanDisplay plan={plan} />
          )}
        </div>
      </main>
    </div>
  );
}
