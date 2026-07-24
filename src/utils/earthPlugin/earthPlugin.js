/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2026-07-15 15:15:34
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-07-15 16:19:53
 * @FilePath: \MSIMEarthSystem\src\utils\earthPlugin\earthPlugin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//const VERSION = '1.0'
// 图层树结构管理
export { default as treeManagement } from './core/treeManagement.js'
// // 基础二三维影像、矢量等的数据加载
export { default as dataManagement } from './core/layer.js'
// // 场景动作
export { default as sceneAction } from './core/sceneAction.js'
// 仿真数据流操控
// 后处理效果合集
export { default as postRender } from './renderer/postRender/postRender.js'
// 基于earth的扩展功能，例如天空盒等
export { default as extend } from './renderer/extend/extend.js'
// 自定义primitive
export { default as customPritive } from './scene/primitive/customPrimitive.js'
// 早期datacontrol类
export { default as DataControl } from './scene/others/dataControl/dataControl.js'
// eventSource
export { default as EventSourceController } from './ThirdParty/eventSource/eventSourceControl.js'
// entity创建类
export { default as entity } from './scene/entity/entity.js'
// entity创建类
export { default as plot } from './ThirdParty/plot/plot.js'
// entity创建类
export { default as CommonMethods } from './ThirdParty/others/commonMethods/commonMethod.js'
// entity创建类
export { default as EffectByTurf } from './scene/others/effectByTurf/effectByTurf.js'
// 编组相关
export { default as ClusterByGroup } from './scene/others/clusterByGroup.js'
// 通用方法类
export { default as CustomTollFunc } from './core/customTollFunc.js'
// 各种sensor创建类
export { default as sensor } from './scene/sensor/sensor.js'
// 鹰眼
export { default as HawkEye3DMap } from './ThirdParty/others/HawkEye3DMap/HawkEye3DMap.js'
// indexDB
export { default as IndexDBControl } from './ThirdParty/indexDB/index.js'

// AFSIM PA事件数据渲染对外方法
export { seaAirJointOperationsPA } from './ThirdParty/eventSource/event/earthEvent/index.js'

// 基于customDatasource的聚合
export { default as clusterByCustomDataSource } from './scene/entity/cluster.js'

// 基于camera控制视角及对应的回调逻辑
export { default as CameraControl } from './ThirdParty/cameraControl/index.js'
// 基于时间监听事件控制
export { default as ListenerControl } from './renderer/ListenerControl/index.js'
// dc渲染
export { default as DCPrimitive } from './scene/primitive/drawcommand/index.js'
// 创建3D风场
export { default as Wind3D } from './scene/particle/wind/Wind3D.js'
