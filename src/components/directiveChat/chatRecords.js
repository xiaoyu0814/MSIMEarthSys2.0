/**
 * 导调指令 - 预设聊天记录配置
 * 每条记录字段说明：
 *  - role:     'user' 为我方发送，'assistant' 为导调回复
 *  - text:     本条记录展示的文字内容
 *  - delay:    点击「确定」后多少秒展示本条记录（绝对秒数）
 *              例如 delay=1 表示点击确定 1 秒后展示，delay=3 表示 3 秒后展示
 *              当前配置为每 1 秒展示一条（delay 1,2,3,4...）
 *
 * 触发方式：在输入框输入「开始执行指令」并点击确定后，下方记录会按 delay 依次累加显示。
 */
export const chatRecords = [
  { role: 'user', text: '彩虹5-1前往22.39663N 120.64918E进行侦查。', delay: 1 },
  { role: 'assistant', text: '指令已确认，正在前往指定位置。', delay: 2 },
  { role: 'user', text: '无侦-7-2朝向方位97度飞行，并对可以目标进行侦查', delay: 3 },
  { role: 'assistant', text: '指令已确认，正在调整航向。', delay: 4 },
  { role: 'user', text: '运雷干-9对霍克雷达进行电磁干扰', delay: 5 },
  { role: 'assistant', text: '收到，开始进行干扰作业。', delay: 6 },
  { role: 'user', text: '东风-15C-1攻击蓝方霍克雷达', delay: 7 },
  { role: 'assistant', text: '收到，正在设定攻击目标。', delay: 8 },
]

// export const chatRecords = [
//   { role: 'user', text: '红方第一梯队向前推进至指定作战区域', delay: 1 },
//   { role: 'assistant', text: '收到，红方第一梯队已开始向前推进，预计5分钟后到达指定区域。', delay: 2 },
//   { role: 'user', text: '蓝方实施电磁干扰，压制对方通信链路', delay: 3 },
//   { role: 'assistant', text: '指令已下发，蓝方电子战单元已启动电磁压制，对方通信链路正在干扰中。', delay: 4 },
//   { role: 'user', text: '请求空中火力支援，打击目标A', delay: 5 },
//   { role: 'assistant', text: '空中火力支援已就位，已锁定目标A，打击指令已下达。', delay: 6 },
//   { role: 'user', text: '各作战单元汇报当前战损情况', delay: 7 },
//   { role: 'assistant', text: '各单元战损汇报完成，红方损失2个作战单元，蓝方损失3个作战单元，指令执行成功。', delay: 8 }
// ]

// 触发关键词
export const PLAY_TRIGGER = '开始'
