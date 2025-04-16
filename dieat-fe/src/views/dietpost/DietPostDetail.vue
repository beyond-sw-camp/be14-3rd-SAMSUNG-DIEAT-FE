<template>
  <div class="post-detail" v-if="post">
    <div class="top-section">
      <h1 class="page-title">식단 게시글</h1>
    </div>

    <div class="breadcrumb">
      <RouterLink to="/" class="text-link">Home &gt; </RouterLink>
      <span>MEAL &gt; </span>
      <RouterLink to="/dietPost" class="text-link">식단 게시글 조회</RouterLink>
      <button class="back-btn" @click="goToList">목록 보기</button>
    </div>

    <div class="post-container">
      <div class="post-title-row">
        <h2 class="post-title">{{ post.title }}</h2>
      </div>

      <div class="info">
        <div class="info-block">
          <span class="label">작성자</span><span class="bar">|</span>
          <span class="value">{{ post.nickname }}</span>
        </div>
        <div class="info-block">
          <span class="label">작성일시</span><span class="bar">|</span>
          <span class="value">{{ post.date }}</span>
        </div>
        <div class="info-block">
          <span class="label">조회수</span><span class="bar">|</span>
          <span class="value">{{ post.views }}</span>
        </div>
      </div>

      <MoreMenu2 />

      <div class="image-description-box">
        <div class="image-slider">
          <button v-if="currentImageIndex > 0" class="arrow-btn" @click="prevImage">◀</button>
          <img :src="images[currentImageIndex]" alt="식단 이미지" class="main-img" />
          <button v-if="currentImageIndex < images.length - 1" class="arrow-btn" @click="nextImage">▶</button>
        </div>

        <div class="thumbnail-list">
          <img v-for="(img, idx) in images" :key="idx" :src="img" :class="{ selected: idx === currentImageIndex }"
            @click="currentImageIndex = idx" />
        </div>

        <p class="description">{{ post.description }}</p>
      </div>

      <div class="post-interaction">
        <div class="like" :class="{ liked: likedByUser, animated: likedAnimating }" @click="handleLikeToggle">
          ❤️ 좋아요 {{ likes }}
        </div>
        <div class="comment-count">💬 댓글 {{ post.commentsList.length }}</div>
      </div>

      <div class="comment-list-wrapper">
        <h3 class="comment-list-title">댓글 {{ post.commentsList.length }}개</h3>
        <ul class="comment-list">
          <li class="comment-item" v-for="(c, i) in post.commentsList" :key="i">
            <div class="comment-header">
              <span>{{ c.writer }}</span>
            </div>
            <div class="comment-content">
              {{ c.content }}
            </div>
          </li>
        </ul>
        <div class="comment-input-wrapper">
          <textarea v-model="comment" placeholder="댓글을 입력해 주세요." class="comment-textarea"></textarea>
          <button class="submit-button" @click="submitComment(comment)">등록</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MoreMenu2 from '@/components/dietpost/MoreMenu2.vue'
import { fetchPostById } from '@/components/dietpost/dietpost.js'

const likes = ref(0)
const likedByUser = ref(false)
const likedAnimating = ref(false)
const router = useRouter()
const route = useRoute()
const postId = route.params.id
const post = ref(null)
const currentImageIndex = ref(0)
const images = ref([])
const comment = ref('')

function goToList() {
  router.push('/dietPost')
}
function nextImage() {
  if (currentImageIndex.value < images.value.length - 1) currentImageIndex.value++
}
function prevImage() {
  if (currentImageIndex.value > 0) currentImageIndex.value--
}

function handleLikeToggle() {
  const likedKey = `liked_diet_post_${postId}`

  if (likedByUser.value) {
    likes.value = Math.max(0, likes.value - 1)
    likedByUser.value = false
    localStorage.removeItem(likedKey)
  } else {
    likes.value++
    likedByUser.value = true
    localStorage.setItem(likedKey, 'true')
    likedAnimating.value = true
    setTimeout(() => likedAnimating.value = false, 600)
  }

  fetch(`http://localhost:3000/posts/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: likes.value })
  }).catch(err => {
    console.error('❌ 좋아요 저장 실패:', err)
  })
}

function submitComment(content) {
  if (!content.trim()) return;

  const newComment = {
    writer: '익명',
    content
  };

  post.value.commentsList.push(newComment)

  fetch(`http://localhost:3000/posts/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      commentsList: post.value.commentsList,
      comments: post.value.commentsList.length
    })
  }).catch(err => {
    console.error('❌ 댓글 저장 실패:', err)
  })

  comment.value = ''
}

onMounted(async () => {
  try {
    const data = await fetchPostById(postId)
    post.value = data
    images.value = [data.img, ...data.subImages]
    likes.value = data.likes || 0
    const likedKey = `liked_diet_post_${postId}`
    likedByUser.value = localStorage.getItem(likedKey) === 'true'
  } catch (err) {
    console.error('❌ 상세 게시글 불러오기 실패:', err)
  }
})
</script>

<style scoped>
.post-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 1rem;
  font-family: sans-serif;
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
}

.breadcrumb {
  text-align: right;
  margin: 1rem 1rem 0.5rem;
  color: gray;
  font-size: 0.9rem;
}

.text-link {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.back-btn {
  margin-left: 1rem;
  background: #f5f5f5;
  border: 1px solid #ccc;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.post-container {
  border: 1px solid #2caa88;
  border-radius: 12px;
  padding: 1.5rem;
  background-color: #fff;
  margin-top: 1rem;
}

.post-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.info {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 1rem 0;
  font-size: 0.95rem;
  color: #333;
}

.info-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bar {
  color: #bbb;
}

.image-description-box {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
  margin: 1.5rem 0;
  background-color: #fefefe;
}

.image-slider {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-img {
  width: 60%;
  border-radius: 12px;
  margin: 1rem auto;
  display: block;
}

.arrow-btn {
  position: absolute;
  top: 45%;
  font-size: 2rem;
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
}

.arrow-btn:first-child {
  left: 10px;
}

.arrow-btn:last-child {
  right: 10px;
}

.thumbnail-list {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin: 0.8rem 0;
}

.thumbnail-list img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
}

.thumbnail-list img.selected {
  border-color: #2caa88;
}

.description {
  margin-top: 1rem;
  line-height: 1.6;
  color: #333;
}

.nutrition-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.nutrition-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fafafa;
}

.left-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 200px;
}

.badge {
  background-color: #0f8f64;
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 8px;
  font-size: 0.75rem;
}

.name-block .name {
  font-weight: bold;
}

.name-block .unit {
  font-size: 0.8rem;
  color: #777;
}

.nutrients {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.nutrient {
  background-color: #f0f0f0;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  text-align: center;
  min-width: 60px;
  font-size: 0.85rem;
}

.nutrient strong {
  display: block;
  font-size: 1rem;
}

.quantity {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.85rem;
  min-width: 60px;
}

.quantity .value {
  margin-top: 4px;
  background: #eee;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
}

.summary {
  margin-top: 2rem;
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1rem;
}

.summary-content {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.summary-left {
  flex: 1;
  min-width: 220px;
  font-size: 0.95rem;
  line-height: 1.7;
}

.summary-chart {
  width: 250px;
  height: 250px;
}

/* .interaction {
  margin-top: 1.5rem;
  font-weight: bold;
  color: #d44;
}

.comment-list {
  margin-top: 1rem;
}

.comment {
  margin-bottom: 0.5rem;
} */

.post-interaction {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0 24px;
  font-size: 15px;
  font-weight: 500;
}

.post-interaction .like {
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;
}

.post-interaction .liked {
  color: var(--color-primary);
}

.comment-count {
  color: #666;
}

.comment-list-wrapper {
  margin-top: 1.5rem;
}

.comment-list-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
}

.comment-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comment-item {
  padding: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
  margin-bottom: 0.9rem;
  background-color: #fafafa;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  color: #666;
}

.comment-content {
  font-size: 0.95rem;
  line-height: 1.5;
}

.post-interaction .like.animated {
  animation: pulseLike 0.6s ease;
}

@keyframes pulseLike {
  0% {
    transform: scale(1);
    color: #d44;
  }

  50% {
    transform: scale(1.3);
    color: var(--color-primary);
  }

  100% {
    transform: scale(1);
    color: #d44;
  }
}
</style>