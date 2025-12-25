<template>
  <div class="ppt-renderer">
    <!-- 幻灯片导航 -->
    <div class="slide-navigation">
      <button @click="prevSlide" :disabled="currentSlideIndex === 0" class="nav-btn">
        ← 上一页
      </button>
      <span class="slide-info">幻灯片 {{ currentSlideIndex + 1 }} / {{ pptData.slides.length }}</span>
      <button @click="nextSlide" :disabled="currentSlideIndex === pptData.slides.length - 1" class="nav-btn">
        下一页 →
      </button>
    </div>

    <!-- 幻灯片容器 -->
    <div class="slides-container" ref="slidesContainer">
      <div 
        v-for="(slide, index) in pptData.slides" 
        :key="slide.id"
        :class="['slide', { active: index === currentSlideIndex }]"
        @click="goToSlide(index)"
      >
        <!-- 幻灯片内容 -->
        <div class="slide-content">
          <h2 v-if="slide.title" class="slide-title">{{ slide.title }}</h2>
          
          <!-- 渲染各种内容类型 -->
          <div 
            v-for="content in slide.content" 
            :key="getContentKey(content)"
            :class="['content-item', `content-${content.type}`]"
            :style="getContentStyle(content)"
          >
            <!-- 文本内容 -->
            <div v-if="content.type === 'text'" class="text-content" v-html="formatText(content.text)"></div>
            
            <!-- 图片内容 -->
            <img 
              v-else-if="content.type === 'image'" 
              :src="content.src" 
              :alt="content.alt || '图片'"
              class="image-content"
            />
            
            <!-- 形状内容 -->
            <div 
              v-else-if="content.type === 'shape'" 
              :class="['shape-content', `shape-${content.shape}`]"
            ></div>
            
            <!-- 图表内容 -->
            <div v-else-if="content.type === 'chart'" class="chart-content">
              <div class="chart-placeholder">
                {{ content.chartType }} 图表
              </div>
            </div>
            
            <!-- 表格内容 -->
            <table v-else-if="content.type === 'table'" class="table-content">
              <thead>
                <tr>
                  <th v-for="header in content.headers" :key="header">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in content.rows" :key="rowIndex">
                  <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <button @click="exportPPTX" class="export-btn">导出PPTX</button>
      <button @click="$emit('edit')" class="edit-btn">编辑</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PPTData, SlideContent } from '../../types/index'
import { PPTManager } from '../../index'

interface Props {
  pptData: PPTData
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: []
}>()

const currentSlideIndex = ref(0)
const slidesContainer = ref<HTMLElement>()

// PPT管理器实例
let pptManager: PPTManager | null = null

// 格式化文本（处理换行等）
const formatText = (text: string) => {
  return text.replace(/\n/g, '<br>')
}

// 获取内容元素的唯一键
const getContentKey = (content: SlideContent) => {
  return `${content.type}-${Math.random().toString(36).substr(2, 9)}`
}

// 获取内容元素的样式
const getContentStyle = (content: SlideContent) => {
  const position = content.position
  return {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${position.width}px`,
    height: `${position.height}px`
  }
}

// 幻灯片导航
const prevSlide = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
    scrollToCurrentSlide()
  }
}

const nextSlide = () => {
  if (currentSlideIndex.value < props.pptData.slides.length - 1) {
    currentSlideIndex.value++
    scrollToCurrentSlide()
  }
}

const goToSlide = (index: number) => {
  currentSlideIndex.value = index
  scrollToCurrentSlide()
}

const scrollToCurrentSlide = () => {
  if (slidesContainer.value) {
    const slideElements = slidesContainer.value.querySelectorAll('.slide')
    if (slideElements[currentSlideIndex.value]) {
      slideElements[currentSlideIndex.value].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }
}

// 导出PPTX
const exportPPTX = async () => {
  try {
    if (!pptManager) {
      pptManager = new PPTManager(props.pptData)
    }
    
    await pptManager.exportToPPTX('presentation.pptx')
    alert('PPTX文件导出成功！')
  } catch (error) {
    console.error('导出失败:', error)
    alert('导出失败，请查看控制台获取详细信息')
  }
}

onMounted(() => {
  // 初始化PPT管理器
  pptManager = new PPTManager(props.pptData)
})
</script>

<style scoped>
.ppt-renderer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  min-height: 400px;
}

.slide-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  gap: 15px;
  flex-shrink: 0;
}

.nav-btn {
  padding: 8px 16px;
  border: 1px solid #3498db;
  background: white;
  color: #3498db;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  min-width: 80px;
}

.nav-btn:hover:not(:disabled) {
  background: #3498db;
  color: white;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slide-info {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.slides-container {
  flex: 1;
  overflow-x: auto;
  padding: 20px;
  display: flex;
  gap: 20px;
  scroll-snap-type: x mandatory;
  align-items: center;
}

.slide {
  min-width: 800px;
  height: 450px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  scroll-snap-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.slide:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.slide.active {
  border: 2px solid #3498db;
}

.slide-content {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px;
}

.slide-title {
  text-align: center;
  margin: 20px 0 15px 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.content-item {
  position: absolute;
}

.text-content {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.image-content {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.shape-content {
  width: 100%;
  height: 100%;
  background: #3498db;
}

.shape-circle {
  border-radius: 50%;
}

.shape-triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecf0f1;
  border: 2px dashed #bdc3c7;
  color: #7f8c8d;
  font-weight: bold;
}

.table-content {
  width: 100%;
  border-collapse: collapse;
}

.table-content th,
.table-content td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table-content th {
  background-color: #f2f2f2;
}

.control-panel {
  padding: 20px;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.export-btn, .edit-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.export-btn {
  background: #27ae60;
  color: white;
}

.export-btn:hover {
  background: #219a52;
}

.edit-btn {
  background: #3498db;
  color: white;
}

.edit-btn:hover {
  background: #2980b9;
}
</style>