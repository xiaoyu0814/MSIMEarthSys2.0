/*
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-07-09 14:47:25
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-07-15 18:06:34
 * @FilePath: \MSIMEarthSys\src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\state\ActionByEvent\Opt_SensorType.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import {getPlatformSensorVolumes } from '@/service/afsim'
import {sensorInfoDict} from '../stateControlMethods'
function yprToQuaternion(yaw, pitch, roll) {
  return window.MSIMEarth.Quaternion.fromHeadingPitchRoll(
      new window.MSIMEarth.HeadingPitchRoll(yaw, pitch, roll)
  );
}

function elevationToCone(elevation) {
  return Math.PI / 2 - elevation;
}

function normalizeClock(angle) {
  while (angle < 0) angle += 2 * Math.PI;
  while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
  return angle;
}

// 工具：四元数乘法 q1 * q2
function quatMultiply(q1, q2) {
  return window.MSIMEarth.Quaternion.multiply(
      q1, q2,
      new window.MSIMEarth.Quaternion()
  );
}
export function opticalSensorON(params)
{
  console.log('opticalSensorON',params,'opticalSensorONId');
  let id =  params.platformName + 'atmospheric_influence_sensor'
  let curPosition
  // 如果目标实体不存在或者位置获取不到则返回
  let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
    params.platformName,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!window.MSIMEarth.defined(curEntity)) return
  let curTime = window.EarthViewer.clock.currentTime
  curPosition = curEntity.position.getValue(curTime)
  if (typeof curPosition === 'undefined') return

  //实时姿态
  let cf = function () {
    let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
      params.platformName,
      'MSIMEarthCZMLProcessContainer'
    )

    if (!window.MSIMEarth.defined(curEntity)) return;
    const curTime = window.EarthViewer.clock.currentTime;

     // ① 获取平台本体姿态四元数（飞行器自身航向俯仰滚转）
     const platformOrient = curEntity.orientation.getValue(curTime);
     if (!window.MSIMEarth.defined(platformOrient)) return;

     // ② 从外部传入/缓存你的传感器配置（关键：这里对接你最开始的JSON）
     // 方式A：如果你把sensorVolume存在外层，直接用 volume
     // 方式B：如果回调内拿不到volume，需要把volume存到params全局缓存，下面用params.sensorVolume
    //  const volume = params.sensorVolume;
    //  if (!volume) return platformOrient;
    //  const beam = volume.Modes[0].Beams[0];

     let element = sensorInfoDict[params.platformName];
     const installYaw = element.yaw || 0;
     const installPitch = element.pitch || 0;
     const installRoll = element.roll || 0;
     const installQuat = yprToQuaternion(installYaw, installPitch, installRoll);

     const sensorAzimuth = element.azimuth || 0;
     const sensorElevation = element.elevation || 0;
     const sensorPointQuat = yprToQuaternion(sensorAzimuth, sensorElevation, 0);

    //  const scanAz = (beam.FOVAzimuthMin + beam.FOVAzimuthMax) / 2;
    //  const scanEl = (beam.FOVElevationMin + beam.FOVElevationMax) / 2;
    //  const scanQuat = yprToQuaternion(scanAz, scanEl, 0);

     let finalQuat = quatMultiply(platformOrient, installQuat);
     finalQuat = quatMultiply(finalQuat, sensorPointQuat);
    //  finalQuat = quatMultiply(finalQuat, scanQuat);

     return finalQuat;
  }

  //实时位置回调函数
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
    // console.log('getPlatformSensorVolumes',params.platformName,res);
    if (res.status == 'success') {
      let volumeArr = res.data
      let volume = volumeArr.find((item) => item.Name == params.sensorType)
      params.sensorVolume = volume;
      let beam = volume.Modes[0].Beams[0];
      console.log('volumevolume', volume,'beam', beam)
      window.EarthViewer.entities.removeById(id)
      window.EarthViewer.entities.add({
        id: id,
        position: new window.MSIMEarth.CallbackProperty(cp, false),
        orientation: new window.MSIMEarth.CallbackProperty(cf, false),
        ellipsoid: {
          radii: new window.MSIMEarth.Cartesian3(beam.RangeMax, beam.RangeMax, beam.RangeMax),
          innerRadii: new window.MSIMEarth.Cartesian3(10,10,10),
          minimumClock: (beam.FOVAzimuthMin),
          maximumClock: (beam.FOVAzimuthMax),
          minimumCone: elevationToCone(beam.FOVElevationMax),
          maximumCone: elevationToCone(beam.FOVElevationMin),
          material: window.MSIMEarth.Color.RED.withAlpha(0.4),
          outline: true
        }
      })
    }
  })
}