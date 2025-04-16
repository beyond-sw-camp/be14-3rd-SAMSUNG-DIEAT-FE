<template>
    <div class="meal-list">
        <div v-if="filteredMeals.length === 0" class="no-meals">
            등록된 식사 정보가 없습니다.
        </div>
        <MealCard
            v-else
            v-for="meal in filteredMeals"
            :key="meal.id"
            :meal="meal"
        />
    </div>
</template>

<script setup>
    import { inject, computed } from 'vue'
    import MealCard from '@/components/meal/MealCard.vue'

    const selectedDate = inject('selectedDate')
    const meals = inject('meals')

    const filteredMeals = computed(() => {
        if (!meals.value) return [];
        
        return meals.value.filter(meal => {
            // 식사 날짜 필드가 여러 이름으로 존재함 (meal_dt 또는 meal_time)
            const mealDateField = meal.meal_dt || meal.meal_time;
            if (!mealDateField) {
                return false;
            }
            
            try {
                // 한국 시간대로 변환하여 날짜 비교
                const date = new Date(mealDateField);
                const offset = date.getTimezoneOffset() * 60000;
                const koreanTime = new Date(date.getTime() + offset + (9 * 60 * 60 * 1000));
                const mealDateStr = koreanTime.toISOString().split('T')[0];
                
                return mealDateStr === selectedDate.value;
            } catch (error) {
                console.error('날짜 형식 오류:', error, meal);
                return false;
            }
        });
    })
</script>

<style scoped>
    .meal-list {
        width: 582px;
        margin: 0 auto;
        padding: 20px;
    }

    .no-meals {
        text-align: center;
        color: #999;
        padding: 40px;
        background-color: #f5f5f5;
        border-radius: 4px;
        font-size: 1.1em;
    }
</style>