<template>
  <button @click="toggleBookmark" class="bookmark-btn">
    <img :src="isBookmarked ? bookmarkedImg : unbookmarkedImg" alt="북마크 버튼" class="bookmark-icon" />
  </button>
</template>

<script setup>
import { ref } from 'vue'

// 이미지 경로
import unbookmarkedImg from '@/assets/dietpost/save_img.png'
import bookmarkedImg from '@/assets/dietpost/save_img2.png'

const isBookmarked = ref(false)

function toggleBookmark() {
  isBookmarked.value = !isBookmarked.value
}
</script>

<style scoped>
.bookmark-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.bookmark-icon {
  width: 20px;
  height: 20px;
}
</style>
