
import { createRouter, createWebHistory } from 'vue-router'
import Regist from '@/components/Regist.vue';
import SubscribeList from '@/components/subscribe/SubscribeList.vue';
import BlockUserList from '@/components/block/BlockUserList.vue';


const router = createRouter({


    history: createWebHistory(),
    routes: [
        {
            path: '/register',
            name: 'Register',
            component: Regist
        },
        {
            path: '/subscribeList',
            name: 'Subscribe',
            component: SubscribeList
        },
        {
            path: '/blockList',
            name: 'Block',
            component: BlockUserList
        }



    ]


});




export default router