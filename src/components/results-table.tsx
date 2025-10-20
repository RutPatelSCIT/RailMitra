"use client";

import type { SerpResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileJson, FileText, Link as LinkIcon } from "lucide-react";
import { downloadCsv, downloadJson } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type ResultsTableProps = {
  results: SerpResult[];
  query: string;
};

export function ResultsTable({ results, query }: ResultsTableProps) {
  if (results.length === 0) {
    return null;
  }

  const handleDownloadJson = () => {
    downloadJson(results, `serp-results-${query.replace(/\s+/g, '_')}`);
  };

  const handleDownloadCsv = () => {
    downloadCsv(results, `serp-results-${query.replace(/\s+/g, '_')}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <CardTitle>Extracted Data</CardTitle>
            <p className="text-sm text-muted-foreground">Found {results.length} results for your query.</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="mr-2" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownloadJson}>
                <FileJson className="mr-2" />
                JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadCsv}>
                <FileText className="mr-2" />
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[30%]">Title</TableHead>
                <TableHead className="w-[55%]">Description</TableHead>
                <TableHead className="text-right w-[15%]">Link</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {results.map((result, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium max-w-xs truncate" title={result.title}>{result.title}</TableCell>
                    <TableCell className="text-muted-foreground max-w-md truncate" title={result.description}>{result.description}</TableCell>
                    <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                        <a href={result.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${result.title}`}>
                        <LinkIcon className="h-4 w-4" />
                        </a>
                    </Button>
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
