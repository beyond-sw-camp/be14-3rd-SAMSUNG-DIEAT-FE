<template>
  <div class="weight-chart-wrapper">
    <div class="y-axis-labels">
      <div v-for="tick in yTicks" :key="tick" class="y-label">
        {{ tick }}kg
      </div>
    </div>
    <div class="chart-scroll-area" ref="scrollAreaRef">
      <canvas ref="chartRef" :width="canvasWidth" :height="canvasHeight" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
} from 'chart.js'
import dayjs from 'dayjs'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip)

// Reactive 변수 선언
const chartRef = ref(null)
const scrollAreaRef = ref(null)
const canvasWidth = ref(0)
const canvasHeight = 300
const yTicks = ref([])

onMounted(async () => {
  // 1. API에서 weightRecords 데이터를 가져옴
  const recordsResponse = await fetch('http://localhost:3000/weightRecords')
  const weightRecords = await recordsResponse.json()
  // 날짜 오름차순 정렬 (날짜 문자열을 Date 객체로 변환하여 비교)
  weightRecords.sort((a, b) => new Date(a.date) - new Date(b.date))

  // 2. API에서 weightGoals 데이터를 가져옴
  const goalsResponse = await fetch('http://localhost:3000/weightGoals')
  const weightGoals = await goalsResponse.json()

  // 3. 날짜 범위 생성  
  const startDate = dayjs(weightRecords[0].date)
  const endDate = dayjs(weightRecords[weightRecords.length - 1].date)
  const dateRange = []
  let current = startDate
  while (current.isBefore(endDate) || current.isSame(endDate)) {
    // dateRange에 'M/D' 형식으로 저장합니다.
    dateRange.push(current.format('M/D'))
    current = current.add(1, 'day')
  }

  // 4. 각 날짜에 해당하는 체중을 매핑  
  // API의 r.date 값과 dateRange의 형식이 다를 수 있으므로 dayjs로 포맷 통일
  const dateToWeightMap = Object.fromEntries(
    weightRecords.map(r => [dayjs(r.date).format('M/D'), r.weight])
  )
  const data = dateRange.map(date => dateToWeightMap[date] ?? null)

  // 5. y축 눈금 계산  
  // weightRecords의 체중과 weightGoals의 startWeight, goalWeight를 모두 포함하여 최소/최대값 계산
  const values = weightRecords.map(r => r.weight).concat([weightGoals.startWeight, weightGoals.goalWeight])
  const rawMin = Math.min(...values)
  const rawMax = Math.max(...values)
  let minY, maxY
  if (Number.isInteger(rawMin)) {
    minY = rawMin - 1
  } else {
    minY = Math.floor(rawMin)
  }
  if (Number.isInteger(rawMax)) {
    maxY = rawMax + 1
  } else {
    maxY = Math.ceil(rawMax)
  }
  const ticks = []
  for (let i = maxY; i >= minY; i--) {
    ticks.push(i)
  }
  yTicks.value = ticks

  // 6. 캔버스 폭을 날짜 수에 따라 설정 (1일당 60px)
  canvasWidth.value = dateRange.length * 60

  // DOM 업데이트 후 차트 생성을 위해 nextTick 대기
  await nextTick()

  // 7. Chart.js 차트 생성  
  // x축 라벨은 dateRange에 저장된 'M/D' 형식을 dayjs로 다시 'M월 D일'로 변환하여 사용합니다.
  const ctx = chartRef.value.getContext('2d')
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dateRange.map(d => dayjs(d, 'M/D').format('M월 D일')),
      datasets: [
        {
          data,
          borderColor: '#46a3ff',
          backgroundColor: '#46a3ff44',
          pointRadius: 4,
          tension: 0.3,
          spanGaps: true
        },
        {
          label: '시작 체중',
          data: new Array(dateRange.length).fill(weightGoals.startWeight),
          borderColor: '#ff4d4d',
          borderWidth: 2,
          borderDash: [4, 4],
          pointRadius: 0
        },
        {
          label: '목표 체중',
          data: new Array(dateRange.length).fill(weightGoals.goalWeight),
          borderColor: '#4d79ff',
          borderWidth: 2,
          borderDash: [4, 4],
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#555'
          }
        },
        y: {
          min: minY,
          max: maxY,
          ticks: {
            color: '#fff'
          },
          grid: {
            drawTicks: false
          }
        }
      }
    }
  })

  requestAnimationFrame(() => {
    scrollAreaRef.value.scrollLeft = scrollAreaRef.value.scrollWidth
  })
})
</script>

<style scoped>
.weight-chart-wrapper {
  display: flex;
  height: 300px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.y-axis-labels {
  width: 50px;
  flex-shrink: 0;
  padding: 4px 4px 20px 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: right;
  font-size: 12px;
  color: #555;
  background: white;
}

.chart-scroll-area {
  overflow-x: auto;
  overflow-y: hidden;
}

canvas {
  display: block;
}
</style>
