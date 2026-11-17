import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — required to keep session alive
  const { data: { user } } = await supabase.auth.getUser()

  const isAdminDashboard = request.nextUrl.pathname.startsWith('/admin/dashboard')
  const isAdminLogin = request.nextUrl.pathname === '/admin'

  const { data: isAdmin } = user && (isAdminDashboard || isAdminLogin) ? await supabase.rpc('is_admin') : { data: false }

  function redirectWithCookies(path: string) {
    const response = NextResponse.redirect(new URL(path, request.url))
    supabaseResponse.cookies.getAll().forEach(cookie => response.cookies.set(cookie))
    return response
  }

  if (isAdminDashboard && user && !isAdmin) return redirectWithCookies('/account')

  // Block unauthenticated access to the dashboard
  if (isAdminDashboard && !user) {
    return redirectWithCookies('/admin')
  }

  // Redirect already-authenticated users away from the login page
  if (isAdminLogin && user && isAdmin) {
    return redirectWithCookies('/admin/dashboard')
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico).*)'],
}
