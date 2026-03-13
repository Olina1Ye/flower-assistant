function cleanMarkdownContent(content) {
  let cleaned = content;
  cleaned = cleaned.replace(/(\n\s*){3,}/g, '\n\n');
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
      if (trimmedLine.startsWith('|')) {
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
  
  return cleanedLines.join('\n').trim();
}

const testContent = `新叶发黄（叶脉绿、叶肉黄）常见原因及对应解决措施如下：\n\n\n\n\n| 原因类型 | 典型表现 | 立即行动 | 注意事项 |\n|---------|---------|---------|--------|\n| 缺铁 | 新叶黄化，叶脉仍绿 | 喷施螯合铁溶液 | 避免中午高温 |`;

console.log('清理前长度:', testContent.length);
console.log('清理后长度:', cleanMarkdownContent(testContent).length);
console.log('清理后:');
console.log(cleanMarkdownContent(testContent));
