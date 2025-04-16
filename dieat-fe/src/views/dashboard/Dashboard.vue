<template>
  <div>

    <div class="dashboard-wrapper">
      <!-- 1. 요약 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">요약</h2>
        </div>
        <div class="dashboard-box">
          <SummarySection />
        </div>
      </div>

      <!-- 2. 오늘 식사 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">오늘 식사</h2>
          <AddMealButton />
        </div>
        <div class="dashboard-box">
          <TodayMealSection />
        </div>
      </div>

      <!-- 3. 체중 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">체중</h2>
        </div>
        <div class="dashboard-box">
          <WeightSection />
        </div>
      </div>

      <!-- 4. 주간 식사 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">주간 식사</h2>
        </div>
        <div class="dashboard-box">
          <WeeklyMealSection/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue'
import SummarySection from '@/components/dashboard/summary/SummarySection.vue'
import TodayMealSection from '@/components/dashboard/todaymeal/TodayMealSection.vue'
import AddMealButton from '@/components/dashboard/todaymeal/AddMealButton.vue'
import WeightSection from '@/components/dashboard/weight/WeightSection.vue'
import WeeklyMealSection from '@/components/dashboard/weeklymeal/WeeklyMealSection.vue'
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  padding: 20px 20px 20px;
}

.dashboard-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

/* ✅ 섹션 상단 타이틀과 버튼을 함께 정렬 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 600px; /* dashboard-box와 동일하게 정렬 기준 맞춤 */
  padding: 0 8px;
}

.section-title {
  font-size: 22px;
  margin: 0;
}

.dashboard-box {
  width: 600px;
  height: 350px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  background-color: white;
}
</style>
