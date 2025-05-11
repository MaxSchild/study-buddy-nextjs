"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, ChevronDown } from "lucide-react";

interface Suggestion {
  title: string;
  description: string;
  reason: string;
}

export default function JobApplicationPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ message: string; suggestions: Suggestion[] } | null>(null);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const handleSubmit = async () => {
    setLoading(true);
    setResponse(null);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      // Mocked response data
      setResponse({
        message: "Thanks for your interest! Based on your input, here are some matching internships:",
        suggestions: [
          {
            title: "Frontend Developer Praktikum...",
            description: "...",
            reason: "...",
          },
          {
            title: "Frontend Engineer im Bereich Multimedia...",
            description: "...",
            reason: "...",
          },
          {
            title: "Praktikum im Bereich Innovation...",
            description: "...",
            reason: "...",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Job Application</CardTitle>
          <p className="text-muted-foreground">Tell us what you are looking for.</p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Your job preferences"
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading || !text.trim()}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Submit
            </Button>
          </div>
          {loading && (
            <div className="flex justify-center mt-6">
              <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {response && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">{response.message}</h2>
              {response.suggestions.length === 0 && (
                <p className="text-muted-foreground">No suggestions found.</p>
              )}
              {response.suggestions.map((item, idx) => (
                <div key={idx} className="mb-4 border rounded-lg">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold bg-gray-50 hover:bg-gray-100 rounded-t-lg focus:outline-none"
                    onClick={() => toggleAccordion(idx)}
                  >
                    <span>{item.title}</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${openIndexes.includes(idx) ? "rotate-180" : "rotate-0"}`} />
                  </button>
                  {openIndexes.includes(idx) && (
                    <div className="px-4 py-3 border-t bg-white rounded-b-lg">
                      <p className="mb-2">{item.description}</p>
                      <Separator className="my-2" />
                      <p className="text-sm text-muted-foreground">
                        <strong>Warum passend?</strong> {item.reason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 