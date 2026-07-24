// const tiandituTk = '7711a24780452f03bb7c02fba98183b9'
// const addbingLayer = () => {
//   // 天地图影像底图提供者
//   const imageMapProvider =
//     new window.MSIMEarth.WebMapTileServiceImageryProvider({
//       url: `http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${tiandituTk}`,
//       layer: 'tdtBasicLayer',
//       style: 'default',
//       format: 'image/jpeg',
//       tileMatrixSetID: 'GoogleMapsCompatible',
//       show: false
//     })

//   // 天地图注记底图提供者
//   const annotationMapProvider =
//     new window.MSIMEarth.WebMapTileServiceImageryProvider({
//       url: `http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${tiandituTk}`,
//       layer: 'tdtAnnotationLayer',
//       style: 'default',
//       format: 'image/jpeg',
//       tileMatrixSetID: 'GoogleMapsCompatible',
//       show: false
//     })
// }
// addbingLayer()


// datacontrol中绘制热力图功能
// 热力图显隐
// addHeatMap(type) {
//   let data = store.getters.getGridData
//   // if (Object.getOwnPropertyNames(data).length == 0) {
//   //   ElMessage({
//   //     message: '当前没有接到热力图数据',
//   //     grouping: true,
//   //     type: 'error'
//   //   })
//   //   return
//   // }
//   let heatMap = store.getters.getHeatMap
//   if (type) {
//     let heatList = []
//     for (let i = 0; i < JSON.parse(data).data.length; i++) {
//       let item = JSON.parse(data).data[i]
//       let param = {
//         lnglat: [item.centerLongitude, item.centerLatitude],
//         value: item.heatingPower
//       }
//       heatList.push(param)
//     }

//     // JSON.parse(data).data.forEach((item) => {
//     //   let param = {
//     //     lnglat: [item.centerLongitude, item.centerLatitude],
//     //     value: item.heatingPower
//     //   }
//     //   heatList.push(param)
//     // })

//     heatMap = new Heatmap3d(viewer, {
//       list: heatList,
//       raduis: 15,
//       baseHeight: 800,
//       // primitiveType: "TRNGLE",
//       primitiveType: 'LINES',
//       gradient: {
//         '.3': 'blue',
//         '.5': 'green',
//         '.7': 'yellow',
//         '.95': 'red'
//       }
//     })
//     // store.commit('setHeatMap',heatMap)// ？
//   } else {
//     heatMap.destroy()
//   }
// }