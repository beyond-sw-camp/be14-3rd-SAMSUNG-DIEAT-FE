<template>
    <table class="post-table">
        <thead>
            <tr>
                <th style="width: 35%">제목</th>
                <th style="width: 15%">작성자</th>
                <th style="width: 15%">일시</th>
                <th style="width: 10%">댓글 수</th>
                <th style="width: 10%">조회수</th>
                <th style="width: 10%">좋아요</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(post, index) in posts" :key="index" class="clickable-row">
                <td class="title-cell" @click="goToDetail(post.id)">
                    {{ post.title }}
                </td>
                <td>{{ post.author }}</td>
                <td>{{ post.date }}</td>
                <td>{{ post.comments?.length || 0 }}</td>
                <td>{{ post.views }}</td>
                <td>{{ post.likes }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
    posts: {
        type: Array,
        required: true
    }
})

const router = useRouter()

function goToDetail(postId) {
    router.push(`/readFree/${postId}`)
}
</script>