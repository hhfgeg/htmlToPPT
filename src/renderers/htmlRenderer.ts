import { PPTData, Slide, SlideContent, TextContent, ImageContent, ShapeContent, ChartContent, TableContent, defaultTheme } from '../types/index';

export class HTMLRenderer {
  private pptData: PPTData;
  private container: HTMLElement;

  constructor(pptData: PPTData, container: HTMLElement) {
    this.pptData = pptData;
    this.container = container;
  }

  // 渲染整个PPT
  public render(): void {
    this.container.innerHTML = '';
    this.applyTheme();
    
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'ppt-slides-container';
    
    this.pptData.slides.forEach((slide, index) => {
      const slideElement = this.renderSlide(slide, index);
      slidesContainer.appendChild(slideElement);
    });
    
    this.container.appendChild(slidesContainer);
  }

  // 应用主题样式
  private applyTheme(): void {
    const theme = this.pptData.theme || defaultTheme;
    const style = document.createElement('style');
    
    style.textContent = `
      .ppt-slides-container {
        width: 100%;
        height: 100vh;
        background: ${theme.colors.background};
        font-family: ${theme.fonts.body};
        overflow: auto;
      }
      
      .ppt-slide {
        width: 960px;
        height: 540px;
        margin: 20px auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
      }
      
      .slide-title {
        font-family: ${theme.fonts.title};
        color: ${theme.colors.primary};
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        margin: 40px 0 20px 0;
      }
      
      .slide-content {
        position: absolute;
      }
      
      .text-content {
        font-family: inherit;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      
      .image-content {
        object-fit: contain;
      }
      
      .shape-content {
        position: absolute;
      }
      
      .chart-container {
        position: relative;
      }
      
      .table-content {
        border-collapse: collapse;
        width: 100%;
      }
      
      .table-content th,
      .table-content td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      
      .table-content th {
        background-color: #f2f2f2;
      }
    `;
    
    document.head.appendChild(style);
  }

  // 渲染单个幻灯片
  private renderSlide(slide: Slide, _index: number): HTMLElement {
    const slideElement = document.createElement('div');
    slideElement.className = 'ppt-slide';
    slideElement.id = `slide-${slide.id}`;
    
    // 应用背景
    this.applySlideBackground(slideElement, slide);
    
    // 渲染标题
    if (slide.title) {
      const titleElement = document.createElement('h1');
      titleElement.className = 'slide-title';
      titleElement.textContent = slide.title;
      slideElement.appendChild(titleElement);
    }
    
    // 渲染内容
    slide.content.forEach(content => {
      const contentElement = this.renderContent(content);
      if (contentElement) {
        slideElement.appendChild(contentElement);
      }
    });
    
    return slideElement;
  }

  // 应用幻灯片背景
  private applySlideBackground(slideElement: HTMLElement, slide: Slide): void {
    if (!slide.background) return;
    
    const { type, value, opacity } = slide.background;
    
    switch (type) {
      case 'color':
        slideElement.style.background = value;
        break;
      case 'gradient':
        slideElement.style.background = value;
        break;
      case 'image':
        slideElement.style.backgroundImage = `url(${value})`;
        slideElement.style.backgroundSize = 'cover';
        slideElement.style.backgroundPosition = 'center';
        break;
    }
    
    if (opacity !== undefined) {
      slideElement.style.opacity = opacity.toString();
    }
  }

  // 渲染内容元素
  private renderContent(content: SlideContent): HTMLElement | null {
    switch (content.type) {
      case 'text':
        return this.renderTextContent(content);
      case 'image':
        return this.renderImageContent(content);
      case 'shape':
        return this.renderShapeContent(content);
      case 'chart':
        return this.renderChartContent(content);
      case 'table':
        return this.renderTableContent(content);
      default:
        return null;
    }
  }

  // 渲染文本内容
  private renderTextContent(content: TextContent): HTMLElement {
    const element = document.createElement('div');
    element.className = 'slide-content text-content';
    
    // 应用位置
    this.applyPosition(element, content.position);
    
    // 应用样式
    const { fontSize, fontFamily, color, fontWeight, textAlign, lineHeight } = content.style;
    element.style.fontSize = `${fontSize}px`;
    element.style.fontFamily = fontFamily;
    element.style.color = color;
    element.style.fontWeight = fontWeight;
    element.style.textAlign = textAlign;
    
    if (lineHeight) {
      element.style.lineHeight = lineHeight.toString();
    }
    
    element.textContent = content.text;
    
    return element;
  }

  // 渲染图片内容
  private renderImageContent(content: ImageContent): HTMLElement {
    const element = document.createElement('img');
    element.className = 'slide-content image-content';
    
    // 应用位置
    this.applyPosition(element, content.position);
    
    // 应用样式
    const { width, height, borderRadius, opacity } = content.style;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    
    if (borderRadius) {
      element.style.borderRadius = `${borderRadius}px`;
    }
    
    if (opacity) {
      element.style.opacity = opacity.toString();
    }
    
    element.src = content.src;
    if (content.alt) {
      element.alt = content.alt;
    }
    
    return element;
  }

  // 渲染形状内容
  private renderShapeContent(content: ShapeContent): HTMLElement {
    const element = document.createElement('div');
    element.className = 'slide-content shape-content';
    
    // 应用位置
    this.applyPosition(element, content.position);
    
    // 应用样式
    const { width, height, fill, stroke, strokeWidth } = content.style;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.backgroundColor = fill;
    
    if (stroke) {
      element.style.border = `${strokeWidth || 1}px solid ${stroke}`;
    }
    
    // 应用形状
    switch (content.shape) {
      case 'circle':
        element.style.borderRadius = '50%';
        break;
      case 'triangle':
        element.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        break;
      case 'line':
        element.style.height = '2px';
        element.style.transform = 'rotate(0deg)';
        break;
    }
    
    return element;
  }

  // 渲染图表内容
  private renderChartContent(content: ChartContent): HTMLElement {
    const container = document.createElement('div');
    container.className = 'slide-content chart-container';
    
    // 应用位置
    this.applyPosition(container, content.position);
    
    // 创建简单的SVG图表（实际项目中可以使用Chart.js等库）
    const svg = this.createSimpleChartSVG(content);
    container.appendChild(svg);
    
    return container;
  }

  // 创建简单SVG图表
  private createSimpleChartSVG(content: ChartContent): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const { width, height } = content.style;
    
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    
    // 这里实现简单的图表渲染逻辑
    // 实际项目中应该使用专业的图表库
    const data = content.data;
    const maxValue = Math.max(...data.datasets[0].data);
    
    data.datasets[0].data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 40);
      const barWidth = (width - 60) / data.datasets[0].data.length;
      const x = 30 + index * barWidth;
      const y = height - 20 - barHeight;
      
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', (barWidth - 5).toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', content.style.colors[index % content.style.colors.length]);
      
      svg.appendChild(rect);
    });
    
    return svg;
  }

  // 渲染表格内容
  private renderTableContent(content: TableContent): HTMLElement {
    const container = document.createElement('div');
    container.className = 'slide-content';
    
    // 应用位置
    this.applyPosition(container, content.position);
    
    const table = document.createElement('table');
    table.className = 'table-content';
    
    // 创建表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    content.headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      th.style.backgroundColor = content.style.headerBackground;
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 创建表格行
    const tbody = document.createElement('tbody');
    
    content.rows.forEach(row => {
      const tr = document.createElement('tr');
      
      row.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        td.style.backgroundColor = content.style.rowBackground;
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
    
    return container;
  }

  // 应用位置样式
  private applyPosition(element: HTMLElement, position: { x: number; y: number; width: number; height: number }): void {
    element.style.position = 'absolute';
    element.style.left = `${position.x}px`;
    element.style.top = `${position.y}px`;
    element.style.width = `${position.width}px`;
    element.style.height = `${position.height}px`;
  }

  // 获取当前幻灯片数量
  public getSlideCount(): number {
    return this.pptData.slides.length;
  }

  // 跳转到指定幻灯片
  public goToSlide(slideIndex: number): void {
    const slideElement = document.getElementById(`slide-${this.pptData.slides[slideIndex].id}`);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}