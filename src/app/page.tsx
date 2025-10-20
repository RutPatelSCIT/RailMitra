"use client";

import { useState, useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useToast } from "@/hooks/use-toast";
import { generatePlan } from "@/app/actions";
import type { TravelPlan, TransportationPlan } from "@/types";
import { TravelPlanDisplay } from "@/components/travel-plan-display";
import { TransportationPlanDisplay } from "@/components/transportation-plan-display";
import { Logo } from "@/components/logo";
import { Loader2, Plane, Train, Briefcase, Mic, MicOff } from "lucide-react";

const initialState = {
  plan: null,
  planType: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-32">
      {pending ? <Loader2 className="animate-spin" /> : "Generate"}
    </Button>
  );
}

export default function Home() {
  const [queryType, setQueryType] = useState("full_trip");
  const [destination, setDestination] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [state, formAction] = useActionState(generatePlan, initialState);
  const { toast } = useToast();
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDestination(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'aborted') {
          // This is a normal event when the user stops the recording manually.
          // We don't need to show an error message.
          console.log("Speech recognition aborted by user.");
          return;
        }
        
        console.error("Speech recognition error", event.error);
        toast({
            variant: "destructive",
            title: "Voice Error",
            description: `Could not recognize speech: ${event.error}`,
        });
        setIsRecording(false);
      };
      
      recognition.onend = () => {
         if (isRecording) {
            setIsRecording(false);
         }
      }
    }
  }, [toast, isRecording]);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
        toast({
            variant: "destructive",
            title: "Not Supported",
            description: "Your browser does not support voice recognition.",
        });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };


  if (state.error) {
    toast({
      variant: "destructive",
      title: "An error occurred",
      description: state.error,
    });
    state.error = null;
  }

  const getPlaceholder = () => {
    switch (queryType) {
      case "train_info":
        return "e.g., 'Trains from Delhi to Mumbai'";
      case "flight_info":
        return "e.g., 'Flights from New York to London'";
      case "full_trip":
      default:
        return "e.g., 'a 5-day trip to Kerala'";
    }
  };
  
  const getIcon = () => {
     switch (queryType) {
      case "train_info":
        return <Train className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />;
      case "flight_info":
        return <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />;
      case "full_trip":
      default:
        return <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />;
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
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Your AI-Powered Travel Assistant
            </h2>
            <p className="text-muted-foreground">
              Plan your perfect trip, or get specific train and flight details.
            </p>
          </div>

          <form action={formAction} className="space-y-4 pt-8">
             <RadioGroup
                name="queryType"
                defaultValue="full_trip"
                onValueChange={setQueryType}
                className="flex justify-center gap-4"
              >
                <Label htmlFor="full_trip" className="flex items-center gap-2 cursor-pointer rounded-md border p-2 has-[input:checked]:border-primary">
                  <RadioGroupItem value="full_trip" id="full_trip" />
                  Full Trip
                </Label>
                <Label htmlFor="train_info" className="flex items-center gap-2 cursor-pointer rounded-md border p-2 has-[input:checked]:border-primary">
                  <RadioGroupItem value="train_info" id="train_info" />
                  Train Info
                </Label>
                 <Label htmlFor="flight_info" className="flex items-center gap-2 cursor-pointer rounded-md border p-2 has-[input:checked]:border-primary">
                  <RadioGroupItem value="flight_info" id="flight_info" />
                  Flight Info
                </Label>
              </RadioGroup>

            <div className="flex items-start gap-2">
                <div className="relative flex-grow">
                    {getIcon()}
                    <Input 
                        name="destination" 
                        placeholder={getPlaceholder()} 
                        className="pl-10 pr-10" 
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                    <Button 
                        type="button" 
                        size="icon" 
                        variant="ghost" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={handleMicClick}
                    >
                        {isRecording ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                </div>
                <SubmitButton />
            </div>
          </form>

          {useFormStatus().pending && (
            <div className="flex justify-center items-center flex-col gap-4 text-center pt-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Crafting your response... this might take a moment.</p>
            </div>
          )}
          
          {!useFormStatus().pending && state.plan && (
            <>
              {state.planType === 'trip' && <TravelPlanDisplay plan={state.plan as TravelPlan} />}
              {state.planType === 'transport' && <TransportationPlanDisplay plan={state.plan as TransportationPlan} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
