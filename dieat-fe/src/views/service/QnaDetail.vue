<template>
  <div v-if="postId === '0'" class="qna-detail">
    <h1 class="title">문의 사항</h1>

    <button class="back-btn" @click="router.push('/qnaLayout')">
      <img src="@/assets/service_img/gotoList.png" alt="목록"/>
    </button>

    <div class="detail-box">
      <div class="meta-table">
        <div class="meta-row">
          <span class="label">제목</span>
          <span class="value">{{ post.title }}</span>
          <span class="date">작성일자: {{ post.date }}</span>
        </div>
      </div>

      <div class="content-box">
          <p>  제가 다이어트를 성공해서 성공기 게시글을 올리고 싶은데<br>
          아직 몸은 자랑할 만큼 만들어져 있지 않습니다. </p>
          <p>꼭 체형 변화 사진 파일도 업로드 해야 할까요? ㅠㅠ</p>
      </div>
    </div>
  </div>

  <div v-else style="text-align: center; margin-top: 5rem;">
    <h2 style="color: red;">해당 게시글은 존재하지 않습니다.</h2>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';

const route = useRoute();
const router = useRouter();
const postId = route.params.id;

// 0번 게시물만 허용
const post = {
  title: '성공기 게시글 파일 등록 질문',
  date: '2025-04-01',
  count: '100',
};

//  const newComment = ref('');
// const comments = ref([
// {
//     author: '관리자',
//     text: '네. 사진 파일은 회원님께서 원하시는 질문 자유롭게 첨부하시면 됩니다.',
// },
// {
//     author: '제드래곤',
//     text: '감사합니다!',
// },
// ]);

// const submitComment = () => {
// if (newComment.value.trim() !== '') {
//     comments.value.push({
//     author: '사용자',
//     text: newComment.value,
//     });
//     newComment.value = '';
// }
// };
</script>

<style scoped>
.qna-detail {
  max-width: 800px;
  margin: 3rem auto;
  padding: 1rem;
  position: relative;
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
}

.back-btn {
  position: absolute;
  top: 3rem; /* 제목 위에 위치하게 */

  background: none;
  border: none;
  
  cursor: pointer;
  margin-bottom: 50px;
}

.detail-box {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 100px;
  width: 800px;
  margin: 0 auto;
}

.meta-table {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.label {
  font-weight: bold;
  margin-right: 0.5rem;
  font-size: 23px;
}

.value {
  flex: 1;
  font-weight: 500;
  font-size: 20px;
}

.date {
  color: gray;
  font-size: 15px;
  white-space: nowrap;
}

.content-box {

  border: 1px solid #eaeaea;
  background: #fafafa;
  border-radius: 8px;
  padding: 1.2rem;
  line-height: 1.6;
  font-size: 18px;
}


</style>
