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
  it('generates a valid wa.me deep link with encoded invitation url and deadline', () => {
    const link = createWhatsAppLink('casa', 'https://milagroscarolinaherrera.app');
    expect(link).toContain('https://wa.me/?text=');
    expect(link).toContain(encodeURIComponent('https://milagroscarolinaherrera.app/?g=casa'));
    expect(link).toContain(encodeURIComponent('¡Hola! Te invitamos a los XV de Caro 🌟'));
    expect(link).toContain(encodeURIComponent('20 de Diciembre de 2026'));
  });

  it('allows customizing deadline parameter', () => {
    const link = createWhatsAppLink('casa', 'https://milagroscarolinaherrera.app', '25 de Enero de 2027');
    expect(link).toContain(encodeURIComponent('25 de Enero de 2027'));
  });
});

describe('parseGuestCsv', () => {
  it('parses CSV rows, skips header and TOTAL row, and calculates slugs and links', () => {
    const sampleCsv = `N°,Columna en la hoja,Invitado / Grupo,Cantidad de personas,Estado,Observaciones
1,Izquierda,Casa,7,Pendiente,
3,Izquierda,Acuño/Kler,4,Pendiente,
12,Izquierda,Fran P.,2,Pendiente,
,,TOTAL,89,,`;

    const guests = parseGuestCsv(sampleCsv, 'https://milagroscarolinaherrera.app');

    expect(guests).toHaveLength(3);
    expect(guests[0]).toEqual({
      numero: '1',
      columna: 'Izquierda',
      nombre: 'Casa',
      cantidad: 7,
      slug: 'casa',
      invitationUrl: 'https://milagroscarolinaherrera.app/?g=casa',
      whatsappUrl: createWhatsAppLink('casa', 'https://milagroscarolinaherrera.app'),
      observaciones: '',
    });
    expect(guests[1].slug).toBe('acuno-kler');
    expect(guests[1].cantidad).toBe(4);
    expect(guests[2].slug).toBe('fran-p');
    expect(guests[2].cantidad).toBe(2);
  });

  it('correctly parses fields containing commas within quotation marks', () => {
    const csvWithCommas = `N°,Columna en la hoja,Invitado / Grupo,Cantidad de personas,Estado,Observaciones
1,Izquierda,"Familia Pérez, González",5,Pendiente,"Confirmado, viene con auto"`;

    const guests = parseGuestCsv(csvWithCommas, 'https://milagroscarolinaherrera.app');
    expect(guests).toHaveLength(1);
    expect(guests[0].nombre).toBe('Familia Pérez, González');
    expect(guests[0].cantidad).toBe(5);
    expect(guests[0].slug).toBe('familia-perez-gonzalez');
    expect(guests[0].observaciones).toBe('Confirmado, viene con auto');
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

    const guests = generateLinksFromCsv(inputPath, 'https://milagroscarolinaherrera.app', outputPath);
    expect(guests).toHaveLength(1);
    expect(guests[0].slug).toBe('casa');

    const outputContent = fs.readFileSync(outputPath, 'utf-8');
    expect(outputContent).toContain('grupo_code,nombre_grupo,max_personas,link_invitacion,link_whatsapp,observaciones');
    expect(outputContent).toContain('"casa","Casa",7');

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});

