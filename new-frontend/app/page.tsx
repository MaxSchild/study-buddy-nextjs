"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Briefcase, Brain, ArrowRight } from "lucide-react";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        // Check if profile is complete
        const { data: profile } = await supabase
          .from('profiles')
          .select('university, curriculum_url')
          .eq('user_id', session.user.id)
          .single();
        
        setIsProfileComplete(!!(profile?.university && profile?.curriculum_url));
      }
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      // Redirect based on profile completion
      router.push(isProfileComplete ? '/dashboard' : '/onboarding');
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            StudyBuddy AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Your intelligent companion for academic success. Let AI help you manage your studies, deadlines, and career opportunities.
          </p>
          <Button 
            size="lg" 
            className="mt-8 px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleAuthClick}
          >
            {isAuthenticated 
              ? (isProfileComplete ? "Go to Dashboard" : "Complete Onboarding")
              : "Get Started"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Smart Features for Smart Students</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Dynamic Schedule Management</h3>
              <p className="text-gray-600">
                AI-powered scheduling that adapts to your study patterns and optimizes your time.
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Deadline Management</h3>
              <p className="text-gray-600">
                Never miss a deadline with smart reminders and priority-based task organization.
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Automated Job Applications</h3>
              <p className="text-gray-600">
                Streamline your job search with AI-assisted application tracking and optimization.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Integration Section */}
      <div className="container mx-auto px-4 py-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl my-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold">Powered by Advanced AI</h2>
            <p className="text-gray-600 text-lg">
              StudyBuddy uses cutting-edge artificial intelligence to understand your learning patterns,
              optimize your schedule, and help you achieve your academic goals.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleAuthClick}
            >
              {isAuthenticated 
                ? (isProfileComplete ? "Go to Dashboard" : "Complete Onboarding")
                : "Try it Now"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <Brain className="h-32 w-32 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)} 
      />
    </div>
  );
}
