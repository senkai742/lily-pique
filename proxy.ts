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

  // Block unauthenticated access to the dashboard
  if (isAdminDashboard && !user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Redirect already-authenticated users away from the login page
  if (isAdminLogin && user) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
}
