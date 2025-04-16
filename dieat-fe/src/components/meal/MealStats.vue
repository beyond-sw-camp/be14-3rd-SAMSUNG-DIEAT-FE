<template>
    <div class="meal-stats">
        <h3>하루 총합</h3>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-content">
                    <div class="stat-label">칼로리</div>
                    <div class="stat-value" :style="{ color: caloriesColor }">
                        {{ calculateTotalCalories() }} kcal
                    </div>
                </div>
                <div class="line-div"></div>
                <div class="nutrient-bar">
                    <div class="nutrient-fill calories-fill" :style="{ width: caloriesRatio }"></div>
                </div>
                <div class="target-value">{{ TARGET_VALUES.calories }} kcal</div>
            </div>
            <div class="stat-item">
                <div class="stat-content">
                    <div class="stat-label">탄수화물</div>
                    <div class="stat-value" :style="{ color: carbsColor }">
                        {{ calculateTotalCarbs() }} g
                    </div>
                </div>
                <div class="line-div"></div>
                <div class="nutrient-bar">
                    <div class="nutrient-fill carbs-fill" :style="{ width: carbsRatio }"></div>
                </div>
                <div class="target-value">{{ TARGET_VALUES.carbs }}g</div>
            </div>
            <div class="stat-item">
                <div class="stat-content">
                    <div class="stat-label">단백질</div>
                    <div class="stat-value" :style="{ color: proteinColor }">
                        {{ calculateTotalProtein() }} g
                    </div>
                </div>
                <div class="line-div"></div>
                <div class="nutrient-bar">
                    <div class="nutrient-fill protein-fill" :style="{ width: proteinRatio }"></div>
                </div>
                <div class="target-value">{{ TARGET_VALUES.protein }}g</div>
            </div>
            <div class="stat-item">
                <div class="stat-content">
                    <div class="stat-label">지방</div>
                    <div class="stat-value" :style="{ color: fatColor }">
                        {{ calculateTotalFat() }} g
                    </div>
                </div>
                <div class="line-div"></div>
                <div class="nutrient-bar">
                    <div class="nutrient-fill fat-fill" :style="{ width: fatRatio }"></div>
                </div>
                <div class="target-value">{{ TARGET_VALUES.fat }}g</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const selectedDate = inject('selectedDate')
const meals = inject('meals')

// 목표치 (임시값)
const TARGET_VALUES = {
    calories: 2000,
    carbs: 300,
    protein: 200,
    fat: 50
}

const todayMeals = computed(() => {
    if (!meals.value) return [];
    
    return meals.value.filter(meal => {
        if (!meal.meal_dt) return false;
        try {
            // 한국 시간대로 변환하여 날짜 비교
            const date = new Date(meal.meal_dt);
            const offset = date.getTimezoneOffset() * 60000;
            const koreanTime = new Date(date.getTime() + offset + (9 * 60 * 60 * 1000));
            const mealDateStr = koreanTime.toISOString().split('T')[0];
            
            return mealDateStr === selectedDate.value;
        } catch (error) {
            console.error('날짜 형식 오류:', error);
            return false;
        }
    });
})

const calculateTotalCalories = () => {
    if (!todayMeals.value || todayMeals.value.length === 0) {
        return 0
    }
    const total = todayMeals.value.reduce((sum, meal) => {
        const calories = meal.meal_calories || 0
        return sum + calories
    }, 0)
    return Math.round(total)
}

const calculateTotalCarbs = () => {
    if (!todayMeals.value || todayMeals.value.length === 0) {
        return 0
    }
    const total = todayMeals.value.reduce((sum, meal) => {
        const carbs = meal.meal_carbs || 0
        return sum + carbs
    }, 0)
    return Math.round(total)
}

const calculateTotalProtein = () => {
    if (!todayMeals.value || todayMeals.value.length === 0) {
        return 0
    }
    const total = todayMeals.value.reduce((sum, meal) => {
        const protein = meal.meal_protein || 0
        return sum + protein
    }, 0)
    return Math.round(total)
}

const calculateTotalFat = () => {
    if (!todayMeals.value || todayMeals.value.length === 0) {
        return 0
    }
    const total = todayMeals.value.reduce((sum, meal) => {
        const fat = meal.meal_fat || 0
        return sum + fat
    }, 0)
    return Math.round(total)
}

const getNutrientColor = (current, target, isProtein = false) => {
    const ratio = (current / target) * 100
    
    if (isProtein) {
        if (ratio < 90) return '#D30E0E'
        if (ratio < 100) return '#FF9D00'
        return '#696969'
    } else {
        if (ratio > 110) return '#D30E0E'
        if (ratio > 100) return '#FF9D00'
        return '#696969'
    }
}

const caloriesColor = computed(() => getNutrientColor(calculateTotalCalories(), TARGET_VALUES.calories))
const carbsColor = computed(() => getNutrientColor(calculateTotalCarbs(), TARGET_VALUES.carbs))
const proteinColor = computed(() => getNutrientColor(calculateTotalProtein(), TARGET_VALUES.protein, true))
const fatColor = computed(() => getNutrientColor(calculateTotalFat(), TARGET_VALUES.fat))

const calculateNutrientRatio = (current, target) => {
    const ratio = (current / target) * 100
    return Math.min(ratio, 100) + '%'
}

const caloriesRatio = computed(() => calculateNutrientRatio(calculateTotalCalories(), TARGET_VALUES.calories))
const carbsRatio = computed(() => calculateNutrientRatio(calculateTotalCarbs(), TARGET_VALUES.carbs))
const proteinRatio = computed(() => calculateNutrientRatio(calculateTotalProtein(), TARGET_VALUES.protein))
const fatRatio = computed(() => calculateNutrientRatio(calculateTotalFat(), TARGET_VALUES.fat))
</script>

<style scoped>
.meal-stats {
    width: 400px;
    height: 376px;
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
    width: 287px;
    position: relative;
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
}

.stats-grid {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    position: relative;
    width: 347px;
    margin-left: auto;
    margin-right: auto;
}

.stats-grid::before {
    content: '';
    position: absolute;
    top: 20px;
    height: 245px;
    left: 33.33%;
    border-left: 1px dashed rgba(154, 154, 154, 0.8);
    z-index: 3;
}

.stats-grid::after {
    content: '';
    position: absolute;
    top: 20px;
    height: 245px;
    left: 66.66%;
    border-left: 1px dashed rgba(154, 154, 154, 0.8);
    z-index: 3;
}

.stat-item {
    text-align: center;
    background: white;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
    padding: 0;
    position: relative;
    z-index: 2;
}

.stat-item:nth-child(1) {
    margin-bottom: 15px;
}

.stat-item:nth-child(2) {
    margin-bottom: 15px;
}

.stat-item:nth-child(3) {
    margin-bottom: 15px;
}

.stat-item:nth-child(4) {
    margin-bottom: 0;
}

.stat-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 343px;
    margin-bottom: 4px;
    margin-left: auto;
    margin-right: auto;
}

.line-div {
    width: 347px;
    position: relative;
    border-top: 1px solid rgba(107, 107, 107, 0.11);
    box-sizing: border-box;
    height: 1px;
    margin-bottom: 10px;
    margin-left: auto;
    margin-right: auto;
}

.stat-label {
    width: 54px;
    position: relative;
    font-size: 14px;
    letter-spacing: -0.02em;
    font-family: Inter;
    color: #000;
    text-align: left;
    display: flex;
    align-items: center;
    height: 16px;
    margin-left: 0;
}

.stat-value {
    font-size: 14px;
    font-weight: 600;
    font-family: Inter;
    margin-right: 2px;
    width: 62px;
    text-align: right;
}

.nutrient-bar {
    width: 347px;
    height: 8px;
    background-color: #f5f5f5;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 4px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    z-index: 2;
}

.nutrient-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;
}

.calories-fill {
    background-color: #FD5D5D;
}

.carbs-fill {
    background-color: #FDCA5D; 
}

.protein-fill {
    background-color: #50E250;
}

.fat-fill {
    background-color: #5D7DFD;
}

.target-value {
    width: 62px;
    font-size: 10px;
    letter-spacing: -0.02em;
    font-weight: 800;
    font-family: Inter;
    color: #9e9e9e;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 16px;
    position: relative;
    margin-right: 10px;
    align-self: flex-end;
}
</style>