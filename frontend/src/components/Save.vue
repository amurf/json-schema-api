<template>
  <div>
    <h2>Current schema</h2>
    <pre>{{ schema }}</pre>
  </div>
</template>

<script>
export default {
  name: "Save",
  props: [ "schema" ],
}
</script>
