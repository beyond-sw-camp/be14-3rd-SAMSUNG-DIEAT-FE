<template>
    <div class="bookmark-page">
      <!-- 왼쪽 메뉴 -->
      <aside class="sidebar">
        <h2>북마크</h2>
        <ul>
          <li
            v-for="(menu, index) in menuList"
            :key="index"
            :class="{ active: selectedMenu === menu }"
            @click="selectedMenu = menu"
          >
            {{ menu }}
          </li>
          <li class="add-button">+</li>
        </ul>
      </aside>
  
      <!-- 오른쪽 콘텐츠 -->
      <section class="content">
        <div class="card-grid">
            <div class="food-card" v-for="(item, index) in filteredFoods" :key="index">
            <div class="card-image">
                <img :src="item.images" alt="food" />
            </div>
            <div class="title-row">
                <div class="title">{{ item.title }}</div>
                <div class="bookmark">
                    <img src="@/assets/bookmark_img/bookmark.png" alt="북마크">
                </div>
            </div>
            <div class="nutrition-boxes">
                <div class="nutrient" v-for="(nutrient, idx) in item.nutrients" :key="idx">
                <div class="value">{{ nutrient.value }}</div>
                <div class="label">{{ nutrient.label }}</div>
                </div>
            </div>
        </div>
    </div>
    

    </section>
</div>
</template>
  
<script setup>
    import { ref, onMounted, computed } from 'vue';
    // import { bookmarkFood } from './data/bookmarkMeat';

    import Header from '@/components/common/Header.vue';

    const menuList = ['모든 게시물', '다이어트', '고기 먹고 싶을 때', '데이트', '야식'];
    const selectedMenu = ref(menuList[0]);
    const foods = ref([]);

    // 보여줄 음식 리스트 (선택된 메뉴 기준으로 필터링)
    const filteredFoods = computed(() => {
        if (selectedMenu.value === '모든 게시물') return foods.value;
        return foods.value.filter(item => item.category === selectedMenu.value);
    });

    onMounted(async () => {
        const res = await fetch('http://localhost:3001/bm'); // public 기준 경로
        const json = await res.json();

        // nutrients 배열로 가공
        foods.value = json.map(item => ({
            ...item,
            nutrients: [
            { label: 'kcal', value: item.calories },
            { label: '탄', value: item.carbs },
            { label: '단', value: item.protein },
            { label: '지', value: item.fat },
            { label: '당', value: item.sugar }
            ]
        }));
    });
    
</script>

<style scoped>
    .bookmark-page {
        display: flex;
        height: 100vh;
        background: #f8f8f8;
    }

        .sidebar {
        width: 250px;
        background: white;
        padding: 2rem 1rem;
        border-right: 1px solid #eee;
        }

        .sidebar h2 {
            margin-left: 30px;
            margin-bottom: 1.5rem;
            font-size: 1.2rem;
        }

        .sidebar ul {
            margin-left: 20px;
            list-style: none;
            padding: 0;
        }

        .sidebar li {
            padding: 0.75rem 1rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .sidebar li.active {
            background-color: #377460;
            color: white;
            font-weight: bold;
        }

        .sidebar .add-button {
            text-align: center;
            font-weight: bold;
            font-size: 1.2rem;
            background: #eee;
        }

        .content {
            flex: 1;
            padding: 2rem;
            overflow-y: auto;
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 2rem;
            background: #f5f5f5;
        }

        .food-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            overflow: hidden;
        }

        .card-image {
            position: relative;
            width: 100%;
            height: 180px;
        }

        .card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1rem 0.5rem;
        }

        .bookmark {
            position: static;
            width: 24px;
            height: 24px;
        }

        .bookmark img {
            width: 100%;
            height: 100%;
            color: black;
        }

        .title {
            font-weight: 600;
            font-size: 16px;
        }

        .nutrition-boxes {
            display: flex;
            justify-content: space-between;
            padding: 0 1rem 1rem;
        }

        .nutrient {
            background: #f1f1f1;
            border-radius: 6px;
            padding: 4px 8px;
            text-align: center;
            width: 45px;
        }

        .value {
            font-weight: bold;
            font-size: 14px;
        }

        .label {
            font-size: 12px;
            color: #555;
        }

</style>