---
autores : ["Juan Camilo Guzman"]
titulo : "Kruskal"
fechaEscrito: 2026-07-12
fechaUltimaActualizacion: 2026-09-05
complejidad: 'O(E \log E)'
prerequisitos: []
problemas: []
materialExtra: []
---

Una ciudad está compuesta por varios barrios y un conjunto de calles que podrían pavimentarse para conectarlos, cada una con un costo asociado. El presupuesto disponible es limitado, por lo que no es posible pavimentar todas las calles existentes. La necesidad, entonces, es la siguiente: seleccionar el conjunto de calles que conecte a todos los barrios entre sí, con el menor costo total posible, sin incluir conexiones adicionales que no sean necesarias para lograr esa conectividad.

Dos ejemplos permiten precisar qué significa esto. Si dos barrios ya están comunicados por un camino que pasa por otros barrios, pavimentar una calle directa adicional entre ellos no mejora la conectividad de la ciudad: un conductor que necesite ir de uno al otro simplemente tomaría la vía existente, aunque implique un rodeo; esa calle adicional sería un gasto sin beneficio. En cambio, si un barrio no cuenta con ninguna calle pavimentada que lo una al resto, ningún conductor podría llegar hasta él sin importar cuántas otras calles existan; esa conexión sí es indispensable.

Kruskal es un algoritmo que resuelve esta necesidad de forma directa: en cada paso selecciona la calle disponible de menor costo, y la descarta únicamente si los dos barrios que conecta ya están comunicados por otra vía. A continuación se desarrolla este proceso paso a paso con un ejemplo concreto.

## Traduciendo el problema a un grafo

Cada barrio es un **nodo**, y cada calle posible entre dos barrios es una **arista** con un peso (el costo de pavimentarla). Con eso, la ciudad completa es un grafo ponderado y no dirigido.

Lo que el alcalde necesita se llama un **Árbol de Expansión Mínima** (*Minimum Spanning Tree*, o MST): un subconjunto de aristas que...

* **Conecta** todos los nodos del grafo (se puede llegar de cualquier barrio a cualquier otro).
* **No tiene ciclos**: si los tuviera, alguna arista sobraría, porque ya existiría otra forma de conectar esos dos puntos.
* Tiene el **menor peso total posible** entre todas las formas de conectar el grafo.

De la segunda propiedad se deduce algo importante: si la ciudad tiene $V$ barrios, su MST siempre va a tener **exactamente $V - 1$ calles**. Ni una más, ni una menos.

## La idea de Kruskal

Kruskal ataca el problema de forma *greedy* (voraz): en cada paso toma la decisión que se ve mejor en ese momento, sin pensar en el futuro, confiando en que esa serie de decisiones locales lo va a llevar al óptimo global. Concretamente:

1. Ordenar **todas** las calles posibles de menor a mayor costo.
2. Recorrerlas en ese orden. Para cada una, preguntarse: *¿los dos barrios que conecta ya están conectados entre sí por calles que ya elegí?*
   * Si **no** están conectados: se pavimenta la calle (se agrega al MST).
   * Si **ya** están conectados: se descarta, porque agregarla solo formaría un ciclo y sería plata perdida.
3. Parar cuando ya se hayan agregado $V - 1$ calles (ahí la ciudad ya quedó completamente conectada).

La parte que suena difícil es el paso 2: para no recorrer todo el grafo cada vez que queremos saber si dos barrios ya están conectados, se usa una estructura de datos llamada **Union-Find** (o DSU). Ya llegaremos a ella, primero veamos el algoritmo en acción.

## El mapa de nuestra ciudad

Supongamos que nuestra ciudad tiene 5 barrios: **Centro**, **La Loma**, **El Puerto**, **Las Flores** y **San Judas**. Estas son todas las calles que se podrían pavimentar, con su costo (en cientos de millones de pesos):

<svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;width:100%;height:auto;background:#fafafa;border:1px solid #e5e7eb;border-radius:12px;padding:10px;display:block;margin:0 auto">
  <line x1="300" y1="70" x2="443" y2="174" stroke="#94a3b8" stroke-width="2"/>
  <line x1="443" y1="174" x2="388" y2="341" stroke="#94a3b8" stroke-width="2"/>
  <line x1="388" y1="341" x2="212" y2="341" stroke="#94a3b8" stroke-width="2"/>
  <line x1="212" y1="341" x2="157" y2="174" stroke="#94a3b8" stroke-width="2"/>
  <line x1="157" y1="174" x2="300" y2="70" stroke="#94a3b8" stroke-width="2"/>
  <line x1="300" y1="70" x2="388" y2="341" stroke="#94a3b8" stroke-width="2"/>
  <line x1="443" y1="174" x2="212" y2="341" stroke="#94a3b8" stroke-width="2"/>

  <g font-family="monospace" font-size="12" fill="#334155">
    <rect x="380" y="99" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="390" y="112" text-anchor="middle">4</text>
    <rect x="425" y="246" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="435" y="259" text-anchor="middle">3</text>
    <rect x="290" y="316" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="300" y="329" text-anchor="middle">6</text>
    <rect x="155" y="246" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="165" y="259" text-anchor="middle">2</text>
    <rect x="200" y="99" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="210" y="112" text-anchor="middle">5</text>
    <rect x="325" y="119" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="335" y="132" text-anchor="middle">1</text>
    <rect x="250" y="289" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="260" y="302" text-anchor="middle">7</text>
  </g>

  <g>
    <circle cx="300" cy="70" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="300" y="48" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">Centro</text>
    <circle cx="443" cy="174" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="460" y="179" text-anchor="start" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">La Loma</text>
    <circle cx="388" cy="341" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="400" y="366" text-anchor="start" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">El Puerto</text>
    <circle cx="212" cy="341" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="200" y="366" text-anchor="end" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">Las Flores</text>
    <circle cx="157" cy="174" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="140" y="179" text-anchor="end" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">San Judas</text>
  </g>
</svg>

Nótese que hay una calle diagonal, **Centro–El Puerto**, que resulta ser la más barata de todas (1) a pesar de no ser un lado "obvio" del mapa. Esto es justo lo que hace interesante al problema: la intuición geográfica no siempre coincide con la solución óptima.

Antes de aplicar el algoritmo, ordenamos todas las calles de menor a mayor costo:

| Calle                    | Costo |
|---------------------------|:-----:|
| Centro – El Puerto        |   1   |
| Las Flores – San Judas    |   2   |
| La Loma – El Puerto       |   3   |
| Centro – La Loma          |   4   |
| San Judas – Centro        |   5   |
| El Puerto – Las Flores    |   6   |
| La Loma – Las Flores      |   7   |

Con 5 barrios, sabemos que el MST va a tener exactamente **4 calles**.

## Recorriendo las calles, una por una

**Paso 1 y 2 — Centro–El Puerto (1) y Las Flores–San Judas (2).** Ninguna de las dos tiene todavía relación con la otra, así que ambas se aceptan sin problema:

<svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;width:100%;height:auto;background:#fafafa;border:1px solid #e5e7eb;border-radius:12px;padding:10px;display:block;margin:0 auto">
  <line x1="300" y1="70" x2="443" y2="174" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="443" y1="174" x2="388" y2="341" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="388" y1="341" x2="212" y2="341" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="212" y1="341" x2="157" y2="174" stroke="#16a34a" stroke-width="4"/>
  <line x1="157" y1="174" x2="300" y2="70" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="300" y1="70" x2="388" y2="341" stroke="#16a34a" stroke-width="4"/>
  <line x1="443" y1="174" x2="212" y2="341" stroke="#cbd5e1" stroke-width="2"/>

  <g font-family="monospace" font-size="12" fill="#334155">
    <rect x="380" y="99" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="390" y="112" text-anchor="middle">4</text>
    <rect x="425" y="246" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="435" y="259" text-anchor="middle">3</text>
    <rect x="290" y="316" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="300" y="329" text-anchor="middle">6</text>
    <rect x="155" y="246" width="20" height="18" rx="4" fill="#fff" stroke="#16a34a"/>
    <text x="165" y="259" text-anchor="middle" fill="#16a34a" font-weight="700">2</text>
    <rect x="200" y="99" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="210" y="112" text-anchor="middle">5</text>
    <rect x="325" y="119" width="20" height="18" rx="4" fill="#fff" stroke="#16a34a"/>
    <text x="335" y="132" text-anchor="middle" fill="#16a34a" font-weight="700">1</text>
    <rect x="250" y="289" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="260" y="302" text-anchor="middle">7</text>
  </g>

  <g>
    <circle cx="300" cy="70" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="300" y="48" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">Centro</text>
    <circle cx="443" cy="174" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="460" y="179" text-anchor="start" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">La Loma</text>
    <circle cx="388" cy="341" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="400" y="366" text-anchor="start" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">El Puerto</text>
    <circle cx="212" cy="341" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="200" y="366" text-anchor="end" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">Las Flores</text>
    <circle cx="157" cy="174" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="140" y="179" text-anchor="end" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">San Judas</text>
  </g>
</svg>

Ahora tenemos dos grupos de barrios ya conectados entre sí: **{Centro, El Puerto}** y **{Las Flores, San Judas}**. La Loma sigue sola.

**Paso 3 — La Loma–El Puerto (3).** La Loma no está conectada con El Puerto todavía, así que se acepta. Ahora La Loma se une al primer grupo: **{Centro, El Puerto, La Loma}**.

**Paso 4 — Centro–La Loma (4).** Aquí viene la parte clave: Centro y La Loma **ya están en el mismo grupo** (los conecta el camino Centro → El Puerto → La Loma). Pavimentar esta calle sería pagar 4 por una conexión que ya existe. Se descarta:

<svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;width:100%;height:auto;background:#fafafa;border:1px solid #e5e7eb;border-radius:12px;padding:10px;display:block;margin:0 auto">
  <line x1="300" y1="70" x2="443" y2="174" stroke="#e03131" stroke-width="3" stroke-dasharray="7,5"/>
  <line x1="443" y1="174" x2="388" y2="341" stroke="#16a34a" stroke-width="4"/>
  <line x1="388" y1="341" x2="212" y2="341" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="212" y1="341" x2="157" y2="174" stroke="#16a34a" stroke-width="4"/>
  <line x1="157" y1="174" x2="300" y2="70" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="300" y1="70" x2="388" y2="341" stroke="#16a34a" stroke-width="4"/>
  <line x1="443" y1="174" x2="212" y2="341" stroke="#cbd5e1" stroke-width="2"/>

  <g font-family="monospace" font-size="12" fill="#334155">
    <rect x="380" y="99" width="20" height="18" rx="4" fill="#fff" stroke="#e03131"/>
    <text x="390" y="112" text-anchor="middle" fill="#e03131" font-weight="700">4</text>
    <rect x="425" y="246" width="20" height="18" rx="4" fill="#fff" stroke="#16a34a"/>
    <text x="435" y="259" text-anchor="middle" fill="#16a34a" font-weight="700">3</text>
    <rect x="290" y="316" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="300" y="329" text-anchor="middle">6</text>
    <rect x="155" y="246" width="20" height="18" rx="4" fill="#fff" stroke="#16a34a"/>
    <text x="165" y="259" text-anchor="middle" fill="#16a34a" font-weight="700">2</text>
    <rect x="200" y="99" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="210" y="112" text-anchor="middle">5</text>
    <rect x="325" y="119" width="20" height="18" rx="4" fill="#fff" stroke="#16a34a"/>
    <text x="335" y="132" text-anchor="middle" fill="#16a34a" font-weight="700">1</text>
    <rect x="250" y="289" width="20" height="18" rx="4" fill="#fff" stroke="#cbd5e1"/>
    <text x="260" y="302" text-anchor="middle">7</text>
  </g>

  <g>
    <circle cx="300" cy="70" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="300" y="48" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">Centro</text>
    <circle cx="443" cy="174" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="460" y="179" text-anchor="start" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">La Loma</text>
    <circle cx="388" cy="341" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="400" y="366" text-anchor="start" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">El Puerto</text>
    <circle cx="212" cy="341" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="200" y="366" text-anchor="end" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">Las Flores</text>
    <circle cx="157" cy="174" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="140" y="179" text-anchor="end" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">San Judas</text>
  </g>
</svg>

**Paso 5 — San Judas–Centro (5).** San Judas (grupo {Las Flores, San Judas}) y Centro (grupo {Centro, El Puerto, La Loma}) están en grupos **distintos**. Se acepta, y con esto los dos grupos se fusionan en uno solo: ¡toda la ciudad queda conectada! Como ya tenemos las $V - 1 = 4$ calles que necesitábamos, el algoritmo termina aquí — ni siquiera hace falta revisar El Puerto–Las Flores (6) ni La Loma–Las Flores (7).

<svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;width:100%;height:auto;background:#fafafa;border:1px solid #e5e7eb;border-radius:12px;padding:10px;display:block;margin:0 auto">
  <line x1="300" y1="70" x2="443" y2="174" stroke="#e03131" stroke-width="2" stroke-dasharray="6,5" opacity="0.6"/>
  <line x1="443" y1="174" x2="388" y2="341" stroke="#16a34a" stroke-width="4"/>
  <line x1="388" y1="341" x2="212" y2="341" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="3,4"/>
  <line x1="212" y1="341" x2="157" y2="174" stroke="#16a34a" stroke-width="4"/>
  <line x1="157" y1="174" x2="300" y2="70" stroke="#16a34a" stroke-width="4"/>
  <line x1="300" y1="70" x2="388" y2="341" stroke="#16a34a" stroke-width="4"/>
  <line x1="443" y1="174" x2="212" y2="341" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="3,4"/>

  <g font-family="monospace" font-size="12" fill="#334155">
    <rect x="380" y="99" width="20" height="18" rx="4" fill="#fff" stroke="#e03131" opacity="0.7"/>
    <text x="390" y="112" text-anchor="middle" fill="#e03131" opacity="0.8">4</text>
    <rect x="425" y="246" width="20" height="18" rx="4" fill="#fff" stroke="#16a34a"/>
    <text x="435" y="259" text-anchor="middle" fill="#16a34a" font-weight="700">3</text>
    <rect x="290" y="316" width="20" height="18" rx="4" fill="#fff" stroke="#e2e8f0"/>
    <text x="300" y="329" text-anchor="middle" fill="#94a3b8">6</text>
    <rect x="155" y="246" width="20" height="18" rx="4" fill="#fff" stroke="#16a34a"/>
    <text x="165" y="259" text-anchor="middle" fill="#16a34a" font-weight="700">2</text>
    <rect x="200" y="99" width="20" height="18" rx="4" fill="#fff" stroke="#16a34a"/>
    <text x="210" y="112" text-anchor="middle" fill="#16a34a" font-weight="700">5</text>
    <rect x="325" y="119" width="20" height="18" rx="4" fill="#fff" stroke="#16a34a"/>
    <text x="335" y="132" text-anchor="middle" fill="#16a34a" font-weight="700">1</text>
    <rect x="250" y="289" width="20" height="18" rx="4" fill="#fff" stroke="#e2e8f0"/>
    <text x="260" y="302" text-anchor="middle" fill="#94a3b8">7</text>
  </g>

  <g>
    <circle cx="300" cy="70" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="300" y="48" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">Centro</text>
    <circle cx="443" cy="174" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="460" y="179" text-anchor="start" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">La Loma</text>
    <circle cx="388" cy="341" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="400" y="366" text-anchor="start" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">El Puerto</text>
    <circle cx="212" cy="341" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="200" y="366" text-anchor="end" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">Las Flores</text>
    <circle cx="157" cy="174" r="9" fill="#1e293b" stroke="#fff" stroke-width="2"/>
    <text x="140" y="179" text-anchor="end" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">San Judas</text>
  </g>

  <text x="300" y="425" text-anchor="middle" font-size="15" font-weight="700" fill="#16a34a" font-family="sans-serif">Costo total del MST: 1 + 2 + 3 + 5 = 11</text>
</svg>

Con solo 11 (de un total de 28 si se pavimentaran todas las calles) el alcalde conecta toda la ciudad. Nótese algo importante: el MST terminó siendo el camino **San Judas – Las Flores – El Puerto – Centro – La Loma**, y usó la calle diagonal más barata (Centro–El Puerto) en lugar de varios lados "obvios" del mapa. Kruskal no tiene ninguna noción de geografía: solo le importa el costo.

## ¿Cómo sabemos rápido si dos barrios ya están conectados? — Union-Find (DSU)

En el paso 4 dijimos, casi de pasada, que "Centro y La Loma ya están en el mismo grupo". Pero, ¿cómo lo sabemos sin recorrer todo el grafo con un DFS o BFS cada vez que evaluamos una calle? Si hiciéramos eso, con $E$ calles el algoritmo se volvería $O(E \cdot V)$, lento para grafos grandes.

La solución es una estructura llamada **Disjoint Set Union** (DSU) o **Union-Find**, que mantiene los barrios agrupados en conjuntos y responde dos preguntas muy rápido:

* `find(x)`: ¿cuál es el **líder** (representante) del grupo al que pertenece el barrio `x`?
* `union(x, y)`: **fusiona** el grupo de `x` con el de `y`.

Dos barrios están conectados si y solo si `find(x) == find(y)`. Internamente, cada barrio apunta a un "padre", y seguir esos punteros hasta encontrar un barrio que es padre de sí mismo nos da el líder del grupo. Al principio, cada barrio es su propio líder (grupos de tamaño 1).

Dos trucos hacen que esto sea casi instantáneo:

* **Unión por tamaño**: al fusionar dos grupos, el grupo más pequeño cuelga del más grande, para que los árboles de punteros no crezcan mucho de alto.
* **Compresión de camino**: cada vez que hacemos `find(x)`, aprovechamos para hacer que `x` (y todos los que visitamos en el camino) apunten directamente al líder, aplanando el árbol para la próxima vez.

Con estos dos trucos, cada operación termina costando prácticamente $O(1)$ en la práctica (formalmente, $O(\alpha(V))$, donde $\alpha$ es la función inversa de Ackermann — crece tan lento que para cualquier $V$ que exista en la práctica es $\le 4$).

Si simulamos el DSU con nuestro ejemplo de la ciudad (usando unión por tamaño), así queda la estructura de punteros justo después del paso 5, cuando ya se armó el MST completo:

<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;width:100%;height:auto;background:#fafafa;border:1px solid #e5e7eb;border-radius:12px;padding:10px;display:block;margin:0 auto">
  <defs>
    <marker id="flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#475569"/>
    </marker>
  </defs>

  <line x1="150" y1="145" x2="292" y2="60" stroke="#475569" stroke-width="2" marker-end="url(#flecha)"/>
  <line x1="300" y1="145" x2="300" y2="60" stroke="#475569" stroke-width="2" marker-end="url(#flecha)"/>
  <line x1="450" y1="145" x2="308" y2="60" stroke="#475569" stroke-width="2" marker-end="url(#flecha)"/>
  <line x1="450" y1="245" x2="450" y2="155" stroke="#475569" stroke-width="2" marker-end="url(#flecha)"/>

  <circle cx="300" cy="50" r="10" fill="#16a34a" stroke="#fff" stroke-width="2"/>
  <text x="300" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="#16a34a" font-family="sans-serif">Centro (líder)</text>

  <circle cx="150" cy="150" r="10" fill="#1e293b" stroke="#fff" stroke-width="2"/>
  <text x="150" y="172" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">El Puerto</text>

  <circle cx="300" cy="150" r="10" fill="#1e293b" stroke="#fff" stroke-width="2"/>
  <text x="300" y="172" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">La Loma</text>

  <circle cx="450" cy="150" r="10" fill="#1e293b" stroke="#fff" stroke-width="2"/>
  <text x="450" y="172" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">Las Flores</text>

  <circle cx="450" cy="250" r="10" fill="#1e293b" stroke="#fff" stroke-width="2"/>
  <text x="450" y="272" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b" font-family="sans-serif">San Judas</text>
</svg>

Cada flecha es un puntero "mi padre es...". Todo el mundo termina llegando a **Centro**, el líder final del único grupo que queda. **Ojo:** este árbol de punteros es solo la contabilidad interna del algoritmo — no tiene nada que ver con la forma del MST que dibujamos antes. Son dos árboles completamente distintos que existen por razones distintas, y es un error común confundirlos.

## Complejidad

$$
\underbrace{O(E \log E)}_{\text{ordenar las calles}} \;+\; \underbrace{O(E \cdot \alpha(V))}_{\text{operaciones de union-find}} \;=\; O(E \log E)
$$

El ordenamiento inicial de las aristas domina la complejidad total, ya que las operaciones del DSU son casi constantes. Como en cualquier grafo simple $E \le V^2$, también es común ver esto escrito como $O(E \log V)$ — son equivalentes en orden de magnitud.

## Implementación en C++

```cpp
struct DSU {
  vi padre, tam;

  DSU(int n) {
    padre.resize(n);
    tam.assign(n, 1);
    for (int i = 0; i < n; i++) padre[i] = i;
  }

  int find(int x) {
    if (padre[x] == x) return x;
    return padre[x] = find(padre[x]); // compresión de camino
  }

  bool unite(int a, int b) {
    a = find(a);
    b = find(b);
    if (a == b) return false; // ya estaban conectados -> formaría un ciclo

    if (tam[a] < tam[b]) swap(a, b); // unión por tamaño
    padre[b] = a;
    tam[a] += tam[b];
    return true;
  }
};

struct Arista {
  int u, v, peso;
};

ll kruskal(int n, vector<Arista> &aristas) {
  sort(aristas.begin(), aristas.end(), [](Arista &a, Arista &b) {
    return a.peso < b.peso;
  });

  DSU dsu(n);
  ll costoTotal = 0;
  int aristasUsadas = 0;

  for (auto &a : aristas) {
    if (dsu.unite(a.u, a.v)) {
      costoTotal += a.peso;
      aristasUsadas++;
      if (aristasUsadas == n - 1) break; // el MST ya quedó completo
    }
  }

  return costoTotal;
}
```

El patrón siempre es el mismo: **ordenar** + **DSU para detectar ciclos**. Si en algún problema te piden explícitamente el conjunto de aristas del MST (y no solo el costo), basta con guardar cada `Arista` que pasa el `if`.

## Fuentes y para profundizar

Este artículo se inspiró en dos explicaciones muy buenas de Kruskal, recomendadas si quieres ver el algoritmo desde otro ángulo:

* [Kruskal's Algorithm - Minimum Spanning Tree (Yumin Lee)](https://yuminlee2.medium.com/kruskals-algorithm-minimum-spanning-tree-db96e91d0aed)
* [Minimum spanning tree - Kruskal with Disjoint Set Union (cp-algorithms)](https://cp-algorithms.com/graph/mst_kruskal_with_dsu.html)
