<template>
  
  <div class="layout-wrapper">
    <main class="content">
      <!-- 🔹 경로 표시 -->
      <div class="breadcrumb">
        <RouterLink to="/" class="text-link">Home &gt; </RouterLink>
        <span>MEAL &gt; </span>
        <RouterLink to="/dietPost" class="text-link">식단 게시글 조회</RouterLink>
      </div>

      <!-- 🔹 제목 + 검색/버튼 그룹 -->
      <div class="top-row">
        <h1 class="page-title">식단 게시글</h1>
        <div class="right-controls">
          <div class="search-section">
            <select v-model="selectedSort" class="dropdown">
              <option value="date">등록순</option>
              <option value="views">조회수</option>
              <option value="likes">좋아요순</option>
            </select>

            <div class="search-bar">
              <input v-model="searchKeyword" type="text" placeholder="검색할 식단을 입력하세요." />
              <button>🔍</button>
            </div>
          </div>

          <div class="button-group">
            <button class="btn register">식단 등록</button>
            <button class="btn my-posts">나의 게시글</button>
          </div>
        </div>
      </div>

      <!-- 🔹 게시글 목록 -->
      <div v-if="filteredPosts.length" class="post-grid">
        <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
      </div>
      <div v-else style="text-align: center; margin: 2rem 0;">😢 검색 결과가 없습니다.</div>

      <!-- 🔹 페이지네이션 -->
      <div class="pagination">
        <button>◀</button>
        <button class="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>▶</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PostCard from '@/components/dietpost/PostCard.vue'
import Header from '@/components/common/Header.vue'
import { fetchPosts } from '@/components/dietpost/dietpost.js'

const searchKeyword = ref('')
const selectedSort = ref('date')

const posts = ref([])

onMounted(async () => {
  try {
    const data = await fetchPosts()
    posts.value = data  // ✅ "posts" 키를 사용하고 있는 JSON 구조 대응
  } catch (err) {
    console.error('🔥 게시글 로딩 실패:', err)
  }
})

const filteredPosts = computed(() => {
  let result = [...posts.value]

  // 🔍 검색 필터
  if (searchKeyword.value.trim()) {
    result = result.filter(post =>
      post.title.includes(searchKeyword.value.trim())
    )
  }

  // 📊 정렬
  switch (selectedSort.value) {
    case 'likes':
      result.sort((a, b) => b.likes - a.likes)
      break
    case 'views':
      result.sort((a, b) => b.views - a.views)
      break
    default:
      result.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  return result
})
</script>

<style scoped>
.layout-wrapper {
  width: 100%;
  padding-top: 10px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem;
}

.breadcrumb {
  display: block;
  text-align: right;
  margin-top: 1rem;
  margin-right: 3rem;
  color: gray;
}

.text-link {
  color: inherit;
  text-decoration: none;
  font-weight: normal;
  cursor: pointer;
}

.page-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-top: -80px;
  margin-left: -80px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;
}

.right-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end; /* ✅ 우측 정렬 추가 */
  gap: 1rem;
  flex: 1;
}


@media (min-width: 768px) {
  .right-controls {
    flex-direction: row;
    align-items: center;
  }
}

.search-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.dropdown {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #ff5335;
  font-weight: bold;
}

.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #ff5335;
  border-radius: 999px;
  overflow: hidden;
  flex: 1;
}

.search-bar input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  outline: none;
  font-size: 0.95rem;
}

.search-bar button {
  padding: 0 1.2rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.register,
.my-posts {
  background-color: #0f8f64;
  color: white;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.pagination .active {
  background: #0f8f64;
  color: white;
  font-weight: bold;
}
</style>
