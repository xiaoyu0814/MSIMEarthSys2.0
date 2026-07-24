import { getPlatformState, getPlatformWeapons, getPlatformParts } from '@/service/afsim'
/**
 * 获取实体信息，包括位置和姿态
 * @description: 获取实体信息，包括位置和姿态
 * @param id 实体id
 * @returns 实体信息
 */
export async function getEntityInfo(id) {
  let platformState = await getPlatformState({ platform: id })
  console.log('platformState', platformState);
  // let curEn = window.EarthPlugn.entity._GetCZMLEntity(
  //   id,
  //   'MSIMEarthCZMLProcessContainer'
  // )
  // let curH = curEn.properties.airplaneAction._value.heading
  // let curP = curEn.properties.airplaneAction._value.pitch
  // let curR = curEn.properties.airplaneAction._value.roll

  // const position = curEn.position.getValue(
  //   window.EarthViewer.clock.currentTime
  // )
  // let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
  // let cartographic = ellipsoid.cartesianToCartographic(position)
  // let lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
  // let lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
  // let alt = cartographic.height
  // position 转成经纬度
  // 实体信息
  //   {
  //     "Altitude": 1000,
  //     "DamageFactor": 0,
  //     "FireRadius": 0,
  //     "Fuel": 8996.375,
  //     "FuelCapacity": 9000,
  //     "FuelConsumptionRate": 0.25,
  //     "Heading": 4.06208189343503,
  //     "Index": 1,
  //     "Latitude": 25.216130123079918,
  //     "Longitude": 121.82839880417924,
  //     "Mach": 0.41265824478067037,
  //     "Pitch": 0,
  //     "Roll": 0,
  //     "Side": "red",
  //     "SpatialDomain": "air",
  //     "Speed": 138.88888888888889,
  //     "Type": "WZ-9"
  // }
  let data = platformState.data
  return data
}
/**
 * 获取平台武器状况
 * @description: 获取平台武器状况
 * @param id 平台id
 * @returns 平台武器状况
 */
export async function getEntityWeapons(id) {
  let platformState = await getPlatformWeapons({ platform: id })
  console.log('platformState', platformState);
  let data = platformState.data
  return data.weapon_status
}
/**
 * 获取平台零件状况
 * @description: 获取平台零件状况
 * @param id 平台id
 * @returns 平台零件状况
 */
export async function getEntityParts(id) {
  let platformState = await getPlatformParts({ platform: id })
  console.log('platformState', platformState);
  let data = platformState.data
  return data
}