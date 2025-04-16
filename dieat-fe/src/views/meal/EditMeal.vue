<template>
    <div class="registmeal-wrapper">
        <div class="registmeal-container">
            <div class="registmeal-leftsection">
                <div class="registmeal-name-div">
                    <h3 class="registmeal-name">식사 이름</h3>
                    <input 
                        type="text" 
                        class="registmeal-name-input"
                        v-model="mealInfo.meal_name"
                        @input="updateMealInfo"
                    >
                </div>
                <div class="registmeal-desc-div">
                    <h3 class="registmeal-desc">식사 설명</h3>
                    <textarea 
                        class="registmeal-desc-input"
                        v-model="mealInfo.meal_description"
                        @input="updateMealInfo"
                    ></textarea>
                </div>
                <div class="registmeal-time-wrapper">
                    <div class="registmeal-time-div">
                        <h3 class="registmeal-time">식사 시간</h3>
                        <input 
                            type="text" 
                            class="registmeal-time-input" 
                            placeholder="0000-00-00 00:00"
                            maxlength="16"
                            @input="formatTimeInput"
                            v-model="timeInput"
                        >
                        <p v-if="timeError" class="time-error-message">숫자를 입력해주세요.</p>
                    </div>
                    <div class="registmeal-img-div">
                        <h3 class="registmeal-img-title">대표 이미지</h3>
                        <div class="registmeal-img-bg" @click="triggerFileInput">
                            <template v-if="!previewImage">
                                <h5 class="registmeal-img-i">대표 이미지 등록</h5>
                                <div class="registmeal-img-plus"></div>
                            </template>
                            <template v-else>
                                <img :src="selectedImageInfo?.path || previewImage" class="preview-image" alt="선택된 이미지">
                                <div class="image-overlay">
                                    <button class="remove-image" @click.stop="removeImage">×</button>
                                </div>
                                <span class="image-name">{{ selectedImageInfo?.originalName }}</span>
                            </template>
                            <input 
                                type="file" 
                                ref="fileInput" 
                                class="file-input" 
                                @change="handleFileUpload"
                                accept="image/*"
                            >
                        </div>
                        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                        <p v-if="isLoading" class="loading-message">저장 중...</p>
                    </div>
                </div>
                <div>
                    <h3 class="registmeal-nutrient-title">총 영양성분</h3>
                    <div class="registmeal-nutrient-graph">
                        <div class="nutrient-bar-container">
                            <div class="nutrient-bar">
                                <div class="nutrient-bar-fill calorie" :style="{ height: `${Math.min(nutrientPercentages.calorie, 100)}%` }">
                                    <span class="nutrient-value">
                                        {{ Math.round(totalNutrients.calorie) }}kcal
                                        <span v-if="nutrientPercentages.calorie > 100" class="percent">({{ Math.round(nutrientPercentages.calorie) }}%)</span>
                                    </span>
                                </div>
                            </div>
                            <span class="nutrient-label">칼로리<br/>(2000kcal)</span>
                        </div>
                        <div class="nutrient-bar-container">
                            <div class="nutrient-bar">
                                <div class="nutrient-bar-fill carb" :style="{ height: `${Math.min(nutrientPercentages.carb, 100)}%` }">
                                    <span class="nutrient-value">
                                        {{ Math.round(totalNutrients.carb) }}g
                                        <span v-if="nutrientPercentages.carb > 100" class="percent">({{ Math.round(nutrientPercentages.carb) }}%)</span>
                                    </span>
                                </div>
                            </div>
                            <span class="nutrient-label">탄수화물<br/>(300g)</span>
                        </div>
                        <div class="nutrient-bar-container">
                            <div class="nutrient-bar">
                                <div class="nutrient-bar-fill protein" :style="{ height: `${Math.min(nutrientPercentages.protein, 100)}%` }">
                                    <span class="nutrient-value">
                                        {{ Math.round(totalNutrients.protein) }}g
                                        <span v-if="nutrientPercentages.protein > 100" class="percent">({{ Math.round(nutrientPercentages.protein) }}%)</span>
                                    </span>
                                </div>
                            </div>
                            <span class="nutrient-label">단백질<br/>(200g)</span>
                        </div>
                        <div class="nutrient-bar-container">
                            <div class="nutrient-bar">
                                <div class="nutrient-bar-fill fat" :style="{ height: `${Math.min(nutrientPercentages.fat, 100)}%` }">
                                    <span class="nutrient-value">
                                        {{ Math.round(totalNutrients.fat) }}g
                                        <span v-if="nutrientPercentages.fat > 100" class="percent">({{ Math.round(nutrientPercentages.fat) }}%)</span>
                                    </span>
                                </div>
                            </div>
                            <span class="nutrient-label">지방<br/>(50g)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="registmeal-rightsection">
                <div class="registmeal-header">
                    <h3 class="registmeal-mealtitle">음식</h3>
                    <div class="registmeal-buttons">
                        <button class="registmeal-mealplus" @click="addMealCard">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4V20" stroke="black" stroke-width="3" stroke-linecap="round"/>
                                <path d="M4 12H20" stroke="black" stroke-width="3" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <button class="registmeal-mealminus" @click="removeMealCard">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 12H20" stroke="black" stroke-width="3" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="meal-cards-container">
                    <RegistMealCard 
                        v-if="registeredFoods.length > 0" 
                        :foods="registeredFoods" 
                        :showDeleteButton="showDeleteMode"
                        @delete="handleDeleteFood" 
                    />
                </div>
            </div>
            <div class="registmeal-footer">
                <button class="registmeal-load-dietpost" @click="openLoadDietPostModal">식단 불러오기</button>
                <button class="registmeal-load-meal" @click="openLoadMealModal">식사 불러오기</button>
                <button class="registmeal-regist" @click="handleSubmit">수정</button>
                <button class="registmeal-delete" @click="handleDelete">삭제</button>
                <button class="registmeal-cancel" @click="goToMeal">취소</button>
            </div>
        </div>
    </div>
    <AlertModal 
        :show="showNoFoodModal"
        message="음식이 등록되지 않았습니다."
        @confirm="closeNoFoodModal"
    />
    <LoadMealModal
        :show="showLoadMealModal"
        @close="closeLoadMealModal"
        @confirm="handleLoadMealConfirm"
    />
    <LoadDietPostModal
        :show="showLoadDietPostModal"
        @close="closeLoadDietPostModal"
        @confirm="handleLoadDietPostConfirm"
    />
    <CompleteModal
        :show="showCompleteModal"
        @close="closeCompleteModal"
    />
    <AlertModal
        :show="showDeleteConfirmModal"
        message="정말 삭제하시겠습니까?"
        :showCancel="true"
        confirmText="삭제"
        cancelText="취소"
        @confirm="confirmDelete"
        @cancel="closeDeleteConfirmModal"
    />
</template>

<script setup>
    import RegistMealCard from '@/components/meal/RegistMealCard.vue';
    import Header from '@/components/common/Header.vue';
    import AlertModal from '@/components/meal/AlertModal.vue';
    import LoadMealModal from '@/components/meal/LoadMealModal.vue';
    import LoadDietPostModal from '@/components/meal/LoadDietPostModal.vue';
    import CompleteModal from '@/components/common/CompleteModal.vue';
    import { ref, onMounted, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useRegistMealStore } from '@/stores/registMeal';

    const router = useRouter();
    const route = useRoute();
    
    // 한국 시간(UTC+9)로 현재 날짜 및 시간 가져오기
    const getKoreanDateTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const koreanTime = new Date(now.getTime() + offset + (9 * 60 * 60 * 1000));
        
        const year = koreanTime.getFullYear();
        const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
        const day = String(koreanTime.getDate()).padStart(2, '0');
        const hours = String(koreanTime.getHours()).padStart(2, '0');
        const minutes = String(koreanTime.getMinutes()).padStart(2, '0');
        
        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`,
            dateTime: `${year}-${month}-${day} ${hours}:${minutes}`
        };
    };
    
    const koreanDateTime = getKoreanDateTime();
    const timeInput = ref(koreanDateTime.dateTime);
    const timeError = ref(false);
    const fileInput = ref(null);
    const previewImage = ref(null);
    const selectedImageInfo = ref(null);
    const isLoading = ref(false);
    const errorMessage = ref('');
    const showNoFoodModal = ref(false);
    const showMealCard = ref(false);
    const showLoadMealModal = ref(false);
    const showLoadDietPostModal = ref(false);
    const showCompleteModal = ref(false);
    const showDeleteConfirmModal = ref(false);
    const registeredFoods = ref([]); // 등록된 음식 목록을 관리하는 ref
    const showDeleteMode = ref(false);

    const mealStore = useRegistMealStore();

    const mealInfo = ref({
        meal_name: '',
        meal_description: '',
        meal_time: koreanDateTime.dateTime,
        file: null
    });

    // 목표 영양성분 설정
    const NUTRIENT_GOALS = {
        calorie: 2000, // kcal
        carb: 300,    // g
        protein: 200, // g
        fat: 50      // g
    };

    // 총 영양성분 계산
    const totalNutrients = computed(() => {
        return registeredFoods.value.reduce((total, food) => {
            const quantity = parseFloat(food.quantity) || 1;
            return {
                calorie: total.calorie + (parseFloat(food.kcal) || 0) * quantity,
                carb: total.carb + (parseFloat(food.carb) || 0) * quantity,
                protein: total.protein + (parseFloat(food.protein) || 0) * quantity,
                fat: total.fat + (parseFloat(food.fat) || 0) * quantity
            };
        }, {
            calorie: 0,
            carb: 0,
            protein: 0,
            fat: 0
        });
    });

    // 영양성분 퍼센티지 계산
    const nutrientPercentages = computed(() => {
        return {
            calorie: Math.min((totalNutrients.value.calorie / NUTRIENT_GOALS.calorie) * 100, 100),
            carb: Math.min((totalNutrients.value.carb / NUTRIENT_GOALS.carb) * 100, 100),
            protein: Math.min((totalNutrients.value.protein / NUTRIENT_GOALS.protein) * 100, 100),
            fat: Math.min((totalNutrients.value.fat / NUTRIENT_GOALS.fat) * 100, 100)
        };
    });

    onMounted(async () => {
        // URL에서 meal ID를 가져옴
        const mealId = route.params.id;
        if (!mealId) {
            router.push('/meal');
            return;
        }

        try {
            // 서버에서 meal 데이터 가져오기 - ID로 필터링하여 조회
            const response = await fetch(`${API_URL}?id=${mealId}`);
            if (!response.ok) {
                throw new Error('식사 데이터를 가져오는데 실패했습니다.');
            }
            
            const meals = await response.json();
            if (!meals || meals.length === 0) {
                throw new Error('해당 ID의 식사를 찾을 수 없습니다.');
            }
            
            const mealData = meals[0];
            console.log('불러온 식사 데이터:', mealData);

            // 가져온 데이터로 폼 초기화
            mealInfo.value = {
                meal_name: mealData.meal_title || '',
                meal_description: mealData.meal_desc || '',
                meal_time: mealData.meal_dt ? mealData.meal_dt.replace('T', ' ').substring(0, 16) : koreanDateTime.dateTime,
                file: mealData.file || null
            };

            timeInput.value = mealInfo.value.meal_time;

            if (mealData.file && mealData.file.length > 0) {
                selectedImageInfo.value = mealData.file[0];
                previewImage.value = mealData.file[0].path;
            }

            // 음식 데이터 처리
            if (mealData.meal_foods && mealData.meal_foods.length > 0) {
                registeredFoods.value = [...mealData.meal_foods];
                showMealCard.value = true;
            }

            // Pinia 스토어에 정보 저장 - 명확하게 registMealStore 사용
            mealStore.setTempMealInfo(mealInfo.value);
            mealStore.setSelectedFoods(registeredFoods.value);

            console.log('초기화된 식사 정보:', mealInfo.value);
            console.log('스토어에 저장된 음식 목록:', mealStore.selectedFoods);

        } catch (error) {
            console.error('식사 데이터 로드 중 오류:', error);
            errorMessage.value = '식사 데이터를 로드하는데 실패했습니다.';
        }
    });

    // JSON 서버 기본 URL - meals 배열에 접근하도록 수정
    const API_URL = 'http://localhost:3000/meals';

    // 고유한 파일명 생성 함수
    const generateUniqueFileName = (originalName) => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const extension = originalName.split('.').pop();
        const baseName = originalName.split('.')[0];
        return `${baseName}_${timestamp}_${random}.${extension}`;
    };

    const formatTimeInput = (event) => {
        let value = event.target.value.replace(/[^0-9]/g, '');
        
        if (value.length > 12) {
            value = value.slice(0, 12);
        }
        
        if (value.length >= 4) {
            value = value.slice(0, 4) + '-' + value.slice(4);
        }
        if (value.length >= 7) {
            value = value.slice(0, 7) + '-' + value.slice(7);
        }
        if (value.length >= 10) {
            value = value.slice(0, 10) + ' ' + value.slice(10);
        }
        if (value.length >= 13) {
            value = value.slice(0, 13) + ':' + value.slice(13);
        }
        
        timeInput.value = value;
        
        // 숫자만 입력되었는지 확인
        const numericValue = value.replace(/[^0-9]/g, '');
        timeError.value = numericValue.length !== 12;
        
        updateMealInfo();
    };

    const triggerFileInput = () => {
        fileInput.value.click();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('파일 업로드 실패');
            }

            const data = await response.json();
            
            selectedImageInfo.value = {
                id: Date.now(),
                originalName: file.name,
                uniqueName: data.filename,
                path: `http://localhost:3000/uploads/${data.filename}`
            };

            previewImage.value = selectedImageInfo.value.path;
            errorMessage.value = '';
            updateMealInfo();

        } catch (error) {
            console.error('파일 업로드 중 오류:', error);
            errorMessage.value = '파일 업로드에 실패했습니다.';
        }
    };

    const addMealCard = () => {
        console.log('EditMeal - addMealCard: 음식 추가 버튼 클릭');
        const mealInfo = {
            meal_name: document.querySelector('.registmeal-name-input').value,
            meal_description: document.querySelector('.registmeal-desc-input').value,
            meal_time: timeInput.value,
            file: selectedImageInfo.value
        };
        
        console.log('EditMeal - addMealCard: 현재 등록된 음식', registeredFoods.value);
        mealStore.setTempMealInfo(mealInfo);
        console.log('EditMeal - addMealCard: 임시 식사 정보 저장됨', mealInfo);
        router.push('/searchFood');
    };

    const removeMealCard = () => {
        console.log('EditMeal - removeMealCard: 음식 제거 버튼 클릭');
        showDeleteMode.value = !showDeleteMode.value;
        console.log('EditMeal - removeMealCard: 삭제 모드 상태 변경됨', showDeleteMode.value);
    };

    const handleDeleteFood = (index) => {
        console.log('EditMeal - handleDeleteFood: 음식 삭제', index);
        registeredFoods.value = registeredFoods.value.filter((_, i) => i !== index);
        mealStore.setSelectedFoods(registeredFoods.value);
        
        if (registeredFoods.value.length === 0) {
            showMealCard.value = false;
            showDeleteMode.value = false;
        }
        console.log('EditMeal - handleDeleteFood: 남은 음식', registeredFoods.value);
    };

    const handleSubmit = async () => {
        console.log('EditMeal - handleSubmit: 수정 버튼 클릭');
        console.log('등록된 음식 목록:', registeredFoods.value);
        
        if (registeredFoods.value.length === 0) {
            showNoFoodModal.value = true;
            return;
        }

        try {
            if (!selectedImageInfo.value || !previewImage.value) {
                console.error('이미지가 선택되지 않았습니다.');
                errorMessage.value = '이미지를 선택해주세요.';
                return;
            }

            isLoading.value = true;
            errorMessage.value = '';

            const [datePart, timePart] = timeInput.value.split(' ');
            const mealDateTime = `${datePart}T${timePart}:00`;
            
            // 먼저 해당 ID로 데이터 조회
            const getResponse = await fetch(`${API_URL}?id=${route.params.id}`);
            if (!getResponse.ok) {
                throw new Error('식사 데이터 조회 실패');
            }
            
            const items = await getResponse.json();
            if (!items || items.length === 0) {
                throw new Error('해당 ID의 식사를 찾을 수 없습니다');
            }
            
            // 찾은 항목의 ID 사용
            const itemToUpdate = items[0];
            
            const mealData = {
                id: itemToUpdate.id,
                meal_code: route.params.id,
                meal_title: document.querySelector('.registmeal-name-input').value,
                meal_desc: document.querySelector('.registmeal-desc-input').value,
                meal_dt: mealDateTime,
                meal_calories: totalNutrients.value.calorie,
                meal_carbs: totalNutrients.value.carb,
                meal_protein: totalNutrients.value.protein,
                meal_fat: totalNutrients.value.fat,
                meal_sugar: registeredFoods.value.reduce((sum, food) => {
                    const quantity = parseFloat(food.quantity) || 1;
                    return sum + (parseFloat(food.sugar) || 0) * quantity;
                }, 0),
                meal_foods: registeredFoods.value,
                user_code: 1,
                file: [selectedImageInfo.value]
            };

            console.log('수정될 데이터:', JSON.stringify(mealData, null, 2));

            const response = await fetch(`${API_URL}/${itemToUpdate.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mealData)
            });

            if (!response.ok) throw new Error('서버 응답 오류');
            
            showCompleteModal.value = true;
            mealStore.clearTempMealInfo();
            mealStore.clearSelectedFoods();

        } catch (error) {
            console.error('수정 중 오류 발생:', error);
            errorMessage.value = '수정에 실패했습니다. 잠시 후 다시 시도해주세요.';
        } finally {
            isLoading.value = false;
        }
    };

    const handleDelete = () => {
        showDeleteConfirmModal.value = true;
    };

    const confirmDelete = async () => {
        try {
            const mealId = route.params.id;
            console.log(`삭제 시도: 식사 ID ${mealId}`);
            
            // 먼저 해당 ID로 데이터 조회
            const getResponse = await fetch(`${API_URL}?id=${mealId}`);
            if (!getResponse.ok) {
                throw new Error('식사 데이터 조회 실패');
            }
            
            const items = await getResponse.json();
            if (!items || items.length === 0) {
                throw new Error('해당 ID의 식사를 찾을 수 없습니다');
            }
            
            // 찾은 항목의 첫 번째 요소 ID로 삭제 요청
            const itemToDelete = items[0];
            const deleteResponse = await fetch(`${API_URL}/${itemToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!deleteResponse.ok) {
                console.error(`삭제 실패 상태 코드: ${deleteResponse.status}`);
                throw new Error('삭제 실패');
            }

            console.log('식사 삭제 성공');
            showCompleteModal.value = true;
            closeDeleteConfirmModal();
            mealStore.clearSelectedFoods();
            mealStore.clearTempMealInfo();
            
            // 삭제 후 목록 페이지로 리다이렉트
            setTimeout(() => {
                router.push('/meal');
            }, 500);
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            errorMessage.value = '삭제에 실패했습니다. 잠시 후 다시 시도해주세요.';
        }
    };

    const closeDeleteConfirmModal = () => {
        showDeleteConfirmModal.value = false;
    };

    const removeImage = () => {
        previewImage.value = null;
        selectedImageInfo.value = null;
        if (fileInput.value) {
            fileInput.value.value = '';
        }
    };

    const goToMeal = () => {
        console.log('EditMeal - goToMeal: 취소 버튼 클릭');
        mealStore.clearSelectedFoods();
        mealStore.clearTempMealInfo();
        router.push('/meal');
    };

    const closeNoFoodModal = () => {
        showNoFoodModal.value = false;
    };

    const closeCompleteModal = () => {
        showCompleteModal.value = false;
        mealStore.clearSelectedFoods();
        mealStore.clearTempMealInfo();
        router.push('/meal');
    };

    const openLoadMealModal = () => {
        showLoadMealModal.value = true;
    };

    const closeLoadMealModal = () => {
        showLoadMealModal.value = false;
    };

    const handleLoadMealConfirm = (data) => {
        try {
            if (!data || !data.meal) {
                console.error('선택한 식사 정보가 없습니다.');
                return;
            }
            
            console.log('불러온 식사 정보:', data);
            
            mealInfo.value = {
                meal_name: data.meal.meal_name || '',
                meal_description: data.meal.meal_description || '',
                meal_time: data.meal.meal_time || koreanDateTime.dateTime,
                file: data.meal.file || null
            };
            
            if (data.meal.meal_time) {
                if (data.meal.meal_time.includes('T')) {
                    const parts = data.meal.meal_time.split('T');
                    const timePart = parts[1]?.split(':') || [];
                    if (parts[0] && timePart.length >= 2) {
                        timeInput.value = `${parts[0]} ${timePart[0]}:${timePart[1]}`;
                    }
                } else {
                    timeInput.value = data.meal.meal_time;
                }
            }
            
            if (data.meal.file) {
                selectedImageInfo.value = data.meal.file;
                previewImage.value = data.meal.file.path;
            }
            
            if (data.meal.foods && data.meal.foods.length > 0) {
                registeredFoods.value = data.meal.foods;
                showMealCard.value = true;
                mealStore.setSelectedFoods(data.meal.foods);
            }
            
            mealStore.setTempMealInfo(mealInfo.value);
            
            closeLoadMealModal();
        } catch (error) {
            console.error('식사 정보 로드 중 오류 발생:', error);
            alert('식사 정보를 로드하는 중 오류가 발생했습니다.');
            closeLoadMealModal();
        }
    };

    const openLoadDietPostModal = () => {
        showLoadDietPostModal.value = true;
    };

    const closeLoadDietPostModal = () => {
        showLoadDietPostModal.value = false;
    };

    const handleLoadDietPostConfirm = (selectedDiet) => {
        if (selectedDiet && selectedDiet.foods && Array.isArray(selectedDiet.foods)) {
            selectedDiet.foods.forEach(food => {
                const newFood = {
                    id: generateUniqueId(),
                    name: food.name || food.title || '음식',
                    type: food.type || 'USERDATA',
                    unit: food.unit || '1인분',
                    kcal: food.kcal || food.calories || 0,
                    carb: food.carb || food.carbs || 0,
                    protein: food.protein || 0,
                    fat: food.fat || 0,
                    sugar: food.sugar || 0,
                    quantity: food.quantity || 1
                };
                
                registeredFoods.value.push(newFood);
            });
            
            updateMealInfo();
        }
        
        closeLoadDietPostModal();
    };

    const generateUniqueId = () => {
        return 'food_' + Date.now() + Math.floor(Math.random() * 1000);
    };

    const updateMealInfo = () => {
        mealInfo.value = {
            ...mealInfo.value,
            meal_name: document.querySelector('.registmeal-name-input')?.value || '',
            meal_description: document.querySelector('.registmeal-desc-input')?.value || '',
            meal_time: timeInput.value,
            file: selectedImageInfo.value
        };
        
        mealStore.setTempMealInfo(mealInfo.value);
    };
</script>

<style scoped>
.registmeal-wrapper {
    margin-top: 20px;
}

.registmeal-container {
    width: 1054px;
    height: 784px;
    margin: 0 auto;
    background-color: rgba(217, 217, 217, 0.3);
    display: flex;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
}

.registmeal-leftsection {
    width: 426px;
    height: 684px;
    padding: 20px;
    margin-left: 40px;
    position: relative;
}

.registmeal-container::after {
    content: '';
    position: absolute;
    left: 466px;
    top: 20px;
    width: 1px;
    height: calc(100% - 100px);
    background-color: rgba(128, 128, 128, 0.3);
}

.registmeal-rightsection {
    width: 547px;
    height: 684px;
    padding: 20px;
    margin-left: 40px;
}

.registmeal-name,
.registmeal-desc,
.registmeal-time,
.registmeal-img-title,
.registmeal-nutrient-title {
    font-family: 'Inter';
    font-weight: 800;
    font-size: 16px;
    margin-bottom: 10px;
}

.registmeal-name-input {
    width: 344px;
    height: 30px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
}

.registmeal-desc-input {
    width: 344px;
    height: 80px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    resize: none;
    font-family: inherit;
}

.registmeal-time-input {
    width: 133px;
    height: 30px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    text-align: center;
}

.registmeal-time-input::placeholder {
    color: #999;
    text-align: center;
}

.registmeal-img-div {
    margin-bottom: 20px;
}

.registmeal-img-bg {
    width: 145px;
    height: 116px;
    background-color: #CDCDCD;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    cursor: pointer;
    overflow: hidden;
}

.registmeal-img-i {
    margin: 0;
    text-align: center;
    position: absolute;
    top: 25px;
    width: 100%;
}

.registmeal-img-plus {
    width: 20px;
    height: 20px;
    position: relative;
    margin-top: auto;
    margin-bottom: 30px;
}

.registmeal-img-plus::before,
.registmeal-img-plus::after {
    content: '';
    position: absolute;
    background-color: #666;
}

.registmeal-img-plus::before {
    width: 20px;
    height: 2px;
    top: 9px;
    left: 0;
}

.registmeal-img-plus::after {
    width: 2px;
    height: 20px;
    left: 9px;
    top: 0;
}

.registmeal-nutrient-title {
    font-family: 'Inter';
    font-weight: 800;
    font-size: 16px;
    margin-top: -30px;
    margin-bottom: 10px;
}

.registmeal-nutrient-graph {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;
    height: 235px;
    padding: 20px 40px;
    margin-bottom: 30px;
    background-color: white;
    border-radius: 8px;
}

.nutrient-bar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50px;
    height: 100%;
    margin-top: 20px;
}

.nutrient-bar {
    width: 100%;
    height: 160px;
    background-color: #f0f0f0;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.nutrient-bar-fill {
    position: absolute;
    bottom: 0;
    width: 100%;
    transition: height 0.5s ease;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    min-height: 24px;
}

.nutrient-value {
    color: white;
    font-size: 12px;
    padding: 4px;
    position: relative;
    white-space: nowrap;
    z-index: 2;
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.percent {
    font-size: 10px;
    opacity: 0.9;
    margin-top: 2px;
}

.nutrient-label {
    margin-top: 8px;
    font-size: 12px;
    text-align: center;
    color: #666;
    white-space: pre-line;
    line-height: 1.2;
}

.grid-line {
    position: absolute;
    left: 40px;
    right: 40px;
    width: calc(100% - 80px);
    height: 1px;
    background-color: #ddd;
    z-index: 1;
}

.line-1 {
    bottom: 115px;
}

.line-2 {
    bottom: 165px;
}

.registmeal-footer {
    clear: both;
    padding: 20px;
    border-top: 1px solid #eee;
    width: calc(100% - 40px);
    height: 60px;
    position: absolute;
    bottom: 20px;
    left: 20px;
}

.registmeal-load-dietpost,
.registmeal-load-meal,
.registmeal-regist,
.registmeal-delete,
.registmeal-cancel {
    font-family: 'Inter';
    font-weight: 400;
    font-size: 16px;
}

.registmeal-load-dietpost {
    position: absolute;
    left: 100px;
    background-color: #ff4b4b;
    color: white;
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 142px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.registmeal-load-meal {
    position: absolute;
    left: 270px;
    background-color: #ff4b4b;
    color: white;
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 142px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.registmeal-regist {
    position: absolute;
    right: 350px;
    background-color: #4CAF50;
    color: white;
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.registmeal-delete {
    position: absolute;
    right: 230px;
    background-color: #ff4b4b;
    color: white;
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.registmeal-cancel {
    position: absolute;
    right: 110px;
    background-color: #9e9e9e;
    color: white;
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.registmeal-load-dietpost:hover,
.registmeal-load-meal:hover {
    background-color: #ff3333;
}

.registmeal-regist:hover {
    background-color: #45a049;
}

.registmeal-delete:hover {
    background-color: #ff3333;
}

.registmeal-cancel:hover {
    background-color: #888888;
}

.registmeal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.registmeal-mealtitle {
    margin: 0;
}

.registmeal-buttons {
    display: flex;
    gap: 20px;
    align-items: center;
}

.registmeal-mealplus,
.registmeal-mealminus {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s;
    background-color: transparent;
    padding: 0;
}

.registmeal-mealminus {
    background-color: transparent;
    margin-right: 5px;
}

.registmeal-mealplus:hover {
    background-color: transparent;
}

.registmeal-mealminus:hover {
    background-color: transparent;
}

.registmeal-mealplus svg,
.registmeal-mealminus svg {
    width: 24px;
    height: 24px;
}

.registmeal-time-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 344px;
    margin-bottom: 20px;
}

.registmeal-time-div {
    margin-bottom: 20px;
}

.registmeal-img-div {
    margin-bottom: 20px;
}

.time-error-message {
    color: #FF4B4B;
    font-size: 12px;
    margin-top: 2px;
    margin-bottom: 6px;
    margin-left: 5px;
}

.registmeal-time-input.error {
    border-color: #FF4B4B;
}

.file-input {
    display: none;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

.image-overlay {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
    display: none;
}

.registmeal-img-bg:hover .image-overlay {
    display: block;
}

.remove-image {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    padding: 0;
}

.remove-image:hover {
    background: rgba(0, 0, 0, 0.7);
}

.image-name {
    position: absolute;
    bottom: -20px;
    left: 0;
    font-size: 12px;
    color: #666;
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.error-message {
    color: #FF4B4B;
    font-size: 12px;
    margin-top: 8px;
}

.loading-message {
    color: #666;
    font-size: 12px;
    margin-top: 8px;
}

.registmeal-cancel-btn {
    padding: 10px 20px;
    background-color: #6B6B6B;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.registmeal-cancel-btn:hover {
    background-color: #555555;
}

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
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    width: 300px;
}

.modal-content h3 {
    margin: 0 0 15px 0;
    font-size: 18px;
    color: #333;
}

.modal-content p {
    margin: 0 0 20px 0;
    color: #666;
}

.modal-confirm-btn {
    background-color: #155b45;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.modal-confirm-btn:hover {
    background-color: #0f4433;
}

.meal-cards-container {
    overflow-y: auto;
    max-height: calc(100% - 60px);
    padding: 10px;
}

.meal-cards-container .registmeal-card {
    margin-bottom: 20px;
}

.meal-cards-container .registmeal-card:last-child {
    margin-bottom: 0;
}

.calorie { background-color: #FD5D5D; }
.carb { background-color: #FDCA5D; }
.protein { background-color: #50E250; }
.fat { background-color: #5D7DFD; }
</style> 