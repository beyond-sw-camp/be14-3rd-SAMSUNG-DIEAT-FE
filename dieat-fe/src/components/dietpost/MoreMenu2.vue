<template>
    <div class="more-menu2-wrapper">
      <button class="more-btn" @click="toggleMenu">⋮</button>
  
      <div v-if="showMenu" class="dropdown" @click.stop>
        <div class="menu-item">이 게시물 저장</div>
        <div class="menu-item report">이 게시물 신고</div>
        <div class="menu-item block">이 이용자 차단</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  const showMenu = ref(false)
  
  function toggleMenu() {
    showMenu.value = !showMenu.value
  }
  
  function closeMenu() {
    showMenu.value = false
  }
  
  function handleClickOutside(event) {
    const menu = document.querySelector('.more-menu2-wrapper')
    if (menu && !menu.contains(event.target)) {
      closeMenu()
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>
  
  <style scoped>
  .more-menu2-wrapper {
    position: relative;
  }
  
  .more-btn {
    background: none;
    border: none;
    font-size: 1.4rem;
    font-weight: bold;
    cursor: pointer;
  }
  
  .dropdown {
    position: absolute;
    top: 1.8rem;
    right: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    width: 160px;
    padding: 0.3rem 0;
    z-index: 1000;
  }
  
  .menu-item {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    color: #111;
    cursor: pointer;
  }
  
  .menu-item:hover {
    background-color: #f5f5f5;
  }
  
  .menu-item.report {
    color: #5a50f0;
  }
  
  .menu-item.block {
    color: #e24848;
  }
  </style>
  