/**
 * @Author: RENAO
 * @Date: 2024-09-27 16:15:45
 * @LastEditTime: 2024-10-28 14:01:56
 * @LastEditors: RENAO
 * @Description:
 * @FilePath: \MSIMEarthSysN\src\components\seatManangement\seatType.js
 * @
 */
// pg_user -- 评估席位
export const List = {
  Informationseat: {
    name: 'QB席', // red_qb
    btnList: [
      [
        { label: '图层面板' },
        { label: '战况统计' },
        { label: '兵力信息' },
        { label: '要素导调' },
        // { label: '自建地标' },
        // { label: '自建空域' },
        // { label: '标牌配置' },
        { label: '系统退出' }
        // { label: '作战资料' },
        // { label: '代码指令' },
        // { label: '指挥文电' }
      ],
      [
        // { label: '数传指挥' },
        // { label: '目标标识' },
        // { label: '关键事件' },
        // { label: '目标情报' },
        // { label: '战损评估' },
        { label: '情报上报' },
        { label: '电磁情报' },
        { label: '目标信息' },
        { label: '威胁等级' }
        // { label: '音视频通话' }
      ]
    ]
  },
  trainingseat: {
    name: '作训席', //红方 作训  red_zx
    btnList: [
      [
        { label: '图层面板' },
        { label: '航线航路' },
        { label: '气象展示' },
        { label: '标牌配置' },
        { label: '系统退出' },
        { label: '战场信息' },
        { label: '代码指令' },
        { label: '指挥文电' }
      ],
      [
        { label: '数传指挥' },
        { label: '作战部署' },
        { label: '关键事件' },
        { label: '战况统计' },
        { label: '协同文电' },
        { label: '作战计划' },
        { label: '作战决心' },
        { label: '兵力信息' },
        { label: '任务计划' },
        { label: '其他数传' }
      ]
    ]
  },
  electronicCountermeasureseat: {
    name: 'DK席', // 红方 电子对抗  red_dd
    btnList: [
      [
        { label: '图层面板' },
        { label: '自建地标' },
        { label: '自建空域' },
        { label: '标牌配置' },
        { label: '系统退出' },
        { label: '作战资料' },
        { label: '代码指令' },
        { label: '指挥文电' },
        { label: '重演' },
        { label: 'XXXX' }
      ],
      [
        { label: '数传指挥' },
        { label: '攻击' },
        { label: '关键事件' },
        { label: '战况统计' },
        { label: '协同文电' },
        { label: '机动' },
        { label: '补充弹药' },
        { label: '兵力信息' },
        { label: '任务计划' },
        { label: '其他数传' }
      ]
    ]
  },
  floorShield: {
    name: 'DF席', // 红方 地防  red_df
    btnList: [
      [
        { label: '图层面板' },
        { label: '自建地标' },
        { label: '自建空域' },
        { label: '标牌配置' },
        { label: '系统退出' },
        { label: '作战资料' },
        { label: '代码指令' },
        { label: '指挥文电' },
        { label: '重演' },
        { label: 'XXXX' }
      ],
      [
        { label: '数传指挥' },
        { label: '攻击' },
        { label: '关键事件' },
        { label: '战况统计' },
        { label: '协同文电' },
        { label: '机动' },
        { label: '补充弹药' },
        { label: '兵力信息' },
        { label: '任务计划' },
        { label: '其他数传' }
      ]
    ]
  },
  //白方指挥控制席
  Commandseat: {
    name: '指挥席', // red_zhkz
    btnList: [
      [
        { label: '图层面板' },
        { label: '航线航路' },
        { label: '气象展示' },
        // { label: '标牌配置' },
        // { label: '战场信息' },
        // { label: '高程信息' },
        { label: '矢量天气' },
        // { label: '代码指令' },
        // { label: '剖面天气' },
        // { label: '层级展示' },
        // { label: '战役级' },
        // { label: '行动级' },
        // { label: '任务级' },
        // { label: '交战级' },
        { label: '链路图例' },
        // { label: '指挥文电' },
        // { label: '重演' }
        { label: '要素导调' },
        { label: '系统退出' }
      ],
      [
        { label: '作战部署' },
        // { label: '关键事件' },
        { label: '战况统计' },
        { label: '兵力信息' },
        // { label: '力量编成' },
        { label: '编成导调' },
        { label: '天气导调' },
        // { label: '要素导调' },
        { label: '裁决结果' },
        // { label: '战损评估' },
        { label: '申请裁决' },
        // { label: '音视频通话' },
        { label: '评估分析' }
      ]
    ]
  },
  //红方指挥控制席
  RedCommandseat: {
    name: '指挥席', // red_zhkz
    btnList: [
      [
        { label: '图层面板' },
        { label: '航线航路' },
        // { label: '气象展示' },
        // { label: '标牌配置' },
        // { label: '战场信息' },
        // { label: '高程信息' },
        { label: '矢量天气' },
        // { label: '代码指令' },
        // { label: '剖面天气' },
        // { label: '层级展示' },
        // { label: '战役级' },
        // { label: '行动级' },
        // { label: '任务级' },
        // { label: '交战级' },
        { label: '链路图例' },
        // { label: '指挥文电' },
        // { label: '重演' }
        { label: '要素导调' },
        { label: '系统退出' }
      ],
      [
        { label: '作战部署' },
        // { label: '关键事件' },
        { label: '战况统计' },
        { label: '兵力信息' },
        // { label: '力量编成' },
        { label: '编成导调' },
        { label: '情报下载' }
        // { label: '天气导调' },
        // { label: '要素导调' },
        // { label: '裁决结果' },
        // { label: '战损评估' },
        // { label: '申请裁决' },
        // { label: '音视频通话' },
        // { label: '评估分析' }
      ]
    ]
  },
  //白方指挥控制席
  BlueCommandseat: {
    name: '指挥席', // red_zhkz
    btnList: [
      [
        { label: '图层面板' },
        { label: '航线航路' },
        // { label: '气象展示' },
        // { label: '标牌配置' },
        // { label: '战场信息' },
        // { label: '高程信息' },
        { label: '矢量天气' },
        // { label: '代码指令' },
        // { label: '剖面天气' },
        // { label: '层级展示' },
        // { label: '战役级' },
        // { label: '行动级' },
        // { label: '任务级' },
        // { label: '交战级' },
        { label: '链路图例' },
        // { label: '指挥文电' },
        // { label: '重演' }
        { label: '要素导调' },
        { label: '系统退出' }
      ],
      [
        { label: '作战部署' },
        // { label: '关键事件' },
        { label: '战况统计' },
        { label: '兵力信息' },
        // { label: '力量编成' },
        { label: '编成导调' },
        { label: '情报下载' }
        // { label: '天气导调' },
        // { label: '要素导调' },
        // { label: '裁决结果' },
        // { label: '战损评估' },
        // { label: '申请裁决' },
        // { label: '音视频通话' },
        // { label: '评估分析' }
      ]
    ]
  },
  twoDimensionalSituation: {
    name: '二维态势',
    btnList: [
      [
        { label: '图层面板' },
        { label: '自建地标' },
        { label: '自建空域' },
        { label: '标牌配置' },
        { label: '系统退出' },
        { label: '作战资料' },
        { label: '代码指令' },
        { label: '指挥文电' },
        { label: '重演' },
        { label: 'XXXX' }
      ],
      [
        { label: '数传指挥' },
        { label: '攻击' },
        { label: '关键事件' },
        { label: '战况统计' },
        { label: '协同文电' },
        { label: '机动' },
        { label: '补充弹药' },
        { label: '兵力信息' },
        { label: '任务计划' },
        { label: '其他数传' }
      ]
    ]
  },
  DimensionalSituation: {
    name: '态势席', // admin_ts
    btnList: [
      [
        { label: '图层面板' },
        { label: '航线航路' },
        // { label: '气象展示' },
        // { label: '标牌配置' },
        // { label: '战场信息' },
        // { label: '高程信息' },
        { label: '矢量天气' },
        // { label: '代码指令' },
        // { label: '剖面天气' },
        // { label: '层级展示' },
        // { label: '战役级' },
        // { label: '行动级' },
        // { label: '任务级' },
        // { label: '交战级' },
        { label: '链路图例' },
        // { label: '实兵显隐' },
        // { label: '指挥文电' },
        // { label: '重演' }
        { label: '要素导调' },
        { label: '系统退出' }
      ],
      [
        { label: '作战部署' },
        // { label: '关键事件' },
        { label: '战况统计' },
        { label: '兵力信息' },
        // { label: '力量编成' },
        // { label: '编成导调' },
        // { label: '天气导调' },
        // { label: '裁决结果' },
        // { label: '战损评估' },
        // { label: '申请裁决' },
        // { label: '音视频通话' },
        { label: '评估分析' }
      ]
    ]
  },
  reservedRedSeat: {
    name: '保障席', //红方保障席
    btnList: [
      [
        { label: '机场气象' },
        { label: '气象资料' },
        { label: '气象分析' },
        { label: '航路分析' },
        { label: '要素导调' },
        { label: '选择线路' },
        { label: '电磁资料' },
        { label: '电磁分析' },
        { label: '机场适飞' },
        { label: '航线适飞' }
      ],
      [
        { label: '图层面板' },
        { label: '作战部署' },
        { label: '战况统计' },
        { label: '兵力信息' },
        // { label: '评估分析' },
        { label: '系统退出' }
      ]
    ]
  },
  DimensionalRedSituation: {
    name: '红方态势席', //红方态势席
    btnList: [
      [
        { label: '图层面板' },
        { label: '航线航路' },
        { label: '要素导调' },
        // { label: '气象展示' },
        // { label: '标牌配置' },
        // { label: '战场信息' },
        // { label: '高程信息' },
        // { label: '矢量天气' },
        // { label: '代码指令' },
        // { label: '剖面天气' },
        // { label: '层级展示' },
        // { label: '战役级' },
        // { label: '行动级' },
        // { label: '任务级' },
        // { label: '交战级' },
        { label: '链路图例' },
        { label: '系统退出' }
        // { label: '实兵显隐' }
        // { label: '指挥文电' },
        // { label: '重演' }
        // { label: '要素导调' }
      ],
      [
        { label: '作战部署' },
        // { label: '关键事件' },
        { label: '战况统计' },
        { label: '兵力信息' }
        // { label: '力量编成' },
        // { label: '编成导调' },
        // { label: '天气导调' },
        // { label: '裁决结果' },
        // { label: '战损评估' },
        // { label: '申请裁决' },
        // { label: '音视频通话' },
        // { label: '评估分析' }
      ]
    ]
  },
  DimensionalBlueSituation: {
    name: '蓝方态势席', //蓝方态势席
    btnList: [
      [
        { label: '图层面板' },
        { label: '航线航路' },
        { label: '要素导调' },
        // { label: '气象展示' },
        // { label: '标牌配置' },
        { label: '链路图例' },
        { label: '系统退出' }
        // { label: '战场信息' },
        // { label: '高程信息' },
        // { label: '矢量天气' },
        // { label: '代码指令' },
        // { label: '剖面天气' },
        // { label: '层级展示' },
        // { label: '战役级' },
        // { label: '行动级' },
        // { label: '任务级' },
        // { label: '交战级' },
        // { label: '实兵显隐' }
        // { label: '指挥文电' },
        // { label: '重演' }
        // { label: '要素导调' }
      ],
      [
        { label: '作战部署' },
        // { label: '关键事件' },
        { label: '战况统计' },
        { label: '兵力信息' }
        // { label: '力量编成' },
        // { label: '编成导调' },
        // { label: '天气导调' },
        // { label: '裁决结果' },
        // { label: '战损评估' },
        // { label: '申请裁决' },
        // { label: '音视频通话' },
        // { label: '评估分析' }
      ]
    ]
  },
  adjudicatoryseatadmin: {
    name: '裁决评估席', // admin_cjpg
    btnList: [
      [
        { label: '图层面板' },
        { label: '航线航路' },
        // { label: '气象展示' },
        // { label: '标牌配置' },
        // { label: '战场信息' },
        // { label: '高程信息' },
        // { label: '矢量天气' },
        // { label: '代码指令' },
        // { label: '剖面天气' },
        // { label: '层级展示' },
        // { label: '战役级' },
        // { label: '行动级' },
        // { label: '任务级' },
        // { label: '交战级' },
        { label: '链路图例' },
        // { label: '指挥文电' },
        // { label: '重演' }
        { label: '要素导调' },
        { label: '系统退出' }
      ],
      [
        { label: '作战部署' },
        // { label: '关键事件' },
        { label: '战况统计' },
        { label: '兵力信息' },
        // { label: '力量编成' },
        // { label: '编成导调' },
        // { label: '天气导调' },
        // { label: '要素导调' },
        // { label: '裁决结果' },
        // { label: '战损评估' },
        // { label: '申请裁决' },
        // { label: '音视频通话' },
        { label: '评估分析' }
      ]
    ]
  }
}
