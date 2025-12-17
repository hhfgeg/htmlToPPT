const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static('.'));
app.use('/src', express.static('src'));
app.use('/assets', express.static('assets'));
app.use('/examples', express.static('examples'));

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

// 启动服务器
app.listen(PORT, () => {
    console.log(`HTML to PPT 服务器运行在 http://localhost:${PORT}`);
    console.log('查看示例模板: http://localhost:${PORT}');
    console.log('模板列表: http://localhost:${PORT}/templates');
});