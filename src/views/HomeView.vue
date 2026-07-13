<template>
  <div class="home">
    <h1>Главная</h1>
    <div class="home_element">
      <div class="home_element_title">Новости</div>
    </div>
    <div class="home_element">
      <div class="home_element_title">Статьи</div>
    </div>
  </div>
</template>

<script setup>
// Логика главной страницы
</script>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 20px;
    overflow: hidden;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 0.02);
    border-radius: 5px;
    padding: 10px 20px;
}

.home h1 {
  font-weight: 600;
  color: white;
}

.home_element {
  background-color: white;
  border-radius: 5px;
}

.home_element_title {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
  width: 100%;
  height: 30px;
  border-radius: 5px 0 0 5p;
  padding: 5px 10px;
  font-weight: 800;
  font-size: 16px;
  text-transform: uppercase;
}
</style>