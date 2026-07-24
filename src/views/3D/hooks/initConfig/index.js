/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-01 14:24:44
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-09-17 18:50:15
 * @FilePath: \MSIMEarthSysN\src\views\3D\hooks\initConfig\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { seatInit } from './seatInit' // 基于席位开启对应消息初始化
import { plotInit } from './plotInit' // 军标初始化
import { DISInit } from './disInit' // dis协议初始化
import { earthDataInit, computeViewExtend } from './earthInit' // 球上信息初始化
import { timeInit } from './timeInit' // 时间初始配置
import { sceneInit } from './sceneInit' // 场景初始配置
import { eventListenerInit } from './eventListener' // 场景初始配置
import { eventListenerDInit } from './eventListenerD' // 场景初始配置
import { tempSimulationScript } from './tempSimulationScript'
import { restartScene } from './restart'
import { getEntityInfo } from './HUD.js'

export {
  seatInit,
  plotInit,
  DISInit,
  earthDataInit,
  computeViewExtend,
  timeInit,
  sceneInit,
  eventListenerInit,
  eventListenerDInit,
  tempSimulationScript,
  restartScene,
  getEntityInfo
}
