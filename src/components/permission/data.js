/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2026-01-08 15:24:11
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-06-23 10:31:17
 */
/*
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-01-07 16:54:39
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-01-07 16:54:44
 * @FilePath: \ExperimentalManagementSubsys\src\components\mainHeader\data.js
 * @Description: 权限列表
 */
export const permissionList = {
  // 管理员
  admin: {
    /**
     * @description:
     * 把需要显示的系统id编号写到systemList数组中就会有该系统的权限，左侧系统列表中会显示该系统按钮
     * 1实验基础数据管理
     * 2仿真实验数据管理
     * 3案例资料数据管理
     * 4数据安全管理
     * 5数据权限管理
     * 6战场实体数据管理
     * @return {*}
     */
    systemList: [1, 2, 3, 4, 5, 6], // 左侧系统权限列表
    /**
     * @description:
     * 把需要显示的子系统id编号写到menuList数组中就会有该子系统的权限，页面顶部菜单列表中会显示该系统按钮
     * 1战场环境数据管理
     * 2作战力量数据管理
     * 3武器装备数据管理
     * 4军事设施数据管理
     * 5作战仿真实验模板管理
     * 6作战仿真实验模型管理
     * 7作战仿真实验指标管理
     * 8作战仿真过程数据管理
     * 9作战案例资料管理
     * 10作战想定数据管理
     * 11作战计划数据管理
     * 12用户管理
     * 13权限管理
     * @return {*}
     */
    menuList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // 顶部子系统菜单权限列表
    /**
     * @description:
     * 把需要显示的系统id编号写到systemList数组中就会有该系统的权限，左侧系统列表中会显示该系统按钮
     * 1右键快捷菜单
     * @return {*}
     */
    buttonList: [1],
    toolbarList: [
      '工具栏',
      '时间控制',
      '复位',
      '二三维切换',
      '图层',
      '系统声音',
      '语音交互',
      '深度',
      '名称定位'
    ],
    bottomBarList: [
      '红方编组',
      '蓝方编组',
      '作战信息',
      '计划导调',
      '辅助信息',
      '兵力添加',
      '想定内容',
      '行动轨迹',
      '指挥链路分析',
      '火力打击链路分析',
      '通信链路分析',
      '电磁频域分析'
    ],
    rightBarList: {
      item: [
        '标签详标',
        '作战半径',
        '火力半径',
        '侦察半径',
        '链路信息',
        '变更位置',
        '弹药配置',
        '目标距离',
        '正北方向',
        '路径',
        '航线'
      ],
      more: true
    }
  },
  //    观察员
  shiyan: {
    systemList: [1, 2, 4, 6],
    menuList: [1, 3, 7, 8, 12, 13],
    buttonList: [1],
    toolbarList: [
      '工具栏',
      '复位',
      '二三维切换',
      '图层',
      '系统声音',
      '深度',
      '名称定位'
    ],
    bottomBarList: ['红方编组', '蓝方编组', '作战信息', '辅助信息', '想定内容'],
    rightBarList: {
      item: [
        '标签详标',
        '作战半径',
        '火力半径',
        '侦察半径',
        '链路信息',
        '目标距离',
        '正北方向'
      ],
      more: false
    }
  },
  //   指挥员
  daotiao: {
    systemList: [1, 2, 4, 6],
    menuList: [1, 3, 7, 8, 12, 13],
    /**
     * @description:
     * 把需要显示的系统id编号写到systemList数组中就会有该系统的权限，左侧系统列表中会显示该系统按钮
     * 1右键快捷菜单
     * @return {*}
     */
    buttonList: [1],
    toolbarList: [
      '工具栏',
      '时间控制',
      '复位',
      '二三维切换',
      '图层',
      '系统声音',
      '语音交互',
      '深度',
      '名称定位'
    ],
    bottomBarList: [
      '红方编组',
      '蓝方编组',
      '作战信息',
      '计划导调',
      '辅助信息',
      '兵力添加',
      '想定内容',
      '行动轨迹',
      '指挥链路分析',
      '火力打击链路分析',
      '通信链路分析',
      '电磁频域分析'
    ],
    rightBarList: {
      item: [
        '标签详标',
        '作战半径',
        '火力半径',
        '侦察半径',
        '链路信息',
        '变更位置',
        '弹药配置',
        '目标距离',
        '正北方向'
      ],
      more: true
    }
  }
}
