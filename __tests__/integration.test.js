const HTMLToPPTConverter = require('../src/converter/index');
const fs = require('fs');
const path = require('path');

// 模拟文件系统操作
jest.mock('fs');

describe('HTML到PPT转换集成测试', () => {
  let converter;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // 设置模拟文件系统
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('template-standard.html')) {
        return createTitleTemplate();
      } else if (filePath.includes('template-content.html')) {
        return createContentTemplate();
      }
      return '';
    });
    
    converter = new HTMLToPPTConverter();
  });

  describe('完整转换流程', () => {
    test('应该成功转换标题幻灯片', async () => {
      // 加载模板
      await converter.loadTemplate('src/templates/template-standard.html', 'title-template');
      
      // 添加幻灯片
      const slideData = {
        title: '集成测试标题',
        subtitle: '集成测试副标题',
        footer: '© 2024 集成测试'
      };
      
      converter.addSlide('title-template', slideData, 'title');
      
      // 验证幻灯片已添加
      expect(converter.slides).toHaveLength(1);
      expect(converter.slides[0].type).toBe('title');
      expect(converter.slides[0].content).toEqual(slideData);
      
      // 验证HTML内容构建正确
      const htmlContent = converter.slides[0].htmlContent;
      expect(htmlContent).toContain('集成测试标题');
      expect(htmlContent).toContain('集成测试副标题');
      expect(htmlContent).toContain('© 2024 集成测试');
    });

    test('应该成功转换内容幻灯片', async () => {
      // 加载模板
      await converter.loadTemplate('src/templates/template-content.html', 'content-template');
      
      // 添加幻灯片
      const slideData = {
        title: '内容幻灯片标题',
        content: '这是内容区域',
        list_items: '<li>列表项1</li><li>列表项2</li>',
        footer: '内容页脚'
      };
      
      converter.addSlide('content-template', slideData, 'content');
      
      // 验证幻灯片已添加
      expect(converter.slides).toHaveLength(1);
      expect(converter.slides[0].type).toBe('content');
      
      // 验证HTML内容构建正确
      const htmlContent = converter.slides[0].htmlContent;
      expect(htmlContent).toContain('内容幻灯片标题');
      expect(htmlContent).toContain('这是内容区域');
      expect(htmlContent).toContain('列表项1');
      expect(htmlContent).toContain('列表项2');
    });

    test('应该处理多幻灯片转换', async () => {
      // 加载模板
      await converter.loadTemplate('src/templates/template-standard.html', 'title-template');
      await converter.loadTemplate('src/templates/template-content.html', 'content-template');
      
      // 添加多张幻灯片
      converter.addSlide('title-template', {
        title: '标题幻灯片',
        subtitle: '副标题',
        footer: '页脚'
      }, 'title');
      
      converter.addSlide('content-template', {
        title: '内容幻灯片1',
        content: '内容1',
        footer: '页脚'
      }, 'content');
      
      converter.addSlide('content-template', {
        title: '内容幻灯片2',
        content: '内容2',
        footer: '页脚'
      }, 'content');
      
      // 验证幻灯片数量
      expect(converter.slides).toHaveLength(3);
      
      // 验证统计信息
      const stats = converter.getStats();
      expect(stats.totalSlides).toBe(3);
      expect(stats.templates).toBe(2);
      expect(stats.slidesByTemplate['title-template']).toBe(1);
      expect(stats.slidesByTemplate['content-template']).toBe(2);
    });

    test('应该清空幻灯片并重置', async () => {
      // 加载模板并添加幻灯片
      await converter.loadTemplate('src/templates/template-standard.html', 'title-template');
      converter.addSlide('title-template', { title: '测试' }, 'title');
      
      expect(converter.slides).toHaveLength(1);
      
      // 清空幻灯片
      converter.clearSlides();
      
      expect(converter.slides).toHaveLength(0);
      
      // 验证可以重新添加幻灯片
      converter.addSlide('title-template', { title: '新测试' }, 'title');
      expect(converter.slides).toHaveLength(1);
    });
  });

  describe('错误处理', () => {
    test('应该处理模板文件不存在的情况', async () => {
      fs.existsSync.mockReturnValue(false);
      
      const result = await converter.loadTemplate('nonexistent.html', 'test');
      
      expect(result).toBe(false);
      expect(converter.templates.test).toBeUndefined();
    });

    test('应该处理未加载模板的幻灯片添加', () => {
      expect(() => {
        converter.addSlide('nonexistent-template', { title: '测试' }, 'title');
      }).toThrow('模板 nonexistent-template 未加载');
    });

    test('应该处理空幻灯片的PPT生成', async () => {
      await expect(converter.generatePPT()).rejects.toThrow('没有幻灯片可转换');
    });
  });

  describe('模板元数据解析', () => {
    test('应该正确解析标题模板元数据', async () => {
      await converter.loadTemplate('src/templates/template-standard.html', 'title-template');
      
      const metadata = converter.templates['title-template'].metadata;
      expect(metadata.type).toBe('title');
      expect(metadata['aspect-ratio']).toBe('16:9');
    });

    test('应该正确解析内容模板元数据', async () => {
      await converter.loadTemplate('src/templates/template-content.html', 'content-template');
      
      const metadata = converter.templates['content-template'].metadata;
      expect(metadata.type).toBe('content');
      expect(metadata['aspect-ratio']).toBe('16:9');
    });
  });

  describe('背景设置', () => {
    test('应该为标题幻灯片设置正确背景', () => {
      const background = converter.getBackgroundForType('title');
      expect(background).toEqual({ color: '667EEA' });
    });

    test('应该为内容幻灯片设置正确背景', () => {
      const background = converter.getBackgroundForType('content');
      expect(background).toEqual({ color: 'FFFFFF' });
    });

    test('应该为未知类型设置默认背景', () => {
      const background = converter.getBackgroundForType('unknown');
      expect(background).toEqual({ color: 'F8F9FA' });
    });
  });
});

// 辅助函数
function createTitleTemplate() {
  return `
<!DOCTYPE html>
<html>
<head>
<!-- SLIDE_METADATA:
- type: title
- aspect-ratio: 16:9
- background: gradient
-->
</head>
<body>
  <div class="ppt-slide" style="width: 1280px; height: 720px;">
    <h1 class="slide-title">{{title}}</h1>
    <p class="slide-subtitle">{{subtitle}}</p>
    <div class="slide-footer">{{footer}}</div>
  </div>
</body>
</html>
  `;
}

function createContentTemplate() {
  return `
<!DOCTYPE html>
<html>
<head>
<!-- SLIDE_METADATA:
- type: content
- aspect-ratio: 16:9
- background: solid
-->
</head>
<body>
  <div class="ppt-slide" style="width: 1280px; height: 720px;">
    <h1 class="slide-title">{{title}}</h1>
    <div class="slide-content">{{content}}</div>
    <ul class="slide-list">{{list_items}}</ul>
    <div class="slide-footer">{{footer}}</div>
  </div>
</body>
</html>
  `;
}