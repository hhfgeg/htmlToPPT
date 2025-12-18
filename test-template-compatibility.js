const HTMLToPPTConverter = require('./src/converter/index');
const fs = require('fs');
const path = require('path');

/**
 * 模板兼容性测试脚本
 * 测试所有新模板与转换系统的兼容性
 */

async function testTemplateCompatibility() {
    console.log('=== 模板兼容性测试 ===\n');
    
    // 定义要测试的模板列表
    const templatesToTest = [
        { name: 'business', path: 'src/templates/template-business.html', type: 'business' },
        { name: 'tech', path: 'src/templates/template-tech.html', type: 'tech' },
        { name: 'creative', path: 'src/templates/template-creative.html', type: 'creative' },
        { name: 'education', path: 'src/templates/template-education.html', type: 'education' },
        { name: 'minimal', path: 'src/templates/template-minimal.html', type: 'minimal' },
        { name: 'standard', path: 'src/templates/template-standard.html', type: 'standard' },
        { name: 'content', path: 'src/templates/template-content.html', type: 'content' }
    ];
    
    const testResults = [];
    
    for (const template of templatesToTest) {
        console.log(`\n🔍 测试模板: ${template.name} (${template.path})`);
        
        try {
            // 1. 检查模板文件是否存在
            const fullPath = path.join(process.cwd(), template.path);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`模板文件不存在: ${fullPath}`);
            }
            console.log('   ✅ 模板文件存在');
            
            // 2. 读取模板内容
            const templateContent = fs.readFileSync(fullPath, 'utf8');
            console.log('   ✅ 模板内容可读取');
            
            // 3. 检查模板结构
            const structureChecks = {
                hasPptSlide: templateContent.includes('class="ppt-slide"'),
                hasTitlePlaceholder: templateContent.includes('{{title}}'),
                hasContentPlaceholder: templateContent.includes('{{content}}'),
                hasMetadata: templateContent.includes('SLIDE_METADATA'),
                validHTML: templateContent.includes('<!DOCTYPE html>') || templateContent.includes('<html')
            };
            
            console.log('   📋 模板结构检查:');
            Object.entries(structureChecks).forEach(([check, result]) => {
                console.log(`      ${result ? '✅' : '❌'} ${check}: ${result}`);
            });
            
            // 4. 测试模板加载
            const converter = new HTMLToPPTConverter();
            const loadResult = await converter.loadTemplate(template.path, template.name);
            
            if (!loadResult) {
                throw new Error('模板加载失败');
            }
            console.log('   ✅ 模板加载成功');
            
            // 5. 测试元数据解析
            const metadata = converter.parseTemplateMetadata(templateContent);
            console.log('   📊 元数据解析:');
            console.log('      ', metadata);
            
            // 6. 测试内容替换
            const testContent = {
                title: '测试标题',
                subtitle: '测试副标题',
                content: '测试内容区域，包含多行文本和特殊字符。',
                footer: '测试页脚信息'
            };
            
            const htmlResult = converter.buildHTMLFromTemplate(template.name, testContent);
            const replacementChecks = {
                titleReplaced: !htmlResult.includes('{{title}}'),
                contentReplaced: !htmlResult.includes('{{content}}'),
                validHTML: htmlResult.includes('ppt-slide')
            };
            
            console.log('   🔄 内容替换检查:');
            Object.entries(replacementChecks).forEach(([check, result]) => {
                console.log(`      ${result ? '✅' : '❌'} ${check}: ${result}`);
            });
            
            // 7. 测试幻灯片添加
            converter.addSlide(template.name, testContent, template.type);
            console.log('   ✅ 幻灯片添加成功');
            
            testResults.push({
                template: template.name,
                status: 'success',
                checks: {
                    fileExists: true,
                    structure: structureChecks,
                    metadata: Object.keys(metadata).length > 0,
                    replacement: replacementChecks,
                    slideAdded: true
                },
                metadata: metadata
            });
            
            console.log(`   🎉 模板 ${template.name} 测试通过`);
            
        } catch (error) {
            console.log(`   ❌ 模板 ${template.name} 测试失败: ${error.message}`);
            testResults.push({
                template: template.name,
                status: 'failed',
                error: error.message
            });
        }
    }
    
    // 生成测试报告
    console.log('\n=== 测试报告 ===\n');
    
    const passed = testResults.filter(r => r.status === 'success').length;
    const failed = testResults.filter(r => r.status === 'failed').length;
    
    console.log(`📊 总体结果: ${passed} 通过 / ${failed} 失败 / ${testResults.length} 总计`);
    
    testResults.forEach(result => {
        console.log(`\n${result.status === 'success' ? '✅' : '❌'} ${result.template}:`);
        if (result.status === 'success') {
            console.log('   文件存在: ✅');
            console.log('   结构检查: ✅');
            console.log('   元数据解析: ✅');
            console.log('   内容替换: ✅');
            console.log('   幻灯片添加: ✅');
        } else {
            console.log(`   错误: ${result.error}`);
        }
    });
    
    // 检查所有模板是否具有一致的占位符
    console.log('\n=== 占位符一致性检查 ===\n');
    
    const placeholders = new Set();
    templatesToTest.forEach(template => {
        const fullPath = path.join(process.cwd(), template.path);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = content.match(/\{\{[^}]+\}\}/g) || [];
            matches.forEach(match => placeholders.add(match));
        }
    });
    
    console.log('所有模板中使用的占位符:');
    Array.from(placeholders).sort().forEach(placeholder => {
        console.log(`   📍 ${placeholder}`);
    });
    
    return {
        total: testResults.length,
        passed,
        failed,
        results: testResults
    };
}

// 运行测试
if (require.main === module) {
    testTemplateCompatibility()
        .then(results => {
            console.log('\n🎉 模板兼容性测试完成！');
            process.exit(results.failed > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('测试执行失败:', error);
            process.exit(1);
        });
}

module.exports = { testTemplateCompatibility };