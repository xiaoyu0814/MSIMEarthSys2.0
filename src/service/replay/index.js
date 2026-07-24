import http from '../request/http'

export const getTaskClosureTimeDetail = () => {
  return http({
    method: 'get',
    url: `./static/config/json/fp/taskClosureTimeDetail.json`
  })
}

export const getOpticalVisibilityData = (fileName) => {
  return http({
    method: 'get',
    url: `./static/config/json/fp/${fileName}.json`
  })
}

export const getPlaybackStatus = () => {
  return http({
    method: 'get',
    url: `${serverUrls.reviewService}/api/playback/status`
  })
}
