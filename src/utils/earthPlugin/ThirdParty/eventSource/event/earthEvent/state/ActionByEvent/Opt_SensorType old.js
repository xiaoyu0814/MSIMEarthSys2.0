/*
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-07-09 14:47:25
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-07-14 14:53:05
 * @FilePath: \MSIMEarthSys\src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\state\ActionByEvent\Opt_SensorType.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import {getPlatformSensorVolumes } from '@/service/afsim'

// 工具：欧拉角(rad)转四元数 Yaw-Pitch-Roll 航空顺序
function yprToQuaternion(yaw, pitch, roll) {
  return window.MSIMEarth.Quaternion.fromHeadingPitchRoll(
      new window.MSIMEarth.HeadingPitchRoll(yaw, pitch, roll)
  );
}

// 工具：四元数乘法 q1 * q2
function quatMultiply(q1, q2) {
  return window.MSIMEarth.Quaternion.multiply(
      q1, q2,
      new window.MSIMEarth.Quaternion()
  );
}
export function opticalSensorON(params,id)
{
  // console.log('opticalSensorON',params,id);
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
     const volume = params.sensorVolume;
     if (!volume) return platformOrient;
     const beam = volume.Modes[0].Beams[0];

     // ③ 传感器固定安装偏置（顶层 Pitch/Roll/Yaw/Tilt）
     const installYaw = volume.Yaw;
     const installPitch = volume.Pitch;
     const installRoll = volume.Roll;
     const installQuat = yprToQuaternion(installYaw, installPitch, installRoll);

     // ④ 当前波束扫描角（示例：默认指向中心0°；如需动态扫描可替换为动态Az/Elev）
     // Azimuth方位(clock)、Elevation俯仰(cone)，取扫描区间中点
     const scanAz = (beam.AzimuthMin + beam.AzimuthMax) / 2;
     const scanEl = (beam.ElevationMin + beam.ElevationMax) / 2;
     // 波束偏转四元数（相对安装基准偏转）
     const scanQuat = yprToQuaternion(scanAz, scanEl, 0);

     // ⑤ 姿态矩阵叠加：本体姿态 * 安装偏置 * 波束扫描偏转
     let finalQuat = quatMultiply(platformOrient, installQuat);
     finalQuat = quatMultiply(finalQuat, scanQuat);

     console.log('finalQuat',finalQuat)
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
    console.log('getPlatformSensorVolumes',params.platformName,res);
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
          // 探测距离范围
          radii: new window.MSIMEarth.Cartesian3(beam.RangeMax, beam.RangeMax, beam.RangeMax),
          // innerRadii: new window.MSIMEarth.Cartesian3(beam.RangeMin, beam.RangeMin, beam.RangeMin),
          innerRadii: new window.MSIMEarth.Cartesian3(10,10,10),
          // clock = Azimuth 方位视场左右边界
          minimumClock: beam.FOVAzimuthMin,
          maximumClock: beam.FOVAzimuthMax,
          // cone = Elevation 俯仰视场上下边界
          minimumCone: beam.FOVElevationMin,
          maximumCone: beam.FOVElevationMax,
          material: window.MSIMEarth.Color.RED.withAlpha(0.4),
          outline: true
        }
        // cylinder:{
        //   length:beam.RangeMax,
        //   topRadius:Math.tan(beam.FOVElevationMax)*beam.RangeMax,
        //   bottomRadius:0,
        //   material: window.MSIMEarth.Color.RED.withAlpha(0.4),
        //   outline: true
        // }
      })
    }
  })
  // getPlatformSensorVolumes({ platform: params.platformName }).then((res) => {
  //   if (res.status == 'success') {
  //     let volumeArr = res.data
  //     let volume = volumeArr.find((item) => item.Name == params.sensorType)
  //     params.sensorVolume = volume;
  //     let beam = volume.Modes[0].Beams[0];
  //     console.log('volumevolume', volume,'beam', beam)

  //     // 相机式矩形截锥体（视锥体）参数计算
  //     const fovVertical   = beam.FOVElevationMax - beam.FOVElevationMin;   // 垂直视场角（弧度）
  //     const fovHorizontal = beam.FOVAzimuthMax - beam.FOVAzimuthMin;       // 水平视场角（弧度）
  //     const aspectRatio   = fovHorizontal / fovVertical;                    // 宽高比
  //     const nearPlane     = beam.RangeMin > 0 ? beam.RangeMin : 10.0;      // 近裁面（须 > 0）
  //     const farPlane      = beam.RangeMax;                                  // 远裁面

  //     window.EarthViewer.entities.removeById(id)
  //     window.EarthViewer.entities.add({
  //       id: id,
  //       position: new window.MSIMEarth.CallbackProperty(cp, false),
  //       orientation: new window.MSIMEarth.CallbackProperty(cf, false),
  //       frustum: {
  //         fov: fovVertical,
  //         aspectRatio: aspectRatio,
  //         near: nearPlane,
  //         far: farPlane,
  //         material: window.MSIMEarth.Color.RED.withAlpha(0.4),
  //         outline: true,
  //         outlineColor: window.MSIMEarth.Color.RED
  //       }
  //     })
  //   }
  // })
}