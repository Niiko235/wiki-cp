// Optimiza los PNG de los docs (diagramas de Excalidraw, capturas) sin que se note el cambio.
//
// Uso:
//   npm run optimizar-imagenes                 # optimiza todo src/assets/imgs (y subcarpetas)
//   npm run optimizar-imagenes -- --dry        # solo muestra cuánto se ahorraría, sin escribir
//   npm run optimizar-imagenes -- ruta/carpeta # otra carpeta
//
// Qué hace con cada PNG:
//   1. Si ya es PNG con paleta, lo salta (ya fue optimizado; así el script es idempotente).
//   2. Prueba reducirlo a paleta de 256 colores. Solo lo acepta si la diferencia con el original
//      es imperceptible (ver UMBRALES). Los diagramas planos casi siempre lo cumplen.
//   3. Si la paleta se nota, usa compresión sin pérdida (píxeles idénticos).
//   4. Si ninguna opción lo hace más pequeño, no lo toca.
//
// OJO: reescribe los archivos en su lugar. Haz commit antes de correrlo, o usa --dry primero.
// `sharp` ya viene instalado con Astro.

import sharp from 'sharp'
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const args = process.argv.slice(2)
const dry = args.includes('--dry')
const raiz = args.find(a => !a.startsWith('--')) ?? 'src/assets/imgs'

// "Imperceptible": poquísimos píxeles cambian de forma visible y el error medio es mínimo.
const UMBRALES = {
    diferenciaVisible: 24,      // un píxel "cambió de forma visible" si algún canal difiere más que esto (0-255)
    maxFraccionVisible: 0.0015, // como mucho 0.15 % de los píxeles puede cambiar de forma visible
    maxErrorMedio: 0.6,         // error medio absoluto por canal (0-255)
}

function* pngs(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const ruta = join(dir, e.name)
        if (e.isDirectory()) yield* pngs(ruta)
        else if (e.name.toLowerCase().endsWith('.png')) yield ruta
    }
}

async function crudo(buf) {
    return sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
}

// Compara dos PNG píxel a píxel (RGBA).
async function diferencia(bufA, bufB) {
    const [a, b] = await Promise.all([crudo(bufA), crudo(bufB)])
    if (a.data.length !== b.data.length) return { fraccionVisible: 1, errorMedio: 255 }
    let suma = 0
    let visibles = 0
    for (let i = 0; i < a.data.length; i += 4) {
        let max = 0
        for (let c = 0; c < 4; c++) {
            const d = Math.abs(a.data[i + c] - b.data[i + c])
            suma += d
            if (d > max) max = d
        }
        if (max > UMBRALES.diferenciaVisible) visibles++
    }
    return {
        fraccionVisible: visibles / (a.data.length / 4),
        errorMedio: suma / a.data.length,
    }
}

const kb = n => `${(n / 1024).toFixed(0)} KB`
let antes = 0
let despues = 0
const resumen = { paleta: 0, sinPerdida: 0, intacto: 0, yaOptimizado: 0 }
const peores = []

for (const ruta of pngs(raiz)) {
    const original = readFileSync(ruta)
    antes += original.length
    const meta = await sharp(original).metadata()

    if (meta.isPalette) {
        resumen.yaOptimizado++
        despues += original.length
        continue
    }

    const paleta = await sharp(original).png({ palette: true, quality: 90, dither: 1.0 }).toBuffer()
    const dif = await diferencia(original, paleta)
    const paletaSirve =
        paleta.length < original.length &&
        dif.fraccionVisible <= UMBRALES.maxFraccionVisible &&
        dif.errorMedio <= UMBRALES.maxErrorMedio

    let elegido = original
    let metodo = 'intacto'
    if (paletaSirve) {
        elegido = paleta
        metodo = 'paleta'
    } else {
        const sinPerdida = await sharp(original).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer()
        if (sinPerdida.length < original.length) {
            elegido = sinPerdida
            metodo = 'sinPerdida'
        }
    }

    resumen[metodo]++
    despues += elegido.length
    peores.push({ ruta: relative(raiz, ruta), metodo, ...dif, antes: original.length, despues: elegido.length })
    if (!dry && elegido !== original) writeFileSync(ruta, elegido)
}

peores.sort((x, y) => y.fraccionVisible - x.fraccionVisible)
console.log(`${dry ? '[--dry, no se escribió nada] ' : ''}Carpeta: ${raiz}`)
console.log(`Paleta: ${resumen.paleta} | sin pérdida: ${resumen.sinPerdida} | intactos: ${resumen.intacto} | ya optimizados: ${resumen.yaOptimizado}`)
console.log(`Peso total: ${kb(antes)} → ${kb(despues)} (${((100 * despues) / antes).toFixed(0)} %)`)
console.log('\nLos 6 con más píxeles cambiados (con paleta de 256 colores):')
for (const p of peores.slice(0, 6)) {
    console.log(
        `  ${p.ruta.padEnd(62)} visibles ${(p.fraccionVisible * 100).toFixed(3)} %  error medio ${p.errorMedio.toFixed(2)}  → ${p.metodo} (${kb(p.antes)} → ${kb(p.despues)})`
    )
}
