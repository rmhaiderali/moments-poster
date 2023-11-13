<script setup>
defineProps({ message: String })
</script>

<template>
  <div className="py-3">
    <div className="alert rounded-2 text-accent text-center">{{ message }}</div>
  </div>
</template>
