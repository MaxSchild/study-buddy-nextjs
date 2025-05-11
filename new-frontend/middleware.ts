import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // If there's no session and the user is trying to access a protected route
  if (!session) {
    const protectedRoutes = ['/dashboard', '/onboarding']
    const isProtectedRoute = protectedRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute) {
      // Redirect to the landing page
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // If there's a session and the user is trying to access the landing page
  if (session && request.nextUrl.pathname === '/') {
    // Check if user has completed onboarding
    const { data: profile } = await supabase
      .from('profiles')
      .select('university, curriculum_url')
      .eq('user_id', session.user.id)
      .single()

    if (!profile || !profile.university || !profile.curriculum_url) {
      // Redirect to onboarding if profile is incomplete
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Redirect to dashboard if profile is complete
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth routes (to prevent redirect loops)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
} 