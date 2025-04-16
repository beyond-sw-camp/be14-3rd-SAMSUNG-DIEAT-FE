<template>
    <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>식단 불러오기</h2>
                <button class="close-button" @click="closeModal">×</button>
            </div>
            <div class="modal-body">
                <div class="bookmark-section">
                    <div class="bookmark-header">
                        <h3>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            북마크
                        </h3>
                    </div>
                    <div class="bookmark-categories">
                        <div class="category-item" 
                            :class="{ 'active': selectedCategory === 'all' }"
                            @click="selectCategory('all')">
                            <span>모든 게시물</span>
                            <span class="count">103</span>
                        </div>
                        <div class="category-item"
                            :class="{ 'active': selectedCategory === 'diet' }"
                            @click="selectCategory('diet')">
                            <span>다이어트</span>
                            <span class="count">16</span>
                        </div>
                        <div class="category-item"
                            :class="{ 'active': selectedCategory === 'meat' }"
                            @click="selectCategory('meat')">
                            <span>고기 먹고 싶을 때</span>
                            <span class="count">8</span>
                        </div>
                        <div class="category-item"
                            :class="{ 'active': selectedCategory === 'home' }"
                            @click="selectCategory('home')">
                            <span>진짜 살 빼야 돼</span>
                            <span class="count">19</span>
                        </div>
                        <div class="category-item"
                            :class="{ 'active': selectedCategory === 'night' }"
                            @click="selectCategory('night')">
                            <span>야식</span>
                            <span class="count">60</span>
                        </div>
                    </div>
                </div>
                <div class="right-section">
                    <div class="diet-list-section">
                        <div class="diet-list-header">
                            <h4>추천 식단</h4>
                        </div>
                        <div class="diet-list">
                            <div class="diet-grid">
                                <div v-for="diet in paginatedDiets" :key="diet.id" 
                                    class="diet-card"
                                    :class="{ 'selected-diet': selectedDiet && selectedDiet.id === diet.id }"
                                    @click="selectDiet(diet)">
                                    <div class="bookmark-icon" @click.stop="showRemoveBookmarkConfirm(diet)">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#505050" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z" stroke="#505050" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div class="diet-image">
                                        <img :src="diet.image" alt="음식 이미지">
                                    </div>
                                    <div class="diet-title">{{ diet.title }}</div>
                                    <div class="diet-nutrients">
                                        <div class="nutrient">
                                            <span class="value">{{ diet.kcal }}</span>
                                            <span class="unit">칼</span>
                                        </div>
                                        <div class="nutrient">
                                            <span class="value">{{ diet.carbs }}</span>
                                            <span class="unit">탄</span>
                                        </div>
                                        <div class="nutrient">
                                            <span class="value">{{ diet.protein }}</span>
                                            <span class="unit">단</span>
                                        </div>
                                        <div class="nutrient">
                                            <span class="value">{{ diet.fat }}</span>
                                            <span class="unit">지</span>
                                        </div>
                                        <div class="nutrient">
                                            <span class="value">{{ diet.sodium }}</span>
                                            <span class="unit">나</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pagination">
                        <button 
                            :disabled="currentPage === 1" 
                            @click="changePage(currentPage - 1)"
                            class="page-btn prev"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <div class="page-numbers">
                            <span 
                                v-for="page in totalPages" 
                                :key="page" 
                                @click="changePage(page)"
                                :class="{ active: currentPage === page }"
                                class="page-number"
                            >
                                {{ page }}
                            </span>
                        </div>
                        <button 
                            :disabled="currentPage === totalPages" 
                            @click="changePage(currentPage + 1)"
                            class="page-btn next"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="modal-footer">
                        <button class="cancel-button" @click="closeModal">취소</button>
                        <button class="confirm-button" @click="confirmSelection">확인</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="confirmBookmarkRemoval" class="bookmark-confirm-modal">
        <div class="bookmark-confirm-content">
            <p>북마크에서 제거하시겠습니까?</p>
            <div class="bookmark-confirm-buttons">
                <button class="bookmark-confirm-btn" @click="confirmRemoveBookmark">확인</button>
                <button class="bookmark-cancel-btn" @click="cancelRemoveBookmark">취소</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted } from 'vue';

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
const selectedCategory = ref('all');
const selectedDiet = ref(null);
const bookmarkedDiets = ref([]);

const loadBookmarkedDiets = async () => {
    try {
        const response = await fetch('/src/views/meal/mealdb.json');
        const data = await response.json();
        const bookmarkData = data.bookmarkedDietPost || [];
        
        bookmarkedDiets.value = bookmarkData.map(item => ({
            id: parseInt(item.id),
            title: item.name,
            image: item.img,
            kcal: item.kcal,
            carbs: item.carb,
            protein: item.protein,
            fat: item.fat,
            sodium: item.sugar,
            bookmarked: true,
            foods: item.food || []
        }));
    } catch (error) {
        console.error('북마크 데이터를 불러오는데 실패했습니다:', error);
        bookmarkedDiets.value = [
            {
                id: 1,
                title: '쉽게 따라하는 샐러드',
                image: 'https://via.placeholder.com/150',
                time: '12:30',
                kcal: 279,
                carbs: 33,
                protein: 8,
                fat: 13,
                sodium: 25,
                bookmarked: true
            },
        ];
    }
};

onMounted(() => {
    loadBookmarkedDiets();
});

const currentPage = ref(1);
const itemsPerPage = 9;

const filteredDiets = computed(() => {
    if (selectedCategory.value === 'all') {
        return bookmarkedDiets.value;
    } else {

        return bookmarkedDiets.value.filter(diet => {
            if (selectedCategory.value === 'diet') return diet.kcal < 500;
            if (selectedCategory.value === 'meat') return diet.protein > 30;
            if (selectedCategory.value === 'home') return diet.kcal < 300;
            if (selectedCategory.value === 'night') return diet.id > 5;
            return true;
        });
    }
});

const paginatedDiets = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDiets.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
    if (selectedCategory.value === 'all') {
        return 10;
    }
    return Math.ceil(filteredDiets.value.length / itemsPerPage);
});

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const selectCategory = (category) => {
    selectedCategory.value = category;
    currentPage.value = 1;
};

const closeModal = () => {
    emit('close');
};

const confirmSelection = () => {
    if (!selectedDiet.value) {

        alert('식단을 선택해주세요.');
        return;
    }
    
    const dietWithFoods = {
        ...selectedDiet.value,
        foods: selectedDiet.value.foods || [
            {
                name: `${selectedDiet.value.title}의 음식 1`,
                type: 'USERDATA',
                unit: '1인분',
                kcal: Math.round(selectedDiet.value.kcal * 0.3),
                carbs: Math.round(selectedDiet.value.carbs * 0.3),
                protein: Math.round(selectedDiet.value.protein * 0.3),
                fat: Math.round(selectedDiet.value.fat * 0.3),
                sugar: 5,
                quantity: 1
            },
            {
                name: `${selectedDiet.value.title}의 음식 2`,
                type: 'OPENDATA',
                unit: '100g',
                kcal: Math.round(selectedDiet.value.kcal * 0.4),
                carbs: Math.round(selectedDiet.value.carbs * 0.4),
                protein: Math.round(selectedDiet.value.protein * 0.4),
                fat: Math.round(selectedDiet.value.fat * 0.4),
                sugar: 3,
                quantity: 1
            },
            {
                name: `${selectedDiet.value.title}의 음식 3`,
                type: 'USERDATA',
                unit: '1인분',
                kcal: Math.round(selectedDiet.value.kcal * 0.3),
                carbs: Math.round(selectedDiet.value.carbs * 0.3),
                protein: Math.round(selectedDiet.value.protein * 0.3),
                fat: Math.round(selectedDiet.value.fat * 0.3),
                sugar: 2,
                quantity: 1
            }
        ]
    };

    emit('confirm', dietWithFoods);
    closeModal();
};

const selectDiet = (diet) => {
    if (selectedDiet.value && selectedDiet.value.id === diet.id) {
        selectedDiet.value = null;
    } else {
        selectedDiet.value = diet;
    }
};

const confirmBookmarkRemoval = ref(false);
const dietToRemoveBookmark = ref(null);

// 북마크 제거 확인 모달 표시
const showRemoveBookmarkConfirm = (diet) => {
    dietToRemoveBookmark.value = diet;
    confirmBookmarkRemoval.value = true;
};

// 북마크 제거 취소
const cancelRemoveBookmark = () => {
    confirmBookmarkRemoval.value = false;
    dietToRemoveBookmark.value = null;
};

// 북마크 제거 확인
const confirmRemoveBookmark = () => {
    if (dietToRemoveBookmark.value) {
        // 북마크 제거 - 리스트에서 해당 아이템을 완전히 제거합니다
        bookmarkedDiets.value = bookmarkedDiets.value.filter(d => d.id !== dietToRemoveBookmark.value.id);
        
        // 선택된 식단이 제거된 경우 선택 상태 초기화
        if (selectedDiet.value && selectedDiet.value.id === dietToRemoveBookmark.value.id) {
            selectedDiet.value = null;
        }
    }
    confirmBookmarkRemoval.value = false;
    dietToRemoveBookmark.value = null;
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
    width: 759px;
    height: 636px;
    max-height: 636px;
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
    height: calc(636px - 70px);
}

.bookmark-section {
    flex: none;
    width: 220px;
    height: 492px;
    padding: 20px;
    overflow-y: auto;
}

.bookmark-header {
    margin-bottom: 20px;
}

.bookmark-header h3 {
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.bookmark-header svg {
    color: #909090;
}

.bookmark-categories {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #F8F8F8;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 12px;
}

.category-item:hover {
    background-color: #EEEEEE;
}

.category-item.active {
    background-color: #FFA18E;
    color: white;
}

.category-item.active:hover {
    background-color: #FFA18E;
}

.category-item span {
    font-family: 'Inter';
    font-weight: 400;
    font-size: 12px;
}

.category-item .count {
    font-size: 8px;
    color: #909090;
    font-family: 'Inter';
    font-weight: 700;
}

.category-item.active .count {
    color: white;
}

.right-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.diet-list-section {
    flex: 1;
    height: 100%;
    padding: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.diet-list-header {
    margin-bottom: 15px;
}

.diet-list-header h4 {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
}

.diet-list {
    flex: 1;
    overflow-y: auto;
}

.diet-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 10px;
}

.diet-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    position: relative;
    border: 1px solid #eee;
}

.diet-card:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.bookmark-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    transition: all 0.3s ease;
    cursor: pointer;
}

.bookmark-icon:hover {
    transform: scale(1.15);
}

.bookmark-icon:active {
    transform: scale(0.95);
}

.bookmark-icon svg {
    width: 24px;
    height: 24px;
    stroke: #505050;
    fill: #505050;
}

.diet-image {
    width: 100%;
    height: 150px;
    overflow: hidden;
}

.diet-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.diet-title {
    padding: 10px;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.diet-nutrients {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background-color: #f8f8f8;
    border-top: 1px solid #eee;
}

.nutrient {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
}

.nutrient .value {
    font-weight: bold;
}

.nutrient .unit {
    color: #777;
    font-size: 10px;
}

.selected-diet {
    border: 2px solid #FF4B4B;
}

.modal-footer {
    padding: 0;
    position: relative;
    margin: 20px;
}

.cancel-button {
    padding: 11px 23px;
    border: none;
    border-radius: 4px;
    background-color: #D9D9D9;
    color: white;
    cursor: pointer;
    position: absolute;
    z-index: 1;
    right: 150px;
    top: -30px;
    font-size: 14px;
    font-weight: 600;
}

.confirm-button {
    padding: 11px 23px;
    border: none;
    border-radius: 4px;
    background-color: #FF4B4B;
    color: white;
    cursor: pointer;
    position: absolute;
    z-index: 1;
    right: 250px;
    top: -30px;
    font-size: 14px;
    font-weight: 600;
}

.confirm-button:hover {
    background-color: #ff3333;
}

.cancel-button:hover {
    background-color: #f5f5f5;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0px;
    margin-bottom: 20px;
    bottom: 50px;
}

.page-btn {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    border: none;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #777;
}

.page-btn:hover:not(:disabled) {
    background-color: transparent;
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 5px;
    margin: 0 10px;
}

.page-number {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    background-color: transparent;
    border: none;
    color: #777;
}

.page-number:hover {
    background-color: transparent;
    text-decoration: none;
    color: #333;
}

.page-number.active {
    background-color: transparent;
    color: #000;
    font-weight: bold;
    text-decoration: none;
}

/* 북마크 제거 확인 모달 스타일 */
.bookmark-confirm-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.bookmark-confirm-content {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    width: 300px;
    text-align: center;
}

.bookmark-confirm-content p {
    margin-bottom: 20px;
    font-size: 16px;
}

.bookmark-confirm-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.bookmark-cancel-btn, .bookmark-confirm-btn {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-weight: 500;
}

.bookmark-cancel-btn {
    background-color: #D9D9D9;
    color: #333;
}

.bookmark-confirm-btn {
    background-color: #FF4B4B;
    color: white;
}

.bookmark-cancel-btn:hover {
    background-color: #ccc;
}

.bookmark-confirm-btn:hover {
    background-color: #ff3333;
}
</style> 