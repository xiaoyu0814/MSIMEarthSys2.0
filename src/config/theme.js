/*
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-08-06 13:50:11
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-28 17:27:03
 * @FilePath: \MSIMEarthSystem\src\config\theme.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 主题配置文件
 * themeType: 1=蓝色, 2=黑色, 3=白色, 4=绿色
 * 默认值 1
 *
 * 切换主题：修改 themeType 的值，并在 main.js 中应用对应 class
 * 或在运行时调用 setTheme(type) 动态切换
 */

// 主题类型：1=蓝色, 2=黑色, 3=白色, 4=绿色
export const themeType = 1

// 主题类型与 class 的映射关系
export const themeClassMap = {
  1: 'theme-blue',
  2: 'theme-black',
  3: 'theme-white',
  4: 'theme-green'
}

/**
 * 根据主题类型获取对应的 class 名称
 * @param {number} type 主题类型 1/2/3/4
 * @returns {string} class 名称
 */
export function getThemeClass(type) {
  return themeClassMap[type] || themeClassMap[1]
}

/**
 * 应用主题到 document.documentElement
 * @param {number} type 主题类型 1/2/3/4
 */
export function setTheme(type) {
  const themeClass = getThemeClass(type)
  const htmlEl = document.documentElement
  // 移除已有的主题 class
  Object.values(themeClassMap).forEach((cls) => {
    htmlEl.classList.remove(cls)
  })
  // 添加新的主题 class
  htmlEl.classList.add(themeClass)
  // 缓存到 localStorage 以便刷新后保持
  localStorage.setItem('themeType', String(type))
}

/**
 * 初始化主题
 * 始终使用 theme.js 中配置的 themeType，确保修改该变量后刷新浏览器即可生效
 * 注意：若调用了 setTheme() 动态切换主题，localStorage 中的缓存不会在刷新后覆盖本文件的配置
 */
export function initTheme() {
  setTheme(themeType)
}

export default {
  themeType,
  themeClassMap,
  getThemeClass,
  setTheme,
  initTheme
}
