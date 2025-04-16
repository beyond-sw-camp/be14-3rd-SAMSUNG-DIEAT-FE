<template>
    <main class="post-write-page">
        <h2 class="page-title">자유 게시글 작성</h2>

        <div class="write-form">
            <div class="write-section">
                <label class="write-label">글 제목</label>
                <input v-model="title" type="text" placeholder="글의 제목을 입력하세요." class="write-input" />
            </div>

            <div class="write-section">
                <label class="write-label">본문 내용</label>
                <textarea v-model="content" placeholder="본문 내용을 입력하세요." class="write-textarea" />
            </div>

            <div class="write-section">
                <label class="write-label">이미지 등록</label>
                <div class="image-upload-box">
                    <span>+ 이미지 선택</span>
                    <input type="file" @change="handleImageUpload" />
                </div>
                <img v-if="previewUrl" :src="previewUrl" class="post-image" />
            </div>

            <div class="submit-button-wrapper">
                <button class="submit-button" @click="submitPost">등록</button>
                <button class="cancel-button" @click="cancelPost">취소</button>
            </div>
        </div>
    </main>

    <SuccessModal v-if="showModal" message="게시글이 등록되었습니다!" @close="goToList" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/common/Header.vue'
import SuccessModal from '@/components/common/SuccessModal.vue'

const user = { id: 1, nickname: '50071' }
const router = useRouter()

const title = ref('')
const content = ref('')
const imageUrl = ref('')
const previewUrl = ref('')
const showModal = ref(false)

function handleImageUpload(event) {
    const file = event.target.files[0]
    if (file) {
        previewUrl.value = URL.createObjectURL(file)
        imageUrl.value = `/img/freePost/${file.name}`
    }
}

async function submitPost() {
    if (!title.value.trim() || !content.value.trim()) {
        alert('제목과 내용을 입력해 주세요.')
        return
    }

    const newPost = {
        title: title.value,
        author: user.nickname,
        date: new Date().toISOString().slice(0, 10),
        content: content.value,
        imageUrl: imageUrl.value || '',
        comments: [],
        views: 1, // ✅ 등록 시 1로 설정
        likes: 0
    }

    try {
        const res = await fetch('http://localhost:3000/freeposts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        })

        if (!res.ok) throw new Error('서버 응답 실패')
        const saved = await res.json()

        // ✅ 조회수 중복 증가 방지
        sessionStorage.setItem(`viewed_post_${saved.id}`, 'true')

        router.push({
            path: `/readFree/${saved.id}`,
            query: { fromWrite: 'true' } // ✅ 등록 직후임을 표시
        })
    } catch (err) {
        console.error(err)
        alert('등록에 실패했습니다.')
    }
}

function cancelPost() {
    title.value = ''
    content.value = ''
    imageUrl.value = ''
    previewUrl.value = ''
}

function goToList() {
    showModal.value = false
    router.push('/readFree')
}
</script>

<style src="@/assets/post/registerFree.css"></style>