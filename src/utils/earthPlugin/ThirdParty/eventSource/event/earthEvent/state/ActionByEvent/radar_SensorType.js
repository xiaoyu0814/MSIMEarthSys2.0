/*
 * @Author: chenguopeng2 chenguopeng.piesat.cn
 * @Date: 2026-08-03 16:55:10
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-03 17:53:45
 * @FilePath: \MSIMEarthSystem\src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\state\ActionByEvent\radar_sensorType.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {getPlatformSensorVolumes } from '@/service/afsim'


export function radarSensorON(params)
{
  console.log('radarSensorON',params,'opticalSensorONId');
  let id =  params.platformName + 'radar_influence_sensor'
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

  let radarSide
  if (
    curEntity.properties.airplaneAction &&
    curEntity.properties.airplaneAction?._value?.side
  ) {
    radarSide = curEntity.properties.airplaneAction?._value?.side
  } else {
    radarSide = curEntity.properties?.side?._value
  }
  switch (radarSide) {
    case 'red':
      params.color = window.MSIMEarth.Color.RED.withAlpha(0.1)
      break
    case 'blue':
      params.color = window.MSIMEarth.Color.BLUE.withAlpha(0.1)
      break
    case 'green':
      params.color = window.MSIMEarth.Color.GREEN.withAlpha(0.1)
      break
    case 'purple':
      params.color = window.MSIMEarth.Color.PURPLE.withAlpha(0.1)
      break
    default:
      break
  }
  getPlatformSensorVolumes({ platform: params.platformName }).then((res) => {
    if (res.status == 'success') {
      let volumeArr = res.data
      let volume = volumeArr.find((item) => item.Name == params.sensorType)
      params.sensorVolume = volume;
      let beam = volume.Modes[0].Beams[0];
      window.EarthViewer.entities.removeById(id)
      window.EarthViewer.entities.add({
        id: id,
        position: new window.MSIMEarth.CallbackProperty(cp, false),
        ellipsoid: {
          radii: new window.MSIMEarth.Cartesian3(
            beam.RangeMax,
            beam.RangeMax,
            beam.RangeMax
          ),
          innerRadii: new window.MSIMEarth.Cartesian3(10.0, 10.0, 10.0),
          minimumCone: 0.2,
          maximumCone: beam.FOVElevationMax,
          azimuthMinimum:beam.AZimuthMin, 
          azimuthMaximum:beam.AZimuthMax, 
          material: params.color || window.MSIMEarth.Color.WHITE.withAlpha(0.1),
          stackPartitions: 16,
          slicePartitions: 16,
          outline: true
        }
      })
    }
  })
}