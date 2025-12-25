import { PPTData } from '../types'

export interface Template {
  name: string
  description: string
  data: PPTData
}

export const defaultTheme = {
  name: '默认主题',
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    background: '#f9f9f9',
    text: '#2c3e50'
  },
  fonts: {
    title: 'Arial, sans-serif',
    body: 'Arial, sans-serif'
  }
}

export const businessTheme = {
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
}

export const educationTheme = {
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
}
