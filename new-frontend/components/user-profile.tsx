"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-16 bg-gray-100 rounded-lg" />;
  }

  if (!user?.email) {
    return null;
  }

  // Get initials from email (everything before @)
  const initials = user.email.split('@')[0].slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2 p-4 border-t border-gray-200">
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="text-sm font-medium text-gray-700 truncate max-w-full">
        {user.email.split('@')[0]}
      </div>
    </div>
  );
} 