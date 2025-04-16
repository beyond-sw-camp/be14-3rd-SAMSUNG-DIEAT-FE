<template>
    <div class="meal-card" @click="goToEdit">
        <button v-if="showDeleteButton" class="meal-card-delete-btn" @click.stop="$emit('delete')">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L11 11" stroke="black" stroke-width="2" stroke-linecap="round"/>
                <path d="M11 1L1 11" stroke="black" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </button>
        <div class="meal-image" :style="getImageStyle()"></div>
        <div class="meal-content">
            <div class="meal-header">
                <div class="meal-name">{{ meal.meal_title || meal.name || '제목 없음' }}</div>
                <div class="meal-time">{{ formatTime(meal.meal_dt) }}</div>
            </div>
            <div class="meal-desc">{{ meal.meal_desc || meal.description }}</div>
            <div class="meal-nutrition">
                <span>
                    <div>{{ calculateNutrient(meal.meal_calories || meal.calories, meal.quantity) }}</div>
                    <div>kcal</div>
                </span>
                <span>
                    <div>{{ calculateNutrient(meal.meal_carbs || meal.carbs, meal.quantity) }}</div>
                    <div>탄수</div>
                </span>
                <span>
                    <div>{{ calculateNutrient(meal.meal_protein || meal.protein, meal.quantity) }}</div>
                    <div>단백질</div>
                </span>
                <span>
                    <div>{{ calculateNutrient(meal.meal_fat || meal.fat, meal.quantity) }}</div>
                    <div>지방</div>
                </span>
                <span>
                    <div>{{ calculateNutrient(meal.meal_sugar || meal.sugar, meal.quantity) }}</div>
                    <div>당</div>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';
    
    const router = useRouter();
    
    const props = defineProps({
        meal: {
            type: Object,
            required: true
        },
        showDeleteButton: {
            type: Boolean,
            default: false
        }
    })

    defineEmits(['delete'])

    const goToEdit = () => {
        router.push(`/editmeal/${props.meal.id}`);
    };

    const getImageStyle = () => {
        // 1. meal_image가 있는 경우 해당 이미지 사용
        if (props.meal.meal_image) {
            return {
                backgroundImage: `url(${props.meal.meal_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        }
        
        // 2. file 배열이 있고 그 안에 path가 있는 경우 (base64 이미지)
        if (props.meal.file && props.meal.file.length > 0 && props.meal.file[0].path) {
            return {
                backgroundImage: `url(${props.meal.file[0].path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        }
        
        // 3. file 배열이 있고 그 안에 imageData가 있는 경우 (이전 로직 유지)
        if (props.meal.file && props.meal.file.length > 0 && props.meal.file[0].imageData) {
            return {
                backgroundImage: `url(${props.meal.file[0].imageData})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        }
        
        // 4. 이미지가 없는 경우 기본 스타일
        return {};
    };

    const formatTime = (dateTimeStr) => {
        if (!dateTimeStr) return '';
        
        try {

            const normalizedDateTime = dateTimeStr.replace(' ', 'T');
            const date = new Date(normalizedDateTime);
            
            if (isNaN(date.getTime())) {
                console.error('잘못된 날짜 형식:', dateTimeStr);
                return '';
            }
            
            const offset = date.getTimezoneOffset() * 60000;
            const koreanTime = new Date(date.getTime() + offset + (9 * 60 * 60 * 1000));
            
            return koreanTime.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
        } catch (error) {
            console.error('날짜 변환 중 오류 발생:', error);
            return '';
        }
    }

    const calculateNutrient = (value, quantity) => {
        if (value === undefined || value === null) return 0;
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) return 0;
        
        const qty = parseFloat(quantity) || 1;
        return Math.floor(parsedValue * qty);
    };
</script>

<style scoped>
.meal-card {
    background: white;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 15px;
    width: 550px;
    height: 165px;
    box-sizing: border-box;
    border: 0.3px solid rgba(227, 227, 227, 0.67);
    overflow: hidden;
}

.meal-image {
    margin-top: 10px;
    width: 80px;
    height: 80px;
    border-radius: 5px;
    background-color: #f5f5f5;
    flex-shrink: 0;
    margin-right: 15px;
}

.meal-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
}

.meal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 5px;
}

.meal-name {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    margin-top: 10px;
}

.meal-desc {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #605E5E;
    margin-top: -15px;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.meal-nutrition {
    display: flex;
    gap: 15px;
    font-size: 0.9em;
    color: #666;
    flex-wrap: wrap;
}

.meal-nutrition span {
    background: #f5f5f5;
    padding: 4px 8px;
    border-radius: 4px;
    width: 42px;
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    gap: 2px;
    font-size: 12px;
    line-height: 1.2;
}

.meal-nutrition span div:first-child {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: #000000;
}

.meal-nutrition span div:last-child {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 10px;
    color: #787878;
}

.meal-time {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 12px;
    color: #969696;
    margin-right: 5px;
    margin-top: 5px;
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