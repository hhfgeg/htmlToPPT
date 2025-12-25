<template>
  <div class="template-home">
    <!-- 应用头部 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">📊</div>
          <div class="logo-text">
            <h1>HTML to PPT</h1>
            <p>智能演示文稿创建工具</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="help-btn">
            <span class="icon">❓</span>
            帮助
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="home-main">
      <!-- 英雄区域 -->
      <section class="hero-section">
        <div class="hero-content">
          <h1>创建专业的演示文稿</h1>
          <p class="hero-subtitle">基于Vue 3的现代化PPT创建工具，让您的演示更加出色</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">3+</span>
              <span class="stat-label">精美模板</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">∞</span>
              <span class="stat-label">自定义设计</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">一键</span>
              <span class="stat-label">导出PPTX</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-slide">
            <div class="slide-preview">
              <div class="slide-content">
                <h3>演示文稿标题</h3>
                <p>您的精彩内容从这里开始</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 模板选择 -->
      <section class="template-section">
        <div class="section-header">
          <h2>选择模板</h2>
          <p>从精心设计的模板开始，或创建空白演示文稿</p>
        </div>
        
        <div class="template-grid">
          <div 
            v-for="template in templates" 
            :key="template.name"
            :class="['template-card', { active: currentTemplate === template.name }]"
            @click="selectTemplate(template)"
          >
            <div class="template-preview">
              <div class="preview-badge">
                <span class="badge-text">{{ template.data.slides.length }} 页</span>
              </div>
              <div class="template-slide">
                <h4>{{ template.data.title }}</h4>
                <p>{{ template.description }}</p>
              </div>
            </div>
            <div class="template-info">
              <div class="template-meta">
                <strong>{{ template.name }}</strong>
                <span class="template-type">{{ getTemplateType(template.name) }}</span>
              </div>
            </div>
            <div class="template-actions">
              <button class="use-template-btn" @click.stop="useTemplate(template)">
                <span class="btn-icon">🚀</span>
                开始使用
              </button>
            </div>
          </div>
          
          <!-- 空白模板卡片 -->
          <div class="template-card blank-template" @click="createNewPresentation">
            <div class="template-preview blank-preview">
              <div class="blank-icon">
                <span>➕</span>
              </div>
              <div class="blank-text">
                <h4>空白演示文稿</h4>
                <p>从零开始创建</p>
              </div>
            </div>
            <div class="template-info">
              <div class="template-meta">
                <strong>空白模板</strong>
                <span class="template-type">自定义设计</span>
              </div>
            </div>
            <div class="template-actions">
              <button class="use-template-btn blank-btn" @click.stop="createNewPresentation">
                <span class="btn-icon">🎨</span>
                开始创作
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 特性介绍 -->
      <section class="features-section">
        <div class="section-header">
          <h2>为什么选择我们的工具</h2>
          <p>专为现代演示需求设计的强大功能</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>快速创建</h3>
            <p>基于模板快速生成专业演示文稿，节省设计时间</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>精美设计</h3>
            <p>现代化设计语言，让您的演示文稿脱颖而出</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>响应式布局</h3>
            <p>完美适配各种屏幕尺寸，确保最佳显示效果</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💾</div>
            <h3>一键导出</h3>
            <p>支持PPTX格式导出，兼容Microsoft PowerPoint</p>
          </div>
        </div>
      </section>

      <!-- 特性介绍区域 -->
      <section class="features-section">
        <div class="section-header">
          <h2>为什么选择我们</h2>
          <p>强大的功能让您的演示文稿创作更加高效</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">⚡</span>
            <h3>快速创建</h3>
            <p>基于模板快速创建专业演示文稿，节省大量设计时间</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🎨</span>
            <h3>精美设计</h3>
            <p>现代化的设计风格，让您的演示文稿更加吸引人</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">📱</span>
            <h3>响应式布局</h3>
            <p>完美适配各种屏幕尺寸，确保最佳观看体验</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">📤</span>
            <h3>一键导出</h3>
            <p>支持PPTX格式导出，方便分享和演示</p>
          </div>
        </div>
      </section>

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
      <div class="footer-content">
        <div class="footer-info">
          <div class="footer-logo">
            <span class="logo-icon">📊</span>
            <span class="logo-text">HTML to PPT</span>
          </div>
          <p>基于Vue 3的现代化演示文稿创建工具</p>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-link">使用指南</a>
          <a href="#" class="footer-link">关于我们</a>
          <a href="#" class="footer-link">联系支持</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 HTML to PPT - 让演示更简单</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { defaultTheme } from '../../types/index'
import { defaultTemplate, businessTemplate, educationTemplate, blankTemplate } from '../../templates'

const router = useRouter()

// 当前选择的模板
const currentTemplate = ref('默认模板')

const templates = reactive([
  defaultTemplate,
  businessTemplate,
  educationTemplate
])

// 选择模板
const selectTemplate = (template: any) => {
  currentTemplate.value = template.name
}

// 获取模板类型
const getTemplateType = (templateName: string) => {
  const typeMap: Record<string, string> = {
    '默认模板': '通用模板',
    '商务报告': '商务模板',
    '教育课件': '教育模板',
    '空白模板': '自定义设计'
  }
  return typeMap[templateName] || '通用模板'
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
  router.push({
    path: '/editor',
    query: { 
      template: JSON.stringify(blankTemplate.data)
    }
  })
}
</script>

<style scoped>
.template-home {
  min-height: 200vh; /* 强制页面高度为2倍视口高度 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: visible;
}

/* 头部样式 */
.app-header {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 15px 30px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  font-size: 2.5em;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.logo-text h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8em;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-text p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9em;
  font-weight: 500;
}

.help-btn {
  padding: 10px 20px;
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-btn:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

/* 主内容区域 */
.home-main {
  display: flex;
  flex-direction: column;
}

/* 英雄区域 */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 30px;
  color: white;
}

.hero-content h1 {
  font-size: 3.5em;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.3em;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 500px;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.8;
  font-weight: 500;
}

.hero-visual {
  position: relative;
}

.floating-slide {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.slide-preview {
  width: 300px;
  height: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.slide-content {
  text-align: center;
}

.slide-content h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.3em;
}

.slide-content p {
  color: #7f8c8d;
  font-size: 0.9em;
}

/* 模板选择区域 */
.template-section {
  background: white;
  padding: 80px 30px;
}

.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px;
}

.section-header h2 {
  font-size: 2.8em;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 700;
}

.section-header p {
  font-size: 1.2em;
  color: #7f8c8d;
  line-height: 1.6;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.template-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  border: 2px solid transparent;
  position: relative;
}

.template-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.template-card.active {
  border-color: #667eea;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}

.template-preview {
  height: 180px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.preview-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.9);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
  color: #667eea;
  backdrop-filter: blur(10px);
}

.template-slide {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0;
  padding: 25px;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.template-slide h4 {
  margin: 0 0 10px 0;
  color: white;
  font-size: 1.3em;
  font-weight: 600;
}

.template-slide p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9em;
}

.blank-template .template-preview {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.blank-icon {
  font-size: 3em;
  margin-bottom: 15px;
  color: white;
}

.blank-text h4 {
  color: white;
  margin-bottom: 5px;
  font-size: 1.3em;
}

.blank-text p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9em;
}

.template-info {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.template-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-meta strong {
  color: #2c3e50;
  font-size: 1.1em;
  font-weight: 600;
}

.template-type {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
}

.template-actions {
  padding: 20px;
}

.use-template-btn {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.use-template-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.blank-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.blank-btn:hover {
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
}

.btn-icon {
  font-size: 1.1em;
}

/* 特性介绍区域 */
.features-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 80px 30px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3em;
  margin-bottom: 20px;
  display: block;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.3em;
  font-weight: 600;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
  font-size: 0.95em;
}

/* 快速开始区域 */
.quick-start-section {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 30px;
  margin-top: 0;
  flex-shrink: 0;
}

.quick-start-section h3 {
  margin-bottom: 30px;
  color: white;
  font-size: 2.5em;
  font-weight: 600;
}

.new-presentation-btn {
  padding: 20px 45px;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  border: none;
  border-radius: 15px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.new-presentation-btn:hover {
  background: white;
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.new-presentation-btn .icon {
  font-size: 1.4em;
}

/* 底部样式 */
.app-footer {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 40px 30px 20px;
  flex-shrink: 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 30px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #2c3e50;
}

.footer-info p {
  margin: 5px 0 0 0;
  color: #7f8c8d;
  font-size: 0.9em;
}

.footer-links {
  display: flex;
  gap: 30px;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #764ba2;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  color: #7f8c8d;
  font-size: 0.9em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    margin: 40px auto;
  }
  
  .hero-content h1 {
    font-size: 2.5em;
  }
  
  .hero-stats {
    justify-content: center;
    gap: 20px;
  }
  
  .template-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
  }
}
</style>