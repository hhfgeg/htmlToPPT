# HTML 模板规范文档

## 概述

本文档定义了 HTML 到 PPT 转换工具所需的 HTML 模板文件标准格式。遵循此规范可确保模板能够正确转换为 PowerPoint 演示文稿。

## 基本要求

### 文件结构
- **文件命名**: `template-{name}.html` 或 `slide-{type}.html`
- **编码**: UTF-8
- **DOCTYPE**: `<!DOCTYPE html>`
- **语言**: `lang="zh-CN"`

### 幻灯片尺寸
- **标准尺寸**: 1280px × 720px (16:9 比例)
- **容器类名**: 必须使用 `.ppt-slide` 作为主容器

## 模板结构规范

### 1. HTML 头部 (Head)

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 幻灯片元数据 -->
    <!-- 
    SLIDE_METADATA:
    - type: {slide_type}
    - aspect-ratio: 16:9
    - background: {background_type}
    -->
    <title>模板标题</title>
    <style>
        /* CSS 样式 */
    </style>
</head>
```

### 2. 幻灯片容器 (Body)

```html
<body>
    <!-- 幻灯片内容开始 -->
    <div class="ppt-slide" data-slide-type="{type}">
        <!-- 内容区域 -->
    </div>
    <!-- 幻灯片内容结束 -->
</body>
```

## CSS 样式规范

### 1. 基础样式重置
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

### 2. 幻灯片容器样式
```css
.ppt-slide {
    width: 1280px;
    height: 720px;
    /* 其他样式 */
}
```

### 3. 标准类名规范

| 类名 | 用途 | 示例 |
|------|------|------|
| `.slide-title` | 幻灯片主标题 | `<h1 class="slide-title">` |
| `.slide-subtitle` | 幻灯片副标题 | `<p class="slide-subtitle">` |
| `.slide-content` | 正文内容区域 | `<div class="slide-content">` |
| `.slide-list` | 列表内容 | `<ul class="slide-list">` |
| `.slide-footer` | 页脚信息 | `<div class="slide-footer">` |

## 内容占位符规范

使用 `{{placeholder}}` 格式作为内容占位符：

```html
<h1 class="slide-title">{{title}}</h1>
<p class="slide-subtitle">{{subtitle}}</p>
<div class="slide-content">
    {{content}}
</div>
<ul class="slide-list">
    {{list_items}}
</ul>
<div class="slide-footer">{{footer}}</div>
```

## 幻灯片类型定义

### 1. 标题幻灯片 (title)
- **用途**: 封面页、章节开始页
- **data-slide-type**: `title`
- **特点**: 大标题、副标题、简洁布局

### 2. 内容幻灯片 (content)
- **用途**: 正文内容展示
- **data-slide-type**: `content`
- **特点**: 标题、正文、可选图片区域

### 3. 列表幻灯片 (list)
- **用途**: 要点列表展示
- **data-slide-type**: `list`
- **特点**: 标题、项目符号列表

### 4. 图片幻灯片 (image)
- **用途**: 图片展示
- **data-slide-type**: `image`
- **特点**: 大图展示、图片说明

## 响应式设计规范

```css
/* 响应式缩放 */
@media (max-width: 1400px) {
    .ppt-slide {
        transform: scale(0.8);
    }
}

@media (max-width: 1200px) {
    .ppt-slide {
        transform: scale(0.7);
    }
}
```

## 最佳实践

### 1. 字体使用
- 使用系统安全字体栈
- 优先使用相对单位 (rem)
- 确保字体大小适合投影显示

### 2. 颜色选择
- 使用高对比度颜色组合
- 避免使用纯黑色 (#000000)
- 考虑色盲友好配色

### 3. 布局设计
- 保持内容简洁明了
- 使用足够的留白空间
- 避免过度装饰

### 4. 转换兼容性
- 避免使用复杂的 CSS 动画
- 谨慎使用外部资源
- 确保打印样式兼容

## 示例模板

项目提供了以下标准模板：

1. **template-standard.html** - 标准标题幻灯片模板
2. **template-content.html** - 内容幻灯片模板
3. **index.html** - 基础示例模板

## 验证检查清单

在创建新模板时，请检查以下项目：

- [ ] 文件使用 UTF-8 编码
- [ ] 包含正确的 DOCTYPE 声明
- [ ] 幻灯片容器使用 `.ppt-slide` 类名
- [ ] 尺寸设置为 1280px × 720px
- [ ] 使用标准的内容类名
- [ ] 包含响应式设计
- [ ] 使用占位符格式 `{{placeholder}}`
- [ ] 添加幻灯片元数据注释

## 更新日志

- **v1.0** (2024-12-17): 初始规范版本