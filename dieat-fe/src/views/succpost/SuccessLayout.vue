<template>
    <div class="page-wrapper">
        <div class="breadcrumb">
            <RouterLink to="/" class="text-link">Home &gt; </RouterLink>
            <span>Post &gt; </span>
            <RouterLink to="/SuccessLayout" class="text-link">성공기 게시글</RouterLink>
        </div>

        <h1>성공기 게시글</h1>

        <img src="@/assets/service_img/searching.png" alt="searching bar" class="searchingBar-img" />
        <img src="@/assets/succpost_img/registerPost.png" alt="게시글 등록" class="regist-post" @click="goToRegister" />

        <div class="board-wrapper">
            <table class="post-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>일시</th>
                        <th>조회수</th>
                        <th>좋아요</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(post, index) in paginatedPosts" :key="post.id">
                        <td>{{ post.no }}</td>
                        <td>{{ post.title }}</td>
                        <td>{{ post.writer }}</td>
                        <td>{{ post.date }}</td>
                        <td>{{ post.views }}</td>
                        <td>{{ post.likes }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="pagination">
            <button @click="prevPage" :disabled="page === 1">&lt;</button>
            <span>{{ page }}</span>
            <button @click="nextPage" :disabled="page === maxPage">&gt;</button>
        </div>
    </div>

    <br /><br /><br /><br />
    <Footer />
</template>

<script setup>
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // ✅ 추가

const router = useRouter(); // ✅ 추가

const goToRegister = () => {
    router.push('/registerSuccess')
}

const page = ref(1)
const postsPerPage = 7


const posts = ref([
    { no: 17, title: '먹으면서 뺐다, 진짜로', writer: 'jerry0417', date: '2025-04-12', views: 0, likes: 0 },
    { no: 16, title: '초간단 성공기 3주 느낀 점', writer: '윈터공주', date: '2025-04-06', views: 3, likes: 1 },
    { no: 15, title: '하루 1식, 한 달 후기 드림!', writer: '냉장고요정', date: '2025-04-02', views: 6, likes: 1 },
    { no: 14, title: '나를 위한 도전, 나는 날았다', writer: '열정만렙다이어터', date: '2025-04-01', views: 11, likes: 3 },
    { no: 13, title: '다이어트는 지옥이었다...', writer: '밥은건들지마', date: '2025-03-31', views: 13, likes: 1 },
    { no: 12, title: '퇴짜맞던 다 프로포즈 받았습니다..!', writer: '엉뚱한토마토', date: '2025-03-30', views: 23, likes: 2 },
    { no: 11, title: '먹어도 빠지는 법을 배웠습니다', writer: '성북동비둘기', date: '2025-03-30', views: 34, likes: 5 },
    { no: 10, title: '나도 할 수 있었다는 이야기 [7kg]', writer: '오뚝이', date: '2025-03-28', views: 14, likes: 3 },
    { no: 9, title: '위염약 먹다 뺀 나의 10kg', writer: '망원동고양이', date: '2025-03-23', views: 33, likes: 24 }
])

const maxPage = computed(() => Math.ceil(posts.value.length / postsPerPage))

const paginatedPosts = computed(() =>
    posts.value.slice((page.value - 1) * postsPerPage, page.value * postsPerPage)
)

function prevPage() {
    if (page.value > 1) page.value--
}

function nextPage() {
    if (page.value < maxPage.value) page.value++
}


</script>

<style scoped>
.page-wrapper {
    max-width: 1024px;
    margin: 0 auto;
    padding: 1rem;
}

.breadcrumb {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
    color: gray;
}

h1 {
    text-align: center;
    margin-top: 2rem;
}

.searchingBar-img {
    display: block;
    margin: 4rem auto 2rem auto;
    max-width: 100%;
    height: auto;
}

.regist-post {
    display: block;
    margin-left: auto;
    margin-right: 0;
    cursor: pointer;
    max-width: 150px;
}

.board-wrapper {
    margin-top: 2rem;
}

.post-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
    border-radius: 12px;
    border: 2px solid lightgray;
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    font-size: 16px;
}
</style>