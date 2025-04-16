<template>
    <div class="food-register-page">
        <h2 class="food-register-title" v-if="!isModal">음식 데이터 등록</h2>
        <RegisterFoodForm @register="handleRegisterFood" />
    </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue'
import RegisterFoodForm from '@/components/food/registerFood/RegisterFoodForm.vue'

function handleRegisterFood(food) {
    console.log('페이지에서 등록됨:', food)
    // TODO: 등록 처리 API 호출 등
}
</script>

<style scoped>
@import '@/assets/food/registerFood.css';
</style>