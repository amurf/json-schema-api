<template>
  <div class='my-5'>
    <label :for="id">{{ label }}</label>
    <input :id="id" type="text" :value="value" @input="$emit('input', $event.target.value)" />
  </div>
</template>

<script>
export default {
  props: ['id', 'label', 'value'],
};
</script>
<style scoped>
input {
  @apply border;
}

label {
  display: block;
}
</style>
