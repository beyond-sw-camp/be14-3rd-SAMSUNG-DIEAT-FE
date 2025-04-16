<template>
    <div class="weekly-stats">
        <h3>한 주 평균</h3>
        <div class="stats-overview">
            <div class="main-stat">
                <div class="stat-value" :style="{ color: caloriesColor }">{{ averageCalories }}</div>
                <div class="stat-label">칼로리(kcal)</div>
            </div>
            <div class="main-stat">
                <div class="stat-value">86%</div>
                <div class="stat-label">목표 달성률</div>
            </div>
        </div>
        <div class="stats-detail">
            <div class="stat-item">
                <div class="stat-label">평균 칼로리</div>
                <div class="stat-value">{{ averageCalories }} kcal</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">평균 탄수화물</div>
                <div class="stat-value">{{ averageCarbs }} g</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">평균 단백질</div>
                <div class="stat-value">{{ averageProtein }} g</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">평균 지방</div>
                <div class="stat-value">{{ averageFat }} g</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const selectedDate = inject('selectedDate')
const meals = inject('meals')

const TARGET_VALUES = {
    calories: 2000,
    carbs: 300,
    protein: 200,
    fat: 50
}

const getNutrientColor = (current, target) => {
    const ratio = (current / target) * 100
    if (ratio > 110) return '#D30E0E'
    if (ratio > 100) return '#FF9D00'
    return '#000'
}

const weeklyMeals = computed(() => {
    if (!meals.value || !selectedDate.value) return [];

    try {
        const currentDate = new Date(selectedDate.value + 'T00:00:00+09:00');
        const dayOfWeek = currentDate.getDay(); // 0(일요일)~6(토요일)
        
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - dayOfWeek);
        const startDateStr = startDate.toISOString().split('T')[0];
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        const endDateStr = endDate.toISOString().split('T')[0];
        
        return meals.value.filter(meal => {
            if (!meal.meal_dt) return false;
            try {
                const date = new Date(meal.meal_dt);
                const offset = date.getTimezoneOffset() * 60000;
                const koreanTime = new Date(date.getTime() + offset + (9 * 60 * 60 * 1000));
                const mealDateStr = koreanTime.toISOString().split('T')[0];
                
                return mealDateStr >= startDateStr && mealDateStr <= endDateStr;
            } catch (error) {
                console.error('날짜 형식 오류:', error);
                return false;
            }
        });
    } catch (error) {
        console.error('주간 식사 데이터 필터링 오류:', error);
        return [];
    }
});

const calculateDailyAverage = (meals, nutrientKey) => {
    if (!meals || meals.length === 0) return 0;

    try {
        const dailyTotals = meals.reduce((acc, meal) => {
            const date = new Date(meal.meal_dt);
            const offset = date.getTimezoneOffset() * 60000;
            const koreanTime = new Date(date.getTime() + offset + (9 * 60 * 60 * 1000));
            const dateStr = koreanTime.toISOString().split('T')[0];
            
            if (!acc[dateStr]) {
                acc[dateStr] = 0;
            }
            acc[dateStr] += meal[nutrientKey] || 0;
            return acc;
        }, {});

        const daysWithMeals = Object.keys(dailyTotals).length;
        if (daysWithMeals === 0) return 0;

        const total = Object.values(dailyTotals).reduce((sum, daily) => sum + daily, 0);
        return Math.round(total / daysWithMeals);
    } catch (error) {
        console.log(`${nutrientKey} 계산 중 오류 발생.`);
        return 0;
    }
};

const averageCalories = computed(() => {
    return calculateDailyAverage(weeklyMeals.value, 'meal_calories')
})

const caloriesColor = computed(() => getNutrientColor(averageCalories.value, TARGET_VALUES.calories))

const averageCarbs = computed(() => {
    return calculateDailyAverage(weeklyMeals.value, 'meal_carbs')
})

const averageProtein = computed(() => {
    return calculateDailyAverage(weeklyMeals.value, 'meal_protein')
})

const averageFat = computed(() => {
    return calculateDailyAverage(weeklyMeals.value, 'meal_fat')
})
</script>

<style scoped>
.weekly-stats {
    width: 400px;
    height: 332px;
    background-color: white;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
    width: 287px;
    font-size: 16px;
    letter-spacing: -0.02em;
    font-weight: 800;
    font-family: Inter;
    color: #000;
    text-align: left;
    display: flex;
    align-items: center;
    height: 25px;
    margin: 0;
    padding: 0;
}

.stats-overview {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    gap: 19px;
}

.main-stat {
    text-align: center;
    background-color: #F5F5F5;
    border-radius: 5px;
    height: 46px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;
}

.main-stat:first-child {
    width: 227px;
}

.main-stat:last-child {
    width: 114px;
}

.main-stat .stat-value {
    font-size: 12px;
    font-weight: 600;
    font-family: Inter;
    margin-bottom: 4px;
    transition: color 0.3s ease;
}

.main-stat .stat-label {
    font-size: 8px;
    font-weight: 500;
    font-family: Inter;
    color: #696969;
}

.stats-detail {
    margin-top: 20px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(107, 107, 107, 0.11);
}

.stat-item:last-child {
    border-bottom: none;
}

.stat-item .stat-label {
    font-size: 14px;
    color: #000;
    font-family: Pretendard;
    font-weight: 400;
    letter-spacing: -0.02em;
}

.stat-item .stat-value {
    font-size: 14px;
    font-weight: 600;
    color: #696969;
    font-family: Pretendard;
    letter-spacing: -0.02em;
}
</style>
