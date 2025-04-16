<template>
  <div class="post-card">
    <!-- 👤 사용자 정보 -->
    <div class="post-header">
      <img :src="userImage" alt="사용자 이미지" class="user-image" />
      <span class="nickname">{{ post.nickname }}</span>
      <button @click="toggleFollow" class="follow-btn">
        {{ isFollowing ? '팔로잉' : '팔로우' }}
      </button>
      <MoreMenu />
    </div>

    <!-- 🖼️ 썸네일 + 오버레이 + 제목 + 북마크 -->
    <div class="image-container" @click="goToDetail">
      <img :src="post.img" alt="식단 이미지" class="thumbnail" />
      <div class="overlay"></div>

      <div class="title-bookmark">
        <h3 class="image-title">{{ post.title }}</h3>
        <div class="bookmark-wrapper" @click.stop>
          <BookmarkButton
            :isActive="isBookmarked"
            :post="post"
            @toggle="toggleBookmark"
          />
        </div>
      </div>
    </div>

    <!-- 📅 날짜 + ❤️ 좋아요 + 💬 댓글 -->
    <div class="meta">
      <span class="date">{{ post.date }}</span>
      <div class="right-meta">
        <LikeButton :count="post.likes" @update="(val) => post.likes = val" />
        <span>💬 {{ post.commentsList?.length || 0 }}</span>
      </div>
    </div>

    <!-- 🔥 영양 정보 -->
    <div class="nutrition-tags">
      <span class="tag">열량 <br />{{ post.total.kcal }} kcal</span>
      <span class="tag">탄수화물 <br />{{ post.total.carbs }} g</span>
      <span class="tag">단백질 <br />{{ post.total.protein }} g</span>
      <span class="tag">지방 <br />{{ post.total.fat }} g</span>
      <span class="tag">당 <br />{{ post.total.sugar }} g</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import userImage from '@/assets/dietpost/user_img.png'
import BookmarkButton from './BookmarkButton.vue'
import MoreMenu from './MoreMenu.vue'
import LikeButton from './LikeButton.vue'

// props
const { post } = defineProps(['post'])

const router = useRouter()
const isFollowing = ref(false)
const isBookmarked = ref(false)

// 북마크 상태 초기화
onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]')
  isBookmarked.value = saved.some(item => item.id === post.id)
})

function toggleFollow() {
  isFollowing.value = !isFollowing.value
}

// 북마크 토글
function toggleBookmark(isActive) {
  isBookmarked.value = isActive
}

function goToDetail() {
  router.push(`/dietPost/${post.id}`)
}
</script>

<style scoped>
.post-card {
  width: 320px;
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-image {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.nickname {
  font-weight: 600;
  flex-grow: 1;
}

.follow-btn {
  padding: 2px 12px;
  font-size: 0.8rem;
  border: 1.5px solid black;
  background-color: white;
  color: black;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.follow-btn:hover {
  background-color: #f2f2f2;
}

.image-container {
  position: relative;
  cursor: pointer;
}

.thumbnail {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(43, 43, 43, 0.4);
  border-radius: 10px;
}

.title-bookmark {
  position: absolute;
  top: 8px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  z-index: 2;
  pointer-events: none;
}

.bookmark-wrapper {
  pointer-events: auto;
}

.image-title {
  font-size: 1.05rem;
  margin: 0;
  font-weight: bold;
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
  align-items: center;
}

.right-meta {
  display: flex;
  gap: 10px;
}

.nutrition-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #f2f2f2;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  text-align: center;
}
</style>
