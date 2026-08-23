import { defineCollection} from "astro:content";
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
        prerequisitos: z.array(z.object({
            nombreTema: z.string(),
            ulrTema: z.string()
        })),
         problemas: z.array(z.object({
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