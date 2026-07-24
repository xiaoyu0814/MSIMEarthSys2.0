/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2026-05-26 15:47:53
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-06-01 10:11:43
 * @FilePath: \MSIMEarthSys\src\views\FP\hooks\FP.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'
import {
  getTaskClosureTimeDetail,
  getPlaybackStatus,
  getOpticalVisibilityData
} from '@/service/replay/index'
import { queryExperimentJsonFile } from '@/service/experiment/experiment'
import { getExperimentRecordInfo } from '@/service/review/index'
export default function () {
  const store = useStore()

  const taskClosureTimeDetailData = ref()

  const factorName = ref('')

  const fileNameNum = ref(0)

  const playbackStatus = ref('stopped')

  let cusP = null

  let interval = null
  /**
   * @description 获取任务详情数据
   * @param { Object } params {id:任务详情ID;taskId:任务ID}
   * @return { * }
   */
  const _getTaskClosureTimeDetail = (params) => {
    getTaskClosureTimeDetail(params).then((res) => {
      if (res.code == 200) {
        taskClosureTimeDetailData.value = res.data
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i]
          if (element.id == params.taskId) {
            factorName.value = element.factorName
            for (let j = 0; j < element.platformList.length; j++) {
              const platform = element.platformList[j]
              store.commit('setCurrentNode', {
                code: platform.platform,
                side: platform.side,
                type: platform.platformTypeId
              })
              store.state.targetDetailsCheck[platform.platform] = ['planLine']
              emitter.emit('planLineChange1', true)
            }
          }
        }
        // addFactorData()
      }
    })
  }
  /**
   * @description 获取回放运行状态
   * @param { Object } params {id:任务详情ID;taskId:任务ID}
   */
  const _getPlaybackStatus = (params) => {
    getPlaybackStatus().then((res) => {
      if (res.code == 200) {
        playbackStatus.value = res.data.status
        if (res.data.status == 'stopped') {
          if (interval) {
            window.clearInterval(interval)
            interval = null
          }
        }
      }
    })
  }
  /**
   * @description 监听实体是否存在，不存在移除航线图层
   * @param { Object } params {id:任务详情ID;taskId:任务ID}
   */
  const watch_CZML_entity = (params) => {
    const data = taskClosureTimeDetailData.value
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        if (element.id == params.taskId) {
          for (let j = 0; j < element.platformList.length; j++) {
            const platform = element.platformList[j]
            let targetMEntity = window.EarthPlugn.entity._GetCZMLEntity(
              platform.platform,
              'MSIMEarthCZMLProcessContainer'
            )
            if (!window.MSIMEarth.defined(targetMEntity)) {
              console.log('该实体 ' + platform.platform + ' 不存在')
              store.commit('setCurrentNode', {
                code: platform.platform,
                side: platform.side,
                type: platform.platformTypeId
              })
              store.state.targetDetailsCheck[platform.platform] = []
              emitter.emit('planLineChange1', false)
              element.platformList.splice(j, 1)
            }
          }
        }
      }
    }
  }
  /**
   * @description 匹配场景时间跳转对应镜头
   * @param { Object } timeParmas AT时间
   */
  const experimentEventFlyControl = (timeParmas) => {
    let json = { Data: timeParmas }
    let cameraController = new window.EarthPlugn.CameraControl({})
    // 仿真时间
    if (!store.state.sceneModule.isReplayType) {
      // 专为卫星开机设定
      // that.onlyForSatelliteTurnOn(json.Data.T)
      //判断是否为复盘功能进行过滤，防止影响复盘的时间轴倍速
      json.Data.T = Math.round(json.Data.T)
      if (window.EarthViewer.clock.multiplier === 1) {
        let cameraOptionList = store.state.sceneModule.cameraOptionList
        if (cameraOptionList[json.Data.T]) {
          cameraController.flyRecursionByCartesian3(
            cameraOptionList[json.Data.T]
          )
          // addFactorData(json.Data.T)
        }
      }
    }
    if (store.state.experimentModule.review) {
      store.state.experimentModule.reviewTime = json.Data.T
    }
    // 计划导调
    if (store.state.AFSIMModule.dtList) {
      store.state.AFSIMModule.dtList.forEach((e) => {
        console.log('Number(e.Object.runSeconds)', Number(e.object.runSeconds))
        if (e.object && Number(e.object.runSeconds) === json.Data.T) {
          console.log('发送了', e.object)
          emitter.emit('timeDT', e.object)
        }
      })
    }
  }
  /**
   * @description 获取演播列表
   * @param { Object } experimentId 实验ID
   */
  const _queryExperimentJsonFile = (experimentId) => {
    const params = { experimentId }
    queryExperimentJsonFile(params).then((res) => {
      if (res.code == 200) {
        console.log('res.data', res.data)
        store.commit('setCameraOptionList', res.data)
      } else {
        ElMessage.error(res.data)
      }
    })
  }
  /**
   * @description 传入任务ID获取实验信息
   * @param { Object } param {id:任务详情ID;taskId:任务ID}
   */
  const _getExperimentRecordInfo = (param) => {
    getExperimentRecordInfo({ id: param.id }).then((res) => {
      if (res.code === 200) {
        let ExperimentRowInfoId = res.data.sampleId
        _queryExperimentJsonFile(ExperimentRowInfoId)
      }
    })
  }

  const _getOpticalVisibilityData = (fileName) => {
    const params = fileName
    getOpticalVisibilityData(params).then((res) => {
      if (factorName.value == '大气能见度影响模型') {
        cusP.addPrimitiveDQ(res, 'opticalDetectionZone', 'triangles')
        cusP.addPrimitiveDQ(res, 'opticalDetectionZoneLine', 'lines')
      } else if (factorName.value == '云量影响模型') {
      } else if (factorName.value == '风切变影响模型') {
      } else if (factorName.value == '大气湿度影响模型') {
        cusP.addPrimitiveDQ(res, 'infraredDetectionZone', 'triangles')
        cusP.addPrimitiveDQ(res, 'infraredDetectionZoneLine', 'lines')
      }
    })
  }

  const addFactorData = (AT_time) => {
    let beforFileName = ''
    if (factorName.value == '大气能见度影响模型') {
      beforFileName = 'OpticalVisibilityData/max_visibility_matrix_Cstar0.05_00'
    } else if (factorName.value == '云量影响模型') {
      beforFileName = ''
    } else if (factorName.value == '风切变影响模型') {
      beforFileName = ''
    } else if (factorName.value == '大气湿度影响模型') {
      beforFileName = 'Signature/percent_'
    }
    _getOpticalVisibilityData(`${beforFileName}${fileNameNum.value}`)
    interval = window.setInterval(() => {
      fileNameNum.value++
      // 大气能见度 == 可见光
      // 大气湿度 == 红外
      if (factorName.value == '大气能见度影响模型') {
        if (fileNameNum.value > 9) {
          cusP.removeDQPrimitive('opticalDetectionZone', 'triangles')
          cusP.removeDQPrimitive('opticalDetectionZoneLine', 'lines')
        }
      } else if (factorName.value == '云量影响模型') {
        beforFileName = ''
      } else if (factorName.value == '风切变影响模型') {
        beforFileName = ''
      } else if (factorName.value == '大气湿度影响模型') {
        if (fileNameNum.value > 6) {
          cusP.removeDQPrimitive('infraredDetectionZone', 'triangles')
          cusP.removeDQPrimitive('infraredDetectionZoneLine', 'lines')
        }
      }
      let fileName = `${beforFileName}${fileNameNum.value}`
      _getOpticalVisibilityData(fileName)
    }, 60 * 1000)
  }

  onMounted(() => {
    let curUrl = window.location.href
    console.log(curUrl)
    if (curUrl.split('?').length > 1) {
      let data = curUrl.split('?')[1].split('&')
      let params = {}
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        let param = item.split('=')
        params[param[0]] = param[1]
      }
      _getExperimentRecordInfo(params)
      setTimeout(() => {
        if (playbackStatus.value == 'running') {
          _getTaskClosureTimeDetail(params)
        }

        cusP = new window.EarthPlugn.customPritive(
          window.MSIMEarth,
          window.EarthViewer
        )
      }, 10 * 1000)
      setInterval(() => {
        _getPlaybackStatus(params)
      }, 2 * 1000)
      setInterval(() => {
        watch_CZML_entity(params)
      }, 2 * 1000)
    }
    emitter.on('AT', (data) => {
      // experimentEventFlyControl(data)
    })
  })

  return {}
}
