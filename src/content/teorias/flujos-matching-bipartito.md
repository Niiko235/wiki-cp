---
autores: ["Nicolas Plaza"]
titulo: "Emparejamiento Bipartito Máximo"
fechaEscrito: 2026-08-28
fechaUltimaActualizacion: 2026-09-04
complejidad: '\mathcal{O}(E \cdot V)'
prerequisitos: []
problemas: []
materialExtra: []
---

## Planteamiento del problema 

Supongamos que tenemos un grupo de $n$ estudiantes que quieren asistir a ciertos cursos intensivos dependiendo de sus gustos y las materias que les faltan por ver. Por temas de política de la universidad, los cursos intensivos son 1 a 1; es decir, cada curso intensivo está dirigido a un solo estudiante y solo hay un cupo por curso. Para este ejemplo, tendremos 2 estudiantes y 3 cursos ofertados: para el caso del primer estudiante, este está interesado en los 3 cursos. Por otro lado, el segundo estudiante esta interesando solo en el primer curso ofertado.

![Grafo bipartito que representa a estudiantes a la izquierda y cursos a la derecha. Las aristas dirigidas son la relación de los estudiantes con los cursos de su interés.](../../../public/teoria/flujos/mcbm/mbm-1.png)

La universidad te pide ayuda para desarrollar un programa que logre emparejar a la mayor cantidad posible de estudiantes con sus cursos de interés. ¿Qué harías para lograrlo?

Podríamos intentar modelarlo como un algoritmo de flujo máximo, ya que sería lo primero que uno pensaría al leer sobre estos temas. Colocaríamos un nodo origen **$S$** conectado a todos los nodos del grupo de la izquierda (estudiantes), y un nodo sumidero **$T$** conectado a todos los nodos del grupo de la derecha (cursos).

![Grafo bipartito modelado como una red de flujo. Un nodo origen S de color verde se conecta a los nodos rojos de la izquierda, y los nodos azules de la derecha se conectan a un nodo sumidero T de color amarillo.](../../../public/teoria/flujos/mcbm/mbm-2.png)

Con un grafo de este tipo, se podrían colocar capacidades de 1 en todas las aristas y correr un algoritmo de flujo máximo. Pero, ¿qué pasa si queremos saber exactamente quién quedó emparejado con qué curso? Además, los algoritmos tradicionales de flujo máximo pueden ser pesados, y en problemas de emparejamiento bipartito las cotas pueden ser muy altas, quebrando esta idea inicial. En el mejor de los casos, estaríamos hablando de una complejidad de $\mathcal{O}(V^2 \cdot E)$.

Es por esto que la solución ideal para este problema son los algoritmos de aumento de camino, como el Algoritmo de Kuhn o el Algoritmo de Hopcroft-Karp.

## Definición

Un **grafo bipartito** es simplemente un grafo que se puede dividir en dos grupos completamente separados, teniendo en cuenta que: los elementos del mismo grupo no pueden conectarse entre sí. Todas las conexiones deben ir de un grupo hacia el otro. En nuestro ejemplo inicial, un grupo son los **estudiantes** y el otro grupo son los **cursos**. Las conexiones solo existen entre un estudiante y un curso, NO es posible conectar estudiantes entre si o cursos entre si.

![Inicio del algoritmo. El nodo libre 1 se empareja con el nodo libre 3, representado con una flecha punteada de color naranja.](../../../public/teoria/flujos/mcbm/mbm-3.png)

Un **emparejamiento** (*matching*) es exactamente lo que suena: armar parejas entre los dos grupos asegurándonos de exclusividad. Es decir, un estudiante solo puede tomar un curso, y un curso solo puede ser asignado a un estudiante. Ningún elemento puede compartir pareja.

![Inicio del algoritmo. El nodo libre 1 se empareja con el nodo libre 3, representado con una flecha punteada de color naranja.](../../../public/teoria/flujos/mcbm/mbm-4.png)

El **Emparejamiento Bipartito Máximo** (MCBM por sus siglas en inglés) es el reto de encontrar la combinación perfecta para armar estas parejas, de modo que la **mayor cantidad posible** de estudiantes consiga un curso.

Para resolver este problema existen varios algoritmos:

- **Algoritmo de Kuhn:** $\mathcal{O}(E \cdot V)$ -> Se basa en búsquedas en profundidad (DFS).
- **Algoritmo de Hopcroft-Karp:** $\mathcal{O}(E \cdot \sqrt{V})$ -> Optimización del algoritmo de Kuhn que usa BFS y DFS combinados.
- **Algoritmo Húngaro:** $\mathcal{O}(V^3)$ -> Utilizado generalmente cuando las aristas tienen pesos.

Esta sección abarcará el algoritmo de **Kuhn**, que es la base fundamental para entender cómo resolver estos problemas mediante el aumento de caminos.

## Explicación (Algoritmo de Kuhn)

La idea del **aumento de camino** es que el algoritmo intentará asignar una pareja a cada nodo libre de la izquierda. Si la pareja deseada en la derecha ya está ocupada, el algoritmo usará recursividad (un DFS) para pedirle al nodo que la está ocupando que intente buscar otra opción.

Veamos cómo funciona esto en sintonía con el código. Arrancamos en el nodo 1 de la izquierda. Su primera arista apunta al nodo 3 de la derecha. Como el nodo 3 está libre (`partner[u] == -1`), los emparejamos directamente.

![Inicio del algoritmo. El nodo libre 1 se empareja con el nodo libre 3, representado con una flecha punteada de color naranja.](../../../public/teoria/flujos/mcbm/mbm-5.png)

Como el emparejamiento del nodo 1 fue exitoso, el ciclo avanza al siguiente nodo libre de la izquierda: el nodo 2. 

![El nodo 1 ya está emparejado con el 3. Se señala el nodo 2 con una flecha verde y el texto 'Buscando emparejamiento' para iniciar su proceso.](../../../public/teoria/flujos/mcbm/mbm-6.png)

El nodo 2 intenta emparejarse con su primera conexión disponible, que es el nodo 3. Sin embargo, el nodo 3 ya está emparejado con el nodo 1. Aquí es donde entra la magia de la función recursiva: el código evalúa `matching(partner[u])`.

![El nodo 2 intenta emparejarse con el nodo 3 trazando una línea verde continua, pero el nodo 3 ya forma parte de un emparejamiento previo.](../../../public/teoria/flujos/mcbm/mbm-7.png)

![Se destaca con una flecha que el nodo 3 'Ya tiene pareja'. El algoritmo evaluará si esta pareja actual puede ser reasignada.](../../../public/teoria/flujos/mcbm/mbm-8.png)

En lugar de rendirse, el algoritmo "salta" hacia atrás al nodo 1 (la pareja actual del nodo 3) para ver si puede encontrar un **camino de aumento**. Le pedimos al nodo 1 que busque otra opción disponible en su lista de adyacencia.

![El algoritmo retrocede al nodo 1 (la pareja actual del nodo 3), señalando con el texto 'Le buscamos otra pareja' para intentar liberar al nodo 3.](../../../public/teoria/flujos/mcbm/mbm-9.png)

El nodo 1 revisa su siguiente arista y encuentra al nodo 4. Como el nodo 4 está completamente libre, el nodo 1 lo toma como su nueva pareja.

![El nodo 1 explora sus otras conexiones y encuentra que el nodo 4 está libre, convirtiéndolo en su nueva pareja potencial.](../../../public/teoria/flujos/mcbm/mbm-10.png)

Al emparejarse el nodo 1 con el nodo 4, el vínculo anterior se rompe. 

![Se actualiza el estado del nodo 1. El texto indica 'Se le actualiza la pareja', deshaciendo su vínculo anterior con el 3.](../../../public/teoria/flujos/mcbm/mbm-11.png)

Como la llamada recursiva del nodo 1 retornó verdadero (`true`), el nodo 3 queda oficialmente liberado. El nodo 2, que estaba esperando esta respuesta, ahora puede reclamar al nodo 3 como su pareja.

![Al liberarse el nodo 3, se actualiza su estado para emparejarse exitosamente con el nodo 2, que fue el que inició esta búsqueda de aumento.](../../../public/teoria/flujos/mcbm/mbm-12.png)

De esta forma, logramos reacomodar las asignaciones para aumentar la respuesta total. Pasamos de tener un solo emparejamiento a tener dos, demostrando la eficiencia del camino de aumento.

![Resultado final que muestra 'Dos emparejamientos' logrados. Líneas punteadas naranjas conectan definitivamente al nodo 1 con el 4, y al nodo 2 con el 3, indicando que 'Se aumentó el camino'.](../../../public/teoria/flujos/mcbm/mbm-13.png)

## Casos de uso

Los casos de uso para este algoritmo son fascinantes. Muchos problemas que aparentemente no tienen nada que ver con grafos pueden modelarse como problemas de emparejamiento bipartito. Como recomienda Steven Halim en su libro *Competitive Programming*, vale la pena dedicar tiempo significativo a desarrollar el pensamiento abstracto necesario para identificar estas propiedades en los enunciados y lograr modelarlos correctamente.

## Código

```cpp
// Complexity: O(V * E)
// Para problemas con tiempos más ajustados o grafos más grandes, usar Hopcroft-Karp O(E * sqrt(V))

struct mbm {
  int l, r;
  vector<int> partner;          // Almacena la pareja izquierda del nodo derecho
  vector<bool> vs;              // Nodos visitados en la iteración actual del DFS
  vector<vector<int> > ady; 

  mbm(int l, int r) : l(l), r(r), partner(r), vs(l), ady(l) {}

  // Intenta encontrar un camino de aumento para el nodo v
  bool matching(int v) {
    if (vs[v]) return false;
    vs[v] = true;
    for (int &u : ady[v]) {
      // Si el nodo derecho 'u' está libre, O SI su pareja actual puede buscar otra opción
      if (partner[u] == -1 || matching(partner[u])) {
        partner[u] = v; // Se establece el emparejamiento
        return true;
      }
    }
    return false;
  }

  vector<pair<int, int> > go_matching() {   
    vector<pair<int, int> > ans;
    fill(all(partner), -1); // Inicialmente, ningún nodo derecho tiene pareja
    
    // Intentamos emparejar cada nodo de la izquierda
    forn (i, l) {
      fill(all(vs), false); // Reiniciamos los visitados para el DFS de cada nodo
      matching(i);
    }
    
    // Recopilamos las respuestas
    forn (i, r) {
      if (partner[i] != -1) {
        ans.pb({partner[i], i});
      }
    }
    return ans;
  }
};