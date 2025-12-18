const TemplateParser = require('../templateParser');

describe('TemplateParser', () => {
  describe('parsePlaceholders方法', () => {
    test('应该解析单个占位符', () => {
      const html = '<h1>{{title}}</h1>';
      const placeholders = TemplateParser.parsePlaceholders(html);
      
      expect(placeholders).toHaveLength(1);
      expect(placeholders[0]).toEqual({
        fullMatch: '{{title}}',
        name: 'title',
        index: 4
      });
    });

    test('应该解析多个占位符', () => {
      const html = '<h1>{{title}}</h1><p>{{subtitle}}</p><div>{{content}}</div>';
      const placeholders = TemplateParser.parsePlaceholders(html);
      
      expect(placeholders).toHaveLength(3);
      expect(placeholders[0].name).toBe('title');
      expect(placeholders[1].name).toBe('subtitle');
      expect(placeholders[2].name).toBe('content');
    });

    test('应该处理没有占位符的情况', () => {
      const html = '<h1>标题</h1><p>内容</p>';
      const placeholders = TemplateParser.parsePlaceholders(html);
      
      expect(placeholders).toHaveLength(0);
    });

    test('应该处理空字符串', () => {
      const placeholders = TemplateParser.parsePlaceholders('');
      
      expect(placeholders).toHaveLength(0);
    });

    test('应该处理带空格的占位符', () => {
      const html = '<h1>{{ title }}</h1>';
      const placeholders = TemplateParser.parsePlaceholders(html);
      
      expect(placeholders).toHaveLength(1);
      expect(placeholders[0].name).toBe('title');
    });
  });

  describe('parseMetadata方法', () => {
    test('应该解析完整的元数据', () => {
      const html = `
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
      
      const metadata = TemplateParser.parseMetadata(html);
      
      expect(metadata).toEqual({
        type: 'title',
        'aspect-ratio': '16:9',
        background: 'gradient'
      });
    });

    test('应该处理没有元数据的情况', () => {
      const html = '<html><body></body></html>';
      const metadata = TemplateParser.parseMetadata(html);
      
      expect(metadata).toEqual({});
    });

    test('应该处理格式错误的元数据行', () => {
      const html = `
<!-- SLIDE_METADATA:
- type: title
- invalid-line
- aspect-ratio: 16:9
-->
      `;
      
      const metadata = TemplateParser.parseMetadata(html);
      
      expect(metadata).toEqual({
        type: 'title',
        'aspect-ratio': '16:9'
      });
    });

    test('应该处理空元数据块', () => {
      const html = '<!-- SLIDE_METADATA: -->';
      const metadata = TemplateParser.parseMetadata(html);
      
      expect(metadata).toEqual({});
    });

    test('应该处理带冒号的值', () => {
      const html = `
<!-- SLIDE_METADATA:
- theme: dark:blue
- font: Arial:bold
-->
      `;
      
      const metadata = TemplateParser.parseMetadata(html);
      
      expect(metadata).toEqual({
        theme: 'dark:blue',
        font: 'Arial:bold'
      });
    });
  });

  describe('replacePlaceholders方法', () => {
    test('应该替换单个占位符', () => {
      const html = '<h1>{{title}}</h1>';
      const data = { title: '测试标题' };
      
      const result = TemplateParser.replacePlaceholders(html, data);
      
      expect(result).toBe('<h1>测试标题</h1>');
    });

    test('应该替换多个占位符', () => {
      const html = '<h1>{{title}}</h1><p>{{subtitle}}</p><div>{{content}}</div>';
      const data = {
        title: '主标题',
        subtitle: '副标题',
        content: '内容区域'
      };
      
      const result = TemplateParser.replacePlaceholders(html, data);
      
      expect(result).toBe('<h1>主标题</h1><p>副标题</p><div>内容区域</div>');
    });

    test('应该处理重复占位符', () => {
      const html = '<h1>{{title}}</h1><footer>{{title}}</footer>';
      const data = { title: '相同的标题' };
      
      const result = TemplateParser.replacePlaceholders(html, data);
      
      expect(result).toBe('<h1>相同的标题</h1><footer>相同的标题</footer>');
    });

    test('应该处理没有匹配数据的情况', () => {
      const html = '<h1>{{title}}</h1><p>{{subtitle}}</p>';
      const data = { title: '只有标题' };
      
      const result = TemplateParser.replacePlaceholders(html, data);
      
      expect(result).toBe('<h1>只有标题</h1><p>{{subtitle}}</p>');
    });

    test('应该处理空数据对象', () => {
      const html = '<h1>{{title}}</h1>';
      const data = {};
      
      const result = TemplateParser.replacePlaceholders(html, data);
      
      expect(result).toBe('<h1>{{title}}</h1>');
    });

    test('应该处理没有占位符的模板', () => {
      const html = '<h1>固定标题</h1>';
      const data = { title: '不会替换' };
      
      const result = TemplateParser.replacePlaceholders(html, data);
      
      expect(result).toBe('<h1>固定标题</h1>');
    });
  });

  describe('validateTemplate方法', () => {
    test('应该验证有效的模板', () => {
      const html = `
<!DOCTYPE html>
<html>
<head>
<!-- SLIDE_METADATA:
- type: title
-->
</head>
<body>
  <div class="ppt-slide" style="width: 1280px; height: 720px;">
    <h1>{{title}}</h1>
    <p>{{subtitle}}</p>
  </div>
</body>
</html>
      `;
      
      const result = TemplateParser.validateTemplate(html);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
      expect(result.metadata.type).toBe('title');
      expect(result.placeholders).toContain('title');
      expect(result.placeholders).toContain('subtitle');
    });

    test('应该检测缺少幻灯片容器', () => {
      const html = '<h1>{{title}}</h1><p>{{subtitle}}</p>';
      
      const result = TemplateParser.validateTemplate(html);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('缺少必需的幻灯片容器类名: ppt-slide');
    });

    test('应该警告缺少尺寸设置', () => {
      const html = '<div class="ppt-slide"><h1>{{title}}</h1></div>';
      
      const result = TemplateParser.validateTemplate(html);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('建议设置幻灯片尺寸为 1280px × 720px');
    });

    test('应该警告缺少元数据', () => {
      const html = '<div class="ppt-slide"><h1>{{title}}</h1></div>';
      
      const result = TemplateParser.validateTemplate(html);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('建议添加幻灯片类型元数据');
    });

    test('应该警告缺少占位符', () => {
      const html = '<div class="ppt-slide"><h1>固定标题</h1></div>';
      
      const result = TemplateParser.validateTemplate(html);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('模板中没有检测到占位符');
    });

    test('应该处理空模板', () => {
      const result = TemplateParser.validateTemplate('');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('缺少必需的幻灯片容器类名: ppt-slide');
    });

    test('应该返回所有占位符名称', () => {
      const html = '<div class="ppt-slide"><h1>{{title}}</h1><p>{{subtitle}}</p><ul>{{list_items}}</ul></div>';
      
      const result = TemplateParser.validateTemplate(html);
      
      expect(result.placeholders).toHaveLength(3);
      expect(result.placeholders).toContain('title');
      expect(result.placeholders).toContain('subtitle');
      expect(result.placeholders).toContain('list_items');
    });
  });
});