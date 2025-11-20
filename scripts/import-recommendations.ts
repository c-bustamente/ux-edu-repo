// scripts/import-recommendations.ts
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { pathToFileURL } from 'url';
import fs from 'fs';

const prisma = new PrismaClient();

// Nombres de exports esperados
const EXPORTS = [
  'AUDIENCE_RECOMMENDATIONS',
  'PLATFORM_MOBILE_UI_RECOMMENDATIONS',
  'PLATFORM_WEB_RESPONSIVE_UI_RECOMMENDATIONS',
  'RECOMMENDATIONS_EVA',
];

async function loadModule(modulePath: string) {
  const abs = path.resolve(modulePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`No encontré el archivo: ${abs}`);
  }
  // Import dinámico del TS usando tsx/ts-node (ya lo estás ejecutando con tsx)
  const url = pathToFileURL(abs).href;
  return import(url);
}

async function main() {
  // Ajusta la ruta si tu archivo está en otro lugar
  const dataModulePath = './data/recomendacionesEnglish.ts';

  // Cargamos el módulo TS y leemos sus exports tal cual
  const mod = await loadModule(dataModulePath);

  let total = 0;
  const totals: Record<string, number> = {};

  for (const name of EXPORTS) {
    const arr: any[] | undefined = mod[name];
    if (!Array.isArray(arr)) {
      console.warn(`⚠️  Export no encontrado o no es un array: ${name}. Continúo...`);
      continue;
    }

    let ok = 0, skipped = 0;
    for (const it of arr) {
      const inputId = it?.inputID ?? it?.inputId ?? it?.id;
      if (!inputId) { skipped++; continue; }

      const rec = it?.recommendation ?? it?.recomendation ?? {};

      await prisma.recommendationFlat.upsert({
        where: { inputId: String(inputId) },
        update: {
          collection: name,
          status: it.status ?? null,
          patternRef: it.patternRef ?? null,
          evaType: it.evaType ?? null,
          platform: it.platform ?? null,
          audience: it.audience ?? null,
          title: rec.title ?? null,
          how: rec.how ?? null,
          why: rec.why ?? null,
          recomendation: rec ?? null,
          sources: Array.isArray(it.sources) ? it.sources : null,
          rawItem: it,
        },
        create: {
          inputId: String(inputId),
          collection: name,
          status: it.status ?? null,
          patternRef: it.patternRef ?? null,
          evaType: it.evaType ?? null,
          platform: it.platform ?? null,
          audience: it.audience ?? null,
          title: rec.title ?? null,
          how: rec.how ?? null,
          why: rec.why ?? null,
          recomendation: rec ?? null,
          sources: Array.isArray(it.sources) ? it.sources : null,
          rawItem: it,
        }
      });

      ok++;
    }

    totals[name] = ok;
    total += ok;
    console.log(`✔ ${name}: ${ok} upserts (${skipped} sin inputID)`);
  }

  console.log('— Resumen —');
  for (const k of Object.keys(totals)) console.log(`${k}: ${totals[k]}`);
  console.log(`TOTAL upserts: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
