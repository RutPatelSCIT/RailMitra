"use client";

import type { TransportationPlan } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Train, ExternalLink } from "lucide-react";
import { Separator } from "./ui/separator";
import { format } from "date-fns";

type TransportationPlanDisplayProps = {
  plan: TransportationPlan;
};

const formatTime = (timeString: string) => {
    try {
        // Check if it's already a time format
        if (timeString.match(/^\d{1,2}:\d{2}$/)) return timeString;
        return format(new Date(timeString), 'p');
    } catch (e) {
        return timeString;
    }
}

export function TransportationPlanDisplay({ plan }: TransportationPlanDisplayProps) {
  if (!plan || (!plan.trains && !plan.flights)) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>No Information Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p>We couldn't find any information for your query. Please try a different search.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-4">
      {plan.trains && plan.trains.length > 0 && (
          <Card className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train className="h-6 w-6 text-primary" />
                Train Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.trains.map((train, index) => (
                <div key={index}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="font-semibold">Train:</div><div>{train.name} ({train.number})</div>
                        <div className="font-semibold">Departure:</div><div>{train.departureStation} at {formatTime(train.departureTime)}</div>
                        <div className="font-semibold">Arrival:</div><div>{train.arrivalStation} at {formatTime(train.arrivalTime)}</div>
                        <div className="font-semibold">Duration:</div><div>{train.duration}</div>
                        <div className="font-semibold">Est. Price:</div><div>{train.price}</div>
                        <div className="font-semibold">Booking:</div>
                        <div>
                            <Button asChild variant="link" className="p-0 h-auto">
                                <a href={train.bookingUrl} target="_blank" rel="noopener noreferrer">
                                    Search on IRCTC <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                            </Button>
                        </div>
                    </div>
                    {index < plan.trains!.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
      )}

       {plan.flights && plan.flights.length > 0 && (
          <Card className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-6 w-6 text-accent" />
                Flight Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.flights.map((flight, index) => (
                <div key={index}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="font-semibold">Airline:</div><div>{flight.airline} ({flight.flightNumber})</div>
                        <div className="font-semibold">Departure:</div><div>{flight.departureAirport} at {formatTime(flight.departureTime)}</div>
                        <div className="font-semibold">Arrival:</div><div>{flight.arrivalAirport} at {formatTime(flight.arrivalTime)}</div>
                        <div className="font-semibold">Duration:</div><div>{flight.duration}</div>
                        <div className="font-semibold">Est. Price:</div><div>{flight.price}</div>
                         <div className="font-semibold">Booking:</div>
                        <div>
                            <Button asChild variant="link" className="p-0 h-auto">
                                <a href={flight.bookingUrl} target="_blank" rel="noopener noreferrer">
                                    Find Booking Options <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                            </Button>
                        </div>
                    </div>
                    {index < plan.flights!.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
      )}
    </div>
  );
}
