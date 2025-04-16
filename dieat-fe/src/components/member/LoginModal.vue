<template>
  <div class="login-modal-overlay" v-if="show" @click.self="emit('close')">
    <div class="login-modal-box">
      <button class="close-button" @click="emit('close')">&times;</button>
      <h2 class="login-title">Login</h2>

      <input type="text" placeholder="아이디" class="login-input" v-model="id" />
      <input type="password" placeholder="비밀번호" class="login-input" v-model="password" />
      <button class="login-button" @click="handleLogin">로그인</button>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

      <div class="bottom-section">
        <img src="@/img/dieat_greenLogo 1.svg" alt="logo" class="login-logo" />
        <a class="signup-text" href="/register">Sign up</a>
        <RouterLink to="/find-id" class="findid-text">아이디 찾기</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'login-success'])

const router = useRouter()
const userStore = useUserStore()

const id = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    const res = await fetch('http://localhost:8000/user-service/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id.value, userPwd: password.value })
    })

    const token = res.headers.get('Authorization')?.replace('Bearer ', '')

    if (res.ok && token) {
      userStore.setAccessToken(token)

      // 유저 정보 요청
      const userRes = await fetch('http://localhost:8000/user-service/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!userRes.ok) throw new Error('유저 정보 요청 실패')
      const userData = await userRes.json()
      userStore.setUser(userData)

      emit('login-success')
      emit('close')
      router.push('/')
    } else {
      errorMessage.value = '로그인 실패: 아이디 또는 비밀번호를 확인하세요.'
    }
  } catch (err) {
    console.error('로그인 오류:', err)
    errorMessage.value = '서버 오류가 발생했습니다.'
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.login-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-modal-box {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 40px 30px;
  width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: 'cursive';
}

.login-input {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 14px;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #11875c;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-bottom: 16px;
}

.error-text {
  color: red;
  font-size: 14px;
  margin-bottom: 12px;
}

.bottom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
}

.login-logo {
  width: 120px;
}
.findid-text {
  font-size: 14px;
  color: #11875c;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}

.signup-text {
  font-size: 16px;
  font-weight: bold;
  font-family: 'cursive';
  color: #4B0082;
  text-decoration: underline;
  cursor: pointer;
}
</style>
