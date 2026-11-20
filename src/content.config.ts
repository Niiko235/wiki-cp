import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders"; 
import {z} from 'astro/zod'

const books = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/books" }),
    schema: z.object({
        title: z.string(),
        author: z.string(),
    })
})


const teoria = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/teorias" }),
    schema: z.object({
        title: z.string(),
        author: z.string(),
    })
})

const teorias = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/teorias" }),
    schema: z.object({
        autores: z.array(z.string()),
        titulo: z.string(),
        fechaEscrito: z.date(), // 2024-03-15
        fechaUltimaActualizacion: z.date(),
        complejidad: z.string(),
        // Temas de la wiki que conviene leer antes, por su ubicación: [grafos/kruskal, flujos/flujo-maximo].
        // El título y la URL salen del tema referenciado; si la ubicación no existe, el build falla.
        prerequisitos: z.array(reference('teorias')).default([]),
         problemas: z.array(z.object({
            nombrePlataforma: z.string(),
            nombreProblema: z.string(),
            nivelProblema: z.enum(['Bronce', 'Plata', 'Oro']),
            urlProblema: z.string(),
        })),
        materialExtra: z.array(z.object({
            nombreMaterialExtra: z.string(),
            tipoMaterialExtra: z.enum(['Video', 'Doc', 'Libro', 'Otro']),
            urlMaterialExtra: z.string()

        }))

    })
})




export const collections = {books, teorias}