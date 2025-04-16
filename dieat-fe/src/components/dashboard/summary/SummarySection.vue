<template>
  <div class="summary-section">
    <div class="summary-wrapper">
      <div class="summary-box-area">
        <p class="summary-title">오늘 영양 요약</p>
        <div class="summary-box">
          <SummaryCard />
        </div>
      </div>
      <div class="summary-box-area">
        <p class="summary-title">목표 체중 달성률</p>
        <div class="summary-box">
          <SummaryChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SummaryCard from './SummaryCard.vue'
import SummaryChart from './SummaryChart.vue'
</script>

<style scoped>
.summary-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.summary-wrapper {
  display: flex;
  gap: 40px;
}

.summary-box-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.summary-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 4px;
}

.summary-box {
  width: 250px;
  height: 270px;
  background-color: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  /* overflow: ;        ✅ 내부 넘침 방지 */
  box-sizing: border-box;  /* ✅ 패딩 포함 */
}

</style>
