<template>
  <div class="notice-detail">
    <h1 class="title animated-title" @click="goToList">공지 사항</h1>
    <div class="detail-box">
      <div class="meta-table">
        <div class="meta-row" v-if="post">
          <span class="value">{{ post.title }}</span>
          <span class="date">작성일: {{ post.date }} | 조회수: {{ post.count }}</span>
        </div>
      </div>
      <div class="content-box">
        <template v-if="post">
          <p v-for="(line, i) in post.content.split('\n')" :key="i">{{ line }}</p>
        </template>
        <template v-else>
          <p style="color: red; text-align: center;">해당 게시글은 존재하지 않습니다.</p>
        </template>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Footer from '@/components/common/Footer.vue'

const route = useRoute()
const router = useRouter()
const postId = route.params.id
const isFromList = route.query.from === 'list'
const post = ref(null)

const goToList = () => router.push('/noticeLayout')

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/notices/${postId}`)
    if (!res.ok) return
    const fetched = await res.json()

    const viewedKey = `viewed_notice_${postId}`
    const alreadyViewed = sessionStorage.getItem(viewedKey)

    if (isFromList || !alreadyViewed) {
      const updatedCount = Number(fetched.count || 0) + 1
      await fetch(`http://localhost:3000/notices/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: updatedCount })
      })
      sessionStorage.setItem(viewedKey, 'true')
      fetched.count = updatedCount
    }

    post.value = fetched
  } catch (err) {
    console.error('상세 요청 실패:', err)
  }
})
</script>

<style scoped>
.notice-detail {
  max-width: 1024px;
  margin: 3rem auto;
  padding: 1rem;
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
}

.detail-box {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 100px;
}

.meta-table {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.value {
  flex: 1;
  font-weight: 500;
  font-size: 20px;
}

.date {
  color: gray;
  font-size: 15px;
  white-space: nowrap;
}

.content-box {
  border: 1px solid #eaeaea;
  background: #fafafa;
  border-radius: 8px;
  padding: 1.2rem;
  line-height: 1.6;
  font-size: 14px;
  white-space: pre-line;
}

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