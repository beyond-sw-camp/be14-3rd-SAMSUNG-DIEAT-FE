<template>
    <div class="form-group">
      <label class="form-label">{{ label }}</label>
      <input
        :type="type"
        :placeholder="placeholder"
        class="form-input"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    label: String,
    placeholder: String,
    type: {
      type: String,
      default: 'text'
    },
    modelValue: String
  })
  const emit = defineEmits(['update:modelValue'])
  </script>
  
  <style scoped>
 .form-group {
  margin-bottom: 20px;
  }

  .form-label {
    display: block;
    margin-bottom: 6px;
    color: #222;
    font-weight: 600;
    font-size: 16px; /* 고정 크기 */
  }

  .form-input {
    width: 100%;
    height: 44px;               /* 고정 높이 */
    padding: 0 12px;            /* 고정 패딩 */
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;            /* 고정 글자 크기 */
    line-height: 1.4;
    box-sizing: border-box;
  }

  .form-input::placeholder {
    font-size: 14px;            /* placeholder 크기도 고정 */
    color: #aaa;
  }

  </style>