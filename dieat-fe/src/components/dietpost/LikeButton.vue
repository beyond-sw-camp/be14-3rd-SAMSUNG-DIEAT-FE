<template>
  <div class="like-button" @click="toggleLike">
    <img :src="isLiked ? likedIcon : unlikedIcon" alt="좋아요 아이콘" />
    <span>{{ likeCount }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import unlikedIcon from '@/assets/dietpost/like1.png'
import likedIcon from '@/assets/dietpost/like2.png'

const props = defineProps({
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update'])

const isLiked = ref(false)
const likeCount = ref(props.count)

// ✅ props.count가 바뀌면 반영되도록 감시
watch(() => props.count, (newCount) => {
  likeCount.value = newCount
})

function toggleLike() {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
  emit('update', likeCount.value)
}
</script>

<style scoped>
.like-button {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.like-button img {
  width: 16px;
  height: 16px;
}
</style>
