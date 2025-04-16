<template>
  <div class="weekly-calendar">
    <div class="week-range-container">
      <button class="arrow-button" @click="previousWeek">
        <LeftArrowIcon />
      </button>
      <div class="week-range" @click="isCalendarVisible = !isCalendarVisible">
        <div class="week-range-text">{{ getWeekRangeText() }}</div>
      </div>
      <button class="arrow-button" @click="nextWeek">
        <RightArrowIcon />
      </button>
    </div>
    

    <div v-if="isCalendarVisible" class="modal-overlay" @click="isCalendarVisible = false">
      <div class="modal-content" @click.stop>
        <div class="calendar-wrapper">
          <Calendar
            v-model="selectedDate"
            :initial-date="new Date(selectedDate)"
            :attributes="getAttributes()"
            @dayclick="onDayClick"
            :show-nav="true"
            :first-day-of-week="0"
            :min-date="null"
            :max-date="null"
            :show-iso-weeknumbers="false"
            :expanded="true"
            :trim-weeks="false"
            :show-weeknumbers="false"
            :masks="calendarOptions.masks"
            :is-expanded="true"
            color="black"
            :columns="1"
            :rows="1"
            :is-range="false"
            transparent
            :from-page="{ month: new Date().getMonth() + 1, year: new Date().getFullYear() }"
            :disable-page-swipe="false"
            nav-visibility="visible"
            :disable-days="null"
            :pages-transition-class="'slide-h'"
            :can-move-page="true"
            show-adjacent-months
            hide-out-of-range-days="false"
          />
        </div>
      </div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="day in getWeekDays()"
        :key="day.date"
        class="calendar-day"
        :class="{ 
          'selected': selectedDate === day.date,
          'today': isToday(day.date)
        }"
        @click="selectDate(day.date)"
      >
        <div class="day-name">{{ day.dayName }}</div>
        <div class="day-date">{{ day.day }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import { Calendar } from 'v-calendar'
import LeftArrowIcon from '@/components/icons/LeftArrowIcon.vue'
import RightArrowIcon from '@/components/icons/RightArrowIcon.vue'

const selectedDate = inject('selectedDate')
const currentWeekOffset = ref(0)
const isCalendarVisible = ref(false)

const calendarOptions = ref({
  firstDayOfWeek: 0,
  minDate: null,
  maxDate: null,
  showWeeknumbers: false,
  masks: {
    title: 'YYYY년 M월',
    weekdays: 'WW'
  },
  locale: 'ko',
  timezone: 'local'
})

function isToday(date) {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const koreanTime = new Date(now.getTime() + offset + (9 * 60 * 60 * 1000));
  const today = koreanTime.toISOString().split('T')[0];
  
  return date === today;
}

function getWeekDays() {
  const days = [];
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const koreanTime = new Date(now.getTime() + offset + (9 * 60 * 60 * 1000));
  
  const lastSunday = new Date(koreanTime);
  lastSunday.setDate(koreanTime.getDate() - koreanTime.getDay() + (currentWeekOffset.value * 7));
  
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(lastSunday);
    currentDate.setDate(lastSunday.getDate() + i);
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    days.push({
      date: dateStr,
      day: String(currentDate.getDate()),
      dayName: dayNames[currentDate.getDay()]
    });
  }

  return days;
}

function getWeekRangeText() {
  const days = getWeekDays()
  const startDate = new Date(days[0].date)
  const endDate = new Date(days[6].date)
  return `${startDate.getFullYear()}년 ${startDate.getMonth() + 1}월 ${startDate.getDate()}일  -  ${endDate.getFullYear()} ${endDate.getMonth() + 1}월 ${endDate.getDate()}일`
}

function getAttributes() {
  const currentDate = new Date(selectedDate.value)
  return [{
    key: 'selected',
    highlight: {
      fillMode: 'solid',
      color: '#4CAF50',
      contentClass: 'day-content-selected'
    },
    dates: currentDate
  }]
}

const selectDate = (date) => {
  selectedDate.value = date
}

const onDayClick = (day) => {
  console.log('Day clicked:', day);
  
  const selectedDay = new Date(day.date);
  selectedDay.setHours(selectedDay.getHours() + 9);
  
  const year = selectedDay.getFullYear();
  const month = String(selectedDay.getMonth() + 1).padStart(2, '0');
  const date = String(selectedDay.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${date}`;
  
  selectedDate.value = formattedDate;
  isCalendarVisible.value = false;
  
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const koreanTime = new Date(now.getTime() + offset + (9 * 60 * 60 * 1000));
  
  const diffTime = selectedDay - koreanTime;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  currentWeekOffset.value = Math.floor(diffDays / 7);
}

const previousWeek = () => {
  currentWeekOffset.value--
}

const nextWeek = () => {
  currentWeekOffset.value++
}
</script>

<style scoped>
.weekly-calendar {
  position: relative;
}

.week-range-container {
  width: 582px;
  position: relative;
  border-radius: 10px;
  height: 67px;
  background: #EFEFEF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  margin-bottom: 10px;
}

.week-range {
  width: 100%;
  position: relative;
  height: 100%;
  text-align: center;
  font-size: 16px;
  color: #000;
  font-family: Inter;
  flex: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.week-range-text {
  width: 100%;
  position: relative;
  font-size: 16px;
  letter-spacing: -0.02em;
  font-weight: 600;
  font-family: Inter;
  color: #000;
  white-space: pre-wrap;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  z-index: 1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 5px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 718px;
  height: 541px;
  overflow: hidden;
}

.arrow-button {
  background: red;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}

.calendar-grid {
  position: relative;
  z-index: 1;
  width: 580px;
  margin: 20px auto 0;
  display: grid;
  grid-template-columns: repeat(7, 58px);
  gap: 15px;
  justify-content: space-between;
}

.calendar-day {
  width: 58px;
  height: 78px;
  padding: 10px;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  box-sizing: border-box;
}

.calendar-day.today {
  background-color: #FFF8ED;
}

.calendar-day:hover {
  background-color: #f5f5f5;
}

.calendar-day.selected {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.calendar-day.today.selected {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.day-name {
  font-weight: bold;
  margin-bottom: 15px;
}

.day-date {
  font-size: 0.9em;
  color: #666;
  margin-top: 10px;
}

.selected .day-date {
  color: white;
}

:deep(.vc-container) {
  border: none;
  font-family: Inter, sans-serif;
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

:deep(.vc-header) {
  padding: 0 30px;
  background: #F8F8F8;
  margin: 0;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-bottom: 1px solid #EEEEEE;
  margin-bottom: 27px;
}

:deep(.vc-title) {
  font-size: 16px !important;
  font-weight: 600 !important;
  font-family: 'Inter', sans-serif !important;
  color: #000;
  cursor: pointer;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  padding: 0;
}

:deep(.vc-title:hover) {
  background: none;
}

:deep(.vc-arrow) {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  background: none;
  cursor: pointer;
  border: none;
  padding: 0;
  z-index: 2;
}

:deep(.vc-weeks) {
  padding: 0;
  width: 100%;
  height: 437.8px;
  display: flex;
  flex-direction: column;
}

:deep(.vc-week) {
  width: 100%;
  display: flex;
  height: 88.16px;
  border-bottom: 1px solid #EEEEEE;
}

:deep(.vc-week:last-child) {
  border-bottom: none;
}

:deep(.vc-weekdays) {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid #EEEEEE;
  padding: 0px 0 10px 0;
  margin: 0;
}

:deep(.vc-weekday) {
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  flex: 1;
  text-align: center;
}

:deep(.vc-weekday:first-child) {
  color: #FF0000;
}

:deep(.vc-nav-container) {
  z-index: 100;
}

:deep(.vc-popover-content) {
  z-index: 100;
}

:deep(.vc-day) {
  flex: 1;
  height: 100%;
  padding: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  border-right: 1px solid #EEEEEE;
  position: relative;
}

:deep(.vc-day:last-child) {
  border-right: none;
}

:deep(.vc-day.is-not-in-month) {
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  position: relative;
  z-index: 10;
  display: flex !important;
  cursor: pointer !important;
}

:deep(.vc-day.is-not-in-month .vc-day-content) {
  color: #CCCCCC !important;
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
  cursor: pointer !important;
  pointer-events: auto !important;
}

:deep(.vc-day.is-today .vc-day-content) {
  background: none;
  color: #333333;
  font-weight: 600;
}

:deep(.vc-day.is-selected .vc-day-content) {
  background: none;
  color: #333333;
  position: relative;
  z-index: 2;
}

:deep(.vc-day-container) {
  margin: 0;
  padding: 0;
}

:deep(.calendar-wrapper) {
  width: 100%;
  height: 100%;
}

:deep(.highlight-selected) {
  position: absolute !important;
  top: 8px !important;
  left: 8px !important;
  width: 24px !important;
  height: 24px !important;
  background-color: #4CAF50 !important;
  border-radius: 50% !important;
  z-index: 1 !important;
}

:deep(.vc-highlights) {
  position: absolute !important;
  width: 26px !important;
  height: 26px !important;
  top: 7px !important;
  left: 7px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  pointer-events: none !important;
  z-index: 1 !important;
}

:deep(.vc-highlight) {
  width: 26px !important;
  height: 26px !important;
  border-radius: 50% !important;
  background-color: #4CAF50 !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
}

:deep(.vc-day-content) {
  width: 24px;
  height: 24px;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
}

:deep(.vc-day.weekday-0.is-selected .vc-day-content),
:deep(.vc-weekday:first-child) {
  color: #FF0000 !important;
}

:deep(.vc-day.is-not-in-month.is-selected .vc-day-content) {
  color: #CCCCCC !important;
}

:deep(.day-content-selected) {
  color: white !important;
  font-weight: 800 !important;
}

:deep(.vc-day:first-child .day-content-selected) {
  color: white !important;
  font-weight: 500 !important;
}

:deep(.vc-day.is-not-in-month .day-content-selected) {
  color: white !important;
  font-weight: 500 !important;
}
</style> 