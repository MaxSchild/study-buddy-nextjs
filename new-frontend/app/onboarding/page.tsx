// new-frontend/app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronsUpDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";

const universities = [
  { value: "harvard", label: "Harvard University" },
  { value: "mit", label: "MIT" },
  { value: "stanford", label: "Stanford University" },
  { value: "oxford", label: "University of Oxford" },
  { value: "cambridge", label: "University of Cambridge" },
  { value: "tum", label: "Technical University of Munich" },
  { value: "ethz", label: "ETH Zurich" },
];

export default function OnboardingPage() {
  const [university, setUniversity] = useState("");
  const [open, setOpen] = useState(false);

  // Set up the dropzone for curriculum upload
  const uploadProps = useSupabaseUpload({
    bucketName: "organizational-study-data", // Make sure this bucket exists in Supabase
    path: "uploads",
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save university and uploaded file info to Supabase
    // Redirect to dashboard after successful onboarding
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to StudyBuddy!</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="university">Select your university</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between mt-2"
                  >
                    {university
                      ? universities.find((u) => u.value === university)?.label
                      : "Select university..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search university..." />
                    <CommandList>
                      <CommandEmpty>No university found.</CommandEmpty>
                      <CommandGroup>
                        {universities.map((u) => (
                          <CommandItem
                            key={u.value}
                            value={u.value}
                            onSelect={(currentValue) => {
                              setUniversity(currentValue === university ? "" : currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                university === u.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {u.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="curriculum">Upload your curriculum</Label>
              <Dropzone {...uploadProps} className="mt-2">
                <DropzoneEmptyState />
                <DropzoneContent />
              </Dropzone>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
