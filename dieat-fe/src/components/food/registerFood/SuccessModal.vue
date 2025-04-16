<!-- SuccessModal.vue -->
<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-box">
            <p class="modal-message">음식 등록 완료</p>
            <button class="confirm-button" @click="close">확인</button>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['close'])
function close() {
    emit('close')
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-box {
    background: white;
    padding: 2.5rem;
    border-radius: 1rem;
    text-align: center;
    width: 300px;
}

.modal-message {
    font-weight: bold;
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
}

.confirm-button {
    background-color: var(--color-primary);
    color: white;
    font-weight: bold;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
}
</style>