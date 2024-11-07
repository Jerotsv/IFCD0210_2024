  - [Contenidos propuestos](#contenidos-propuestos)
  - [Básico](#básico)
    - [REPOSITORIOS REMOTOS](#repositorios-remotos)
  - [Avanzado](#avanzado)
    - [Git internals: Plumbing commands](#git-internals-plumbing-commands)
      - [La carpeta .git](#la-carpeta-git)
      - [Hashes: creación y lectura](#hashes-creación-y-lectura)
      - [Elementos de un repositorio- Primer commit](#elementos-de-un-repositorio--primer-commit)
      - [Modificación de un archivo](#modificación-de-un-archivo)
      - [References: Branches and HEAD](#references-branches-and-head)
    - [Taller: Crear un nueva repositorio desde cero](#taller-crear-un-nueva-repositorio-desde-cero)
      - [Gestionando el repositorio con comandos plumbing](#gestionando-el-repositorio-con-comandos-plumbing)
      - [Creando un commit con comandos plumbing](#creando-un-commit-con-comandos-plumbing)
      - [En resumen del Taller](#en-resumen-del-taller)
    - [REESCRIBIENDO LA HISTORIA (2)](#reescribiendo-la-historia-2)
      - [git command --amend](#git-command---amend)
      - [rebase interactivo](#rebase-interactivo)
        - [edit: modificando un commit](#edit-modificando-un-commit)
        - [squash y fixup: fusionando commits](#squash-y-fixup-fusionando-commits)
        - [drop: eliminando un commit](#drop-eliminando-un-commit)
      - [Otros comandos](#otros-comandos)
    - [TRABAJANDO EN PARALELO (2)](#trabajando-en-paralelo-2)
      - [Cherrypick](#cherrypick)
    - [REPOSITORIOS REMOTOS (2)](#repositorios-remotos-2)
## Contenidos propuestos
## Básico
### HERRAMIENTAS PARA PREPARAR UN BUEN COMMIT EN CUALQUIER SITUACIÓN
#### Comprobar el repositorio. Git log
git log
git log --graph --decorate --oneline
Log es uno de los comandos de git con más opciones. Algunas de las más útiles son
- `--graph`: Muestra el historial de commits en forma de grafo
- `--decorate`: Muestra las referencias de los commits (HEAD, master, ...)
- `--oneline`: Muestra los commits en una sola línea
- `--all`: Muestra todos los commits, no solo los de la rama actual
- `--author`: Filtra los commits por autor
- `--since`: Filtra los commits por fecha
- `--until`: Filtra los commits por fecha
- `--grep`: Filtra los commits por mensaje
- `--no-merges`: Muestra solo los commits que no son merges
- `--stat`: Muestra estadísticas de los cambios en los commits
- `--patch`: Muestra los cambios en los commits
Se suelen combinar varias opciones para obtener la información deseada
- `--graph --oneline --decorate --all`: Muestra el historial de commits en forma de grafo, en una sola línea, con las referencias y todos los commits
Si estas combinaciones se utilizan con frecuencia, se pueden añadir a la configuración de git como alias
```shell
git config --global alias.lol "log --graph --decorate --oneline"
git lol
```
Se puede indicar a partir de que commit debe de empezar la serie
git log <commit-name>
git log master~2
Se puede especificar un rango (desde .. hasta)
git log <commit-name>..<commit-name>
```shell
git log master~12..master~10
```
Se pueden mostrar los commits que afectan a un determinado path (carpeta, fichero…)
git log -- <path>
git log -- README3.txt
Se pueden mostrar los commits que coincidan con una expresión regular
git log --grep=‘reg-exp’
Se pueden excluir del listado los commits resultantes de un merge
git log --no-merges
Se pueden mostrar los cambios producidos durante un tiempo
git log --since={2010-04-18}
git log --before={2010-04-18}
git log --after={2010-04-18}
Dado lo complejo de la sintaxis de git log, y las limitaciones gráficas de la consola, se pueden utilizar herramientas gráficas para visualizar el historial de commits.
Por ejemplo, **gitk**, que se instala con Git, o **gitg**, que es una herramienta gráfica de Git para Gnome.
En **VSC** se puede utilizar la extensión **Git Graph**
#### Alias
Los alias fueron añadidos en Git 1.4.0
Evitan tener que teclear repetidas veces el mismo comando completo
Se pueden configurar en cualquiera de los ámbitos de configuración mencionados (system, global, local) tanto por línea de comandos como directamente en el fichero de configuración correspondiente
git config --global alias.lol "log --graph --decorate --oneline"
git lol
Un ejemplo de alias más complejo
git config --global alias.hist git log --pretty=format:"%h %ad | %s%d [%an]" --graph --date=short
git hist
Los alias de git admiten los mismos parámetros y modificadores que los comandos originales
git config --global alias.ch git checkout
git ch -b feature/branch
#### Operaciones en la Staging Area (Index)
##### Añadir ficheros
Como ya hemos visto, el comando `git add` añade ficheros al área de preparación (staging area). Se puede añadir un solo fichero, todos los ficheros de un directorio o todos los ficheros del directorio de trabajo.
```shell
md samples
echo 'Sample One' > samples\sample1.txt
echo 'Sample Two' > samples\sample2.txt
tree samples /f
Se puede añadir al index

- un conjunto de ficheros
- todos los disponibles
git add <file>
git add .
git status
```
##### Eliminar de la Staging Area (Index)
Eliminar elementos de la zona de preparación (staging area), i.e. revertir add, se puede hacer de varias formas
Cuando aun no se ha hecho commit, se utiliza un formato especial, ya que aún no existe el HEAD

```shell
git rm --cached <file>
Si ya se ha hecho algún commit, el comando anterior, ademas de eliminar el fichero de la staging area, lo elimina del directorio de trabajo.
En estas circunstancias, se puede utilizar
git reset <file>
O la opción moderna, recomendada en el git status
git restore --staged <file>
git restore es un nuevo comando que reproduce una parte de la funcionalidad de git checkout: recover an earlier commit.
Una variación de git reset permite eliminar un archivo de la staging area y enviando al directorio de trabajo su estado en el último commit
git reset HEAD <file>
```
Por otra parte, el comportamiento de git checkout con ficheros trazados por git (tracked) es un poco diferente
- git checkout -- path: el path se toma como un fichero o directorio, si es un directorio, significa todos los ficheros dentro de ese directorio, recursivamente, y Git copia la copia actual del fichero tal como se encuentra en el índice a su árbol de trabajo.
- git checkout HEAD -- path: el path se toma en la misma forma que antes, y Git copia la copia actual del fichero tal como se encuentra en el commit HEAD al índice y al árbol de trabajo.
git checkout -- <file>
git checkout HEAD -- <file>
#### Eliminar ficheros
Puede hacerse en dos fases
- eliminar de la workArea (mediante el SO)
- subir el cambio a la Staging Area
del samples\sample1.txt
git status
git add samples\sample1.txt
git status
Es preferible hacerlo en un solo paso
Al ser un borrado definitivo, es necesario el modificador f
git status
git rm samples\sample2.txt
git status
git rm -f samples\sample2.txt
git status
```
##### Problemas con .gitignore
En algún caso puede que añadamos a git ignore nuevos elementos que ya estaban en el repositorio. En este caso, git no los ignorará, ya que ya los conoce. Para que los ignore, hay que eliminarlos del repositorio
Con el comando rm podremos borrar los archivos del repositorio, pero si lo ejecutamos tal cual nos eliminará también el archivo de nuestro directorio de trabajo.

Si queremos conservarlo tendríamos que poner lo siguiente:
git rm --cached <file>
```
Si lo que queremos eliminar es un directorio con todo su contenido el comando sería el siguiente:
```shell
git rm -r --cached <directory>
El modificador -r indica que se trata de un directorio procesado de forma recursiva, es decir con todos sus ficheros y directorios, con todos los niveles de anidamiento que pueda tener.
En este punto tendremos pendiente de commit la eliminación del archivo o carpeta del repositorio, por lo que tendremos que hacer un commit para que se aplique el cambio.
```shell
git commit -m "Eliminado archivo de referido en .gitignore"
Finalmente actualizaremos con nuestros cambios el remoto
git push
#### Cambiar nombre de ficheros
```shell
md samples
echo 'Sample One' > samples\sample_bad1.txt
echo 'Sample Two' > samples\sample_bad2.txt
tree samples /f
git add .
```
Igual que en el caso anterior, puede hacerse en un paso o en dos
En dos fases
- cambiar el nombre en la workArea (mediante el SO)
- subir el cambio a la Staging Area
```shell
ren samples\sample_bad1.txt sample1.txt
git status
git add samples\sample_bad1.txt
git add samples\sample1.txt
git status
```
En una sola fase
git mv samples\sample_bad2.txt samples\sample2.txt
git status
#### git diff
Permite ver los cambios entre dos commits, dos ramas, dos ficheros, etc.
Por defecto, compara el directorio de trabajo con el index (staging area)
git diff
Para comparar el directorio de trabajo con el último commit
```shell
git diff HEAD
Para comparar el directorio de trabajo con un commit concreto
git diff <commit>
```
Para comparar dos commits

```shell
git diff <commit1> <commit2>
Para comparar dos ramas

git diff <branch1> <branch2>
```
Para comparar dos ficheros
```shell
git diff <file1> <file2>
En todos los casos, git tiene que calcular las diferencias, por lo que el resultado no es inmediato. Hay que recordar que en git no se almacenan las diferencias, sino los estados de los ficheros en cada commit.
#### git blame

Permite conocer el autor de la última modificación de cada línea de un fichero y en que commit se incluyó el cambio.
git blame <file>
Es una herramienta muy útil para la revisión de código, que permite quién ha hecho un cambio en un fichero y para saber por qué se ha hecho un cambio.
Esta también disponible cuando se accede al repositorio en GitHub
### Recapitulando: Git básico
- `git config`: Configura Git; permite añadir alias
- `git init`: Inicializa un repositorio local de Git
- `git clone`: Clona un repositorio de Git
- `git status`: Muestra el estado de los archivos en el directorio de trabajo (workArea) y el área de preparación
- `git add`: Agrega un archivo al área de preparación (stagedArea)
- `git commit`: Guarda los cambios en el repositorio
- `git log`: Muestra el historial de commits
- `git show`: Muestra los cambios de un commit
- `git rm`: Elimina un archivo del repositorio
- `git mv`: Cambia el nombre de un archivo
- `git reset`: Mueve el puntero de la rama; en consecuencia restablece el estado de los archivos al commit indicado
  - `git reset <file>`: Elimina el fichero de la staging area
- `git checkout <file>` mueve los ficheros entre el repositorio, el área de preparación y el directorio de trabajo
  - `git restore --staged <file>`: Elimina el fichero de la staging area
- `git diff`: Muestra las diferencias entre dos commits, dos ramas, dos ficheros, etc.
- `git blame`: Muestra el autor de la última modificación de cada línea de un fichero y en que commit se incluyó el cambio
- `git remote`: Conecta el repositorio local con un repositorio remoto
- `git push`: Sube todos los cambios locales al repositorio remoto
- `git pull`: Descarga los cambios del repositorio remoto al repositorio local
### REESCRIBIENDO LA HISTORIA
#### Advertencia
La _ley de oro de Git_ dice que **no se deben modificar commits que ya han sido compartidos**
Veremos que pasa en caso de hacerlo, cuando estemos hablando de los repositorios remotos.
#### git checkout
El comando `git checkout` mueve el puntero de referencia HEAD a un commit específico.
- en otra rama (lo habitual)
- en la misma rama. Veamos este segundo caso
git checkout HEAD~1
You are in 'detached HEAD' state. You can look around, make experimental changes and commit them, and you can discard any commits you make in this state without impacting any branches by switching back to a branch.
If you want to create a new branch to retain commits you create, you may do so (now or later) by using -c with the switch command. Example: git switch -c [new-branch-name]

Or undo this operation with: git switch -
![git checkout](assets/checkout.svg)

En este caso, el puntero HEAD se ha movido al commit anterior al último commit de la rama actual. El mensaje indica que estamos en un estado de HEAD desacoplado (detached HEAD), lo que significa que no estamos en una rama y que cualquier commit que hagamos no estará vinculado a ninguna rama.

En este estado, podemos consultar el estado del proyecto en ese commit, que se reflejara en la working area. Igualmente podemos hacer cambios experimentales, pero si queremos conservarlos, debemos crear una nueva rama desde el último commit desacoplado.
git checkout -b new-branch
Si no queremos conservar los cambios, podemos volver a la rama más adelantada con alguno de los comandos

git switch -
git checkout -
Igualmente podemos volver a cualquier rama con alguno de los comandos
git switch <branch>
git checkout <branch>
##### git checkout a nivel de archivo

En lugar de mover el HEAD del repositorio, lo que hace es llevar al directorio de trabajo el fichero al que hemos hecho checkout con el contenido que tenía en el commit especificado
git checkout HEAD~1 README.md
El resultado es que el fichero README.md en el area de trabajo vuelve a tener el contenido que tenía en el commit anterior al HEAD.
git checkout HEAD~1 README.md --stage
En este caso, el fichero README.md en el área de preparación vuelve a tener el contenido que tenía en el commit anterior al HEAD.
#### git reset
El comando `git reset` mueve el puntero de referencia de una rama (acompañado por el HEAD), a un commit específico, normalmente un commit anterior de la misma rama. Estaremos 'deshaciendo' los commits posteriores que quedarán huérfanos y se eliminarán la próxima vez que Git haga limpieza.
Sus efectos sobre la working y staging areas dependen de la opción seleccionada:
- hard: el contenido del commit apuntado por la rama se refleja en la working y staging areas
- mixed: (valor por defecto) el contenido del commit apuntado por la rama se refleja en la working area
- soft: no se modifican la working y staging areas. Cambia todos los archivos a "Cambios a ser committed".
![git reset](assets/reset.svg)
##### git reset a nivel de archivo
git reset HEAD [file]
En este caso no mueve el HEAD del repositorio, lo que hace es llevar al directorio de staged el fichero al que hemos hecho reset con el contenido que tenía en el último commit. Como se una el parámetro por defecto, mixed, en el directorio de trabajo estará la versión última del contenido pendiente de commit y en staged la versión del contenido a la que hemos vuelto.
#### Ref logs
El reflog es un registro de los cambios en los punteros de referencia (HEAD, ramas, etc.) que se han producido en el repositorio. Se puede consultar con el comando `git reflog`
git reflog
También se puede obtener la lista de todos los logs en los que se guarda la información de los cambios en los punteros de referencia, dentro de la carpeta logs del repositorio.
git reflog list
Esta información es muy util para conocer los commits "eliminados", es decir aquellos a los que ya no se puede acceder directamente desde las ramas, pero que siguen existiendo en el repositorio.
Utilidades gráficas como gitk o la extensión Git Graph de Visual Studio Code permiten visualizar la información de los reflogs de una manera más intuitiva para el usuario.
### TRABAJANDO EN PARALELO
#### Ramas (branches)
Comandos para trabajar con ramas
- `git branch`: Lista las ramas locales
- `git branch nombre_rama`: Crea una nueva rama
- `git checkout nombre_rama`: Cambia a la rama especificada
- `git checkout -b nombre_rama`: Crea una nueva rama y cambia a ella
- `git merge nombre_rama`: Fusiona la rama especificada con la rama actual
- branches
  - Crear, borrar, intercambiar
  - Crear desde ref (git checkout b mybranch master~1)
#### Combinación de ramas: Merge y Rebase
El destino final de una rama suele ser la fusión con la rama principal. Para ello se utilizan dos estrategias, basadas en distintos comandos
- merge con el comando `git merge`
- rebase con el comando `git rebase`
##### Merge fast-forward
El merge fast-forward es una estrategia de merge que se utiliza cuando la rama que se va a fusionar (e,g. main) no tiene commits que no estén en la rama de destino. En este caso, Git no crea un commit de merge, sino que mueve el puntero de la rama de destino al último commit de la rama que se va a fusionar.
git checkout -b feature/branch
echo 'Feature One' > feature1.txt
git add feature1.txt
git commit -m "Add feature one"
git checkout main
git merge feature/branch
![merge fast-forward](assets/merge_fast_forward.svg)
##### Merge recursive
El merge recursive es una estrategia de merge que se utiliza cuando la rama que se va a fusionar tiene commits que no están en la rama de destino. En este caso, Git crea un commit de merge, que tiene dos padres, uno de la rama de destino y otro de la rama que se va a fusionar.
git checkout -b feature/branch
echo 'Feature Two' > feature2.txt
git add feature2.txt
git commit -m "Add feature two"
git checkout main
echo 'Feature Three' > feature3.txt
git add feature3.txt
git commit -m "Add feature three"
git merge feature/branch
![merge recursive](assets/merge_recursive.svg)
##### Rebase
El rebase es una estrategia de merge que se utiliza para reescribir la historia de una rama, cambiando el orden de los commits, modificando los mensajes de los commits, eliminando commits, fusionando commits, etc.
git checkout -b feature/branch
echo 'Feature Four' > feature4.txt
git add feature4.txt
git commit -m "Add feature four"
git checkout main
echo 'Feature Five' > feature5.txt
git add feature5.txt
git commit -m "Add feature five"
git rebase feature/branch
![rebase](assets/rebase.svg)
#### Resolución de conflictos
Los conflictos surgen durante un merge recursivo o un rebase, cuando dos commits han modificado la misma parte de un fichero. Git no puede decidir cuál de los dos cambios es el correcto, por lo que deja la resolución del conflicto al usuario.
El editor de texto asociado a git muestra el fichero con los conflictos, que se indican con una estructura:
```shell
<<<<<<<
Código de la rama actual
=======
Código de la rama que se va a fusionar
>>>>>>>.
```
El usuario debe decidir qué cambios se deben mantener: los actuales, los entrantes o ambos y el editor eliminará los marcadores de conflicto.

En algún caso, si queda contenido fuera de stage que se quiere incluir, puede ser necesario hacer un add.

Finalmente, se debe hacer un commit para finalizar la resolución del conflicto. En este caso no se indicara mensaje y git abrirá de nuevo el editor con el mensaje por defecto de un commit de fusión, que se puede modificar.
git add <file>
git commit
### REPOSITORIOS REMOTOS
#### ¿Qué son los repositorios remotos?
Un repositorio remoto es una versión del proyecto que se encuentra alojada en un **servidor** (cualquier otro ordenador). Puede ser útil para
- colaborar con otras personas en un proyecto, ya que les permite enviar cambios al proyecto y recibir cambios del proyecto.
- mantener una copia del proyecto en un servidor remoto, para tener una copia de seguridad o para trabajar en diferentes ordenadores.
EL "servidor" puede ser
- un **hosting** de repositorios Git, como **GitHub**, **GitLab** o **Bitbucket**
- un servidor propio, en el que se instalara un servidor Git como **GitLab**, **Gitea** o **Gogs**
Los **repositorios remotos**, alojados en los servidores, cualquier que sea su tipo, son una versión de repositorio algo diferente, conocida como **repositorio bare**.
Se denominan bare porque no tienen working area, es decir, no tienen los ficheros del proyecto, solo los metadatos de Git.
Para crear un repositorio remoto en el servidor, se puede utilizar el comando `git init` con la opción `--bare`
git init --bare
Normalmente es el software del servidor el que se encarga de crear el repositorio remoto, por lo que no es necesario hacerlo manualmente.
Por ejemplo en github, se crea un repositorio completando un **formulario** en la web, indicando el nombre del repositorio, si es público o privado, si tiene un README.md, etc.
#### Clonado de repositorios
El proceso de obtener localmente una copia de un repositorio remoto se denomina **clonado**. Se realiza con el comando `git clone`
git clone <url>
Un proceso de clonado realiza varias operaciones
- Crea un directorio con el nombre del repositorio
- Inicializa un repositorio local de Git
- Añade un repositorio remoto con el nombre `origin` y la URL del repositorio remoto
- Descarga los ficheros del repositorio remoto en su rama main al directorio local
- Añade un puntero a la rama main del repositorio remoto con el nombre `origin/main`
- Crea una rama local `main` que apunta al mismo commit que `origin/main`
- Crea una working area con los ficheros del proyecto
- Crea un puntero HEAD que apunta a la rama local `main`
Es posible indicar al clonado que se realice en un directorio diferente al del repositorio remoto
git clone <url> <nombre_directorio>
Respecto a las ramas, el clonado crea una rama local `main` que apunta al mismo commit que `origin/main`. Si el repositorio remoto tiene más ramas, se pueden añadir al repositorio local con el comando `git fetch`
git fetch
Estas ramas se añaden al repositorio local con el nombre `origin/nombre_rama`.
Las ramas remotas o **tracking branch** son ramas que siguen a una rama remota. Se crean automáticamente al clonar un repositorio remoto o al añadir un repositorio remoto a un repositorio local.
Se pueden ver las ramas remotas con el comando `git branch -r`
git branch -r
Las ramas remotas funcionan como marcadores, para recordarte en qué estado se encontraban tus repositorios remotos la última vez que conectaste con ellos. Se mueven automáticamente cuando estableces comunicaciones en la red y no pueden ser movidas de otra manera.
No puedes trabajar directamente en una rama remota (no se pueden realizar merge o añadir commits), pero puedes hacerlo en una rama local que siga a una rama remota.
Para trabajar con ellas, se puede crear una rama local que apunte a la rama remota con el comando `git checkout`
git checkout -b nombre_rama origin/nombre_rama.
#### Git remote
Git utiliza remote y ramas remotas (tracking branch) como referencias que facilitan la conexión con otros repositorios (conocidos como remotos)
Si el repositorio ha sido **clonado** con `git clone`, se habrá creado automáticamente una referencia al repositorio remoto con el nombre `origin`.
Si se ha creado un repositorio local con `git init`, se puede añadir una referencia al repositorio remoto con el comando `git remote add`
git remote add origin <url>
##### Operaciones con git remote
- `git remote`: Lista los repositorios remotos
- `git remote -v`: Lista los repositorios remotos con la URL
- `git remote add <nombre> <url>`: Añade un repositorio remoto
- `git remote remove <nombre>`: Elimina un repositorio remoto
- `git remote show <nombre>`: Muestra información sobre un repositorio remoto
- `git remote rename <nombre> <nuevo_nombre>`: Cambia el nombre de un repositorio remoto
- `git fetch <nombre>`: Descarga los cambios del repositorio remoto
#### Operaciones con repositorios remotos
Para mantener sincronizados los repositorios local y remoto, se utilizan los comandos `git push` y `git pull` que permiten subir y bajar cambios entre ambos repositorios.
##### Git push
- `git push`: Sube los cambios locales al repositorio remoto. Si aún no existe la rama remota, da un mensaje de error que indica el comando necesario para poder crear la rama en el remoto: `git push -u origin <rama>`
  - `git push -u origin main`: Sube los cambios locales al repositorio remoto y establece la rama remota como rama de seguimiento
  - `git push origin :rama`: Elimina la rama remota
  - `git push origin --tags`: Sube todos los tags al repositorio remoto (no se suben por defecto)
Git push no puede subir cambios si hay cambios en el repositorio remoto que no están en el local. En este caso, se debe hacer un `git pull` para descargar los cambios del remoto al local y fusionarlos con los locales.
Sin embargo, si se quiere subir los cambios locales sin fusionar con los remotos y sobre escribiéndolos, se puede utilizar el modificador `--force` o `-f`
git push -f
Esto podría ser necesario si hemos **reescrito la historia localmente** y queremos subir los cambios al remoto. Es una operación peligrosa, ya que se pierden los cambios del remoto. Y en todo caso debe estar concertada con el resto del equipo.
##### Git pull
- `git pull`: Descarga los cambios del repositorio remoto al repositorio local. Es equivalente a `git fetch` seguido de `git merge`
  - `git fetch` descarga una determinada rama del repositorio remoto y la almacena en una rama remota, con su etiqueta `origin/rama`. No produce ningún cambio en las ramas locales
  - `git merge` fusiona la rama remota con la rama local, utilizando la estrategia ff (fast forward) si es posible
Con frecuencia el intento de hacer un push recibe el aviso de que hay cambios en el remoto que no están en el local, lo que impide hacer el push. En este caso, se debe hacer un pull para descargar los cambios del remoto al local y fusionarlos con los locales.
![git pull after push problem](assets/git.pull.svg)
Comandos relacionados con estas operaciones son
- `git pull --rebase`: Descarga los cambios del repositorio remoto al repositorio local y los fusiona con los locales, utilizando la estrategia rebase
- `git pull --ff-only`: Descarga los cambios del repositorio remoto al repositorio local y los fusiona con los locales, utilizando la estrategia ff (fast forward) si es posible
- `git pull --no-ff`: Descarga los cambios del repositorio remoto al repositorio local y los fusiona con los locales, creando un commit de merge aunque sea posible hacer un ff (fast forward)
- `git checkout --track –b <local-branch> <remote-repo> / <remote-branch>`: Recupera una rama remota en una rama local y cambia a dicha rama
- `git branch <local-branch> <repo>/<remote-branch>`: Recupera una rama remota en una rama local
#### Pull Request
Un **Pull Request** es una petición que se hace a los colaboradores de un proyecto para que revisen y acepten los cambios que se han hecho en una rama y se fusionen con la rama principal.
No es una operación de Git, sino una funcionalidad de los servidores de repositorios Git, como GitHub, GitLab o Bitbucket.
Por tanto se crea en el servidor, no en el repositorio local. Se puede hacer desde la web del servidor o desde la línea de comandos, con el comando `git request-pull`
git request-pull <inicio> <final> <repositorio>
- Si la nueva rama se crea localmente, el primer paso es subirla al repositorio remoto con `git push`
git checkout -b <rama>
echo "Nuevo contenido" > README.md
git commit -m "Mensaje"
git push --set-upstream origin feature
# equivale a git push -u origin <rama>
Al acceder al repositorio en GitHub, se puede ver la nueva rama y generalmente aparecerá un aviso "feature had recent pushes less than a minute ago" y un botón "Compare & pull request"
El interface de GitHub muestra la información de la PR:
base: la rama a la que se quiere fusionar (main)
compare: la rama que se quiere fusionar (feature)
Además, permite añadir un título y una descripción al Pull Request, y seleccionar los revisores y diversas etiquetas (Labels, Projects, Milestone...) relacionadas con la gestión del proyecto.
Una vez creada, la PR realiza las comprobaciones que tenga definidas el proyecto, como tests, análisis de código, etc. y notifica a los revisores.
En una PR abierta tanto el autor como los revisores pueden realizar la siguientes operaciones
- Permite a los revisores revisar los cambios y hacer comentarios
- Permite a los revisores aprobar o rechazar los cambios
- Permite a los revisores fusionar los cambios
- Permite a los revisores cerrar la PR
- Permite al autor de la PR cerrar la PR
- Permite al autor de la PR borrar la rama
- Permite al autor de la PR reabrir la PR
El autor puede cambiar el estado de la PR
- draft, para indicar que no está lista para ser merge, aunque la política del equipo quizás defina que puede ir siendo revisada,
- ready, para indicar que está lista.
Cualquiera con acceso a la rama puede añadir nuevos commits, que se incorporaran automáticamente a la PR, desencadenando de nuevo los procesos de revisión y notificación.
Una PR abierta puede verse como un mecanismo de colaboración en el equipo, dando lugar a discusiones, mejoras, etc. más que como un simple mecanismo de aprobación.
En cualquier caso su uso depende mucho de la dinámica de trabajo de cada equipo. Es frecuente que se defina la necesidad de un mínimo de aprobaciones para poder fusionar una PR, que dependerá entre otras coss del tamaño del equipo. Se puede definir que el responsable de fusionar sea el autor, una vez recibidas las aprobaciones, el último de los revisores etc.
En cualquier caso el proceso de fusión de una PR es un proceso de merge / rebase, que puede ser automático o manual, dependiendo de la configuración del proyecto. En el segundo caso,basta usar el botón que proporciona el interfaz y elegir la estrategia de fusión, ff, rebase, squash, etc. de entre las que se hayan permitido en la configuración de la rama principal.
El cierre de la PR puede ser consecuencia de su fusión o del abandono de esta línea de trabajo, y si es necesario se puede reabrir.
##### Configuración de las ramas y PR
Cuando se trabaja con PR es habitual realizar una serie de ajustes en la configuración de la s ramas, especialmente en la rama principal, para facilitar el trabajo con PR.
- Proteger la rama principal para evitar cambios directos
- Configurar la rama principal como rama por defecto de las PR
- Configurar las opciones de fusión permitidas para las PR y la opción por defecto
- Configurar las opciones de revisión de las PR
- Configurar las opciones de notificación de las PR
- Configurar las opciones de eliminación de las ramas de las PR
- Configurar las opciones de eliminación de las PR
Todos estos ajustes se realizan en la configuración del repositorio en el servidor, no en el repositorio local, accediendo a los settings -> branches.
- Se crea un rulset
- Se aplica a la rama default
- Se selecciona Require a pull request before merging
- Se selecciona Require status checks to pass
Otra opción es utilizar "Add classic branch protection rule" que también permite configurar las opciones de protección de la rama principal de forma detallada.
##### Actualizaciones de las ramas feature
Con el tiempo, la rama principal puede avanzar y la rama feature puede quedarse desactualizada. Para mantenerla actualizada, se puede hacer un merge de la rama feature sobre la rama principal, después de haber actualizado esta.
git checkout main
git pull
git checkout feature
git merge main
Los posibles conflictos se resuelven como en cualquier merge, en el entrono local y una vez resueltos, se suben los cambios al repositorio remoto
```shell
git push
```
## Avanzado
### Git internals: Plumbing commands
Para conocer/manipular la estructura interna de Git, se utilizan los **plumbing commands** (comandos de fontanería).
Estos comandos son los que utiliza el propio Git internamente para construir los comandos de más alto nivel conocidos como **porcelain commands**.
#### La carpeta .git
En términos de sistema de ficheros, un repositorio Git es una carpeta que incluye un directorio oculto `.git`.
Éste contiene toda la información necesaria para el control de versiones:
- **Objetos**: blobs, trees, commits, tags anotados
- **Referencias**: HEAD, master branch, tags ligeros
- Hooks: scripts que se ejecutan en determinados eventos
- Info y Logs: información extra sobre el repo y los commits
- fichero Index: área de preparación
- fichero de configuración local
tree .git
tree .git/objects /f
Se puede ver que el resultado muestra como la carpeta objects consta de una serie de cartetas/archivos que contienen los objetos de Git, por el momento.
- blobs (los archivo)
- trees (los directorios)
- commits (los snapshots)
Más adelante veremos un cuarto tipo de objeto, los tags (anotadas).
#### Hashes: creación y lectura
La siguiente descripción refleja la forma de explicar estos concepto propuesta por _Paolo Perrotta_ en su conferencia _Understanding Git_, 3 diciembre 2016, disponible en [YouTube](https://www.youtube.com/watch?v=nHkLxts9Mu4).
En su capa más profunda Git es un **mapa de objetos** de acuerdo con un patrón clave/valor. Cada objeto es un cierto contenido (valor) que tiene un hash que lo identifica (clave).
Existe un comando de git que permite obtener el hash de un objeto, `git hash-object`. Este comando toma un archivo o cualquier contenido y devuelve el hash del objeto creado.
echo "Hello, World" | git hash-object --stdin
// 110fdc0ce1c7582e08f31e17bbcfdec1b50a478c
En este comando, el hash para un mismo contenido y en el mismo shell siempre será el mismo. El shell influye porque en cada uno de ellos el stdin es distinto.
El mismo contenido de un archivo siempre tendrá el mismo hash de 40 bytes, sin importar el nombre del archivo o la ubicación en el sistema de archivos. Este hash es único para el contenido con una probabilidad tan alta que se puede considerar único.
> Un hash SHA-1 es un número hexadecimal de 40 caracteres que se utiliza para identificar de forma única los objetos de Git. Se calcula a partir del contenido del objeto y de su tipo.
Si añadimos al comando la opción `-w`, para guardar el objeto obtendremos un mensaje de error porque no nos encontramos en un repositorio de Git.
echo "Hello, World" | git hash-object -w --stdin
// fatal: not a git repository (or any of the parent directories): .git
El mapa de hashes creado por Git se convierte en **persistente** gracias a la existencia de un **repositorio**, que es básicamente un directorio `.git/objects` que contiene todos los objetos de git. Cada objeto es guardado en un archivo con el nombre del hash del objeto.
Creamos un repositorio vacío y guardamos el objeto en el repositorio.
git init sample-repo
cd sample-repo
dir /a:hd // [= ls -a]
echo "Hello, World" | git hash-object -w --stdin //110fdc0ce1c7582e08f31e17bbcfdec1b50a478c
cd git
dir
cd objects
dir
cd 11
dir // 0fdc0ce1c7582e08f31e17bbcfdec1b50a478c
> El repositorio es una **base de datos de objetos** que se almacena en la carpeta oculta `.git`, que contiene los objetos de git en la carpeta objects.
> Por **cada hash** se crea una carpeta con los primeros dos caracteres del hash y dentro de esta carpeta se crea un fichero cuyo nombre es el resto del hash, que contiene la información correspondiente a ese hash en un formato comprimido.

De cada objeto guardado en un archivo se puede recuperar la información que contiene a partir del hash del objeto.
git cat-file -t 110fdc0 // blob
git cat-file -p 110fdc0 // Hello, World
Cada objeto es accesible por los 5 primeros caracteres de su hash:
la carpeta (2 caracteres) + inicio del fichero (3 caracteres)
#### Elementos de un repositorio- Primer commit
Creamos un proyecto muy simple.
cd cook.book
C:.
│ menu.txt // Apple Pie
└───recipes
apple_pie.txt
readme.txt
```shell
cd cook.book
type menu.txt
// Apple Pie
type .\recipes\readme.txt
// Put your recipes in this folder, one for file.
type .\recipes\apple_pie.txt
//Apple Pie
```
Creamos un **repositorio** en el proyecto con un **commit inicial**.
```shell
cd cook.book
git init
git status
git add .
git commit -m "Initial commit"
Vemos el resultado en la carpeta objects del repositorio.
```shell
cd .git
cd dir /w // [25]   [5d]   [77]   [8d]   [9e]
cd 1f
```
Comprobamos los **logs** del repositorio
```shell
git log
commit 5da6f7b4682638317b18a5fe0f9edca98aeb1f7c (HEAD -> main)
Author: Alejandro Cerezo <alce65@hotmail.es>
Date:   Sat Sep 28 13:14:18 2024 +0200
    Initial commit
El **commit** corresponde al objeto 5d-a6f7b4682638317b18a5fe0f9edca98aeb1f7c que podemos leer con `git cat-file`.

git cat-file -p 5da6f7b

tree 8de329e56d2bf59ad7ce6df33df79e91a2a4a5a8
author Alejandro Cerezo <alce65@hotmail.es> 1727522058 +0200
committer Alejandro Cerezo <alce65@hotmail.es> 1727522058 +0200

Initial commit
Un resultado similar se consigue con el comando `git show --pretty=raw`, aunque en este caso se añade la información del diff.

git show 5da6f7b
commit 5da6f7b4682638317b18a5fe0f9edca98aeb1f7c
tree 8de329e56d2bf59ad7ce6df33df79e91a2a4a5a8
author Alejandro Cerezo <alce65@hotmail.es> 1727522058 +0200
committer Alejandro Cerezo <alce65@hotmail.es> 1727522058 +0200
    Initial commit
diff --git a/menu.txt b/menu.txt
new file mode 100644
```

Un commit no es mas que un texto, que como cualquier otro objeto de git, tiene un hash que lo identifica. En este texto se incluye la metadata del commit, como el autor, el committer, el mensaje al crearlo y la referencia uno o varios hashes.

En este caso, el commit apunta a un objeto de tipo tree que podemos leer con `git cat-file`.
git cat-file -p 8de329e

100644 blob 9eed377bbdeb4aa5d14f8df9cd50fed042f41023    menu.txt
040000 tree 25036a158dfdf583f672c11ef79f45c6b0e6347a    recipes
El **tree** guarda los nombres de los archivos y directorios (otros tree) que incluye, junto con sus hashes. En este caso, el tree apunta a dos objetos, uno de tipo blob y otro de tipo tree, que nuevamente podemos leer con `git cat-file`.

git cat-file -p 9eed377

Apple Pie
git cat-file -p 25036a1
100644 blob 9eed377bbdeb4aa5d14f8df9cd50fed042f41023    apple_pie.txt
100644 blob 7708256b70bf5e956ea609a785911a31fc14929f    readme.txt
```
En el caso del tree, la misma información se puede obtener con `git ls-tree`.
```shell
git ls-tree 8de329e

100644 blob 9eed377bbdeb4aa5d14f8df9cd50fed042f41023    apple_pie.txt
100644 blob 7708256b70bf5e956ea609a785911a31fc14929f    readme.txt
El objeto tree `25036a1` apunta a dos objetos de tipo blob que . Uno de ellos es nuevamente 9eed377, porque el contenido de `apple_pie.txt` es el mismo que el de `menu.txt`. El otro objeto blob lo podemos leer con `git cat-file`.
git cat-file -p 7708256
Put your recipes in this folder, one for file.
![Primer commit](assets/commit1.svg)

#### Modificación de un archivo

Añadimos otra línea en el archivo `menu.txt` y comprobamos los cambios.
cd ..\..\..\cook.book
echo Cheesecake>> menu.txt
type menu.txt
Creamos un nuevo commit para incorporar los cambios.
git add .
git commit -m "Add Cheesecake to menu"
git log

commit f1dff43f97543e83cab3f52f054cdcf9b26e8d55 (HEAD -> main)
Author: Alejandro Cerezo <alce65@hotmail.es>
Date:   Sat Sep 28 14:03:08 2024 +0200

    Add Cheesecake to menu
De nuevo, el commit es un objeto de tipo que podemos leer con `git cat-file`.
git cat-file -p f1dff4
tree 972e64a00a72e413bd158352ab3e6e98461bfbea
parent 5da6f7b4682638317b18a5fe0f9edca98aeb1f7c
author Alejandro Cerezo <alce65@hotmail.es> 1727524988 +0200
committer Alejandro Cerezo <alce65@hotmail.es> 1727524988 +0200
Add Cheesecake to menu
```

El commit apunta a un objeto de tipo commit, el commit anterior y a un nuevo objeto de tipo tree que podemos leer con `git cat-file`.
git cat-file -p 972e64a

100644 blob 48459e5685c4561d0fa6e26a7371041e982c0ff4    menu.txt
040000 tree 25036a158dfdf583f672c11ef79f45c6b0e6347a    recipes
El tree sigue siendo el mismo, pero el objeto blob `48459e5` es diferente al anterior.
Si lo leemos con `git cat-file` vemos que contiene la nueva línea.

git cat-file -p 48459e5

Apple Pie
Cheesecake
![Primer commit](assets/commit2.svg)
Utilizando un commit como punto de entrada es posible recorrer todos los objetos de un repositorio de git correspondientes al momento en que se creó el commit, reconstruyendo a partir de ellos el estado del proyecto en ese momento, lo que denominamos una **snapshot del proyecto**.
Cuando un fichero no cambia, git no guarda una nueva versión del fichero, sino que guarda una referencia al fichero anterior. De esta forma, git ahorra espacio en disco y tiempo de ejecución.
En resumen, un commit es un objeto que apunta a un objeto de tipo tree que apunta a uno o varios objetos de tipo blob. Un objeto de tipo blob es un archivo, un objeto de tipo tree es un directorio y un objeto de tipo commit es un snapshot del proyecto en un momento dado.

> Técnicamente, un repositorio es un **grafo dirigido acíclico** donde los nodos son objetos de git (de tipo commit, tree o blob) y las aristas son referencias entre ellos. Con ello se consigue un **filesystem** de alto nivel, inmutable, eficiente y seguro, por encima del filesystem del sistema operativo. Además, gracias a los commits, se convierte en un **version filesystem**, con **control de versiones**.

#### References: Branches and HEAD

Las **ramas** en git son simplemente **punteros a commits**. En detalle son archivos de texto plano almacenados en la carpeta `.git/refs/heads` que contienen el hash del commit al que apuntan.
dir .git\refs\heads /b

main
type .git\refs\heads\main
f1dff43f97543e83cab3f52f054cdcf9b26e8d55
```
**Crear una nueva rama** se reduce a crear un nuevo archivo en la carpeta `.git/refs/heads` con el nombre de la rama y como contenido el hash del commit un commit, que de momento será el mismo que en la rama anterior.
```shell
git branch feature
dir .git\refs\heads /b
feature
main
```
type .git\refs\heads\feature

f1dff43f97543e83cab3f52f054cdcf9b26e8d55
Si en el SO creamos un fichero con el nombre de la rama y el contenido del hash del commit, git reconocerá la rama.
echo f1dff43f97543e83cab3f52f054cdcf9b26e8d55 > .git\refs\heads\bad-way
git branch

bad-way
feature
* main
```shell
del .git\refs\heads\bad-way
git branch
feature
* main
```
La rama main aparece indicada con un asterisco porque es la **rama actual** (current branch). Eso es lo que indica el **puntero `HEAD`**
El puntero `HEAD` es un archivo de texto plano almacenado en la carpeta `.git` que contiene el nombre de la rama actual. Como se ve en el contenido del archivo, es una referencia a una referencia
```shell
type .git\HEAD
ref: refs/heads/main
```
En realidad por cada rama se crea una referencia simbólica en la carpeta `.git/refs/heads` que apunta al hash del commit al que apunta la rama.
```shell
dir .git\refs\heads /b
feature
main
```

```shell
type .git\refs\heads\main

f1dff43f97543e83cab3f52f054cdcf9b26e8d55
```
Como veremos más adelante, algunos de los comandos más importantes de Git son aquellos que permiten **mover el puntero `HEAD`** y **cambiar de rama**.
### Taller: Crear un nueva repositorio desde cero
En su libro _Gitting Things Done_, 2021, disponible en [freecodecamp](https://www.freecodecamp.org/news/gitting-things-done-book/), _Omer Rosenbaum_ propone un interesante ejercicio destinado a comprender a fondo en que consiste un repositorio deGit, consistente en crearlo desde cero y añadirle un primer commit.
Creamos una nueva carpeta y accedemos a ella.
```shell
mkdir scratch-repo
cd scratch-repo
```

Como es previsible git status nos indica que no estamos en un repositorio de git.
git status
// fatal: not a git repository (or any of the parent directories): .git
Creamos la estructura de carpetas básica de un repositorio.
```shell
mkdir -p .git
cd .git
mkdir objects
mkdir refs
cd refs
mkdir heads
cd..
cd..
tree
```
Obtenemos la siguiente estructura y volvemos a comprobar el estado del repositorio.
C:.
└───.git
    ├───objects
    └───refs
        └───heads
```shell
git status
fatal: not a git repository (or any of the parent directories): .git
```
El paso que nos falta es crear el fichero `HEAD` en la carpeta `.git` que apunte a la rama `main`.
```shell
echo ref: refs/heads/main > .git\HEAD
```

En este punto, git ya reconoce la carpeta como un repositorio.
git status
// On branch main
// No commits yet
// nothing to commit (create/copy files and use "git add" to track)
A pesar de que no existe la rama main en la carpeta `refs/heads/main`, git reconoce la rama `main` como la rama actual porque la tiene referenciada en el fichero HEAD.
#### Gestionando el repositorio con comandos plumbing
Hemos creado el repositorio simplemente con los comandos del SO, sin utilizar `git init`. Vamos a añadir un fichero al área de preparación y hacer el primer commit, pero sin utilizar los comandos porcelain, `git add` o `git commit`. En su lugar utilizaremos los comandos plumbing que subyacen a los de más alto nivel que utilizamos habitualmente.
Para crear un objeto blob, utilizamos el comando `git hash-object`, tal y como ya hemos visto, pasándole información desde el stdin.
echo Aprendiendo Git | git hash-object --stdin
// 7b31213ab333bd7eab40ce5de1185bd6565f120e
También sabemos que el modificados -w guarda el objeto en el repositorio.
```shell
echo Aprendiendo Git | git hash-object -w --stdin
tree .git
dir .git\objects\7b
```
C:.
└───.git
    ├───objects
    │   └───7b // 31213ab333bd7eab40ce5de1185bd6565f120e
    └───refs
        └───heads
Se ha creado un objeto blob en la carpeta `objects` del repositorio, con una sub-carpeta `7b` y un fichero con el nombre del resto del hash del objeto.
El comando `git cat-file` nos permite leer el tipo y el contenido del objeto.
```shell
git cat-file -t 7b31213 // blob
git cat-file -p 7b31213 // Aprendiendo Git
```
A pesar de ello, vemos que git status no refleja esta cambio
git status
Para añadir el objeto al área de preparación, necesitamos crear el indice, el fichero que contiene información sobre los hashes de los objetos que se han añadido al área de preparación. Para ello utilizaremos el comando `git update-index`.
```shell
git update-index --add --cacheinfo 100644 7b31213ab333bd7eab40ce5de1185bd6565f120e README.md
```
Indicamos la mascara del fichero a nivel del SO (100644), el hash del objeto y el nombre del fichero, que aun no existe.
EL resultado a nivel de git, es
```shell
git status
// Changes to be committed: new file:   README.md
// Changes not staged for commit: deleted:    README.md
```
El fichero está en el area de preparación, pero no en el directorio de trabajo. Para añadirlo al directorio de trabajo, crearemos el fichero con el mismo contenido que el objeto blob.
```shell
echo Aprendiendo Git > README.md
```
Y comprobamos que el fichero ha sido añadido al directorio de trabajo y aparece como staged en el área de preparación, seg´´un nos indica `git status`.
```shell
git status
// Changes to be committed: new file:   README.md
```
#### Creando un commit con comandos plumbing

El paso de la información desde la staged area al repositorio exige que creemos un objeto tree que contenga la información de los objetos que se han añadido al área de preparación. Para ello utilizamos el comando `git write-tree`. Para comprobar el contenido del objeto tree, utilizamos el comando `git cat-file`.
git write-tree // 3976f2ec82f4d61250cac1b1b26fa053439dbcae
git cat-file -t 3976f2e // tree
git cat-file -p 3976f2e // 100644 blob 7b31213ab333bd7eab40ce5de1185bd6565f120e    README.md
A nivel de carpetas, veremos que se a creado un objeto tree en la carpeta `objects` del repositorio.
```shell
tree .git
dir .git\objects\39
```
```shell
C:.
└───.git
    ├───objects
    │   └───39 // 76f2ec82f4d61250cac1b1b26fa053439dbcae
    │   └───7b // 31213ab333bd7eab40ce5de1185bd6565f120e
    └───refs
        └───heads
```
A partir del objeto tree, creamos un commit con el comando `git commit-tree`. Para ello necesitamos el hash del objeto tree, que ya conocemos.
git commit-tree 3976f2ec82f4d61250cac1b1b26fa053439dbcae -m "Initial commit" // 79aa70c84454bd9e928f0224139170837c8563c8
Nuestro objeto commit puede comprobarse con `git cat-file`.
```shell
git cat-file -t 79aa70c // commit
git cat-file -p 79aa70c // tree 3976f2ec82f4d61250cac1b1b26fa053439dbcae
```
Y nuestro repositorio refleja su existencia a nivel de carpetas pero no en el resultado de `git status`.
tree .git
dir .git\objects\79
```shell
C:.
└───.git
    ├───objects
    │   └───39 // 76f2ec82f4d61250cac1b1b26fa053439dbcae
    │   └───79 // aa70c84454bd9e928f0224139170837c8563c8
    │   └───7b // 31213ab333bd7eab40ce5de1185bd6565f120e
    └───refs
        └───heads
```
git status
// Changes to be committed:  new file:   README.md
El problema es simplemente que no se ha actualizado el puntero de la rama `main` al nuevo commit. En realidad, el fichero refs/heads/main al que hace referencia HEAD ni siquiera existe. Debemos crearlo con el hash del nuevo commit.
```shell
echo 79aa70c84454bd9e928f0224139170837c8563c8 > .git\refs\heads\main
```
De esta forma tanto `git status` como `git log` reflejarán la existencia del nuevo commit.
git status
// nothing to commit, working tree clean
git log
// commit 79aa70c84454bd9e928f0224139170837c8563c8 (HEAD -> main)
#### En resumen del Taller
Crear un nueva repositorio desde cero ha sido posible gracias a los comandos del SO y a los comandos de bajo nivel de Git, los **plumbing commands**.

Hemos creado un objeto blob, un objeto tree y un objeto commit, y hemos actualizado los punteros de la rama y HEAD para reflejar la existencia del nuevo commit. Pare ello hemos usado los siguientes comandos:

- `git hash-object`: para crear un objeto blob
- `git update-index`: para añadir el objeto al área de preparación
- `git write-tree`: para crear un objeto tree
- `git commit-tree`: para crear un objeto commit
- `git cat-file`: para leer el contenido de los objetos

### REESCRIBIENDO LA HISTORIA (2)

#### git command --amend

El comando `git commit --amend` permite modificar el último commit. Se puede utilizar para

- cambiar el mensaje del commit
- añadir ficheros al commit
- modificar ficheros del commit

```shell
git commit --amend
```
Si no se añade ningún fichero, se abrirá el editor de texto para modificar el mensaje del commit.
Si han añadido ficheros en el stage, se añadirán al commit.
git add <file>
git commit --amend
En realidad, `git commit --amend` crea un nuevo commit con los cambios del commit anterior y los nuevos cambios. El commit anterior dejara de estar vinculado a ninguna rama y se eliminará en la proxima operación del garbage collector.
El uso de amend debe limitarse a "cambios en el commit anterior", como corregir errores en el mensaje del commit, modificar los ficheros o añadir puntualmente otros nuevos, claramente vinculados a los anteriores. Para cambios de mayor envergadura es mejor práctica crear un nuevo commit.
#### rebase interactivo
Uno de los comando más potentes de Git es el rebase interactivo. Permite reescribir la historia de un repositorio, cambiando el orden de los commits, modificando los mensajes de los commits, eliminando commits, fusionando commits, etc.
git rebase -i <primer commit no incluido en el rebase >
git rebase -i HEAD~4
Como resultado se abre un editor de texto con una lista de commits que se van a reescribir. Cada línea tiene un comando y un commit.
```sh
pick 1ecb721 Mensaje del commit HEAD~3
pick 07ad6a9 Mensaje del commit HEAD~2
pick 7515002 Mensaje del commit HEAD~1
pick 7c4668d Mensaje del último commit
# Rebase 9457f43..7c4668d onto 9457f43 (4 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
# commit's log message, unless -C is used, in which case
# keep only this commit's message; -c is same as -C but
# opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# create a merge commit using the original merge commit's
# message (or the oneline, if no original merge commit was
# specified); use -c <commit> to reword the commit message
# u, update-ref <ref> = track a placeholder for the <ref> to be updated
# to this position in the new commits. The <ref> is
# updated at the end of the rebase
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```
Los comandos más comunes son
- pick: utiliza el commit
- reword: utiliza el commit, pero permite cambiar el mensaje
- edit: utiliza el commit, pero para en él para hacer cambios
- squash: fusiona el commit con el anterior
- fixup: fusiona el commit con el anterior, pero mantiene el mensaje del anterior
- drop: elimina el commit
También es posible reordenar los commits simplemente cambiando el orden de las líneas.
A partir del primer commit que cambia, todos los commits se deben reescribir, dado que su inmutabilidad impide ningún cambio en ellos.

Por ejemplo si se quiere cambiar el mensaje de un commit, se cambia el comando pick por reword. Al cerrar el editor se abrirá otro editor con el mensaje del commit, que se puede modificar.
git rebase -i HEAD~4
```shell
pick 1ecb721 Mensaje del commit HEAD~3
reword 07ad6a9 Mensaje del commit HEAD~2
pick 7515002 Mensaje del commit HEAD~1
pick 7c4668d Mensaje del último commit
```
```shell
Mensaje del commit HEAD~2
## Información de que estamos en el editor de reword
```
![git rebase i](assets/rebase_i.svg)
##### edit: modificando un commit
Edit utiliza el commit indicado para hacer cambios, incluyendo eliminar parte del contenido, añadir más contenido o separar el contenido en diversos commits. Al cerrar el editor, se abrirá una consola de Git en la que se pueden hacer los cambios deseados.
```shell
git rebase -i HEAD~4
```
```shell
pick 1ecb721 Mensaje del commit HEAD~3
pick 07ad6a9 Mensaje del commit HEAD~2
edit 7515002 Mensaje del commit HEAD~1
pick 7c4668d Mensaje del último commit
```
```shell
Stopped at 7515002...  Mensaje del commit HEAD~1
You can amend the commit now, with
  git commit --amend
Once you are satisfied with your changes, run
  git rebase --continue
```
La salida de git status nos indicara en que commit estamos y que podemos hacer cambios en él.
interactive rebase in progress; onto 9457f43
Last command done (1 command done):
   edit 1ecb721 Add new Huskies
Next commands to do (3 remaining commands):
   pick 07ad6a9 Add and configure github action
   pick 7515002 Simulate lint fail
  (use "git rebase --edit-todo" to view and edit)
You are currently editing a commit while rebasing branch 'feature/actions' on '9457f43'.
  (use "git commit --amend" to amend the current commit)
  (use "git rebase --continue" once you are satisfied with your changes)

nothing to commit, working tree clean
Como estamos editando el commit HEAD~1, empezaremos por un reset con su valor por defecto --mixed enviando todo su contenido al area de trabajo.
git reset HEAD~1
A partir de aquí podemos hacer los cambios que deseemos, añadir ficheros, eliminar ficheros, modificar ficheros, etc. y almacenarlos en tantos commits como necesitemos.
```shell
git add <files>
git commit -m "Mensaje del primer commit modificado"
git add <other files>
git commit -m "Mensaje del segundo commit modificado"
```
Una vez que hemos terminado de hacer los cambios, podemos continuar con el rebase
```shell
git rebase --continue
```
##### squash y fixup: fusionando commits
Si se quiere fusionar dos o más commits, se puede utilizar squash o fixup. La diferencia entre ambos es que squash mantiene el mensaje del commit que se va a fusionar, mientras que fixup lo elimina.
```shell
git rebase -i HEAD~4
```
```shell
pick 1ecb721 Mensaje del commit HEAD~3
pick 07ad6a9 Mensaje del commit HEAD~2
squash 7515002 Mensaje del commit HEAD~1
pick 7c4668d Mensaje del último commit
```
El comando **squash** fusiona el commit HEAD~1 con el commit anterior, HEAD~2. Al cerrar el editor, se abrirá otro editor con el mensaje de los dos commits, que se puede modificar, Seleccionando alguno de los mensajes o creando uno nuevo.
Por su parte el comando **fixup** fusiona el commit HEAD~1 con el commit anterior, HEAD~2, pero mantiene el mensaje del commit anterior, sin darnos opción a cambiarlo.
##### drop: eliminando un commit
Al indicar drop, el commit desaparece de la lista de commits a reescribir.
```shell
git rebase -i HEAD~4
```
```shell
pick 1ecb721 Mensaje del commit HEAD~3
pick 07ad6a9 Mensaje del commit HEAD~2
drop 7515002 Mensaje del commit HEAD~1
pick 7c4668d Mensaje del último commit
```
El resultado es que el commit HEAD~1 desaparece de la lista de commits a reescribir. Como consecuencia, la información de ese commit se pierde completamente.
Un posible caso sería eliminar información sensible que por error se ha incluido en un commit.
#### Otros comandos
- git stash: guarda los cambios en un commit temporal, que se almacena en una pila de cambios. Se puede recuperar en cualquier momento.
- git clean: elimina los ficheros no rastreados por Git
  - git clean -n: muestra los ficheros que se eliminarán
  - git clean -f: elimina los ficheros
- git revert: crea un nuevo commit que deshace los cambios de un commit anterior
- git bisect: busca un commit que introdujo un error
### TRABAJANDO EN PARALELO (2)
#### Cherrypick
El comando cherry-pick "copia" un commit, creando un nuevo commit en el branch actual con el mismo mensaje y patch que otro commit. Es un rebase de un solo commit.

Si en la rama actual se quiere añadir un commit de otra rama, se puede hacer con el comando `git cherry-pick`
git cherry-pick <commit>
La principal utilidad de cherry-pick es la de añadir a una o varias ramas un hotfix (solución de un problema urgente) que se ha hecho en otra rama, sin tener que hacer un merge.

El hotfix debe ser un commit atómico, es decir, que no dependa de otros commits. Esto sería una buena práctica en cualquier caso, pero en el caso de un hotfix es imprescindible.
### REPOSITORIOS REMOTOS (2) 
