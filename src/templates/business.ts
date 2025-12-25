import { Template } from './theme'
import { businessTheme } from './theme'

const businessTemplateData = {
  title: '商务报告',
  author: '用户',
  theme: businessTheme,
  slides: [
    {
      id: 'slide-1',
      type: 'title' as const,
      layout: 'title',
      title: '商务报告',
      content: [
        {
          type: 'text' as const,
          text: '季度业务分析',
          style: {
            fontSize: 24,
            fontFamily: 'Arial, sans-serif',
            color: '#7f8c8d',
            fontWeight: 'normal' as const,
            textAlign: 'center' as const
          },
          position: { x: 200, y: 300, width: 400, height: 40 }
        }
      ]
    },
    {
      id: 'slide-2',
      type: 'content' as const,
      layout: 'two-column',
      title: '业绩概览',
      content: [
        {
          type: 'text' as const,
          text: '主要指标',
          style: {
            fontSize: 18,
            fontFamily: 'Arial, sans-serif',
            color: '#2c3e50',
            fontWeight: 'bold' as const,
            textAlign: 'left' as const
          },
          position: { x: 50, y: 100, width: 300, height: 30 }
        },
        {
          type: 'text' as const,
          text: '• 收入增长: +15%\n• 用户增长: +25%\n• 市场份额: 12%',
          style: {
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            color: '#34495e',
            fontWeight: 'normal' as const,
            textAlign: 'left' as const,
            lineHeight: 1.5
          },
          position: { x: 50, y: 150, width: 300, height: 120 }
        }
      ]
    }
  ]
}

export const businessTemplate: Template = {
  name: '商务报告',
  description: '专业的商务报告模板',
  data: businessTemplateData
}
