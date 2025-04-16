<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 로고 및 소개 -->
      <div class="footer-section">
        <h2 class="footer-title">Dieat</h2>
        <p class="footer-desc">식단 관리를 더 쉽고 똑똑하게</p>
        <div class="social-icons">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-x-twitter"></i></a>
          <a href="#"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>

      <!-- 빠른 링크 -->
      <div class="footer-section">
        <h3>빠른 링크</h3>
        <ul>
          <li><a href="#">회사 소개</a></li>
          <li><a href="#">문의하기</a></li>
          <li><a href="#">커리어</a></li>
          <li><a href="#">파트너 되기</a></li>
        </ul>
      </div>

      <!-- 커뮤니티 -->
      <div class="footer-section">
        <h3>커뮤니티</h3>
        <ul>
          <li><a href="#">문서</a></li>
          <li><a href="#">지원</a></li>
          <li><a href="#">자주 묻는 질문</a></li>
          <li><a href="#">이용 약관</a></li>
        </ul>
      </div>

      <!-- 앱 다운로드 & 언어 -->
      <div class="footer-section">
        <h3>앱 다운로드</h3>
        <div class="store-buttons">
          <img src="@/assets/home_img/apple_store.png" alt="App Store" />
          <img src="@/assets/home_img/google_play.png" alt="Google Play" />
        </div>
        <div class="lang-select">
          <select>
            <option>Korean</option>
            <option>English</option>
          </select>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      © 2025 Dieat. All rights reserved.
    </div>
  </footer>
</template>

<script setup>

</script>

<style scoped>
.footer {
  background: #fff4e4;
  color: #3c3c3c;
  padding: 3rem 2rem 1rem;
  font-size: 0.9rem;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
}

.footer-section {
  flex: 1 1 200px;
  min-width: 200px;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.footer-desc {
  margin: 0.5rem 0 1rem;
  opacity: 0.8;
}

.footer-section h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  /* color: #fff; */
  color: #3c3c3c;
  text-decoration: none;
  opacity: 0.8;
}

.footer-section a:hover {
  opacity: 1;
  text-decoration: underline;
}

.social-icons a {
  margin-right: 1rem;
  color: #3c3c3c;
  font-size: 1.2rem;
  opacity: 0.8;
}

.social-icons a:hover {
  opacity: 1;
}

.store-buttons img {
  height: 32px;
  margin-right: 1rem;
  border-radius: 8px;
  /* background: white;
  padding: 0.25rem; */
}

.lang-select select {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 50px;
  padding-top: 1rem;
  border-top: 1px solid #3c3c3c;
  font-size: 18px;
  opacity: 0.6;
}
</style>
