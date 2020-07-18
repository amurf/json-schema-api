<template>
  <div class='table-form'>
    <h2>Add table</h2>
    <label for="table-name">Table name</label>
    <input type="text" v-model="tableName" id="table-name" />
    <br>
    <button @click="addTable()">Add</button>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'Designer',
  props: [ 'schema' ],
  data() {
    return {
      tableName: '',
    };
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
