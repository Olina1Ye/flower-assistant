import type { ChatMessage } from '../types'

// 你的Replit后端API基础地址（已配置好，无需修改）
const API_BASE = "https://b30abb00-ec9e-47c1-a588-150edf6febeb-3sho10ze6mobd.picard.replit.dev/api";

function normalize(text: string) {
  return text.trim().toLowerCase()
}
function ruleBasedReply(userText: string) {
  const t = normalize(userText)
  const lines: string[] = []
  // 根据不同关键词返回不同的专项建议
  if (t.includes('黄') || t.includes('发黄') || t.includes('黄叶')) {
    lines.push('我来帮你分析黄叶的原因：')
    lines.push('')
    lines.push('首先，检查这三个方面：')
    lines.push('1) 光照：最近是否从散射光改到直晒，或变暗了？')
    lines.push('2) 浇水：土表 2–3cm 是否干了再浇？盆底是否积水？')
    lines.push('3) 根系：是否有闷根/烂根的迹象（酸臭、叶软塌）？')
    lines.push('')
    lines.push('常见黄叶的原因：')
    lines.push('• 下部老叶黄：可能是正常代谢或缺肥（生长期可薄肥一次）')
    lines.push('• 新叶黄、叶脉仍绿：偏缺铁/碱性水土，可用微量元素或换酸性基质')
    lines.push('• 黄且软塌：优先怀疑浇水过多/闷根，先控水 + 通风')
    lines.push('')
    lines.push('建议你拍个照片让我看看具体情况，我能给更准确的诊断。')
    return lines.join('\n')
  }
  if (t.includes('烂') || t.includes('闷') || t.includes('臭') || t.includes('根')) {
    lines.push('关于闷根/烂根的处理：')
    lines.push('')
    lines.push('立即采取的措施：')
    lines.push('1) 停止频繁浇水，确保盆底孔通畅透气')
    lines.push('2) 增加环境通风，可以在花盆周围放个小风扇')
    lines.push('3) 必要时脱盆检查：剪掉黑软根，消毒后换疏松透气土')
    lines.push('')
    lines.push('恢复期养护：')
    lines.push('• 浇水：按「见干见湿」浇，不确定时宁干勿湿')
    lines.push('• 光照：给予散射光，避免突然强光')
    lines.push('• 肥料：根系还未恢复时暂停施肥')
    lines.push('')
    lines.push('一般需要 2-4 周才能看到明显改善，要有耐心。')
    return lines.join('\n')
  }
  if (t.includes('虫') || t.includes('蚜') || t.includes('红蜘蛛') || t.includes('介壳')) {
    lines.push('关于虫害的防治：')
    lines.push('')
    lines.push('快速判断虫害程度：')
    lines.push('• 轻度：叶背只有少数虫迹或丝状物')
    lines.push('• 中度：叶片有明显黄点或粘液')
    lines.push('• 重度：大面积叶片受害，植株萎蔫')
    lines.push('')
    lines.push('处理方案：')
    lines.push('轻度 → 喷清水冲洗叶背 + 棉签酒精擦拭，每 3 天一次')
    lines.push('中度 → 用对症药剂（如吡虫啉、阿维菌素等），按说明书稀释喷施')
    lines.push('重度 → 隔离植株，连续用药 2-3 次，间隔 7-10 天')
    lines.push('')
    lines.push('同时改善环境：提高通风与光照，减少拥挤枝叶。')
    return lines.join('\n')
  }
  if (t.includes('不开花') || t.includes('不花') || t.includes('花苞') || t.includes('落蕾')) {
    lines.push('关于不开花/落蕾的解决方案：')
    lines.push('')
    lines.push('检查这些关键因素：')
    lines.push('1) 光照：多数开花植物需要 6h+ 日照，但避免正午直晒')
    lines.push('2) 温度：避免突然温差，不要经常搬动位置')
    lines.push('3) 肥料：开花前后用磷钾偏高的肥料能促花')
    lines.push('')
    lines.push('常见原因分析：')
    lines.push('• 花苞干枯/落蕾：光照不足或环境干燥，增加湿度')
    lines.push('• 只长叶不开花：可能光照不足或氮肥过多')
    lines.push('• 花期提前结束：温差大或浇水不均导致生理胁迫')
    lines.push('')
    lines.push('促花小贴士：生长期多浇水+施肥，花期来临前逐步增加光照和降低浇水频率。')
    return lines.join('\n')
  }
  if (t.includes('缓苗') || t.includes('蔫') || t.includes('买') || t.includes('新') || t.includes('回家')) {
    lines.push('新买花卉的缓苗指南：')
    lines.push('')
    lines.push('缓苗的第一周很关键：')
    lines.push('1) 光照：先放在散射光处 3-5 天，再慢慢增加光照')
    lines.push('2) 浇水：观察叶片状态，见干见湿，不要急着浇水')
    lines.push('3) 温度：避免放在出风口或极端温度环境')
    lines.push('4) 不施肥：至少等 2-3 周，植株稳定后再考虑施肥')
    lines.push('')
    lines.push('蔫萎的原因分析：')
    lines.push('• 环境变化：从温室到家里，湿度和光照突变')
    lines.push('• 根系受伤：运输过程中根系可能受压')
    lines.push('• 过度关照：频繁浇水或搬动反而加重压力')
    lines.push('')
    lines.push('通常 1-2 周后会逐步恢复，保持耐心！')
    return lines.join('\n')
  }
  if (t.includes('肥') || t.includes('施肥') || t.includes('营养')) {
    lines.push('关于施肥的完整指南：')
    lines.push('')
    lines.push('施肥基础：')
    lines.push('• 频率：生长期（春夏）每 1-2 周一次；秋冬减量或停止')
    lines.push('• 浓度：薄肥勤施，宁淡勿浓（浓肥容易烧根）')
    lines.push('• 类型：生长期用氮肥促叶，开花前用磷钾肥促花')
    lines.push('')
    lines.push('不同情况的施肥方案：')
    lines.push('• 新买的花：缓苗 2-3 周后再施肥')
    lines.push('• 刚换盆的花：等 1 个月后再施肥（新土已有养分）')
    lines.push('• 黄叶缺肥型：可用叶面肥快速补充微量元素')
    lines.push('• 烂根植株：根系还未恢复时停止施肥')
    lines.push('')
    lines.push('施肥后发现植株叶尖焦黑？马上大量浇水稀释，移到阴凉处恢复。')
    return lines.join('\n')
  }
  if (t.includes('光') || t.includes('照') || t.includes('晒') || t.includes('散射光')) {
    lines.push('关于光照的详细建议：')
    lines.push('')
    lines.push('不同植物的光照需求：')
    lines.push('• 强光植物（月季、向日葵）：需要 6h+ 直射日光')
    lines.push('• 中等光照（常见绿植）：4-6h 散射光，避免直晒')
    lines.push('• 耐阴植物（绿萝、蕨类）：明亮散射光即可，不需直晒')
    lines.push('')
    lines.push('光照不足的表现：')
    lines.push('• 植株徒长（茎细长、叶小、节间稀疏）')
    lines.push('• 颜色变淡或不开花')
    lines.push('• 容易滋生病虫害')
    lines.push('')
    lines.push('改善方案：靠近窗边 + 定期转盆 + 必要时用补光灯。')
    return lines.join('\n')
  }
  if (t.includes('浇水') || t.includes('干') || t.includes('湿') || t.includes('水')) {
    lines.push('关于浇水的系统指南：')
    lines.push('')
    lines.push('「见干见湿」的正确理解：')
    lines.push('• 干：用手指戳入土表 2-3cm，感觉土壤干燥')
    lines.push('• 湿：一次浇透，直到盆底出水为止')
    lines.push('• 不要：土壤长期潮湿，也不要彻底干透（易伤根）')
    lines.push('')
    lines.push('不同季节的浇水频率：')
    lines.push('• 春夏（生长期）：1-2 天一次或土干了就浇')
    lines.push('• 秋冬（休眠期）：3-5 天一次，甚至一周一次')
    lines.push('')
    lines.push('常见浇水错误：')
    lines.push('• 天天浇导致烂根：这是最常见的致死原因')
    lines.push('• 只浇表面，下层土仍干：根系吸不到水')
    lines.push('• 浇水时间太晚：冬天傍晚浇水，夜间温度低容易冷根')
    return lines.join('\n')
  }
  // 如果没有特定的关键词，返回一个通用的问诊
  lines.push('我来帮你诊断一下。为了给你更准确的建议，能否告诉我：')
  lines.push('')
  lines.push('1️⃣ 你的花现在的状态是什么样的？')
  lines.push('   比如：叶子发黄、蔫塌、有虫害、不开花 等')
  lines.push('')
  lines.push('2️⃣ 品种是什么？（不知道也可发照片）')
  lines.push('')
  lines.push('3️⃣ 放在哪里？（南窗、北窗、还是室内阴处）')
  lines.push('')
  lines.push('4️⃣ 你多久浇一次水？是否有浇透？')
  lines.push('')
  lines.push('有了这些信息，我就能给你最针对的养护方案！')
  
  return lines.join('\n')
}
export function getStarterSuggestions() {
  return [
    '叶子发黄、土一直湿，怎么办？',
    '新买的花回家两天就蔫了，需要怎么缓苗？',
    '我想让月季多开花，光照和施肥怎么配？',
    '叶背有小虫，像红蜘蛛，要怎么处理？',
  ]
}
export async function fetchAssistantReply(
  messages: ChatMessage[],
  plantContext?: string
): Promise<string> {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  if (!lastUser) return '你可以先描述一下你的花的状态～'
  // 始终调用后端 API，并将规则库作为知识注入
  const knowledge = ruleBasedReply(lastUser.content)
  let systemPrompt = `你是一位经验丰富的养花专家和园艺顾问。用户会问你关于植物养护、花卉管理的问题。\n
你的回答应该：\n1. 根据用户的具体描述进行诊断，不要重复问四个问题\n2. 提供具体、可执行的养护建议\n3. 优先识别问题原因，然后给出解决方案\n4. 使用通俗易懂的语言，避免过于学术\n5. 如果用户信息不足，可以再询问1-2个关键问题\n6. 保持友好、耐心、鼓励的态度\n\n输出格式要求：\n- 仅在需要对比多个项目或展示结构化数据时使用表格\n- 表格前不要加多余空行，不要大量使用换行和留白\n- 表格与上文之间只保留1行空行，紧凑输出\n- 优先使用自然段落和列表，而不是表格\n- 保持markdown格式简洁，避免过度排版`
  if (plantContext) {
    systemPrompt += `\n\n当前用户正在询问关于「${plantContext}」的问题，请优先围绕它来回答。`
  }
  // 核心修改：替换为Replit后端地址，兼容跨域请求
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      ],
      knowledge,
    }),
    // 允许跨域携带凭证，兼容后端CORS配置
    credentials: 'include'
  })
  if (!response.ok) {
    const errorText = await response.text()
    console.error('后端代理错误:', errorText)
    throw new Error(`AI 服务暂时不可用，请稍后再试 (${response.status})`)
  }
  const data = (await response.json()) as {
    output?: {
      text?: string
      finish_reason?: string
    }
    // ... other fields
  }
  const replyText = data.output?.text
  if (replyText && replyText.trim()) {
    return replyText
  }
  throw new Error('AI 未能生成有效的回复，请换个问题试试。')
}