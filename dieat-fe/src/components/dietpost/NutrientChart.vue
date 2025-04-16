<template>
    <Doughnut :data="chartData" :options="chartOptions" />
  </template>
  
  <script setup>
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement
  } from 'chart.js'
  import { Doughnut } from 'vue-chartjs'
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement)
  
  const props = defineProps({
    carbs: Number,
    protein: Number,
    fat: Number
  })
  
  const chartData = {
    labels: ['탄수화물', '단백질', '지방'],
    datasets: [
      {
        backgroundColor: ['#a58bff', '#ff8c8c', '#60d1d4'],
        data: [props.carbs, props.protein, props.fat]
      }
    ]
  }
  
  const chartOptions = {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right'
      }
    }
  }
  </script>
  