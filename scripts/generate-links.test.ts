import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { slugify, createWhatsAppLink, parseGuestCsv, generateLinksFromCsv } from './generate-links';

describe('slugify', () => {
  it('formats special characters and slashes like Acuño/Kler to acuno-kler', () => {
    expect(slugify('Acuño/Kler')).toBe('acuno-kler');
  });

  it('formats dots and spaces like Fran P. to fran-p', () => {
    expect(slugify('Fran P.')).toBe('fran-p');
  });

  it('removes accents and diacritics', () => {
    expect(slugify('Tía Bebe')).toBe('tia-bebe');
    expect(slugify('César')).toBe('cesar');
    expect(slugify('Tradición')).toBe('tradicion');
    expect(slugify('Hernán')).toBe('hernan');
    expect(slugify('Rubén')).toBe('ruben');
  });

  it('handles abbreviations, symbols and trimmed hyphens', () => {
    expect(slugify('T. Juan')).toBe('t-juan');
    expect(slugify('Acuño/Gonz')).toBe('acuno-gonz');
    expect(slugify('Sra Ana')).toBe('sra-ana');
    expect(slugify('  --Casa--  ')).toBe('casa');
  });
});

describe('createWhatsAppLink', () => {
  it('generates a valid wa.me deep link with encoded invitation url', () => {
    const link = createWhatsAppLink('casa', 'https://carolina-xv.vercel.app');
    expect(link).toContain('https://wa.me/?text=');
    expect(link).toContain(encodeURIComponent('https://carolina-xv.vercel.app/?g=casa'));
    expect(link).toContain(encodeURIComponent('¡Hola! Te invitamos a los XV de Caro 🌟'));
  });
});

describe('parseGuestCsv', () => {
  it('parses CSV rows, skips header and TOTAL row, and calculates slugs and links', () => {
    const sampleCsv = `N°,Columna en la hoja,Invitado / Grupo,Cantidad de personas,Estado,Observaciones
1,Izquierda,Casa,7,Pendiente,
3,Izquierda,Acuño/Kler,4,Pendiente,
12,Izquierda,Fran P.,2,Pendiente,
,,TOTAL,89,,`;

    const guests = parseGuestCsv(sampleCsv, 'https://carolina-xv.vercel.app');

    expect(guests).toHaveLength(3);
    expect(guests[0]).toEqual({
      numero: '1',
      columna: 'Izquierda',
      nombre: 'Casa',
      cantidad: 7,
      slug: 'casa',
      invitationUrl: 'https://carolina-xv.vercel.app/?g=casa',
      whatsappUrl: createWhatsAppLink('casa', 'https://carolina-xv.vercel.app'),
      observaciones: '',
    });
    expect(guests[1].slug).toBe('acuno-kler');
    expect(guests[1].cantidad).toBe(4);
    expect(guests[2].slug).toBe('fran-p');
    expect(guests[2].cantidad).toBe(2);
  });
});

describe('generateLinksFromCsv', () => {
  it('reads csv from disk, writes output csv and returns guest list', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'csv-test-'));
    const inputPath = path.join(tmpDir, 'test-input.csv');
    const outputPath = path.join(tmpDir, 'test-output.csv');

    fs.writeFileSync(
      inputPath,
      `N°,Columna en la hoja,Invitado / Grupo,Cantidad de personas,Estado,Observaciones\n1,Izquierda,Casa,7,Pendiente,\n,,TOTAL,89,,`
    );

    const guests = generateLinksFromCsv(inputPath, 'https://carolina-xv.vercel.app', outputPath);
    expect(guests).toHaveLength(1);
    expect(guests[0].slug).toBe('casa');

    const outputContent = fs.readFileSync(outputPath, 'utf-8');
    expect(outputContent).toContain('grupo_code,nombre_grupo,max_personas,link_invitacion,link_whatsapp,observaciones');
    expect(outputContent).toContain('"casa","Casa",7');

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});

