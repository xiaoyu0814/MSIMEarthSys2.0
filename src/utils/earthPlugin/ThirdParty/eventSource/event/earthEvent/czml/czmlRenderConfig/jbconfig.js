import store from '@/store'
import { join } from 'lodash'

let model = null
let labelImgUrl = 'static/image/billboard/动态目标/planeB.png'
let distanceDisplayCondition = [0, 15e5]
/**
 * 匹配JB模型-前端实现版
 * @param {*} json
 * @returns 配置好精模模型后的CZML
 */
export function JBConfig(json) {
  // 阵营匹配，后续可拓展，暂时红蓝
  let config = { color: 'R', path: 'red' }
  if (json.side === 'blue') {
    config = { color: 'B', path: 'blue' }
  }
  switch (json.type) {
    case 'J-11B':
    case 'J-11B_P6DOF':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20603_歼击机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'Y-9':
    case 'Y-8':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20610_运输机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'JL-10': //jiao10
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20603_歼击机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'FLARE': // 箔条
      model = {
        gltf: 'static/data/gltf/3DModel/grd.glb',
        minimumPixelSize: 50
      }
      break
    case 'SIMPLE_MRM': // 中距导弹 摇杆用
    case 'YJ-63': // 鹰击63
    case 'YJ-63B':
    case 'SM-6': // 标准6地空导弹
    case 'GBU-38': //GBU-38炸弹
    case 'GBU-39': // GBU-39炸弹
    case 'PL-5': // 空空导弹
    case 'PL-8': // 空空导弹
    case 'PL-10': // 空空导弹
    case 'PL-11': // 空空导弹
    case 'PL-12': // 空空导弹
    case 'PL-15': // 空空导弹
    case 'AIM-120A': // 空空导弹
    case 'AIM-9X_BASE': // 空空导弹
    case 'S-8': //火箭弹
      model = {
        gltf: `static/data/gltf/jb/${config.path}/空基巡航导弹${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'RAUAV': // 无人机
      distanceDisplayCondition = [0, 2e5]
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20613_无人机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case '071Destroyer': // 驱逐舰
    case '075Destroyer':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20503_驱逐舰${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'YZ-9': // 运侦9
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20607_侦察机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'YG-9':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20610_运输机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'KJ-500':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20602_预警机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'J-20':
    case 'JZ-8F-2':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20603_歼击机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'H-6K':
    case 'H-6':
    case 'H-6H':
    case 'H-6K_P6DOF':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20605_轰炸机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'F-35A':
    case 'F-35':
    case 'JZ-8F':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20603_歼击机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'F-16V':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20603_歼击机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'EF-18G':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20603_歼击机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'E-2C':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20608_电子干扰机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    // case 'TARGET':
    //   model = {
    //     gltf: `static/data/gltf/jb/${config.path}/20601_指挥机${config.color}.glb`,
    //     minimumPixelSize: 50
    //   }
    //   break

    case 'BurkeDestroyer':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20503_驱逐舰${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'TANK':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/坦克${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'WSF_PLATFORM':
      switch (json.id) {
        // jiao10
        case '<dis>2:3:10':
          model = {
            gltf: `static/data/gltf/jb/${config.path}/20603_歼击机${config.color}.glb`,
            minimumPixelSize: 50
          }
          break
        // y8 y9
        case '<dis>2:3:12':
        case '<dis>2:3:13':
          model = {
            gltf: `static/data/gltf/jb/${config.path}/20610_运输机${config.color}.glb`,
            minimumPixelSize: 50
          }
          break
        // h6k
        case '<dis>2:3:15':
          model = {
            gltf: `static/data/gltf/jb/${config.path}/20605_轰炸机${config.color}.glb`,
            minimumPixelSize: 50
          }
          break
        default:
          break
      }
      break
    case 'BlueFighter':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20603_歼击机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'RedFighter':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20603_歼击机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'JH-7A':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/20603_歼击机${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    case 'GBU-27':
      model = {
        gltf: `static/data/gltf/jb/${config.path}/空基巡航导弹${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
    default:
      model = {
        gltf: `static/data/gltf/jb/${config.path}/不明物体${config.color}.glb`,
        minimumPixelSize: 50
      }
      break
  }
  // 模型通用配置
  model.silhouetteSize = 0
  model.silhouetteColor = {
    rgba: [175, 175, 175, 0]
  }
  return {
    model: model,
    labelImgUrl: labelImgUrl,
    distanceDisplayCondition: distanceDisplayCondition
  }
}

export default JBConfig
