import { render } from 'vue'

/*
 * @Description:
 * @Version: 2.0
 * @Autor: wx
 * @Date: 2022-05-06 01:28:50
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-10-17 15:46:13
 */
const experimentModule = {
  namespaced: true, //独立使用
  state() {
    return {
      experimentReportList: [],
      redTreeData: [],
      plateformCluster: [], //平台聚合目录 [{id:'wz-7_1',show:false,group:'wz-7_1+wz-7_2+wz-7',state:[RE_STrack:[F16-1,F16-2],RE_JamA:[],RE_WeaponWH:[]]}] //创建某事件ID：wz-7_1+wz-7_2+wz-7_RE_STrack_F16-1
      operationalAreaInfo: null, //作战区域数据集合，选择试验后加载进来
      subSysName: '', //['实验资源管理分系统','实验准备分系统','仿真实验分系统','实验数据分析分系统','概念多为呈现分系统']
      review: false,
      reviewTime: 0,
      taskByComment: {
        'bzk-005': {
          Comment: {
            Action: 'Message received',
            Sender: 'bzk-005',
            Content: 'FollowLead'
          },
          T: 100.00014256405896,
          PID: 262,
          entityID: '23',
          disID: '2.1.23',
          PN: 'vehicle_LoiteringMunition_5'
        }
      }, //{Comment:'FollowLead',TaskID:'123456'}
      flyControl: true, //是否开启事件飞行
      missionBrief: '', //实验任务简报brief
      missionObjective: '', //实验任务目标
      scenarioBackground: '', //实验场景背景
      notification: {} //模拟外接推送的数据
    }
  },
  getters: {
    GET_FLY_CONTROL(state) {
      return state.flyControl
    }
  },
  mutations: {
    SET_FLY_CONTROL(state, payload) {
      state.flyControl = payload
    },
    SET_MISSION_BRIEF(state, payload) {
      state.missionBrief = payload
    },
    SET_MISSION_OBJECTIVE(state, payload) {
      state.missionObjective = payload
    },
    SET_SCENARIO_BACKGROUND(state, payload) {
      state.scenarioBackground = payload
    }
  },
  actions: {}
}

export default experimentModule
