<template>
  <div class="ppt-editor">
    <!-- 编辑器工具栏 -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <button @click="addSlide" class="tool-btn">添加幻灯片</button>
        <button @click="removeSlide" :disabled="!selectedSlide" class="tool-btn">删除幻灯片</button>
        <button @click="addText" :disabled="!selectedSlide" class="tool-btn">添加文本</button>
        <button @click="addImage" :disabled="!selectedSlide" class="tool-btn">添加图片</button>
      </div>
      
      <div class="toolbar-right">
        <button @click="savePPT" class="save-btn">保存</button>
        <button @click="$emit('cancel')" class="cancel-btn">取消</button>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-content">
      <!-- 幻灯片预览 -->
      <div class="slide-preview">
        <div 
          v-for="(slide, index) in localPPTData.slides" 
          :key="slide.id"
          :class="['slide-thumbnail', { active: index === selectedSlideIndex }]"
          @click="selectSlide(index)"
        >
          <div class="thumbnail-content">
            <h4>{{ slide.title || `幻灯片 ${index + 1}` }}</h4>
            <span class="slide-type">{{ slide.type }}</span>
          </div>
        </div>
      </div>

      <!-- 幻灯片编辑 -->
      <div class="slide-editor" v-if="selectedSlide">
        <div class="editor-panel">
          <h3>幻灯片属性</h3>
          
          <div class="form-group">
            <label>标题:</label>
            <input v-model="selectedSlide.title" type="text" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>类型:</label>
            <select v-model="selectedSlide.type" class="form-select">
              <option value="title">标题页</option>
              <option value="content">内容页</option>
              <option value="image">图片页</option>
              <option value="chart">图表页</option>
              <option value="table">表格页</option>
            </select>
          </div>

          <div class="content-list">
            <h4>内容元素</h4>
            <div 
              v-for="(content, contentIndex) in selectedSlide.content" 
              :key="contentIndex"
              class="content-item-editor"
            >
              <div class="content-header">
                <span>{{ content.type }} 元素</span>
                <button @click="removeContent(contentIndex)" class="remove-btn">删除</button>
              </div>
              
              <div class="content-properties">
                <!-- 文本内容编辑 -->
                <div v-if="content.type === 'text'">
                  <textarea 
                    v-model="content.text" 
                    class="text-input" 
                    rows="3"
                    placeholder="输入文本内容..."
                  ></textarea>
                  
                  <div class="style-controls">
                    <label>字体大小:</label>
                    <input v-model.number="content.style.fontSize" type="number" min="8" max="72" />
                    
                    <label>颜色:</label>
                    <input v-model="content.style.color" type="color" />
                    
                    <label>对齐:</label>
                    <select v-model="content.style.textAlign">
                      <option value="left">左对齐</option>
                      <option value="center">居中</option>
                      <option value="right">右对齐</option>
                    </select>
                  </div>
                </div>
                
                <!-- 图片内容编辑 -->
                <div v-else-if="content.type === 'image'">
                  <input 
                    v-model="content.src" 
                    type="text" 
                    class="form-input" 
                    placeholder="图片URL"
                  />
                  <input 
                    v-model="content.alt" 
                    type="text" 
                    class="form-input" 
                    placeholder="图片描述"
                  />
                </div>
                
                <!-- 位置控制 -->
                <div class="position-controls">
                  <h5>位置和大小</h5>
                  <div class="position-grid">
                    <div>
                      <label>X:</label>
                      <input v-model.number="content.position.x" type="number" />
                    </div>
                    <div>
                      <label>Y:</label>
                      <input v-model.number="content.position.y" type="number" />
                    </div>
                    <div>
                      <label>宽度:</label>
                      <input v-model.number="content.position.width" type="number" />
                    </div>
                    <div>
                      <label>高度:</label>
                      <input v-model.number="content.position.height" type="number" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 实时预览 -->
        <div class="live-preview">
          <h3>实时预览</h3>
          <div class="preview-slide">
            <h2 v-if="selectedSlide.title" class="preview-title">{{ selectedSlide.title }}</h2>
            
            <div 
              v-for="(content, contentIndex) in selectedSlide.content" 
              :key="contentIndex"
              class="preview-content"
              :style="{
                left: content.position.x + 'px',
                top: content.position.y + 'px',
                width: content.position.width + 'px',
                height: content.position.height + 'px'
              }"
            >
              <!-- 文本预览 -->
              <div v-if="content.type === 'text'" 
                   :style="{
                     fontSize: content.style.fontSize + 'px',
                     color: content.style.color,
                     textAlign: content.style.textAlign
                   }"
                   class="preview-text">
                {{ content.text }}
              </div>
              
              <!-- 图片预览 -->
              <img v-else-if="content.type === 'image'" 
                   :src="content.src" 
                   :alt="content.alt"
                   class="preview-image" />
              
              <!-- 形状预览 -->
              <div v-else-if="content.type === 'shape'" 
                   class="preview-shape"
                   :style="{ backgroundColor: content.style.fill }">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PPTData, Slide, SlideContent, TextContent, ImageContent, defaultTheme, defaultPosition } from '../../types/index'

interface Props {
  pptData: PPTData
}

interface Emits {
  (e: 'update:pptData', data: PPTData): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 本地PPT数据副本
const localPPTData = ref<PPTData>(JSON.parse(JSON.stringify(props.pptData)))

// 选中的幻灯片索引
const selectedSlideIndex = ref(0)

// 选中的幻灯片
const selectedSlide = computed(() => {
  return localPPTData.value.slides[selectedSlideIndex.value]
})

// 监听数据变化并通知父组件
watch(localPPTData, (newData) => {
  emit('update:pptData', newData)
}, { deep: true })

// 添加新幻灯片
const addSlide = () => {
  const newSlide: Slide = {
    id: `slide-${Date.now()}`,
    type: 'content',
    layout: 'default',
    title: '新幻灯片',
    content: []
  }
  
  localPPTData.value.slides.push(newSlide)
  selectedSlideIndex.value = localPPTData.value.slides.length - 1
}

// 删除当前幻灯片
const removeSlide = () => {
  if (localPPTData.value.slides.length > 1) {
    localPPTData.value.slides.splice(selectedSlideIndex.value, 1)
    if (selectedSlideIndex.value >= localPPTData.value.slides.length) {
      selectedSlideIndex.value = localPPTData.value.slides.length - 1
    }
  }
}

// 选择幻灯片
const selectSlide = (index: number) => {
  selectedSlideIndex.value = index
}

// 添加文本内容
const addText = () => {
  if (!selectedSlide.value) return
  
  const textContent: TextContent = {
    type: 'text',
    text: '请输入文本内容',
    style: {
      fontSize: 16,
      fontFamily: 'Arial, sans-serif',
      color: '#000000',
      fontWeight: 'normal',
      textAlign: 'left'
    },
    position: { ...defaultPosition }
  }
  
  selectedSlide.value.content.push(textContent)
}

// 添加图片内容
const addImage = () => {
  if (!selectedSlide.value) return
  
  const imageContent: ImageContent = {
    type: 'image',
    src: '',
    alt: '图片',
    style: {
      width: 200,
      height: 150
    },
    position: { ...defaultPosition }
  }
  
  selectedSlide.value.content.push(imageContent)
}

// 删除内容元素
const removeContent = (index: number) => {
  if (selectedSlide.value) {
    selectedSlide.value.content.splice(index, 1)
  }
}

// 保存PPT
const savePPT = () => {
  // 这里可以添加保存逻辑，比如保存到本地存储或发送到服务器
  alert('PPT已保存！')
}
</script>

<style scoped>
.ppt-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  min-height: 400px;
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
  gap: 8px;
}

.tool-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  min-width: 80px;
}

.tool-btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-btn {
  padding: 6px 16px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin-left: 8px;
}

.cancel-btn {
  padding: 6px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin-left: 8px;
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 300px;
}

.slide-preview {
  width: 200px;
  background: white;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  padding: 15px;
  flex-shrink: 0;
}

.slide-thumbnail {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8f9fa;
}

.slide-thumbnail:hover {
  border-color: #3498db;
}

.slide-thumbnail.active {
  border-color: #3498db;
  background: #e3f2fd;
}

.thumbnail-content h4 {
  margin: 0 0 4px 0;
  font-size: 13px;
  font-weight: 600;
}

.slide-type {
  font-size: 11px;
  color: #666;
  background: #eee;
  padding: 2px 6px;
  border-radius: 3px;
}

.slide-editor {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-panel {
  width: 300px;
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
}

.live-preview {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-input, .form-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.content-list {
  margin-top: 20px;
}

.content-item-editor {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  background: #fafafa;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.style-controls {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
}

.position-controls {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.position-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.position-grid div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.position-grid label {
  font-size: 12px;
  min-width: 30px;
}

.position-grid input {
  width: 60px;
  padding: 4px;
  font-size: 12px;
}

.preview-slide {
  width: 800px;
  height: 450px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  position: relative;
  margin: 0 auto;
}

.preview-title {
  text-align: center;
  margin: 30px 0;
  color: #2c3e50;
}

.preview-content {
  position: absolute;
  border: 1px dashed #ccc;
}

.preview-text {
  padding: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-shape {
  width: 100%;
  height: 100%;
}

.text-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  resize: vertical;
}
</style>