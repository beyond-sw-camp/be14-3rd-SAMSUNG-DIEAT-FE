<template>
    <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-body">
                <div class="complete-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="24" fill="#FF4B4B"/>
                        <path d="M20 28L16 24L14 26L20 32L34 18L32 16L20 28Z" fill="white"/>
                    </svg>
                </div>
                <div class="complete-message">등록이 완료되었습니다.</div>
                <button class="confirm-button" @click="closeModal">확인</button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    show: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
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
    width: 400px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
}

.complete-icon {
    margin-bottom: 8px;
}

.complete-message {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    text-align: center;
}

.confirm-button {
    width: 120px;
    height: 40px;
    background-color: #FF4B4B;
    color: white;
    border: none;
    border-radius: 4px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.confirm-button:hover {
    background-color: #ff3333;
}
</style> 