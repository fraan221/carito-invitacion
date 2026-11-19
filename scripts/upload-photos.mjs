import fs from 'fs'
import path from 'path'
import { put } from '@vercel/blob'

// Load .env.local manually without external dotenv dependency
const envPath = path.resolve('.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
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

const optDir = '/tmp/carito-optimized'
const files = fs.readdirSync(optDir).filter(f => f.endsWith('.webp')).sort()

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
  })
  
  uploadedPhotos.push({
    id: `photo-${String(i + 1).padStart(2, '0')}`,
    src: blob.url,
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
