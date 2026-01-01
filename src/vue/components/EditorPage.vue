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
import { PPTManager } from '../../index'

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
const handleExport = async () => {
  try {
    const pptManager = new PPTManager(pptData.value)
    await pptManager.exportToPPTX(pptData.value.title || '演示文稿')
  } catch (error) {
    console.error('导出失败:', error)
    alert('导出失败，请检查控制台错误信息')
  }
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
  background: #f8f9fa;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  padding: 6px 14px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.header-left h1 {
  margin: 0;
  color: #212529;
  font-size: 1.3em;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.header-right {
  display: flex;
  gap: 8px;
}

.save-btn, .export-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  justify-content: center;
}

.save-btn {
  background: #007bff;
  color: white;
}

.save-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.export-btn {
  background: #28a745;
  color: white;
}

.export-btn:hover {
  background: #1e7e34;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.editor-main {
  flex: 1;
  overflow: hidden;
}
</style>