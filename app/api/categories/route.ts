import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { name, status } = body

  if (!name?.trim()) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const { data, error } = await supabase
    .from('categories')
    .insert({ name: name.trim(), slug, status: status ?? 'Active' })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}
