<template>
    <div class="registmeal-cards-wrapper">
        <div v-for="(food, index) in foods" :key="food.id" class="registmeal-card">
            <button v-if="showDeleteButton" class="registmeal-card-delete-btn" @click="$emit('delete', index)">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L11 11" stroke="black" stroke-width="2" stroke-linecap="round"/>
                    <path d="M11 1L1 11" stroke="black" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            <div class="card-left">
                <div class="regstmeal-card-category">
                    <h3 class="registmeal-card-category-name" :class="{ 'opendata': food.type === 'OPENDATA' }">
                        {{ getFoodType(food.type) }}
                    </h3>
                </div>
                <div class="registmeal-card-name-div">
                    <h3 class="registmeal-card-name">{{ food.name }}</h3>
                </div>
                <div class="registmeal-card-unit" :class="{ 'shifted': showDeleteButton }">
                    <h5 class="registmeal-card-unit-name">{{ food.unit }}</h5>
                </div>
            </div>
            <div class="card-right">
                <div class="registmeal-card-nutr-div">
                    <div class="registmeal-card-nutr-cal">
                        <h3 class="registmeal-card-nutr-cal-value">{{ calculateNutrient(food.kcal, food.quantity) }}</h3>
                        <h5 class="registmeal-card-nutr-cal-unit">kcal</h5>
                    </div>
                    <div class="registmeal-card-nutr-carb">
                        <h3 class="registmeal-card-nutr-carb-value">{{ calculateNutrient(food.carb, food.quantity) }}</h3>
                        <h5 class="registmeal-card-nutr-carb-unit">탄</h5>
                    </div>
                    <div class="registmeal-card-nutr-protein">
                        <h3 class="registmeal-card-nutr-protein-value">{{ calculateNutrient(food.protein, food.quantity) }}</h3>
                        <h5 class="registmeal-card-nutr-protein-unit">단</h5>
                    </div>
                    <div class="registmeal-card-nutr-fat">
                        <h3 class="registmeal-card-nutr-fat-value">{{ calculateNutrient(food.fat, food.quantity) }}</h3>
                        <h5 class="registmeal-card-nutr-fat-unit">지</h5>
                    </div>
                    <div class="registmeal-card-nutr-sugar">
                        <h3 class="registmeal-card-nutr-sugar-value">{{ calculateNutrient(food.sugar, food.quantity) }}</h3>
                        <h5 class="registmeal-card-nutr-sugar-unit">당</h5>
                    </div>
                </div>
                <div class="registmeal-card-amout-div"> 
                    <h3 class="registmeal-card-amout-title">수량</h3>
                    <div class="registmeal-card-amout">
                        <input 
                            type="number" 
                            v-model="food.quantity" 
                            step="0.1"
                            min="0"
                            @input="handleQuantityChange($event, index)"
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    foods: {
        type: Array,
        required: true,
        default: () => []
    },
    showDeleteButton: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['delete', 'update:quantity']);

const getFoodType = (type) => {
    if (type === 'OPENDATA') return '공공';
    if (type === 'USERDATA') return '회원';
    return '회원';
};

const handleQuantityChange = (event, index) => {
    const value = parseFloat(event.target.value) || 0;
    emit('update:quantity', { index, value });
};

const calculateNutrient = (value, quantity) => {
    if (value === undefined || value === null) return 0;
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return 0;
    
    const qty = parseFloat(quantity) || 1;
    return Math.floor(parsedValue * qty);
};
</script>

<style scoped>
.registmeal-cards-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: -16px;
}

.registmeal-card {
    width: 453px;
    height: 99px;
    background: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0;
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 12px;
}

.card-left {
    display: flex;
    flex-direction: column;
    width: 40%;
    padding: 16px;
}

.card-right {
    display: flex;
    flex-direction: column;
    width: 60%;
    padding: 16px;
}

.regstmeal-card-category {
    position: absolute;
    top: 0;
    left: 15px;
}

.registmeal-card-category-name {
    background: #98DCC6;
    width: 41px;
    height: 18px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter';
    font-weight: 600;
    font-size: 10px;
    color: #000000;
    padding: 0;
    line-height: 1;
}

.registmeal-card-category-name.opendata {
    background: rgba(255, 126, 126, 0.6);
}

.registmeal-card-name {
    position: absolute;
    top: -36.5px;
    left: 50px;
    font-family: 'Inter';
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    margin: 0;
    height: 18px;
    display: flex;
    align-items: center;
}

.registmeal-card-name-div {
    position: relative;
    margin-top: 30px;
}

.registmeal-card-unit {
    position: absolute;
    top: 0;
    right: 15px;
    transition: right 0.3s ease;
}

.registmeal-card-unit.shifted {
    right: 35px;
}

.registmeal-card-unit-name {
    font-family: 'Inter';
    font-size: 10px;
    font-weight: 600;
    color: #676767;
    text-align: right;
}

.registmeal-card-nutr-div {
    display: flex;
    gap: 12px;
    position: absolute;
    bottom: 13px;
    left: 15px;
}

.registmeal-card-nutr-cal,
.registmeal-card-nutr-carb,
.registmeal-card-nutr-protein,
.registmeal-card-nutr-fat,
.registmeal-card-nutr-sugar {
    text-align: center;
    background: rgba(233, 233, 233, 0.54);
    padding: 4px 8px;
    border-radius: 4px;
    width: 42px;
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
}

.registmeal-card-nutr-cal-value,
.registmeal-card-nutr-carb-value,
.registmeal-card-nutr-protein-value,
.registmeal-card-nutr-fat-value,
.registmeal-card-nutr-sugar-value {
    font-family: 'Inter';
    font-size: 14px;
    font-weight: 700;
    color: #333333;
    margin: 0;
    line-height: 1;
}

.registmeal-card-nutr-cal-unit,
.registmeal-card-nutr-carb-unit,
.registmeal-card-nutr-protein-unit,
.registmeal-card-nutr-fat-unit,
.registmeal-card-nutr-sugar-unit {
    font-family: 'Inter';
    font-size: 10px;
    font-weight: 600;
    color: #787878;
    margin: 0;
    line-height: 1;
}

.registmeal-card-amout-div {
    position: absolute;
    bottom: 8px;
    right: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.registmeal-card-amout-title {
    font-size: 12px;
    color: #333333;
    margin-right: 8px;
}

.registmeal-card-amout {
    background: #F5F5F5;
    width: 57px;
    height: 22px;
    border-radius: 4px;
    font-family: 'Inter';
    font-size: 10px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.registmeal-card-delete-btn {
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

.registmeal-card-delete-btn:hover {
    transform: scale(1.1);
}

.registmeal-card-delete-btn:hover svg path {
    stroke: #333333;
}

.registmeal-card-amout input {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    text-align: center;
    font-family: 'Inter';
    font-size: 10px;
    font-weight: 600;
    color: #333333;
    padding: 0;
}

.registmeal-card-amout input:focus {
    outline: none;
}

.registmeal-card-amout input::-webkit-outer-spin-button,
.registmeal-card-amout input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.registmeal-card-amout input[type=number] {
    -moz-appearance: textfield;
}
</style>