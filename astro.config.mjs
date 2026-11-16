// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

import icon from 'astro-icon';

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkCallouts from './src/lib/remark-callouts.mjs'

import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'
import * as pagefind from 'pagefind'

/**
 * Antes los docs eran archivos planos con prefijo ("grafos-kruskal.md" → /teoria/grafos-kruskal).
 * Ahora viven en carpetas por sección (grafos/kruskal.md → /teoria/grafos/kruskal).
 * Para no romper enlaces ya compartidos, cada URL vieja redirige a la nueva. Se calculan de las carpetas.
 */
function redireccionesUrlsViejas() {
  const base = new URL('./src/content/teorias/', import.meta.url)
  const redirecciones = {}
  for (const seccion of readdirSync(base, { withFileTypes: true })) {
    if (!seccion.isDirectory()) continue
    for (const archivo of readdirSync(new URL(`${seccion.name}/`, base))) {
      if (!archivo.endsWith('.md')) continue
      const tema = archivo.slice(0, -3)
      redirecciones[`/teoria/${seccion.name}-${tema}`] = `/teoria/${seccion.name}/${tema}`
    }
  }
  return redirecciones
}

/**
 * Búsqueda con Pagefind: al terminar el build indexa el HTML generado y escribe el índice en `/pagefind/`.
 * Solo se indexa lo marcado con `data-pagefind-body` (el título y el contenido de cada doc de teoría).
 * En `npm run dev` no hay índice: el buscador avisa que la búsqueda funciona tras `npm run build`.
 */
function busquedaPagefind() {
  return {
    name: 'busqueda-pagefind',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const ruta = fileURLToPath(dir)
        const { index, errors } = await pagefind.createIndex({
          // - Las fórmulas de KaTeX se repiten en HTML y MathML y ensucian los extractos.
          // - Los bloques de código dan extractos ilegibles, y con la tolerancia a errores de Pagefind
          //   una búsqueda sin coincidencias acababa "encontrando" variables de una letra (x, i, n).
          excludeSelectors: ['.katex', 'pre'],
        })
        if (!index) throw new Error(`Pagefind: ${errors.join(', ')}`)
        const { page_count } = await index.addDirectory({ path: ruta })
        await index.writeFiles({ outputPath: `${ruta}/pagefind` })
        await pagefind.close()
        logger.info(`Pagefind indexó ${page_count} páginas`)
      },
    },
  }
}

// https://astro.build/config
export default defineConfig({
  redirects: redireccionesUrlsViejas(),

  // Al pasar el cursor (o tocar) un enlace interno se descarga la página antes del clic
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  vite: {
    plugins: [tailwindcss()]
  },

  markdown: {
    remarkPlugins: [remarkMath, remarkCallouts],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'dracula',
      // themes: {
      //   light: 'github-light',
      //   dark: 'github-dark',
      // }
    },
  },

  adapter: vercel(),
  integrations: [icon(), busquedaPagefind()]
});