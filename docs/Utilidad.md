# Links útiles

-   Nodejs:
    -   https://nodejs.org/
    -   https://github.com/creationix/nvm
    -   https://nodejs.org/dist/latest-v12.x/docs/api/ o https://nodejs.org/dist/latest-v14.x/docs/api/
-   Express:
    -   https://expressjs.com/en/starter/hello-world.html
-   Nginx:
    -   https://nginx.org/
-   Docker:
    -   https://docker-k8s-lab.readthedocs.io/en/latest/docker/docker-engine.html
    -   https://www.docker.com/
-   Docker-compose:
    -   https://docs.docker.com/compose/
-   StatsD:
    -   https://github.com/etsy/statsd
    -   https://github.com/etsy/statsd/blob/master/docs/graphite.md
-   Graphite:
    -   https://graphiteapp.org/
    -   https://graphite.readthedocs.io/en/latest/
-   Grafana:
    -   https://grafana.com/
    -   https://docs.grafana.org/guides/getting_started/
-   imagen usada (statsd + graphite):
    -   https://hub.docker.com/r/graphiteapp/graphite-statsd/
    -   https://github.com/graphite-project/docker-graphite-statsd
-   Gotchas:
    -   http://dieter.plaetinck.be/post/25-graphite-grafana-statsd-gotchas/
-   Artillery:
    -   https://artillery.io/docs/
    -   https://www.npmjs.com/package/artillery
    -   https://www.npmjs.com/package/artillery-plugin-statsd
-   JMeter:
    -   https://jmeter.apache.org/

# Pequeño cheatsheet de docker

Es posible que necesiten ejecutar los comandos con `sudo`, según el sistema que usen y cómo lo hayan instalado.

```sh
# Ver qué containers existen
docker ps [-a]

# Ver qué imagenes hay en mi máquina
docker images

# Ver uso de recursos de containers (como "top" en linux)
# Ejemplo con formato específico: docker stats --format '{{.Name}}\t{{.ID}}\t{{.CPUPerc}}\t{{.MemUsage}}'
docker stats [--format <format_string>]

# Descargar una imagen
docker pull <image>[:<tag>]

# Eliminar un container
docker rm <container_id> [-f]

# Eliminar una imagen
docker rmi <image_id> [-f]

# Eliminar imágenes "colgadas" (dangling)
docker rmi $(docker images -q -f dangling=true)

# Versión instalada
docker version
```

# Pequeño cheatsheet de docker-compose

Todos los siguientes comandos deben ejecutarse desde la carpeta en donde está el archivo `docker-compose.yml` del proyecto.

Es posible que necesiten ejecutar los comandos con `sudo`, según el sistema que usen y cómo lo hayan instalado.

```sh
# ALIAS para escribir menos
alias docc='docker-compose'

# Ayuda general
docc --help

# Ayuda genral para cualquier comando
docc [COMMAND] --help

# Levantar servicios.
# Sugerencia: Usar la opción -d para levantar en background, y poder seguir usando la terminal
# También sirve para escalar horizontalmente un servicio que ya se esté ejecutando [buscar opción --scale].
# Si no se especifica al menos un servicio, se levantan todos
docc up [options] [SERVICE...]

# Ver logs de un servicio ejecutándose en background
docc logs [options] [SERVICE]

# Listar containers y sus estados
docc ps

# Restartear servicios
# Si no se indica al menos un servicio, se restartean todos
docc restart [SERVICE...]

# Frenar servicios corriendo en background (con la opción --detach del `up`)
# Si no se lista ningún servicio, se frenan todos.
# Esto solo frena servicio, no borra el container ni los datos que hayan en el mismo
docc stop [SERVICE...]

# Frenar containers y borrar tanto los containers como las imágenes y los volúmenes de almacenamiento
# (se pierden todos los datos que hubiera en el container).
# Esto aplica a TODOS los levantados con `up`, no filtra por servicio
docc down

# Levantar un nuevo container de un servicio y ejecutar un comando adentro
# (util para tener por ejemplo una terminal dentro de un container e inspeccionarlo o hacer pruebas manuales).
# Como es siempre sobre un container nuevo, lo que ven es el resultado de su docker-compose.yml y sus dockerfiles
# Ejemplo: docc run graphite bash
docc run SERVICE COMMAND

# Correr un comando en un container que ya existe y ya está corriendo.
# Parecido a `run` pero sobre un container en ejecución.
# Útil para alterar o inspeccionar algo que se está ejecutando.
#Lo que ven adentro puede no ser el resultado directo del docker-compose.yml + dockerfiles, así que mucho cuidado
# si van a modificar sus containers así, porque puede ser difícil de reproducir luego.
# Ejemplo: docc exec graphite bash
docc exec SERVICE COMMAND

# Versión instalada
docc version
```
