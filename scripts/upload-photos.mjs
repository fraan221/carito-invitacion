import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { put } from '@vercel/blob'

// Load .env.local manually without external dotenv dependency
const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim()
      let val = trimmed.slice(eqIdx + 1).trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      process.env[key] = val
    }
  })
}

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('Missing BLOB_READ_WRITE_TOKEN in .env.local')
  process.exit(1)
}

const rawDir = '/home/fraan/Pictures/carito'
const optDir = '/tmp/carito-optimized'

// If --optimize is passed or optDir does not exist, run python optimization
const shouldOptimize =
  process.argv.includes('--optimize') ||
  !fs.existsSync(optDir) ||
  fs.readdirSync(optDir).filter((f) => f.endsWith('.webp')).length === 0

if (shouldOptimize && fs.existsSync(rawDir)) {
  console.log(`Optimizing images from ${rawDir} -> ${optDir}...`)
  execSync(
    `python3 -c "
import os
from PIL import Image, ImageOps

src_dir = '${rawDir}'
out_dir = '${optDir}'
os.makedirs(out_dir, exist_ok=True)

files = sorted([f for f in os.listdir(src_dir) if f.lower().endswith(('.jpeg', '.jpg', '.png'))])
max_dim = 1400

for f in files:
    src_path = os.path.join(src_dir, f)
    im = Image.open(src_path)
    im = ImageOps.exif_transpose(im)
    if im.mode in ('RGBA', 'P'):
        im = im.convert('RGB')
    w, h = im.size
    if max(w, h) > max_dim:
        scale = max_dim / max(w, h)
        im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    base_name = os.path.splitext(f)[0] + '.webp'
    out_path = os.path.join(out_dir, base_name)
    im.save(out_path, 'WEBP', quality=84, method=6)
print(f'Optimized {len(files)} photos successfully.')
"`,
    { stdio: 'inherit' }
  )
}

const files = fs
  .readdirSync(optDir)
  .filter((f) => f.endsWith('.webp'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))

console.log(`Found ${files.length} optimized images to upload to Vercel Blob...`)

const uploadedPhotos = []

for (let i = 0; i < files.length; i++) {
  const file = files[i]
  const filePath = path.join(optDir, file)
  const fileBuffer = fs.readFileSync(filePath)
  const blobPath = `gallery/${file}`

  process.stdout.write(`Uploading [${i + 1}/${files.length}] ${blobPath}... `)
  const blob = await put(blobPath, fileBuffer, {
    access: 'public',
    token,
    addRandomSuffix: false, // keep clean predictable URL
    allowOverwrite: true, // allow updating existing photos
  })

  uploadedPhotos.push({
    id: `photo-${String(i + 1).padStart(2, '0')}`,
    src: `${blob.url}?v=${Date.now()}`,
    alt: `Momento especial de Carolina - Mis XV`,
    filename: file,
  })
  console.log(`✓ ${blob.url}`)
}

const outDataDir = path.resolve('src/data')
fs.mkdirSync(outDataDir, { recursive: true })
const outDataPath = path.join(outDataDir, 'photos.json')
fs.writeFileSync(outDataPath, JSON.stringify(uploadedPhotos, null, 2), 'utf8')

console.log(`\nSuccessfully uploaded ${uploadedPhotos.length} photos!`)
console.log(`Saved manifest to: ${outDataPath}`)
