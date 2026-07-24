import store from '@/store'
import axios from 'axios'
// 判断是否显示为JB
export function renderJB(json) {
  if (store.state.sceneModule.showJB) {
    // JB模式
    json[1].billboard.show = true
    json[1].model.show = false
  }
}
let labelImgUrl = 'static/image/billboard/动态目标/planeB.png'
/**
 * 匹配精模模式模型-前端实现版
 * @param {*} json
 * @param {number} mode 构建模型模式 0为CZML 1 为entity
 * @returns 配置好精模模型后的CZML
 */
export function modelConfig(json, mode) {
  let model = null //模型匹配
  // 1.********** 平台配置信息 **********
  //console.log('默认阵营', json.side)
  let plateformConfigInfo = configPlateformCHNName(json.id) //平台配置信息，从csv配置文件获取，后续逐步从场景配置系统配置
  if (plateformConfigInfo.camp) {
    //console.log('CSV中阵营', plateformConfigInfo.camp)
    json.side = plateformConfigInfo.camp
  }
  let chineseName = ''
  if (plateformConfigInfo.name) {
    //中文名称匹配
    chineseName = plateformConfigInfo.name
  } else {
    chineseName = plateformConfigInfo
  }
  //更新平台阵营信息，如果配置文件配置则颜色表达以配置文件为准
  // let chineseName = plateformConfigInfo.name //中文名称匹配
  if (chineseName == json.id) {
    chineseName = configPlateformCHNName2(json.id)
  }
  let sideColor = colorConfig(json.side)
  // 2.********** 模型匹配 **********
  // 转义模型类型（新的规则定义好后可去除改步骤）
  let type = replaceTypeValue(json.type)
  // 从初始时加载的模型匹配文件内匹配当前类型模型配置信息
  const { modelBasicConfig, modelGeneralConfig } =
    store.state.sceneModule.modelConfigValue
  let curModelConfig = modelBasicConfig[type]
  // 判断是否从模型匹配文件中获取对应模型配置信息，如果curModelConfig === 'undefined'则需要手动扩展模型库
  if (typeof curModelConfig === 'undefined') {
    console.log(`类型${type}不存在，请先扩展模型类型,暂时试用通用模型配置替代`)
    curModelConfig = {
      MODEL: {
        modelname: '3DModel/pyramid.glb',
        minimumPixelSize: 10,
        scale: 0.1
      },
      labelDisplayByDistance: [0, 30e3]
    }
    // return
  }
  model = curModelConfig?.MODEL
  // 如果没有拿到模型则使用pyramid.glb模型展示，此时需要检查匹配文件并确保模型存在
  if (typeof model === 'undefined' || model === null) {
    // 未匹配到模型
    model = {
      gltf: 'static/data/gltf/3DModel/pyramid.glb',
      uri: 'static/data/gltf/3DModel/pyramid.glb'
    }
  }
  // 关联模型地址
  model.gltf = EarthAPP.baseModelUrl + model.modelname
  // 根据当前模型信息决定是否使用模型通用设置
  if (typeof model.silhouetteColor === 'undefined') {
    if (!model.silhouetteColor) {
      model.silhouetteColor = modelGeneralConfig.silhouetteColor
    }
    if (!model.silhouetteSize) {
      model.silhouetteSize = modelGeneralConfig.silhouetteSize // 如果时JB则此处为0
    }
  }
  // 后续要拓展判定逻辑，JB模式不设置Blend
  model.colorBlendAmount = modelGeneralConfig.colorBlendAmount
  model.colorBlendMode = modelGeneralConfig.colorBlendMode
  if (typeof model.minimumPixelSize === 'undefined') {
    model.minimumPixelSize = modelGeneralConfig.minimumPixelSize
  }
  if (typeof model.scale === 'undefined') {
    model.scale = modelGeneralConfig.scale
  }

  model.distanceDisplayCondition = modelGeneralConfig.distanceDisplayCondition
  model.maximumScale = modelGeneralConfig.maximumScale
  model.color = sideColor
  // 当前模型实体对应label或billboard的显隐距离控制值
  let labelDistanceDisplay = modelGeneralConfig.labelDistanceDisplay
  if (curModelConfig.labelDisplayByDistance) {
    labelDistanceDisplay = curModelConfig.labelDisplayByDistance
  }
  // mode1为直接使用entity callback 模式 mode2为primitive模式，默认CZML模式
  if (mode === 1 || mode === 2) {
    // 基于entity或primitive赋值模式重构model
    let priModel = createModelByMode(model, mode)
    return {
      model: priModel,
      labelImgUrl: labelImgUrl,
      labelDistanceDisplay: labelDistanceDisplay,
      chineseName: chineseName,
      side: json.side
    }
  }
  // 根据全局变量放大或缩小模型的minimumPixelSize和scale
  // model.minimumPixelSize = model.minimumPixelSize * modelGeneralConfig.minimumPixelSizeScale
  // 基于最初的czml格式构建model
  return {
    model: model,
    labelImgUrl: labelImgUrl,
    labelDistanceDisplay: labelDistanceDisplay,
    chineseName: chineseName,
    side: json.side
  }
}
/**
 * 匹配JB模式模型-前端实现版
 * @param {*} json
 * @param {number} mode 构建模型模式 0为CZML 1 为entity
 * @returns 配置好精模模型后的CZML
 */
function JBConfig(json, mode) {
  let model = null
  // 转义模型类型（新的规则定义好后可去除改步骤）
  let type = replaceTypeValue(json.type)
  // 从初始时加载的模型匹配文件内匹配当前类型模型配置信息
  const { modelBasicConfig, modelGeneralConfig } =
    store.state.sceneModule.modelConfigJBValue
  let curModelConfig = modelBasicConfig[type]
  // 判断是否从模型匹配文件中获取对应模型配置信息，如果curModelConfig === 'undefined'则需要手动扩展模型库
  if (typeof curModelConfig === 'undefined') {
    console.log(`类型${type}不存在，请先扩展模型类型`)
    return
  }
  model = curModelConfig?.MODEL
  // 如果没有拿到模型则使用pyramid.glb模型展示，此时需要检查匹配文件并确保模型存在
  if (typeof model === 'undefined' || model === null) {
    // 未匹配到模型
    model = {
      gltf: 'static/data/gltf/3DModel/pyramid.glb',
      uri: 'static/data/gltf/3DModel/pyramid.glb'
    }
  }
  // 关联模型地址
  model.gltf = EarthAPP.baseModelUrl + model.modelname
  console.log('jbms', model.gltf)
  // 根据当前模型信息决定是否使用模型通用设置
  if (typeof model.silhouetteColor === 'undefined') {
    if (!model.silhouetteColor) {
      model.silhouetteColor = modelGeneralConfig.silhouetteColor
    }
    if (!model.silhouetteSize) {
      model.silhouetteSize = modelGeneralConfig.silhouetteSize // 如果时JB则此处为0
    }
  }
  // 后续要拓展判定逻辑，JB模式不设置Blend
  model.colorBlendAmount = modelGeneralConfig.colorBlendAmount
  model.colorBlendMode = modelGeneralConfig.colorBlendMode
  if (typeof model.minimumPixelSize === 'undefined') {
    model.minimumPixelSize = modelGeneralConfig.minimumPixelSize
  }
  if (typeof model.scale === 'undefined') {
    model.scale = modelGeneralConfig.scale
  }

  model.distanceDisplayCondition = modelGeneralConfig.distanceDisplayCondition
  model.maximumScale = modelGeneralConfig.maximumScale
  // 根据阵营设置模型颜色，JB模式不设置
  switch (json.side) {
    case 'blue':
      model.color = {
        rgba: [15, 61, 229, 255]
      }
      break
    case 'red':
      model.color = {
        rgba: [221, 92, 92, 255]
      }
      break
    default:
      break
  }
  // 当前模型实体对应label或billboard的显隐距离控制值
  let labelDistanceDisplay = modelGeneralConfig.labelDistanceDisplay
  if (curModelConfig.labelDisplayByDistance) {
    labelDistanceDisplay = curModelConfig.labelDisplayByDistance
  }
  // mode1为直接使用entity callback 模式 mode2为primitive模式，默认CZML模式
  if (mode === 1 || mode === 2) {
    // 基于entity或primitive赋值模式重构model
    let priModel = createModelByMode(model, mode)
    return {
      model: priModel,
      labelImgUrl: labelImgUrl,
      labelDistanceDisplay: labelDistanceDisplay
    }
  }
  // 基于最初的czml格式构建model
  return {
    model: model,
    labelImgUrl: labelImgUrl,
    labelDistanceDisplay: labelDistanceDisplay
  }
}
/**
 * 基于entity模式重构model
 * @param {*} model czml模式model
 * @returns entity模式model
 */
function createModelByMode(model, mode) {
  let silhoueteColor = new window.MSIMEarth.Color(
    model.silhouetteColor.rgba[0] / 255,
    model.silhouetteColor.rgba[1] / 255,
    model.silhouetteColor.rgba[2] / 255,
    model.silhouetteColor.rgba[3] / 255
  )
  let color = new window.MSIMEarth.Color(
    model.color.rgba[0] / 255,
    model.color.rgba[1] / 255,
    model.color.rgba[2] / 255,
    model.color.rgba[3] / 255
  )
  let curMode
  switch (model.colorBlendMode) {
    case 'MIX':
      curMode = window.MSIMEarth.ColorBlendMode.MIX
      break
    case 'REPLACE':
      curMode = window.MSIMEarth.ColorBlendMode.REPLACE
      break
    case 'HIGHLIGHT':
      curMode = window.MSIMEarth.ColorBlendMode.HIGHLIGHT
      break
    default:
      break
  }
  let entityModel
  if (mode === 1) {
    entityModel = {
      uri: model.gltf,
      scale: model.scale || 1,
      silhouetteColor: silhoueteColor,
      silhouetteSize: model.silhouetteSize || 2,
      colorBlendAmount: model.colorBlendAmount,
      colorBlendMode: curMode,
      minimumPixelSize: model.minimumPixelSize,
      distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
        model.distanceDisplayCondition[0],
        model.distanceDisplayCondition[1]
      ),
      color: color
    }
  } else {
    entityModel = {
      url: model.gltf,
      scale: model.scale || 1,
      silhouetteColor: silhoueteColor,
      silhouetteSize: model.silhouetteSize || 2,
      colorBlendAmount: model.colorBlendAmount,
      colorBlendMode: curMode,
      minimumPixelSize: model.minimumPixelSize,
      distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
        model.distanceDisplayCondition[0],
        model.distanceDisplayCondition[1]
      ),
      color: color
    }
  }

  return entityModel
}
/**
 * 匹配未识别目标或者疑似目标-前端实现版
 * @param {*} json
 * @returns 配置好模型的CZML
 */
export function modelUnknownConfig(json) {
  // 模型匹配
  //判断疑似或者未识别目标
  // if (
  //   window.localStorage.getItem('side') == 'red_qb' ||
  //   window.localStorage.getItem('side') == 'blue_qb'
  // ) {
  if (json.side === 'blue') {
    // 当前场景蓝方无电子战飞机，此处暂时用E2C替代
    model = {
      gltf: 'static/data/gltf/3DModel/pyramid.glb',
      minimumPixelSize: 50
    }
    labelImgUrl = 'static/image/billboard/动态目标/planeB.png'
  } else {
    model = {
      gltf: 'static/data/gltf/3DModel/pyramid.glb', //static/data/gltf/jb/不明物体.glb
      minimumPixelSize: 50
    }
    labelImgUrl = 'static/image/billboard/动态目标/planeR.png'
  }
  // }
  model.silhouetteSize = 0
  // model.silhouetteColor = {
  //   rgba: [175, 175, 175, 100]
  // }
  model.colorBlendAmount = 1
  model.colorBlendMode = 'MIX'
  if (json.side === 'blue') {
    model.color = {
      rgba: [15, 61, 229, 255]
    }
  } else {
    model.color = {
      rgba: [221, 92, 92, 255]
    }
  }
  return {
    model: model,
    labelImgUrl: labelImgUrl,
    distanceDisplayCondition: [0, 100e5]
  }
}
/**
 * 精模简模切换
 * @param {function} JBConfig
 * @param {function} modelConfig
 */
export function changeCzmlModel(json) {
  if (MSIMEarthCZMLProcessContainer) {
    let entities = MSIMEarthCZMLProcessContainer.entities.values
    let model
    entities.forEach((entity) => {
      //简模显示
      if (!store.state.sceneModule.modelConfig.detailedModel) {
        let res = JBConfig({
          type: entity.properties.airplaneAction._value.type,
          side: entity.properties.airplaneAction._value.side,
          id: entity.id
        })
        model = res.model
        if (Object.keys(model).length > -1) {
          if (entity.model.uri != model.gltf) {
            entity.model.uri.setValue(model.gltf)
            entity.model.silhouetteSize = 0
            entity.model.silhouetteColor = {
              rgba: [175, 175, 175, 0]
            }
            if (model.minimumPixelSize && entity.model.minimumPixelSize)
              entity.model.minimumPixelSize.setValue(50)
          }
        }
      } else {
        //精模显示
        let res = modelConfig({
          type: entity.properties.airplaneAction._value.type,
          side: entity.properties.airplaneAction._value.side,
          id: entity.id
        })
        model = res.model
        if (Object.keys(model).length > -1) {
          if (entity.model.uri != model.gltf) {
            entity.model.uri.setValue(model.gltf)
            if (model.minimumPixelSize && entity.model.minimumPixelSize)
              entity.model.minimumPixelSize.setValue(
                Number(model.minimumPixelSize)
              )
            if (entity.properties.airplaneAction._value.side === 'blue') {
              entity.model.colorBlendMode = window.MSIMEarth.ColorBlendMode.MIX
              entity.model.colorBlendAmount = 0.7
              entity.model.color = new window.MSIMEarth.Color(
                15 / 255.0,
                61 / 255.0,
                229 / 255.0,
                1.0
              )
            } else {
              entity.model.colorBlendMode = window.MSIMEarth.ColorBlendMode.MIX
              entity.model.colorBlendAmount = 0.7
              entity.model.color = new window.MSIMEarth.Color(
                221 / 255.0,
                92 / 255.0,
                92 / 255.0,
                1.0
              )
            }
          }
        }
      }
    })
  }
}
// 获取到的type值存在不规范命名，需要将无效字符进行替换
function replaceTypeValue(type) {
  // 替换-为_并去除<和>
  let res = type.replace(/-/g, '_').replace(/<|>/g, '').replace(/^(\d)/, '_$1')
  // const regex = /^\d/;
  // // 首字符是否为数字
  // let firstChar_number=regex.test(res)
  // if(firstChar_number){
  // }
  return res
}

// 匹配平台中文名称
export function configPlateformCHNName(dataName) {
  // 获取模型中文名称配置
  const modelCHNNameValue = store.state.sceneModule.modelCHNNameValue
  // 基于dataName匹配数据
  const CHNName = modelCHNNameValue[dataName]

  // 检查匹配结果，确保安全返回name字段
  if (CHNName && typeof CHNName === 'object' && 'name' in CHNName) {
    return CHNName
  }

  // 如果未找到匹配数据，返回默认值或原始dataName
  return dataName
}

export function configPlateformCHNName2(dataName) {
  // 获取模型中文名称配置
  const modelCHNNameValue = store.state.sceneModule.modelCHNNameValue1
  if (modelCHNNameValue) {
    // 基于dataName匹配数据
    let CHNName = modelCHNNameValue[dataName]
    // Object.keys(modelCHNNameValue).forEach((key) => {
    //   if (key === dataName) {
    //     CHNName = modelCHNNameValue[key]
    //   }
    //   console.log(modelCHNNameValue[key], CHNName)
    //   // if (modelCHNNameValue[key].name === dataName) {
    //   //   CHNName = modelCHNNameValue[key].name
    //   //   return
    //   // }
    // })
    // 检查匹配结果，确保安全返回name字段
    if (CHNName) {
      return CHNName
    }
  }
  // 如果未找到匹配数据，返回默认值或原始dataName
  return dataName
}

// 匹配平台阵营
export function configPlateformSide(dataName) {
  // 处理PA消息类型后缀
  if (dataName.slice(-2) === 'PA') {
    dataName = dataName.slice(0, -2)
  }
  // 获取模型中文名称配置
  console.log(
    'store.state.sceneModule.modelCHNNameValue',
    store.state.sceneModule.modelCHNNameValue
  )
  const modelSideValue = store.state.sceneModule.modelCHNNameValue
  // 基于dataName匹配数据
  const side = modelSideValue[dataName]

  // 检查匹配结果，确保安全返回side字段
  if (side) {
    return side
  }

  // 如果未找到匹配数据，返回默认值或原始side
  return side
}

/**
 * @param {string} side - 模型颜色
 * @returns {object} - 颜色配置对象
 */
function colorConfig(side) {
  let color = {
    rgba: [221, 92, 92, 255]
  }
  switch (side) {
    case 'blue':
      color = {
        rgba: [15, 61, 229, 255]
      }
      break
    case 'red':
      color = {
        rgba: [221, 92, 92, 255]
      }
      break
    case 'green':
      color = {
        rgba: [43, 233, 15, 255]
      }
      break
    case 'purple':
      color = {
        rgba: [128, 8, 235, 255]
      }
      break
    default:
      break
  }
  return color
}
