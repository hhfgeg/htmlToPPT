<template>
  <div class="app">
    <!-- 应用头部 -->
    <header class="app-header">
      <h1>HTML to PPT - Vue 3 演示</h1>
      <p>基于统一数据结构的PPT创建和导出工具</p>
    </header>

    <!-- 主内容区域 -->
    <main class="app-main">
      <!-- 模板选择 -->
      <div class="template-section">
        <h3>选择模板</h3>
        <div class="template-grid">
          <div 
            v-for="template in templates" 
            :key="template.name"
            :class="['template-card', { active: currentTemplate === template.name }]"
            @click="loadTemplate(template)"
          >
            <div class="template-preview">
              <div class="template-slide">
                <h4>{{ template.data.title }}</h4>
                <p>{{ template.description }}</p>
              </div>
            </div>
            <div class="template-info">
              <strong>{{ template.name }}</strong>
              <span>{{ template.data.slides.length }} 页</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 统一编辑器 -->
      <div class="unified-editor-section">
        <h3>PPT编辑器</h3>
        <PPTUnifiedEditor 
          :ppt-data="currentPPTData"
          @update:ppt-data="handlePPTUpdate"
          @save="handleSave"
          @export="handleExport"
        />
      </div>
    </main>

    <!-- 应用底部 -->
    <footer class="app-footer">
      <p>© 2024 HTML to PPT - 基于Vue 3的PPT工具</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import PPTUnifiedEditor from './components/PPTUnifiedEditor.vue'
import { PPTData, defaultTheme } from '../types/index'

// 当前PPT数据
const currentPPTData = ref<PPTData>({
  title: '默认演示文稿',
  author: '用户',
  description: '这是一个示例演示文稿',
  theme: defaultTheme,
  slides: [
    {
      id: 'slide-1',
      type: 'title',
      layout: 'title',
      title: '欢迎使用HTML to PPT',
      content: [
        {
          type: 'text',
          text: '基于Vue 3的PPT创建工具',
          style: {
            fontSize: 24,
            fontFamily: 'Arial, sans-serif',
            color: '#7f8c8d',
            fontWeight: 'normal',
            textAlign: 'center'
          },
          position: { x: 200, y: 300, width: 400, height: 40 }
        }
      ],
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    }
  ]
})

// 当前选择的模板
const currentTemplate = ref('default')

// 预定义模板
const templates = reactive([
  {
    name: '默认模板',
    description: '简洁的默认模板',
    data: {
      title: '默认演示文稿',
      author: '用户',
      theme: defaultTheme,
      slides: [
        {
          id: 'slide-1',
          type: 'title',
          layout: 'title',
          title: '演示文稿标题',
          content: [
            {
              type: 'text',
              text: '副标题或描述',
              style: {
                fontSize: 20,
                fontFamily: 'Arial, sans-serif',
                color: '#7f8c8d',
                fontWeight: 'normal',
                textAlign: 'center'
              },
              position: { x: 200, y: 320, width: 400, height: 30 }
            }
          ]
        }
      ]
    }
  },
  {
    name: '商务报告',
    description: '专业的商务报告模板',
    data: {
      title: '商务报告',
      author: '商务团队',
      theme: {
        name: '商务蓝',
        colors: {
          primary: '#2c3e50',
          secondary: '#3498db',
          accent: '#e74c3c',
          background: '#ecf0f1',
          text: '#2c3e50'
        },
        fonts: {
          title: 'Arial, sans-serif',
          body: 'Arial, sans-serif'
        }
      },
      slides: [
        {
          id: 'slide-1',
          type: 'title',
          layout: 'title',
          title: '商务报告',
          content: [
            {
              type: 'text',
              text: '季度业务分析',
              style: {
                fontSize: 24,
                fontFamily: 'Arial, sans-serif',
                color: '#7f8c8d',
                fontWeight: 'normal',
                textAlign: 'center'
              },
              position: { x: 200, y: 300, width: 400, height: 40 }
            }
          ]
        },
        {
          id: 'slide-2',
          type: 'content',
          layout: 'two-column',
          title: '业绩概览',
          content: [
            {
              type: 'text',
              text: '主要指标',
              style: {
                fontSize: 18,
                fontFamily: 'Arial, sans-serif',
                color: '#2c3e50',
                fontWeight: 'bold',
                textAlign: 'left'
              },
              position: { x: 50, y: 100, width: 300, height: 30 }
            },
            {
              type: 'text',
              text: '• 收入增长: +15%\n• 用户增长: +25%\n• 市场份额: 12%',
              style: {
                fontSize: 14,
                fontFamily: 'Arial, sans-serif',
                color: '#34495e',
                fontWeight: 'normal',
                textAlign: 'left',
                lineHeight: 1.5
              },
              position: { x: 50, y: 150, width: 300, height: 120 }
            }
          ]
        }
      ]
    }
  },
  {
    name: '教育课件',
    description: '适合教学使用的课件模板',
    data: {
      title: '教学课件',
      author: '教师',
      theme: {
        name: '教育绿',
        colors: {
          primary: '#27ae60',
          secondary: '#2ecc71',
          accent: '#e67e22',
          background: '#f9f9f9',
          text: '#2c3e50'
        },
        fonts: {
          title: 'Arial, sans-serif',
          body: 'Arial, sans-serif'
        }
      },
      slides: [
        {
          id: 'slide-1',
          type: 'title',
          layout: 'title',
          title: '课程名称',
          content: [
            {
              type: 'text',
              text: '第X章 课程内容',
              style: {
                fontSize: 20,
                fontFamily: 'Arial, sans-serif',
                color: '#7f8c8d',
                fontWeight: 'normal',
                textAlign: 'center'
              },
              position: { x: 200, y: 300, width: 400, height: 30 }
            }
          ]
        }
      ]
    }
  }
])

// 处理PPT数据更新
const handlePPTUpdate = (newData: PPTData) => {
  currentPPTData.value = newData
}

// 保存PPT
const handleSave = () => {
  console.log('保存PPT数据:', currentPPTData.value)
  // 这里可以添加保存到本地存储或服务器的逻辑
  alert('PPT已保存!')
}

// 导出PPT
const handleExport = () => {
  console.log('导出PPT:', currentPPTData.value)
  // 这里可以添加导出逻辑
  alert('PPT导出功能已触发!')
}

// 加载模板
const loadTemplate = (template: any) => {
  currentPPTData.value = template.data
  currentTemplate.value = template.name
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.app-header h1 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 2em;
  font-weight: 600;
}

.app-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 1em;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.unified-editor-section {
  flex: 1;
  background: white;
  overflow: hidden;
  min-height: 600px;
  border-top: 1px solid #e0e0e0;
}

.unified-editor-section h3 {
  text-align: center;
  padding: 20px;
  margin: 0;
  color: #2c3e50;
  font-size: 1.5em;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid #e0e0e0;
}

.template-section {
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.template-section h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.5em;
  font-weight: 600;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.template-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  border: 2px solid transparent;
}

.template-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.template-card.active {
  border-color: #3498db;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.template-preview {
  height: 200px;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.template-slide {
  text-align: center;
  color: #2c3e50;
}

.template-slide h4 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
}

.template-slide p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9em;
}

.template-info {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.template-info strong {
  color: #2c3e50;
}

.template-info span {
  color: #7f8c8d;
  font-size: 0.9em;
}

.app-footer {
  background: rgba(44, 62, 80, 0.9);
  color: white;
  text-align: center;
  padding: 20px;
}

.app-footer p {
  margin: 0;
  font-size: 0.9em;
}
</style>