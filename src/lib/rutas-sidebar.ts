import { categoriaPorSlug } from './categorias'

type rutasType = {
    categoria: string, // slug de una categoría de src/lib/categorias.ts (de ahí salen el nombre y el orden)
    contenido: {
        nombreContenido: string,
        slugContenido: string; // nombre del .md dentro de la carpeta de la categoría (sin .md)
    }[]
}[]


export const rutas : rutasType = [
{
    categoria: 'introduccion',
    contenido: [
        {nombreContenido: "Bienvenida", slugContenido: "bienvenida"},
    ]
    

},
{
    categoria: 'inicial',
    contenido: [
        {nombreContenido: "Estructura de datos Queue", slugContenido: "queue"},
    ]
},
// {
//     nombreCategoria: "Tiempo de complejidad",
//     contenido: []

// },
// {
//     nombreCategoria: "Ordenamiento",
//     contenido: []

// },
// {
//     nombreCategoria: "Manipulación de bits",
//     contenido: []

// },
// {
//     nombreCategoria: "Algoritmos voraz",
//     contenido: []
// },
{
    categoria: 'estructuras',
    contenido: [
        {nombreContenido: "Segment tree", slugContenido: "segment-tree"},
        {nombreContenido: "Algoritmo de MO'S", slugContenido: "mos"},
        
    ]
},
// {
//     nombreCategoria: "Programación dinamica",
//     contenido: []
// },
{
    categoria: 'grafos',
    contenido: [
        {nombreContenido: "Kruskal", slugContenido: "kruskal"}
    ]
},
{
    categoria: 'flujos',
    contenido: [
        {nombreContenido: "Flujo maximo", slugContenido: "flujo-maximo"},
        {nombreContenido: "Bipartito maximo", slugContenido: "matching-bipartito"},
    ]
},
{
    categoria: 'strings',
    contenido: [
        {nombreContenido: "Arreglo LPS", slugContenido: "lps"},
        {nombreContenido: "Algoritmo de KMP", slugContenido: "kmp"},
        {nombreContenido: "Algoritmo de Z", slugContenido: "z"},
     ]
 },
// {
//     nombreCategoria: "Matemáticas",
//     contenido: []
// },
{
    categoria: 'geometria',
    contenido: [
        {nombreContenido: "Representación de puntos y vectores de 2d", slugContenido: "representacion-punto-vector-2d"},
        {nombreContenido: "Convex Hull", slugContenido: "convex-hull"},
    ]
},
]


// export const rutas : rutasType = [
// {
//     nombreCategoria: "Estructuras",
//     contenido: [{
//         nombreContenido: "Segment Tree",
//         slugContenido: "segment-tree"
//     }]

// },
// {
//     nombreCategoria: "Strings",
//     contenido: [
//         { nombreContenido: "Trie", slugContenido: "trie" },
//         { nombreContenido: "String Hashing", slugContenido: "string-hashing" },
//         { nombreContenido: "Algoritmo de Booth afdsfasdlkfjasdlkfjasdljfl;kasdjfl;asdjfkljasdlkfalsdjfljasdflkalka", slugContenido: "algoritmo-de-booth" },
//         { nombreContenido: "Algoritmo Z", slugContenido: "algoritmo-z" },
//         { nombreContenido: "Knuth-Morris-Pratt (KMP)", slugContenido: "kmp" },
//         { nombreContenido: "Rabin Karp", slugContenido: "rabin-karp" },
//         { nombreContenido: "Algoritmo de Manacher", slugContenido: "algoritmo-de-manacher" },
//         { nombreContenido: "Bitwise Trie", slugContenido: "bitwise-trie" },
//         { nombreContenido: "Huffman", slugContenido: "huffman" },
//         { nombreContenido: "Autómata de Aho-Corasick", slugContenido: "aho-corasick" },
//         { nombreContenido: "Factorización de Lyndon", slugContenido: "factorizacion-de-lyndon" },
//         { nombreContenido: "Palindromic Tree", slugContenido: "palindromic-tree" },
//         { nombreContenido: "Suffix Array y LCP", slugContenido: "suffix-array-lcp" },
//         { nombreContenido: "Suffix Tree (Ukkonen)", slugContenido: "suffix-tree" },
//         { nombreContenido: "Suffix Automaton", slugContenido: "suffix-automaton" },
//         { nombreContenido: "Algoritmo de Main-Lorentz", slugContenido: "algoritmo-de-main-lorentz" }
//     ]
// },
// {
//     nombreCategoria: "Flujos",
//     contenido: [
//         // 1. Fundamentos y Conceptos Base
//         { nombreContenido: "Introducción a Flujos y Cortes", slugContenido: "introduccion-a-flujos-y-cortes" },
//         { nombreContenido: "Ford-Fulkerson y Dinic", slugContenido: "ford-fulkerson-y-dinic" },
//         { nombreContenido: "Disjoint Paths", slugContenido: "disjoint-paths" },

//         // 2. Emparejamientos y Coberturas (Reducciones clásicas)
//         { nombreContenido: "Matching Bipartito (Hopcroft-Karp)", slugContenido: "matching-bipartito-hopcroft-karp" },
//         { nombreContenido: "Path Covers", slugContenido: "path-covers" },
//         { nombreContenido: "Matching General (Blossom)", slugContenido: "matching-general-blossom" },
//         { nombreContenido: "Matching con Pesos (Húngaro)", slugContenido: "matching-con-pesos-hungaro" },

//         // 3. Flujo Máximo con Costo Mínimo (Avanzado)
//         { nombreContenido: "Min-Cost Max-Flow", slugContenido: "min-cost-max-flow" }
//     ]
// }
// ]




// ─────────────────────────────────────────────────────────────────────────────
// Orden del temario: una sola fuente para el sidebar y los botones Anterior / Siguiente.
// Secciones en el orden de src/lib/categorias.ts; dentro de cada sección, en el orden de `rutas` (arriba).
// Para mover un tema de lugar basta con moverlo en `rutas`.


export type TemaDelTemario = {
    id: string        // "grafos/kruskal": ubicación del .md dentro de src/content/teorias
    href: string      // "/teoria/grafos/kruskal"
    nombre: string    // nombre corto que muestra el sidebar
    seccion: string   // nombre de la sección ("Grafos")
}

// Secciones con sus temas, ya ordenadas. categoriaPorSlug falla en el build si un slug no existe.
export const gruposDelTemario = rutas
    .map(ruta => ({ ...ruta, cat: categoriaPorSlug(ruta.categoria) }))
    .sort((a, b) => a.cat.orden - b.cat.orden)

// Todos los temas en una sola lista, en el orden en que se leen.
export const temario: TemaDelTemario[] = gruposDelTemario.flatMap(grupo =>
    grupo.contenido.map(tema => ({
        id: `${grupo.categoria}/${tema.slugContenido}`,
        href: `/teoria/${grupo.categoria}/${tema.slugContenido}`,
        nombre: tema.nombreContenido,
        seccion: grupo.cat.nombre,
    }))
)

// Tema anterior y siguiente de un doc según el temario (null en los extremos o si no está en el temario).
export function vecinosEnTemario(id: string) {
    const i = temario.findIndex(tema => tema.id === id)
    if (i === -1) return { anterior: null, siguiente: null }
    return { anterior: temario[i - 1] ?? null, siguiente: temario[i + 1] ?? null }
}
