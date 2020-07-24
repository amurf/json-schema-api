<template>
  <card>

  <template v-slot:header>
    CADC
  </template>

  <template v-slot:content>

    <!-- Not logged in -->
    <template v-if="!uuid">
      Click start to begin, if you have a login token enter it below:
      <br>
      <input class='border p-1' placeholder="Login token" v-model="loginToken" />
    </template>

    <!-- Logged in, show content -->
    <template v-else>
      <h2>First let's get some information about your organisation</h2>

      <textfield id="organisation.name"
                 label="What is the organisation name?"
                 v-model="dataModel['organisation.name']" />

      <textfield id="organisation.suburb"
                 label="What is the organisation suburb?"
                 v-model="dataModel['organisation.suburb']"/>

      <div class='my-5'>
        <label for="clients_method">What is the method?</label>
        <select class='border' id="clients_method" v-model="dataModel['contract.clients_method']">
          <option v-for="option in schema.contract.clients_method.enum" :value="option"> {{ option }} </option>
        </select>
      </div>

      <textfield id="organisation.comments"
                 label="Any comments about this form?"
                 v-model="dataModel['organisation.comments']"/>
    </template>

  </template>

  <template v-slot:footer>

    <template v-if="!uuid">
      <button @click="start">Start</button>
    </template>

    <template v-else>
      <button @click="save">Save</button>
      <button @click="fetch">Update</button>
    </template>

  </template>

  </card>
</template>
<script>
import axios from 'axios'
import Textfield from '@/components/Textfield';
import Card from '@/components/Card';

export default {
  name: 'CADC',
  components: { Card, Textfield },
  data() {
    return {
      loginToken: '',
      dataModel: {},
      errors: [],
    };
  },
  computed: {
    uuid() { return this.$store.state.uuid },
    schema() { return this.$store.state.cadc },
  },
  methods: {
    async fetch() {
      let contract     = await axios.get(`/api/contract/${ this.uuid }`);
      let organisation = await axios.get(`/api/organisation/${ this.uuid }`);
      this.dataModel   = { ...contract.data, ...organisation.data };
    },
    async start() {
      if (this.loginToken) {
        await this.$store.commit('setUUID', this.loginToken);
      } else {
        await this.$store.dispatch('start');
      }

      await this.fetch();
    },
    async save() {
      try {
        let response = await axios.post(`/api/save/${ this.uuid }`, this.dataModel);
        alert("Saved successfully");
      } catch(error) {
        this.errors = error.response.data;
      }
    },
  },
}
</script>
<style scoped>
button {
  @apply border rounded;
  padding: 0.5em;
}

label {
  display: block;
}

</style>
