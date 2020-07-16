<template>
  <div class="home">
    <button @click="start()">Start</button>
    <h1> {{ this.uuid }} </h1>
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
