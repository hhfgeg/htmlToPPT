import { PPTData, Slide, SlideContent, TextContent, ImageContent, ShapeContent, ChartContent, TableContent } from '../types/index';

export class PPTXExporter {
  private pptData: PPTData;

  constructor(pptData: PPTData) {
    this.pptData = pptData;
  }

  // 导出PPT文件
  public async exportToPPTX(filename: string = 'presentation.pptx'): Promise<void> {
    try {
      // 动态导入PptxGenJS
      const PptxGenJS = await import('pptxgenjs');
      const pptx = new PptxGenJS.default();
      
      // 设置演示文稿属性
      this.setPresentationProperties(pptx);
      
      // 创建幻灯片
      for (const slideData of this.pptData.slides) {
        await this.createSlide(pptx, slideData);
      }
      
      // 导出文件
      await pptx.writeFile({ fileName: filename });
    } catch (error) {
      console.error('导出PPT失败:', error);
      throw new Error(`PPT导出失败: ${error}`);
    }
  }

  // 设置演示文稿属性
  private setPresentationProperties(pptx: any): void {
    pptx.title = this.pptData.title;
    pptx.author = this.pptData.author;
    pptx.subject = this.pptData.description || '';
    
    // 设置主题颜色
    if (this.pptData.theme) {
      pptx.defineSlideMaster({
        title: 'MASTER_SLIDE',
        background: { color: this.pptData.theme.colors.background },
        objects: [
          // 可以在这里定义母版页的通用元素
        ]
      });
    }
  }

  // 创建单个幻灯片
  private async createSlide(pptx: any, slideData: Slide): Promise<void> {
    const slide = pptx.addSlide();
    
    // 设置幻灯片背景
    this.setSlideBackground(slide, slideData);
    
    // 添加标题
    if (slideData.title) {
      this.addTitle(slide, slideData.title);
    }
    
    // 添加内容元素
    for (const content of slideData.content) {
      await this.addContent(slide, content);
    }
  }

  // 设置幻灯片背景
  private setSlideBackground(slide: any, slideData: Slide): void {
    if (!slideData.background) return;
    
    const { type, value } = slideData.background;
    
    switch (type) {
      case 'color':
        slide.background = { color: value };
        break;
      case 'gradient':
        // PptxGenJS不支持CSS渐变，使用纯色替代
        slide.background = { color: this.extractColorFromGradient(value) };
        break;
      case 'image':
        slide.background = { path: value };
        break;
    }
  }

  // 从渐变中提取主要颜色
  private extractColorFromGradient(gradient: string): string {
    // 简单的颜色提取逻辑，实际项目中可以更复杂
    const colorMatch = gradient.match(/#[0-9A-Fa-f]{6}/g);
    return colorMatch ? colorMatch[0] : '#FFFFFF';
  }

  // 添加标题
  private addTitle(slide: any, title: string): void {
    slide.addText(title, {
      x: 1,
      y: 0.5,
      w: '90%',
      h: 1,
      fontSize: 32,
      bold: true,
      align: 'center',
      color: this.pptData.theme?.colors.primary || '#000000'
    });
  }

  // 添加内容元素
  private async addContent(slide: any, content: SlideContent): Promise<void> {
    switch (content.type) {
      case 'text':
        this.addTextContent(slide, content);
        break;
      case 'image':
        await this.addImageContent(slide, content);
        break;
      case 'shape':
        this.addShapeContent(slide, content);
        break;
      case 'chart':
        this.addChartContent(slide, content);
        break;
      case 'table':
        this.addTableContent(slide, content);
        break;
    }
  }

  // 添加文本内容
  private addTextContent(slide: any, content: TextContent): void {
    const { x, y, width, height } = this.convertPosition(content.position);
    
    slide.addText(content.text, {
      x,
      y,
      w: width,
      h: height,
      fontSize: content.style.fontSize,
      fontFace: content.style.fontFamily.split(',')[0], // 取第一个字体
      color: content.style.color,
      bold: content.style.fontWeight === 'bold',
      align: content.style.textAlign,
      lineSpacing: content.style.lineHeight
    });
  }

  // 添加图片内容
  private async addImageContent(slide: any, content: ImageContent): Promise<void> {
    const { x, y, width, height } = this.convertPosition(content.position);
    
    try {
      slide.addImage({
        path: content.src,
        x,
        y,
        w: width,
        h: height
      });
    } catch (error) {
      console.warn(`无法加载图片: ${content.src}`, error);
      // 添加占位符文本
      slide.addText(`[图片: ${content.alt || '未命名'}]`, {
        x,
        y,
        w: width,
        h: height,
        fontSize: 12,
        color: '#999999',
        align: 'center',
        valign: 'middle'
      });
    }
  }

  // 添加形状内容
  private addShapeContent(slide: any, content: ShapeContent): void {
    const { x, y, width, height } = this.convertPosition(content.position);
    
    const shapeOptions = {
      x,
      y,
      w: width,
      h: height,
      fill: content.style.fill,
      line: content.style.stroke ? {
        color: content.style.stroke,
        width: content.style.strokeWidth || 1
      } : undefined
    };
    
    switch (content.shape) {
      case 'rectangle':
        slide.addShape(shapeOptions);
        break;
      case 'circle':
        slide.addShape({ ...shapeOptions, type: 'ellipse' });
        break;
      case 'triangle':
        slide.addShape({ ...shapeOptions, type: 'triangle' });
        break;
      case 'line':
        slide.addShape({ 
          ...shapeOptions, 
          type: 'line',
          h: 0.1 // 线的高度很小
        });
        break;
    }
  }

  // 添加图表内容
  private addChartContent(slide: any, content: ChartContent): void {
    const { x, y, width, height } = this.convertPosition(content.position);
    
    const chartData = [
      {
        name: content.data.datasets[0].label,
        labels: content.data.labels,
        values: content.data.datasets[0].data
      }
    ];
    
    const chartOptions = {
      x,
      y,
      w: width,
      h: height,
      chartColors: content.style.colors
    };
    
    // 由于PptxGenJS类型问题，这里使用字符串常量
    switch (content.chartType) {
      case 'bar':
        slide.addChart({ type: 'bar', data: chartData, ...chartOptions });
        break;
      case 'line':
        slide.addChart({ type: 'line', data: chartData, ...chartOptions });
        break;
      case 'pie':
        slide.addChart({ type: 'pie', data: chartData, ...chartOptions });
        break;
      case 'doughnut':
        slide.addChart({ type: 'doughnut', data: chartData, ...chartOptions });
        break;
    }
  }

  // 添加表格内容
  private addTableContent(slide: any, content: TableContent): void {
    const { x, y, width, height } = this.convertPosition(content.position);
    
    // 准备表格数据
    const tableData = [
      content.headers, // 表头
      ...content.rows  // 数据行
    ];
    
    slide.addTable(tableData, {
      x,
      y,
      w: width,
      h: height,
      border: { type: 'solid', color: content.style.borderColor, pt: 1 },
      fill: { color: content.style.rowBackground },
      color: this.pptData.theme?.colors.text || '#000000',
      fontSize: 12,
      headerRows: 1,
      autoPage: true
    });
  }

  // 转换位置单位（从像素到英寸）
  private convertPosition(position: { x: number; y: number; width: number; height: number }): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    // 假设1英寸 = 96像素（标准DPI）
    const pixelsToInches = (pixels: number) => pixels / 96;
    
    return {
      x: pixelsToInches(position.x),
      y: pixelsToInches(position.y),
      width: pixelsToInches(position.width),
      height: pixelsToInches(position.height)
    };
  }

  // 获取演示文稿信息
  public getPresentationInfo(): {
    title: string;
    author: string;
    slideCount: number;
    description?: string;
  } {
    return {
      title: this.pptData.title,
      author: this.pptData.author,
      slideCount: this.pptData.slides.length,
      description: this.pptData.description
    };
  }

  // 验证数据是否适合导出
  public validateForExport(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.pptData.title) {
      errors.push('演示文稿标题不能为空');
    }
    
    if (this.pptData.slides.length === 0) {
      errors.push('至少需要一个幻灯片');
    }
    
    // 检查每个幻灯片的内容
    this.pptData.slides.forEach((slide, index) => {
      if (slide.content.length === 0) {
        errors.push(`幻灯片 ${index + 1} 没有内容`);
      }
      
      slide.content.forEach((content, contentIndex) => {
        if (content.type === 'image' && !content.src) {
          errors.push(`幻灯片 ${index + 1} 的图片内容 ${contentIndex + 1} 缺少图片路径`);
        }
      });
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}