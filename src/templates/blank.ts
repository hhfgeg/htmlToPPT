import { Template } from './theme'
import { defaultTheme } from './theme'

export const blankTemplate: Template = {
  name: '空白模板',
  description: '空白演示文稿',
  data: {
    title: '空白演示文稿',
    author: '用户',
    description: '新建的演示文稿',
    theme: defaultTheme,
    slides: [
      {
        id: 'slide-1',
        type: 'title' as const,
        layout: 'title',
        title: '演示文稿标题',
        content: [],
        background: {
          type: 'color' as const,
          value: '#ffffff'
        }
      }
    ]
  }
}
