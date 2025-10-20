"use client";

import type { PnrStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket } from "lucide-react";
import { Badge } from "./ui/badge";

type PnrStatusDisplayProps = {
  plan: PnrStatus;
};

const getStatusVariant = (status: string) => {
    if (status.includes('CNF')) return 'default';
    if (status.includes('RAC')) return 'secondary';
    if (status.includes('WL')) return 'destructive';
    return 'outline';
}

export function PnrStatusDisplay({ plan }: PnrStatusDisplayProps) {
  if (!plan || !plan.pnrNumber) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>PNR Status Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p>We couldn't retrieve the status for the provided PNR. Please check the number and try again.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-6 w-6 text-primary" />
          PNR Status for {plan.pnrNumber}
        </CardTitle>
        <CardDescription>{plan.trainName} ({plan.trainNumber})</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="font-semibold">From:</div><div>{plan.departureStation}</div>
            <div className="font-semibold">To:</div><div>{plan.arrivalStation}</div>
            <div className="font-semibold">Journey Date:</div><div>{plan.journeyDate}</div>
        </div>

        <div>
            <h4 className="font-semibold mb-2">Passenger Status</h4>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Passenger</TableHead>
                    <TableHead>Booking Status</TableHead>
                    <TableHead>Current Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {plan.passengers.map((passenger, index) => (
                        <TableRow key={index}>
                            <TableCell>{passenger.passenger}</TableCell>
                            <TableCell>
                               <Badge variant={getStatusVariant(passenger.bookingStatus)}>{passenger.bookingStatus}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(passenger.currentStatus)}>{passenger.currentStatus}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
