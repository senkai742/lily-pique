import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  // Variants will cascade-delete automatically via FK
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return new Response(null, { status: 204 })
}
