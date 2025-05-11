"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - will be replaced with Supabase data later
const mockData = {
  university: "Technical University of Munich",
  files: [
    {
      id: 1,
      name: "Curriculum Vitae.pdf",
      type: "application/pdf",
      size: "2.4 MB",
      uploadDate: "2024-03-15",
      url: "#", // Will be replaced with actual file URL
    },
    {
      id: 2,
      name: "Academic Transcript.pdf",
      type: "application/pdf",
      size: "1.8 MB",
      uploadDate: "2024-03-10",
      url: "#", // Will be replaced with actual file URL
    },
    {
      id: 3,
      name: "Cover Letter.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: "0.8 MB",
      uploadDate: "2024-03-05",
      url: "#", // Will be replaced with actual file URL
    },
  ],
};

export default function DataPage() {
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
            <p className="text-lg font-medium">{mockData.university}</p>
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
            {mockData.files.map((file) => (
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 