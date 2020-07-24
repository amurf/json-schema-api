<template>
  <div class="home">
    <h1>CADC</h1>
    <router-link to="/cadc">CADC</router-link>

    <h1>Form example</h1>
    <router-link to="/form">Form</router-link>
    <br>
    <router-link to="/editor">Edit</router-link>

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
</style>
