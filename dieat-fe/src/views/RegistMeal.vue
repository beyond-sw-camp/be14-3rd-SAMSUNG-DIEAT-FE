<template>
  <!-- No changes to template section -->
</template>

<script>
import { useMealStore } from '@/stores/mealStore';

export default {
    setup() {
        const mealStore = useMealStore();

        const handleImageUpload = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64String = e.target.result;
                    const imageInfo = {
                        file,
                        base64: base64String
                    };
                    mealStore.setSelectedImageInfo(imageInfo);
                };
                reader.readAsDataURL(file);
            }
        };

        const handleSubmit = async () => {
            const formData = new FormData();
            formData.append('name', mealInfo.value.name);
            formData.append('description', mealInfo.value.description);
            formData.append('time', mealInfo.value.time);
            
            if (mealStore.selectedImageInfo) {
                formData.append('image', mealStore.selectedImageInfo.file);
            }
            
            try {
                // API 호출 로직
                mealStore.clearTempMealInfo();
            } catch (error) {
                console.error('Error submitting meal:', error);
            }
        };

        return {
            handleImageUpload,
            handleSubmit
        };
    }
};
</script>

<style>
  /* No changes to style section */
</style> 