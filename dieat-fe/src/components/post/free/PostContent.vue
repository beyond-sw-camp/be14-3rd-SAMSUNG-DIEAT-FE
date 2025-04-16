<template>
    <div class=".post-content-box">
        <img v-if="imageUrl" :src="imageUrl" alt="게시글 이미지" class="post-image" />
        <p class="post-text">{{ content }}</p>
    </div>
</template>
<script setup>
defineProps({
    content: String,
    imageUrl: String
});
</script>