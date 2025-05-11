import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CookieOptions } from "@supabase/ssr";

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.then((fetchedCookieStore) => {
            return fetchedCookieStore.get(name)?.value;
          });
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.then((fetchedCookieStore) => {
              return fetchedCookieStore.set({ name, value, ...options });
            });
          } catch (error: unknown) {
            console.error("Error setting cookie:", error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.then((fetchedCookieStore) => {
              return fetchedCookieStore.set({ name, value: "", ...options });
            });
          } catch (error: unknown) {
            console.error("Error removing cookie:", error);
          }
        },
      },
    }
  );
};
