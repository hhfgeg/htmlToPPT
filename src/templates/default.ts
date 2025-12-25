import { Template } from './theme'
import { defaultTheme } from './theme'

const defaultTemplateData = {
  title: '默认演示文稿',
  author: '用户',
  theme: defaultTheme,
  slides: [
    {
      id: 'slide-1',
      type: 'title' as const,
      layout: 'title',
      title: '欢迎使用HTML to PPT',
      content: [
        {
          type: 'text' as const,
          text: '基于Vue 3的PPT创建工具',
          style: {
            fontSize: 24,
            fontFamily: 'Arial, sans-serif',
            color: '#7f8c8d',
            fontWeight: 'normal' as const,
            textAlign: 'center' as const
          },
          position: { x: 200, y: 300, width: 400, height: 40 }
        }
      ],
      background: {
        type: 'gradient' as const,
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    }
  ]
}

export const defaultTemplate: Template = {
  name: '默认模板',
  description: '简洁的默认模板',
  data: defaultTemplateData
}
