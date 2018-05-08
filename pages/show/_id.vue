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
