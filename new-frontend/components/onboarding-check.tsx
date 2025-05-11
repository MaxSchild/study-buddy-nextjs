"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const supabase = createClient();
        
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          // If no user is found, redirect to landing page
          router.push("/");
          return;
        }

        // Check if the user has completed onboarding
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("university, curriculum_url")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          // If there's an error or no profile exists, user needs onboarding
          router.push("/onboarding");
          return;
        }

        if (!profile?.university) {
          // If no university is set, user needs onboarding
          router.push("/onboarding");
          return;
        }

        // If we get here, the user has completed onboarding
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // In case of error, we'll show the children (dashboard) by default
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
} 