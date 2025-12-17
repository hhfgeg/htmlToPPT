# HTML to PPT 转换工具

一个基于 AI 的 PPT 生成工具，通过 HTML 模板将内容转换为专业的 PowerPoint 演示文稿。

## 项目概述

本项目旨在提供一个简单高效的 PPT 生成解决方案，通过以下流程实现：
1. **AI 内容生成** - 使用 AI 技术生成 PPT 内容
2. **HTML 模板渲染** - 将内容渲染到预设的 HTML 模板中
3. **格式转换** - 将 HTML 转换为标准的 PPT 文件格式

## 主要功能

### ✅ 已实现功能
- **基础 HTML 模板** - 提供标准的 16:9 比例幻灯片模板
- **响应式设计** - 适配不同屏幕尺寸的显示效果
- **现代化 UI** - 采用渐变背景和阴影效果，提升视觉体验

### 🔄 计划功能
- **模板管理系统** - 支持多种 HTML 模板的创建和管理
- **HTML 到 PPT 转换** - 实现 HTML 内容到 PowerPoint 文件的转换
- **AI 集成** - 集成 AI 模型自动生成 PPT 内容
- **批量处理** - 支持批量转换多个 HTML 文件
- **自定义样式** - 允许用户自定义模板样式和布局

## 技术架构

```
AI 内容生成 → HTML 模板渲染 → PPT 文件转换
```

### 核心技术栈
- **前端**: HTML5, CSS3, JavaScript
- **转换工具**: 待集成（计划使用 puppeteer 或类似工具）
- **AI 集成**: 待确定（计划集成 OpenAI 或其他 AI 服务）

## 项目结构

```
htmlToPPT/
├── README.md                  # 项目说明文档
├── TEMPLATE_SPECIFICATION.md  # HTML 模板规范文档
├── package.json               # 项目配置文件
├── .gitignore                 # Git 忽略文件
├── src/                       # 源代码目录
│   ├── server.js              # 开发服务器
│   ├── converter/             # 转换器核心逻辑
│   │   └── index.js           # 主转换器类
│   ├── templates/             # HTML 模板目录
│   │   ├── template-standard.html
│   │   └── template-content.html
│   └── utils/                 # 工具函数
│       └── templateParser.js  # 模板解析工具
├── assets/                    # 静态资源
│   ├── css/
│   │   └── main.css           # 主样式文件
│   └── js/                    # JavaScript 文件
└── examples/                  # 示例文件
    ├── index.html             # 基础示例模板
    └── demo.html              # 模板演示页面
```

## 快速开始

### 环境要求
- 现代浏览器（Chrome、Firefox、Safari 等）
- Node.js 14.0+（用于开发服务器和转换功能）

### 安装依赖
```bash
npm install
```

### 使用方法

1. **启动开发服务器**
   ```bash
   npm run dev
   ```
   服务器将在 http://localhost:3000 启动

2. **查看模板演示**
   - 访问 http://localhost:3000/examples/demo.html
   - 预览可用的模板
   - 查看模板规范

3. **使用模板**
   - 模板文件位于 `src/templates/` 目录
   - 遵循模板规范创建新的模板
   - 使用占位符格式 `{{placeholder}}`

4. **转换功能**（开发中）
   - 待实现 HTML 到 PPT 的转换功能

## 模板规范

### HTML 模板标准格式

HTML 模板文件需要遵循特定的格式规范，以确保能够正确转换为 PPT 文件。详细规范请参考 [TEMPLATE_SPECIFICATION.md](./TEMPLATE_SPECIFICATION.md)。

#### 基本要求
- **文件命名**: `template-{name}.html` 或 `slide-{type}.html`
- **编码**: UTF-8
- **幻灯片尺寸**: 1280px × 720px (16:9 比例)
- **容器类名**: 必须使用 `.ppt-slide` 作为主容器

#### 标准类名规范
- `.slide-title` - 幻灯片主标题
- `.slide-subtitle` - 幻灯片副标题  
- `.slide-content` - 正文内容区域
- `.slide-list` - 列表内容
- `.slide-footer` - 页脚信息

#### 内容占位符
使用 `{{placeholder}}` 格式作为内容占位符：
```html
<h1 class="slide-title">{{title}}</h1>
<p class="slide-subtitle">{{subtitle}}</p>
<div class="slide-content">{{content}}</div>
```

#### 提供的模板示例
- `template-standard.html` - 标准标题幻灯片模板
- `template-content.html` - 内容幻灯片模板
- `index.html` - 基础示例模板

### 幻灯片尺寸
- 标准 16:9 比例（1280px × 720px）
- 支持响应式设计

### CSS 样式要求
- 使用相对单位（rem、%）确保缩放效果
- 避免使用浏览器特定的 CSS 属性
- 确保打印和屏幕显示的一致性

## 开发计划

### 第一阶段：基础功能 ✅
- [ ] 指定 html 模板文件的标准格式，使得后续转化为 PPT 时能够正常渲染
- [ ] 创建基础 HTML 模板
- [ ] 实现响应式设计

### 第二阶段：核心功能 🔄
- [ ] 实现 HTML 到 PPT 转换，不要使用截图的方式，而是直接将 html 内容渲染到 PPT 文件中，后续 PPT 文件可以直接打开查看和编辑
- [ ] 开发模板管理系统
- [ ] 集成 AI 内容生成

### 第三阶段：高级功能 📋
- [ ] 支持多种导出格式
- [ ] 添加动画效果支持
- [ ] 实现批量处理功能

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

### 开发环境设置
1. Fork 本项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**注意**: 本项目仍在积极开发中，功能可能会有所调整。