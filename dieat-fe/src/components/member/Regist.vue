<template>
  <div class="form-container">
    <h1 class="form-title">회원가입</h1>

    <FormInput label="아이디" placeholder="아이디 입력" v-model="form.id" />
    <p v-if="formError.id" class="error-message">아이디는 필수 입력 항목입니다.</p>

    <FormInput label="비밀번호" placeholder="비밀번호 입력" type="password" v-model="form.password" />
    <p v-if="formError.password" class="error-message">비밀번호는 필수 입력 항목입니다.</p>

    <FormInput label="비밀번호 확인" placeholder="비밀번호 입력" type="password" v-model="form.passwordCheck" />
    <p v-if="formError.passwordCheck" class="error-message">비밀번호 확인은 필수 입력 항목입니다.</p>

    <p class="match-message" v-if="form.passwordCheck" :class="{ success: isPasswordMatch, error: !isPasswordMatch }">
      {{ isPasswordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
    </p>

    <FormInput label="이름" placeholder="이름을 입력해주세요" v-model="form.name" />
    <p v-if="formError.name" class="error-message">이름은 필수 입력 항목입니다.</p>

    <FormInput label="닉네임" placeholder="닉네임을 입력해주세요" v-model="form.nickname" />
    <p v-if="formError.nickname" class="error-message">닉네임은 필수 입력 항목입니다.</p>

    <div class="form-group">
      <label class="form-label">이메일</label>
      <div class="email-row">
        <input v-model="form.emailId" placeholder="이메일 주소" class="form-input" />
        <span>@</span>
        <select v-model="form.emailDomain" class="form-select">
          <option value="naver.com">naver.com</option>
          <option value="gmail.com">gmail.com</option>
          <option value="daum.net">daum.net</option>
        </select>
        <button class="verify-btn" :disabled="!canSendVerification" @click="sendVerificationCode">인증</button>
      </div>
      <p class="verification-status" :class="{ error: emailDuplicate }">{{ emailStatus }}</p>

      <div v-if="verificationSent" class="email-row">
        <input v-model="form.emailCode" placeholder="인증번호 입력" class="form-input" />
        <button class="verify-btn" @click="verifyCode">인증 확인</button>
      </div>
      <p class="verification-result">{{ verificationResult }}</p>
    </div>

    <FormInput label="전화번호" placeholder="전화번호를 입력해주세요" v-model="form.phone" />
    <p v-if="formError.phone" class="error-message">전화번호는 필수 입력 항목입니다.</p>

    <div class="form-group">
      <label class="form-label">성별</label>
      <div class="gender-row">
        <button :class="['gender-btn', form.gender === 'male' ? 'active' : '']" @click="form.gender = 'male'">남</button>
        <button :class="['gender-btn', form.gender === 'female' ? 'active' : '']" @click="form.gender = 'female'">여</button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">생일</label>
      <div class="birth-row">
        <select v-model="form.birthYear" class="form-select">
          <option disabled>년도</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
        <select v-model="form.birthMonth" class="form-select">
          <option disabled>월</option>
          <option v-for="month in 12" :key="month" :value="month">{{ month }}</option>
        </select>
        <select v-model="form.birthDay" class="form-select">
          <option disabled>일</option>
          <option v-for="day in 31" :key="day" :value="day">{{ day }}</option>
        </select>
      </div>
    </div>

    <FormInput label="관리자 코드" placeholder="관리자 코드를 입력해주세요" v-model="form.adminCode" />

    <div class="form-actions">
      <button class="submit-btn" @click="validateForm" :disabled="!isFormFilled || !isEmailVerified">가입하기</button>
      <button class="cancel-btn" @click="isModalClose = true">가입취소</button>
    </div>

    <RegistCompleteModal
      :show="isModalOpen"
      @close="goToHome"
      icon="✔"
      title="회원가입 완료"
      message="지금 바로 다양한 콘텐츠를 감상하고 글을 작성해 보세요"
      color="#22611d"
    />

    <RegistCompleteModal
      :show="isModalClose"
      @close="isModalClose = false"
      icon="X"
      title="가입 취소"
      message="가입을 취소하고 다시 로그인 페이지로 돌아갑니다"
      color="#FE7C7C"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import FormInput from '@/components/member/FormInput.vue'
import RegistCompleteModal from '@/components/member/RegistCompleteModal.vue'

const router = useRouter()

const form = ref({
  id: '', password: '', passwordCheck: '', name: '', nickname: '', emailId: '', emailDomain: 'naver.com',
  emailCode: '', phone: '', gender: '', birthYear: '', birthMonth: '', birthDay: '', adminCode: ''
})

const formError = ref({ id: false, password: false, passwordCheck: false, name: false, nickname: false, phone: false })

const isModalOpen = ref(false)
const isModalClose = ref(false)
const verificationSent = ref(false)
const emailStatus = ref('')
const verificationResult = ref('')
const emailDuplicate = ref(false)
const isEmailVerified = ref(false)
const years = Array.from({ length: 100 }, (_, i) => 2025 - i)

const isPasswordMatch = computed(() => form.value.password && form.value.password === form.value.passwordCheck)
const fullEmail = computed(() => `${form.value.emailId}@${form.value.emailDomain}`)
const canSendVerification = computed(() => form.value.emailId !== '' && !emailDuplicate.value)
const isFormFilled = computed(() => {
  return form.value.id && form.value.password && form.value.passwordCheck && isPasswordMatch.value &&
    form.value.name && form.value.nickname && form.value.phone
})

const goToHome = () => { isModalOpen.value = false; router.push('/') }

const validateForm = async () => {
  formError.value.id = !form.value.id
  formError.value.password = !form.value.password
  formError.value.passwordCheck = !form.value.passwordCheck
  formError.value.name = !form.value.name
  formError.value.nickname = !form.value.nickname
  formError.value.phone = !form.value.phone

  const isValid = Object.values(formError.value).every(v => !v)

  if (isValid && isPasswordMatch.value && isEmailVerified.value) {
    try {
      const res = await fetch('http://localhost:8000/user-service/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: form.value.id,
          userPwd: form.value.password,
          userName: form.value.name,
          userNickname: form.value.nickname,
          userTel: form.value.phone,
          userGender: form.value.gender,
          userBirthday: `${form.value.birthYear}-${String(form.value.birthMonth).padStart(2, '0')}-${String(form.value.birthDay).padStart(2, '0')}`,
          userEmail: fullEmail.value,
          inviteCode: form.value.adminCode
        })
      })
      if (res.ok) isModalOpen.value = true
      else alert(await res.text())
    } catch (err) { alert('서버 오류가 발생했습니다.') }
  }
}

const checkEmailDuplicate = async () => {
  try {
    const res = await fetch(`http://localhost:8000/user-service/users/check-email?email=${fullEmail.value}`, {
      method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'omit'
    })
    if (res.ok) {
      emailDuplicate.value = false
      emailStatus.value = '사용 가능한 이메일입니다.'
    } else {
      emailDuplicate.value = true
      emailStatus.value = '이미 등록된 이메일입니다.'
    }
  } catch (e) {
    emailStatus.value = '서버 오류가 발생했습니다.'
  }
}

const sendVerificationCode = async () => {
  await checkEmailDuplicate()
  if (emailDuplicate.value) return
  try {
    const res = await fetch('http://localhost:8000/user-service/email-verification/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fullEmail.value })
    })
    if (res.ok) {
      verificationSent.value = true
      emailStatus.value = '인증 메일이 전송되었습니다.'
    } else {
      emailStatus.value = '메일 전송 실패: ' + (await res.text())
    }
  } catch (e) {
    emailStatus.value = '서버 오류가 발생했습니다.'
  }
}

const verifyCode = async () => {
  try {
    const res = await fetch('http://localhost:8000/user-service/email-verification/verify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fullEmail.value, verificationCode: form.value.emailCode })
    })
    if (res.ok) {
      verificationResult.value = '이메일 인증 성공!'
      isEmailVerified.value = true
    } else {
      verificationResult.value = '인증번호가 일치하지 않습니다.'
      isEmailVerified.value = false
    }
  } catch (e) {
    verificationResult.value = '서버 오류가 발생했습니다.'
    isEmailVerified.value = false
  }
}
</script>




<style scoped>
.verify-btn {
  margin-left: 8px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
}
.email-status, .verification-result {
  margin-top: 5px;
  font-size: 13px;
  color: #555;
}
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 48px 16px;
  font-family: sans-serif;
}
.form-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 32px;
}
.form-group {
  margin-bottom: 16px;
}
.form-label {
  display: block;
  margin-bottom: 6px;
  color: #333;
  font-weight: 500;
}
.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
.email-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.gender-row {
  display: flex;
  gap: 12px;
}
.gender-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.gender-btn.active {
  background: #28a745;
  color: white;
  border-color: #28a745;
}
.birth-row {
  display: flex;
  gap: 8px;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  gap: 12px;
}
.submit-btn {
  flex: 1;
  padding: 12px;
  background-color: #119160;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.cancel-btn {
  flex: 1;
  padding: 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.match-message {
  margin-top: 6px;
  font-size: 14px;
}
.match-message.success {
  color: green;
}
.match-message.error {
  color: red;
}
.error-message {
  color: red;
  font-size: 13px;
  margin-top: -10px;
  margin-bottom: 10px;
}
.verify-btn {
  height: 40px; /* 👈 input과 높이 맞춤 */
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.verify-btn:hover {
  background-color: #0056b3;
}

.email-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 1000px){
  
}

</style>
