"use client";

import type { TransportationPlan } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Train } from "lucide-react";
import { Separator } from "./ui/separator";

type TransportationPlanDisplayProps = {
  plan: TransportationPlan;
};

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train className="h-6 w-6 text-primary" />
                Train Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.trains.map((train, index) => (
                <div key={index}>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="font-semibold">Train:</div><div>{train.name} ({train.number})</div>
                        <div className="font-semibold">Departure:</div><div>{train.departureStation} at {train.departureTime}</div>
                        <div className="font-semibold">Arrival:</div><div>{train.arrivalStation} at {train.arrivalTime}</div>
                        <div className="font-semibold">Duration:</div><div>{train.duration}</div>
                        <div className="font-semibold">Est. Price:</div><div>{train.price}</div>
                    </div>
                    {index < plan.trains!.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
      )}

       {plan.flights && plan.flights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-6 w-6 text-primary" />
                Flight Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.flights.map((flight, index) => (
                <div key={index}>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="font-semibold">Airline:</div><div>{flight.airline} ({flight.flightNumber})</div>
                        <div className="font-semibold">Departure:</div><div>{flight.departureAirport} at {flight.departureTime}</div>
                        <div className="font-semibold">Arrival:</div><div>{flight.arrivalAirport} at {flight.arrivalTime}</div>
                        <div className="font-semibold">Duration:</div><div>{flight.duration}</div>
                        <div className="font-semibold">Est. Price:</div><div>{flight.price}</div>
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
