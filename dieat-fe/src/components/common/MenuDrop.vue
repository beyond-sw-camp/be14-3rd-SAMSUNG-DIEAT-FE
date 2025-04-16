<template>
    <transition name="dropdown"> 
        <ul v-if="visible" class="dropdown">
            <li v-for="(item, index) in menuItems" :key="index">
                <RouterLink :to="item.href" class="dropdown-item">{{ item.label }}</RouterLink>
            </li>
        </ul>
    </transition>
</template>
  
<script setup>
    import { RouterLink } from 'vue-router'
  
    defineProps({
        menuItems: {
            type: Array,
            required: true,
        },
        visible: {
            type: Boolean,
            required: true,
        },
    })
</script>
  
<style scoped>

    /* 등장 전 */
    .dropdown-enter-from {
        transform: scaleY(0);
        opacity: 0;
    }

    /* 등장 후 */
    .dropdown-enter-to {
        transform: scaleY(1);
        opacity: 1;
    }

    /* 등장 중 */
    .dropdown-enter-active {
        transition: all 0.2s ease-out;
        transform-origin: top;
    }

/* 사라질 때 */
    .dropdown-leave-from {
        transform: scaleY(1);
        opacity: 1;
    }

    .dropdown-leave-to {
        transform: scaleY(0);
        opacity: 0;
    }

    .dropdown-leave-active {
        transition: all 0.2s ease-in;
        transform-origin: top;
    }



    .dropdown {
        position: absolute;
        top:200%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255,0.9);
        list-style: none;
        padding: 10px 10px;
        margin: 0;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        min-width: 250px;
        border-radius: 10px;
        border: 1.5px solid #155b45;
    }
  
    .dropdown-item {
        display: block;
        padding: 8px 10px;
        color: #333;
        text-decoration: none;
        text-align: center;
    }
  
    .dropdown-item:hover {
        background-color: #f0f0f0;
     }


</style>