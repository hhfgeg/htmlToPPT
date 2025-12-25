<template>
  <div class="editor-page">
    <!-- 编辑器头部 -->
    <header class="editor-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <span class="icon">←</span>
          返回首页
        </button>
        <h1>{{ pptData.title }}</h1>
      </div>
      
      <div class="header-right">
        <button class="save-btn" @click="handleSave">
          <span class="icon">💾</span>
          保存
        </button>
        <button class="export-btn" @click="handleExport">
          <span class="icon">📥</span>
          导出PPTX
        </button>
      </div>
    </header>

    <!-- 主编辑区域 -->
    <main class="editor-main">
      <PPTUnifiedEditor 
        :ppt-data="pptData"
        @update:ppt-data="handlePPTUpdate"
        @save="handleSave"
        @export="handleExport"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PPTUnifiedEditor from './PPTUnifiedEditor.vue'
import { PPTData, defaultTheme } from '../../types/index'

const router = useRouter()
const route = useRoute()

// PPT数据
const pptData = ref<PPTData>({
  title: '演示文稿',
  author: '用户',
  description: '',
  theme: defaultTheme,
  slides: []
})

// 组件挂载时加载模板数据
onMounted(() => {
  loadTemplateData()
})

// 加载模板数据
const loadTemplateData = () => {
  const templateParam = route.query.template
  if (templateParam && typeof templateParam === 'string') {
    try {
      const templateData = JSON.parse(templateParam)
      pptData.value = templateData
    } catch (error) {
      console.error('模板数据解析失败:', error)
      // 使用默认数据
      pptData.value = createDefaultPPT()
    }
  } else {
    // 如果没有模板参数，使用默认数据
    pptData.value = createDefaultPPT()
  }
}

// 创建默认PPT数据
const createDefaultPPT = (): PPTData => {
  return {
    title: '空白演示文稿',
    author: '用户',
    description: '新建的演示文稿',
    theme: defaultTheme,
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        layout: 'title',
        title: '演示文稿标题',
        content: [],
        background: {
          type: 'color',
          value: '#ffffff'
        }
      }
    ]
  }
}

// 处理PPT数据更新
const handlePPTUpdate = (newData: PPTData) => {
  pptData.value = newData
}

// 保存PPT
const handleSave = () => {
  console.log('保存PPT数据:', pptData.value)
  // 这里可以添加保存到本地存储或服务器的逻辑
  alert('PPT已保存!')
}

// 导出PPT
const handleExport = () => {
  console.log('导出PPT:', pptData.value)
  // 这里可以添加导出逻辑
  alert('PPT导出功能已触发!')
}

// 返回首页
const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.editor-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  padding: 8px 16px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #7f8c8d;
}

.header-left h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5em;
  font-weight: 600;
}

.header-right {
  display: flex;
  gap: 10px;
}

.save-btn, .export-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.save-btn {
  background: #3498db;
  color: white;
}

.save-btn:hover {
  background: #2980b9;
}

.export-btn {
  background: #27ae60;
  color: white;
}

.export-btn:hover {
  background: #219a52;
}

.editor-main {
  flex: 1;
  overflow: hidden;
}
</style>