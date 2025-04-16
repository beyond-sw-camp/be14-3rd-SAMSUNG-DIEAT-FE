<template>
    <div class="pagination">
        <!-- 이전 그룹 버튼 -->
        <span :class="{ disabled: currentGroup === 1 }" @click="goToPrevGroup">◀</span>

        <!-- 페이지 목록 -->
        <span v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage }"
            @click="$emit('change', page)">
            {{ page }}
        </span>

        <!-- 다음 그룹 버튼 -->
        <span :class="{ disabled: endPage >= totalPages }" @click="goToNextGroup">▶</span>
    </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';

const props = defineProps({
    currentPage: Number,
    totalPages: Number,
    groupSize: {
        type: Number,
        default: 10
    }
});

const emit = defineEmits(['change']);

// 현재 그룹 번호 계산 (1부터 시작)
const currentGroup = computed(() => Math.ceil(props.currentPage / props.groupSize));

// 현재 그룹의 시작 페이지 번호
const startPage = computed(() => (currentGroup.value - 1) * props.groupSize + 1);

// 현재 그룹의 끝 페이지 번호
const endPage = computed(() => Math.min(startPage.value + props.groupSize - 1, props.totalPages));

// 표시할 페이지 목록
const visiblePages = computed(() => {
    const pages = [];
    for (let i = startPage.value; i <= endPage.value; i++) {
        pages.push(i);
    }
    return pages;
});

// 이전 그룹으로 이동
function goToPrevGroup() {
    if (currentGroup.value > 1) {
        const target = (currentGroup.value - 1) * props.groupSize;
        emit('change', target);
    }
}

// 다음 그룹으로 이동
function goToNextGroup() {
    if (endPage.value < props.totalPages) {
        const target = endPage.value + 1;
        emit('change', target);
    }
}
</script>