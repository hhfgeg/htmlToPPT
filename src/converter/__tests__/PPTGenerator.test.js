const PPTGenerator = require('../pptGenerator');

// 模拟pptxgenjs
jest.mock('pptxgenjs', () => {
  return jest.fn().mockImplementation(() => ({
    layout: 'LAYOUT_16x9',
    title: '',
    author: '',
    company: '',
    addSlide: jest.fn().mockReturnValue({
      background: null,
      addText: jest.fn()
    }),
    writeFile: jest.fn().mockResolvedValue()
  }));
});

describe('PPTGenerator', () => {
  let pptGenerator;

  beforeEach(() => {
    jest.clearAllMocks();
    pptGenerator = new PPTGenerator();
  });

  describe('构造函数', () => {
    test('应该正确初始化属性', () => {
      expect(pptGenerator.pptx).toBeDefined();
      expect(pptGenerator.pptx.layout).toBe('LAYOUT_16x9');
      expect(pptGenerator.slides).toEqual([]);
    });
  });

  describe('parseHTMLToSlide方法', () => {
    test('应该解析标题幻灯片', () => {
      const htmlContent = `
        <h1>测试标题</h1>
        <p class="slide-subtitle">测试副标题</p>
        <div class="slide-content">测试内容</div>
      `;
      
      const slideData = pptGenerator.parseHTMLToSlide(htmlContent);
      
      expect(slideData.title).toBe('测试标题');
      expect(slideData.subtitle).toBe('测试副标题');
      expect(slideData.content).toHaveLength(1);
      expect(slideData.content[0]).toEqual({
        type: 'text',
        content: '测试内容'
      });
    });

    test('应该解析列表项', () => {
      const htmlContent = `
        <h1>测试标题</h1>
        <ul>
          <li>列表项1</li>
          <li>列表项2</li>
          <li>列表项3</li>
        </ul>
      `;
      
      const slideData = pptGenerator.parseHTMLToSlide(htmlContent);
      
      expect(slideData.content).toHaveLength(1);
      expect(slideData.content[0]).toEqual({
        type: 'list',
        items: ['列表项1', '列表项2', '列表项3']
      });
    });

    test('应该处理没有标题的情况', () => {
      const htmlContent = '<p>只有段落</p>';
      
      const slideData = pptGenerator.parseHTMLToSlide(htmlContent);
      
      expect(slideData.title).toBe('');
      expect(slideData.subtitle).toBe('');
      expect(slideData.content).toHaveLength(0);
    });

    test('应该处理空HTML内容', () => {
      const slideData = pptGenerator.parseHTMLToSlide('');
      
      expect(slideData.title).toBe('');
      expect(slideData.subtitle).toBe('');
      expect(slideData.content).toEqual([]);
    });

    test('应该应用选项中的背景设置', () => {
      const htmlContent = '<h1>测试标题</h1>';
      const options = { background: { color: 'FF0000' } };
      
      const slideData = pptGenerator.parseHTMLToSlide(htmlContent, options);
      
      expect(slideData.background).toEqual({ color: 'FF0000' });
    });
  });

  describe('stripHTML方法', () => {
    test('应该去除HTML标签', () => {
      const html = '<p>这是一个<strong>测试</strong>文本</p>';
      const result = pptGenerator.stripHTML(html);
      
      expect(result).toBe('这是一个测试文本');
    });

    test('应该处理空字符串', () => {
      const result = pptGenerator.stripHTML('');
      expect(result).toBe('');
    });

    test('应该处理纯文本', () => {
      const result = pptGenerator.stripHTML('纯文本内容');
      expect(result).toBe('纯文本内容');
    });
  });

  describe('addSlide方法', () => {
    test('应该添加标题幻灯片', () => {
      const htmlContent = '<h1>测试标题</h1><p class="slide-subtitle">测试副标题</p>';
      
      const slide = pptGenerator.addSlide(htmlContent, 'title');
      
      expect(slide).toBeDefined();
      expect(pptGenerator.slides).toHaveLength(1);
      expect(pptGenerator.slides[0].type).toBe('title');
      expect(pptGenerator.slides[0].data.title).toBe('测试标题');
    });

    test('应该添加内容幻灯片', () => {
      const htmlContent = '<h1>测试标题</h1><div class="slide-content">测试内容</div>';
      
      const slide = pptGenerator.addSlide(htmlContent, 'content');
      
      expect(slide).toBeDefined();
      expect(pptGenerator.slides).toHaveLength(1);
      expect(pptGenerator.slides[0].type).toBe('content');
    });

    test('应该默认使用内容幻灯片类型', () => {
      const htmlContent = '<h1>测试标题</h1>';
      
      const slide = pptGenerator.addSlide(htmlContent);
      
      expect(pptGenerator.slides[0].type).toBe('content');
    });

    test('应该应用选项参数', () => {
      const htmlContent = '<h1>测试标题</h1>';
      const options = { background: { color: 'FFFFFF' } };
      
      const slide = pptGenerator.addSlide(htmlContent, 'title', options);
      
      expect(pptGenerator.slides[0].data.background).toEqual({ color: 'FFFFFF' });
    });
  });

  describe('generate方法', () => {
    beforeEach(() => {
      // 添加一些幻灯片用于测试生成
      const htmlContent = '<h1>测试标题</h1>';
      pptGenerator.addSlide(htmlContent, 'title');
      pptGenerator.addSlide(htmlContent, 'content');
    });

    test('应该成功生成PPT文件', async () => {
      const result = await pptGenerator.generate('test-presentation.pptx');
      
      expect(result.success).toBe(true);
      expect(result.filename).toBe('test-presentation.pptx');
      expect(result.slidesCount).toBe(2);
      expect(result.message).toBe('PPT文件生成成功');
      
      // 验证pptxgenjs方法被调用
      expect(pptGenerator.pptx.writeFile).toHaveBeenCalledWith({
        fileName: 'test-presentation.pptx'
      });
    });

    test('应该处理生成失败的情况', async () => {
      pptGenerator.pptx.writeFile.mockRejectedValue(new Error('生成失败'));
      
      const result = await pptGenerator.generate('test.pptx');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('生成失败');
      expect(result.message).toBe('PPT文件生成失败');
    });

    test('应该设置演示文稿属性', async () => {
      await pptGenerator.generate('test.pptx');
      
      expect(pptGenerator.pptx.title).toBe('HTML to PPT 演示文稿');
      expect(pptGenerator.pptx.author).toBe('HTML to PPT Converter');
      expect(pptGenerator.pptx.company).toBe('HTML to PPT');
    });
  });

  describe('getStats方法', () => {
    test('应该返回正确的统计信息', () => {
      // 添加不同类型的幻灯片
      const htmlContent = '<h1>测试标题</h1>';
      pptGenerator.addSlide(htmlContent, 'title');
      pptGenerator.addSlide(htmlContent, 'content');
      pptGenerator.addSlide(htmlContent, 'title');
      pptGenerator.addSlide(htmlContent, 'content');
      pptGenerator.addSlide(htmlContent, 'content');
      
      const stats = pptGenerator.getStats();
      
      expect(stats.totalSlides).toBe(5);
      expect(stats.slidesByType.title).toBe(2);
      expect(stats.slidesByType.content).toBe(3);
    });

    test('应该处理空幻灯片的情况', () => {
      const stats = pptGenerator.getStats();
      
      expect(stats.totalSlides).toBe(0);
      expect(stats.slidesByType).toEqual({});
    });
  });

  describe('reset方法', () => {
    test('应该重置生成器状态', () => {
      // 添加一些数据
      const htmlContent = '<h1>测试标题</h1>';
      pptGenerator.addSlide(htmlContent, 'title');
      pptGenerator.addSlide(htmlContent, 'content');
      
      expect(pptGenerator.slides).toHaveLength(2);
      
      // 重置
      pptGenerator.reset();
      
      expect(pptGenerator.slides).toHaveLength(0);
      expect(pptGenerator.pptx).toBeDefined();
      expect(pptGenerator.pptx.layout).toBe('LAYOUT_16x9');
    });
  });

  describe('createTitleSlide方法', () => {
    test('应该创建标题幻灯片', () => {
      const slideData = {
        title: '测试标题',
        subtitle: '测试副标题',
        background: { color: 'FFFFFF' }
      };
      
      const slide = pptGenerator.createTitleSlide(slideData);
      
      expect(slide).toBeDefined();
      expect(slide.background).toEqual({ color: 'FFFFFF' });
      expect(slide.addText).toHaveBeenCalledTimes(2);
    });

    test('应该处理没有副标题的情况', () => {
      const slideData = {
        title: '测试标题',
        subtitle: '',
        background: { color: 'FFFFFF' }
      };
      
      const slide = pptGenerator.createTitleSlide(slideData);
      
      expect(slide.addText).toHaveBeenCalledTimes(1);
    });
  });

  describe('createContentSlide方法', () => {
    test('应该创建内容幻灯片', () => {
      const slideData = {
        title: '测试标题',
        content: [
          { type: 'text', content: '文本内容' },
          { type: 'list', items: ['列表项1', '列表项2'] }
        ],
        background: { color: 'FFFFFF' }
      };
      
      const slide = pptGenerator.createContentSlide(slideData);
      
      expect(slide).toBeDefined();
      expect(slide.background).toEqual({ color: 'FFFFFF' });
      expect(slide.addText).toHaveBeenCalledTimes(4); // 标题 + 文本 + 2个列表项
    });

    test('应该处理没有标题的情况', () => {
      const slideData = {
        title: '',
        content: [{ type: 'text', content: '文本内容' }],
        background: { color: 'FFFFFF' }
      };
      
      const slide = pptGenerator.createContentSlide(slideData);
      
      expect(slide.addText).toHaveBeenCalledTimes(1);
    });

    test('应该处理空内容的情况', () => {
      const slideData = {
        title: '测试标题',
        content: [],
        background: { color: 'FFFFFF' }
      };
      
      const slide = pptGenerator.createContentSlide(slideData);
      
      expect(slide.addText).toHaveBeenCalledTimes(1); // 只有标题
    });
  });
});