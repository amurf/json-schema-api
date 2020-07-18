<template>
  <div class="home">

    <h1>Form example</h1>
    <button @click="start()">Start</button>
    <h1>API Designer</h1>
    <router-link to="/designer">Designer</router-link>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  computed: {
    uuid() {
      return this.$store.state.uuid;
    },
  },
  methods: {
    async start() {
      await this.$store.dispatch('start');
      this.$router.push({ name: 'Form' });
    },
  },
}
</script>
<style scoped>

button {
  padding: 0.5em;
}
</style>
