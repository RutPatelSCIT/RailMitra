"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getSerpResults } from "@/app/actions";
import type { SerpResult } from "@/types";
import { ResultsTable } from "@/components/results-table";
import { Logo } from "@/components/logo";
import { Loader2, Search } from "lucide-react";

const FormSchema = z.object({
  query: z.string().min(3, {
    message: "Query must be at least 3 characters.",
  }),
});

export default function Home() {
  const [results, setResults] = useState<SerpResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResults([]);
    setSubmittedQuery(data.query);
    try {
      const serpResults = await getSerpResults(data.query);
      setResults(serpResults);
      if (serpResults.length === 0) {
          toast({
          title: "No results found",
          description: "Your query did not return any results. Try a different one.",
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
          <h1 className="text-xl font-bold tracking-tight">SerpScraper</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Extract Data from the Web
            </h2>
            <p className="text-muted-foreground">
              Enter a search query to fetch and extract structured data from search engine results.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g., 'best Next.js starter kits'" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-28">
                {isLoading ? <Loader2 className="animate-spin" /> : "Scrape"}
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="flex justify-center items-center flex-col gap-4 text-center pt-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Fetching and extracting data... this might take a moment.</p>
            </div>
          )}
          
          {!isLoading && results.length > 0 && (
            <ResultsTable results={results} query={submittedQuery} />
          )}
        </div>
      </main>
    </div>
  );
}
