import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export type AdminAuthResult =
  | { ok: true; userId: string; adminClient: ReturnType<typeof createAdminClient> }
  | { ok: false; error: string }

export async function requireAdmin(): Promise<AdminAuthResult> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { ok: false, error: 'Unauthorized' }
    }

    const adminClient = createAdminClient()
    const { data: profile, error } = await adminClient
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .maybeSingle()

    if (error || !profile || profile?.role !== 'admin' || profile?.is_active === false) {
      return { ok: false, error: 'Unauthorized' }
    }

    return {
      ok: true,
      userId: user.id,
      adminClient,
    }
  } catch (e: any) {
    console.error('requireAdmin error:', e)
    return { ok: false, error: 'Unauthorized' }
  }
}
