/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-07 14:02:12
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-06-14 16:44:48
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthActionByEvent\RE_MR.js
 * @Description: 雷达干扰效果
 */
import store from '@/store'
import { radarInterferenceFocus } from '@/service/radar'

// 雷达颜色配置
const radarColorConfig = (options) => {
  let curColors = []
  let probabilities = options.probabilities
  let curRGB = [255, 255, 255]
  let trsparent = 1.0
  switch (options.color) {
    case 'red':
      probabilities.forEach((p) => {
        switch (p) {
          case 10:
            curRGB = [241, 205, 205]
            trsparent = 0.2
            break
          case 9:
            curRGB = [241, 205, 205]
            trsparent = 0.2
            break
          case 8:
            curRGB = [241, 205, 205]
            trsparent = 0.3
            break
          case 7:
            curRGB = [239, 155, 155]
            trsparent = 0.3
            break
          case 6:
            curRGB = [239, 155, 155]
            trsparent = 0.4
            break
          case 5:
            curRGB = [237, 120, 120]
            trsparent = 0.4
            break
          case 4:
            curRGB = [237, 120, 120]
            trsparent = 0.4
            break
          case 3:
            curRGB = [234, 76, 76]
            trsparent = 0.5
            break
          case 2:
            curRGB = [234, 76, 76]
            trsparent = 0.5
            break
          case 1:
            curRGB = [245, 40, 40]
            trsparent = 0.6
            break
          case 0:
            curRGB = [245, 40, 40]
            trsparent = 0.6
            break
          default:
            break
        }
        curColors.push(
          curRGB[0] / 255.0,
          curRGB[1] / 255.0,
          curRGB[2] / 255.0,
          trsparent
        )
      })
      break
    case 'blue':
      probabilities.forEach((p) => {
        switch (p) {
          case 10:
            curRGB = [154, 154, 237]
            trsparent = 0.3
            break
          case 9:
            curRGB = [134, 134, 237]
            trsparent = 0.3
            break
          case 8:
            curRGB = [104, 104, 237]
            trsparent = 0.3
            break
          case 7:
            curRGB = [76, 76, 234]
            trsparent = 0.3
            break
          case 6:
            curRGB = [60, 60, 234]
            trsparent = 0.3
            break
          case 5:
            curRGB = [42, 42, 232]
            trsparent = 0.3
            break
          case 4:
            curRGB = [17, 17, 215]
            trsparent = 0.4
            break
          case 3:
            curRGB = [17, 17, 215]
            trsparent = 0.4
            break
          case 2:
            curRGB = [7, 7, 189]
            trsparent = 0.4
            break
          case 1:
            curRGB = [7, 7, 189]
            trsparent = 0.5
            break
          case 0:
            curRGB = [7, 7, 155]
            trsparent = 0.5
            break
          default:
            break
        }
        curColors.push(
          curRGB[0] / 255.0,
          curRGB[1] / 255.0,
          curRGB[2] / 255.0,
          trsparent
        )
      })
      break
    default:
      break
  }
  let colors = new Float32Array(curColors)
  return colors
}

const setRadar3D = async (options) => {
  // let options = {
  //   url: `./static/data/geojson/radar干扰/distance1000-range5000.json`,
  //   id: 's1tri',
  //   color: 'red'
  // }
  let cusP = new window.EarthPlugn.customPritive(
    window.MSIMEarth,
    window.EarthViewer
  )
  let data = options.data
  let t, t2
  window.EarthViewer.scene.primitives._primitives.forEach((p) => {
    if (p.id && p.id === options.id) {
      t = p
    }
    if (p.id && p.id === options.lineId) {
      t2 = p
    }
  })
  // let curColors = []
  // let c = window.MSIMEarth.Color.BLUE
  // switch (options.color) {
  //   case 'red':
  //     c = window.MSIMEarth.Color.RED
  //     break
  //   case 'blue':
  //     c = window.MSIMEarth.Color.BLUE
  //     break
  //   default:
  //     break
  // }
  // let probabilities = data.probabilities
  // probabilities.forEach((p) => {
  //   switch (p) {
  //     case 10:
  //       curColors.push(c.red, c.green, c.blue, 0.5)
  //       break
  //     case 9:
  //       curColors.push(c.red, c.green, c.blue, 0.5)
  //       break
  //     case 8:
  //       curColors.push(c.red, c.green, c.blue, 0.4)
  //       break
  //     case 7:
  //       curColors.push(c.red, c.green, c.blue, 0.4)
  //       break
  //     case 6:
  //       curColors.push(c.red, c.green, c.blue, 0.3)
  //       break
  //     case 5:
  //       curColors.push(c.red, c.green, c.blue, 0.3)
  //       break
  //     case 4:
  //       curColors.push(c.red, c.green, c.blue, 0.2)
  //       break
  //     case 3:
  //       curColors.push(c.red, c.green, c.blue, 0.2)
  //       break
  //     case 2:
  //       curColors.push(c.red, c.green, c.blue, 0.1)
  //       break
  //     case 1:
  //       curColors.push(c.red, c.green, c.blue, 0.1)
  //       break
  //     case 0:
  //       curColors.push(c.red, c.green, c.blue, 0.1)
  //       break
  //     default:
  //       break
  //   }
  // })
  // let colors = new Float32Array(curColors)
  let colors = radarColorConfig({
    color: options.color,
    probabilities: data.probabilities
  })
  if (typeof t !== 'undefined') {
    window.EarthViewer.scene.primitives.remove(t) //删除雷达遮罩
    // window.EarthViewer.scene.primitives.remove(t2) //删除雷达遮罩包络线
    let rt = cusP.createTriNetPrimitive({
      position: options.position,
      viewer: window.EarthViewer,
      positions: data.positions,
      indices: data.indices,
      colors: colors,
      primitiveType: 'TRIANGLES',
      id: options.id
    })
    window.EarthViewer.scene.primitives.add(rt)
    // let rl = cusP.createTriNetPrimitive({
    //   position: options.position,
    //   viewer: window.EarthViewer,
    //   positions: data.positions,
    //   indices: data.indices,
    //   colors: colors,
    //   primitiveType: 'LINES',
    //   id: options.lineId
    // })
    // window.EarthViewer.scene.primitives.add(rl)
  } else {
    let rt = cusP.createTriNetPrimitive({
      position: options.position,
      viewer: window.EarthViewer,
      positions: data.positions,
      indices: data.indices,
      colors: colors,
      primitiveType: 'TRIANGLES',
      id: options.id
    })
    window.EarthViewer.scene.primitives.add(rt)
    // let rl = cusP.createTriNetPrimitive({
    //   position: options.position,
    //   viewer: window.EarthViewer,
    //   positions: data.positions,
    //   indices: data.indices,
    //   colors: colors,
    //   primitiveType: 'LINES',
    //   id: options.lineId
    // })
    // window.EarthViewer.scene.primitives.add(rl)
  }
}

export default function () {
  const createRadar = (json) => {
    let radarStateList = store.getters.getRadarRenderConfig // 雷达状态集合
    radarStateList.forEach((e) => {
      if (e.radarName === json.data.platname && e.radarState === true) {
        // 判断开启雷达遮罩再渲染，此处的渲染只是展示三维雷达遮罩可视化效果，并不对仿真端造成影响，非导调功能
        let targetEn = window.EarthViewer.entities.getById(json.data.platname)
        if (!window.MSIMEarth.defined(targetEn)) {
          console.log('没有获取到发射雷达的平台实体', json.data.platname)
          return
        }
        console.log('雷达数据', json)
        let position = targetEn.position.getValue(
          window.EarthViewer.clock.currentTime
        )
        let sideColor = targetEn?.properties?.side?._value
        // let position = window.MSIMEarth.Cartesian3.fromDegrees(
        //   115.431,
        //   22.8752,
        //   1200
        // )
        if (
          typeof json.data.data === 'undefined' ||
          typeof json.data.data.indices === 'undefined' ||
          typeof json.data.data.positions === 'undefined' ||
          typeof json.data.data.probabilities === 'undefined'
        ) {
          console.log('错误数据', json)
          return
        }
        if (
          json.data.data.positions.length /
            json.data.data.probabilities.length !==
          3
        ) {
          console.log('错误数据', json)
          return
        }
        if (window.EarthViewer.scene.mode == 2) {
          // 雷达干扰半圆
          window.sceneAction.planeCzmlManage.planeElectronicInterfer({
            sourId: json.data.platname,
            radius: 100000,
            color: sideColor
          })
          // // let id = `SU==sensor==${json.Data.tName}`
          // let id = `${json.Data.tName}_ElectronicInterfer`
          // // 雷达干扰 console.log('缩小', json.tabelDesc)
          // window.sceneAction.planeCzmlManage.changeSensorRange({
          //   id: id,
          //   multiple: 2 / 3,
          //   text: json.tabelDesc
          // })
        } else {
          let options = {
            position: position,
            data: json.data.data,
            id: json.data.platname + 'radar',
            lineId: json.data.platname + 'line',
            color: sideColor
          }
          setRadar3D(options)
        }
        return
      }
    })
  }

  // 恢复
  const resumeRadar = (json) => {
    if (window.EarthViewer.scene.mode == 3) {
      let targetEn = window.EarthViewer.entities.getById(json.Data.tName)
      if (!window.MSIMEarth.defined(targetEn)) {
        console.log('没有获取到发射雷达的平台实体', json)
        return
      }

      let params = {
        platformName: json.Data.tName
      }
      radarInterferenceFocus(params).then(async (res) => {
        if (res.code == 200) {
          console.log('雷达数据恢复!')
        }
      })
    }
  }

  const resumeSingleRadar = (radarName) => {
    console.log(radarName)
    if (window.EarthViewer.scene.mode == 3) {
      let targetEn = window.EarthViewer.entities.getById(radarName)
      if (!window.MSIMEarth.defined(targetEn)) {
        console.log('没有获取到发射雷达的平台实体', json)
        return
      }

      let params = {
        platformName: radarName
      }
      radarInterferenceFocus(params).then(async (res) => {
        if (res.code == 200) {
          console.log('雷达数据恢复!')
        }
      })
    }
  }

  return { createRadar, resumeRadar, resumeSingleRadar }
}
