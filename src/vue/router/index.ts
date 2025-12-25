import { createRouter, createWebHistory } from 'vue-router'
import TemplateHome from '../components/TemplateHome.vue'
import EditorPage from '../components/EditorPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TemplateHome
  },
  {
    path: '/editor',
    name: 'Editor',
    component: EditorPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router