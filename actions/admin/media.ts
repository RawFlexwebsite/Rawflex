'use server'

export type MediaItem = { folder: string; name: string; url: string }

export async function listMediaImages(): Promise<MediaItem[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key || url.includes('placeholder')) return []

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }

  const list = async (prefix: string): Promise<any[]> => {
    try {
      const res = await fetch(`${url}/storage/v1/object/list/rawflex`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prefix, limit: 1000, offset: 0 }),
        cache: 'no-store',
      })
      if (!res.ok) return []
      return await res.json()
    } catch {
      return []
    }
  }

  const publicUrl = (segments: string[]) =>
    `${url}/storage/v1/object/public/rawflex/${segments.map(encodeURIComponent).join('/')}`

  const items: MediaItem[] = []
  const topFolders = ['categories', 'hero', 'lookbook', 'site', 'samples']

  const walk = async (prefix: string, segments: string[], label: string) => {
    const entries = await list(prefix)
    for (const e of entries || []) {
      if (!e.id) {
        await walk(`${prefix}${e.name}/`, [...segments, e.name], `${label} / ${e.name}`)
      } else {
        items.push({ folder: label, name: e.name, url: publicUrl([...segments, e.name]) })
      }
    }
  }

  for (const folder of topFolders) {
    await walk(`${folder}/`, [folder], folder)
  }

  return items
}