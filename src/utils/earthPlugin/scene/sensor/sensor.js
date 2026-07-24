/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-08-13 14:52:52
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-09-08 14:45:57
 */
import CCD from './ccd/ccd'
import IR from './IR/IR'
import EW_Radar from './ew_radar/ew_radar'
import JAM from './jam/jam'
import Acq_radar from './acq_radar/acq_radar'
import Sar from './sar/sar'
import Rwr from './rwr/rwr'
import Laser_designator from './laser_designator/laser_designator'
import Laser_tracker from './laser_tracker/laser_tracker'
import Eyes from './eyes/eyes'
import Milds from './milds/milds'
import Geo_sensor from './geo_sensor/geo_sensor'
import EnvelopePaintSensor from './EnvelopePaintSensor/EnvelopePaintSensor'
export default class Sensor {
  constructor(config) {
    if (!config.earth || !config.viewer) {
      console.log('构建Sensor类时没有传递必要的参数')
    }
    this.earth = config.earth
    this.viewer = config.viewer
  }
  // 初始化CCD类型sensor
  initSensorCCD() {
    const { createCCD } = CCD()
    return createCCD
  }
  initSensorCCDJam() {
    const { createCCDJam } = CCD()
    return createCCDJam
  }
  removeSensorCCD() {
    const { removeCCD } = CCD()
    return removeCCD
  }
  initSensorIR() {
    const { createIR } = IR()
    return createIR
  }
  initSensorIRJam() {
    const { createIRJam } = IR()
    return createIRJam
  }
  removeSensorIR() {
    const { removeIR } = IR()
    return removeIR
  }
  initSensorEW_Radar() {
    const { createEW_Radar } = EW_Radar()
    return createEW_Radar
  }
  initSensorEW_RadarJam() {
    const { createEW_RadarJam } = EW_Radar()
    return createEW_RadarJam
  }
  removeSensorEW_RadarJam() {
    const { removeEW_Radar } = EW_Radar()
    return removeEW_Radar
  }
  initSensorJAM() {
    const { createJAM } = JAM()
    return createJAM
  }
  removeSensorJAM() {
    const { removeJAM } = JAM()
    return removeJAM
  }
  initSensorAcq_radar() {
    const { createAcqRadar } = Acq_radar()
    return createAcqRadar
  }
  initSensorAcq_radarJam() {
    const { acqRadarJam } = Acq_radar()
    return acqRadarJam
  }
  removeSensorAcqRadar() {
    const { removeAcqRadar } = Acq_radar()
    return removeAcqRadar
  }

  // 初始化SAR类型sensor
  initSensorSar() {
    const { createSar } = Sar()
    return createSar
  }
  initSensorSarJam() {
    const { sarJam } = Sar()
    return sarJam
  }
  removeSensorSar() {
    const { removeSar } = Sar()
    return removeSar
  }

  // 初始化RWR类型sensor
  initSensorRwr() {
    const { createRwr } = Rwr()
    return createRwr
  }
  initSensorRwrJam() {
    const { rwrJam } = Rwr()
    return rwrJam
  }
  removeSensorRwr() {
    const { removeRwr } = Rwr()
    return removeRwr
  }
  initSensorLaserDesignator() {
    const { createLaserDesignator } = Laser_designator()
    return createLaserDesignator
  }
  initSensorLaserDesignatorJam() {
    const { laser_designatorJam } = Laser_designator()
    return laser_designatorJam
  }
  removeSensorLaserDesignator() {
    const { removeLaserDesignator } = Laser_designator()
    return removeLaserDesignator
  }
  // 初始化激光跟踪器
  initSensorLaser_tracker() {
    const { createLaser_tracker } = Laser_tracker()
    return createLaser_tracker
  }
  initSensorLaser_trackerJam() {
    const { laser_trackerJam } = Laser_tracker()
    return laser_trackerJam
  }
  removeSensorLaser_tracker() {
    const { removeLaser_tracker } = Laser_tracker()
    return removeLaser_tracker
  }
  // 初始化眼睛
  initSensorEyes() {
    const { createEyes } = Eyes()
    return createEyes
  }
  initSensorEyesJam() {
    const { eyesJam } = Eyes()
    return eyesJam
  }
  removeSensorEyes() {
    const { removeEyes } = Eyes()
    return removeEyes
  }

  // 初始化Milds
  initSensorMilds() {
    const { createMilds } = Milds()
    return createMilds
  }
  initSensorMildsJam() {
    const { mildsJam } = Milds()
    return mildsJam
  }
  removeSensorMilds() {
    const { removeMilds } = Milds()
    return removeMilds
  }

  // 初始化Geo_sensor
  initSensorGeo_sensor() {
    const { createGeo_sensor } = Geo_sensor()
    return createGeo_sensor
  }
  initSensorGeo_sensorJam() {
    const { geo_sensorJam } = Geo_sensor()
    return geo_sensorJam
  }
  removeSensorGeo_sensor() {
    const { removeGeo_sensor } = Geo_sensor()
    return removeGeo_sensor
  }
  // EnvelopePaintSensor
  initSensorEnvelopePaintSensor() {
    const { createEnvelopePaintSensor } = EnvelopePaintSensor()
    return createEnvelopePaintSensor
  }
  removeSensorEnvelopePaintSensor() {
    const { removeEnvelopePaintSensor } = EnvelopePaintSensor()
    return removeEnvelopePaintSensor
  }
}
