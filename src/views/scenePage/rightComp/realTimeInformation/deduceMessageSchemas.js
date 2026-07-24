// ====================================================================
// deduce（异常分析）消息 —— 字段结构定义
// --------------------------------------------------------------------
// 按异常类型 (abnormalTypeCode) 组织字段列表，组件按类型匹配后渲染。
//
// 每个字段对象的结构：
//   {
//     label      : 左侧中文标签 (string, 必填)
//     valueKey   : 对应 newValue 的字段名 (string, 与 transform 二选一)
//     transform  : 自定义取值函数 (ctx) => string/object，用于复杂逻辑
//     type       : 渲染类型
//                  'text'     - 普通文本，过长省略号（默认）
//                  'severity' - 影响等级，显示彩色数字 {level, color, name}
//                  'side'     - 阵营，按中文匹配颜色
//                  'details'  - 详情字段，超长截断，title 显示全文
//     truncateLen: 截断字符数，仅对 'text'/'details' 有效 (number, 可选)
//     showIf     : (ctx) => boolean, 可选，返回 false 则不显示此行
//   }
//
// ctx 参数结构 (由组件在运行时注入)：
//   { newValue, side, name, time, position, sideMap, threatLevels, getTime }
// ====================================================================

// 阵营：英文 → 中文映射（集中管理）
export const SIDE_MAP = {
  red: '红',
  blue: '蓝',
  green: '绿',
  purple: '紫'
}

// 阵营→颜色映射（用于渲染）
export const SIDE_COLOR_MAP = {
  红: '#ff4d4f',
  蓝: '#1890ff',
  绿: '#52c41a',
  紫: '#b488ff'
}

// 默认文本截断长度
const DEFAULT_TRUNCATE = 20

// -----------------------------
// 公共字段定义（按类型复用）
// -----------------------------

// 装备名称（传感器异常用 platformType，其它用 platformCName）
//FLIGHT detectorCnName

const fieldPlatformName = {
  label: '装备名称',
  transform: (ctx) => {
    const name = (ctx.newValue.abnormalTypeCode === 'SENSOR'  
    ? ctx.newValue.detectorCnName
    : ctx.newValue.platformCnName)
    return SIDE_MAP[name] || name || ''
  }
}

// 传感器名称 —— 仅传感器相关异常时显示（SENSOR / SENSOR_CONNECTION_TIMEOUT 等）
const fieldSensorName = {
  label: '传感器名称',
  transform: (ctx) => ctx.newValue.sensorName || '',
  showIf: (ctx) => String(ctx.newValue.abnormalTypeCode).startsWith('SENSOR')
}

// 阵营
const fieldSide = {
  label: '阵营',
  type: 'side',
  transform: (ctx) => {
    const rawSide = (
      ctx.newValue.detectorSide ||
      ctx.side ||
      ''
    )
      .toLowerCase()
      .trim()
    return SIDE_MAP[rawSide] || rawSide || ''
  }
}

// 时间
const fieldTime = {
  label: '时间',
  transform: (ctx) => ctx.getTime(ctx.time, 'HH:mm:ss')
}

// 位置
const fieldPosition = {
  label: '位置',
  transform: (ctx) => {
    const { newValue } = ctx
    const lon = Number(newValue.longitude).toFixed(3)
    const lat = Number(newValue.latitude).toFixed(3)
    const alt = parseInt(Number(newValue.altitude || 0))
    return `${lon}°E,${lat}°N,${alt}m`
  }
}

// 影响类型
const fieldAbnormalType = {
  label: '影响类型',
  valueKey: 'abnormalTypeCName'
}

// 详情
const fieldDetails = {
  label: '详情',
  type: 'details',
  valueKey: 'details',
  truncateLen: DEFAULT_TRUNCATE
}

// 影响等级
const fieldSeverity = {
  label: '影响等级',
  type: 'severity',
  transform: (ctx) => {
    const level = ctx.newValue.severity || 1
    return ctx.threatLevels[level - 1] || { level, color: '#fff', name: '' }
  }
}

// ====================================================================
// 各异常类型的字段结构
// ====================================================================

export const deduceSchemaMap = {
  // -------- 传感器异常 --------
  SENSOR: [
    fieldPlatformName,
    //fieldSide,
    fieldTime,
    fieldPosition,
    //fieldAbnormalType,     // 影响类型
    //fieldSensorName,        // ✓ 传感器名称 —— 紧跟影响类型下面，仅 SENSOR 显示
    fieldDetails,
    //fieldSeverity
  ],

  // -------- 飞机类异常（共用同一结构）--------
  TURBULENCE: [
    fieldPlatformName,
    //fieldSide,
    fieldTime,
    fieldPosition,
    //fieldAbnormalType,
    fieldDetails,
    //fieldSeverity
  ],
  WEIGHTLESS: null,  // 未单独定义时走 fallback
  ALTITUDE_ABNORMAL: null,
  SPEED_ABNORMAL: null,
  FUEL_ABNORMAL: null,
  ATTITUDE_ABNORMAL: null,
  GLOAD_ABNORMAL: null,
  SENSOR_CONNECTION_TIMEOUT: null,
  SENSOR_NO_RESPONSE: null
}

// ====================================================================
// 飞机异常的通用 fallback 结构（任何在上面没有显式定义的飞机异常，都走这个）
// ====================================================================

export const planeAbnormalSchema = [
  fieldPlatformName,
  //fieldSide,
  fieldTime,
  fieldPosition,
  //fieldAbnormalType,
  fieldDetails,
  //fieldSeverity
]

// ====================================================================
// 通用 fallback（异常类型不在上面的映射里时，使用这个）
// ====================================================================

export const defaultSchema = [
  fieldPlatformName,
  //fieldSide,
  fieldTime,
  fieldPosition,
  //fieldAbnormalType,
  fieldDetails,
  //fieldSeverity
]

// ====================================================================
// 入口：按 abnormalTypeCode 匹配 schema
// ====================================================================

export function getDeduceSchema(abnormalTypeCode) {
  if (!abnormalTypeCode) return defaultSchema

  // 1) 精确匹配
  const exact = deduceSchemaMap[abnormalTypeCode]
  if (exact) return exact

  // 2) 传感器相关异常（SENSOR_CONNECTION_TIMEOUT 等） → 走 SENSOR 结构
  if (String(abnormalTypeCode).startsWith('SENSOR')) {
    return deduceSchemaMap.SENSOR
  }

  // 3) 其它 → 走飞机异常通用结构
  return planeAbnormalSchema
}

// ====================================================================
// 将 schema + ctx 转换为渲染用的字段数组（{label, value, type, color, _fullText}）
// 返回值示例：
// [
//   { label: '装备名称', value: 'OpticalSatellite', type: 'text', _fullText: 'OpticalSatellite' },
//   { label: '传感器名称', value: 'opt_sensor', type: 'text', _fullText: 'opt_sensor' },
//   { label: '阵营', value: '红', type: 'side', color: '#ff4d4f', _fullText: '红' },
//   { label: '影响等级', value: '6', type: 'severity', color: '#...', _fullText: '6(较高风险)' },
//   { label: '详情', value: '目标[HAWK_Radar](blue...', type: 'details', _fullText: '完整原文...' },
//   ...
// ]
// ====================================================================

export function buildDeduceFields(schema, ctx) {
  const rows = []
  for (const field of schema) {
    // 条件显示判断
    if (typeof field.showIf === 'function' && !field.showIf(ctx)) continue

    // 取值
    let rawValue
    if (typeof field.transform === 'function') {
      rawValue = field.transform(ctx)
    } else if (field.valueKey) {
      rawValue = ctx.newValue[field.valueKey]
    }
    if (rawValue === undefined || rawValue === null) rawValue = ''

    const type = field.type || 'text'
    const truncateLen =
      typeof field.truncateLen === 'number' ? field.truncateLen : DEFAULT_TRUNCATE

    // 根据类型构建 row
    let row
    if (type === 'severity') {
      // rawValue 是 {level, color, name} 对象
      const sev = typeof rawValue === 'object' && rawValue
        ? rawValue
        : { level: rawValue, color: '#fff', name: '' }
      row = {
        label: field.label,
        value: sev.level,
        color: sev.color || '#fff',
        type: 'severity',
        _fullText: `${sev.level}${sev.name ? '(' + sev.name + ')' : ''}`
      }
    } else if (type === 'side') {
      row = {
        label: field.label,
        value: rawValue,
        color: SIDE_COLOR_MAP[rawValue] || '#ffffff',
        type: 'side',
        _fullText: String(rawValue)
      }
    } else if (type === 'details') {
      const s = String(rawValue == null ? '' : rawValue)
      row = {
        label: field.label,
        value: s.length > truncateLen ? s.slice(0, truncateLen) + '...' : s,
        type: 'details',
        _fullText: s
      }
    } else {
      const s = String(rawValue == null ? '' : rawValue)
      row = {
        label: field.label,
        value: s.length > truncateLen ? s.slice(0, truncateLen) + '...' : s,
        type: 'text',
        _fullText: s
      }
    }
    rows.push(row)
  }
  return rows
}
