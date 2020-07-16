<template>
  <div class="form">
    <h2>Fill in the questions</h2>

    <div class="errors" v-if="errors.length">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>

      <!--
        this could be done outside of the template with an object to map
        { $type => COMPONENT } and use <component :is="map[type]"

        This is just a proof of concept really below.
      -->
    <div v-for="question in questions">
      <label>{{ question.name }}:{{ question.type }}</label>
      <input v-if="question.type === 'number'" v-model.number="dataModel[question.name]" type="text" />
      <input v-else v-model="dataModel[question.name]" type="text" />

    </div>
    <pre>{{ dataModel }}</pre>
    <button @click="save()">Save data</button>
  </div>
</template>
<script>
import axios from 'axios'

// Would wrap this in composition api to add additional
// helper functions to prevent copy-paste.
import schema from '@/schema.yaml'

export default {
  name: 'Form',
  data() {
    let dataModel = {};
    for (let table of Object.keys(schema)) {
      for (let field of schema[table]) {
        dataModel[`${ table }.${ field.name }`] = undefined;
      }
    }

    return { dataModel, errors: [] };
  },
  computed: {
    uuid() { return this.$store.state.uuid },
    questions() {
      return Object.keys(schema).reduce((accum, elem) => {
        for (let field of schema[elem]) {
          accum.push({
            name: `${ elem }.${ field.name }`,
            type: field.type,
          });
        }
        return accum;
      }, []);
    }
  },
  methods: {
    async save() {
      try {
        let response = await axios.post(`/api/save/${ this.uuid }`, this.dataModel);
        alert("Saved successfully");
      } catch(error) {
        this.errors = error.response.data;
      }
    },
  },
  created() {
    if (!this.uuid) {
      this.$router.push({name: 'Home'});
    }
  },
}
</script>
<style scoped>

button {
  padding: 0.5em;
}

li {
  list-style: none;
}

.errors {
  color: red;
}

</style>
