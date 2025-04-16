<template>
    <div class="basket-panel-wrapper">
        <div v-for="(item, index) in items" :key="item.name" class="basket-item">
            <button class="remove-button" @click="$emit('remove-item', index)">
                ✕
            </button>
            <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <input class="item-qty-input" type="number" step="0.1" min="0" :value="item.quantity"
                    @input="$emit('update-quantity', { index, quantity: parseFloat($event.target.value) || 0 })" />
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    items: {
        type: Array,
        required: true
    }
})

defineEmits(['remove-item', 'update-quantity'])
</script>