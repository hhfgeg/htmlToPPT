const PptxGenJS = require('pptxgenjs');

/**
 * PPT 文件生成器
 * 使用 pptxgenjs 库生成可编辑的 PowerPoint 文件
 */
class PPTGenerator {
    constructor() {
        this.pptx = new PptxGenJS();
        this.pptx.layout = 'LAYOUT_16x9';
        this.slides = [];
    }

    /**
     * 解析HTML内容并转换为PPT幻灯片
     * @param {string} htmlContent - HTML内容
     * @param {Object} options - 转换选项
     * @returns {Object} 幻灯片数据
     */
    parseHTMLToSlide(htmlContent, options = {}) {
        const slideData = {
            title: '',
            subtitle: '',
            content: [],
            background: options.background || { color: 'FFFFFF' }
        };

        // 简单的HTML解析逻辑
        // 这里可以扩展为更复杂的解析器
        const titleMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
        const subtitleMatch = htmlContent.match(/<p[^>]*class="slide-subtitle"[^>]*>(.*?)<\/p>/i);
        const contentMatch = htmlContent.match(/<div[^>]*class="slide-content"[^>]*>(.*?)<\/div>/is);

        if (titleMatch) {
            slideData.title = this.stripHTML(titleMatch[1]);
        }

        if (subtitleMatch) {
            slideData.subtitle = this.stripHTML(subtitleMatch[1]);
        }

        if (contentMatch) {
            const contentText = this.stripHTML(contentMatch[1]);
            if (contentText) {
                slideData.content.push({ type: 'text', content: contentText });
            }
        }

        // 解析列表项
        const listItems = htmlContent.match(/<li[^>]*>(.*?)<\/li>/gis);
        if (listItems) {
            const listContent = listItems.map(item => 
                this.stripHTML(item.replace(/<li[^>]*>/i, '').replace('<\/li>', ''))
            ).filter(item => item.trim());
            
            if (listContent.length > 0) {
                slideData.content.push({ type: 'list', items: listContent });
            }
        }

        return slideData;
    }

    /**
     * 去除HTML标签
     * @param {string} html - HTML字符串
     * @returns {string} 纯文本
     */
    stripHTML(html) {
        return html.replace(/<[^>]*>/g, '').trim();
    }

    /**
     * 创建标题幻灯片
     * @param {Object} slideData - 幻灯片数据
     * @returns {Object} 幻灯片对象
     */
    createTitleSlide(slideData) {
        const slide = this.pptx.addSlide();
        
        // 设置背景
        if (slideData.background) {
            slide.background = slideData.background;
        }

        // 添加标题
        if (slideData.title) {
            slide.addText(slideData.title, {
                x: 0.5,
                y: 2.0,
                w: '90%',
                h: 1.5,
                fontSize: 44,
                bold: true,
                align: 'center',
                color: '2C3E50'
            });
        }

        // 添加副标题
        if (slideData.subtitle) {
            slide.addText(slideData.subtitle, {
                x: 0.5,
                y: 3.5,
                w: '90%',
                h: 1.0,
                fontSize: 24,
                align: 'center',
                color: '7F8C8D'
            });
        }

        return slide;
    }

    /**
     * 创建内容幻灯片
     * @param {Object} slideData - 幻灯片数据
     * @returns {Object} 幻灯片对象
     */
    createContentSlide(slideData) {
        const slide = this.pptx.addSlide();
        
        // 设置背景
        if (slideData.background) {
            slide.background = slideData.background;
        }

        let currentY = 1.0;

        // 添加标题
        if (slideData.title) {
            slide.addText(slideData.title, {
                x: 0.5,
                y: currentY,
                w: '90%',
                h: 1.0,
                fontSize: 32,
                bold: true,
                color: '2C3E50'
            });
            currentY += 1.2;
        }

        // 添加内容
        slideData.content.forEach(item => {
            if (item.type === 'text') {
                slide.addText(item.content, {
                    x: 0.5,
                    y: currentY,
                    w: '90%',
                    h: 1.5,
                    fontSize: 18,
                    color: '555555',
                    lineSpacing: 1.2
                });
                currentY += 1.8;
            } else if (item.type === 'list') {
                item.items.forEach((listItem, index) => {
                    slide.addText(`• ${listItem}`, {
                        x: 0.7,
                        y: currentY,
                        w: '85%',
                        h: 0.6,
                        fontSize: 16,
                        color: '555555',
                        bullet: { type: 'bullet' }
                    });
                    currentY += 0.7;
                });
                currentY += 0.3;
            }
        });

        return slide;
    }

    /**
     * 添加幻灯片
     * @param {string} htmlContent - HTML内容
     * @param {string} slideType - 幻灯片类型
     * @param {Object} options - 选项
     */
    addSlide(htmlContent, slideType = 'content', options = {}) {
        const slideData = this.parseHTMLToSlide(htmlContent, options);
        
        let slide;
        switch (slideType) {
            case 'title':
                slide = this.createTitleSlide(slideData);
                break;
            case 'content':
            default:
                slide = this.createContentSlide(slideData);
                break;
        }

        this.slides.push({
            data: slideData,
            slideObject: slide,
            type: slideType
        });

        return slide;
    }

    /**
     * 生成PPT文件
     * @param {string} filename - 输出文件名
     * @returns {Promise} 生成结果
     */
    async generate(filename = 'presentation.pptx') {
        try {
            // 设置演示文稿属性
            this.pptx.title = 'HTML to PPT 演示文稿';
            this.pptx.author = 'HTML to PPT Converter';
            this.pptx.company = 'HTML to PPT';

            // 生成文件
            await this.pptx.writeFile({ fileName: filename });
            
            return {
                success: true,
                filename: filename,
                slidesCount: this.slides.length,
                message: 'PPT文件生成成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'PPT文件生成失败'
            };
        }
    }

    /**
     * 获取幻灯片统计信息
     * @returns {Object} 统计信息
     */
    getStats() {
        const stats = {
            totalSlides: this.slides.length,
            slidesByType: {}
        };

        this.slides.forEach(slide => {
            stats.slidesByType[slide.type] = (stats.slidesByType[slide.type] || 0) + 1;
        });

        return stats;
    }

    /**
     * 重置生成器
     */
    reset() {
        this.pptx = new PptxGenJS();
        this.pptx.layout = 'LAYOUT_16x9';
        this.slides = [];
    }
}

module.exports = PPTGenerator;