const express = require('express');
const path = require('path');
const fs = require('fs');
const HTMLToPPTConverter = require('./converter/index');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static('.'));
app.use('/src', express.static('src'));
app.use('/assets', express.static('assets'));
app.use('/examples', express.static('examples'));
app.use('/output', express.static('output'));

// 路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../examples/index.html'));
});

app.get('/templates', (req, res) => {
    res.json({
        templates: [
            { name: '标准标题模板', path: '/src/templates/template-standard.html' },
            { name: '内容幻灯片模板', path: '/src/templates/template-content.html' }
        ]
    });
});

// HTML到PPT转换API
app.post('/convert', async (req, res) => {
    try {
        const { slideType, title, subtitle, content, footer } = req.body;
        
        // 创建转换器实例
        const converter = new HTMLToPPTConverter();
        
        // 加载模板
        await converter.loadTemplate('src/templates/template-standard.html', 'title-template');
        await converter.loadTemplate('src/templates/template-content.html', 'content-template');
        
        // 添加幻灯片
        const templateName = slideType === 'title' ? 'title-template' : 'content-template';
        
        const slideData = {
            title: title || '无标题',
            subtitle: subtitle || '',
            content: content || '',
            footer: footer || ''
        };
        
        if (slideType === 'content' && content) {
            // 将内容转换为列表项格式
            const listItems = content.split('\n').filter(item => item.trim()).map(item => 
                `<li>${item.trim()}</li>`
            ).join('');
            slideData.list_items = listItems;
        }
        
        converter.addSlide(templateName, slideData, slideType);
        
        // 生成PPT文件
        const filename = `converted-${Date.now()}.pptx`;
        const result = await converter.generatePPT(filename);
        
        if (result.success) {
            res.json({
                success: true,
                filename: filename,
                outputPath: result.outputPath,
                slides: result.slides,
                fileSize: result.fileSize
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
        
    } catch (error) {
        console.error('转换失败:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 文件下载端点
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'output', filename);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath, filename);
    } else {
        res.status(404).json({
            success: false,
            error: '文件不存在'
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`HTML to PPT 服务器运行在 http://localhost:${PORT}`);
    console.log('查看示例模板: http://localhost:${PORT}');
    console.log('模板列表: http://localhost:${PORT}/templates');
});