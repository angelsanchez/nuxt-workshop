<template>
  <div>
    <input id="val1" type="text" v-model="val1">
    <p id="val1p">{{val1}}</p>
    <component1></component1>
  </div>
</template>

<script>
import component1 from './component1'
export default {
  name: 'marco',
  components: {
    component1
  },
  data() {
    return {
      val1: 'value1'
    }
  },
}
</script>

<style scoped>

</style>