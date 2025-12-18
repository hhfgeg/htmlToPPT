const HTMLToPPTConverter = require('../index');
const fs = require('fs');
const path = require('path');

// 模拟fs模块
jest.mock('fs');

describe('HTMLToPPTConverter', () => {
  let converter;

  beforeEach(() => {
    // 重置模拟
    jest.clearAllMocks();
    
    // 创建转换器实例
    converter = new HTMLToPPTConverter();
    
    // 模拟fs.existsSync返回true
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(createTestTemplate('title'));
    fs.statSync = jest.fn();
  });

  describe('构造函数', () => {
    test('应该正确初始化属性', () => {
      expect(converter.templates).toEqual({});
      expect(converter.slides).toEqual([]);
      expect(converter.outputDir).toContain('output');
      expect(converter.pptGenerator).toBeDefined();
    });

    test('应该创建输出目录', () => {
      fs.existsSync.mockReturnValue(false);
      
      new HTMLToPPTConverter();
      
      expect(fs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('output'),
        { recursive: true }
      );
    });
  });

  describe('loadTemplate方法', () => {
    test('应该成功加载模板', async () => {
      const templatePath = 'test/template.html';
      const templateName = 'test-template';
      
      const result = await converter.loadTemplate(templatePath, templateName);
      
      expect(result).toBe(true);
      expect(converter.templates[templateName]).toBeDefined();
      expect(converter.templates[templateName].loaded).toBe(true);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining(templatePath),
        'utf8'
      );
    });

    test('应该处理模板文件不存在的情况', async () => {
      fs.existsSync.mockReturnValue(false);
      
      const result = await converter.loadTemplate('nonexistent.html', 'test');
      
      expect(result).toBe(false);
      expect(converter.templates.test).toBeUndefined();
    });

    test('应该解析模板元数据', async () => {
      const templateWithMetadata = `
<!DOCTYPE html>
<html>
<head>
<!-- SLIDE_METADATA:
- type: title
- aspect-ratio: 16:9
- background: gradient
-->
</head>
<body></body>
</html>
      `;
      
      fs.readFileSync.mockReturnValue(templateWithMetadata);
      
      await converter.loadTemplate('test.html', 'test');
      
      expect(converter.templates.test.metadata).toEqual({
        type: 'title',
        'aspect-ratio': '16:9',
        background: 'gradient'
      });
    });
  });

  describe('parseTemplateMetadata方法', () => {
    test('应该正确解析元数据', () => {
      const templateContent = `
<!-- SLIDE_METADATA:
- type: title
- aspect-ratio: 16:9
-->
      `;
      
      const metadata = converter.parseTemplateMetadata(templateContent);
      
      expect(metadata).toEqual({
        type: 'title',
        'aspect-ratio': '16:9'
      });
    });

    test('应该处理没有元数据的情况', () => {
      const templateContent = '<html><body></body></html>';
      
      const metadata = converter.parseTemplateMetadata(templateContent);
      
      expect(metadata).toEqual({});
    });

    test('应该处理格式错误的元数据', () => {
      const templateContent = `
<!-- SLIDE_METADATA:
- type: title
- invalid-line
- aspect-ratio: 16:9
-->
      `;
      
      const metadata = converter.parseTemplateMetadata(templateContent);
      
      expect(metadata).toEqual({
        type: 'title',
        'aspect-ratio': '16:9'
      });
    });
  });

  describe('addSlide方法', () => {
    beforeEach(async () => {
      await converter.loadTemplate('test.html', 'test-template');
    });

    test('应该成功添加幻灯片', () => {
      const content = { title: '测试标题', subtitle: '测试副标题' };
      
      converter.addSlide('test-template', content, 'title');
      
      expect(converter.slides).toHaveLength(1);
      expect(converter.slides[0].template).toBe('test-template');
      expect(converter.slides[0].content).toEqual(content);
      expect(converter.slides[0].type).toBe('title');
    });

    test('应该处理未加载模板的情况', () => {
      const content = { title: '测试标题' };
      
      expect(() => {
        converter.addSlide('nonexistent-template', content, 'title');
      }).toThrow('模板 nonexistent-template 未加载');
    });

    test('应该构建正确的HTML内容', () => {
      const content = { title: '测试标题', subtitle: '测试副标题' };
      
      converter.addSlide('test-template', content, 'title');
      
      const slide = converter.slides[0];
      expect(slide.htmlContent).toContain('测试标题');
      expect(slide.htmlContent).toContain('测试副标题');
    });
  });

  describe('buildHTMLFromTemplate方法', () => {
    beforeEach(async () => {
      await converter.loadTemplate('test.html', 'test-template');
    });

    test('应该正确替换占位符', () => {
      const content = { 
        title: '替换的标题', 
        subtitle: '替换的副标题',
        footer: '替换的页脚'
      };
      
      const html = converter.buildHTMLFromTemplate('test-template', content);
      
      expect(html).toContain('替换的标题');
      expect(html).toContain('替换的副标题');
      expect(html).toContain('替换的页脚');
      expect(html).not.toContain('{{title}}');
      expect(html).not.toContain('{{subtitle}}');
    });

    test('应该处理不存在的占位符', () => {
      const content = { title: '测试标题', nonexistent: '不存在的' };
      
      const html = converter.buildHTMLFromTemplate('test-template', content);
      
      expect(html).toContain('测试标题');
      expect(html).not.toContain('不存在的');
    });
  });

  describe('getBackgroundForType方法', () => {
    test('应该返回标题幻灯片的背景', () => {
      const background = converter.getBackgroundForType('title');
      expect(background).toEqual({ color: '667EEA' });
    });

    test('应该返回内容幻灯片的背景', () => {
      const background = converter.getBackgroundForType('content');
      expect(background).toEqual({ color: 'FFFFFF' });
    });

    test('应该返回默认背景', () => {
      const background = converter.getBackgroundForType('unknown');
      expect(background).toEqual({ color: 'F8F9FA' });
    });
  });

  describe('clearSlides方法', () => {
    test('应该清空所有幻灯片', async () => {
      await converter.loadTemplate('test.html', 'test-template');
      converter.addSlide('test-template', { title: '测试' }, 'title');
      
      expect(converter.slides).toHaveLength(1);
      
      converter.clearSlides();
      
      expect(converter.slides).toHaveLength(0);
    });
  });

  describe('getStats方法', () => {
    test('应该返回正确的统计信息', async () => {
      await converter.loadTemplate('test.html', 'template1');
      await converter.loadTemplate('test.html', 'template2');
      
      converter.addSlide('template1', { title: '测试1' }, 'title');
      converter.addSlide('template2', { title: '测试2' }, 'content');
      converter.addSlide('template1', { title: '测试3' }, 'title');
      
      const stats = converter.getStats();
      
      expect(stats.totalSlides).toBe(3);
      expect(stats.templates).toBe(2);
      expect(stats.slidesByTemplate.template1).toBe(2);
      expect(stats.slidesByTemplate.template2).toBe(1);
    });
  });

  describe('getFileSize方法', () => {
    test('应该返回文件大小', () => {
      fs.statSync.mockReturnValue({ size: 1024 });
      
      const size = converter.getFileSize('test.pptx');
      
      expect(size).toBe('1 KB');
    });

    test('应该处理文件不存在的情况', () => {
      fs.statSync.mockImplementation(() => {
        throw new Error('文件不存在');
      });
      
      const size = converter.getFileSize('nonexistent.pptx');
      
      expect(size).toBe('未知');
    });
  });
});

// 辅助函数
function createTestTemplate(type = 'title') {
  if (type === 'title') {
    return `
<!DOCTYPE html>
<html>
<head>
    <!-- SLIDE_METADATA:
    - type: title
    - aspect-ratio: 16:9
    -->
</head>
<body>
    <div class="ppt-slide">
        <h1 class="slide-title">{{title}}</h1>
        <p class="slide-subtitle">{{subtitle}}</p>
        <div class="slide-footer">{{footer}}</div>
    </div>
</body>
</html>
    `;
  }
  
  return `
<!DOCTYPE html>
<html>
<head>
    <!-- SLIDE_METADATA:
    - type: content
    - aspect-ratio: 16:9
    -->
</head>
<body>
    <div class="ppt-slide">
        <h1 class="slide-title">{{title}}</h1>
        <div class="slide-content">{{content}}</div>
        <ul class="slide-list">{{list_items}}</ul>
        <div class="slide-footer">{{footer}}</div>
    </div>
</body>
</html>
    `;
}