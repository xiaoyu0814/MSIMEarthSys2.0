/*
 * @Author: root you@example.com
 * @Date: 2024-07-28 10:19:17
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-07-28 10:20:32
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\czml\czmlRenderConfig\nmqConfig.js
 * @Description: 配置模拟器相关初始化
 */

/**
 * 判断模拟器静止状态并优化显示效果，保证模拟器不乱转，需要测试这样做是否会影响渲染效率，比如帧数 和 渲染速度等
 * @param {*} json 模拟器数据
 */
export function mnqConfig(json) {
  let res = {}
  res.json = json
  return res
}
