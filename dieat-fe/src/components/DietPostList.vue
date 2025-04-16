<template>
    <div class="post-list">
      <div class="top-bar">
        <button @click="goToWrite">➕ 등록</button>
        <input type="text" v-model="keyword" placeholder="검색할 식단명을 입력하세요" />
        <button @click="search">🔍</button>
      </div>
  
      <div class="posts">
        <DietPostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
  
      <Pagination :current-page="page" :total-pages="totalPages" @change="goToPage" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import DietPostCard from './dietpost/PostCard.vue';
  import Pagination from './Pagination.vue';
  
  const posts = ref([]);
  const page = ref(1);
  const totalPages = ref(3);
  const keyword = ref('');
  
  const search = () => {
    console.log('검색어:', keyword.value);
    // API 호출
  };
  const goToWrite = () => {
    // 등록 페이지로 이동
  };
  const goToPage = (p) => {
    page.value = p;
    // 페이지 변경 API
  };
  </script>
  
  <style scoped>
  .top-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .posts {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  </style>
  