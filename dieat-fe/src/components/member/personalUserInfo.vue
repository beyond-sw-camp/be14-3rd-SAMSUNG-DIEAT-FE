<template>
    <div class="info-container">
      <h1 class="info-title">개인 정보</h1>
  
      <div class="info-row">
        <strong>아이디:</strong>
        <span class="info-value">{{ user.userId }}</span>
      </div>
      <div class="info-row">
        <strong>이름:</strong>
        <span class="info-value">{{ user.userName }}</span>
      </div>
      <div class="info-row">
        <strong>닉네임:</strong>
        <span class="info-value">{{ user.userNickname }}</span>
      </div>
      <div class="info-row">
        <strong>이메일:</strong>
        <span class="info-value">{{ user.userEmail }}</span>
      </div>
      <div class="info-row">
        <strong>성별:</strong>
        <span class="info-value">{{ genderLabel }}</span>
      </div>
      <div class="info-row">
        <strong>생년월일:</strong>
        <span class="info-value">{{ user.userBirthday }}</span>
      </div>
  
      <div class="button-wrapper">
        <button class="edit-btn" @click="router.push('/userEdit')">수정하기</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useUserStore } from '@/stores/user'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const userStore = useUserStore()
  const user = userStore.user
  
  const genderLabel = computed(() => {
    if (user.userGender === 'm') return '남성'
    if (user.userGender === 'f') return '여성'
    return '선택 안함'
  })
  </script>
  
  <style scoped>
  .info-container {
    max-width: 600px;
    margin: 40px auto;
    padding: 32px 40px;
    background: #fafafa;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  .info-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 24px;
    text-align: center;
    color: #222;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    margin-bottom: 14px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 6px;
  }
  
  .info-row strong {
    color: #555;
    width: 100px;
    font-weight: 600;
  }
  
  .info-value {
    flex: 1;
    color: #333;
    text-align: right;
    word-break: break-all;
  }
  
  .button-wrapper {
    margin-top: 32px;
    text-align: right;
  }
  
  .edit-btn {
    padding: 10px 20px;
    background: #119160;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .edit-btn:hover {
    background: #0e7e50;
  }
  </style>
  