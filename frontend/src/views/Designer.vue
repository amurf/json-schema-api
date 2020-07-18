<template>
  <div class="api-designer">

    <router-link :to="{name: 'Add table'}">Add new table</router-link>
    -
    <router-link :to="{name: 'Add table'}">Save design</router-link>

    <h1>Tables</h1>
    <router-link class='edit-link' v-for="table in tables" :key="table"
                 :to="{name: 'Table Details', params: { name: table } }">
      Edit {{ table }}
    </router-link>

    <router-view :schema="schema"></router-view>


  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'Designer',
  data() {
    return {
      schema: {},
      showAddTable: false,
      tableName: '',
      newColumn: {
        name: undefined,
        type: undefined,
      },
    };
  },
  computed: { 
    tables() {
      return Object.keys(this.schema);
    },
  },
  methods: {
    addTable() {
      this.$set(this.schema, this.tableName, {});
    }
  },
  created() {
  },
}
</script>
<style scoped>
.edit-link { display: block; }

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

.table-form {
  padding: 1em;
  margin-top: 1em;
}

</style>
