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
      <question-label :data-model="dataModel" :for="question.name" :label="question.label" />
      <input v-if="question.type === 'number'" v-model.number.lazy="dataModel[question.name]" :id="question.name" type="text" />
      <input v-else v-model.lazy="dataModel[question.name]" :id="question.name" type="text" />
    </div>

    <pre>{{ dataModel }}</pre>
    <button @click="save()">Save data</button>
  </div>
</template>
<script>
import axios from 'axios'
import QuestionLabel from '@/components/QuestionLabel';

// Would wrap this in composition api to add additional
// helper functions to prevent copy-paste.
import schema from '/app/config/schema.yaml'
import forms  from '/app/config/forms.yaml'

export default {
  name: 'Form',
  components: { QuestionLabel },
  data() {
    // This builds the { $table.$field } data structure for storing
    // data in the correct format for the /save route.
    let dataModel = {};
    return { dataModel, currentForm: 'registration', errors: [] };
  },
  computed: {
    uuid() { return this.$store.state.uuid },
    questions() {
      return forms[this.currentForm].map(item => {
        const [table, name] = item.name.split('.');
        return { ...item, ...schema[table][name] };
      });
    },
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

label {
  display: block; 
}

</style>
