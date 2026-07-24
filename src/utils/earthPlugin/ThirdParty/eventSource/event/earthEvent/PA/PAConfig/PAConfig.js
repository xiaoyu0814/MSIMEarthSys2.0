import store from '@/store'
export default function () {
  // 基于PA消息将要创建的实体的参数匹配
  const configPAEntity = (json) => {
    if (
      typeof json.Data === 'undefined' ||
      typeof json.Data.Name === 'undefined' ||
      typeof json.Data.Side === 'undefined' ||
      typeof json.Data.Type === 'undefined'
    ) {
      console.log(
        'PA消息存在undefined字段',
        json.Data,
        json.Data.Name,
        json.Data.Type
      )
      return
    }
    let imageParams = {
      imageUrl: '', //匹配方法里会追加无匹配类型时的默认值
      scale: 0.8, //默认1.0
      distance: new window.MSIMEarth.DistanceDisplayCondition(0, 50e4)
    }
    if (json.Data.MType) {
      //动态目标初始位置标注
      let res = imageConfigDynamic(json.Data.Type, json.Data.Side)
      imageParams.imageUrl = res.imgUrl
      imageParams.chineseName = res.chineseName
      imageParams.scale = 0.8
    } else {
      // 纯静态目标标注
      let res = imageConfigStatic(json.Data.Type, json.Data.Side)
      imageParams.imageUrl = res.imgUrl
      imageParams.chineseName = res.chineseName
    }
    let chineseName = configPlateformCHNNameStatic(json.Data.Name)
    if (chineseName) {
      imageParams.chineseName = chineseName
    }
    return imageParams
  }
  // 纯静态目标匹配
  const imageConfigStatic = (type, side) => {
    let imgUrl = ''
    let chineseName = ''
    switch (type) {
      case 'SOC_CMDR':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'WSF_PLATFORM':
        imgUrl = `./static/image/billboard/静态目标/SOC_CMDR_${side}.png`
        break
      case 'CMDR':
        imgUrl = `./static/image/billboard/静态目标/SOC_CMDR_${side}.png`
        break
      case 'IADS_CMDR':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'HQ':
        imgUrl = `./static/image/billboard/静态目标/IADS_CMDR_${side}.png`
        break
      case 'OilTank':
        imgUrl = `./static/image/billboard/静态目标/IADS_CMDR_${side}.png`
        break
      case 'Fortress':
        imgUrl = `./static/image/billboard/静态目标/IADS_CMDR_${side}.png`
        break
      case 'RED_RADAR_COMPANY':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'RADAR_COMPANY':
        imgUrl = `./static/image/billboard/静态目标/RED_RADAR_COMPANY_${side}.png`
        break
      case 'RadarSite100km':
        imgUrl = `./static/image/billboard/静态目标/EW_RADAR_${side}.png`
        break
      case 'EW_RADAR':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'LARGE_SAM_BATTALION':
        imgUrl = `./static/image/billboard/静态目标/LARGE_SAM_BATTALION_${side}.png`
        break
      case 'PAC-3_Site':
        imgUrl = `./static/image/billboard/静态目标/LARGE_SAM_TTR_${side}.png`
        break
      case 'SkyBow-1_Site':
        imgUrl = `./static/image/billboard/静态目标/LARGE_SAM_BATTALION_${side}.png`
        break
      case 'SkySword-2_Site':
        imgUrl = `./static/image/billboard/静态目标/LARGE_SAM_BATTALION_${side}.png`
        break
      case 'ACQ_RADAR':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = ' 火控雷达' //一般挂载在飞行器上，这里是静态目标合适吗？？？
        break
      case 'LARGE_SAM_TTR':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = ' 地空导弹连TTR'
        break
      case 'LARGE_SAM_LAUNCHER':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = ' 地空导弹连L'
        break
      case 'GCI_CMDR':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'BLUE_FLIGHT_LEAD':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'TRBBase':
        imgUrl = `./static/image/billboard/静态目标/LZKZ_SUB_CENTER_${side}.png`
        break
      case 'ICBBase':
        imgUrl = `./static/image/billboard/静态目标/LZKZ_SUB_CENTER_${side}.png`
        break
      case 'SODBBase':
        imgUrl = `./static/image/billboard/静态目标/LZKZ_SUB_CENTER_${side}.png`
        break
      case 'BLUE_STRIKER':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'TARGET':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'BASE_SAT':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'dmz':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'HAWK_Launcher':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'HAWK_Vehicle':
        imgUrl = `./static/image/billboard/静态目标/HAWK_Launcher_${side}.png`
        break
      case 'FengQun-200Vehicle':
        imgUrl = `./static/image/billboard/静态目标/HAWK_Launcher_${side}.png`
        break

      case 'HAWK_Radar':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break

      case 'RADAR_SITE_BLUE':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      case 'CoastalArtillery':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        break
      // 20250824 基于AI识别新增
      case 'EoirRadarSite':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '情报雷达处'
        break
      case 'Building':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '建筑物'
        break
      case 'HQ-9B_Vehicle':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '红旗9B导弹发射车'
        break
      case 'HQ-16A_Vehicle':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '红旗9B导弹发射车'
        break
      case 'RadarSite150km':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '雷达站'
        break
      case 'PAC-3_BATTALION':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '爱国者3导弹营'
        break
      case 'PAC-3_LAUNCHER':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '爱国者3导弹营'
        break
      case 'AIRPORT':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '机场'
        break
      case 'Brigade':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '装甲营'
        break
      case 'THAAD_BATTALION':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '萨德系统'
        break
      case 'THAAD_LAUNCHER':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '萨德导弹'
        break
      case 'IronDome-Battalion':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '铁穹导弹发射车'
        break
      case 'IronDome_LAUNCHER':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '铁穹系统'
        break
      case 'CENTER':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '指挥中心'
        break
      case 'JH_CMDR':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '军航指挥所'
        break
      case 'HKB_CMDR':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '航空兵指挥所'
        break
      case 'WD_SUB_CENTER':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '网电指挥分中心'
        break
      case 'CD_SUB_CENTER':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '常导指挥分中心'
        break
      case 'LZKZ_SUB_CENTER':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '联指空中指挥分中心'
        break
      case 'HS_SUB_CENTER':
        imgUrl = `./static/image/billboard/静态目标/${type}_${side}.png`
        chineseName = '海上指挥分中心'
        break
      case 'Base':
        imgUrl = `./static/image/billboard/静态目标/CENTER_${side}.png`
        // chineseName = '基地'
        break
      case 'Airport':
        imgUrl = `./static/image/billboard/静态目标/AIRPORT_${side}.png`
        // chineseName = '机场'
        break

      default:
        console.log('未匹配静态目标', type)
        imgUrl = './static/image/' + 'billboard/静态目标/undefined.png'
        chineseName = '未匹配静态目标'
        break
    }
    return { imgUrl: imgUrl, chineseName: chineseName }
  }
  // 动态目标初始静态时匹配
  const imageConfigDynamic = (type, side) => {
    let imgUrl = ''
    let chineseName = ''
    switch (type) {
      case 'Z-10':
        imgUrl = `./static/image/billboard/静态目标/直升机_${side}.png`
        break
      case 'KVD-001':
        imgUrl = `./static/image/billboard/静态目标/无人机_${side}.png`
        break
      case 'SS-UAV':
        imgUrl = `./static/image/billboard/静态目标/无人机_${side}.png`
        break
      case 'WZ-7':
        imgUrl = `./static/image/billboard/静态目标/无人机_${side}.png`
        break
      case 'WZ-8':
        imgUrl = `./static/image/billboard/静态目标/无人机_${side}.png`
        break
      case 'WZ-10':
        imgUrl = `./static/image/billboard/静态目标/无人机_${side}.png`
        break
      case 'GJ-2':
        imgUrl = `./static/image/billboard/静态目标/无人机_${side}.png`
        break
      case 'GJ-11':
        imgUrl = `./static/image/billboard/静态目标/无人机_${side}.png`
        break
      case 'BASE_SAT':
        imgUrl = `./static/image/billboard/静态目标/卫星_${side}.png`
        break
      case 'KJ-500':
        imgUrl = `./static/image/billboard/静态目标/预警机_${side}.png`
        break
      case 'HSU-001_LDUUV':
        imgUrl = `./static/image/billboard/静态目标/潜艇_${side}.png`
        break
      case '003Carrier':
        imgUrl = `./static/image/billboard/静态目标/航母_${side}.png`
        break
      case '071DockLandingShip':
        imgUrl = `./static/image/billboard/静态目标/辅助舰艇_${side}.png`
        break
      case '076_LHA':
        imgUrl = `./static/image/billboard/静态目标/辅助舰艇_${side}.png`
        break
      case 'NimitzCarrier':
        imgUrl = `./static/image/billboard/静态目标/航母_${side}.png`
        break
      case 'Burke3Destroyer':
        imgUrl = `./static/image/billboard/静态目标/辅助舰艇_${side}.png`
        break
      case 'Rifle-Type-95Bullet':
        imgUrl = `./static/image/billboard/静态目标/机器_${side}.png`
        break
      case 'Cannon57mmShell':
        imgUrl = `./static/image/billboard/静态目标/机器_${side}.png`
        break
      case 'BLUE_STRIKER':
        imgUrl = `./static/image/billboard/静态目标/飞机_${side}.png`
        break
      case 'F-16':
        imgUrl = `./static/image/billboard/静态目标/飞机_${side}.png`
        break
      case 'H-6N':
        imgUrl = `./static/image/billboard/静态目标/飞机_${side}.png`
        break
      case 'J-16D':
        imgUrl = `./static/image/billboard/静态目标/飞机_${side}.png`
        break
      default:
        imgUrl = `./static/image/billboard/静态目标/undefined_${side}.png`
        chineseName = '未匹配动态目标'
        break
    }
    return { imgUrl: imgUrl, chineseName: chineseName }
  }

  // 匹配平台中文名称(静态目标)
  const configPlateformCHNNameStatic = (dataName) => {
    // 获取模型中文名称配置
    const modelCHNNameValue = store.state.sceneModule.modelCHNNameValue

    // 基于dataName匹配数据
    const CHNName = modelCHNNameValue[dataName]

    // 检查匹配结果，确保安全返回name字段
    if (CHNName && typeof CHNName === 'object' && 'name' in CHNName) {
      return CHNName.name
    }

    // 如果未找到匹配数据，返回默认值或原始dataName
    return dataName
  }

  return { configPAEntity }
}
