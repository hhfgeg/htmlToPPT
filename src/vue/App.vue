<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 主应用组件，使用路由系统
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
  overflow-y: auto;
}

.app {
  min-height: 100vh;
}
</style>