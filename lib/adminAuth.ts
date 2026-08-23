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
      console.log('requireAdmin: No authenticated user')
      return { ok: false, error: 'Unauthorized' }
    }

    console.log('requireAdmin: Checking profile for user:', user.id, user.email)

    const adminClient = createAdminClient()
    const { data: profile, error } = await adminClient
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      console.error('requireAdmin: Database error:', error)
      return { ok: false, error: 'Unauthorized' }
    }

    if (!profile) {
      console.log('requireAdmin: No profile found for user:', user.id)
      return { ok: false, error: 'Unauthorized' }
    }

    console.log('requireAdmin: Profile found:', profile)

    if (profile.role !== 'admin' || profile.is_active === false) {
      console.log('requireAdmin: User is not admin or inactive:', profile)
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
