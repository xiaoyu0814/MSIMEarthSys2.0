import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import emitter from '@/utils/eventbus'
import {
  loginSystem,
  loginSystem_,
  getCurrentRoleAuthInfo,
  getCurrentUser,
  login,
  getCurrentUser_,
  getUsers
} from '@/service/login'
import Cookies from 'js-cookie'
import store from '@/store'
import { tts } from '@/service/videoServer/videoManagement'

export default function () {
  const state = reactive({
    userName: '',
    password: '',
    loginLoading: false
  })
  const loginBGImgUrl = ref(require(`../../../assets/image/login/loginBG.png`))
  const router = useRouter()
  emitter.on('load', async (val) => {
    // 语音登录
    if (val.cmd == 'system-load') {
      state.userName = 'admin'
      state.password = 'admin123'
      loginClick()
    }
  })
  const loginClick = () => {
    if (state.userName == 'zhibo') {
      window.open('http://localhost:8080/#/liveBroadcast')
    } else {
      state.loginLoading = true
      let params = {
        account: state.userName,
        password: state.password
      }
      loginSystem_(params)
        .then((res) => {
          if (res && res.code == 200) {
            window.localStorage.setItem('account', state.userName)
            if (res.code == 200) {
              let curUserInfo = res.data
              let side = curUserInfo.roleCode || 'admin'
              getUserInfo()
              getCurrentUser({ account: curUserInfo.account })
                .then((result) => {
                  if (result.code == 200) {
                    // let side = result.data.roleCode || 'admin'
                    store.state.homeModule.roleProperty = side
                    window.localStorage.setItem('side', side)
                    window.localStorage.setItem(
                      'account',
                      result.data.account ? result.data.account : state.userName
                    )
                    router.push({
                      path: '/architecturePlatform'
                    })
                  } else {
                    state.loginLoading = false
                  }
                })
                .catch((err) => {
                  console.error('获取用户信息失败:', err)
                  state.loginLoading = false
                })
            } else {
              state.loginLoading = false
            }
          } else {
            // ElMessage.warning('登录失败，请输入正确的用户名或密码!')
            ElMessage.warning(res.data)
            state.loginLoading = false
          }
        })
        .catch((err) => {
          ElMessage.warning('登录失败，请输入正确的用户名或密码!', err)
        })
    }
  }

  const getUserInfo = () => {
    getUsers({
      pageNum: 1, //当前的页数
      pageSize: 100000 //当前每页显示多少条
    }).then((response) => {
      if (response.code === 200) {
        let userList = response.data.records
        let name = window.localStorage.getItem('account')
        for (let i = 0; i < userList.length; i++) {
          if (userList[i].account === name) {
            window.localStorage.setItem('roleCode', userList[i].roleCode)
          }
        }
      } else {
      }
    })
  }

  const loginClick_ = () => {
    state.loginLoading = true
    let params = {
      username: state.userName,
      password: state.password
    }
    loginSystem(params).then((res) => {
      if (res.code == 200) {
        // sessionStorage.setItem('token', res.data.token)
        // sessionStorage.setItem('userId', res.data.user.userId)
        // sessionStorage.setItem('username', res.data.user.nickName)
        // sessionStorage.setItem('taskId', res.data.tasks?.id)
        // sessionStorage.setItem('taskName', res.data.tasks?.name)
        // sessionStorage.setItem('taskDate', res.data.tasks?.ctime)
        // sessionStorage.setItem('roomId', res.data.seatId)
        // sessionStorage.setItem('roleKey', res.data.userRoleInfo.roleKey)
        // sessionStorage.setItem('roleName', res.data.userRoleInfo.roleName)
        // sessionStorage.setItem('identifcation', res.data.user.identifcation)
        // sessionStorage.setItem('groupType', res.data.userRoleInfo.groupType)
        // groupType属方  0：导演方  2：红方  3：蓝方
        //roleKey pilotseat:白方导调控制;DimensionalSituation:白方态势席;Commandseat:指挥控制席
        // window.localStorage.setItem('account', res.data.user.nickName)
        getCurrentUser().then((res_) => {
          if (res_.code == 200) {
            if (res_.user.userName == 'reduser') {
              window.localStorage.setItem('side', 'red')
            } else if (res_.user.userName == 'blueuser') {
              window.localStorage.setItem('side', 'blue')
            } else {
              window.localStorage.setItem('side', res_.user.userName)
            }
            if (getGoToWhere(res.data.userRoleInfo.roleName)) {
              router.push('/architecturePlatform')
            } else {
              localStorage.setItem(
                'systemTitle',
                res.data.userRoleInfo.roleName
              )
              if (EarthAPP.seatRoute.includes(res.data.userRoleInfo.roleName)) {
                router.push('/' + res.data.userRoleInfo.roleKey)
              } else {
                router.push('/home/' + res.data.userRoleInfo.roleKey)
              }
            }
            ElMessage.success('登录成功！')
          }
        })
      } else {
        ElMessage.error('登录失败')
        state.loginLoading = false
      }
    })
  }
  const setUserInfo = () => {
    setCookie('account', state.userName)
    // base64加密密码
    let passWord = state.password
    setCookie('password', passWord)
  }
  let getGoToWhere = (roleName) => {
    let isTeacher = true
    if (
      roleName == '地防席' ||
      roleName == '电子对抗席' ||
      roleName == '情报席' ||
      roleName == '作训席' ||
      roleName == '裁决评估席' ||
      roleName == '指挥席' ||
      roleName == '指挥控制席' ||
      roleName == '态势席' ||
      roleName == '评估席位' ||
      roleName == '保障席'
    ) {
      isTeacher = false
    }
    return isTeacher
  }
  // 保存cookie
  const setCookie = (cName, value, expiredays) => {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie =
      cName +
      '=' +
      decodeURIComponent(value) +
      (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
  }
  return {
    loginClick,
    loginBGImgUrl,
    state
  }
}

window.tts = () => {
  let params = {
    text: '不~嘛~！我就要跟贤者玩~！难道他真的是赋能哥~？ 颗~秒~。'
  }
  tts(params)
    .then(async (res) => {
      if (res) {
        // 处理文件流并转换为可播放的URL
        const audioUrl = await convertBlobToUrl(res)
        playAudio(audioUrl)
      } else {
        emitter.emit('configVoice', textVal.value)
      }
    })
    .catch((err) => {
      emitter.emit('configVoice', textVal.value)
    })
}

// 新增函数：将文件流转换为可播放的URL
const convertBlobToUrl = (blob) => {
  return new Promise((resolve) => {
    // 创建一个Blob对象
    const audioBlob = new Blob([blob], { type: 'audio/wav' }) // 根据实际音频格式调整type
    // 创建可访问的URL
    const audioUrl = URL.createObjectURL(audioBlob)
    resolve(audioUrl)
  })
}

const playAudio = (dataPath) => {
  // 语音文件路径（支持 mp3/wav/ogg 等主流格式）
  const audio = new Audio(dataPath)

  // 播放（返回 Promise，可捕获播放失败）
  audio.play().catch((error) => {
    console.error('播放失败：', error)
    // 常见原因：浏览器要求用户交互后才能播放（如点击/触摸）
  })

  // 在音频播放结束后释放资源
  audio.addEventListener('loadstart', () => {
    // 可以在这里添加加载开始的逻辑
  })

  audio.addEventListener('ended', () => {
    // 播放结束后释放URL资源
    URL.revokeObjectURL(dataPath)
  })
}
