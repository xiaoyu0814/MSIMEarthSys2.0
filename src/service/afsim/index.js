import http from '../request/http'
import { URL_CJ } from '../request/config'

//                 getPlatformState
//                 getPlatformMaster Track List
//                 getPlatformWeapons
//                 getPlatformParts
//                 getPlatformSensor Volumes
//                 getPlatformMovementRoutes
//                 getPlatformJammerVolumes

/**
 * 获取平台信息
 * @param {object} data { platform: 'z-10_4' }
 * @returns
 */
export function getPlatformState(data) {
  return http({
    url: `${afsimUrl}/getPlatformState`,
    method: 'get',
    params: data
  })
}
/**
 * 获取平台武器信息
 * @param {*} data { platform: 'z-10_4' }
 * @returns
 */
export function getPlatformWeapons(data) {
  return http({
    url: `${afsimUrl}/getPlatformWeapons`,
    method: 'get',
    params: data
  })
}
/**
 * 获取平台MasterTrackList信息
 * @param {*} data { platform: 'z-10_4' }
 * @returns
 * @description 其中LocationValid为true时，才有Longitude，Latitude, Altitude
                VelocityValid为true时，才有Heading和Speed
                RangeValid为true时，才有Range
                BearingValid为true时，才有Bearing
                ElevationValid为true时，才有Elevation
 */
export function getPlatformMasterTrackList(data) {
  return http({
    url: `${afsimUrl}/getPlatformMasterTrackList`,
    method: 'get',
    params: data
  })
}
/**
 * 获取平台部件信息
 * @param {object} data { platform: 'z-10_4' }
 * @returns
 * @description: PartType为COMM代表通信部件
 *               PartType为MOVER_LAND或MOVER_AIR或MOVER_SURFACE或MOVER_SUBSURFACE或MOVER_SPACE等代表推进器部件
 *               PartType为WEAPON或WEAPON_EXPLICIT为武器部件
 *               PartType为SENSOR代表传感器部件
 *               PartType为RADAR代表雷达传感器部件
 *               PartType为PROCESSOR代表处理器部件
 *               PartType为 PLATFORMPART代表普通部件
 *               PartType为FUEL代表油箱部件
 */
export function getPlatformParts(data) {
  return http({
    url: `${afsimUrl}/getPlatformParts`,
    method: 'get',
    params: data
  })
}

/**
 * 获取平台传感器Volume信息，例如雷达遮罩范围等
 * @param {object} data { platform: '3510_acq_radar' }
 * @returns
 */
export function getPlatformSensorVolumes(data) {
  if (data.platform.slice(-2) === 'PA') {
    return http({
      url: `${afsimUrl}/getPlatformSensorVolumes`,
      method: 'get',
      params: { platform: data.platform.slice(0, -2) }
    })
  } else {
    return http({
      url: `${afsimUrl}/getPlatformSensorVolumes`,
      method: 'get',
      params: data
    })
  }

}
/**
 * 获取平台干扰范围Volume信息，例如wz-7_2等，进一步可查看wz-7平台上携带的挂件
 * @param {object} data { platform: 'wz-7_2' }
 * @returns
 */
export function getPlatformJammerVolumes(data) {
  return http({
    url: `${afsimUrl}/getPlatformJammerVolumes`,
    method: 'get',
    params: data
  })
}

// 获取指挥关系 获取单独目标暂时废弃
// http://192.168.1.110:4322/Command?runScript:{%22callScriptFunction%22:{%22functionName%22:%22opGetCommanderInfo%22,%22parameters%22:[{%22type%22:%22string%22,%22value%22:%22blue_air_defense_taichung_1_large_sam_battalion%22}]}}
/**
 * 获取
 * @returns
 */
// export const getPlatformCommandInfo = () => {
//   return http({
//     url: `${afsimUrl}/getPlatformJammerVolumes`,
//     method: 'get',
//     params: data
//   })
// }

/**
 * 获取平台干扰范围Volume信息，例如wz-7_2等，进一步可查看wz-7平台上携带的挂件
 * @param {object} data { data: "requestCmdRelationship" } 固定参数
 * @returns
 */
export function getPlatformCommandInfo(data) {
  return http({
    url: `${afsimUrl}/Command`,
    method: 'get',
    params: data
  })
}

/**
 * 仿真场景执行时间进度
 * @returns
 */
export function getAFSIMStatus() {
  return http({
    url: `${afsimUrl}/getProgress`,
    method: 'get'
  })
}

// http://localhost:4322/Command?DeleteEntity:{"name":"Fighter"}
// 速度、航向、位置、传感器开关、销毁均使用此接口
export function DeleteEntity(data) {
  return http({
    url: `${afsimUrl}/Command`,
    method: 'get',
    params: data
  })
}

export function setPlateformStatus(data) {
  return http({
    url: `${afsimUrl}/Command`,
    method: 'get',
    params: data
  })
}

// 攻击选定目标 http://localhost:4322/Command?platform:cap_north_2,fire:{%22targetName%22:%22h-6n_1%22}
export function setPlatformAttack(data) {
  return http({
    url: `${afsimUrl}/Command`,
    method: 'get',
    params: data
  })
}
//http://localhost:4322/Command?platform:j-16d_1,jammerAction:{%22target%22:%22cap_south_2%22}
export function setPlatformJam(data) {
  return http({
    url: `${afsimUrl}/Command`,
    method: 'get',
    params: data
  })
}

export function getPlatformMovementRoutes(data) {
  return http({
    url: `${afsimUrl}/getPlatformMovementRoutes`,
    method: 'get',
    params: data
  })
}

export function getSimulationState(ip) {
  return http({
    url: `${ip}/invoke/getSimulationState`,
    method: 'get'
  })
}

// 获取光学传感器大气影响范围包络数据
export function getGetOpticalEnvelope() {
  return http({
    url: `${serverUrls.daqiService}/GetOpticalEnvelope`,
    method: 'get'
  })
}

// 获取红外传感器大气影响范围包络数据
export function getInfraredSignatureEnvelope() {
  return http({
    url: `${serverUrls.daqiService}/GetInfraredSignatureEnvelope`,
    method: 'get'
  })
}
