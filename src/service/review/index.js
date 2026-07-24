import http from '../request/http'

// 仿真开始
export const fpStartService = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.reviewService}/api/playback/start`,
    params
  })
}

// 仿真停止
export const fpStopService = () => {
  return http({
    method: 'get',
    url: `${serverUrls.reviewService}/api/playback/stop`
  })
}

// 仿真暂停
export const fpPauseService = () => {
  return http({
    method: 'get',
    url: `${serverUrls.reviewService}/api/playback/pause`
  })
}

// 仿真继续
export const fpResumeService = () => {
  return http({
    method: 'get',
    url: `${serverUrls.reviewService}/api/playback/resume`
  })
}

// 仿真倍率
export const fpSetclockRateService = (data) => {
  return http({
    method: 'get',
    url: `${serverUrls.reviewService}/api/playback/setclockrate`,
    params: data
  })
}

// 时间跳转
export const fpSetadvancetotime = (data) => {
  return http({
    method: 'get',
    url: `${serverUrls.reviewService}/api/playback/advancetotime`,
    params: data
  })
}

export const getExperimentRecordInfo = (data) => {
  return http({
    url: `${serverUrls.serversCalculation}experiment/record/v1/getInfo`,
    method: 'get',
    params: data
  })
}

// 第一步列表接口
export const getExperimentRowInfo = (data) => {
  return http({
    // url: `${serverUrls.experiment}experiment/v1/getPage`,
    url: `${serverUrls.serversCalculation}/experimentSubjects/query`,
    method: 'get',
    params: data
  })
}
