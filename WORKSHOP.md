# Taller Introducción a Nuxt

## Requisitos
- Node >= 8.0.0
- Npm >= 5.0.0

## ¿Qué es Nuxt?
Nuxt es un framework para hacer aplicaciones web usando otro framework llamado Vue.
Con Nuxt podemos hacer páginas que sean SPA, Universal SSR o estáticas.


¿Necesitamos Nuxt para hacer una página Universal SSR?
No. Podemos hacerlo perfectamente sin Nuxt usando solo Vue, pero nos ahorra mucho tiempo de configuración e instalación.


### ¿Que nos ahorramos usando Nuxt?
- Tener que encargarnos de la transpilacion de codigo ES6/ES7 para que navegadores que no lo soportan (babel)
- Minificar CSS/JS y preparar los bundles (webpack)
- Configurar preprocesadores de css: sass, less, stylus, etc..
- Configurar el code splitting para cada página
- Todo el sistema de routing de las páginas que componen nuestra aplicación, incluyendo un mecanismo para carga de datos asíncrona
- Instalación (e integración) con Vuex
- Configurar la app para hacer universal SSR (Server-Side Renderer)
- Configuración para servir ficheros estáticos
- Configurar alguna libreria para gestionar los headers de la página (para que sea SEO friendly)

Más información en: https://nuxtjs.org/guide

## ¡Manos a la obra!
Creamos la aplicación

Si no tenemos instalado vue-cli, primero ejecutar:
```
npm i -g vue-cli
```

Vamos a usar el project template más básico de todos:
```
vue init nuxt-community/starter-template tvmaze-app
cd tvmaze-app
npm install
```

Podríamos haber usado alguno que ya incluyera vuetify por ejemplo, pero así aprendemos como instalarlo.

Levantamos el servidor web para desarrollo:

```
npm run dev
```

Podemos ver la aplicación en: http://localhost:3000/

## Añadimos una página
Nuxt nos instala internamente `vue-router` y lo deja configurado para que haga routing con los ficheros dentro de la carpeta `pages`.

Vamos a añadir una página de ejemplo `~/pages/search.vue`:

```
<template>
  <h1>Search Page</h1>
</template>
```

http://localhost:3000/search

Vamos a añadir un enlace a la página index:
```
<template>
  <div>
    <h1>Search Page</h1>
    <a href="/">Index</a>
  </div>
</template>
```

Si añadimos un enlace `<a>` se realiza una navegación “tradicional” realizando una petición a la página destino y recargando la página. Esto no es lo que queremos.

Queremos que se haga la navegación en __cliente__ pero los enlaces sean indexables. Esto lo conseguimos con el componente `<nuxt-link>`
```
<template>
  <div>
    <h1>Search Page</h1>
    <nuxt-link to="/">Index</nuxt-link>
  </div>
</template>
```

Si probamos la navegación otra vez, veremos que solo carga el js necesario para la página index (code splitting)


## Rutas dinámicas
Para crear la ruta `/show/:id` basta con añadir el fichero `~/pages/show/_id.vue`

```
<template>
  <div>
    Show {{ showId }}
  </div>
</template>

<script>
export default {
  asyncData ({params}) {
    return {showId: params.id}
  }
}
</script>
```

Ya podemos visitar: http://localhost:3000/show/1

## Carga asíncrona de datos

Siguiendo con la página show vamos a usar la función `asyncData` para cargar datos de un `show` usando el API público de tvmaze.

### Instalamos axios

Axios es una librería que nos va a permitir hacer llamadas http tanto en cliente como en servidor.

```
npm i -S axios
```

Si importamos axios en muchas páginas se añadiría al bundle de cada una. Para solo añadirlo una vez en toda la aplicación lo añadimos al listado de vendors en `nuxt.config.js`:

```
{
  vendors: ['axios']
}
```

### Cargamos la información de un show

Modificamos `~/pages/show/_id.vue`:

```
<template>
  <div>
    {{ show }}
  </div>
</template>

<script>
import axios from 'axios'
export default {
  async asyncData ({params}) {
    const {data: show} = await axios.get(`http://api.tvmaze.com/shows/${params.id}`)
    return {show}
  }
}
</script>
```

## Instalando vuetify

```
$ npm i -S @nuxtjs/vuetify
```

Añadimos el module en `nuxt.config.js`:
```
{
  modules: [
    '@nuxtjs/vuetify'
  ]
}
```

## Layouts

Nuxt nos permite crear layouts y utilizarlos en nuestras páginas.
Vamos a cambiar el que viene por defecto para pintar algo más bonito:

Modificamos `~/layouts/default.vue`:

```
<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list dense>
        <v-list-tile nuxt to="/">
          <v-list-tile-action>
            <v-icon>search</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Search</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>TVMaze Example</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: true
    })
  }
</script>
```

## Creamos nuestro buscador de series

Modificamos `~/pages/index.vue`:

```
<template>
  <v-container>
    <v-form ref="form" v-model="valid" @submit.prevent="submit">
      <v-text-field v-model="searchText" :rules="searchTextRules" label="Show name" required
      ></v-text-field>
      <v-btn :disabled="!valid" @click="submit">
        Search
      </v-btn>
    </v-form>
    <v-list v-if="searchResults">
      <v-list-tile v-for="{show} in searchResults" :key="show.id" avatar nuxt :to="`/show/${show.id}`">
        <v-list-tile-avatar>
          <img v-if="show.image" :src="show.image.medium">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="show.name"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    valid: true,
    searchText: '',
    searchResults: null,
    searchTextRules: [v => !!v || 'Please, enter some text']
  }),
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        const {data: shows} = await axios.get(`http://api.tvmaze.com/search/shows?q=${encodeURIComponent(this.searchText)}`)
        this.searchResults = shows
      }
    }
  }
}
</script>
```

## Mostramos la informacion de una serie

Modificamos `~/pages/show/_id.vue`:

```
<template>
  <v-container>
    <img v-if="show.image" :src="show.image.medium">
    <h1>{{ show.name }}</h1>
    <v-chip v-for="genre in show.genres" :key="genre" label>
      {{ genre }}
    </v-chip>
    <p v-html="show.summary"></p>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  async asyncData ({params}) {
    const {data: show} = await axios.get(`http://api.tvmaze.com/shows/${params.id}`)
    return {show}
  }
}
</script>
```

## Vuex

Ahora mismo ya tenemos una aplicación "funcional". Tenemos una página en la que podemos buscar series y otra página que muestra información más detalla de una serie.

Problemas: el estado de nuestra página reside de forma local en cada página. Si buscamos una serie, navegamos a los detalles y volvemos al buscador, perdemos el estado de la búsqueda. Además no tenemos forma fácil de compartir la información que vamos cargando entre todos los componentes de la aplicación.


__No se puede hacer ninguna aplicación web compleja sin utilizar alguna librería que gestione el estado.__


Nuxt busca el siguiente fichero y si existe: importa Vuex, lo añade a vendors, y le pasa el store a la instancia de Vue de nuestra app:

Creamos el fichero `~/store/index.js`:

```
import Vuex from 'vuex'
import axios from 'axios'

const createStore = () => {
  return new Vuex.Store({
    strict: true,
    state: {
      searchText: '',
      searchResults: null,
      show: null
    },
    mutations: {
      updateSearchText (state, payload) {
        state.searchText = payload
      },
      updateSearchResults (state, payload) {
        state.searchResults = payload
      },
      updateShow (state, payload) {
        state.show = payload
      }
    },
    actions: {
      async searchShows ({ commit, state }) {
        const {data: shows} = await axios.get(`http://api.tvmaze.com/search/shows?q=${encodeURIComponent(state.searchText)}`)
        commit('updateSearchResults', shows)
      },
      async getShow ({ commit }, showId) {
        const {data: show} = await axios.get(`http://api.tvmaze.com/shows/${showId}`)
        commit('updateShow', show)
      }
    }
  })
}

export default createStore
```

Ahora cambiamos nuestro buscador para use el store para establecer el texto de búsqueda y pintar los resultados.
Además cuando se busquen shows se va a lanzar una acción `searchShows` en el store:

Modificamos `~/pages/index.vue`:
```
<template>
  <v-container>
    <v-form ref="form" v-model="valid" @submit.prevent="submit">
      <v-text-field v-model="searchText" :rules="searchTextRules" label="Show name" required></v-text-field>
      <v-btn :disabled="!valid" @click="submit">
        Search
      </v-btn>
    </v-form>

    <v-list v-if="searchResults">
      <v-list-tile v-for="{show} in searchResults" :key="show.id" avatar nuxt :to="`/show/${show.id}`" @click="selectShow(show)">
        <v-list-tile-avatar>
          <img v-if="show.image" :src="show.image.medium">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="show.name"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    valid: true,
    searchTextRules: [v => !!v || 'Please, enter some text']
  }),
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('searchShows')
      }
    },
    selectShow (show) {
      this.$store.commit('updateShow', show)
    }
  },
  computed: {
    searchText: {
      get() {
        return this.$store.state.searchText
      },
      set(value) {
        this.$store.commit('updateSearchText', value)
      }
    },
    searchResults: {
      get() {
        return this.$store.state.searchResults
      }
    }
  }
}
</script>
```

Cambiamos nuestro detalles de un show para que lea la información del store.
Hemos optimizado esta página, ya que pinta el show si ya esta la información en el `state` o lanza una acción `getShow` para cargar sus datos.
Con esto evitamos que se haga una petición extra para cargar los datos del show cuando venimos del buscador porque hacemos un `updateShow` cuando pulsamos un resultado de la búsqueda.

Modificamos `~/pages/show/_id.vue`:

```
<template>
  <v-container>
    <img v-if="show.image" :src="show.image.medium">
    <h1>{{ show.name }}</h1>
    <v-chip v-for="genre in show.genres" :key="genre" label>
      {{ genre }}
    </v-chip>
    <p v-html="show.summary"></p>
  </v-container>
</template>

<script>
export default {
  async fetch ({store, params}) {
    if (!store.state.show) {
      await store.dispatch('getShow', params.id)
    }
  },
  computed: {
    show: {
      get() {
        return this.$store.state.show
      }
    }
  }
}
</script>
```

Por último vamos a añadir un elemento más al menú principal de la aplicación para demostrar lo sencillo que es ahora pintar cualquier dato de la aplicación en cualquier componente, sin importar donde este.

Modificamos `~/layouts/default.vue`:

```
<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list dense>
        <v-list-tile nuxt to="/">
          <v-list-tile-action>
            <v-icon>search</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Search</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="$store.state.show" nuxt :to="`/show/${$store.state.show.id}`">
          <v-list-tile-action>
            <v-icon>start</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $store.state.show.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>TVMaze Example</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: true
    })
  }
</script>
```
