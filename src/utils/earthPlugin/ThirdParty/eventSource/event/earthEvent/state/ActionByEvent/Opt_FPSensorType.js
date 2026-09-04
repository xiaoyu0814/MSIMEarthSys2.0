// 引入光学传感器通用工具方法（同Opt_SensorType.js）
import { getPlatformSensorVolumes } from '@/service/afsim'
import { sensorInfoDict } from '../stateControlMethods'
import store from '@/store/index'

// 复盘场景下各平台仿真时间监听订阅取消函数（key: platformName, value: unsubscribe）
const airplaneSensorTimeSubscriptions = {};

/**
 * 工具：Yaw/Pitch/Roll 转四元数
 * @param {number} yaw 航向(弧度)
 * @param {number} pitch 俯仰(弧度)
 * @param {number} roll 滚转(弧度)
 * @returns {MSIMEarth.Quaternion}
 */
function yprToQuaternion(yaw, pitch, roll) {
  return window.MSIMEarth.Quaternion.fromHeadingPitchRoll(
    new window.MSIMEarth.HeadingPitchRoll(yaw, pitch, roll)
  );
}

/**
 * 工具：俯仰角转Cone锥角（MSIMEarth椭球参数转换）
 * @param {number} elevation 俯仰弧度
 * @returns {number} cone弧度
 */
function elevationToCone(elevation) {
  return Math.PI / 2 - elevation;
}

/**
 * 工具：四元数乘法 q1 * q2
 * @param {MSIMEarth.Quaternion} q1
 * @param {MSIMEarth.Quaternion} q2
 * @returns {MSIMEarth.Quaternion}
 */
function quatMultiply(q1, q2) {
  return window.MSIMEarth.Quaternion.multiply(
    q1, q2,
    new window.MSIMEarth.Quaternion()
  );
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
    // 先清除旧遮罩，时间变动后渲染新遮罩（无数据时保持清除状态）
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
      // console.warn('airplaneSensorONFPByTime: volumeDataDict为空')
      return
    }

    // 根据仿真时间匹配数据
    const msgMessionTime = store.state.sceneModule.msgMessionTime
    let timeData = volumeData[msgMessionTime]
    // 如果直接索引不到，就近匹配最接近的时间点（阈值2秒，超过则认为无数据不渲染，避免遮罩无法关闭）
    if (!timeData) {
      const allKeys = Object.keys(volumeData)
      if (allKeys.length === 0) return
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
      const MAX_DIFF_MS = 2000 // 最大允许时间差2秒，超过则遮罩不显示
      if (minDiff > MAX_DIFF_MS) {
        // console.log(`airplaneSensorONFPByTime: 最近时间点差${minDiff}ms > 2s，不渲染遮罩`)
        return
      }
      // console.log(`airplaneSensorONFPByTime: 就近匹配 ${msgMessionTime} → ${closestKey} (差${minDiff}ms)`)
      timeData = volumeData[closestKey]
      if (!timeData) return
    }
    let platformData = timeData[params.platformName]
    if (!platformData || !platformData.data || platformData.data.length === 0) {
      // console.warn(`airplaneSensorONFPByTime: volume.json中平台 ${params.platformName} 无体积数据`)
      return
    }

    // 从体积数据中提取遮罩参数 + 姿态参数（复盘场景下从volume.json取，而非sensorInfoDict）
    let sensorVolume = platformData.data[0]
    let beamConfig = sensorVolume.Modes && sensorVolume.Modes[0] && sensorVolume.Modes[0].Beams && sensorVolume.Modes[0].Beams[0]
    if (!beamConfig) {
      // console.warn(`airplaneSensorONFPByTime: 平台 ${params.platformName} 无Beam配置`)
      return
    }
    // 从volume.json中读取姿态：安装角(Yaw/Pitch/Roll) + 指向角(Azimuth/Elevation)
    const fpInstallYaw = sensorVolume.Yaw ?? 0
    const fpInstallPitch = sensorVolume.Pitch ?? 0
    const fpInstallRoll = sensorVolume.Roll ?? 0
    const fpSensorAzimuth = sensorVolume.Azimuth ?? 0
    const fpSensorElevation = sensorVolume.Elevation ?? 0

    // -------------------------- 位置回调：对齐Opt_SensorType.js cp写法 --------------------------
    let cp_fp = function () {
      let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
        params.platformName,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!window.MSIMEarth.defined(curEntity)) return
      let curTime = window.EarthViewer.clock.currentTime
      const pos = curEntity.position.getValue(curTime)
      if (typeof pos === 'undefined') return
      return pos
    }

    // -------------------------- 姿态回调：使用volume.json数据驱动（与姿态数据完全一致） --------------------------
    let sensorOrientationCallback = function () {
      let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
        params.platformName,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!window.MSIMEarth.defined(curEntity)) return;
      const curTime = window.EarthViewer.clock.currentTime;
      // ① 获取平台本体姿态四元数（飞行器自身航向俯仰滚转）
      const platformOrient = curEntity.orientation.getValue(curTime);
      if (!window.MSIMEarth.defined(platformOrient)) return;

      // ② 从当前匹配到的volume.json sensorVolume中读取安装角、指向角（姿态值随仿真时间变化）
      const installQuat = yprToQuaternion(fpInstallYaw, fpInstallPitch, fpInstallRoll);
      const sensorPointQuat = yprToQuaternion(fpSensorAzimuth, fpSensorElevation, 0);

      // 姿态叠加：平台本体 -> 传感器安装偏差 -> 传感器视轴指向
      let finalQuat = quatMultiply(platformOrient, installQuat);
      finalQuat = quatMultiply(finalQuat, sensorPointQuat);
      return finalQuat;
    }

    // -------------------------- 椭球参数：对齐Opt_SensorType.js锥角换算 --------------------------
    const minCone = elevationToCone(beamConfig.FOVElevationMax ?? 0);
    const maxCone = elevationToCone(beamConfig.FOVElevationMin ?? 0);

    // 使用从volume.json中提取的参数创建新遮罩
    window.EarthViewer.entities.add({
      id: id,
      position: new window.MSIMEarth.CallbackProperty(cp_fp, false),
      orientation: new window.MSIMEarth.CallbackProperty(sensorOrientationCallback, false),
      ellipsoid: {
        radii: new window.MSIMEarth.Cartesian3(
          beamConfig.RangeMax || 0,
          beamConfig.RangeMax || 0,
          beamConfig.RangeMax || 0
        ),
        innerRadii: new window.MSIMEarth.Cartesian3(10, 10, 10),
        minimumClock: beamConfig.FOVAzimuthMin ?? 0,
        maximumClock: beamConfig.FOVAzimuthMax ?? 0,
        minimumCone: minCone,
        maximumCone: maxCone,
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

/**
 * 复盘场景onMounted时自动加载传感器遮罩
 * 根据当前仿真时间(msgMessionTime)从volumeDataDict匹配数据，
 * 遍历该时间点下所有平台，若场景中存在对应实体且有传感器数据，则添加遮罩
 * @returns {Object} { ready: Boolean, loaded: Number, reason: String }
 *   - ready: volumeDataDict和msgMessionTime是否就绪
 *   - loaded: 成功加载遮罩的平台数
 *   - reason: 未加载的原因说明
 */
export function autoLoadSensorMasksByTime() {
  const volumeData = store.state.AFSIMModule.volumeDataDict
  if (!volumeData || Object.keys(volumeData).length === 0) {
    return { ready: false, loaded: 0, reason: 'volumeDataDict为空' }
  }

  const msgMessionTime = store.state.sceneModule.msgMessionTime
  if (!msgMessionTime) {
    return { ready: false, loaded: 0, reason: 'msgMessionTime为空' }
  }

  // 场景和地球插件必须已初始化
  if (!window.EarthPlugn || !window.EarthViewer || !window.MSIMEarth) {
    return { ready: false, loaded: 0, reason: '地球插件未初始化' }
  }

  // 匹配当前仿真时间的数据（含就近匹配逻辑，阈值2秒）
  let timeData = volumeData[msgMessionTime]
  if (!timeData) {
    const allKeys = Object.keys(volumeData)
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
    if (minDiff > 2000) {
      return { ready: true, loaded: 0, reason: `最近时间点差${minDiff}ms>2s` }
    }
    timeData = volumeData[closestKey]
  }

  // 遍历该时间点下所有平台数据，匹配场景实体
  const platformNames = Object.keys(timeData)
  let loadedCount = 0
  let entityExistsCount = 0

  for (const platformName of platformNames) {
    const platformData = timeData[platformName]
    if (!platformData || !platformData.data || platformData.data.length === 0) continue

    // 检查场景中是否存在该实体
    const curEntity = window.EarthPlugn.entity._GetCZMLEntity(
      platformName,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(curEntity)) continue

    entityExistsCount++

    // 实体存在且有传感器数据，加载遮罩（避免重复加载）
    if (!airplaneSensorTimeSubscriptions[platformName]) {
      const sensorName = platformData.data[0].Name
      airplaneSensorONFPByTime({
        platformName: platformName,
        sensorType: sensorName
      })
      loadedCount++
    }
  }

  return {
    ready: true,
    loaded: loadedCount,
    entityCount: entityExistsCount,
    reason: loadedCount > 0 ? '加载成功' : (entityExistsCount > 0 ? '已加载过' : '无匹配实体')
  }
}