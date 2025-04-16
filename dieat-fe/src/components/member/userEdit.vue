<template>
  <div class="form-container">
    <h1 class="form-title">회원 정보 수정</h1>

    <div class="form-group">
      <label class="form-label">아이디</label>
      <input class="form-input" v-model="user.userId" placeholder="아이디 입력" disabled />
    </div>

    <div class="form-group">
      <label class="form-label">이메일 인증</label>
      <div class="email-group">
        <div class="email-row align-right">
          <input class="form-input" v-model="emailCode" placeholder="인증 코드 입력" />
          
        </div>
        <div class="email-row">
          <button class="btn btn-outline-primary full-width" @click="sendVerificationCode">인증 메일 보내기</button>
          <button class="btn btn-outline-primary" @click="verifyEmail">인증 확인</button>
        </div>
        <p class="verification-result" :class="{ success: isEmailVerified, error: !isEmailVerified && verificationResult }">
          {{ verificationResult }}
        </p>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">성별</label>
      <div class="gender-row">
        <button :class="['btn', 'btn-toggle', user.userGender === 'm' ? 'active' : '']" @click="user.userGender = 'm'">남</button>
        <button :class="['btn', 'btn-toggle', user.userGender === 'f' ? 'active' : '']" @click="user.userGender = 'f'">여</button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">생년월일</label>
      <input class="form-input" type="date" v-model="user.userBirthday" />
    </div>

    <div class="form-actions">
      <button class="btn btn-success" @click="submit" :disabled="!isEmailVerified" :class="{ disabled: !isEmailVerified }">저장</button>
      <button class="btn btn-danger" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const user = reactive({
  userId: userStore.user?.userId || '',
  userGender: userStore.user?.userGender || '',
  userBirthday: userStore.user?.userBirthday || ''
})

const emailCode = ref('')
const verificationResult = ref('')
const isEmailVerified = ref(false)

const sendVerificationCode = async () => {
  try {
    const res = await fetch('http://localhost:8000/user-service/email-verification/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userStore.user?.userEmail })
    })
    verificationResult.value = res.ok ? '✅ 인증 메일이 전송되었습니다.' : '❌ 인증 메일 전송 실패'
  } catch (e) {
    verificationResult.value = '❌ 서버 오류가 발생했습니다.'
  }
}

const verifyEmail = async () => {
  try {
    const res = await fetch('http://localhost:8000/user-service/email-verification/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userStore.user?.userEmail, verificationCode: emailCode.value })
    })
    if (res.ok) {
      verificationResult.value = '✅ 이메일 인증 성공!'
      isEmailVerified.value = true
    } else {
      verificationResult.value = '❌ 인증번호가 일치하지 않습니다.'
      isEmailVerified.value = false
    }
  } catch (e) {
    verificationResult.value = '❌ 서버 오류가 발생했습니다.'
    isEmailVerified.value = false
  }
}

const submit = async () => {
  try {
    const res = await fetch(`http://localhost:8000/user-service/users/${user.userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.accessToken}`
      },
      body: JSON.stringify({
        userGender: user.userGender,
        userBirthday: user.userBirthday
      })
    })

    if (!res.ok) {
      const msg = await res.text()
      alert('수정 실패: ' + msg)
      return
    }

    const updatedUser = await res.json()
    userStore.setUser(updatedUser)
    alert('회원 정보가 성공적으로 수정되었습니다.')
    router.push('/userinfo')
  } catch (e) {
    alert('서버 오류가 발생했습니다.')
    console.error(e)
  }
}

const cancel = () => router.back()
</script>

<style scoped>
.form-container {
  max-width: 600px;
  width: 100%;
  margin: 40px auto;
  padding: 40px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-input {
  width: 100%;
  height: 44px;
  font-size: 14px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

input::placeholder {
  font-size: 14px;
  color: #999;
}

.gender-row,
.email-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.email-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.email-row.align-right {
  justify-content: space-between;
  align-items: center;
}

.verification-result {
  font-size: 13px;
  margin-top: 6px;
}

.verification-result.success {
  color: #119160;
}

.verification-result.error {
  color: #e74c3c;
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.btn {
  padding: 10px 16px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: #007bff;
  color: #fff;
}

.btn-outline-primary {
  background: #fff;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline-primary:hover {
  background: #007bff;
  color: #fff;
}

.btn-success {
  background: #119160;
  color: white;
  flex: 1 1 48%;
  height: 48px;
}

.btn-danger {
  background: #e74c3c;
  color: white;
  flex: 1 1 48%;
  height: 48px;
}

.btn.disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-toggle {
  flex: 1;
  height: 44px;
  background: #f9f9f9;
  border: 1px solid #ccc;
}

.btn-toggle.active {
  background: #119160;
  color: white;
  border-color: #119160;
}

@media (max-width: 480px) {
  .gender-row,
  .email-row,
  .form-actions {
    flex-direction: column;
  }

  .btn-success,
  .btn-danger {
    width: 100%;
  }
}
</style>
