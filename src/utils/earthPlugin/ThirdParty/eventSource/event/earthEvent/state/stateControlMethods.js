import { getPlatformParts, getPlatformSensorVolumes } from '@/service/afsim'
import{ opticalSensorON } from './ActionByEvent/Opt_SensorType'
import{ radarSensorON } from './ActionByEvent/radar_SensorType'
import store from '@/store/index'
const volumeUpdateInterval = 500;
let setInterValTime;
export let sensorInfoDict = {}; // 传感器包络信息-平台名作为键

// 复盘场景下各平台仿真时间监听订阅取消函数（key: platformName, value: unsubscribe）
const airplaneSensorTimeSubscriptions = {};
// 传感器数据存储：按仿真时间整合，避免重复存储
// 结构: { msgMessionTime: { platformName: { volumeData... }, ... }, ... }
export let sensorVolumeTimeData = {};
// 记录上一次存储的仿真时间，用于去重
let lastStoredMsgTime = null;
// 飞机传感器开启，目前只针对CCD
export function airplaneSensorON(params) {
  // console.log('airplaneSensorON',params);

  let id = params.platformName + 'atmospheric_influence_sensor'
  let curPosition, newOrientation, targetPosition
  // 如果目标实体不存在或者位置获取不到则返回
  let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
    params.platformName,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!window.MSIMEarth.defined(curEntity)) return
  let curTime = window.EarthViewer.clock.currentTime
  curPosition = curEntity.position.getValue(curTime)
  if (typeof curPosition === 'undefined') return
  let cf = function (time, result) {

    let sensorInfo = sensorInfoDict[params.platformName];
    
    getPlatformParts({ platform: params.platformName })
      .then((res) => {
        //  Name: 'opt_sensor' 是传感器
        let opt_sensor = res.data.find(
          (item) => item.Name == params.sensorType || item.Name == 'opt_sensor'
        )
        if (opt_sensor.On) {
          // 传感器开启
          let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
            params.platformName,
            'MSIMEarthCZMLProcessContainer'
          )
          if (!window.MSIMEarth.defined(curEntity)) return
          let curTime = window.EarthViewer.clock.currentTime
          let fTime = window.MSIMEarth.JulianDate.addSeconds(
            curTime,
            0.001 * window.EarthViewer.clock.multiplier,
            new window.MSIMEarth.JulianDate()
          )
          curPosition = curEntity.position.getValue(curTime)
          if (!window.MSIMEarth.defined(curPosition)) return
          let fPosition = curEntity.position.getValue(fTime)

          let targetEntity = window.EarthPlugn.entity._GetCZMLEntity(
            params.targetName,
            'MSIMEarthCZMLProcessContainer'
          )
          targetPosition = targetEntity.position.getValue(curTime)
          if (!window.MSIMEarth.defined(targetPosition)) return
          const newVector2 = window.MSIMEarth.Cartesian3.subtract(
            targetPosition,
            curPosition,
            new window.MSIMEarth.Cartesian3()
          )
          const newNormal = window.MSIMEarth.Cartesian3.normalize(
            newVector2,
            new window.MSIMEarth.Cartesian3()
          )
          const newRotationMatrix3 =
            window.MSIMEarth.Transforms.rotationMatrixFromPositionVelocity(
              newVector2,
              newNormal,
              window.MSIMEarth.Ellipsoid.WGS84
            )
          newOrientation =
            window.MSIMEarth.Quaternion.fromRotationMatrix(
              newRotationMatrix3
            )
        } else {
          // 传感器关闭
        }
      })
      .catch((err) => {
        console.log('获取平台渲染图形信息失败', err)
      })
    return newOrientation
  }
  let cp = function () {
    let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
      params.platformName,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(curEntity)) return
    let curTime = window.EarthViewer.clock.currentTime
    curPosition = curEntity.position.getValue(curTime)
    if (typeof curPosition === 'undefined') return
    return curPosition
  }
  getPlatformSensorVolumes({ platform: params.platformName }).then((res) => {
    if (res.status == 'success') {
      let volumeArr = res.data
      // 获取Name为CCD的项
      let volume = volumeArr.find((item) => item.Name == params.sensorType);
      let yaw = volume.Yaw;
      let roll = volume.Roll;
      let pitch = volume.Pitch;
      console.log('volume', volume.Modes[0].Beams[0]);
      let beam = volume.Modes[0].Beams[0];
      window.EarthViewer.entities.removeById(id)
      window.EarthViewer.entities.add({
        id: id,
        position: new window.MSIMEarth.CallbackProperty(cp, false),
        orientation: new window.MSIMEarth.CallbackProperty(cf, false),
        ellipsoid: {
          radii: new window.MSIMEarth.Cartesian3(beam.RangeMax, beam.RangeMax, beam.RangeMax),
          innerRadii: new window.MSIMEarth.Cartesian3(10.0, 10.0, 10.0),
          // minimumClock: beam.ElevationMin / 8,//window.MSIMEarth.Math.toRadians(-7.5),
          // maximumClock: beam.ElevationMax / 8,//window.MSIMEarth.Math.toRadians(7.5),
          minimumClock : beam.FOVAzimuthMax,
          maximumClock : beam.FOVAzimuthMin,
          minimumCone: window.MSIMEarth.Math.toRadians(75.0),
          maximumCone: window.MSIMEarth.Math.toRadians(105.0),
          // material: window.MSIMEarth.Color.DARKCYAN.withAlpha(0.1),
          material: window.MSIMEarth.Color.RED.withAlpha(0.2),
          // material: new window.MSIMEarth.PulseMaterialProperty({
          //   repeat: new window.MSIMEarth.Cartesian2(1.0, 1.0),
          //   color: new window.MSIMEarth.Color(1.0, 0.1, 0.1, 1.0), // new window.MSIMEarth.Color(0.8, 0.1, 0.5, 1.0),
          //   flowSpeed: 35.0,
          //   transparent: true
          // }),
          // material: new window.MSIMEarth.frustumMaterialProperty({
          //   transparent: true
          // }),
          outline: true
        }
      })
    }
  })
}
// 复盘状态飞机传感器开启，目前只针对CCD
export function airplaneSensorONFP(params) {
  let id = params.platformName + 'atmospheric_influence_sensor'
  let curPosition, newOrientation, targetPosition
  // 如果目标实体不存在或者位置获取不到则返回
  let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
    params.platformName,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!window.MSIMEarth.defined(curEntity)) return
  let curTime = window.EarthViewer.clock.currentTime
  curPosition = curEntity.position.getValue(curTime)
  if (!window.MSIMEarth.defined(curPosition)) return
  let cf_fp = function () {
    // 传感器开启
    let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
      params.platformName,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(curEntity)) return
    let curTime = window.EarthViewer.clock.currentTime
    curPosition = curEntity.position.getValue(curTime)
    if (!window.MSIMEarth.defined(curPosition)) return
    let targetEntity = window.EarthPlugn.entity._GetCZMLEntity(
      params.targetName,
      'MSIMEarthCZMLProcessContainer'
    )
    targetPosition = targetEntity.position.getValue(curTime)
    if (!window.MSIMEarth.defined(targetPosition)) return
    const newVector2 = window.MSIMEarth.Cartesian3.subtract(
      targetPosition,
      curPosition,
      new window.MSIMEarth.Cartesian3()
    )
    const newNormal = window.MSIMEarth.Cartesian3.normalize(
      newVector2,
      new window.MSIMEarth.Cartesian3()
    )
    const newRotationMatrix3 =
      window.MSIMEarth.Transforms.rotationMatrixFromPositionVelocity(
        newVector2,
        newNormal,
        window.MSIMEarth.Ellipsoid.WGS84
      )
    newOrientation =
      window.MSIMEarth.Quaternion.fromRotationMatrix(
        newRotationMatrix3
      )
    console.log('复盘遮罩方位', newOrientation);
    return newOrientation
  }
  let cp_fp = function () {
    let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
      params.platformName,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(curEntity)) return
    let curTime = window.EarthViewer.clock.currentTime
    curPosition = curEntity.position.getValue(curTime)
    console.log('复盘遮罩位置', curPosition)
    if (typeof curPosition === 'undefined') return
    return curPosition
  }
  // 复盘状态下基于实体类型匹配对应的遮罩参数
  let curEntityType = curEntity?.properties?.airplaneAction?._value?.type
  if (!curEntityType) return
  let volume = plateformVolumeConfig.find((item) => item.type == curEntityType)
  if (!volume) return
  window.EarthViewer.entities.removeById(id)
  window.EarthViewer.entities.add({
    id: id,
    position: new window.MSIMEarth.CallbackProperty(cp_fp, false),
    orientation: new window.MSIMEarth.CallbackProperty(cf_fp, false),
    ellipsoid: {
      radii: new window.MSIMEarth.Cartesian3(volume.config.volume.RangeMax, volume.config.volume.RangeMax, volume.config.volume.RangeMax),
      innerRadii: new window.MSIMEarth.Cartesian3(10, 10, 10),
      minimumClock: volume.config.volume.ElevationMin / 8,//window.MSIMEarth.Math.toRadians(-7.5),
      maximumClock: volume.config.volume.ElevationMax / 8,//window.MSIMEarth.Math.toRadians(7.5),
      minimumCone: window.MSIMEarth.Math.toRadians(75.0),
      maximumCone: window.MSIMEarth.Math.toRadians(105.0),
      // material: window.MSIMEarth.Color.DARKCYAN.withAlpha(0.1),
      material: window.MSIMEarth.Color.RED.withAlpha(0.2),
      // material: new window.MSIMEarth.PulseMaterialProperty({
      //   repeat: new window.MSIMEarth.Cartesian2(1.0, 1.0),
      //   color: new window.MSIMEarth.Color(1.0, 0.1, 0.1, 1.0), // new window.MSIMEarth.Color(0.8, 0.1, 0.5, 1.0),
      //   flowSpeed: 35.0,
      //   transparent: true
      // }),
      // material: new window.MSIMEarth.frustumMaterialProperty({
      //   transparent: true
      // }),
      outline: true
    }
  })
}

// 复盘状态飞机传感器开启（动态监听仿真时间变化，根据volumeDataDict持续匹配并刷新遮罩）
export function airplaneSensorONFPByTime(params) {
  let id = params.platformName + 'atmospheric_influence_sensor'

  // 若该平台已存在时间监听订阅，先取消旧订阅，避免重复监听
  if (airplaneSensorTimeSubscriptions[params.platformName]) {
    airplaneSensorTimeSubscriptions[params.platformName]()
    delete airplaneSensorTimeSubscriptions[params.platformName]
  }

  // 根据仿真时间从store的volumeDataDict匹配数据并渲染遮罩
  function renderMask() {
    // 先清除旧遮罩，时间变动后渲染新遮罩
    window.EarthViewer.entities.removeById(id)

    // 当前平台实体必须存在且位置可获取
    let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
      params.platformName,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(curEntity)) return
    let curTime = window.EarthViewer.clock.currentTime
    let curPosition = curEntity.position.getValue(curTime)
    if (!window.MSIMEarth.defined(curPosition)) return

    // 从store中获取传感器包络信息字典（全局对象，界面刷新后仍保留）
    const volumeData = store.state.AFSIMModule.volumeDataDict
    if (!volumeData || Object.keys(volumeData).length === 0) {
      console.warn('airplaneSensorONFPByTime: volumeDataDict为空')
      return
    }

    // 根据仿真时间匹配数据
    const msgMessionTime = store.state.sceneModule.msgMessionTime
    let timeData = volumeData[msgMessionTime]
    // 如果直接索引不到，就近匹配最接近的时间点
    if (!timeData) {
      const allKeys = Object.keys(volumeData)
      if (allKeys.length === 0) return
      // 将时间字符串转为时间戳，找最近的
      let targetTs = new Date(msgMessionTime.replace(' ', 'T')).getTime()
      let closestKey = allKeys[0]
      let minDiff = Math.abs(new Date(closestKey.replace(' ', 'T')).getTime() - targetTs)
      for (let i = 1; i < allKeys.length; i++) {
        let diff = Math.abs(new Date(allKeys[i].replace(' ', 'T')).getTime() - targetTs)
        if (diff < minDiff) {
          minDiff = diff
          closestKey = allKeys[i]
        }
      }
      console.log(`airplaneSensorONFPByTime: 就近匹配 ${msgMessionTime} → ${closestKey} (差${minDiff}ms)`)
      timeData = volumeData[closestKey]
      if (!timeData) return
    }
    let platformData = timeData[params.platformName]
    if (!platformData || !platformData.data || platformData.data.length === 0) {
      console.warn(`airplaneSensorONFPByTime: volume.json中平台 ${params.platformName} 无体积数据`)
      return
    }

    // 从体积数据中提取遮罩参数
    let sensorVolume = platformData.data[0]
    let beamConfig = sensorVolume.Modes && sensorVolume.Modes[0] && sensorVolume.Modes[0].Beams && sensorVolume.Modes[0].Beams[0]
    if (!beamConfig) {
      console.warn(`airplaneSensorONFPByTime: 平台 ${params.platformName} 无Beam配置`)
      return
    }

    let newOrientation, targetPosition
    let cf_fp = function () {
      let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
        params.platformName,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!window.MSIMEarth.defined(curEntity)) return
      let curTime = window.EarthViewer.clock.currentTime
      curPosition = curEntity.position.getValue(curTime)
      if (!window.MSIMEarth.defined(curPosition)) return
      let targetEntity = window.EarthPlugn.entity._GetCZMLEntity(
        params.targetName,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!window.MSIMEarth.defined(targetEntity)) return
      targetPosition = targetEntity.position.getValue(curTime)
      if (!window.MSIMEarth.defined(targetPosition)) return
      const newVector2 = window.MSIMEarth.Cartesian3.subtract(
        targetPosition,
        curPosition,
        new window.MSIMEarth.Cartesian3()
      )
      const newNormal = window.MSIMEarth.Cartesian3.normalize(
        newVector2,
        new window.MSIMEarth.Cartesian3()
      )
      const newRotationMatrix3 =
        window.MSIMEarth.Transforms.rotationMatrixFromPositionVelocity(
          newVector2,
          newNormal,
          window.MSIMEarth.Ellipsoid.WGS84
        )
      newOrientation =
        window.MSIMEarth.Quaternion.fromRotationMatrix(
          newRotationMatrix3
        )
      return newOrientation
    }
    let cp_fp = function () {
      let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
        params.platformName,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!window.MSIMEarth.defined(curEntity)) return
      let curTime = window.EarthViewer.clock.currentTime
      curPosition = curEntity.position.getValue(curTime)
      if (typeof curPosition === 'undefined') return
      return curPosition
    }

    // 使用从volume.json中提取的参数创建新遮罩
    window.EarthViewer.entities.add({
      id: id,
      position: new window.MSIMEarth.CallbackProperty(cp_fp, false),
      orientation: new window.MSIMEarth.CallbackProperty(cf_fp, false),
      ellipsoid: {
        radii: new window.MSIMEarth.Cartesian3(
          beamConfig.RangeMax || 0,
          beamConfig.RangeMax || 0,
          beamConfig.RangeMax || 0
        ),
        innerRadii: new window.MSIMEarth.Cartesian3(10, 10, 10),
        minimumClock: beamConfig.ElevationMin != null ? beamConfig.ElevationMin / 8 : 0,
        maximumClock: beamConfig.ElevationMax != null ? beamConfig.ElevationMax / 8 : 0,
        minimumCone: window.MSIMEarth.Math.toRadians(75.0),
        maximumCone: window.MSIMEarth.Math.toRadians(105.0),
        material: window.MSIMEarth.Color.RED.withAlpha(0.2),
        outline: true
      }
    })
  }

  // 立即渲染一次当前仿真时间对应的遮罩
  renderMask()

  // 订阅store变化，监听仿真时间(setMsgMessionTime)变动，变动后清除旧遮罩并渲染新遮罩
  const unsubscribe = store.subscribe((mutation) => {
    if (mutation.type === 'setMsgMessionTime') {
      renderMask()
    }
  })
  airplaneSensorTimeSubscriptions[params.platformName] = unsubscribe
}
export function airplaneSensorOFF(params) {
  let id = params.platformName + 'atmospheric_influence_sensor'
  window.EarthViewer.entities.removeById(id)
  // 取消该平台的仿真时间监听订阅
  if (airplaneSensorTimeSubscriptions[params.platformName]) {
    airplaneSensorTimeSubscriptions[params.platformName]()
    delete airplaneSensorTimeSubscriptions[params.platformName]
  }
}


export function initSuSensorOn(params)
{
  //2026-7-13  params.sensorType修改为params.Data.Name
  switch(params.Data.Name)
  {
    case 'CCD':
    case 'opt_sensor':
    case 'seeker':
      sensorInfoDict[params.Data.PName] = {};
      opticalSensorON({
        platformName: params.Data.PName,
        sensorType: params.Data.Name,
        sensorVolume:null
      })
     break;
    case 'radar':
      // radarSensorON({
      //   platformName: params.Data.PName,
      //   color: null,
      //   sensorType: params.Data.Name,
      //   sensorVolume:null
      // })
    default:
      break
  }
}

export function initSuSensorOff(params)
{
  //2026-7-13  params.sensorType修改为params.Data.Name
  switch(params.Data.Name)
  {
    case 'CCD':
    case 'opt_sensor':
      console.log('initSuSensorOff',params);
      // 清除锥体
        let id = params.Data.PName + 'atmospheric_influence_sensor'
        window.EarthViewer.entities.removeById(id)
      // 清除定时器
      // clearInterval(setInterValTime);
      // setInterValTime = null;
      // 清除传感器包络信息
      delete sensorInfoDict[params.Data.PName]
    break;
    default:
      break
  }
}
// 更新传感器包络信息
export function updateSensorVolume()
{
  for(let platformName in sensorInfoDict){
      let element = sensorInfoDict[platformName];
      getPlatformSensorVolumes({ platform: platformName }).then((res) => {
        if (res.status == 'success') {
          let volumeArr = res.data
          if (volumeArr.length > 0)
          {
            let volume = volumeArr[0];
            element["yaw"]  = volume.Yaw;
            element["roll"]  = volume.Roll;
            element["pitch"] = volume.Pitch;
            element["azimuth"] = volume.Azimuth;
            element["elevation"] = volume.Elevation;
          }
        }
      });
  }
}
// 更新存储传感器包络信息字典
export async function updateSensorInfoDict() {
  const msgMessionTime = store.state.sceneModule.msgMessionTime // 仿真时间
  // 如果仿真时间没有变化，跳过数据存储（避免重复）
  if (msgMessionTime === lastStoredMsgTime) {
    return
  }

  const platformNames = Object.keys(sensorInfoDict)
  if (platformNames.length === 0) {
    lastStoredMsgTime = msgMessionTime
    return
  }

  // 并行请求所有平台的传感器体积数据，单个失败不影响其他平台
  const tasks = platformNames.map((platformName) => {
    const element = sensorInfoDict[platformName]
    return getPlatformSensorVolumes({ platform: platformName })
      .then((res) => {
        if (res.status !== 'success' || !res.data || res.data.length === 0) {
          return { platformName, success: false }
        }
        const volumeArr = res.data
        const volume = volumeArr[0]
        // 更新传感器姿态信息
        Object.assign(element, {
          yaw: volume.Yaw,
          roll: volume.Roll,
          pitch: volume.Pitch,
          azimuth: volume.Azimuth,
          elevation: volume.Elevation
        })
        // 按仿真时间整合存储
        if (!sensorVolumeTimeData[msgMessionTime]) {
          sensorVolumeTimeData[msgMessionTime] = {}
        }
        sensorVolumeTimeData[msgMessionTime][platformName] = {
          data: volumeArr,
          timestamp: Date.now()
        }
        // console.log('sensorVolumeTimeData', sensorVolumeTimeData);
        return { platformName, success: true }
      })
      .catch((error) => {
        console.warn(`updateSensorInfoDict: 平台 ${platformName} 请求失败`, error)
        return { platformName, success: false }
      })
  })

  const results = await Promise.allSettled(tasks)
  // 统计成功数量
  const fulfilled = results.filter(
    (r) => r.status === 'fulfilled' && r.value.success
  ).length
  // 至少有一个平台成功存储才更新时间戳，否则下次相同仿真时间可重试
  if (fulfilled > 0) {
    lastStoredMsgTime = msgMessionTime
  } else {
  }
}
export function DropSensorOFF(params) {
  let id = params.platformName + 'CCD_influence_sensor'
  window.EarthViewer.entities.removeById(id)
}