import store from '@/store'
import { getServices, getServiceLayerList } from '@/service/layer.js'
//获取西安图层服务列表
export async function getLayerList(params) {
  let res = await getServices(params)
  if (res.success) {
    let data = res.data
    if (data.rows.length > 0) {
      let serverId = data.rows[0].id
      let response = await getServiceLayerList({ serviceId: serverId })
      if (response.success) {
        let layerList = response.data.layers
        if (layerList.length > 0) {
          let layerArr = []
          layerList.forEach((element, index) => {
            if (element) {
              let layerInfor = {
                name: element.title,
                code: '',
                checked: false,
                clickable: false,
                geoType: ''
              }
              if (element.services.WMTS && element.services.WMTS.externalUrl) {
                layerInfor['url'] = element.services.WMTS.externalUrl
                layerInfor['type'] = 'wmts'
                layerInfor['code'] = 'wmtsVectorLayer' + '-' + index
                layerInfor['bbox'] = element.bbox
                layerInfor['bounds'] = element.bounds
              } else if (
                element.services.XYZ &&
                element.services.XYZ.externalUrl
              ) {
                //加载方式和wmts一样
                layerInfor['url'] = element.services.XYZ.externalUrl
                layerInfor['type'] = 'wmts'
                layerInfor['code'] = 'wmtsVectorLayer' + '-' + index
                layerInfor['bbox'] = element.bbox
                layerInfor['bounds'] = element.bounds
              } else if (
                element.services.MVT &&
                element.services.MVT.externalUrl
              ) {
                layerInfor['url'] = element.services.MVT.mapboxUrl
                layerInfor['bbox'] = element.services.MVT.bbox
                layerInfor['style'] = element.services.MVT.style
                layerInfor['type'] = 'mvt'
                layerInfor['code'] = 'mvtVectorLayer' + '-' + index
              }
              //可能存在的其他服务
              // HTTP（一般为osgb等数据发布的三维效果）
              // WMS
              // WFS (与geojson类似)
              // 可以根据layers 下的supProtocol判断，没有XYZ/WMTS/MVT协议的直接不显示图层，防止其他人误操作导致你那边加载有问题
              // layers.supProtocol参数为空格分隔的字符串，如"XYZ WMTS MVT"
              layerArr.push(layerInfor)
            }
          })
          return layerArr
        }
      } else {
        console.log('获取西安服务图层失败!')
        return false
      }
    }
  } else {
    console.log('获取西安服务图层失败!')
    return false
  }
}
