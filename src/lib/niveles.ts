export const NIVELES = ['Bronce', 'Plata', 'Oro'] as const
export type Nivel = (typeof NIVELES)[number]

export const descripcionNivel: Record<Nivel, string> = {
    Bronce: 'Problemas de entrada, ideales para entender la técnica',
    Plata: 'Problemas intermedios',
    Oro: 'Problemas avanzados',
}

// Las clases van escritas completas (sin interpolar) para que Tailwind las detecte.
export const estiloNivel: Record<Nivel, { badge: string; dot: string; borde: string }> = {
    Bronce: {
        badge: 'bg-bronce-bg border-bronce-border text-bronce-text',
        dot: 'bg-bronce-border',
        borde: 'border-l-bronce-border',
    },
    Plata: {
        badge: 'bg-plata-bg border-plata-border text-plata-text',
        dot: 'bg-plata-border',
        borde: 'border-l-plata-border',
    },
    Oro: {
        badge: 'bg-oro-bg border-oro-border text-oro-text',
        dot: 'bg-oro-border',
        borde: 'border-l-oro-border',
    },
}
