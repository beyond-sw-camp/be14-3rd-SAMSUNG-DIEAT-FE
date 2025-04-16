<!-- 게시글 검색 바 -->
<template>
    <div class="post-search-bar">
        <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            placeholder="제목을 입력해 주세요" />
        <button class="search-icon" disabled>
            🔍
        </button>
    </div>
</template>

<script setup>
defineProps({
    modelValue: String
});
</script>