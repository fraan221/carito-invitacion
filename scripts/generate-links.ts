import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export interface GuestGroup {
  numero: string;
  columna: string;
  nombre: string;
  cantidad: number;
  slug: string;
  invitationUrl: string;
  whatsappUrl: string;
  observaciones: string;
}

const DEFAULT_BASE_URL = 'https://carolina-xv.vercel.app';

export function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createWhatsAppLink(slug: string, baseUrl = DEFAULT_BASE_URL): string {
  const invitationUrl = `${baseUrl}/?g=${slug}`;
  const text = `¡Hola! Te invitamos a los XV de Caro 🌟 ${invitationUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function parseGuestCsv(csvContent: string, baseUrl = DEFAULT_BASE_URL): GuestGroup[] {
  const lines = csvContent.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 1) return [];

  const results: GuestGroup[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    const numero = cols[0] || '';
    const columna = cols[1] || '';
    const nombre = cols[2] || '';
    const cantidad = parseInt(cols[3], 10) || 0;
    const observaciones = cols[5] || '';

    // Ignore header repeats, total summaries, or rows without names
    if (!nombre || nombre.toUpperCase() === 'TOTAL' || !numero) {
      continue;
    }

    const slug = slugify(nombre);
    const invitationUrl = `${baseUrl}/?g=${slug}`;
    const whatsappUrl = createWhatsAppLink(slug, baseUrl);

    results.push({
      numero,
      columna,
      nombre,
      cantidad,
      slug,
      invitationUrl,
      whatsappUrl,
      observaciones,
    });
  }

  return results;
}

export function generateLinksFromCsv(
  inputPath: string,
  baseUrl = DEFAULT_BASE_URL,
  outputPath?: string
): GuestGroup[] {
  const content = fs.readFileSync(inputPath, 'utf-8');
  const guests = parseGuestCsv(content, baseUrl);

  if (outputPath) {
    const csvHeader = 'grupo_code,nombre_grupo,max_personas,link_invitacion,link_whatsapp,observaciones\n';
    const csvRows = guests
      .map(
        (g) =>
          `"${g.slug}","${g.nombre}",${g.cantidad},"${g.invitationUrl}","${g.whatsappUrl}","${g.observaciones.replace(/"/g, '""')}"`
      )
      .join('\n');
    fs.writeFileSync(outputPath, csvHeader + csvRows + '\n', 'utf-8');
  }

  return guests;
}

// CLI execution
const currentFilePath = fileURLToPath(import.meta.url);
const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (invokedPath === currentFilePath) {
  const defaultInput = '/home/fraan/Downloads/invitados_15 - Lista general.csv';
  const inputCsv = process.argv[2] || defaultInput;
  const outputCsv = process.argv[3] || path.resolve(path.dirname(currentFilePath), 'invitados-con-links.csv');

  if (!fs.existsSync(inputCsv)) {
    console.error(`Error: archivo CSV no encontrado en ${inputCsv}`);
    process.exit(1);
  }

  const guests = generateLinksFromCsv(inputCsv, DEFAULT_BASE_URL, outputCsv);
  console.log(`\n🎉 Generados ${guests.length} enlaces de invitación y WhatsApp.`);
  console.log(`📁 Archivo CSV exportado en: ${outputCsv}\n`);

  console.table(
    guests.map((g) => ({
      N: g.numero,
      Grupo: g.nombre,
      Cupo: g.cantidad,
      Slug: g.slug,
      Invitación: g.invitationUrl,
    }))
  );
}
