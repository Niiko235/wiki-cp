export const NIVELES = ['Bronce', 'Plata', 'Oro'] as const
export type Nivel = (typeof NIVELES)[number]

export const descripcionNivel: Record<Nivel, string> = {
    Bronce: 'Problemas de entrada, ideales para entender la técnica',
    Plata: 'Problemas intermedios',
    Oro: 'Problemas avanzados',
}

// Las clases van escritas completas (sin interpolar) para que Tailwind las detecte.
//   badge → fondo, borde y texto de la etiqueta del nivel
//   dot   → punto de color (usa el acento, que se ve en ambos temas)
//   borde → barra lateral de la tarjeta (acento)
export const estiloNivel: Record<Nivel, { badge: string; dot: string; borde: string }> = {
    Bronce: {
        badge: 'bg-bronce-bg border-bronce-border text-bronce-text',
        dot: 'bg-bronce-acento',
        borde: 'border-l-bronce-acento',
    },
    Plata: {
        badge: 'bg-plata-bg border-plata-border text-plata-text',
        dot: 'bg-plata-acento',
        borde: 'border-l-plata-acento',
    },
    Oro: {
        badge: 'bg-oro-bg border-oro-border text-oro-text',
        dot: 'bg-oro-acento',
        borde: 'border-l-oro-acento',
    },
}
