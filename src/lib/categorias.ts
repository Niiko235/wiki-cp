// Fuente única de las categorías de la wiki.
//
// El `slug` es el nombre de la carpeta de la sección: los docs viven en src/content/teorias/<slug>/<tema>.md,
// la URL es /teoria/<slug>/<tema> y las imágenes van en src/assets/imgs/<slug>/<tema>/.
// El orden de esta lista es el orden del sidebar.
//
// Para agregar una categoría:
//   1) agrégala aquí, en el lugar que le corresponda;
//   2) define sus 3 colores en src/styles/global.css: --<slug>-text, --<slug>-bg y --<slug>-border.

export const CATEGORIAS = [
    { slug: 'introduccion', nombre: 'Introducción' },
    { slug: 'inicial', nombre: 'Técnicas básicas' },
    { slug: 'matematicas', nombre: 'Matemáticas' },
    { slug: 'bits', nombre: 'Bits' },
    { slug: 'dp', nombre: 'DP' },
    { slug: 'estructuras', nombre: 'Estructuras de datos' },
    { slug: 'grafos', nombre: 'Grafos' },
    { slug: 'strings', nombre: 'Strings' },
    { slug: 'flujos', nombre: 'Flujos' },
    { slug: 'geometria', nombre: 'Geometría' },
] as const

export type CategoriaSlug = (typeof CATEGORIAS)[number]['slug']

const validas = CATEGORIAS.map(c => c.slug).join(', ')

// Busca una categoría por su slug. `orden` es su posición en CATEGORIAS.
export function categoriaPorSlug(slug: string) {
    const i = CATEGORIAS.findIndex(c => c.slug === slug)
    if (i === -1) {
        throw new Error(`Categoría desconocida "${slug}". Las válidas son: ${validas}. Agrégala en src/lib/categorias.ts.`)
    }
    return { ...CATEGORIAS[i], orden: i }
}

// Categoría de un doc a partir de su id (su ruta dentro de src/content/teorias): "grafos/kruskal" → grafos.
// Si el doc no está en la carpeta de una categoría válida, el build falla con un mensaje claro.
export function categoriaDe(idDoc: string) {
    const [carpeta, ...resto] = idDoc.split('/')
    const i = CATEGORIAS.findIndex(c => c.slug === carpeta)
    if (resto.length === 0 || i === -1) {
        throw new Error(
            `El doc "src/content/teorias/${idDoc}.md" debe estar dentro de la carpeta de una sección ` +
            `(src/content/teorias/<seccion>/<tema>.md). Secciones válidas: ${validas}.`
        )
    }
    return { ...CATEGORIAS[i], orden: i }
}

// Variables CSS del color de una categoría. Se usa junto con la clase `chip-cat` (global.css):
//   <span class="chip-cat border ..." style={estiloCategoria('grafos')}>
export function estiloCategoria(slug: CategoriaSlug) {
    return `--cat-text:var(--${slug}-text);--cat-bg:var(--${slug}-bg);--cat-border:var(--${slug}-border)`
}
