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


export const collections = {books}