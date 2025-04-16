<template>
    <main class="post-detail-page-container">
        <h2 class="page-title animated-title" @click="goToList">자유 게시글</h2>

        <div class="container" v-if="post">
            <div class="post-card">
                <PostDetailHeader :post="post" :likes="likes" />
                <PostContent :content="post.content" :imageUrl="post.imageUrl" />
            </div>

            <PostInteraction :initialLikes="likes" :commentCount="comments.length" :liked="likedByUser"
                @toggle-like="handleLikeToggle" />

            <PostCommentInput @submit="handleAddComment" />
            <PostCommentList :comments="comments" />
        </div>

        <div v-else class="loading">게시글을 불러오는 중입니다...</div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PostDetailHeader from '@/components/post/free/PostHeader.vue'
import PostContent from '@/components/post/free/PostContent.vue'
import PostCommentInput from '@/components/post/free/PostCommentInput.vue'
import PostCommentList from '@/components/post/free/PostCommentList.vue'
import PostInteraction from '@/components/post/free/PostInteraction.vue'

import { fetchPostById } from '@/api/freePostApi.js'

const user = { id: 1, nickname: '50071' }
const route = useRoute()
const router = useRouter()
const postId = route.params.postId
const isFromWrite = route.query.fromWrite === 'true'

const post = ref(null)
const comments = ref([])
const likes = ref(0)
const likedByUser = ref(false)

const goToList = () => router.push('/readFree')

onMounted(async () => {
    try {
        const fetched = await fetchPostById(postId)
        if (!fetched) {
            console.error('해당 게시글을 찾을 수 없습니다.')
            return
        }

        // 등록 직후 접근이 아니라면 조회수 증가
        if (!isFromWrite) {
            const updatedViews = (fetched.views || 0) + 1
            await fetch(`http://localhost:3000/freeposts/${postId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ views: updatedViews })
            })
            fetched.views = updatedViews
        }

        post.value = fetched

        // 댓글 정리
        comments.value = (fetched.comments || []).map((c, i) => ({
            id: c.id ?? i + 1,
            ...c
        })).sort((a, b) => {
            const dateCompare = new Date(a.date) - new Date(b.date)
            if (dateCompare !== 0) return dateCompare
            return a.id - b.id
        })

        likes.value = fetched.likes || 0

        // 좋아요 상태 로컬스토리지에서 확인
        const likedKey = `liked_post_${postId}_user_${user.id}`
        likedByUser.value = isFromWrite ? false : localStorage.getItem(likedKey) === 'true'
    } catch (err) {
        console.error('상세 게시글 로딩 실패:', err)
    }
})

function handleAddComment(newContent) {
    const maxId = comments.value.length > 0
        ? Math.max(...comments.value.map(c => c.id || 0))
        : 0

    const newComment = {
        id: maxId + 1,
        author: user.nickname,
        content: newContent,
        date: new Date().toISOString().slice(0, 10)
    }

    comments.value.push(newComment)
    comments.value.sort((a, b) => {
        const dateCompare = new Date(a.date) - new Date(b.date)
        if (dateCompare !== 0) return dateCompare
        return a.id - b.id
    })

    fetch(`http://localhost:3000/freeposts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: comments.value })
    }).catch(err => {
        console.error('댓글 저장 실패:', err)
        alert('댓글 저장 중 오류가 발생했습니다.')
    })
}

function handleLikeToggle() {
    const likedKey = `liked_post_${postId}_user_${user.id}`

    if (likedByUser.value) {
        likes.value = Math.max(0, likes.value - 1)
        likedByUser.value = false
        localStorage.removeItem(likedKey)
    } else {
        likes.value++
        likedByUser.value = true
        localStorage.setItem(likedKey, 'true')
    }

    fetch(`http://localhost:3000/freeposts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: likes.value })
    }).catch(err => {
        console.error('좋아요 저장 실패:', err)
    })
}
</script>

<style src="@/assets/post/readFreeDetail.css"></style>

<style scoped>
.animated-title {
    cursor: pointer;
    transition: transform 0.2s ease;
}

.animated-title:hover {
    transform: scale(1.05);
    animation: pulseColor 1.2s infinite;
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