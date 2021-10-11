# Consigna

## Sección 1

Implementar un servicio HTTP en Node.js-Express. Someter distintos tipos de endpoints a diversas intensidades/escenarios de carga en algunas configuraciones de deployment, tomar mediciones y analizar resultados.

A partir de este repositorio como punto inicial, van a tener que implementar el webserver y dockerizarlo (completar la carpeta `app/`), agregar los servicios con el webserver y una imagen provista por la cátedra al `docker-compose.yml`, y configurar las locations y upstreams de nginx en `nginx_reverse_proxy.conf`.

La imagen provista por la cátedra es `arqsoft/bbox:202102.1`. Se trata de una aplicación ("bbox") que provee 2 servicios, uno con comportamiento sincrónico y otro con comportamiento asincrónico. Se configura a través del archivo `/opt/bbox/config.properties`, que ustedes deberán mapear vía un volumen a un archivo en el equipo host (caso similar a la configuración de nginx que les da la cátedra).

Este archivo tiene 2 parámetros:

```INI
server.basePort=9090
group.key=
```

- **server.basePort**: Puerto base para que escuchen los servicios _en el container_. En el ejemplo, el 1er servicio escuchará en 9090 y el 2do en 9091.
- **group.key**: Cadena alfanumérica que identifica al grupo. Se recomienda que utilicen el nombre del grupo, aunque pueden usar cualquier cadena.

El archivo que utilicen **debe ser subido al repositorio**.

Para _probar manualmente_ la interacción con los servicios, tienen 2 opciones:

- Mapear los puertos al host: Deben asignar un puerto del host a cada puerto del container
- Pasar a través de nginx: Deben agregar los upstreams en la configuración de nginx

Luego, pueden enviar un GET a cualquier endpoint de cada servicio. Por ejemplo, si mapearon los puertos al host con la misma numeración que el archivo de configuración:

- `curl http://localhost:9090/` accederá al 1er servicio
- `curl http://localhost:9091/` accederá al 2do servicio

Si, en cambio, eligieron pasar a través de nginx, entonces deberán enviar un GET a las locations que hayan configurado.

Ambos servicios devuelven la cadena "Hello, world!".

Para generar carga y ver las mediciones obtenidas, en la carpeta `perf/` tienen un dashboard de Grafana ya armado (`dashboard.json`) y un ejemplo de un escenario básico de artillery (**deben** crear sus propios escenarios de manera apropiada para lo que estén probando). También hay un script y una configuración en el `package.json` para que puedan ejecutar los escenarios que hagan corriendo:

`npm run scenario <filename> <env>`

donde `<filename>` es el nombre del archivo con el escenario (sin la extensión `.yaml`) y `<env>` es el entorno en el cual correrá la prueba (vean la sección `environments` dentro del yaml del escenario).

### Tipos de endpoints para comparar los servidores

| Caso              | Implementado como                                                  | Representa                                                                                |
| ----------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | --- |
| Ping              | Respuesta de un valor constante (rápido y de procesamiento mínimo) | Healthcheck básico                                                                        |     |
| Proxy sincrónico  | Invocación a servicio sincrónico provisto por la cátedra.          | Aproximación a consumo de servicio real sincrónico.                                       |
| Proxy asincrónico | Invocación a servicio asincrónico provisto por la cátedra.         | Aproximación a consumo de servicio real asincrónico.                                      |
| Intensivo         | Loop de cierto tiempo (lento y de alto procesamiento)              | Cálculos pesados sobre los datos (ej: algoritmos pesados, o simplemente muchos cálculos). |

### Configuraciones de deployment

> **El tráfico entre cliente y servidor debe pasar por el nginx, para que tenga la latencia del salto "extra". No es necesario (aunque es posible) que bbox esté detrás del nginx cuando es accedido por la app Node.js**

#### Obligatorias

| Caso      | Explicación                                                            |
| --------- | ---------------------------------------------------------------------- |
| Un nodo   | Un solo proceso, un solo container.                                    |
| Replicado | Replicado en múltiples containers, con load balancing a nivel de nginx |

#### Opcionales

| Caso            | Explicación                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Multi-worker    | Para una o varias de las configuraciones obligatorias, pueden probar manejar más de un worker en cada container (usar siempre la misma cantidad). Vean el módulo `cluster` ([v12.x](https://nodejs.org/docs/latest-v12.x/api/cluster.html) o [v14.x](https://nodejs.org/docs/latest-v14.x/api/cluster.html))                                                                                                                                                      |
| Servidor remoto | Todos los casos anteriores suponen que el servidor corre en la misma computadora física que el cliente (generador de carga). Pueden probar montar uno o varios de ellos en otra computadora (otra en la misma casa, o un servidor en algún proveedor cloud) y comparar las métricas al "alejar" cliente de servidor. Consideren en el análisis también que las características de la computadora corriendo el servidor o el cliente pueden cambiar en esos casos. |
| ...             | ... pueden agregar otros casos que se les ocurran                                                                                                                                                                                                                                                                                                                                                                                                                 |

> Queda a cargo de cada grupo elegir qué configuraciones de deployment prueba bajo qué escenarios de carga.
> **Es preferible armar pocos casos y analizarlos lo más posible que juntar muchísima información y estudiar poco los
> resultados.** :warning:

### Generación de carga para las pruebas

Hay muchos tipos de escenarios de carga y pruebas de performance en general. Pueden leer por ejemplo [acá](https://www.softwaretestingclass.com/what-is-performance-testing/) (o en cualquiera de los miles de links al googlear sobre el tema) sobre algunos tipos de escenarios que pueden implementar. Queda a decisión de cada grupo elegir cuáles implementar, considerando siempre cuál es el que más útil les resulta para analizar lo que quieran estudiar.

### Documentación adicional

Deberán incorporar al informe una **vista Components & Connectors** para los distintos casos estudiados.

## Sección 2

### Aplicación

La aplicación utilizada en la sección 1, "bbox", posee ciertas características que deberán determinar. El trabajo realizado en la sección 1 debe despejar algunas de ellas, que podrán ser verificadas aquí, y se deberán determinar otras.

### Análisis y caracterización

Deberán caracterizar cada servicio mirando tres propiedades:

1. **Sincrónico / Asincrónico**: Uno de los servicios se comportará de manera sincrónica, y el otro de manera asincrónica. Deberán detectar de qué tipo es cada uno.
2. **Cantidad de workers (en el caso sincrónico)**: El servicio sincrónico está implementado con una cantidad de workers. Deberán buscar algún indicio sobre cuál es esta cantidad. El servicio asincrónico tiene una cantidad de event loops, que también podrían intentar calcular, aunque esto es bastante más difícil y les recomendamos hacerlo sólo si terminaron con el resto.
3. **Demora en responder**: Cada servicio demora un tiempo en responder, que puede ser igual o distinto entre ellos. Deberán obtener este valor para cada uno.

Las herramientas para este análisis son las mismas que usaron en la Sección 1. Deben generar carga que ponga en relieve las características de cada servicio, haciendo uso de gráficos para mostrar puntos interesantes de la prueba. Incluyan en el informe una descripción de la/s estrategia/s utilizada/s. Recomendamos, por claridad, agregar una tabla al final de la sección con los resultados para cada uno.

## Sección 3

### Opcional: Caso de estudio - Sistema de Inscripciones

Utilizando las herramientas y procedimientos de las secciones anteriores, les proponemos simular el comportamiento bajo carga de un sistema de inscripciones a materias (similar al SIU Guaraní).

Nos concentraremos en simular la inscripción a una o más materias. Desde el punto de vista del usuario, implica:

1. Iniciar sesión
2. Seleccionar una carrera
3. Inscribirse (_n_ veces)
   1. Ver la lista de materias en las que está inscripto
   2. Ver la lista de materias disponibles
   3. Inscribirse en una materia
4. Cerrar sesión

Para implementar este flujo, herramientas como Artillery (usando [scenarios](https://artillery.io/docs/script-reference/#scenarios)) o JMeter nos permiten simularlo.

Deberán establecer ciertas hipótesis respecto de las dimensiones del problema. Por ejemplo, cantidad de alumnos, cantidad de prioridades y su segmentación en franjas horarias, etc. También deberán modelar el tipo de comportamiento de cada endpoint, y jugar con los tiempos de demora que cada uno debería (razonablemente) tener.

Con el escenario planteado, generar la carga, graficar puntos interesantes y luego analizar el comportamiento que el sistema debería exhibir.
