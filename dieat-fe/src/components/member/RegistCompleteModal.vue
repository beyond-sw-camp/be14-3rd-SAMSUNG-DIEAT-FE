<template>
    <div class="modal-overlay" v-if="show">
      <div class="modal-box">
        <div class="check-icon" :style="{ backgroundColor: iconBackgroundColor, color: color }">
          {{ icon }}
        </div>
        <h2 class="modal-title">{{ title }}</h2>
        <p class="modal-subtext" v-html="message" ></p>
        <button class="modal-button" :style="{ backgroundColor: color }" @click="$emit('close')">확인</button>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    show: Boolean,
    icon: {
      type: String,
      default: '✔'
    },
    title: {
      type: String,
      default: '회원가입 완료'
    },
    message: {
      type: String,
      default: '지금 바로 다양한 콘텐츠를 감상하고<br />글을 작성해 보세요'
    },
    color: {
      type: String,
      default: '#22611d'
    },
    iconBackgroundColor: {
      type: String,
      default: '#dff1e1'
    }
  })
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-box {
    background-color: #f4fbf5;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .check-icon {
    width: 36px;
    height: 36px;
    margin: 0 auto 12px;
    border-radius: 50%;
    font-size: 20px;
    line-height: 36px;
    font-weight: bold;
  }
  .modal-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    color: #222;
  }
  .modal-subtext {
    font-size: 14px;
    color: #555;
    margin-bottom: 24px;
  }
  .modal-button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
  }
  </style>
  