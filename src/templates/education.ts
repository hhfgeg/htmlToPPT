import { Template } from './theme'
import { educationTheme } from './theme'

const educationTemplateData = {
  title: '教学课件',
  author: '教师',
  theme: educationTheme,
  slides: [
    {
      id: 'slide-1',
      type: 'title' as const,
      layout: 'title',
      title: '课程名称',
      content: [
        {
          type: 'text' as const,
          text: '第X章 课程内容',
          style: {
            fontSize: 20,
            fontFamily: 'Arial, sans-serif',
            color: '#7f8c8d',
            fontWeight: 'normal' as const,
            textAlign: 'center' as const
          },
          position: { x: 200, y: 300, width: 400, height: 30 }
        }
      ]
    }
  ]
}

export const educationTemplate: Template = {
  name: '教育课件',
  description: '适合教学使用的课件模板',
  data: educationTemplateData
}
