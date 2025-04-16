<template>
    <div class="post-header">
        <h3 class="post-title">{{ post.title }}</h3>
        <div class="post-meta">
            <span class="meta-item">작성자 | {{ post.author }}</span>
            <span class="meta-item">작성일 | {{ post.date }}</span>
            <span class="meta-item">조회수 | {{ post.views }}</span>
            <span class="meta-item">좋아요 | {{ likes }}</span>
        </div>
    </div>
</template>

<script setup>
defineProps({
    post: Object,
    likes: Number
});
</script>