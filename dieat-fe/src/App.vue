<template>
  <div>
    <TheHeader @open-login="openLoginModal" @logout="handleLogout" class="header" />
    <RouterView />
    <LoginModal :show="isLoginModalOpen" @close="isLoginModalOpen = false" @login-success="handleLoginSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import TheHeader from '@/components/common/Header.vue'
import LoginModal from '@/components/member/LoginModal.vue'

const isLoginModalOpen = ref(false)
const router = useRouter()
const userStore = useUserStore()

const handleLoginSuccess = async () => {
  try {
    const token = userStore.accessToken
    if (!token) return

    const res = await fetch('http://localhost:8000/user-service/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) throw new Error('인증 실패')

    const userData = await res.json()
    userStore.setUser(userData)
    isLoginModalOpen.value = false
  } catch (err) {
    console.error('유저 정보 불러오기 실패:', err)
    userStore.logout()
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

const openLoginModal = () => {
  isLoginModalOpen.value = true
}

onMounted(() => {
  if (userStore.accessToken) handleLoginSuccess()
  window.addEventListener('open-login-modal', openLoginModal)
})

onUnmounted(() => {
  window.removeEventListener('open-login-modal', openLoginModal)
})
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@media (min-width:1000px) {
  .header {
    display: none;
  }
}
</style>
