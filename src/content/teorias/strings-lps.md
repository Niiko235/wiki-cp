---
autores: ["Santiago Hernandez"]
titulo: "Algoritmo de KMP"
fechaEscrito: 2026-08-28
fechaUltimaActualizacion: 2026-08-28
complejidad: O(n + m)
prerequisitos: []
problemas: []
materialExtra: []
---

## El problema: buscar un patrón "a las malas" es lento

Imagina que tienes un texto de 1,000,000 de caracteres y quieres encontrar todas las veces que aparece la palabra `ABABAC`. La forma más obvia es: en cada posición del texto, comparar letra por letra contra el patrón, y si algo falla, mover el texto una posición y volver a comparar desde el principio del patrón.

El problema es que ese "volver a comparar desde el principio" puede pasar millones de veces, y en el peor caso terminas haciendo O(n·m) comparaciones — con n y m grandes, eso es demasiado lento para competir.

La pregunta clave es: **cuando una comparación falla, ¿de verdad tengo que olvidarme de todo lo que ya había comparado y empezar desde cero?** La respuesta es no — y el arreglo de prefijo sufijo mas largo o por sus siglas en ingles **lps** (longets prefix suffix) es justo la estructura que te dice cuánto puedes reciclar en lugar de repetir.

## ¿Qué es el prefijo sufijo mas largo? (lps)
Imagina que vas leyendo una palabra letra por letra, y en cada punto te haces la misma pregunta: *"¿el pedacito con el que empieza esta palabra (el prefijo) se repite también al final de lo que llevo leído hasta ahora (el sufijo)?"* LPS (Longest Prefix Suffix) es justamente eso: un arreglo que, para cada posición del patrón, guarda cuánto coincide.

**Definición técnica:** `LPS[i]` es la longitud del **prefijo propio más largo** de la subcadena `patron[0..i]` que también es **sufijo propio** de esa misma subcadena. "Propio" significa que no contamos la cadena completa comparada consigo misma — solo pedazos estrictamente más cortos que ella.

Por ejemplo, para `ABAB`:

| i | subcadena | LPS[i] | por qué |
|---|-----------|--------|---------|
| 0 | A | 0 | cadena de una letra, no hay prefijo/sufijo propio posible |
| 1 | AB | 0 | prefijo `A` ≠ sufijo `B` |
| 2 | ABA | 1 | prefijo `A` = sufijo `A` |
| 3 | ABAB | 2 | prefijo `AB` = sufijo `AB` |

**¿Para qué sirve y por qué es importante?**
LPS es el motor detrás de KMP: cuando comparas el patrón contra un texto y hay un mismatch en la posición `i`, `LPS[i-1]` te dice cuántos caracteres del patrón ya sabes que coinciden con el texto sin necesidad de volver a compararlos. Gracias a eso, el puntero del texto **nunca retrocede** — solo se mueve el puntero del patrón — y por eso KMP corre en O(n + m) en vez de O(n·m).

Pero su importancia va más allá de KMP: la misma idea de "reutilizar lo que ya comparé para no repetir trabajo" reaparece en el Z-function (que se puede derivar directamente del LPS), en los *failure links* de Aho-Corasick (LPS generalizado a varios patrones sobre un trie), y en el cálculo del período mínimo de una cadena (`n - LPS[n-1]`). Por eso vale la pena entender el LPS a fondo antes de avanzar: no es un paso aislado, es la pieza que después vas a reciclar mentalmente en casi toda la teoría de strings.

## ¿Como se construye el arreglo LPS?
Para guardar todos los prefijos y sufijos mas largos de una cadena, utilizamos un arreglo para alamcenar la informacion, normalmente llamado LPS.
Declaramos dos variables que nos van a servir para **recorrer, consultar y guardar**.
### i: 
Va a ser mi variable que va a **recorre** la cadena de texto que representa mi patron y tambien para **guardar** la longitud de nuestro prefijo que a la vez es un sufijo y decir que hasta una subcadena de texto [0..i] tenemos un prefijo de tamaño **len**
### len:
Sera la variable que va a 

## Explicacion

No ponemos a i = 0 debido a que para una subcadena de una sola letra, el único prefijo propio y el único sufijo propio posibles son la cadena vacía (no hay espacio para nada más corto que el total menos 1 carácter). Por eso lps[0] es siempre 0, para cualquier patrón, sin excepción.
![](../../../public/teoria/kmp/arreglo-lps-momento-0.png)

Cadena AB no tiene ningun prefijo sufijo iguales, debido a los sufijos en esta parte es solo B y el prefijo es A el cual no son iguales
![](../../../public/teoria/kmp/arreglo-lps-momento-1.png)

Cadena ABA si tiene prefijos sufijos iguales, debido a que los sufijos en esta parte son: BA, A y los prefijos son: A, AB aqui hay dos iguales que son A, entonces esto lo ponemos en nuestro vvector lps q me dice q hasta esa parte de la cadena solo hay un prefijo sufijo de tamaño 1 que es A y A

![](../../../public/teoria/kmp/arreglo-lps-momento-2.png)


avanzamos len que me dice a mi si el siguiente prefijo q es AB tambien esta como sufijo en la cadena ABAB en este caso si, debido a los prefijos para esta cadena son:
A, AB, ABA
y los sufijos:
B, AB, BAB
aqui hay una coincidencia con AB que es el prefijo q estamos evaluando con len

![](../../../public/teoria/kmp/arreglo-lps-momento-3.png)


Aqui ya por intuicion sabemos cual es la cadena y su prefijo sufijo mas largo hasta ese momento

![](../../../public/teoria/kmp/arreglo-lps-momento-4.png)

![](../../../public/teoria/kmp/arrelo-lps-momento-5.png)

## Codigo

````cpp

#include <bits/stdc++.h>
using namespace std;

int main()
{
    string pattern = "ABABAC";
    int patter_size = pattern.size();
    vector<int> LPS(patter_size,0);
    
    int i = 1, len = 0;
    
    while(i < patter_size){
        if(pattern[i] == pattern[len]){
            len++;
            LPS[i] = len;
            i++;
        }
        else{
            if(len != 0){
                len = LPS[len - 1];
            }
            else{
                LPS[i] = 0;
                i++;
            }
        }
    }
    
    for(int i = 0; i < patter_size; i++){
        cout << pattern[i] << " : " << LPS[i] << endl;
    }

    return 0;
}
````
