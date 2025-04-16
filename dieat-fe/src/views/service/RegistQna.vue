<template>

  <div class="breadcrumb">
          <RouterLink to="/" class="text-link">Home &gt; </RouterLink>
          <span>Service &gt; </span>
          <RouterLink to="/qnaLayout" class="text-link">문의 사항</RouterLink>
          <h1>문의 사항</h1>
  </div>

  <div class="register-wrapper">
    <div class="btn-group">
      <button class="submit-btn" @click="submitPost">등록</button>
      <button class="cancel-btn" @click="cancel">취소</button>
    </div>

    <form @submit.prevent="submitPost">
      <div class="form-group">
        <label for="title">제목</label>
        <input id="title" v-model="title" placeholder="제목을 입력하세요." />
      </div>

      <div class="form-group">
        <label for="content">내용</label>
        <textarea
          id="content"
          v-model="content"
          placeholder="내용을 입력하세요."
        ></textarea>
      </div>
    </form>
  </div>

  <Footer></Footer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

const title = ref('')
const content = ref('')
const router = useRouter()

const submitPost = () => {
  if (!title.value.trim() || !content.value.trim()) {
    alert('제목과 내용을 모두 입력해주세요.')
    return
  }

  // 이 부분에서 서버 전송 또는 저장 로직 작성 가능
  console.log('제목:', title.value)
  console.log('내용:', content.value)

  alert('문의가 등록되었습니다!')
  router.push('/qnaLayout')
}

const cancel = () => {
  if (confirm('작성을 취소하시겠습니까?')) {
    router.push('/qnaLayout')
  }
}
</script>

<style scoped>
.register-wrapper {
  max-width: 700px;
  margin: 5rem auto;
  padding: 2rem;
}

.breadcrumb {
      display: block;
      text-align: right;
      margin-top: 1rem;
      margin-right: 3rem;
      color: gray;
      flex-wrap: nowrap;
  }

  .text-link {
      color: inherit;
      text-decoration: none;
      font-weight: normal;
      cursor: pointer;
  }

  h1 {
      text-align: center;
      color: black;
  }

.page-title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 2rem;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
}

.submit-btn {
  background-color: #f85230;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 18px;
}

.cancel-btn {
  background-color: #f7f2eb;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 18px;
}

.form-group {
  margin-top: 2rem;
}

label {
  display: block;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 0.5rem;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

textarea {
  min-height: 180px;
  resize: none;
}
</style>
