<template>
    <ul class="search-result-list">
        <li v-for="(item, index) in results" :key="index" @click="$emit('select', item)">
            {{ item.name }}
        </li>
    </ul>
</template>

<script setup>
defineProps({
    results: {
        type: Array,
        required: true
    }
})

defineEmits(['select'])
</script>