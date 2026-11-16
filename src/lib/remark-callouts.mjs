/**
 * Callouts (cajas de aviso) para los docs, con la sintaxis de las alertas de GitHub:
 *
 *   > [!NOTA]
 *   > El texto de la nota.
 *
 *   > [!CUIDADO] Desbordamiento con int
 *   > Si sumas muchos pesos, usa long long.
 *
 * Tipos: NOTA, TIP, IMPORTANTE, CUIDADO. También se aceptan los nombres en inglés de GitHub
 * (NOTE, TIP, IMPORTANT, WARNING, CAUTION), que además se ven como alerta al abrir el .md en GitHub.
 * El texto que sigue a `[!TIPO]` en la misma línea reemplaza el título por defecto.
 * Un blockquote sin `[!TIPO]` sigue siendo una cita normal.
 */

const TIPOS = {
    nota: 'Nota',
    tip: 'Tip',
    importante: 'Importante',
    cuidado: 'Cuidado',
}

const ALIAS = {
    note: 'nota',
    consejo: 'tip',
    important: 'importante',
    warning: 'cuidado',
    caution: 'cuidado',
    advertencia: 'cuidado',
}

const MARCA = /^\[!([A-Za-zÁÉÍÓÚáéíóú]+)\][ \t]*([^\n]*)\n?/

function recorrer(nodo, visitar) {
    visitar(nodo)
    for (const hijo of nodo.children ?? []) recorrer(hijo, visitar)
}

export default function remarkCallouts() {
    return (arbol, archivo) => {
        recorrer(arbol, (nodo) => {
            if (nodo.type !== 'blockquote') return
            const parrafo = nodo.children[0]
            const texto = parrafo?.type === 'paragraph' ? parrafo.children[0] : null
            if (texto?.type !== 'text') return

            const m = texto.value.match(MARCA)
            if (!m) return
            const nombre = m[1].toLowerCase()
            const tipo = TIPOS[nombre] ? nombre : ALIAS[nombre]
            if (!tipo) {
                archivo.message(`Callout desconocido "[!${m[1]}]". Usa NOTA, TIP, IMPORTANTE o CUIDADO.`, nodo)
                return
            }

            // Quita la marca; si el párrafo queda vacío (la marca iba sola en su línea), se elimina
            texto.value = texto.value.slice(m[0].length)
            if (texto.value === '') parrafo.children.shift()
            if (parrafo.children.length === 0) nodo.children.shift()

            nodo.data = {
                hName: 'aside',
                hProperties: { className: ['callout', `callout-${tipo}`], role: 'note' },
            }
            nodo.children.unshift({
                type: 'paragraph',
                data: { hProperties: { className: ['callout-titulo'] } },
                children: [{ type: 'text', value: m[2].trim() || TIPOS[tipo] }],
            })
        })
    }
}
