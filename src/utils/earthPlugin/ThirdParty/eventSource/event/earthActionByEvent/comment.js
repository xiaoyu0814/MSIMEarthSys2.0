import store from '@/store'
import { getOperationInof } from '@/service/SSE'
export default function () {
  const handleComment = (commentArr) => {
    if (commentArr.operations) {
    } else {
      getOperationInof().then((res) => {
        let param = ''
        if (commentArr.belongingOperation) {
          param = commentArr.belongingOperation
        } else if (commentArr.methods) {
          param = commentArr.methods
        }
        let { info, jd } = infoConfig(res, param)
        window.localStorage.setItem('bluePrint', info)
        switch (jd) {
          case 0:
            store.state.sceneModule.identifyColor = {
              color1: 'rgba(19, 240, 240, 0.26)',
              color2: 'rgba(0, 255, 195, 0)',
              textShadow1: '#00ffc3',
              textShadow2: '#00ffc3',
              jd: 0
            }
            break
          case 1:
            store.state.sceneModule.identifyColor = {
              color1: 'rgba(255, 2, 2, 0.06)',
              color2: 'rgba(255, 2, 2, 0.06)',
              textShadow1: '#f63b4c',
              textShadow2: '#f63b4c',
              jd: 1
            }
            break
          case 2:
            store.state.sceneModule.identifyColor = {
              color1: 'rgba(240, 236, 19, 0.26)',
              color2: 'rgba(240, 236, 19, 0.26)',
              textShadow1: '#ecf013',
              textShadow2: '#ecf013',
              jd: 2
            }
            break
          default:
            break
        }
        store.state.sceneModule.identifyInfo = info
        store.state.sceneModule.phasedDescription.push({
          time: '',
          key: 'suicide attack',
          value: info
        })
        store.state.sceneModule.showIdentify = true
      })
    }
  }
  return {
    handleComment
  }
}

function infoConfig(res, text) {
  let info = res['operation'][text]
  let jd = 0
  if (typeof info === 'undefined') {
    info = res['method'][text]
    jd = 1
    if (typeof info === 'undefined') {
      info = res['phase'][text]
      jd = 2
    }
  }
  return {
    info: info,
    jd: jd
  }
}
