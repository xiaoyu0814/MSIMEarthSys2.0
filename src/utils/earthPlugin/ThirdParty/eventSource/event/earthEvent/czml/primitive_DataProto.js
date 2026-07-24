import {
  modelConfig,
  changeCzmlModel,
  modelUnknownConfig
} from './czmlRenderConfig/modelConfig/modelMatching'
import { billboardConfig } from './czmlRenderConfig/billboardConfig'
import { getPAStatic } from '@/service/SSE.js'
import { getQuaternion } from './czmlRenderConfig/index'

export default function () {
  const handleWebPrimitiveUpdate = async (json) => {
    if (EarthAPP.SIMInfoCount < 100) {
      // let pr = new window.EarthPlugn.postRender(window.MSIMEarth)
      if (EarthAPP.SIMInfoCount === 0) {
        // pr.createLoadingEffect(window.EarthViewer.scene.postProcessStages)
        // 加载效果
        await getPAStatic({ side: 'admin' }).then((res) => { })
      }
      EarthAPP.SIMInfoCount++
      // if (EarthAPP.SIMInfoCount === 99) {
      //   // 加载效果结束
      //   pr.removePREffect('czm_laod')
      //   pr = null
      // }
      return
    }
    // 查询当前数据关联对象是否存在场景当中
    let p = window.EarthViewer.scene.primitives._primitives.find((item) => {
      if (item.id && item.id === json.Data.Name) {
        return item
      }
    })
    // 如果p存在于场景当中则更新仿真实体
    if (typeof p !== 'undefined') {
      const center = window.MSIMEarth.Cartesian3.fromDegrees(
        Number(json.Data.Lon),
        Number(json.Data.Lat),
        Number(json.Data.Alt)
      )
      const heading = json.Data.HDG
      const pitch = json.Data.Pitch
      const roll = json.Data.Roll
      let hpr = new window.MSIMEarth.HeadingPitchRoll(
        window.MSIMEarth.Math.toRadians(heading - 90),
        window.MSIMEarth.Math.toRadians(pitch),
        window.MSIMEarth.Math.toRadians(roll)
      )
      const transform =
        window.MSIMEarth.Transforms.headingPitchRollToFixedFrame(center, hpr)
      // console.log('更新矩阵', transform, center)
      // window.EarthViewer.entities.add({
      //   position: center,
      //   point: {
      //     pixelSize: 3,
      //     color: window.MSIMEarth.Color.RED
      //   }
      // })
      p.modelMatrix = transform
    } else {
      const center = window.MSIMEarth.Cartesian3.fromDegrees(
        Number(json.Data.Lon),
        Number(json.Data.Lat),
        Number(json.Data.Alt)
      )
      const heading = json.Data.HDG
      const pitch = json.Data.Pitch
      const roll = json.Data.Roll
      let hpr = new window.MSIMEarth.HeadingPitchRoll(
        window.MSIMEarth.Math.toRadians(heading - 90),
        window.MSIMEarth.Math.toRadians(pitch),
        window.MSIMEarth.Math.toRadians(roll)
      )
      const transform =
        window.MSIMEarth.Transforms.headingPitchRollToFixedFrame(center, hpr)
      let res = modelConfig(
        {
          type: json.Data.Type,
          side: json.Data.Side,
          id: json.Data.Name
        },
        2
      )
      res.model.modelMatrix = transform
      res.model.id = json.Data.Name
      // 否则 在场景中创建新的仿真实体
      res.model.silhouetteSize = 0
      window.EarthViewer.scene.primitives.add(
        await window.MSIMEarth.Model.fromGltfAsync(res.model)
        // window.MSIMEarth.Model.fromGltf({
        //   //Gltf和glb模型都用fromGltf
        //   id: json.Data.name,
        //   url: res.model.url, //'static/data/gltf/3DModel/J11.glb',
        //   modelMatrix: transform,
        //   // minimumPixelSize: 512,
        //   // maximumScale: 1500,
        //   scale: 100
        // })
      )
    }
  }

  return { handleWebPrimitiveUpdate }
}
