"use client";

import type { TravelPlan } from "@/types";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Hotel, MapPin, Mountain, Star, Download, Loader2, Train } from "lucide-react";
import { useState } from "react";
import { Separator } from "./ui/separator";

type TravelPlanDisplayProps = {
  plan: TravelPlan;
};

export function TravelPlanDisplay({ plan }: TravelPlanDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

  if (!plan) {
    return null;
  }

  const handleDownloadPdf = async () => {
    const input = planRef.current;
    if (!input) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const pdfHeight = pdfWidth / ratio;

      let position = 0;
      let pageHeight = pdf.internal.pageSize.getHeight();
      let remainingHeight = canvasHeight * pdfWidth / canvasWidth;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      remainingHeight -= pageHeight;
      
      while (remainingHeight > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        remainingHeight -= pageHeight;
      }
      
      pdf.save(`${plan.tripTitle.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
          <Button onClick={handleDownloadPdf} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="animate-spin" /> : <Download />}
            <span className="ml-2">Download PDF</span>
          </Button>
      </div>
      <Card ref={planRef} className="p-4">
        <CardHeader>
          <CardTitle>{plan.tripTitle}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="font-bold">Estimated Budget:</span> {plan.estimatedBudget}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {plan.itinerary.map((item, index) => (
              <div key={item.day}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">
                        {item.day}
                    </div>
                    <span className="font-semibold text-lg">Day {item.day}: {item.location}</span>
                </div>

                <div className="pl-12 space-y-4">
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
                          <h4 className="font-semibold">Hotel Suggestions</h4>
                           <div className="text-muted-foreground space-y-2 pt-1">
                                {item.hotels.map((hotel) => (
                                    <div key={hotel.name} className="flex flex-col p-2 border rounded-md">
                                        <span className="font-medium text-foreground">{hotel.name}</span>
                                        <span>Price: {hotel.price}</span>
                                        <div className="flex items-center">
                                            <span>Rating: {hotel.rating}/5</span>
                                            <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                      </div>
                  </div>
                  {item.trains && item.trains.length > 0 && (
                    <div className="flex items-start gap-3">
                        <Train className="h-5 w-5 mt-1 text-muted-foreground"/>
                        <div>
                            <h4 className="font-semibold">Train Options</h4>
                            <div className="text-muted-foreground space-y-2 pt-1">
                                  {item.trains.map((train) => (
                                      <div key={train.name} className="flex flex-col p-2 border rounded-md">
                                          <span className="font-medium text-foreground">{train.name}</span>
                                          <span>Departure: {train.departure}</span>
                                          <span>Arrival: {train.arrival}</span>
                                          <span>Price: {train.price}</span>
                                      </div>
                                  ))}
                              </div>
                        </div>
                    </div>
                  )}
                </div>
                {index < plan.itinerary.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
