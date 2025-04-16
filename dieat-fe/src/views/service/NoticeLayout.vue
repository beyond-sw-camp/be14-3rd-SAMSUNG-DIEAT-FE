<template>
    <div class="notice-page">
        <h1 class="page-title">공지 사항</h1>

        <div class="card-list">
            <div class="card" v-for="post in noticePosts" :key="post.id" @click="goToDetail(post.id)">
                <div class="card-title" :class="{ 'animate-title': hoveredId === post.id }">
                    {{ post.title }}
                </div>
                <div class="card-meta">
                    <span>📅 {{ post.date }}</span>
                    <span>👁️ {{ post.count }}</span>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '@/components/common/Footer.vue'

const router = useRouter()
const noticePosts = ref([])
const hoveredId = ref(null)

function goToDetail(id) {
    router.push(`/noticeDetail/${id}?from=list`)
}

onMounted(async () => {
    const res = await fetch('http://localhost:3000/notices')
    const data = await res.json()
    noticePosts.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
})
</script>

<style scoped>
.notice-page {
    max-width: 1024px;
    margin: 0 auto;
    padding: 2rem;
    background-color: var(--color-background);
}

.page-title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
}

.card-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 4rem;
}

.card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    padding: 1.5rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card:hover .card-title {
    animation: pulseColor 1.2s infinite;
}

.card-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #222;
    text-decoration: none;
    transition: transform 0.2s ease;
}

.card-meta {
    font-size: 0.9rem;
    color: gray;
    display: flex;
    justify-content: space-between;
}

@keyframes pulseColor {
    0% {
        color: var(--color-primary);
    }

    50% {
        color: var(--color-accent);
    }

    100% {
        color: var(--color-primary);
    }
}
</style>