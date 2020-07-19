<template>
  <div class="home">

    <h1>Form example</h1>
    <router-link to="/form">Form</router-link>

    <h1>API Designer</h1>
    <router-link to="/designer">Designer</router-link>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
}
</script>
<style scoped>

button {
  padding: 0.5em;
}
</style>
