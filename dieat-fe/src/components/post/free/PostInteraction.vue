<template>
    <div class="post-interaction">
        <span class="like" :class="{ liked: liked, clicked: animate }" @click="handleToggle">
            {{ liked ? '💚' : '🩶' }} 좋아요 {{ likes }}
        </span>
        <span>댓글 {{ commentCount }}</span>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    initialLikes: Number,
    commentCount: Number,
    liked: Boolean
});

const emit = defineEmits(['toggle-like']);

const likes = ref(props.initialLikes);
const liked = ref(props.liked);

const animate = ref(false);

watch(() => props.initialLikes, val => (likes.value = val));
watch(() => props.liked, val => (liked.value = val));

function handleToggle() {
    emit('toggle-like');
    animate.value = true;

    // 클래스 잠깐 넣었다가 제거 (0.3초 뒤)
    setTimeout(() => {
        animate.value = false;
    }, 300);
}
</script>

<style scoped>
.like {
    display: inline-block;
    cursor: pointer;
    user-select: none;
    transition: transform 0.2s ease;
}

.like.clicked {
    animation: pop 0.3s ease;
}

@keyframes pop {
    0% {
        transform: scale(1);
    }

    40% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}
</style>