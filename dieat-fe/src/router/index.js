import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

import Home from '@/views/Home.vue';
import Regist from '@/components/member/Regist.vue';
import Login from '@/views/Login.vue';

import MealLayout from '@/views/meal/MealLayout.vue';
import RegistMeal from '@/views/meal/RegistMeal.vue';
import EditMeal from '@/views/meal/EditMeal.vue';

import DietPostLayout from '@/views/dietpost/DietPostLayout.vue';
import DietPostDetail from '@/views/dietpost/DietPostDetail.vue';

import SearchFood from '@/views/food/FoodSearchPage.vue';
import RegistFood from '@/views/food/FoodRegisterPage.vue';

import FreePostListPage from '@/views/post/FreePostListPage.vue';
import FreePostDetailPage from '@/views/post/FreePostDetailPage.vue';
import RegistFree from '@/views/post/FreePostWritePage.vue';

import NoticeLayout from '@/views/service/NoticeLayout.vue';
import QnaLayout from '@/views/service/QnaLayout.vue';
import personalUserInfo from '@/components/member/personalUserInfo.vue';
import SubscribeList from '@/components/subscribe/SubscribeList.vue';
import BlockUserList from '@/components/block/BlockUserList.vue';

import MyReportLayout from '@/views/service/MyReportLayout.vue';

import Dashboard from '@/views/dashboard/Dashboard.vue';

import NoticeDetail from '@/views/service/NoticeDetail.vue';
import QnaDetail from '@/views/service/QnaDetail.vue';
import RegistQna from '@/views/service/RegistQna.vue';

import BookMarkLayout from '@/views/bookmark/BookMarkLayout.vue';

import ReadSuccess from '@/views/succpost/SuccessLayout.vue';
import RegisterSuccPost from '@/views/succpost/RegisterSucc.vue'

import userEdit from '@/components/member/userEdit.vue';
import DailyPoint from '@/components/point/DailyPoint.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/regist', component: Regist },
    { path: '/login', component: Login },
    { path: '/personalUserInfo', component: personalUserInfo },
    { path: '/userEdit', component: userEdit },

    { path: '/meal', component: MealLayout },
    { path: '/registmeal', component: RegistMeal },
    { path: '/editmeal/:id', component: EditMeal },

    { path: '/dietPost', component: DietPostLayout },
    { path: '/dietPost/:id', component: DietPostDetail },

    { path: '/searchFood', component: SearchFood },
    { path: '/registerFood', component: RegistFood },
    { path: '/point', component: DailyPoint },

    { path: '/readFree', component: FreePostListPage },
    { path: '/readFree/:postId', component: FreePostDetailPage, props: true },
    { path: '/registerFree', component: RegistFree },

    { path: '/noticeLayout', component: NoticeLayout },
    { path: '/qnaLayout', component: QnaLayout },
    { path: '/subscribeMng', component: SubscribeList },
    { path: '/block', component: BlockUserList },

    { path: '/myReportLayout', component: MyReportLayout },

    { path: '/dashboard', component: Dashboard },

    { path: '/noticeDetail/:id', name: 'NoticeDetail', component: NoticeDetail, props: true },
    { path: '/qnaDetail/:id', name: 'QnaDetail', component: QnaDetail, props: true },
    { path: '/registQna', component: RegistQna },

    { path: '/category', component: BookMarkLayout },
    { path: '/readSuccess', component: ReadSuccess },
    { path: '/registerSuccess', component: RegisterSuccPost },
  ]
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLogin) {
    window.dispatchEvent(new Event('open-login-modal'))
    return next(false)
  }

  next()
})

export default router;