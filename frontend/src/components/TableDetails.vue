<template>
  <div>
    <h2>Editing {{ $route.params.name }}</h2>

    <h3> Columns </h3>
    <p v-if="columns.length == 0">No columns.</p>

    <ul>
      <li v-for="column in columns">
        {{ column }}, {{ editing[column].type }}
        <button @click="$delete(schema[$route.params.name], column)">Delete</button>
      </li>
    </ul>

    <h3>Add column</h3>
    <input type="text" v-model="columnName" placeholder="name" />
    <input type="text" v-model="columnType" placeholder="type" />
    <button @click="add()">Add column</button>


  </div>
</template>

<script>
export default {
  name: "TableDetails",
  props: [ 'schema' ],
  data() { 
    return {
      columnType: '',
      columnName: '',
    }
  },
  computed: {
    editing() {
      return this.schema[this.$route.params.name];
    },
    columns() {
      return Object.keys(this.editing);
    },
  },
  methods: {
    add() {
      this.$set(this.editing, this.columnName, { type: this.columnType });
      this.columnType = '';
      this.columnName = '';
    },
  },
  created() {
    console.log(this.schema);
    if (this.schema.hasOwnProperty(this.$route.params.name) === false) {
      console.log("Byeeee");
      this.$router.push({name: 'Designer'});
    }
  },
}
</script>
<style scoped>
</style>
