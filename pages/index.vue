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
