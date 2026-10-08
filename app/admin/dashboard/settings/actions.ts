'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const supabase = await createClient()
  const displayName = formData.get('display_name') as string

  const { error } = await supabase.auth.updateUser({
    data: { display_name: displayName },
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/dashboard/settings')
  return { success: 'Profile updated successfully.' }
}

export async function updatePassword(
  prevState: { error?: string; success?: string } | null,
  formData: FormData
) {
  const supabase = await createClient()
  const newPassword = formData.get('new_password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  if (newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) return { error: error.message }

  return { success: 'Password updated successfully.' }
}
