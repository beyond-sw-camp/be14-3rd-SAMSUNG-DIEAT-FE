<template>
    <div :class="isModal ? 'modal-wrapper' : 'food-register-page'">
        <div :class="['food-register-container', { 'modal-style': isModal }]">
            <label class="food-register-label">음식 제목</label>
            <input v-model="foodTitle" class="food-register-input" placeholder="예: 닭가슴살 볶음밥" />

            <label class="food-register-label">음식량</label>
            <div class="food-register-grid-3">
                <div class="unit-input-wrapper">
                    <input v-model="amount" type="number" class="food-register-input with-unit" />
                    <span class="unit">기준량</span>
                </div>
                <div class="unit-input-wrapper">
                    <input v-model="unit" class="food-register-input with-unit" />
                    <span class="unit">측정 단위</span>
                </div>
                <div class="unit-input-wrapper">
                    <input v-model="serveUnit" class="food-register-input with-unit" />
                    <span class="unit">제공 단위</span>
                </div>
            </div>

            <label class="food-register-label">영양 성분</label>
            <div class="food-register-grid-5">
                <div v-for="(label, key) in labelMap" :key="key" class="unit-input-wrapper">
                    <input v-model.number="nutrition[key]" type="number" class="food-register-input with-unit" />
                    <span class="unit">{{ unitMap[key] }}</span>
                    <div class="unit-caption">{{ label }}</div>
                </div>
            </div>

            <div class="food-register-button-group">
                <button class="primary-button" @click="submit">등록</button>
                <button class="gray-button" @click="cancel">취소</button>
            </div>
        </div>

        <!-- ✅ 등록 완료 모달 (페이지 모드에서만 표시) -->
        <div v-if="showCompleteModal" class="complete-modal">
            <div class="modal-content">
                <p>음식 등록 완료</p>
                <button class="primary-button" @click="showCompleteModal = false">확인</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['register', 'close'])
const props = defineProps({ isModal: Boolean })

// ✅ 입력 상태
const foodTitle = ref('')
const amount = ref(100)
const unit = ref('g')
const serveUnit = ref('1개')
const nutrition = ref({ kcal: 0, carb: 0, protein: 0, fat: 0, sugar: 0 })

// ✅ 모달 상태
const showCompleteModal = ref(false)

// ✅ 단위 및 라벨
const unitMap = { kcal: 'kcal', carb: 'g', protein: 'g', fat: 'g', sugar: 'g' }
const labelMap = { kcal: '열량', carb: '탄수화물', protein: '단백질', fat: '지방', sugar: '당류' }

// ✅ 등록 처리
async function submit() {
    if (
        !foodTitle.value.trim() ||
        !amount.value ||
        !unit.value.trim() ||
        !serveUnit.value.trim() ||
        Object.values(nutrition.value).some(v => v === null || v === '')
    ) {
        alert('입력이 완료되지 않았습니다.')
        return
    }

    const food = {
        id: Date.now(),
        name: foodTitle.value,
        unit: `${amount.value}${unit.value} / ${serveUnit.value}`,
        ...nutrition.value,
        count: 1.0,
        accurate: 0,
        inaccurate: 0,
        type: 'USER',
        nickname: '사용자'
    }

    try {
        await fetch('http://localhost:3000/food', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(food)
        })

        emit('register', food)

        if (props.isModal) {
            emit('close')
        } else {
            showCompleteModal.value = true
            resetForm()
        }
    } catch (err) {
        alert('저장 중 오류가 발생했습니다.')
        console.error(err)
    }
}

// ✅ 입력 초기화
function resetForm() {
    foodTitle.value = ''
    amount.value = 100
    unit.value = 'g'
    serveUnit.value = '1개'
    nutrition.value = { kcal: 0, carb: 0, protein: 0, fat: 0, sugar: 0 }
}

// ✅ 취소 버튼
function cancel() {
    if (props.isModal) emit('close')
}
</script>

<style scoped>
.modal-wrapper {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-style {
    max-width: 600px !important;
    width: 100%;
}

.complete-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1100;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    width: 300px;
}

.modal-content p {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
}
</style>

<style src="@/assets/food/registerFood.css"></style>