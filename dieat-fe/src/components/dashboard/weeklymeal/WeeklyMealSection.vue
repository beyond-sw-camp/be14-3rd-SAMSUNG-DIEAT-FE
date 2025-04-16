<template>
  <div class="weekly-chart-wrapper">
    <div class="y-axis-labels">
      <div
        v-for="tick in yAxisTicks"
        :key="tick"
        class="y-label"
      >
        {{ tick }}kcal
      </div>
    </div>
    <div class="chart-scroll-area" ref="scrollAreaRef">
      <canvas ref="chartRef" :width="canvasWidth" :height="300" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue'
import {
  Chart, BarController, BarElement, CategoryScale,
  LinearScale, Tooltip
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import dayjs from 'dayjs'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, annotationPlugin)

// nutritionGoals를 로컬 모듈 대신 API를 통해 받아오기 위한 reactive 변수 선언
const nutritionGoals = ref({ calories: 0 })

const chartRef = ref(null)
const scrollAreaRef = ref(null)
const canvasWidth = ref(0)
const yAxisTicks = ref([])

onMounted(async () => {
  // 1. meals 데이터 fetch
  const response = await fetch('http://localhost:3000/meals')
  const meals = await response.json()
  console.log('받아온 meals:', meals)

  // 2. nutritionGoals 데이터 fetch
  const goalsResponse = await fetch('http://localhost:3000/nutritionGoals')
  const fetchedNutritionGoals = await goalsResponse.json()
  nutritionGoals.value = fetchedNutritionGoals
  console.log('받아온 nutritionGoals:', nutritionGoals.value)

  // 3. 날짜 포맷 변환 및 정렬
  const parsedMeals = meals.map(meal => {
    const dateObj = dayjs(meal.meal_dt)
    return {
      name: meal.meal_title,
      date: dateObj.format('YYYY-MM-DD'),
      calories: meal.meal_calories
    }
  }).sort((a, b) => a.date.localeCompare(b.date))

  // 4. 최소/최대 날짜 구하기 및 dateRange 생성
  const minDate = dayjs(parsedMeals[0].date)
  const maxDate = dayjs(parsedMeals[parsedMeals.length - 1].date)
  const dateRange = []
  let current = minDate
  while (current.isSame(maxDate) || current.isBefore(maxDate)) {
    dateRange.push(current.format('YYYY-MM-DD'))
    current = current.add(1, 'day')
  }

  // 5. 날짜별 칼로리 및 식사이름 그룹핑
  const groupedCalories = {}
  const groupedNames = {}
  dateRange.forEach(date => {
    groupedCalories[date] = []
    groupedNames[date] = []
  })
  parsedMeals.forEach(meal => {
    if (groupedCalories[meal.date]) {
      groupedCalories[meal.date].push(meal.calories)
      groupedNames[meal.date].push(meal.name)
    }
  })

  // 6. 최대 stack 크기 계산 후 datasets 구성
  const maxStackSize = Math.max(...Object.values(groupedCalories).map(arr => arr.length))
  const fixedColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF']

  const datasets = []
  for (let i = 0; i < maxStackSize; i++) {
    datasets.push({
      data: dateRange.map(date => groupedCalories[date][i]),
      backgroundColor: fixedColors[i % fixedColors.length],
      stack: 'calories',
      barThickness: 8,
      borderRadius: 6,
      mealNames: dateRange.map(date => groupedNames[date][i])
    })
  }

  // 7. 목표 섭취 칼로리 라인 추가 (nutritionGoals는 fetch된 값 사용)
  datasets.push({
    type: 'line',
    label: '목표 섭취 칼로리',
    data: new Array(dateRange.length).fill(nutritionGoals.value.calories),
    borderColor: '#FFA500',
    borderWidth: 2,
    borderDash: [6, 4],
    pointRadius: 0,
    fill: false
  })

  // 8. 캔버스 폭 계산 (1일당 60px)
  canvasWidth.value = dateRange.length * 60

  // DOM에 canvasWidth 반영을 위해 nextTick 대기
  await nextTick()

  // 9. y축 최대값 및 티크 설정
  const maxCalorieSum = Math.max(
    ...Object.values(groupedCalories).map(arr => arr.reduce((a, b) => a + b, 0)),
    nutritionGoals.value.calories
  ) + 200

  const maxYValue = Math.ceil(maxCalorieSum)
  const numYTicks = 6
  const yAxisStep = Math.ceil(maxYValue / (numYTicks - 1) / 10) * 10
  const yAxisMax = yAxisStep * (numYTicks - 1)

  yAxisTicks.value = []
  for (let y = yAxisMax; y >= 0; y -= yAxisStep) {
    yAxisTicks.value.push(y)
  }

  // 10. 막대 위 총 칼로리 라벨 플러그인
  const topValueLabelPlugin = {
    id: 'topValueLabel',
    afterDatasetsDraw(chart) {
      const { ctx, scales: { x, y } } = chart
      chart.data.labels.forEach((label, index) => {
        const total = chart.data.datasets
          .filter(ds => ds.type !== 'line')
          .map(ds => ds.data[index])
          .reduce((sum, val) => sum + (val || 0), 0)
        const xPos = x.getPixelForValue(index)
        const yPos = y.getPixelForValue(total)
        ctx.save()
        ctx.fillStyle = '#444'
        ctx.font = 'bold 10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${total}kcal`, xPos, yPos - 3)
        ctx.restore()
      })
    }
  }

  // 11. Chart.js 차트 생성
  const ctx = chartRef.value.getContext('2d')
  const chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dateRange.map(d => `${dayjs(d).format('M월 D')}일`),
      datasets: datasets
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const ds = ctx.dataset
              const index = ctx.dataIndex
              const mealName = ds.mealNames?.[index] || '이름 없음'
              return `${mealName}: ${ctx.raw} kcal`
            }
          }
        },
        annotation: {
          goalLine: {
            type: 'line',
            yMin: nutritionGoals.value.calories,
            yMax: nutritionGoals.value.calories,
            borderColor: '#F4A100',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              display: true,
              content: '목표 섭취',
              position: 'start',
              backgroundColor: '#F4A100',
              color: '#fff',
              font: { weight: 'bold' }
            },
            xScaleID: 'x',
            xMin: -0.5,
            xMax: dateRange.length - 0.5
          }
        },
        topValueLabel: true
      },
      scales: {
        y: {
          stacked: true,
          beginAtZero: true,
          min: 0,
          max: yAxisMax,
          ticks: {
            stepSize: yAxisStep,
            display: false
          },
          grid: {
            display: true,
            color: '#ddd',
            lineWidth: 1,
            drawTicks: false,
            drawBorder: false
          }
        }
      }
    },
    plugins: [topValueLabelPlugin]
  })
  chartInstance.update()

  console.log('차트에 전달되는 데이터:', {
    labels: dateRange.map(d => `${dayjs(d).format('M월 D')}일`),
    datasets: datasets
  })

  requestAnimationFrame(() => {
    scrollAreaRef.value.scrollLeft = scrollAreaRef.value.scrollWidth
  })
})
</script>

<style scoped>
.weekly-chart-wrapper {
  display: flex;
  height: 300px;
  width: 100%;
  background: white;
}

.y-axis-labels {
  width: 60px;
  flex-shrink: 0;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: right;
  font-size: 12px;
  color: #555;
  background: white;
  transform: translateY(-12px);
}

.chart-scroll-area {
  overflow-x: auto;
  overflow-y: hidden;
}

canvas {
  display: block;
}
</style>
