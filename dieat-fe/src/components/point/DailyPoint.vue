<template>
    <div class="point-container">
      <h1 class="title">나의 포인트 적립 내역</h1>
  
      <div class="summary-box" v-if="userStore.user?.role === 'USER'">
        <div>
          <span>일일 포인트 획득량</span>
          <strong>{{ todayEarnedPoint }}pt</strong>
        </div>
        <div>
          <span>일일 획득 가능량</span>
          <strong>{{ dailyLimitPoint }}pt</strong>
        </div>
      </div>
  
      <!-- 사용자 역할에 따른 안내 -->
      <p v-if="userStore.user?.role === 'USER' && todayEarnedPoint >= dailyLimitPoint" class="limit-msg">
        오늘 받을 수 있는 포인트를 다 받으셨습니다.
      </p>
      <p v-if="userStore.user?.role === 'ADMIN'" class="limit-msg">
        전체 회원 포인트 내역을 확인할 수 있습니다.
      </p>
  
      <!-- 테이블 -->
      <table class="point-table" v-if="filteredPointList.length > 0">
        <thead>
          <tr>
            <th>No.</th>
            <th v-if="userStore.user?.role === 'ADMIN'">사용자 ID</th>
            <th>획득처</th>
            <th>일시</th>
            <th>획득 포인트</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredPointList" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td v-if="userStore.user?.role === 'ADMIN'">{{ item.userId }}</td>
            <td>{{ item.source }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.point }}pt</td>
          </tr>
        </tbody>
      </table>
  
      <p v-else class="limit-msg">포인트 내역이 없습니다.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useUserStore } from '@/stores/user'
  
  const userStore = useUserStore()
  
  const dailyLimitPoint = 30
  const pointList = ref([])
  
  const today = new Date().toISOString().split('T')[0]

  console.log('userStore.user:', userStore.user)
  
  // 역할 기반 필터링
  const filteredPointList = computed(() => {
    const role = userStore.user?.role
    const userId = userStore.user?.userId
    if (role === 'ADMIN') return pointList.value
    return pointList.value.filter(item => item.userId === userId && item.date === today)
  })
  
  // 오늘 포인트 합산
  const todayEarnedPoint = computed(() =>
    filteredPointList.value.reduce((sum, item) => sum + item.point, 0)
  )
  
  onMounted(async () => {
    try {
      const res = await fetch('http://localhost:3000/pointList')
      const json = await res.json()
      pointList.value = json.map((item, index) => ({ id: index + 1, ...item }))
    } catch (error) {
      console.error('포인트 데이터를 불러오는 데 실패했습니다:', error)
    }
  })
  </script>
  
  <style scoped>
  .point-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 24px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    font-family: sans-serif;
  }
  
  .title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
  }
  
  .summary-box {
    display: flex;
    justify-content: flex-end;
    gap: 24px;
    margin-bottom: 12px;
    font-size: 16px;
  }
  
  .summary-box div {
    background: #f5f5f5;
    padding: 8px 16px;
    border-radius: 8px;
  }
  
  .limit-msg {
    text-align: right;
    color: red;
    font-weight: 500;
    margin-bottom: 12px;
  }
  
  .point-table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
  }
  
  .point-table th,
  .point-table td {
    padding: 12px;
    border: 1px solid #ccc;
  }
  
  .point-table th {
    background-color: #f0f0f0;
  }
  </style>