import { HTMLRenderer } from './renderers/htmlRenderer';
import { PPTXExporter } from './exporters/pptxExporter';
import { PPTData } from './types/index';

export { HTMLRenderer } from './renderers/htmlRenderer';
export { PPTXExporter } from './exporters/pptxExporter';
export * from './types/index';

// 主类 - 统一的PPT管理器
export class PPTManager {
  private data: PPTData;
  private htmlRenderer?: HTMLRenderer;
  private pptxExporter?: PPTXExporter;

  constructor(pptData: PPTData) {
    this.data = pptData;
  }

  // 渲染到HTML
  public renderToHTML(container: HTMLElement): void {
    this.htmlRenderer = new HTMLRenderer(this.data, container);
    this.htmlRenderer.render();
  }

  // 导出到PPTX
  public async exportToPPTX(filename?: string): Promise<void> {
    this.pptxExporter = new PPTXExporter(this.data);
    
    // 验证数据
    const validation = this.pptxExporter.validateForExport();
    if (!validation.valid) {
      throw new Error(`导出验证失败: ${validation.errors.join(', ')}`);
    }
    
    await this.pptxExporter.exportToPPTX(filename);
  }

  // 获取演示文稿信息
  public getInfo() {
    return {
      title: this.data.title,
      author: this.data.author,
      slideCount: this.data.slides.length,
      description: this.data.description
    };
  }

  // 更新数据
  public updateData(newData: PPTData): void {
    this.data = newData;
    
    // 如果有活动的渲染器，重新渲染
    if (this.htmlRenderer && this.htmlRenderer.getSlideCount() > 0) {
      // 这里需要重新获取容器并重新渲染
      // 实际实现中可能需要更复杂的更新逻辑
    }
  }

  // 获取当前数据
  public getData(): PPTData {
    return JSON.parse(JSON.stringify(this.data)); // 返回深拷贝
  }
}