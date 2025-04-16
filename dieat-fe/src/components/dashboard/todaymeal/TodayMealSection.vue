<template>
  <div class="today-meal-section">
    <div class="meal-list">
      <MealCard v-for="(meal, index) in meals" :key="index" :meal="meal" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MealCard from './MealCard.vue'
import dayjs from 'dayjs'

// 오늘 날짜 (YYYY-MM-DD 형식)
const today = dayjs().format('YYYY-MM-DD')
const meals = ref([])

onMounted(async () => {
  const response = await fetch('http://localhost:3000/meals')
  const allMeals = await response.json()
  console.log('API에서 받은 meals:', allMeals)

  // 날짜 필터링: API의 meal_dt를 YYYY-MM-DD로 변환하여 오늘과 비교
  // 그리고 MealCard에서 사용하는 필드명으로 변환
  meals.value = allMeals
    .filter(m => dayjs(m.meal_dt).format('YYYY-MM-DD') === today)
    .map(m => ({
      image: m.meal_image,
      name: m.meal_title,
      ingredients: m.meal_desc,
      // 필요에 따라 meal_dt를 포맷하여 시간만 표시 (예: '08:00')
      time: dayjs(m.meal_dt).format('HH:mm'),
      calories: m.meal_calories,
      carbs: m.meal_carbs,
      protein: m.meal_protein,
      fat: m.meal_fat,
      sugar: m.meal_sugar
    }))

  console.log('TodayMealSection - 변환된 meals:', meals.value)
})
</script>

<style scoped>
.today-meal-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.meal-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 8px;
}
</style>
