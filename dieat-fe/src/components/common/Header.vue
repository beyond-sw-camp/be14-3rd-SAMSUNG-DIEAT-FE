<template>
  <header class="header">
    <div>
      <RouterLink to="/" class="logo">
        <img src="@/assets/home_img/DieatLogo2.png" alt="Dieat Main Page" />
      </RouterLink>
    </div>

    <nav class="main-nav">
      <div class="menu-item" @click="toggleDropdown('FOOD')">
        FOOD
        <MenuDrop :menuItems="menu1" :visible="activeMenu === 'FOOD'" />
      </div>

      <div class="menu-item" @click="toggleDropdown('MEAL')">
        MEAL
        <MenuDrop :menuItems="menu2" :visible="activeMenu === 'MEAL'" />
      </div>

      <div class="menu-item" @click="toggleDropdown('POST')">
        POST
        <MenuDrop :menuItems="menu3" :visible="activeMenu === 'POST'" />
      </div>

      <div class="menu-item" @click="toggleDropdown('MYPAGE')">
        MYPAGE
        <MenuDrop :menuItems="menu4" :visible="activeMenu === 'MYPAGE'" />
      </div>

      <div class="menu-item" @click="toggleDropdown('SERVICE')">
        SERVICE
        <MenuDrop :menuItems="menu5" :visible="activeMenu === 'SERVICE'" />
      </div>
    </nav>

    <nav class="auth-nav">
      <template v-if="userStore.isLogin">
        <div class="user-box">
          <div class="user-text">
            <div class="user-name">{{ userStore.user?.userNickname }}</div>
            <div class="user-role">{{ formatRole(userStore.user?.role) }}</div>
          </div>
          <button class="logout-btn" @click="$emit('logout')">로그아웃</button>
        </div>
      </template>
      <template v-else>
        <button @click="$emit('open-login')">로그인</button>
        <RouterLink to="/regist">회원가입</RouterLink>

      </template>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import MenuDrop from './MenuDrop.vue'

const emit = defineEmits(['open-login', 'logout'])
const userStore = useUserStore()

const activeMenu = ref(null)
const toggleDropdown = (menu) => {
  activeMenu.value = activeMenu.value === menu ? null : menu
}

const formatRole = (role) => {
  switch (role) {
    case 'ADMIN': return '관리자'
    case 'USER': return '일반 사용자'
    default: return '알 수 없음'
  }
}

const menu1 = [
  { label: '음식 데이터 검색', href: '/searchFood' },
  { label: '음식 데이터 등록', href: '/registerFood' }
]
const menu2 = [
  { label: '식사 조회', href: '/meal' },
  { label: '식사 등록', href: '/registmeal' },
  { label: '식단 게시글 조회', href: '/dietPost' },
  { label: '식단 게시글 등록', href: '/dietPost/:id' }
]
const menu3 = [
  { label: '자유 게시글 조회', href: '/readFree' },
  { label: '자유 게시글 등록', href: '/registerFree' },
  { label: '성공기 게시글 조회', href: '/readSuccess' },
  { label: '성공기 게시글 등록', href: '/registerSuccess' }
]
const menu4 = [

  { label: '개인 정보', href: '/personalUserInfo' },
  { label: '포인트 적립 내역', href: '/point' },
  { label: '북마크', href: '/category' },
  { label: '구독 관리', href: '/subscribeMng' },
  { label: '구독 게시판', href: '/subscribePost' },
  { label: '대시보드', href: '/dashboard' },
  { label: '차단', href: '/block' }
]
const menu5 = [
  { label: '공지 사항', href: '/noticeLayout' },
  { label: '문의 사항', href: '/qnaLayout' },
  { label: '나의 신고 내역', href: '/myReportLayout' }
]
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #155b45;
  padding: 20px 40px;
  z-index: 3000;
  position: relative;
}
.logo img {
  height: 48px;
}
.main-nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 80px;
  font-weight: bold;
  color: white;
  white-space: nowrap;
}
.menu-item {
  position: relative;
  cursor: pointer;
}
.auth-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}
.auth-nav a,
.auth-nav button {
  padding: 8px 12px;
  font-size: 15px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.user-box {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}
.user-text {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  line-height: 1.2;
  text-align: right;
}
.user-name {
  font-weight: bold;
}
.user-role {
  font-size: 12px;
  opacity: 0.8;
}
.logout-btn {
  background: none;
  border: none;
  color: white;
  font-size: 13px;
  cursor: pointer;
}
</style>
