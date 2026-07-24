import store from '@/store'
// 判断是否显示为JB

let billboard = null
let distanceDisplayCondition = [0, 15e5]
/**
 * 匹配精模模式模型-前端实现版
 * @param {*} json
 * @returns 配置好精模模型后的CZML
 */
export function billboardConfig(json) {
  // 模型匹配
  switch (json.type) {
    case 'J-11B':
    case 'J-11B_P6DOF':
    case 'RAUAV': // 无人机
    case 'YZ-9': // 运侦9
    case 'YG-9':
    case 'YG-8':
    case 'KJ-500':
    case 'J-20':
    case 'H-6K':
    case 'H-6':
    case 'H-6H':
      billboard = {
        image: 'static/image/billboard/plane5.png',
        scale: 1
      }
      break
    case 'F-35A':

    case 'F-22':

    case 'F-16V':

    case 'F-15J':

    case 'EF-18G':

    case 'E-2C':
      billboard = {
        image: 'static/image/billboard/plane2.png',
        scale: 1
      }
      break
    case 'quzhujianchuan': //驱逐舰
    case 'futehao': //福特号航母
      billboard = {
        image: 'static/image/billboard/aircraftcarrier2.png',
        scale: 1
      }
      break
    default:
      billboard = {
        image: 'static/image/billboard/plane5.png',
        scale: 1
      }
      break
  }
  billboard.distanceDisplayCondition = distanceDisplayCondition
  return {
    billboard: billboard
  }
}
