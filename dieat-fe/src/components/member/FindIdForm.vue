<template>
    <div class="find-id-container">
      <h2>아이디 찾기</h2>
  
      <div class="input-group">
        <label>이메일</label>
        <input v-model="email" type="email" placeholder="이메일을 입력하세요" />
      </div>
  
      <div class="input-group">
        <label>인증번호</label>
        <input v-model="code" type="text" placeholder="인증번호 입력" />
        <button @click="sendCode">인증번호 전송</button>
        <button @click="verifyCode">인증 확인</button>
        <p v-if="verificationResult">{{ verificationResult }}</p>
      </div>
  
      <button @click="findUserId">아이디 찾기</button>
      <p v-if="responseMessage">{{ responseMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const email = ref('')
  const code = ref('')
  const verificationResult = ref('')
  const responseMessage = ref('')
  
  const sendCode = async () => {
    const res = await fetch('http://localhost:8000/user-service/email-verification/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })
    if (res.ok) {
      verificationResult.value = '인증번호가 전송되었습니다.'
    } else {
      verificationResult.value = '전송 실패: ' + await res.text()
    }
  }
  
  const verifyCode = async () => {
    const res = await fetch('http://localhost:8000/user-service/email-verification/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, verificationCode: code.value })
    })
    verificationResult.value = res.ok ? '인증 성공' : '인증 실패'
  }
  
  const findUserId = async () => {
    const res = await fetch('http://localhost:8000/user-service/find-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })
    const msg = await res.text()
    responseMessage.value = msg
  }
  </script>
  
  <style scoped>
  .find-id-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 24px;
    border: 1px solid #ccc;
    border-radius: 12px;
    font-family: sans-serif;
  }
  
  .input-group {
    margin-bottom: 16px;
  }
  
  input {
    width: 100%;
    padding: 10px;
    margin-top: 4px;
    border: 1px solid #aaa;
    border-radius: 6px;
  }
  
  button {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #11875c;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  </style>
  