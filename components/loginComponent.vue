<template>
  <v-form v-model="valid">
    <v-text-field v-model="name" :rules="nameRules" :counter="10" label="Usuario" required></v-text-field>
    <v-text-field type="password" v-model="password" :rules="passwordRules" label="Contraseña" required></v-text-field>
    <v-btn :disabled="!valid">Login</v-btn>
  </v-form>
</template>

<script>
export default {
  name: 'loginComponent',
  data: () => ({
    valid: false,
    name: '',
    nameRules: [
      v => !!v || 'El usuario es obligatorio',
      v => v.length <= 10 || 'El nombre de usuario no puede ser mayor de 10 chars'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'La contraseña es obligatoria',
      v => v.length <= 10 || 'La contraseña no puede ser mayor de 10 chars'
    ]
  })
}
</script>

<style scoped>

</style>