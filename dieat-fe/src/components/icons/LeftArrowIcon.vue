<template>
  <img :class="$style.icon" alt="이전 주" src="@/assets/left-arrow.svg" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: "LeftArrowIcon"
})
</script>

<style module>
.icon {
  width: 100%;
  position: relative;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  cursor: pointer;
}
</style> 