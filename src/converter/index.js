const PPTGenerator = require('./pptGenerator');
const fs = require('fs');
const path = require('path');

/**
 * HTML 到 PPT 转换器
 * 核心转换逻辑
 */

class HTMLToPPTConverter {
    constructor() {
        this.templates = {};
        this.slides = [];
        this.pptGenerator = new PPTGenerator();
        this.outputDir = path.join(process.cwd(), 'output');
        
        // 确保输出目录存在
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    /**
     * 加载模板
     * @param {string} templatePath - 模板文件路径
     * @param {string} templateName - 模板名称
     */
    async loadTemplate(templatePath, templateName) {
        try {
            const fullPath = path.isAbsolute(templatePath) ? 
                templatePath : path.join(process.cwd(), templatePath);
            
            if (!fs.existsSync(fullPath)) {
                throw new Error(`模板文件不存在: ${fullPath}`);
            }
            
            const templateContent = fs.readFileSync(fullPath, 'utf8');
            
            this.templates[templateName] = {
                path: templatePath,
                content: templateContent,
                loaded: true,
                metadata: this.parseTemplateMetadata(templateContent)
            };
            
            console.log(`加载模板成功: ${templateName} from ${templatePath}`);
            return true;
        } catch (error) {
            console.error(`加载模板失败: ${error.message}`);
            return false;
        }
    }

    /**
     * 解析模板元数据
     * @param {string} templateContent - 模板内容
     * @returns {Object} 元数据
     */
    parseTemplateMetadata(templateContent) {
        const metadata = {};
        const metadataMatch = templateContent.match(/<!--\s*SLIDE_METADATA:[\s\S]*?-->/);
        
        if (metadataMatch) {
            const metadataText = metadataMatch[0]
                .replace(/<!--\s*SLIDE_METADATA:/, '')
                .replace(/-->/g, '')
                .trim();
            
            const lines = metadataText.split('\n');
            lines.forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('-')) {
                    const parts = trimmedLine.substring(1).trim().split(':');
                    if (parts.length === 2) {
                        metadata[parts[0].trim()] = parts[1].trim();
                    }
                }
            });
        }
        
        return metadata;
    }

    /**
     * 添加幻灯片
     * @param {string} templateName - 模板名称
     * @param {Object} content - 幻灯片内容
     * @param {string} slideType - 幻灯片类型
     */
    addSlide(templateName, content, slideType = 'content') {
        if (!this.templates[templateName]) {
            throw new Error(`模板 ${templateName} 未加载`);
        }

        // 构建HTML内容
        const htmlContent = this.buildHTMLFromTemplate(templateName, content);
        
        // 添加到PPT生成器
        this.pptGenerator.addSlide(htmlContent, slideType, {
            background: this.getBackgroundForType(slideType)
        });

        this.slides.push({
            template: templateName,
            content: content,
            htmlContent: htmlContent,
            type: slideType,
            timestamp: new Date().toISOString()
        });

        console.log(`添加幻灯片: ${templateName} (类型: ${slideType})`);
    }

    /**
     * 根据模板和内容构建HTML
     * @param {string} templateName - 模板名称
     * @param {Object} content - 内容数据
     * @returns {string} HTML内容
     */
    buildHTMLFromTemplate(templateName, content) {
        const template = this.templates[templateName];
        let html = template.content;
        
        // 替换占位符
        Object.keys(content).forEach(key => {
            const placeholder = `{{${key}}}`;
            html = html.replace(new RegExp(placeholder, 'g'), content[key]);
        });
        
        return html;
    }

    /**
     * 根据幻灯片类型获取背景设置
     * @param {string} slideType - 幻灯片类型
     * @returns {Object} 背景设置
     */
    getBackgroundForType(slideType) {
        const backgrounds = {
            title: { color: '667EEA' },
            content: { color: 'FFFFFF' },
            default: { color: 'F8F9FA' }
        };
        
        return backgrounds[slideType] || backgrounds.default;
    }

    /**
     * 生成 PPT 文件
     * @param {string} filename - 输出文件名
     * @returns {Promise} 生成结果
     */
    async generatePPT(filename = 'presentation.pptx') {
        if (this.slides.length === 0) {
            throw new Error('没有幻灯片可转换');
        }

        const outputPath = path.join(this.outputDir, filename);
        
        console.log(`开始生成 PPT，共 ${this.slides.length} 张幻灯片`);
        console.log(`输出路径: ${outputPath}`);

        try {
            const result = await this.pptGenerator.generate(outputPath);
            
            if (result.success) {
                console.log(`PPT文件生成成功: ${outputPath}`);
                return {
                    success: true,
                    slides: this.slides.length,
                    outputPath: outputPath,
                    fileSize: this.getFileSize(outputPath),
                    stats: this.pptGenerator.getStats()
                };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('PPT文件生成失败:', error.message);
            return {
                success: false,
                error: error.message,
                slides: this.slides.length
            };
        }
    }

    /**
     * 获取文件大小
     * @param {string} filePath - 文件路径
     * @returns {string} 文件大小
     */
    getFileSize(filePath) {
        try {
            const stats = fs.statSync(filePath);
            const sizeInKB = Math.round(stats.size / 1024);
            return `${sizeInKB} KB`;
        } catch (error) {
            return '未知';
        }
    }

    /**
     * 清空幻灯片
     */
    clearSlides() {
        this.slides = [];
        this.pptGenerator.reset();
        console.log('已清空所有幻灯片');
    }

    /**
     * 获取幻灯片统计信息
     */
    getStats() {
        return {
            totalSlides: this.slides.length,
            templates: Object.keys(this.templates).length,
            slidesByTemplate: this.slides.reduce((acc, slide) => {
                acc[slide.template] = (acc[slide.template] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

module.exports = HTMLToPPTConverter;