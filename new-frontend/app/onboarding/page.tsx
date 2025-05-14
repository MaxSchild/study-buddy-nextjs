// new-frontend/app/onboarding/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronsUpDown, Check, Loader2 } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import universitiesData from "../private_data/world_universities_and_domains.json";

// Transform the universities data into the format we need
const universities = universitiesData.map((uni) => ({
  value: uni.id, // Use the pre-generated unique ID
  label: uni.name,
}));

export default function OnboardingPage() {
  const [university, setUniversity] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  // Fetch user ID on mount
  useEffect(() => {
    async function fetchUserId() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    }
    fetchUserId();
  }, []);

  // Set up the dropzone for curriculum upload (only when userId is available)
  const uploadProps = useSupabaseUpload({
    bucketName: "organizational-study-data",
    path: "uploads",
    userId: userId || undefined,
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, upload the file if there is one
      if (uploadProps.files.length > 0) {
        await uploadProps.onUpload();
        if (uploadProps.errors.length > 0) {
          throw new Error("Failed to upload file");
        }
      }

      // Get the current user
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }

      // Get the file URL if a file was uploaded
      let curriculumUrl = null;
      if (uploadProps.successes.length > 0) {
        const { data: { publicUrl } } = supabase.storage
          .from("organizational-study-data")
          .getPublicUrl(`uploads/${uploadProps.successes[0]}`);
        curriculumUrl = publicUrl;
      }

      // Save the profile data
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          university: universities.find(u => u.value === university)?.label || university,
          curriculum_url: curriculumUrl,
        });

      if (profileError) {
        throw new Error("Failed to save profile data");
      }

      setSubmitted(true);
      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
                            value={u.label}
                            onSelect={(currentValue) => {
                              const selectedUni = universities.find(uni => uni.label === currentValue);
                              setUniversity(selectedUni?.value || "");
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
            <div className="mb-6">
              <Label htmlFor="curriculum">Upload your curriculum</Label>
              {userId ? (
                submitted ? (
                  <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center mt-2">
                    Redirecting...
                  </div>
                ) : uploadProps.isSuccess ? (
                  <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center mt-2">
                    Files uploaded successfully!
                  </div>
                ) : (
                  <Dropzone {...uploadProps} className="mt-2">
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                )
              ) : (
                <div className="text-sm text-gray-500 mt-2">Loading user info...</div>
              )}
            </div>
            {error && (
              <div className="text-sm text-red-500 mt-2">{error}</div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !university || !uploadProps.isSuccess}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
