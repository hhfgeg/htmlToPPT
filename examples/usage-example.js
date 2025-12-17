const HTMLToPPTConverter = require('../src/converter/index');

/**
 * HTML 到 PPT 转换使用示例
 * 演示如何使用转换器生成可编辑的PPT文件
 */

async function runExample() {
    console.log('=== HTML to PPT 转换示例 ===\n');
    
    // 创建转换器实例
    const converter = new HTMLToPPTConverter();
    
    try {
        // 1. 加载模板
        console.log('1. 加载模板...');
        await converter.loadTemplate('src/templates/template-standard.html', 'title-template');
        await converter.loadTemplate('src/templates/template-content.html', 'content-template');
        
        // 2. 添加标题幻灯片
        console.log('\n2. 添加标题幻灯片...');
        converter.addSlide('title-template', {
            title: 'HTML to PPT 转换工具',
            subtitle: '高效、便捷的演示文稿制作',
            footer: '© 2024 HTML to PPT'
        }, 'title');
        
        // 3. 添加内容幻灯片
        console.log('\n3. 添加内容幻灯片...');
        converter.addSlide('content-template', {
            title: '项目特点',
            content: '基于HTML模板的PPT生成工具，支持多种幻灯片类型和自定义样式。',
            list_items: [
                '使用标准HTML模板格式',
                '支持可编辑的PPTX文件输出',
                '提供丰富的样式和布局选项',
                '易于扩展和自定义'
            ].map(item => `<li>${item}</li>`).join(''),
            footer: '第2页'
        }, 'content');
        
        // 4. 添加另一个内容幻灯片
        console.log('\n4. 添加另一个内容幻灯片...');
        converter.addSlide('content-template', {
            title: '技术架构',
            content: '采用现代化的技术栈，确保转换质量和性能。',
            list_items: [
                '使用pptxgenjs生成PPTX文件',
                '支持HTML模板解析和渲染',
                '提供完整的API接口',
                '易于集成到现有系统'
            ].map(item => `<li>${item}</li>`).join(''),
            footer: '第3页'
        }, 'content');
        
        // 5. 生成PPT文件
        console.log('\n5. 生成PPT文件...');
        const result = await converter.generatePPT('example-presentation.pptx');
        
        if (result.success) {
            console.log('✅ PPT文件生成成功!');
            console.log(`   文件路径: ${result.outputPath}`);
            console.log(`   幻灯片数量: ${result.slides}`);
            console.log(`   文件大小: ${result.fileSize}`);
            console.log(`   统计信息:`, result.stats);
        } else {
            console.log('❌ PPT文件生成失败:', result.error);
        }
        
        // 6. 显示转换器统计信息
        console.log('\n6. 转换器统计信息:');
        const stats = converter.getStats();
        console.log(`   总幻灯片数: ${stats.totalSlides}`);
        console.log(`   模板数量: ${stats.templates}`);
        console.log(`   按模板分类:`, stats.slidesByTemplate);
        
    } catch (error) {
        console.error('示例运行失败:', error.message);
    }
}

// 运行示例
runExample().catch(console.error);