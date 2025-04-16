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
                        <!-- 그리드 라인 -->
                        <div class="grid-line line-1"></div>
                        <div class="grid-line line-2"></div>
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
                <button class="registmeal-regist" @click="handleSubmit">등록</button>
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
</template>

<script setup>
    import RegistMealCard from '@/components/meal/RegistMealCard.vue';
    import Header from '@/components/common/Header.vue';
    import AlertModal from '@/components/meal/AlertModal.vue';
    import LoadMealModal from '@/components/meal/LoadMealModal.vue';
    import LoadDietPostModal from '@/components/meal/LoadDietPostModal.vue';
    import CompleteModal from '@/components/common/CompleteModal.vue';
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useRegistMealStore } from '@/stores/registMeal';

    const router = useRouter();
    
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

    onMounted(() => {
        // Pinia store에서 선택된 음식 데이터 가져오기
        const selectedFoods = mealStore.selectedFoods;
        if (selectedFoods && selectedFoods.length > 0) {
            registeredFoods.value = selectedFoods;
            showMealCard.value = true;
        }

        // Pinia store에서 임시 식사 정보 가져오기
        const tempInfo = mealStore.tempMealInfo;
        if (tempInfo) {
            mealInfo.value = { ...tempInfo };
            timeInput.value = tempInfo.meal_time;
            if (tempInfo.file) {
                selectedImageInfo.value = tempInfo.file[0];
                previewImage.value = tempInfo.file[0].path;
            }
        }
    });

    // JSON 서버 기본 URL
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
        const originalValue = event.target.value;
        if (/[^\d\-: ]/.test(originalValue)) {  // 숫자, 하이픈, 콜론, 공백이 아닌 문자가 있는지 체크
            timeError.value = true;
            return;
        }
        timeError.value = false;
        
        let value = originalValue.replace(/[^\d]/g, ''); // 숫자만 남김
        
        // 날짜와 시간 형식 적용 (0000-00-00 00:00)
        if (value.length > 0) {
            // 연도
            let formatted = value.slice(0, 4);
            
            // 월 추가
            if (value.length > 4) {
                formatted += '-' + value.slice(4, 6);
            }
            
            // 일 추가
            if (value.length > 6) {
                formatted += '-' + value.slice(6, 8);
            }
            
            // 시간 추가
            if (value.length > 8) {
                formatted += ' ' + value.slice(8, 10);
            }
            
            // 분 추가
            if (value.length > 10) {
                formatted += ':' + value.slice(10, 12);
            }
            
            value = formatted;
        }
        
        // 날짜 및 시간 유효성 검사
        const dateParts = value.split(' ')[0]?.split('-') || [];
        const timeParts = value.split(' ')[1]?.split(':') || [];
        
        // 월 검증 (01-12)
        if (dateParts.length > 1 && dateParts[1].length === 2) {
            const month = parseInt(dateParts[1]);
            if (month > 12) {
                value = value.substring(0, 5) + '12' + value.substring(7);
            } else if (month === 0) {
                value = value.substring(0, 5) + '01' + value.substring(7);
            }
        }
        
        // 일 검증 (01-31)
        if (dateParts.length > 2 && dateParts[2].length === 2) {
            const day = parseInt(dateParts[2]);
            if (day > 31) {
                value = value.substring(0, 8) + '31' + value.substring(10);
            } else if (day === 0) {
                value = value.substring(0, 8) + '01' + value.substring(10);
            }
        }
        
        // 시간 검증 (00-23)
        if (timeParts.length > 0 && timeParts[0].length === 2) {
            const hours = parseInt(timeParts[0]);
            if (hours > 23) {
                value = value.substring(0, 11) + '23' + value.substring(13);
            }
        }
        
        // 분 검증 (00-59)
        if (timeParts.length > 1 && timeParts[1].length === 2) {
            const minutes = parseInt(timeParts[1]);
            if (minutes > 59) {
                value = value.substring(0, 14) + '59';
            }
        }
        
        timeInput.value = value;
        updateMealInfo();
    };

    const triggerFileInput = () => {
        fileInput.value.click();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const uniqueFileName = generateUniqueFileName(file.name);
                
                // FileReader를 사용하여 이미지를 Base64로 변환
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = e.target.result;
                    selectedImageInfo.value = {
                        id: Date.now(),
                        originalName: file.name,
                        uniqueName: uniqueFileName,
                        imageData: imageData, // Base64 이미지 데이터 저장
                        type: file.type,
                        size: file.size,
                        path: imageData, // path 대신 Base64 데이터를 사용
                        uploadDate: new Date().toISOString()
                    };
                    previewImage.value = imageData;
                };
                reader.readAsDataURL(file);

                console.log('파일 업로드 성공');

            } catch (error) {
                console.error('파일 업로드 중 오류 발생:', error);
                errorMessage.value = '파일 업로드에 실패했습니다.';
                previewImage.value = null;
                selectedImageInfo.value = null;
                if (fileInput.value) {
                    fileInput.value.value = '';
                }
            }
        }
        updateMealInfo();
    };

    const addMealCard = () => {
        console.log('RegistMeal - addMealCard: 음식 추가 버튼 클릭');
        const mealInfo = {
            meal_name: document.querySelector('.registmeal-name-input').value,
            meal_description: document.querySelector('.registmeal-desc-input').value,
            meal_time: timeInput.value,
            file: selectedImageInfo.value
        };
        
        console.log('RegistMeal - addMealCard: 현재 등록된 음식', registeredFoods.value);
        mealStore.setTempMealInfo(mealInfo);
        console.log('RegistMeal - addMealCard: 임시 식사 정보 저장됨', mealInfo);
        router.push('/searchFood');
    };

    const removeMealCard = () => {
        console.log('RegistMeal - removeMealCard: 음식 제거 버튼 클릭');
        showDeleteMode.value = !showDeleteMode.value;
        console.log('RegistMeal - removeMealCard: 삭제 모드 상태 변경됨', showDeleteMode.value);
    };

    const handleDeleteFood = (index) => {
        console.log('RegistMeal - handleDeleteFood: 음식 삭제', index);
        // 해당 인덱스의 음식을 배열에서 제거
        registeredFoods.value = registeredFoods.value.filter((_, i) => i !== index);
        // Pinia store 업데이트
        mealStore.setSelectedFoods(registeredFoods.value);
        
        // 모든 음식이 삭제되었을 때 처리
        if (registeredFoods.value.length === 0) {
            showMealCard.value = false;
            showDeleteMode.value = false;
        }
        console.log('RegistMeal - handleDeleteFood: 남은 음식', registeredFoods.value);
    };

    const handleSubmit = async () => {
        console.log('RegistMeal - handleSubmit: 등록 버튼 클릭');
        // Proxy 객체를 일반 객체로 변환하여 출력
        console.log('RegistMeal - handleSubmit: 현재 등록된 음식', JSON.parse(JSON.stringify(registeredFoods.value)));
        if (!showMealCard.value || registeredFoods.value.length === 0) {
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

            // 날짜와 시간을 한국 시간 기준으로 ISO 8601 형식으로 변환
            const [datePart, timePart] = timeInput.value.split(' ');
            const [year, month, day] = datePart.split('-');
            const [hours, minutes] = timePart.split(':');
            
            // 한국 시간을 그대로 사용하여 ISO 8601 형식으로 변환
            const mealDateTime = `${datePart}T${timePart}:00`;
            
            // Proxy 객체를 일반 객체로 변환 - 서버 통신 시 문제 방지
            const normalizedFoods = JSON.parse(JSON.stringify(registeredFoods.value));
            
            // 음식 관련 영양소 데이터 계산
            const mealData = {
                id: Date.now(),
                meal_code: Date.now(),
                meal_title: document.querySelector('.registmeal-name-input').value,
                meal_desc: document.querySelector('.registmeal-desc-input').value,
                meal_dt: mealDateTime,  // ISO 8601 형식으로 저장
                meal_calories: totalNutrients.value.calorie,
                meal_carbs: totalNutrients.value.carb,
                meal_protein: totalNutrients.value.protein,
                meal_fat: totalNutrients.value.fat,
                meal_sugar: normalizedFoods.reduce((sum, food) => {
                    const quantity = parseFloat(food.quantity) || 1;
                    return sum + (parseFloat(food.sugar) || 0) * quantity;
                }, 0),
                meal_foods: normalizedFoods,
                user_code: 1,
                file: [selectedImageInfo.value]
            };

            console.log('저장될 데이터:', JSON.stringify(mealData, null, 2));

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mealData)
            });

            if (!response.ok) throw new Error('서버 응답 오류');
            
            // 등록 완료 모달 표시
            showCompleteModal.value = true;

        } catch (error) {
            console.error('저장 중 오류 발생:', error);
            errorMessage.value = '저장에 실패했습니다.';
        } finally {
            isLoading.value = false;
        }
    };

    const removeImage = () => {
        previewImage.value = null;
        selectedImageInfo.value = null;
        if (fileInput.value) {
            fileInput.value.value = '';
        }
    };

    const goToMeal = () => {
        console.log('RegistMeal - goToMeal: 취소 버튼 클릭');
        console.log('RegistMeal - goToMeal: 취소 전 음식 데이터', registeredFoods.value);
        mealStore.clearSelectedFoods();
        mealStore.clearTempMealInfo();
        console.log('RegistMeal - goToMeal: Pinia store 초기화 후', mealStore.selectedFoods);
        router.push('/meal');
    };

    const closeNoFoodModal = () => {
        showNoFoodModal.value = false;
    };

    const closeCompleteModal = () => {
        showCompleteModal.value = false;
        // 모달을 닫을 때 메인 페이지로 이동
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
            // 선택한 식사 정보가 있는지 확인
            if (!data || !data.meal) {
                console.error('선택한 식사 정보가 없습니다.');
                return;
            }
            
            console.log('불러온 식사 정보:', data);
            
            // 식사 정보 화면에 표시
            mealInfo.value = {
                meal_name: data.meal.meal_name || '',
                meal_description: data.meal.meal_description || '',
                meal_time: data.meal.meal_time || koreanDateTime.dateTime,
                file: data.meal.file || null
            };
            
            // 시간 입력란에 시간 설정
            if (data.meal.meal_time) {
                // meal_time이 ISO 형식(T 포함)인 경우 공백으로 변환
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
            
            // 이미지 정보 설정
            if (data.meal.file) {
                selectedImageInfo.value = data.meal.file;
                previewImage.value = data.meal.file.path;
            }
            
            // 등록된 음식 정보 설정
            if (data.meal.foods && data.meal.foods.length > 0) {
                // Proxy 객체가 되지 않도록 일반 객체로 변환
                const normalizedFoods = JSON.parse(JSON.stringify(data.meal.foods));
                registeredFoods.value = normalizedFoods;
                showMealCard.value = true;
                
                // Pinia store에도 저장 (일반 객체로 변환)
                mealStore.setSelectedFoods(normalizedFoods);
            }
            
            // 식사 정보를 Pinia store에 임시 저장
            mealStore.setTempMealInfo(JSON.parse(JSON.stringify(mealInfo.value)));
            
            // 모달 닫기
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
            // 식단에 포함된 각 음식을 음식 카드로 추가
            const foodsToAdd = [];
            
            selectedDiet.foods.forEach(food => {
                // 음식 데이터 형식 변환 (식단의 food 항목 -> 음식 카드 형식)
                const newFood = {
                    id: generateUniqueId(), // 고유 ID 생성
                    name: food.name || food.title || '음식',
                    type: food.type || 'USERDATA', // 기본 타입
                    unit: food.unit || '1인분',
                    kcal: food.kcal || food.calories || 0,
                    carb: food.carb || food.carbs || 0,
                    protein: food.protein || 0,
                    fat: food.fat || 0,
                    sugar: food.sugar || 0,
                    quantity: food.quantity || 1
                };
                
                // 새 음식을 배열에 추가
                foodsToAdd.push(newFood);
            });
            
            // 음식 목록에 추가 (Proxy 객체가 되지 않도록 일반 객체로 변환)
            registeredFoods.value = [...registeredFoods.value, ...foodsToAdd];
            showMealCard.value = true;
            
            // Pinia store에도 저장 (일반 객체로 변환)
            mealStore.setSelectedFoods(JSON.parse(JSON.stringify(registeredFoods.value)));
            
            // 추가된 음식에 따라 영양성분 업데이트
            updateMealInfo();
        }
        
        // 모달 닫기
        closeLoadDietPostModal();
    };

    // 고유 ID 생성 함수
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
        
        // Pinia 스토어에 임시 정보 저장
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
    min-height: 24px; /* 최소 높이 설정 */
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
    right: 280px;
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

.registmeal-cancel {
    position: absolute;
    right: 140px;
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