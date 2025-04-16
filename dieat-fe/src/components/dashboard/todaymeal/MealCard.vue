<template>
  <div class="meal-card">
    <img :src="meal.image" alt="meal image" class="meal-image" />

    <div class="meal-info">
      <div class="header-wrapper">
        <div class="text-info">
          <h4 class="meal-name">{{ meal.name }}</h4>
          <p class="meal-description">{{ meal.ingredients }}</p>
        </div>
        <span class="meal-time">{{ meal.time }}</span>
      </div>

      <ul class="nutrition-list">
        <li class="nutrient-box" v-for="(label, key) in nutrientLabels" :key="key">
          <div class="nutrient-value">{{ meal[key] }}</div>
          <div class="nutrient-label">{{ label }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  meal: {
    type: Object,
    required: true
  }
})

const nutrientLabels = {
  calories: '칼로리(kcal)',
  carbs: '탄수화물(g)',
  protein: '단백질(g)',
  fat: '지방(g)',
  sugar: '당(g)'
}
</script>

<style scoped>
.meal-card {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  gap: 16px;
  position: relative;
}

.meal-image {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.meal-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  position: relative;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.text-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meal-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  word-break: keep-all;
}

.meal-description {
  font-size: 14px;
  color: #555;
  margin: 0;
  word-break: break-word;
}

.meal-time {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 13px;
  color: #888;
  white-space: nowrap;
}

.nutrition-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nutrient-box {
  background-color: #f3f3f3;
  padding: 8px 12px;
  border-radius: 12px;
  text-align: center;
}

.nutrient-value {
  font-size: 16px;
  font-weight: bold;
}

.nutrient-label {
  font-size: 13px;
  color: #555;
}
</style>
