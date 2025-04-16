<template>
    <div class="comment-list-wrapper">
        <h3 class="comment-list-title">댓글 {{ comments.length }}개</h3>

        <ul class="comment-list" v-if="sortedComments.length">
            <li v-for="(comment, index) in sortedComments" :key="index" class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">{{ comment.author }}</span>
                    <span class="comment-date">{{ comment.date }}</span>
                </div>
                <div class="comment-content">
                    {{ comment.content }}
                </div>
            </li>
        </ul>

        <p v-else class="no-comment">댓글이 없습니다.</p>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    comments: {
        type: Array,
        required: true
    }
})

const sortedComments = computed(() =>
    [...props.comments].sort((a, b) => {
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.id - b.id; // 날짜 같으면 id 오름차순
    })
);
</script>