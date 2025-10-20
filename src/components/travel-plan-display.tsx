"use client";

import type { TravelPlan } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Hotel, MapPin, Mountain } from "lucide-react";

type TravelPlanDisplayProps = {
  plan: TravelPlan;
};

export function TravelPlanDisplay({ plan }: TravelPlanDisplayProps) {
  if (!plan) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.tripTitle}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <span className="font-bold">Estimated Budget:</span> {plan.estimatedBudget}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="day-1" className="w-full">
          {plan.itinerary.map((item) => (
            <AccordionItem value={`day-${item.day}`} key={item.day}>
              <AccordionTrigger>
                <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">
                        {item.day}
                    </div>
                    <span className="font-semibold text-lg">Day {item.day}: {item.location}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-4 border-l-2 border-primary ml-8 space-y-4">
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-1 text-muted-foreground"/>
                    <div>
                        <h4 className="font-semibold">Location</h4>
                        <p className="text-muted-foreground">{item.location}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Mountain className="h-5 w-5 mt-1 text-muted-foreground"/>
                    <div>
                        <h4 className="font-semibold">Activities & Scenic Places</h4>
                        <p className="text-muted-foreground">{item.activities}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Hotel className="h-5 w-5 mt-1 text-muted-foreground"/>
                    <div>
                        <h4 className="font-semibold">Hotel Suggestion</h4>
                        <p className="text-muted-foreground">{item.hotel}</p>
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
