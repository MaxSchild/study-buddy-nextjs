"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  university: string;
  curriculum_url: string | null;
}

// Mock data for additional files
const mockFiles = [
  {
    id: 1,
    name: "Academic Transcript.pdf",
    type: "application/pdf",
    size: "1.8 MB",
    uploadDate: "2024-03-10",
    url: "#", // Will be replaced with actual file URL
  },
  {
    id: 2,
    name: "Cover Letter.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: "0.8 MB",
    uploadDate: "2024-03-05",
    url: "#", // Will be replaced with actual file URL
  },
];

export default function DataPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not found");
        }

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("university, curriculum_url")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw new Error("Failed to fetch profile data");
        }

        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Data</h1>
      
      {/* University Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            University Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Current University</p>
            <p className="text-lg font-medium">{profile?.university || "Not set"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Uploaded Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Real curriculum file from profile */}
            {profile?.curriculum_url && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">Curriculum</p>
                    <p className="text-sm text-gray-500">
                      Uploaded curriculum file
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    if (profile.curriculum_url) {
                      window.open(profile.curriculum_url, '_blank');
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            )}

            {/* Mock files */}
            {mockFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {file.size} • Uploaded on {file.uploadDate}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(file.url, '_blank')}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}

            {/* Show message if no files at all */}
            {!profile?.curriculum_url && mockFiles.length === 0 && (
              <p className="text-gray-500 text-center py-4">No files uploaded yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 