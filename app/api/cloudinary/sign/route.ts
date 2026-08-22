import { v2 as cloudinary } from 'cloudinary'
import { requireAdmin } from '@/lib/adminAuth'

const ALLOWED_SIGN_PARAMS = new Set([
  'timestamp',
  'folder',
  'public_id',
  'upload_preset',
  'tags',
  'context',
  'source',
  'use_filename',
  'unique_filename',
  'overwrite',
  'resource_type',
  'type',
  'access_mode',
])

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (admin.ok === false) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { paramsToSign } = body
  if (!paramsToSign || typeof paramsToSign !== 'object' || Array.isArray(paramsToSign)) {
    return Response.json({ error: 'Invalid signing parameters' }, { status: 400 })
  }

  const sanitizedParams = Object.fromEntries(
    Object.entries(paramsToSign).filter(([key]) => ALLOWED_SIGN_PARAMS.has(key))
  ) as Record<string, string | number>

  const timestamp = Number(sanitizedParams.timestamp)
  const nowSeconds = Math.floor(Date.now() / 1000)
  if (!timestamp || Math.abs(nowSeconds - timestamp) > 10 * 60) {
    return Response.json({ error: 'Invalid upload timestamp' }, { status: 400 })
  }

  const folder = String(sanitizedParams.folder || '')
  if (folder && !folder.startsWith('rawflex/')) {
    return Response.json({ error: 'Uploads must target a rawflex folder' }, { status: 400 })
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    return Response.json({ error: 'Cloudinary is not configured' }, { status: 500 })
  }

  // Configure cloudinary with the credentials from the environment
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  // Generate the signature
  const signature = cloudinary.utils.api_sign_request(
    sanitizedParams,
    process.env.CLOUDINARY_API_SECRET
  )

  return Response.json({ signature })
}
