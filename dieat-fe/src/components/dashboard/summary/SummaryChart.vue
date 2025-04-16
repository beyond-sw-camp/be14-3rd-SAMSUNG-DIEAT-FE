<template>
  <div class="summary-chart">
    <canvas ref="chartRef" width="240" height="240" />
    <div class="center-text">{{ percentage }}%</div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import dayjs from 'dayjs'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

// API 결과를 담을 반응형 변수
const weightGoalsData = ref({ startWeight: 0, goalWeight: 0 })
const weightRecordsData = ref([])

const chartRef = ref(null)

// computed로 값 계산하기
const start = computed(() => weightGoalsData.value.startWeight)
const goal = computed(() => weightGoalsData.value.goalWeight)

// weightRecords는 최신 체중(마지막 기록)을 사용
const currentWeight = computed(() =>
  weightRecordsData.value.length > 0 ? weightRecordsData.value[weightRecordsData.value.length - 1].weight : null
)

const totalToLose = computed(() => start.value - goal.value)
const lost = computed(() => start.value - (currentWeight.value !== null ? currentWeight.value : start.value))
const remaining = computed(() => totalToLose.value - lost.value)

const percentage = computed(() => {
  if (!currentWeight.value || totalToLose.value <= 0) return 0
  const ratio = Math.min(lost.value / totalToLose.value, 1)
  return Math.round(ratio * 100)
})

onMounted(async () => {
  // 1. weightGoals 데이터를 fetch
  const responseGoals = await fetch('http://localhost:3000/weightGoals')
  const goals = await responseGoals.json()
  weightGoalsData.value = goals

  // 2. weightRecords 데이터를 fetch
  const responseRecords = await fetch('http://localhost:3000/weightRecords')
  const records = await responseRecords.json()
  // 날짜 오름차순 정렬 (최신 기록이 마지막에 오도록)
  records.sort((a, b) => new Date(a.date) - new Date(b.date))
  weightRecordsData.value = records

  // 3. Chart 생성 (computed된 lost, remaining을 사용)
  const ctx = chartRef.value.getContext('2d')
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['달성', '남은 목표'],
      datasets: [
        {
          data: [lost.value, remaining.value > 0 ? remaining.value : 0],
          backgroundColor: ['#46a3ff', '#e0e0e0'],
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      cutout: '60%'
    }
  })
})
</script>

<style scoped>
.summary-chart {
  position: relative;
  width: 240px;
  height: 240px;
  margin: auto;
}

canvas {
  display: block;
  width: 240px;
  height: 240px;
}

.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  font-weight: bold;
  color: #333;
}
</style>
