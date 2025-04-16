<template>
    <div class="comment-input-wrapper">
        <textarea v-model="comment" placeholder="댓글을 입력해 주세요." class="comment-textarea"></textarea>
        <button class="submit-button" @click="submitComment">등록</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const comment = ref('');
const emit = defineEmits(['submit']);

function submitComment() {
    if (comment.value.trim()) {
        emit('submit', comment.value.trim());
        comment.value = '';
    }
}
</script>