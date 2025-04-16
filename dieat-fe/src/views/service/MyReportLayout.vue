<template>
    <div class="breadcrumb">
        <RouterLink to="/" class="text-link">Home &gt; </RouterLink>
        <span>Service &gt; </span>
        <RouterLink to="/myReportLayout" class="text-link">나의 신고 내역</RouterLink>
    </div>
    <div class="wrapper">
        <h1>나의 신고 내역</h1>
        <ReportTable/>
    </div>
    <br>
    <br>
    <br>
    <br>
    <Footer></Footer>
</template>

<script setup>
    import Header from '@/components/common/Header.vue';
    import Footer from '@/components/common/Footer.vue';
    import ReportTable from './ReportTable.vue';

</script>

<style scoped>
    .breadcrumb {
        display: block;
        text-align: right;
        margin-top: 1rem;
        margin-right: 3rem;
        color: gray;
        flex-wrap: nowrap;
    }

    .text-link {
        color: inherit;
        text-decoration: none;
        font-weight: normal;
        cursor: pointer;
    }

    h1 {
        text-align: center;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center; /* 가운데 정렬 핵심 */
        margin-top: 2rem;
    }

    .table {
        width: 480px;
        height: auto;
    }
</style>