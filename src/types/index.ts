// 基础PPT数据结构
export interface PPTData {
  title: string;
  author: string;
  description?: string;
  theme: ThemeConfig;
  slides: Slide[];
}

// 主题配置
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    title: string;
    body: string;
  };
}

// 幻灯片
export interface Slide {
  id: string;
  type: 'title' | 'content' | 'image' | 'chart' | 'table' | 'custom';
  layout: string;
  title?: string;
  content: SlideContent[];
  background?: BackgroundConfig;
  animations?: AnimationConfig[];
}

// 幻灯片内容元素
export type SlideContent = TextContent | ImageContent | ShapeContent | ChartContent | TableContent;

// 文本内容
export interface TextContent {
  type: 'text';
  text: string;
  style: TextStyle;
  position: Position;
  animation?: AnimationConfig;
}

// 图片内容
export interface ImageContent {
  type: 'image';
  src: string;
  alt?: string;
  style: ImageStyle;
  position: Position;
  animation?: AnimationConfig;
}

// 形状内容
export interface ShapeContent {
  type: 'shape';
  shape: 'rectangle' | 'circle' | 'triangle' | 'line';
  style: ShapeStyle;
  position: Position;
  animation?: AnimationConfig;
}

// 图表内容
export interface ChartContent {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'doughnut';
  data: ChartData;
  style: ChartStyle;
  position: Position;
  animation?: AnimationConfig;
}

// 表格内容
export interface TableContent {
  type: 'table';
  headers: string[];
  rows: string[][];
  style: TableStyle;
  position: Position;
  animation?: AnimationConfig;
}

// 样式配置
export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold' | 'lighter';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
}

export interface ImageStyle {
  width: number;
  height: number;
  borderRadius?: number;
  opacity?: number;
}

export interface ShapeStyle {
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface ChartStyle {
  width: number;
  height: number;
  colors: string[];
}

export interface TableStyle {
  width: number;
  headerBackground: string;
  rowBackground: string;
  borderColor: string;
}

// 位置配置
export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 背景配置
export interface BackgroundConfig {
  type: 'color' | 'image' | 'gradient';
  value: string;
  opacity?: number;
}

// 动画配置
export interface AnimationConfig {
  type: 'fade' | 'slide' | 'zoom' | 'bounce';
  duration: number;
  delay?: number;
  direction?: 'in' | 'out';
}

// 图表数据
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

// 默认主题配置
export const defaultTheme: ThemeConfig = {
  name: "default",
  colors: {
    primary: "#2c3e50",
    secondary: "#3498db", 
    accent: "#e74c3c",
    background: "#ecf0f1",
    text: "#2c3e50"
  },
  fonts: {
    title: "Arial, sans-serif",
    body: "Arial, sans-serif"
  }
};

// 默认位置配置
export const defaultPosition: Position = {
  x: 50,
  y: 50,
  width: 300,
  height: 200
};

// 验证PPT数据结构的函数
export function validatePPTData(data: any): data is PPTData {
  if (!data || typeof data !== 'object') return false;
  if (!data.title || typeof data.title !== 'string') return false;
  if (!data.author || typeof data.author !== 'string') return false;
  if (!data.theme || typeof data.theme !== 'object') return false;
  if (!Array.isArray(data.slides)) return false;
  
  return data.slides.every((slide: any) => {
    if (!slide.id || typeof slide.id !== 'string') return false;
    if (!slide.type || !['title', 'content', 'image', 'chart', 'table', 'custom'].includes(slide.type)) return false;
    if (!Array.isArray(slide.content)) return false;
    return true;
  });
}