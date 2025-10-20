"use client";

import type { TrainStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircleDot, Clock } from "lucide-react";
import { Badge } from "./ui/badge";

type TrainStatusDisplayProps = {
  plan: TrainStatus;
};

const getStatusVariant = (status: string) => {
    if (status.toLowerCase().includes('on time')) return 'default';
    if (status.toLowerCase().includes('delayed')) return 'destructive';
    if (status.toLowerCase().includes('arrived')) return 'outline';
    return 'secondary';
}

export function TrainStatusDisplay({ plan }: TrainStatusDisplayProps) {
  if (!plan || !plan.trainNumber) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Train Status Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p>We couldn't retrieve the status for the provided train. Please check the number or name and try again.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700/10 via-background to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CircleDot className="h-6 w-6 text-primary" />
          Live Status for {plan.trainName} ({plan.trainNumber})
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
            <Clock className="h-3 w-3" /> Last updated: {plan.lastUpdated}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="font-semibold">Current Status:</div>
            <div>
                <Badge variant={getStatusVariant(plan.status)}>{plan.status}</Badge>
                {plan.delay !== 'On Time' && <span className="ml-2">({plan.delay})</span>}
            </div>

            <div className="font-semibold">Current Station:</div>
            <div>{plan.currentStation}</div>
            
            <div className="font-semibold">Next Station:</div>
            <div>{plan.nextStation}</div>
            
            <div className="font-semibold">ETA at Next Station:</div>
            <div>{plan.etaNextStation}</div>
        </div>
      </CardContent>
    </Card>
  );
}
