<template>
  <div class="card-container">
    <div v-for="item in summaryItems" :key="item.label" class="summary-item">
      <strong :class="item.textClass">{{ item.label }}</strong>
      <div class="bar-container">
        <div
          class="bar-fill"
          :style="{
            width: item.goal ? `${(item.value / item.goal) * 100}%` : '0%',
            backgroundColor: item.color
          }"
        ></div>
      </div>
      <span class="value">{{ item.value }} / {{ item.goal }} {{ item.unit }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'

// 오늘 날짜 (YYYY-MM-DD 형식)
const today = dayjs().format('YYYY-MM-DD')

// API에서 받아온 식사 데이터를 담을 reactive 변수
const meals = ref([])
// API에서 받아온 영양목표 데이터를 담을 reactive 변수 (기본값 0)
const nutritionGoals = ref({
  calories: 0,
  carbs: 0,
  protein: 0,
  fat: 0
})

// onMounted에서 API 호출 후, 데이터를 변환하여 저장
onMounted(async () => {
  // meals 데이터 fetch
  const response = await fetch('http://localhost:3000/meals')
  const allMeals = await response.json()
  console.log('API에서 받아온 meals:', allMeals)
  
  // API 응답의 meal_dt를 YYYY-MM-DD 형식으로 변환하고,
  // 영양 정보는 필요한 필드명으로 변환하여 저장합니다.
  meals.value = allMeals.map(m => ({
    date: dayjs(m.meal_dt).format('YYYY-MM-DD'),
    calories: m.meal_calories,
    carbs: m.meal_carbs,
    protein: m.meal_protein,
    fat: m.meal_fat
  }))
  
  // nutritionGoals 데이터 fetch
  const responseGoals = await fetch('http://localhost:3000/nutritionGoals')
  const fetchedNutritionGoals = await responseGoals.json()
  console.log('API에서 받아온 nutritionGoals:', fetchedNutritionGoals)
  nutritionGoals.value = fetchedNutritionGoals
})

// 오늘 날짜의 식사만 필터링
const todayMeals = computed(() =>
  meals.value.filter(meal => meal.date === today)
)

// 누적 영양소 계산 (오늘의 식사들을 모두 합산)
const total = computed(() => {
  return todayMeals.value.reduce(
    (acc, meal) => {
      acc.calories += meal.calories
      acc.carbs += meal.carbs
      acc.protein += meal.protein
      acc.fat += meal.fat
      return acc
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0 }
  )
})

// 초과량에 따른 텍스트 색상 결정 함수
function getTextColor(value, goal) {
  const overPercent = ((value - goal) / goal) * 100
  if (overPercent > 20) return 'over-red'
  if (overPercent > 10) return 'over-orange'
  if (overPercent > 0) return 'over-yellow'
  return ''
}

// 렌더링용 summary 아이템 배열 (nutritionGoals는 reactive 변수이므로 .value 사용)
const summaryItems = computed(() => [
  {
    label: '칼로리',
    value: total.value.calories,
    goal: nutritionGoals.value.calories,
    unit: 'kcal',
    color: '#FD5D5D',
    textClass: getTextColor(total.value.calories, nutritionGoals.value.calories)
  },
  {
    label: '탄수화물',
    value: total.value.carbs,
    goal: nutritionGoals.value.carbs,
    unit: 'g',
    color: '#FDCA5D',
    textClass: getTextColor(total.value.carbs, nutritionGoals.value.carbs)
  },
  {
    label: '단백질',
    value: total.value.protein,
    goal: nutritionGoals.value.protein,
    unit: 'g',
    color: '#50E250',
    textClass: getTextColor(total.value.protein, nutritionGoals.value.protein)
  },
  {
    label: '지방',
    value: total.value.fat,
    goal: nutritionGoals.value.fat,
    unit: 'g',
    color: '#5D7DFD',
    textClass: getTextColor(total.value.fat, nutritionGoals.value.fat)
  }
])
</script>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.summary-item {
  font-size: 14px;
}

.bar-container {
  background-color: #e0e0e0;
  height: 10px;
  border-radius: 6px;
  overflow: hidden;
  margin: 4px 0;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.value {
  font-size: 12px;
  color: #555;
}

/* 색상 변화용 텍스트 클래스 */
.over-yellow {
  color: #ffbb00;
}

.over-orange {
  color: #ff7f50;
}

.over-red {
  color: #ff3b3b;
}
</style>
