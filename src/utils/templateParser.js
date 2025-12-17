/**
 * 模板解析工具
 * 用于解析 HTML 模板中的占位符和元数据
 */

class TemplateParser {
    /**
     * 解析模板中的占位符
     * @param {string} html - HTML 模板内容
     * @returns {Array} 占位符列表
     */
    static parsePlaceholders(html) {
        const placeholderRegex = /\{\{([^}]+)\}\}/g;
        const placeholders = [];
        let match;
        
        while ((match = placeholderRegex.exec(html)) !== null) {
            placeholders.push({
                fullMatch: match[0],
                name: match[1].trim(),
                index: match.index
            });
        }
        
        return placeholders;
    }

    /**
     * 解析模板元数据
     * @param {string} html - HTML 模板内容
     * @returns {Object} 元数据对象
     */
    static parseMetadata(html) {
        const metadataRegex = /<!--\s*SLIDE_METADATA:[\s\S]*?-->/;
        const match = html.match(metadataRegex);
        
        if (!match) {
            return {};
        }

        const metadataContent = match[0]
            .replace(/<!--\s*SLIDE_METADATA:/, '')
            .replace(/-->/g, '')
            .trim();

        const metadata = {};
        const lines = metadataContent.split('\n');
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('-')) {
                const keyValue = trimmedLine.substring(1).trim().split(':');
                if (keyValue.length === 2) {
                    const key = keyValue[0].trim();
                    const value = keyValue[1].trim();
                    metadata[key] = value;
                }
            }
        });

        return metadata;
    }

    /**
     * 替换模板中的占位符
     * @param {string} html - HTML 模板内容
     * @param {Object} data - 替换数据
     * @returns {string} 替换后的 HTML
     */
    static replacePlaceholders(html, data) {
        let result = html;
        
        for (const [key, value] of Object.entries(data)) {
            const placeholder = `{{${key}}}`;
            result = result.replace(new RegExp(placeholder, 'g'), value);
        }
        
        return result;
    }

    /**
     * 验证模板格式
     * @param {string} html - HTML 模板内容
     * @returns {Object} 验证结果
     */
    static validateTemplate(html) {
        const errors = [];
        const warnings = [];

        // 检查幻灯片容器
        if (!html.includes('class="ppt-slide"')) {
            errors.push('缺少必需的幻灯片容器类名: ppt-slide');
        }

        // 检查尺寸设置
        if (!html.includes('1280px') || !html.includes('720px')) {
            warnings.push('建议设置幻灯片尺寸为 1280px × 720px');
        }

        // 检查元数据
        const metadata = this.parseMetadata(html);
        if (!metadata.type) {
            warnings.push('建议添加幻灯片类型元数据');
        }

        // 检查占位符
        const placeholders = this.parsePlaceholders(html);
        if (placeholders.length === 0) {
            warnings.push('模板中没有检测到占位符');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            metadata,
            placeholders: placeholders.map(p => p.name)
        };
    }
}

module.exports = TemplateParser;