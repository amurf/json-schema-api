<template>
  <div class="form">
    <h1>Example form</h1>

    <!-- no session -->
    <template v-if="!currentForm && !uuid">
      <button @click="start()">Start</button>
    </template>

    <template v-else>
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

        <div>
          <button v-if="currentForm == 'serviceRegistration'" @click="currentForm = 'organisationRegistration'">Prev</button>
          <button v-if="canNavigate" @click="currentForm = 'serviceRegistration'">Next</button>
        </div>


        <br>
        <button @click="save()">Submit</button>
    </template>
  </div>
</template>
<script>
import axios from 'axios'
import QuestionLabel from '@/components/QuestionLabel';
export default {
  name: 'Form',
  components: { QuestionLabel },
  data() {

    let path = ['organisationRegistration', 'serviceRegistration'];
    let dataModel = {};
    return {
      dataModel,
      path,
      errors: [],
      currentForm: '',
    };
  },
  computed: {
    uuid() { return this.$store.state.uuid },
    schema() { return this.$store.state.schema },
    forms() { return this.$store.state.forms },
    form() { return this.forms[this.currentForm] || [] },
    questions() {
      return this.form.map(item => {
        const [table, name] = item.name.split('.');
        return { ...item, ...this.schema[table][name] };
      });
    },
    canNavigate() {
      const validFields = this.questions.reduce((accum, item) => {
        if (this.dataModel[item.name]) {
          return accum + 1;
        }
        return accum;
      }, 0);

      return (validFields == this.questions.length);
    },
  },
  methods: {
    async start() {
      await this.$store.dispatch('start');
      this.currentForm = this.path[0];
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
  created() {
    if (this.uuid) {
      this.currentForm = 'organisationRegistration';
    }
  },
}
</script>
<style scoped>
</style>
