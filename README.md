# HTML to PPT

一个基于统一数据结构的PPT渲染和导出库，支持将PPT数据同时渲染为前端HTML页面和导出为PowerPoint文件。

## 特性

- 🎨 **统一数据结构**: 使用单一数据结构同时支持HTML渲染和PPT导出
- 🌐 **前端渲染**: 基于HTML/CSS的高质量前端渲染
- 📊 **PPT导出**: 使用PptxGenJS导出标准PowerPoint文件
- 🎯 **类型安全**: 完整的TypeScript类型定义
- 🔧 **可扩展**: 模块化设计，易于扩展新的内容类型
- 📱 **响应式**: 支持不同尺寸的展示需求

## 安装

```bash
npm install html-to-ppt
```

## 快速开始

### 1. 定义PPT数据结构

```typescript
import { PPTData } from 'html-to-ppt';

const myPPT: PPTData = {
  title: "我的演示文稿",
  author: "张三",
  theme: {
    name: "现代商务",
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
  },
  slides: [
    {
      id: "slide-1",
      type: "title",
      layout: "title",
      title: "欢迎",
      content: [
        {
          type: "text",
          text: "这是我的第一个幻灯片",
          style: {
            fontSize: 24,
            fontFamily: "Arial, sans-serif",
            color: "#7f8c8d",
            fontWeight: "normal",
            textAlign: "center"
          },
          position: { x: 200, y: 300, width: 400, height: 40 }
        }
      ]
    }
  ]
};
```

### 2. 渲染到HTML

```typescript
import { PPTManager } from 'html-to-ppt';

const pptManager = new PPTManager(myPPT);
const container = document.getElementById('ppt-container');
pptManager.renderToHTML(container);
```

### 3. 导出为PPTX

```typescript
// 导出为PPTX文件
await pptManager.exportToPPTX('我的演示文稿.pptx');
```

## 数据结构详解

### PPTData

| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 演示文稿标题 |
| author | string | 作者 |
| description | string | 描述（可选） |
| theme | ThemeConfig | 主题配置 |
| slides | Slide[] | 幻灯片数组 |

### Slide（幻灯片）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识符 |
| type | string | 幻灯片类型（title/content/image/chart/table/custom） |
| layout | string | 布局类型 |
| title | string | 幻灯片标题（可选） |
| content | SlideContent[] | 内容元素数组 |
| background | BackgroundConfig | 背景配置（可选） |
| animations | AnimationConfig[] | 动画配置（可选） |

### 内容类型

支持的内容类型：

- **TextContent**: 文本内容
- **ImageContent**: 图片内容
- **ShapeContent**: 形状内容（矩形、圆形、三角形、线条）
- **ChartContent**: 图表内容（柱状图、折线图、饼图、环形图）
- **TableContent**: 表格内容

## API 参考

### PPTManager

主管理类，提供统一的接口。

#### 构造函数
```typescript
new PPTManager(pptData: PPTData)
```

#### 方法

- `renderToHTML(container: HTMLElement): void` - 渲染到HTML容器
- `exportToPPTX(filename?: string): Promise<void>` - 导出为PPTX文件
- `getInfo(): object` - 获取演示文稿信息
- `updateData(newData: PPTData): void` - 更新数据
- `getData(): PPTData` - 获取当前数据

### HTMLRenderer

HTML渲染器，独立使用。

```typescript
import { HTMLRenderer } from 'html-to-ppt';

const renderer = new HTMLRenderer(pptData, container);
renderer.render();
renderer.goToSlide(0); // 跳转到指定幻灯片
```

### PPTXExporter

PPT导出器，独立使用。

```typescript
import { PPTXExporter } from 'html-to-ppt';

const exporter = new PPTXExporter(pptData);
await exporter.exportToPPTX('output.pptx');
```

## 示例

查看 `examples/demo.html` 文件获取完整的使用示例。

## 开发

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建
```bash
npm run build
```

### 类型检查
```bash
npm run typecheck
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基础PPT数据结构
- 实现HTML渲染和PPT导出功能
- 提供完整的TypeScript类型定义