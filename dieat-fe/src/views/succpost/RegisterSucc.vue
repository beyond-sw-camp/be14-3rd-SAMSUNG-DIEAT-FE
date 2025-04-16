<template>
    <div class="register-page">
  
      <div class="form-container">
        <h1 class="title">성공기 게시글 등록</h1>
  
        <div class="form-group">
          <label for="title">작성 제목</label>
          <input type="text" id="title" v-model="form.title" placeholder="제목을 입력해주세요." />
        </div>
  
        <div class="form-group">
          <label>기간 선택</label>
          <div class="date-row">
            <input type="date" v-model="form.startDate" />
            <span class="date-separator">~</span>
            <input type="date" v-model="form.endDate" />
          </div>
        </div>
  
        <div class="form-group">
          <label for="content">본문 내용</label>
          <textarea id="content" v-model="form.content" placeholder="성공기 내용을 입력해주세요."></textarea>
        </div>
  
        <div class="button-row">
          <button class="submit-btn" @click="submit">등록</button>
          <button class="cancel-btn" @click="cancel">취소</button>
        </div>
      </div>
    </div>
    <br>
    <br>
    <Footer></Footer>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Header from '@/components/common/Header.vue'
  import Footer from '@/components/common/Footer.vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const form = ref({
    title: '',
    startDate: '',
    endDate: '',
    content: ''
  })
    
    const submit = () => {
        alert('등록되었습니다!')
        router.push('/SuccessLayout')
    }
    const cancel = () => {
        router.back()
    }

  </script>
  
  <style scoped>
  .register-page {
    background-color: #f7f7f7;
    min-height: 100vh;
    padding: 40px 0;
  }
  
  .form-container {
    background-color: white;
    max-width: 700px;
    margin: auto;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Pretendard', sans-serif;
  }
  
  .title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  .form-group {
    margin-bottom: 24px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-size: 15px;
    font-weight: 500;
    color: #333;
  }
  
  input[type="text"],
  input[type="date"],
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
  }
  
  textarea {
    min-height: 200px;
    resize: none;
  }
  
  .date-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .date-separator {
    font-size: 16px;
    color: #999;
  }
  
  .button-row {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
  }
  
  .submit-btn {
    background-color: #F85230;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .cancel-btn {
    background-color: #dcdcdc;
    color: #333;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
  }
  </style>
  