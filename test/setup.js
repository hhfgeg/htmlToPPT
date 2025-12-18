// 测试环境设置
const path = require('path');

// 设置测试环境变量
process.env.NODE_ENV = 'test';

// 模拟文件系统操作
jest.mock('fs', () => {
  const originalFs = jest.requireActual('fs');
  return {
    ...originalFs,
    writeFileSync: jest.fn(),
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    readFileSync: jest.fn()
  };
});

// 全局测试辅助函数
global.createTestTemplate = (type = 'title') => {
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
  } else {
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
};

// 测试数据
global.testData = {
  titleSlide: {
    title: '测试标题',
    subtitle: '测试副标题',
    footer: '测试页脚'
  },
  contentSlide: {
    title: '内容幻灯片标题',
    content: '这是内容区域',
    list_items: '<li>列表项1</li><li>列表项2</li>',
    footer: '内容页脚'
  }
};