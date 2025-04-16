<template>
    <div class="report-table-container">
        <table>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>신고 콘텐츠</th>
                    <th>일시</th>
                    <th>처리 상태</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in reports" :key="index">
                    <td>{{ item.no }}</td>
                    <td>{{ item.content }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.status }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const reports = ref([
        { no: 1, content: '성공기 게시글 댓글', date: '2024-11-23', status: '승인' },
        { no: 2, content: '자유 게시글', date: '2024-12-15', status: '승인' },
        { no: 3, content: '회원 등록 음식', date: '2025-01-03', status: '거절' },
        { no: 4, content: '회원 등록 음식', date: '2025-03-31', status: '승인' }
    ])

</script>

<style scoped>
    .report-table-container {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 24px 32px;
        width: 800px;
        height: auto;
        margin: 40px auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }

    thead {
        border-bottom: 2px solid #666;
        font-weight: bold;
    }

    th, td {
        padding: 12px 8px;
    }

    tbody tr {
        margin-top: 12px;
        background: #fff;
    }

    tbody td {
        background-color: white;
        padding: 16px;
        text-align: center;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
        border-radius: 8px;
    }
</style>