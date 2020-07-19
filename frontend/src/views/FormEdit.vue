<template>
  <div>
    <h1>Select form to edit</h1>
    <div class='form-edit'>
      <button v-for="form in forms" @click="edit(form)">{{ form }}</button>
    </div>

    <template v-if="formName">
      <h1>Fields</h1>

      <h2>Current Fields</h2>
      <div class='edit-field' v-for="field in form">
        <label>Label:
        <input type="text"  v-model="field.label" />
        </label>

        <label>
          Schema reference
        <select v-model='field.name'>
          <option v-for="field in availableFields">{{ field }}</option>
        </select>
        </label>
      </div>

      <h2>Add new field</h2>
      <input v-model="newLabel" type="text">
      <select v-model='newName'>
        <option v-for="field in availableFields">{{ field }}</option>
      </select>
      <button @click="add()">Add</button>
    </template>
  </div>
</template>

<script>
export default {
  name: "FormEditor",
  data() {
    return {
      form: {},
      formName: '',
      newLabel: '',
      newName: '',
    }
  },
  computed: {
    forms() { return Object.keys(this.$store.state.forms) },
    schema() { return this.$store.state.schema },
    availableFields() {
      let fields = [];
      for (const table of Object.keys(this.schema)) {
        for (const field of Object.keys(this.schema[table])) {
          fields.push(`${ table }.${ field }`);
        }
      }

      return fields;
    },
  },
  methods: {
    edit(form) {
      this.formName = form;
      this.form = this.$store.state.forms[form];
    },
    add() {
      this.$store.dispatch('addField', { form: this.formName, name: this.newName, label: this.newLabel });
    },
  },
  created() {
  },
}
</script>
<style scoped>
</style>
