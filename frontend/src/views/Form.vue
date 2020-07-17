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
import schema from '/app/config/schema.yaml'

export default {
  name: 'Form',
  data() {
    // This builds the { $table.$field } data structure for storing
    // data in the correct format for the /save route.
    let dataModel = {};
    let questions = [];

    for (let table of Object.keys(schema)) {
      for (let field of schema[table]) {
        const fullName = `${ table }.${ field.name }`;
        dataModel[fullName] = undefined;
        questions.push({...field, ...{ name: fullName }});
      }
    }

    return { dataModel, questions, errors: [] };
  },
  computed: {
    uuid() { return this.$store.state.uuid },
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
