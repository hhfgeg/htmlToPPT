<template>
  <div class="ppt-unified-editor">
    <!-- 顶部工具栏 -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <!-- 幻灯片管理 -->
        <button @click="addSlide" class="tool-btn" title="添加幻灯片">
          <span class="icon">➕</span> 添加幻灯片
        </button>
        <button @click="removeSlide" :disabled="!selectedSlide" class="tool-btn" title="删除当前幻灯片">
          <span class="icon">🗑️</span> 删除
        </button>
        
        <!-- 内容编辑 -->
        <button @click="addText" :disabled="!selectedSlide" class="tool-btn" title="添加文本">
          <span class="icon">📝</span> 文本
        </button>
        <button @click="addImage" :disabled="!selectedSlide" class="tool-btn" title="添加图片">
          <span class="icon">🖼️</span> 图片
        </button>
        <button @click="addShape" :disabled="!selectedSlide" class="tool-btn" title="添加形状">
          <span class="icon">🔷</span> 形状
        </button>
        
        <!-- 导航控制 -->
        <div class="nav-controls">
          <button @click="prevSlide" :disabled="currentSlideIndex === 0" class="nav-btn" title="上一页">
            ←
          </button>
          <span class="slide-counter">
            {{ currentSlideIndex + 1 }} / {{ pptData.slides.length }}
          </span>
          <button @click="nextSlide" :disabled="currentSlideIndex === pptData.slides.length - 1" class="nav-btn" title="下一页">
            →
          </button>
        </div>
      </div>
      
      <div class="toolbar-right">
      </div>
    </div>

    <!-- 主编辑区域 -->
    <div class="editor-main">
      <!-- 幻灯片预览侧边栏 -->
      <div class="slide-sidebar">
        <h4>幻灯片列表</h4>
        <div class="slide-thumbnails">
          <div 
            v-for="(slide, index) in pptData.slides" 
            :key="slide.id"
            :class="['slide-thumbnail', { active: index === currentSlideIndex }]"
            @click="selectSlide(index)"
          >
            <div class="thumbnail-preview">
              <div class="slide-miniature">
                <div class="mini-title">{{ slide.title || `幻灯片 ${index + 1}` }}</div>
                <div class="mini-content">
                  <span v-if="slide.content.length > 0">{{ slide.content.length }} 个元素</span>
                  <span v-else>空幻灯片</span>
                </div>
              </div>
            </div>
            <div class="slide-info">
              <span class="slide-number">{{ index + 1 }}</span>
              <span class="slide-type">{{ slide.type }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 幻灯片编辑区域 -->
      <div class="slide-editor-area">
        <!-- 幻灯片显示 -->
        <div class="slide-display">
          <div 
            v-for="(slide, index) in pptData.slides" 
            :key="slide.id"
            :class="['slide-container', { active: index === currentSlideIndex }]"
            v-show="index === currentSlideIndex"
          >
            <div class="slide-content" :style="getSlideStyle(slide)">
              <h2 v-if="slide.title" class="slide-title">{{ slide.title }}</h2>
              
              <!-- 可编辑的内容元素 -->
              <div 
                v-for="(content, contentIndex) in slide.content" 
                :key="getContentKey(content, contentIndex)"
                :class="['content-element', { selected: selectedContentIndex === contentIndex, dragging: isDragging && selectedContentIndex === contentIndex }]"
                :style="getContentStyle(content)"
                @click="selectContent(contentIndex)"
                @mousedown="startDrag($event, contentIndex)"
              >
                <!-- 文本内容 -->
                <div v-if="content.type === 'text'" class="text-element">
                  <div v-if="isEditingContent && selectedContentIndex === contentIndex" class="edit-mode">
                    <textarea 
                      v-model="content.text" 
                      class="text-edit-input"
                      @blur="finishEditing"
                      @keydown.enter="finishEditing"
                      autofocus
                    ></textarea>
                  </div>
                  <div v-else class="view-mode" v-html="formatText(content.text)"></div>
                </div>
                
                <!-- 图片内容 -->
                <div v-else-if="content.type === 'image'" class="image-element">
                  <img :src="content.src" :alt="content.alt || '图片'" />
                </div>
                
                <!-- 形状内容 -->
                <div v-else-if="content.type === 'shape'" class="shape-element">
                  <div :class="['shape', `shape-${content.shape}`]"></div>
                </div>
                
                <!-- 其他内容类型 -->
                <div v-else class="other-element">
                  {{ content.type }} 内容
                </div>
                
                <!-- 内容控制按钮 -->
                <div v-if="selectedContentIndex === contentIndex" class="content-controls">
                  <button @click="editContent(contentIndex)" class="control-btn edit-btn">✏️</button>
                  <button @click="removeContent(contentIndex)" class="control-btn delete-btn">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 属性面板 -->
        <div class="properties-panel" v-if="selectedSlide">
          <h4>属性设置</h4>
          
          <!-- 幻灯片属性 -->
          <div class="property-group">
            <label>幻灯片标题:</label>
            <input v-model="selectedSlide.title" type="text" class="property-input" />
          </div>
          
          <div class="property-group">
            <label>幻灯片类型:</label>
            <select v-model="selectedSlide.type" class="property-select">
              <option value="title">标题页</option>
              <option value="content">内容页</option>
              <option value="image">图片页</option>
            </select>
          </div>
          
          <!-- 内容属性 -->
          <div v-if="selectedContent" class="property-group">
            <h5>内容属性</h5>
            
            <!-- 文本样式 -->
            <div v-if="selectedContent.type === 'text'">
              <div class="style-control">
                <label>字体大小:</label>
                <input v-model.number="selectedContent.style.fontSize" type="number" min="8" max="72" />
              </div>
              <div class="style-control">
                <label>颜色:</label>
                <input v-model="selectedContent.style.color" type="color" />
              </div>
              <div class="style-control">
                <label>对齐:</label>
                <select v-model="selectedContent.style.textAlign">
                  <option value="left">左对齐</option>
                  <option value="center">居中</option>
                  <option value="right">右对齐</option>
                </select>
              </div>
            </div>
            
            <!-- 位置调整 -->
            <div class="position-controls">
              <label>位置:</label>
              <div class="position-inputs">
                <input v-model.number="selectedContent.position.x" type="number" placeholder="X" />
                <input v-model.number="selectedContent.position.y" type="number" placeholder="Y" />
                <input v-model.number="selectedContent.position.width" type="number" placeholder="宽" />
                <input v-model.number="selectedContent.position.height" type="number" placeholder="高" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { PPTData, Slide, SlideContent, defaultTheme } from '../../types/index'

interface Props {
  pptData: PPTData
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:pptData': [PPTData]
}>()

// 当前选中的幻灯片索引
const currentSlideIndex = ref(0)
// 当前选中的内容索引
const selectedContentIndex = ref<number | null>(null)
// 是否正在编辑内容
const isEditingContent = ref(false)
// 是否正在拖动
const isDragging = ref(false)
// 拖动相关变量
const dragStartX = ref(0)
const dragStartY = ref(0)
const initialX = ref(0)
const initialY = ref(0)

// 计算当前选中的幻灯片
const selectedSlide = computed(() => {
  return props.pptData.slides[currentSlideIndex.value]
})

// 计算当前选中的内容
const selectedContent = computed(() => {
  if (selectedContentIndex.value === null || !selectedSlide.value) return null
  return selectedSlide.value.content[selectedContentIndex.value]
})

// 幻灯片导航
const prevSlide = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
    selectedContentIndex.value = null
  }
}

const nextSlide = () => {
  if (currentSlideIndex.value < props.pptData.slides.length - 1) {
    currentSlideIndex.value++
    selectedContentIndex.value = null
  }
}

const selectSlide = (index: number) => {
  currentSlideIndex.value = index
  selectedContentIndex.value = null
}

// 内容选择
const selectContent = (index: number) => {
  selectedContentIndex.value = index
  isEditingContent.value = false
}

const editContent = (index: number) => {
  selectedContentIndex.value = index
  isEditingContent.value = true
}

const finishEditing = () => {
  isEditingContent.value = false
}

// 幻灯片管理
const addSlide = () => {
  const newSlide: Slide = {
    id: `slide-${Date.now()}`,
    type: 'content',
    layout: 'title',
    title: '新幻灯片',
    content: [],
    background: {
      type: 'color',
      value: '#ffffff'
    }
  }
  
  const newData = { ...props.pptData }
  newData.slides.push(newSlide)
  emit('update:pptData', newData)
  currentSlideIndex.value = newData.slides.length - 1
}

const removeSlide = () => {
  if (props.pptData.slides.length <= 1) return
  
  const newData = { ...props.pptData }
  newData.slides.splice(currentSlideIndex.value, 1)
  emit('update:pptData', newData)
  
  if (currentSlideIndex.value >= newData.slides.length) {
    currentSlideIndex.value = newData.slides.length - 1
  }
}

// 内容管理
const addText = () => {
  if (!selectedSlide.value) return
  
  const newContent: SlideContent = {
    type: 'text',
    text: '新文本内容',
    style: {
      fontSize: 16,
      fontFamily: 'Arial, sans-serif',
      color: '#000000',
      fontWeight: 'normal',
      textAlign: 'left'
    },
    position: { x: 50, y: 100, width: 300, height: 40 }
  }
  
  const newData = { ...props.pptData }
  newData.slides[currentSlideIndex.value].content.push(newContent)
  emit('update:pptData', newData)
  selectedContentIndex.value = newData.slides[currentSlideIndex.value].content.length - 1
}

const addImage = () => {
  if (!selectedSlide.value) return
  
  const newContent: SlideContent = {
    type: 'image',
    src: 'https://via.placeholder.com/300x200',
    alt: '示例图片',
    style: {
      width: 300,
      height: 200
    },
    position: { x: 50, y: 150, width: 300, height: 200 }
  }
  
  const newData = { ...props.pptData }
  newData.slides[currentSlideIndex.value].content.push(newContent)
  emit('update:pptData', newData)
  selectedContentIndex.value = newData.slides[currentSlideIndex.value].content.length - 1
}

const addShape = () => {
  if (!selectedSlide.value) return
  
  const newContent: SlideContent = {
    type: 'shape',
    shape: 'rectangle',
    style: {
      width: 200,
      height: 150,
      fill: '#3498db',
      stroke: '#2980b9',
      strokeWidth: 2
    },
    position: { x: 100, y: 100, width: 200, height: 150 }
  }
  
  const newData = { ...props.pptData }
  newData.slides[currentSlideIndex.value].content.push(newContent)
  emit('update:pptData', newData)
  selectedContentIndex.value = newData.slides[currentSlideIndex.value].content.length - 1
}

const removeContent = (index: number) => {
  if (!selectedSlide.value) return
  
  const newData = { ...props.pptData }
  newData.slides[currentSlideIndex.value].content.splice(index, 1)
  emit('update:pptData', newData)
  selectedContentIndex.value = null
}

// 样式处理
const getSlideStyle = (slide: Slide) => {
  if (!slide.background) return { background: '#ffffff' }
  
  return {
    background: slide.background.type === 'color' 
      ? slide.background.value 
      : slide.background.type === 'gradient'
      ? `linear-gradient(135deg, ${slide.background.value})`
      : '#ffffff'
  }
}

const getContentStyle = (content: SlideContent) => {
  const style: any = {
    left: `${content.position.x}px`,
    top: `${content.position.y}px`,
    width: `${content.position.width}px`,
    height: `${content.position.height}px`
  }
  
  if (content.type === 'text') {
    Object.assign(style, {
      fontSize: `${content.style.fontSize}px`,
      fontFamily: content.style.fontFamily,
      color: content.style.color,
      fontWeight: content.style.fontWeight,
      textAlign: content.style.textAlign
    })
  }
  
  return style
}

const formatText = (text: string) => {
  return text.replace(/\n/g, '<br>')
}

const getContentKey = (content: SlideContent, index: number) => {
  return `${content.type}-${index}-${Date.now()}`
}

// 拖动功能
const startDrag = (event: MouseEvent, contentIndex: number) => {
  if (isEditingContent.value) return
  
  event.preventDefault()
  selectedContentIndex.value = contentIndex
  isDragging.value = true
  
  dragStartX.value = event.clientX
  dragStartY.value = event.clientY
  
  const content = selectedSlide.value?.content[contentIndex]
  if (content) {
    initialX.value = content.position.x
    initialY.value = content.position.y
  }
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value || selectedContentIndex.value === null) return
  
  const dx = event.clientX - dragStartX.value
  const dy = event.clientY - dragStartY.value
  
  const newData = { ...props.pptData }
  const content = newData.slides[currentSlideIndex.value].content[selectedContentIndex.value]
  
  content.position.x = Math.max(0, initialX.value + dx)
  content.position.y = Math.max(0, initialY.value + dy)
  
  emit('update:pptData', newData)
}

const endDrag = () => {
  isDragging.value = false
}

// 添加全局事件监听
onMounted(() => {
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', endDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
})
</script>

<style scoped>
.ppt-unified-editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
}

.tool-btn:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #3498db;
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 15px;
}

.nav-btn {
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.nav-btn:hover:not(:disabled) {
  background: #3498db;
  color: white;
}

.slide-counter {
  font-weight: 600;
  color: #2c3e50;
  font-size: 13px;
}

.toolbar-right {
  display: flex;
  gap: 10px;
}

.export-btn, .save-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.export-btn {
  background: #3498db;
  color: white;
}

.save-btn {
  background: #27ae60;
  color: white;
}

.editor-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.slide-sidebar {
  width: 220px;
  background: white;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  padding: 15px;
  flex-shrink: 0;
}

.slide-sidebar h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
}

.slide-thumbnails {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slide-thumbnail {
  padding: 10px;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8f9fa;
}

.slide-thumbnail:hover {
  border-color: #3498db;
  background: #e3f2fd;
}

.slide-thumbnail.active {
  border-color: #3498db;
  background: #e3f2fd;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
}

.thumbnail-preview {
  margin-bottom: 8px;
}

.slide-miniature {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  min-height: 60px;
}

.mini-title {
  font-size: 12px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.mini-content {
  font-size: 10px;
  color: #7f8c8d;
}

.slide-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #666;
}

.slide-editor-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.slide-display {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: #ecf0f1;
}

.slide-container {
  width: 800px;
  height: 450px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.slide-content {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 30px;
}

.slide-title {
  text-align: center;
  margin: 20px 0 30px 0;
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
}

.content-element {
  position: absolute;
  border: 2px solid transparent;
  transition: all 0.3s;
  cursor: pointer;
}

.content-element:hover {
  border-color: #3498db;
}

.content-element.selected {
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.3);
}

.content-element.dragging {
  cursor: move;
  opacity: 0.8;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.text-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-edit-input {
  width: 100%;
  height: 100%;
  border: 1px solid #3498db;
  border-radius: 4px;
  padding: 8px;
  font-size: inherit;
  font-family: inherit;
  resize: none;
}

.image-element img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shape {
  width: 100%;
  height: 100%;
  background: #3498db;
}

.shape-rectangle {
  border-radius: 4px;
}

.shape-circle {
  border-radius: 50%;
}

.content-controls {
  position: absolute;
  top: -30px;
  right: 0;
  display: flex;
  gap: 4px;
}

.control-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-size: 12px;
}

.edit-btn {
  background: #3498db;
  color: white;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.properties-panel {
  width: 280px;
  background: white;
  border-left: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
  flex-shrink: 0;
}

.properties-panel h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.property-group {
  margin-bottom: 20px;
}

.property-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
}

.property-input, .property-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.style-control {
  margin-bottom: 10px;
}

.style-control label {
  font-size: 12px;
  font-weight: normal;
}

.position-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.position-inputs input {
  width: 100%;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 2px;
  font-size: 11px;
}

.icon {
  font-size: 14px;
}
</style>