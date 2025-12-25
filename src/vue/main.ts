import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

// 创建Vue应用
const app = createApp(App)

// 使用路由
app.use(router)

// 全局配置（可选）
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue应用错误:', err)
  console.log('组件实例:', instance)
  console.log('错误信息:', info)
}

// 挂载应用到DOM
app.mount('#app')