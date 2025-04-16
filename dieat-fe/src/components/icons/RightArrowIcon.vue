<template>
  <img :class="$style.icon" alt="다음 주" src="@/assets/right-arrow.svg" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: "RightArrowIcon"
})
</script>

<style module>
.icon {
  width: 100%;
  position: relative;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  object-fit: contain;
  cursor: pointer;
}
</style> 