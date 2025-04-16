<template>
    <div class="search-section">
        <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            placeholder="검색할 음식명을 입력해 주세요" />
        <button class="icon-button" @click="$emit('add')">✛</button>

        <div class="dropdown-wrapper">
            <button class="icon-button" @click="toggleFilter">☰</button>

            <div v-if="showFilter" class="filter-dropdown">
                <ul>
                    <li :class="{ active: selectedFilter === 'latest' }" @click="select('latest')">
                        최신순
                    </li>
                    <li :class="{ active: selectedFilter === 'accuracy' }" @click="select('accuracy')">
                        정확도순
                    </li>
                    <li :class="{ active: selectedFilter === 'ratio' }" @click="select('ratio')">
                        정확도 비율순
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    modelValue: String,
})

const emit = defineEmits(['update:modelValue', 'add', 'selectFilter'])

const showFilter = ref(false)
const selectedFilter = ref(null) // 기본값 설정

function toggleFilter() {
    showFilter.value = !showFilter.value
}

function select(type) {
    selectedFilter.value = type
    showFilter.value = false
    emit('selectFilter', type)
}
</script>

<style scoped>
.filter-dropdown li.active {
    font-weight: bold;
    background-color: #f6f6f6;
}
</style>