import store from '@/store'
import emitter from '@/utils/eventbus'
import { sendArea, sendAreaNew } from '@/service/weather'
import { showSysMessage } from '@/utils/mapTools'
export default function () {
  let dataController = new window.EarthPlugn.DataControl({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  const handleCommand = (json) => {
    console.log('command', json)
    switch (json.Type) {
      case 'loadData':
        //加载数据
        if (json.Cmd == 'radarEcho') {
          if (
            EarthAPP.weatherBySceneName.indexOf(store.state.curSceneName) > -1
          ) {
            // sendArea  调用加载区域天气切换功能，只调用一个，之后走消息 AreaFile
            // 接口调用 或改到 	类型：Start	数据：场景启动
            sendArea().then((res) => {
              if (res.code == 200) {
                console.log('推送天气区域文件' + res)
              }
            })
            // dataController.addGeojsonWeather({
            //   url: basicVectorData.tianqiquyu,
            //   id: '矢量天气'
            // }) //加载天气区域数据
          }
        }
        break
      case 'tactic':
        //加载数据
        if (json.Cmd == 'xxx') {
          // 1 根据描述信息更新identify组件内消息内容
          store.state.sceneModule.identifyInfo = json.info
          // 在homeView组件内监听store.state.sceneModule.showIdentify并激活identity组件
          store.state.sceneModule.showIdentify = true
        }
        break
      default:
        break
    }
    // if (json.Type == 'loadData') {
    //   //加载数据
    //   if (json.Cmd == 'radarEcho') {
    //     if (
    //       EarthAPP.weatherBySceneName.indexOf(store.state.curSceneName) > -1
    //     ) {
    //       // sendArea  调用加载区域天气切换功能，只调用一个，之后走消息 AreaFile
    //       // 接口调用 或改到 	类型：Start	数据：场景启动
    //       sendArea().then((res) => {
    //         if (res.code == 200) {
    //           console.log('推送天气区域文件' + res)
    //         }
    //       })

    //       // dataController.addGeojsonWeather({
    //       //   url: basicVectorData.tianqiquyu,
    //       //   id: '矢量天气'
    //       // }) //加载天气区域数据
    //     }
    //   }
    // }
  }
  // 动态切换 天气区域数据
  const handleAreaFile = (fileName) => {
    // geoJson数据 加载数据显示
    if (EarthAPP.weatherBySceneName.indexOf(store.state.curSceneName) > -1) {
      // dataController.addGeojsonAreaWeather({
      //   url: staticUrl + 'area/' + fileName,
      //   id: '矢量天气_AreaFile'
      //修改  basicVectorData.tianqiquyu 地址 否则之后图层中加载不加载程序默认的 geoJson文件
      basicVectorData.tianqiquyu = staticUrl + 'area/' + fileName
      // }) //加载天气区域数据  降水
      dataController.addGeojsonWeather(
        {
          url: staticUrl + 'area/' + fileName,
          id: '矢量天气',
          backLoad: true
        },
        store.state.sceneModule.quyuWeatherVisible
      ) //加载天气区域数据
    }
  }
  //创建编组
  const showGroupScope = (json) => {
    if (json.features.length > 0) {
      json.features.forEach((value, index) => {
        if (!value || !value.properties || !value.properties.id) return
        let id = value.properties.id
        let gropuName = value.properties.groupName
        let height = value.properties.altitute
        if (value.geometry.coordinates.length == 0) {
          removeGroup(id) //移除范围面和label
          return
        }
        let centerGeometry = turf.center(value.geometry)
        let entity = EarthViewer.entities.getById(id + '-group-label')
        if (entity) {
          entity.position = window.MSIMEarth.Cartesian3.fromDegrees(
            centerGeometry.geometry.coordinates[0],
            centerGeometry.geometry.coordinates[1],
            height
          )
        }
        let dsSource = EarthViewer.dataSources.getByName(id)
        if (dsSource.length > 0) {
          let outLineColor = groupColor.group_outlineColor
          dsSource[0].load(value).then((ds) => {
            let entities = ds.entities.values
            for (let i = 0; i < entities.length; i++) {
              entities[i].polygon.height = height
              entities[i].polygon.material._color.setValue(
                new window.MSIMEarth.Color(
                  outLineColor[0] / 255,
                  outLineColor[1] / 255,
                  outLineColor[2] / 255,
                  outLineColor[3]
                )
              )
            }
          })
          if (
            store.state.sceneModule.planeConfig.find((item) => item == '编组')
          ) {
            if (entity) entity.show = true
            if (dsSource.length > 0) dsSource[0].show = true
          } else {
            if (entity) entity.show = false
            if (dsSource.length > 0) dsSource[0].show = false
          }
        } else {
          let promise = window.MSIMEarth.GeoJsonDataSource.load(value)
          promise.then(function (dataSource) {
            dataSource.name = id
            dataSource.show = false
            let entities = dataSource.entities.values
            for (let i = 0; i < entities.length; i++) {
              entities[i].polygon.height = height
            }
            window.EarthViewer.dataSources.add(dataSource)
          })
          let labelColor = groupColor.group_labelColor
          window.EarthViewer.entities.add({
            id: id + '-group-label',
            position: window.MSIMEarth.Cartesian3.fromDegrees(
              centerGeometry.geometry.coordinates[0],
              centerGeometry.geometry.coordinates[1],
              height
            ),
            label: {
              //文字标签
              text: gropuName,
              font: '18px sans-serif',
              horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
              verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
              pixelOffset: new window.MSIMEarth.Cartesian2(0, -20),
              fillColor: new window.MSIMEarth.Color(
                labelColor[0] / 255,
                labelColor[1] / 255,
                labelColor[2] / 255,
                labelColor[3]
              ),
              // showBackground: true,
              //backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
              distanceDisplayCondition:
                new window.MSIMEarth.DistanceDisplayCondition(0, 20e5),
              outlineColor: window.MSIMEarth.Color.WHITE,
              outlineWidth: 1,
              style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE
              // eyeOffset: new window.MSIMEarth.ConstantProperty(
              //   new window.MSIMEarth.Cartesian3(0, 0, -1)
              // )
            },
            show: false
          })
        }
      })
    }
  }
  //创建编组间连线
  const createGroupConnectLines = (gropus) => {
    if (gropus.length > 0) {
      gropus.forEach((value, index) => {
        if (value.members && value.members.length > 0) {
          value.members.forEach((item, key) => {
            if (item.leaderName) {
              let sourId = item.leaderName
              let targetId = item.name
              let colors = lineColorConfig.RE_LTrackInit
              window.sceneAction.connectLineManagement.addLine({
                sourId: sourId,
                targetId: targetId,
                color: new window.MSIMEarth.Color(
                  colors[0] / 255,
                  colors[1] / 255,
                  colors[2] / 255,
                  colors[3]
                ),
                type: 'RE_LTrackInit',
                show: true,
                width: 15
              })
            }
          })
        }
      })
    }
  }
  //移除编组范围面
  const removeGroup = (id) => {
    let dsSource = EarthViewer.dataSources.getByName(id)
    if (dsSource.length > 0) {
      EarthViewer.dataSources.remove(dsSource[0])
    }
    let entity = EarthViewer.entities.getById(id + '-group-label')
    if (entity) {
      EarthViewer.entities.removeById(id + '-group-label')
    }
  }
  //锁定目标
  const entityLock = (json) => {
    //console.log('UE_LockInfo', json)
    console.log('锁定锁定锁定锁定锁定锁定锁定')
    if (json.Type == 'UE_LockInfo') {
      //加载数据
      let sourId = json.Data.sName
      let targetId = json.Data.tName
      let lockState = json.Data.lockState
      if (lockState) {
        window.sceneAction.planeCzmlManage.createLockSprite({
          sourId: targetId,
          radius: 6000 //6000
        })
        showSysMessage(targetId, '被锁定了！')
      } else {
        window.sceneAction.planeCzmlManage.revmoeLockEntity(targetId)
      }
    }
  }
  // 动态切换 作战区域数据文件
  const handleOperationalAreaFile = (json) => {
    if (json.fileName.indexOf('environment') > -1) {
      //天气区域数据加载
      dataController.addGeojsonWeather(
        {
          url: json.fileName,
          id: '矢量天气',
          backLoad: true
        },
        store.state.sceneModule.quyuWeatherVisible
      )
    } else {
      // 作战区域geoJson数据 加载数据显示
      dataController.addGeojsonByOperationalAreaFile(
        {
          url: json.fileName,
          id: '作战区域',
          backLoad: true
        },
        true
      )
    }
  }
  //现场使用-通过接口下达加载天气区域指令,上面的handleCommand暂时不用
  const commandWeather = () => {
    sendAreaNew().then((res) => {
      if (res.code == 200) {
        console.log('推送天气区域文件' + res)
      }
    })
  }
  return {
    handleCommand,
    createGroupConnectLines,
    showGroupScope,
    handleAreaFile,
    entityLock,
    handleOperationalAreaFile,
    commandWeather
  }
}
