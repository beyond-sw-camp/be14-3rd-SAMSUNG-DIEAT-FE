import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    currentMealType: null, // 아침, 점심, 저녁 등 현재 선택된 식사 타입
  }),
  
  actions: {
    addItem(item) {
      this.items.push(item)
    },
    
    removeItem(itemId) {
      const index = this.items.findIndex(item => item.id === itemId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },
    
    setMealType(type) {
      this.currentMealType = type
    },
    
    clearCart() {
      this.items = []
      this.currentMealType = null
    }
  },
  
  getters: {
    totalItems: (state) => state.items.length,
    getItems: (state) => state.items,
    getMealType: (state) => state.currentMealType
  }
}) 