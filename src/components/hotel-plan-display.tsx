"use client";

import type { HotelPlan } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hotel, Star, ExternalLink } from "lucide-react";
import { Separator } from "./ui/separator";

type HotelPlanDisplayProps = {
  plan: HotelPlan;
};

export function HotelPlanDisplay({ plan }: HotelPlanDisplayProps) {
  if (!plan || !plan.hotels || plan.hotels.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>No Hotels Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p>We couldn't find any hotels for your query. Please try a different location.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700/10 via-background to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hotel className="h-6 w-6 text-primary" />
          Hotel Information for {plan.city}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {plan.hotels.map((hotel, index) => (
          <div key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="font-semibold">Hotel:</div><div>{hotel.name}</div>
                  <div className="font-semibold">Est. Price:</div><div>{hotel.price}</div>
                  <div className="font-semibold">Rating:</div>
                  <div className="flex items-center">
                    {hotel.rating}/5
                    <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400"/>
                  </div>
                  <div className="font-semibold">Booking:</div>
                  <div>
                    <Button asChild variant="link" className="p-0 h-auto">
                        <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">
                            Find Booking Options <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                    </Button>
                  </div>
              </div>
              {index < plan.hotels.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
