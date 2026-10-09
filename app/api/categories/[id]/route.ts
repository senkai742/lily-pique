import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  const body = await request.json()
  const { name, status } = body

  if (!name?.trim()) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const { data, error } = await supabase
    .from('categories')
    .update({ name: name.trim(), slug, status })
    .eq('id', id)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return new Response(null, { status: 204 })
}
