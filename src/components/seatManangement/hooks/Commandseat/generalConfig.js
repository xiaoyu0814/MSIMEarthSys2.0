import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'
import { useRouter } from 'vue-router'
// import { cloud } from '@/views/seatManagement/weatherOcean/hooks/index'
import primitive from '@/utils/earthPlugin/scene/primitive/primitive.js'
import entity from '@/utils/earthPlugin/scene/entity/entity.js'
import { getMinHangJSON } from '@/service/battlefieldEnvironment'

export default function () {
  const store = useStore()
  const state = reactive({
    isShowTree: false,
    showWeatherOcean: false,
    showhangXian: false,
    isCivil: false,
    minhangData: {},
    showConnectLine: false
  })
  // const {
  //   loadDgWeatherRadarChart,
  //   createWeatherRadarChart,
  //   loadWeatherRadarChartLayer,
  //   removeWeatherRadarChartLayer
  // } = cloud()
  // 只有等元素挂载渲染后，才可以将 html元素与cesium的viewer挂载wjxian
  onMounted(() => {
    getBattlefieldEnvironmentData()
  })
  onUnmounted(() => {})
  const router = useRouter()

  const primitiveManage = new primitive({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  const entityManage = new entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  const minhangList = []
  const pointLabelList = []

  //民航渲染数据
  const getBattlefieldEnvironmentData = () => {
    getMinHangJSON().then((res) => {
      state.minhangData = res
    })
  }
  let btnLeft_fun = (item) => {
    if (item.label == '图层面板') {
      emitter.emit('showTree', {})
    } else if (item.label == '航线航路') {
      state.showhangXian = !state.showhangXian
      if (state.showhangXian) {
        // 打开航线航路
        state.minhangData.MHResultData.FlightList.Flight.forEach((element) => {
          let arr = []
          let WayPoint = []
          let routeName = ' '
          if (element.AirRouteList.AirRoute instanceof Array) {
            routeName = element.AirRouteList.AirRoute[0].CoRoute
            WayPoint = element.AirRouteList.AirRoute[0].WayPointList.split(';')
          } else {
            routeName = element.AirRouteList.AirRoute.CoRoute
            WayPoint = element.AirRouteList.AirRoute.WayPointList.split(';')
          }
          WayPoint.forEach((i) => {
            if (i) {
              arr.push(Number(i.split(',')[3]), Number(i.split(',')[2]))
              let pointLabel = {
                longitude: Number(i.split(',')[3]),
                latitude: Number(i.split(',')[2]),
                text: i.split(',')[0]
              }
              if (!window.EarthViewer.entities.getById(i.split(',')[0])) {
                entityManage.addPoint(pointLabel)
                pointLabelList.push(pointLabel)
              }
            }
          })
          if (
            routeName == 'ZGGGZYTL001' ||
            routeName == 'ZGOWZBAA001' ||
            routeName == 'ZSSSRCSSL01' ||
            routeName == 'ZBAAZGZJ001' ||
            routeName == 'RCTPZUUUA02'
          ) {
            let minhang = primitiveManage.addPrimitive4(arr, '1')
            minhangList.push(minhang)
          } else if (routeName == 'ZGOWZBAA003' || routeName == 'ZBAAZGZJ002') {
            let minhang = primitiveManage.addPrimitive4(arr, '2')
            minhangList.push(minhang)
          } else {
            let minhang = primitiveManage.addPrimitive4(arr, '0')
            minhangList.push(minhang)
          }
        })
      } else {
        // 关闭航线航路
        primitiveManage.removePrimitive(minhangList)
        pointLabelList.forEach((item) => {
          entityManage.deleteEntities(item.text)
        })
        minhangList = []
        pointLabelList = []
      }
    } else if (item.label == '气象展示') {
      state.showWeatherOcean = !state.showWeatherOcean
      emitter.emit('showWeatherClick', state.showWeatherOcean)
      if (state.showWeatherOcean) {
        //加载雷达图
        loadDgWeatherRadarChart()
        // createWeatherRadarChart()
        // setTimeout(() => {
        //   window.EarthViewer.camera.flyTo({
        //     destination: new window.MSIMEarth.Cartesian3(
        //       -4331952.685265425,
        //       10357922.882933276,
        //       4789811.564742478
        //     ),
        //     orientation: {
        //       heading: 1.5438746814311344e-7, //偏航角
        //       pitch: -1.4344670012125031, //水平俯仰角
        //       roll: 6.2831851481081
        //     },
        //     duration: 2,
        //     complete: () => {
        //       data.showQxldWeatherLegend = true
        //       loadWeatherRadarChartLayer()
        //     }
        //   })
        // }, 800)
      } else {
        //清除
        removeWeatherRadarChartLayer()
      }
    } else if (item.label == '标牌配置') {
      if (store.getters.getPlane && store.getters.getPlane.length > 0) {
        store.commit('setPlane', '')
        emitter.emit('closeBottomControlPanel', 'three')
      } else {
        store.commit('setPlane', 'planeLabelConfig')
      }
    } else if (item.label == '系统退出') {
      sessionStorage.clear()
      localStorage.clear()
      router.push('/')
    } else if (item.label == '战场信息') {
      store.commit('setEarth', 'earthObjectConfig')
    } else if (item.label == '代码指令') {
    } else if (item.label == '指挥文电') {
    } else if (item.label == '矢量天气') {
      // 创建数据管理对象
      let dataController = new window.EarthPlugn.DataControl({
        earth: window.MSIMEarth,
        viewer: window.EarthViewer
      })
      store.state.sceneModule.quyuWeatherVisible =
        !store.state.sceneModule.quyuWeatherVisible
      if (state.showVectorAtmosphere) {
        state.showVectorAtmosphere = false
      } else {
        //dataController.removeGeoJSONWeather('矢量天气')
        state.showVectorAtmosphere = true
      }
      dataController.addGeojsonWeather(
        {
          url: basicVectorData.tianqiquyu,
          id: '矢量天气',
          backLoad: false
        },
        store.state.sceneModule.quyuWeatherVisible
      )
    } else if (item.label == '链路图例') {
      const sceneAction = new window.EarthPlugn.sceneAction({
        earth: window.MSIMEarth,
        viewer: window.EarthViewer
      })
      const connectLineManage = sceneAction.connectLineManagement
      if (!state.showConnectLine) {
        // 打开链路
        // store.commit('setLinkState', true)
        // connectLineManage.showEntityByKeyword('RE_LTrackInit', true)
        // connectLineManage.showEntityByKeyword('RE_WeaponF', true)
        // connectLineManage.showEntityByKeyword('RE_JamS', true)
        // connectLineManage.showEntityByKeyword('RE_Network', true)
        // connectLineManage.showEntityByKeyword('RE_MR', true)
        // connectLineManage.showEntityByKeyword('distancelabel', true)
        emitter.emit('changeConnectionLegend', true)
        state.showConnectLine = true
      } else {
        // 关闭链路
        // store.commit('setLinkState', false)
        // connectLineManage.showEntityByKeyword('RE_LTrackInit', false)
        // connectLineManage.showEntityByKeyword('RE_WeaponF', false)
        // connectLineManage.showEntityByKeyword('RE_JamS', false)
        // connectLineManage.showEntityByKeyword('RE_Network', false)
        // connectLineManage.showEntityByKeyword('RE_MR', false)
        // connectLineManage.showEntityByKeyword('distancelabel', false)
        emitter.emit('changeConnectionLegend', false)
        state.showConnectLine = false
      }
    } else if (item.label == '要素导调') {
      let changeCompName = {}
      changeCompName.label = '要素导调'
      changeCompName.name = 'targetConfig'
      changeCompName.value = 'threeDimensional'
      changeCompName.methods = 'changeThreeDimensional'
      if (Object.keys(changeCompName).length > 0) {
        store.commit('setCompList', changeCompName)
      }
    }
  }
  return { btnLeft_fun }
}
