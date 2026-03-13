// 测试空白清理函数
function cleanMarkdownContent(content) {
  let cleaned = content;
  
  // 首先替换所有连续的空白行
  cleaned = cleaned.replace(/(\n\s*){3,}/g, '\n\n');
  
  // 逐行处理
  const lines = cleaned.split('\n');
  const cleanedLines = [];
  let emptyLineCount = 0;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      emptyLineCount++;
      if (emptyLineCount <= 1) {
        cleanedLines.push('');
      }
    } else {
      // 检查是否是表格行
      if (trimmedLine.startsWith('|')) {
        // 确保表格前最多只有一个空白行
        while (emptyLineCount > 1) {
          if (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1] === '') {
            cleanedLines.pop();
            emptyLineCount--;
          } else {
            break;
          }
        }
      }
      cleanedLines.push(line);
      emptyLineCount = 0;
    }
  }
  
  cleaned = cleanedLines.join('\n');
  cleaned = cleaned.trim();
  
  return cleaned;
}

// 测试案例
const testContent = `新叶发黄（叶脉绿、叶肉黄）常见原因及对应解决措施如下：




| 原因类型 | 典型表现 | 立即行动 | 注意事项 |
|---------|---------|---------|--------|
| 缺铁 | 新叶黄化，叶脉仍绿 | 喷施螯合铁溶液 | 避免中午高温 |
| 缺钾 | 叶片卷曲、变脆 | 叶面喷水增湿 | 停用含氯肥料 |`;

console.log('原始内容:');
console.log(JSON.stringify(testContent));
console.log('\n清理后:');
console.log(JSON.stringify(cleanMarkdownContent(testContent)));
console.log('\n清理后效果:');
console.log(cleanMarkdownContent(testContent));
