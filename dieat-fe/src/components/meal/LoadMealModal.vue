<template>
    <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>식사 불러오기</h2>
                <button class="close-button" @click="closeModal">×</button>
            </div>
            <div class="modal-body">
                <div class="calendar-section">
                    <div class="calendar-header">
                        <div class="calendar-navigation">
                            <button @click="prevMonth">
                                <span class="arrow left"></span>
                            </button>
                            <span class="current-month">{{ loadMealMonth }}</span>
                            <button @click="nextMonth">
                                <span class="arrow right"></span>
                            </button>
                        </div>
                    </div>
                    <div class="calendar-grid">
                        <div class="weekdays">
                            <span>일</span>
                            <span>월</span>
                            <span>화</span>
                            <span>수</span>
                            <span>목</span>
                            <span>금</span>
                            <span>토</span>
                        </div>
                        <div class="days">
                            <div
                                v-for="day in calendarDays"
                                :key="day.date"
                                :class="[
                                    'day',
                                    { 'current-month': day.currentMonth },
                                    { 'other-month': !day.currentMonth },
                                    { 'selected': isSelectedDate(day.date) },
                                    { 'has-meal': hasMeal(day.date) }
                                ]"
                                @click="selectDate(day.date)"
                            >
                                {{ day.dayNumber }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-section">
                    <div class="meal-list-section">
                        <div class="meal-list-header">
                            <h4>식사 목록</h4>
                        </div>
                        <div class="meal-list">
                            <div 
                                v-for="meal in selectedDateMeals" 
                                :key="meal.id" 
                                class="meal-card"
                                :class="{ 'selected-meal': selectedMeal?.id === meal.id }"
                                @click="selectMeal(meal)"
                            >
                                <button v-if="showDeleteButton" class="meal-card-delete-btn" @click.stop="$emit('delete', meal.id)">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L11 11" stroke="black" stroke-width="2" stroke-linecap="round"/>
                                        <path d="M11 1L1 11" stroke="black" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                </button>
                                <div class="meal-card-content">
                                    <div class="meal-info">
                                        <div class="meal-name">{{ meal.name }}</div>
                                        <div class="meal-time">{{ meal.time }}</div>
                                    </div>
                                    <div class="meal-nutrients">
                                        <div class="nutrient">
                                            <span class="value">{{ calculateNutrient(meal.kcal, meal.quantity) }}</span>
                                            <span class="unit">kcal</span>
                                        </div>
                                        <div class="nutrient">
                                            <span class="value">{{ calculateNutrient(meal.carbs, meal.quantity) }}</span>
                                            <span class="unit">탄수화물</span>
                                        </div>
                                        <div class="nutrient">
                                            <span class="value">{{ calculateNutrient(meal.protein, meal.quantity) }}</span>
                                            <span class="unit">단백질</span>
                                        </div>
                                        <div class="nutrient">
                                            <span class="value">{{ calculateNutrient(meal.fat, meal.quantity) }}</span>
                                            <span class="unit">지방</span>
                                        </div>
                                        <div class="nutrient">
                                            <span class="value">{{ calculateNutrient(meal.sodium, meal.quantity) }}</span>
                                            <span class="unit">나트륨</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="cancel-button" @click="closeModal">취소</button>
                        <button class="confirm-button" @click="confirmSelection">확인</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    showDeleteButton: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close', 'confirm', 'delete']);

const currentDate = ref(new Date());
const selectedDate = ref(null);
const mealsData = ref([]);
const selectedDateMeals = ref([]);
const selectedMeal = ref(null);

const API_URL = 'http://localhost:3000/meals';

const fetchMonthlyMeals = async () => {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            const currentYear = currentDate.value.getFullYear();
            const currentMonth = String(currentDate.value.getMonth() + 1).padStart(2, '0');
            const yearMonth = `${currentYear}-${currentMonth}`;
            
            mealsData.value = data
                .filter(meal => meal && meal.meal_dt && typeof meal.meal_dt === 'string')
                .filter(meal => {
                    try {
                        // 날짜 부분만 추출 (YYYY-MM-DD)
                        const mealDateParts = meal.meal_dt.split(/[T ]/);
                        if (mealDateParts.length === 0) return false;
                        
                        const mealDateStr = mealDateParts[0];
                        if (!mealDateStr || mealDateStr.includes('undefined')) return false;
                        
                        // yearMonth로 시작하는지 확인 (같은 년도-월인지)
                        return mealDateStr.startsWith(yearMonth);
                    } catch (error) {
                        console.error('날짜 필터링 오류:', error, meal);
                        return false;
                    }
                })
                .map(meal => meal.meal_dt); // 날짜 값만 추출
        } else {
            mealsData.value = [];
        }
    } catch (error) {
        console.error('식사 데이터 조회 중 오류 발생:', error);
        mealsData.value = [];
    }
};

watch(currentDate, () => {
    fetchMonthlyMeals();
});

onMounted(() => {
    if (props.show) {
        fetchMonthlyMeals();
    }
});

watch(() => props.show, (newValue) => {
    if (newValue) {
        fetchMonthlyMeals();
    }
});

const loadMealMonth = computed(() => {
    return `${currentDate.value.getFullYear()}년 ${currentDate.value.getMonth() + 1}월`;
});

const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    
    // 현재 달의 첫 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 이전 달의 마지막 날
    const prevMonthLastDay = new Date(year, month, 0);
    
    // 달력에 표시할 날짜들을 저장할 배열
    const days = [];
    

    const firstDayWeekday = firstDay.getDay();
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
        days.push({
            date: new Date(year, month - 1, prevMonthLastDay.getDate() - i),
            dayNumber: prevMonthLastDay.getDate() - i,
            currentMonth: false
        });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({
            date: new Date(year, month, i),
            dayNumber: i,
            currentMonth: true
        });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({
            date: new Date(year, month + 1, i),
            dayNumber: i,
            currentMonth: false
        });
    }
    
    return days;
});

const isSelectedDate = (date) => {
    if (!selectedDate.value) return false;
    return date.toDateString() === selectedDate.value.toDateString();
};

const selectDate = async (date) => {
    selectedDate.value = date;
    await fetchMealsByDate(date);
};

const prevMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
    );
};

const nextMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
    );
};

const closeModal = () => {
    emit('close');
};

const confirmSelection = async () => {
    // 식사가 선택되었는지 확인
    if (!selectedMeal.value) {
        alert('식사를 선택해주세요.');
        return;
    }
    
    try {

        const response = await fetch(`${API_URL}?meal_code=${selectedMeal.value.id}`);
        
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }
        
        const meals = await response.json();
        
        if (!meals || meals.length === 0) {
            throw new Error('선택한 식사 정보를 찾을 수 없습니다.');
        }
        
        const mealData = meals[0];
        
        emit('confirm', {
            date: selectedDate.value,
            meal: {
                meal_name: mealData.meal_title,
                meal_description: mealData.meal_desc,
                meal_time: mealData.meal_dt,
                file: mealData.file ? mealData.file[0] : null,
                foods: mealData.meal_foods || []
            }
        });
    } catch (error) {
        console.error('식사 정보 조회 중 오류 발생:', error);
        alert('식사 정보를 불러오는 중 오류가 발생했습니다.');
    }
};

const hasMeal = (date) => {
    if (!mealsData.value || mealsData.value.length === 0) {
        return false;
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const targetDate = `${year}-${month}-${day}`;
    
    return mealsData.value.some(mealDate => {
        if (!mealDate || typeof mealDate !== 'string') return false;
        
        try {
            const mealDateParts = mealDate.split(/[T ]/);
            if (mealDateParts.length === 0) return false;
            
            const mealDateStr = mealDateParts[0];
            if (!mealDateStr) return false;
        
            if (mealDateStr.includes('undefined')) return false;
            
            return mealDateStr === targetDate;
        } catch (error) {
            console.error('날짜 비교 오류:', error, mealDate);
            return false;
        }
    });
};

const fetchMealsByDate = async (date) => {
    try {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const targetDate = `${year}-${month}-${day}`;
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }
        
        const allData = await response.json();
        
        const filteredData = allData
            .filter(meal => meal && meal.meal_dt && typeof meal.meal_dt === 'string')
            .filter(meal => {
                try {

                    const mealDateParts = meal.meal_dt.split(/[T ]/);
                    if (mealDateParts.length === 0) return false;
                    
                    const mealDateStr = mealDateParts[0];
                    if (!mealDateStr || mealDateStr.includes('undefined')) return false;
                    
                    return mealDateStr === targetDate;
                } catch (error) {
                    console.error('날짜 변환 오류:', error, meal);
                    return false;
                }
            });

        if (filteredData.length === 0) {
            alert('선택한 날짜에 등록된 식사 정보가 없습니다.');
            selectedDateMeals.value = [];
            return;
        }

        const getMinutes = (dateTimeStr) => {
            try {

                const timeParts = dateTimeStr.split(/[T ]/);
                if (timeParts.length < 2) return 0;
                
                const timePart = timeParts[1];
                if (!timePart) return 0;
                
                const timeElements = timePart.split(':');
                if (timeElements.length < 2) return 0;
                
                const hours = parseInt(timeElements[0]) || 0;
                const minutes = parseInt(timeElements[1]) || 0;
                
                return hours * 60 + minutes;
            } catch (error) {
                console.error('시간 변환 오류:', error, dateTimeStr);
                return 0;
            }
        };

        filteredData.sort((a, b) => {
            const minutesA = getMinutes(a.meal_dt);
            const minutesB = getMinutes(b.meal_dt);
            return minutesA - minutesB;
        });

        selectedDateMeals.value = filteredData.map(meal => {

            let mealTime = '';
            try {
                const mealDateStr = meal.meal_dt;

                const timeParts = mealDateStr.split(/[T ]/);
                if (timeParts.length >= 2) {
                    const timeElements = timeParts[1].split(':');
                    if (timeElements.length >= 2) {
                        mealTime = `${timeElements[0]}:${timeElements[1]}`;
                    }
                }
            } catch (error) {
                console.error('시간 형식 변환 오류:', error, meal);
                mealTime = '00:00';
            }
            
            return {
                id: meal.meal_code,
                name: meal.meal_title || '식사 이름 없음',
                time: mealTime || '00:00',
                kcal: Math.round(meal.meal_calories) || 0,
                carbs: Math.round(meal.meal_carbs) || 0,
                protein: Math.round(meal.meal_protein) || 0,
                fat: Math.round(meal.meal_fat) || 0,
                sodium: Math.round(meal.meal_sugar) || 0
            };
        });
    } catch (error) {
        console.error('식사 데이터 조회 중 오류 발생:', error);
        selectedDateMeals.value = [];
    }
};

const selectMeal = (meal) => {
    selectedMeal.value = meal;
};

const calculateNutrient = (value, quantity) => {
    const qty = parseFloat(quantity) || 1;
    return Math.floor(parseFloat(value) * qty);
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    width: 1225px;
    height: 611px;
    max-height: 611px;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
}

.close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
}

.modal-body {
    padding: 0;
    display: flex;
    gap: 20px;
    height: calc(611px - 70px);
}

.calendar-section {
    flex: 2;
    border: none;
    border-right: 1px solid #eee;
    border-radius: 0;
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.calendar-header {
    margin-bottom: 0;
    background-color: #F6F6F6;
    padding: 15px;
    border-radius: 0;
}

.calendar-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0;
    padding: 0 5px;
}

.calendar-navigation button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    margin: 0 -5px;
}

.arrow {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-top: 2px solid #333;
    border-right: 2px solid #333;
}

.arrow.left {
    transform: rotate(-135deg);
}

.arrow.right {
    transform: rotate(45deg);
}

.current-month {
    font-weight: bold;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    margin-bottom: 10px;
}

.weekdays span {
    font-family: 'Inter';
    font-weight: 600;
    font-size: 14px;
    color: #555555;
}

.weekdays span:first-child {
    color: #FF4B4B;
}

.weekdays span:last-child {
    color: #333;
}

.day:nth-child(7n+1) {
    color: #FF4B4B;
}

.day:nth-child(7n) {
    color: #333;
}

.other-month.day:nth-child(7n+1),
.other-month.day:nth-child(7n) {
    color: #ccc;
}

.days {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 72px);
    gap: 0.5px;
    background-color: #f5f5f5;
    padding: 0.5px;
}

.day {
    height: 72px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: transparent;
    cursor: pointer;
    position: relative;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 14px;
    padding: 8px 0 0 12px;
}

.day:hover {
    background-color: #f8f8f8;
}

.current-month {
    color: #000000;
    background-color: white;
}

.other-month {
    color: #ccc;
    background-color: #fafafa;
}

.selected {
    background-color: #FFA18E !important;
    color: white !important;
    font-family: 'Inter';
    font-weight: 800;
    font-size: 14px;
}

.selected:hover {
    background-color: #ff9277 !important;
}

.selected.has-meal {
    background-color: #FFA18E !important;
}

.right-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-right: 20px;
    overflow: hidden;
}

.meal-list-section {
    flex: 1;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 17px 17px 17px 17px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.meal-list-header {
    margin-bottom: 15px;
}

.meal-list-header h4 {
    margin: 0;
    font-size: 16px;
}

.meal-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 0 0 0;
    margin: 0;
    display: flex;
    flex-direction: column;
}

.modal-footer {
    padding: 0;
    border-top: none;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    height: 40px;
    margin-bottom: 15px;
}

.cancel-button {
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    background-color: #BEBEBE;
    color: white;
    cursor: pointer;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 14px;
    position: relative;
    right: 40px;
}

.confirm-button {
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    background-color: #FF4B4B;
    color: white;
    cursor: pointer;
    position: relative;
    right: 200px;
}

.confirm-button:hover {
    background-color: #ff3333;
}

.cancel-button:hover {
    background-color: #d3d3d3;
}

.calendar-grid {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
}

.has-meal {
    background-color: #FFF8ED !important;
    z-index: 1;
}

.has-meal:hover {
    background-color: #FFF0DB !important;
}

.selected.has-meal {
    background-color: #FFA18E !important;
}

.meal-card {
    background: white;
    border-radius: 8px;
    padding: 0;
    margin-bottom: 12px;
    margin-left: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.2s ease;
}

.selected-meal {
    border: 2px solid #FFA18E;
}

.meal-card-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
}

.meal-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.meal-name {
    font-family: 'Inter';
    font-weight: 600;
    font-size: 16px;
    color: #000000;
}

.meal-time {
    font-family: 'Inter';
    font-weight: 400;
    font-size: 14px;
    color: #666666;
}

.meal-nutrients {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #F8F8F8;
    padding: 12px;
    border-radius: 4px;
}

.nutrient {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.nutrient .value {
    font-family: 'Inter';
    font-weight: 600;
    font-size: 14px;
    color: #000000;
}

.nutrient .unit {
    font-family: 'Inter';
    font-weight: 400;
    font-size: 12px;
    color: #666666;
}

.meal-list {
    padding: 0 8px;
}

.meal-card-delete-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 2;
    background: none;
    border: none;
    padding: 0;
}

.meal-card-delete-btn:hover {
    transform: scale(1.1);
}

.meal-card-delete-btn:hover svg path {
    stroke: #333333;
}
</style> 