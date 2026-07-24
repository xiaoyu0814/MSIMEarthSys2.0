/**
 * 动作管理工具. 包括球上各类目标的动作，如卫星、飞机、地面目标等
 * @param
 */
import satelliteActorCZML from './actionController/satelliteActorCZML'
import ConnectLine from './actionController/connectLineController'
import GroundObjectManage from './actionController/groundObjectManage'
import SatelliteSixActController from './actionController/satelliteSixActController'
import PlaneCzmlManage from './actionController/planeCzmlManage'
import EnvironmentController from './actionController/environmentController'
import cloudEffect from './actionController/cloudLayer'
import JBController from './actionController/jbController'
import SystemMessage from './actionController/systemMessage'
import MouseEventsController from './actionController/mouseEventsController'
import WeatherOceanController from './actionController/weatherOceanController'
import PopUp from './actionController/popUp'
export default class SceneAction {
  satelliteActorCZML = undefined
  groundObjectManage = undefined
  connectLineManagement = undefined
  satelliteSixActController = undefined
  planeCzmlManage = undefined
  environmentController = undefined
  cloudEffect = undefined
  jbController = undefined
  systemMessage = undefined
  mouseEventsController = undefined
  weatherOceanController = undefined
  popUp = undefined
  constructor(options) {
    this.earth = options.earth || window.MSIMEarth // 初始化Earth对象
    this.viewer = options.viewer || window.EarthViewer // 初始化viewer对象
    this.initSceneAction() // 按需初始化工具
  }
  /**
   * 按需求初始化场景动作管理工具
   */
  initSceneAction() {
    this.getSatelliteActorCZML()
    this.getGroundObjectManage()
    this.getConnectLineManagement()
    this.getSatelliteSixActController()
    this.getPlaneCzmlManage()
    this.getEnvironmentController()
    this.getCloudEffect()
    this.getSystemMessage()
    this.getMouseEventsController()
    this.getWeatherOceanController()
    this.getPopUpController()
    // this.getJBController()
  }
  getSatelliteActorCZML() {
    const option = {
      viewer: this.viewer,
      earth: this.earth
    }
    this.satelliteActorCZML = new satelliteActorCZML(option)
  }
  getGroundObjectManage() {
    const option = {
      viewer: this.viewer,
      earth: this.earth
    }
    this.groundObjectManage = new GroundObjectManage(option)
  }
  getConnectLineManagement() {
    const option = {
      viewer: this.viewer,
      earth: this.earth
    }
    this.connectLineManagement = new ConnectLine(option)
  }
  getSatelliteSixActController() {
    const option = {
      viewer: this.viewer,
      earth: this.earth
    }
    this.satelliteSixActController = new SatelliteSixActController(option)
  }
  getPlaneCzmlManage() {
    const option = {
      viewer: this.viewer,
      earth: this.earth
    }
    this.planeCzmlManage = new PlaneCzmlManage(option)
  }
  getEnvironmentController() {
    const option = {
      viewer: this.viewer,
      earth: this.earth
    }
    this.environmentController = new EnvironmentController(option)
  }
  getCloudEffect() {
    const option = {
      viewer: this.viewer,
      earth: this.earth
    }
    this.cloudEffect = new cloudEffect(option)
  }
  getJBController() {
    this.jbController = new JBController()
  }
  /**
   * 初始化系统消息提示
   */
  getSystemMessage() {
    const option = {
      viewer: this.viewer,
      earth: this.earth
    }
    this.systemMessage = new SystemMessage(option)
  }
  /**
   * 初始化地图鼠标相关事件
   */
  getMouseEventsController() {
    const option = {
      viewer: this.viewer,
      earth: this.earth
    }
    this.mouseEventsController = new MouseEventsController(option)
  }
  /**
   * 初始化气象
   */
  getWeatherOceanController() {
    const option = {
      viewer: this.viewer,
      earth: this.earth
    }
    this.weatherOceanController = new WeatherOceanController(option)
  }
  /**
   * 创建弹窗
   */
  getPopUpController() {
    const option = {
      viewer: this.viewer,
      earth: this.earth
    }
    this.popUp = new PopUp(option)
  }
}
