<template>
  <div class="template-home">
    <!-- 应用头部 -->
    <header class="app-header">
      <h1>HTML to PPT - Vue 3 演示</h1>
      <p>基于统一数据结构的PPT创建和导出工具</p>
    </header>

    <!-- 主内容区域 -->
    <main class="home-main">
      <!-- 欢迎区域 -->
      <div class="welcome-section">
        <h2>欢迎使用PPT编辑器</h2>
        <p>选择一个模板开始创建您的演示文稿</p>
      </div>

      <!-- 模板选择 -->
      <div class="template-section">
        <h3>选择模板</h3>
        <div class="template-grid">
          <div 
            v-for="template in templates" 
            :key="template.name"
            :class="['template-card', { active: currentTemplate === template.name }]"
            @click="selectTemplate(template)"
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
            <div class="template-actions">
              <button class="use-template-btn" @click.stop="useTemplate(template)">
                使用此模板
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速开始 -->
      <div class="quick-start-section">
        <h3>快速开始</h3>
        <button class="new-presentation-btn" @click="createNewPresentation">
          <span class="icon">➕</span>
          创建空白演示文稿
        </button>
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
import { useRouter } from 'vue-router'
import { PPTData, defaultTheme } from '../../types/index'

const router = useRouter()

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
    }
  },
  {
    name: '商务报告',
    description: '专业的商务报告模板',
    data: {
      title: '商务报告',
      author: '用户',
      theme: {
        name: '商务蓝',
        colors: {
          primary: '#3498db',
          secondary: '#2980b9',
          accent: '#e74c3c',
          background: '#f8f9fa',
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

// 选择模板
const selectTemplate = (template: any) => {
  currentTemplate.value = template.name
}

// 使用模板
const useTemplate = (template: any) => {
  router.push({
    path: '/editor',
    query: { 
      template: JSON.stringify(template.data)
    }
  })
}

// 创建空白演示文稿
const createNewPresentation = () => {
  const blankPPT: PPTData = {
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
  
  router.push({
    path: '/editor',
    query: { 
      template: JSON.stringify(blankPPT)
    }
  })
}
</script>

<style scoped>
.template-home {
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

.home-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.welcome-section h2 {
  font-size: 2.5em;
  margin-bottom: 10px;
  font-weight: 300;
}

.welcome-section p {
  font-size: 1.2em;
  opacity: 0.9;
}

.template-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.template-section h3 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 1.8em;
  font-weight: 600;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
}

.template-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  border: 3px solid transparent;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.template-card.active {
  border-color: #3498db;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.template-preview {
  height: 200px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.template-slide {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 250px;
}

.template-slide h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.2em;
}

.template-slide p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9em;
}

.template-info {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.template-info strong {
  display: block;
  color: #2c3e50;
  font-size: 1.1em;
  margin-bottom: 5px;
}

.template-info span {
  color: #7f8c8d;
  font-size: 0.9em;
}

.template-actions {
  padding: 15px 20px;
}

.use-template-btn {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.use-template-btn:hover {
  background: #2980b9;
}

.quick-start-section {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.quick-start-section h3 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.8em;
  font-weight: 600;
}

.new-presentation-btn {
  padding: 15px 30px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.new-presentation-btn:hover {
  background: #219a52;
}

.new-presentation-btn .icon {
  font-size: 1.2em;
}

.app-footer {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9em;
  flex-shrink: 0;
}
</style>