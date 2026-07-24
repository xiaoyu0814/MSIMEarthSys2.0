import { getPlatformParts, getPlatformSensorVolumes } from '@/service/afsim'
import{ opticalSensorON } from './ActionByEvent/Opt_SensorType'


const volumeUpdateInterval = 500;
let setInterValTime;
export let sensorInfoDict = {}; // 传感器包络信息-平台名作为键

// 飞机传感器开启，目前只针对CCD
export function airplaneSensorON(params) {
  console.log('airplaneSensorON',params);

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
export function airplaneSensorOFF(params) {
  let id = params.platformName + 'atmospheric_influence_sensor'
  window.EarthViewer.entities.removeById(id)
}


export function initSuSensorOn(params)
{
  //2026-7-13  params.sensorType修改为params.Data.Name
  switch(params.Data.Name)
  {
    case 'CCD':
    case 'opt_sensor':
      console.log('opt_sensoropt_sensor')
      sensorInfoDict[params.Data.PName] = {};
      opticalSensorON({
        platformName: params.Data.PName,
        sensorType: params.Data.Name,
        sensorVolume:null
      })
      // 开启局部包络循环
      // setInterValTime = setInterval(() => {
      //   updateSensorVolume();
      //  }, volumeUpdateInterval);
      // airplaneSensorON({
      //   platformName: params.Data.PName,
      //   sensorType: params.Data.Name,
      //   sensorVolume:null
      // })
    break;
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

export function updateSensorVolume()
{
  for(let platformName in sensorInfoDict)
  {
    let element = sensorInfoDict[platformName];
    console.log('element',element,platformName,sensorInfoDict);
    getPlatformSensorVolumes({ platform: platformName }).then((res) => {
      if (res.status == 'success') {
        console.log('updateSensorVolume',res);
        let volumeArr = res.data
        if (volumeArr.length > 0)
        {
          // 获取Name为CCD的项
          // let volume = volumeArr.find((item) => item.Name == params.sensorType);
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
export function DropSensorOFF(params) {
  let id = params.platformName + 'CCD_influence_sensor'
  window.EarthViewer.entities.removeById(id)
}