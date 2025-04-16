<!-- src/components/common/Dropdown.vue -->
<template>
  <ul class="dropdown-menu">
    <li
      v-for="(item, index) in items"
      :key="index"
      @click="$emit('select', item)"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  }
});
</script>

<style scoped>
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 5px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  list-style: none;
  padding: 0;
  width: 180px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  z-index: 1000;
}

.dropdown-menu li {
  padding: 10px 15px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f5f5f5;
}
</style>
