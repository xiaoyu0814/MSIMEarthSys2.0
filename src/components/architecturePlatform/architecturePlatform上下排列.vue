<template>
  <div id="experimentalPreparation">
    <!-- 睡眠波纹荡漾效果 -->
    <div class="sleep-ripple-container" ref="rippleContainer">
      <div class="ripple" v-for="n in 1" :key="n"></div>
    </div>

    <div class="main-background"></div>
    <!-- 粒子效果容器 -->
    <div class="particles-container">
      <div class="particle" v-for="n in 150" :key="n"></div>
    </div>
    <!-- 流光效果 -->
    <div class="light-flow light-flow-1"></div>
    <div class="light-flow light-flow-2"></div>
    <div class="light-flow light-flow-3"></div>
    <!-- 边缘模糊效果容器 -->
    <div class="edge-blur left-blur"></div>
    <div class="edge-blur right-blur"></div>
    <!-- <selfHeader class="header"></selfHeader> -->
    <div class="header-box">
      <home-header :title="systemTitle" class="header"> </home-header>
    </div>
    <div class="menu-box">
      <ul
        class="menu-item"
        v-for="(item, index) in vueData.menuList"
        :key="index"
        @click="goRoute(item, index)"
      >
        <div class="image-container">
          <img
            :src="require(`@/assets/images/${item.image}`)"
            width="297"
            height="308"
          />
        </div>
        <!-- <li class="menu-group-box">
          <div
            class="menu-group"
            v-for="(items, indexs) in item.list"
            :key="indexs"
          >
            <img
              :src="require(`@/assets/images/${items.image}`)"
              width="115"
              height="100"
            />
          </div>
        </li> -->
        <li class="item-label">{{ item.label }}</li>
      </ul>
    </div>
    <!-- 版权信息 -->
    <div class="client-logo">
      <div class="logo-content">{{ Copyright }}</div>
      <div class="version-info">{{ Version }}</div>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, ref } from 'vue'
import selfHeader from './header/header.vue'
import { useRouter } from 'vue-router'
import { getCurrentUser_ } from '@/service/login'
import emitter from '@/utils/eventbus'
import HomeHeader from '@/views/homeHeader/dhHeader'
import store from '@/store/index'
import gsap from 'gsap'
const router = useRouter()
// import { useStore } from 'vuex'
// const store = useStore()
let currentSeat = localStorage.getItem('systemTitle')
// 睡眠波纹容器引用
const rippleContainer = ref(null)
// 获取Copyright和Version配置
const Copyright = ref(EarthAPP.Copyright)
const Version = ref(EarthAPP.Version)
let vueData = reactive({
  systemTitle: '数据资源中心-' + currentSeat, // 系统标题
  menuList: [
    {
      label: '实验资源管理',
      url: experimentalResourceManagement,
      image: '下1.png',
      list: [
        {
          name: '基础数据管理',
          image: '下1.png',
          url: experimentalPreparation
        }
      ]
    },
    {
      label: '实验准备',
      url: experimentalPreparation,
      image: '下2.png',
      list: [
        {
          name: '导调控制席',
          image: 'group2-1.png',
          url: experimentalPreparation
        }
      ]
    },
    {
      label: '实验仿真',
      route: experimentalSimulation,
      image: '上1.png',
      list: [
        {
          name: '导调控制席',
          image: 'group1-3.png',
          route: experimentalSimulation
        }
      ]
    },
    {
      label: '实验数据分析',
      url: experimentalStatics,
      image: '上2.png',
      list: [
        {
          name: '导调控制席',
          image: 'group3-1.png',
          route: '/home/taskList'
        }
      ]
    },
    {
      label: '实验复盘',
      route: experimentalReview,
      image: '上3.png',
      list: [
        {
          name: '导调控制席',
          image: 'group2-3.png',
          route: experimentalReview
        }
      ]
    }
  ]
})
if (EarthAPP.systemTitle != '') {
  vueData.systemTitle = EarthAPP.systemTitle
}

const goRoute = (item, index) => {
  if (item.route) {
    localStorage.setItem('systemTitle', item.name)
    configSubSystemTitle(item.label)
    router.push(item.route)
  } else {
    window.open(item.url)
  }
}
// 配置分系统名称
const configSubSystemTitle = (title) => {
  store.state.experimentModule.subSysName = title
  window.localStorage.setItem('subSysName', title)
}

// if (window.isBack) {
//   location.reload()
//   window.isBack = false
// }

onMounted(() => {
  store.commit('set_isSimulationList', false) //仿真实验分系统左侧实验列表默认不显示，flyto结束后才显示
  let param = router.currentRoute.value.query

  if (param.token) {
    // let token = param.token
    // let taskId = param.taskId
    // let taskName = param.taskName
    // let taskDate = param.taskDate
    // let roomId = param.roomId
    // let roleKey = param.roleKey
    // let roleName = param.roleName
    // let groupType = param.groupType
    // sessionStorage.setItem('token', token)
    // sessionStorage.setItem('taskId', taskId)
    // sessionStorage.setItem('taskName', taskName)
    // sessionStorage.setItem('taskDate', taskDate)
    // sessionStorage.setItem('roomId', roomId)
    // sessionStorage.setItem('roleKey', roleKey)
    // sessionStorage.setItem('roleName', roleName)
    // sessionStorage.setItem('groupType', groupType)
    // localStorage.setItem('systemTitle', roleName)
    // getCurrentUser_({}).then((res) => {
    //   console.log(res)
    //   if (res.code == 200) {
    //     sessionStorage.setItem('userId', res.user.userId)
    //     sessionStorage.setItem('username', res.user.nickName)
    //     sessionStorage.setItem('identifcation', res.user.identifcation)
    //     window.localStorage.setItem('account', res.user.nickName)
    //     if (res.user.userName == 'reduser') {
    //       window.localStorage.setItem('side', 'red')
    //     } else if (res.user.userName == 'blueuser') {
    //       window.localStorage.setItem('side', 'blue')
    //     } else {
    //       window.localStorage.setItem('side', res.user.userName)
    //     }
    //     router.push('/experimentalPreparation')
    //   }
    // })
  }
  let getGoToWhere = (roleName) => {
    let isTeacher = true
    if (
      roleName == '地防席' ||
      roleName == '电子对抗席' ||
      roleName == '情报席' ||
      roleName == '作训席' ||
      roleName == '评估席位' ||
      roleName == '指挥席' ||
      roleName == '指挥控制席'
    ) {
      isTeacher = false
    }
    return isTeacher
  }

  slideInUp()

  imageMove()

  // 启动粒子动画
  initParticles()

  // 启动流光效果
  initLightFlow()

  // 组件加载完成后，延迟2秒隐藏睡眠波纹效果
  setTimeout(() => {
    if (rippleContainer.value) {
      rippleContainer.value.classList.add('hidden')
      // 完全隐藏后移除元素，释放资源
      setTimeout(() => {
        if (rippleContainer.value && rippleContainer.value.parentNode) {
          rippleContainer.value.parentNode.removeChild(rippleContainer.value)
        }
      }, 1000) // 等待1秒的过渡动画完成后移除
    }
  }, 2000)
})

// 渐显效果
const slideInUp = () => {
  // 针对图片的渐显效果优化
  gsap.set('.main-background', {
    opacity: 0,
    scale: 1.05 // 稍微放大一点作为初始状态
    // filter: 'blur(12px) saturate(0.8)' // 图片特有的模糊和低饱和度
  })

  // 图片渐显动画 - 模拟照片逐渐清晰的效果
  gsap.to('.main-background', {
    opacity: 1,
    scale: 1, // 恢复正常大小
    // filter: 'blur(0) saturate(1)', // 清晰且恢复饱和度
    duration: 1, // 稍长的时长适合图片展示
    ease: 'expo.out', // 指数缓动，开始慢然后加速
    delay: 0.1, // 等待图片加载的微小延迟
    onStart: function () {
      // 确保图片加载完成再开始动画
      const img = document.querySelector('.main-background')
      if (img.complete) return

      img.onload = () => {
        // 重置动画以在图片加载后开始
        this.restart()
      }
    }
  })
}

// 图片下移效果
const imageMove = () => {
  // 重置元素状态
  gsap.set('.header-box', { opacity: 0, y: -10 })

  // 同时处理透明度和位置
  gsap.to('.header-box', {
    opacity: 1,
    y: 8, // 移动到原始位置
    duration: 1,
    ease: 'power2.out'
  })

  // 重置元素状态
  gsap.set('.menu-item', { opacity: 0, y: -20 })

  // 同时处理透明度和位置
  gsap.to('.menu-item', {
    opacity: 1,
    y: 0, // 移动到原始位置
    duration: 1,
    ease: 'power2.out'
  })
}

// 粒子效果初始化
const initParticles = () => {
  const particles = document.querySelectorAll('.particle')

  particles.forEach((particle, index) => {
    // 随机位置
    gsap.set(particle, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      opacity: Math.random() * 0.6 + 0.2,
      scale: Math.random() * 0.5 + 0.4
    })

    // 粒子动画
    gsap.to(particle, {
      y: -100,
      x: '+=' + (Math.random() * 200 - 100),
      opacity: 0,
      duration: Math.random() * 10 + 10,
      repeat: -1,
      ease: 'none',
      delay: Math.random() * 5,
      onRepeat: function () {
        // 重置粒子位置
        gsap.set(particle, {
          y: window.innerHeight + 150,
          x: Math.random() * window.innerWidth,
          opacity: Math.random() * 0.6 + 0.2
        })
      }
    })
  })
}

// 流光效果初始化
const initLightFlow = () => {
  const lightFlows = document.querySelectorAll('.light-flow')

  lightFlows.forEach((flow, index) => {
    // 初始位置
    gsap.set(flow, {
      x: -300,
      opacity: 0,
      rotation: Math.random() * 30 - 15
    })

    // 流光动画
    gsap.to(flow, {
      x: window.innerWidth + 100,
      opacity: 1,
      duration: 8 + index * 2,
      repeat: -1,
      ease: 'none',
      delay: index * 3,
      onRepeat: function () {
        // 随机重置位置和透明度
        gsap.set(flow, {
          x: -300,
          opacity: 0,
          rotation: Math.random() * 30 - 15
        })
      }
    })
  })
}
</script>
<style lang="less" scoped>
@font-face {
  font-family: 'YouSheBiaoTiHei';
  src: url('@/assets/fontFamily/YouSheBiaoTiHei.ttf');
}

#experimentalPreparation {
  //background: url(@/assets/images/tx-bg.png);
  background: url(@/assets/images/tx-bg.png);
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;

  // 睡眠波纹荡漾效果
  .sleep-ripple-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    z-index: 1002;
    pointer-events: none;
    transition: opacity 1s ease-out;
    opacity: 0.2;
  }

  .sleep-ripple-container.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border: 2px solid rgba(0, 212, 255, 0.4);
    border-radius: 30px;
    animation: sleepRipple 3s ease-out infinite;
    opacity: 0;
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
    background: radial-gradient(
      ellipse,
      rgba(0, 212, 255, 0.05) 0%,
      transparent 60%
    );
  }

  // 为每个波纹设置不同的动画延迟
  .ripple:nth-child(1) {
    animation-delay: 0s;
  }

  .ripple:nth-child(2) {
    animation-delay: 0.75s;
  }

  .ripple:nth-child(3) {
    animation-delay: 1.5s;
  }

  .ripple:nth-child(4) {
    animation-delay: 2.25s;
  }

  // 波纹扩散动画
  @keyframes sleepRipple {
    0% {
      width: 0;
      height: 0;
      opacity: 0.6;
      border-width: 2px;
    }
    100% {
      width: 1600px;
      height: 800px;
      opacity: 0;
      border-width: 1px;
    }
  }

  .main-background {
    // background: url(@/assets/images/底座.png);
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    z-index: 1;
  }

  // 边缘模糊效果 - 顶部
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
    filter: blur(20px);
    z-index: 1001;
    pointer-events: none;
  }

  // 边缘模糊效果 - 底部
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    filter: blur(20px);
    z-index: 1001;
    pointer-events: none;
  }

  // 边缘模糊效果 - 左右两侧
  .edge-blur {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100px;
    filter: blur(20px);
    z-index: 1001;
    pointer-events: none;
  }

  .left-blur {
    left: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent);
  }

  .right-blur {
    right: 0;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.8), transparent);
  }

  /* 粒子效果样式 */
  .particles-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    width: 6px;
    height: 6px;
    background: radial-gradient(
      circle,
      rgba(0, 212, 255, 0.8) 0%,
      rgba(0, 212, 255, 0) 70%
    );
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
  }

  /* 流光效果样式 */
  .light-flow {
    position: absolute;
    width: 100px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 212, 255, 0.3) 20%,
      rgba(0, 212, 255, 0.8) 50%,
      rgba(0, 212, 255, 0.3) 80%,
      transparent 100%
    );
    z-index: 3;
    pointer-events: none;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
  }

  .light-flow-1 {
    top: 20%;
  }

  .light-flow-2 {
    top: 50%;
    animation-delay: 2s;
  }

  .light-flow-3 {
    top: 80%;
    animation-delay: 4s;
  }

  .header-box {
    z-index: 999;
    width: 100%;
    /* height: 10%; */
    position: absolute;
    top: -10px;
    .header {
      background: linear-gradient(
        180deg,
        #074672 0%,
        #002e5e 54%,
        #002954 100%
      );
      box-shadow: 0px 0px 18px 0px #0066ba, inset 0px 0px 66px 0px #00a2ff;
      // opacity: 0.6;
      border: 2px solid #51c1ff;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 999;
    }
  }

  /* 定义关键帧动画 */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .menu-box {
    // background: url(@/assets/images/中间背板.png) no-repeat;
    width: 100%;
    height: 50%;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 29%;
    z-index: 999;
    animation: fadeIn 2s; /* 动画名称 持续时间 */

    .menu-item {
      // background: url(@/assets/images/menu-bg.png) no-repeat;
      height: 378px;
      width: 317px;
      padding: 0;
      position: relative;
      top: 25px;

      ::v-deep(li::marker) {
        content: '';
      }

      .item-label {
        position: relative;
        top: -142px;
        // top: -120px;
        // padding: 60px 50px 20px 50px;
        font-size: 26px;
        font-family: yahei; //YouSheBiaoTiHei
        font-weight: bold;
        color: #ffffff;
        line-height: 47px;
        text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2),
          0px 2px 2px rgba(0, 0, 0, 0), 0px 0px 20px rgba(0, 212, 255, 0.3);
        background: linear-gradient(180deg, #ffffff 0%, #00d4ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        z-index: 1000;
      }

      .menu-group-box {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 30px 30px 30px;
        align-items: center;
        height: calc(100% - 217px);

        .menu-group {
          width: 90%;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid transparent;
        }

        // .menu-group:hover {
        //   box-sizing: content-box;
        //   width: 48%;
        //   height: 100px;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   background: linear-gradient(
        //     180deg,
        //     #008aec 0%,
        //     #004d9d 54%,
        //     #005ab8 100%
        //   );
        //   box-shadow: 0px 0px 18px 0px #0066ba, inset 0px 0px 66px 0px #00a2ff;
        //   border: 2px solid #51c1ff;
        // }
      }
    }

    .menu-item:hover {
      cursor: pointer;
      background: linear-gradient(
        80deg,
        #008aec23 0%,
        #004c9d21 54%,
        #0059b831 100%
      );
      box-shadow: 0px 0px 18px 0px #68d3ee50, inset 0px 0px 66px 0px #08f0f04b;
      // border: 2px solid #51c1ff;
    }
  }

  .menu-box ul:first-child {
    transform: translate(358px, 155px) !important;
  }

  .menu-box ul:nth-child(2) {
    transform: translate(615px, 155px) !important;
  }

  .menu-box ul:nth-child(3) {
    transform: translate(-380px, -165px) !important;
  }

  .menu-box ul:nth-child(4) {
    transform: translate(-305px, -165px) !important;
  }
  .menu-box ul:nth-child(5) {
    transform: translate(-240px, -165px) !important;
  }

  // .menu-box ul:first-child li {
  //   transform: rotate(2deg) !important;
  // }
  // .menu-box ul:nth-child(2) li {
  //   transform: rotate(1deg) !important;
  //   top: -107px !important;
  // }
  // .menu-box ul:nth-child(3) li {
  //   top: -103px !important;
  // }
  // .menu-box ul:nth-child(4) li {
  //   transform: rotate(-1deg) !important;
  //   top: -107px !important;
  // }
  // .menu-box ul:nth-child(5) li {
  //   transform: rotate(-3deg) !important;
  //   top: -117px !important;
  // }

  /* 甲方信息logo样式 */
  .client-logo {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1001;
    pointer-events: none;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    backdrop-filter: blur(5px);
  }

  .logo-content {
    font-size: 19px;
    font-family: yahei;
    font-weight: bold;
    color: #ffffff;
    line-height: 30px;
    text-shadow: 0px 0px 15px rgba(0, 212, 255, 0.8),
      0px 0px 30px rgba(0, 212, 255, 0.5), 0px 2px 5px rgba(0, 0, 0, 0.5);
    background: linear-gradient(180deg, #ffffff 0%, #00d4ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
  }

  .version-info {
    font-size: 16px;
    font-family: yahei;
    font-weight: bold;
    color: #ffffff;
    line-height: 24px;
    text-shadow: 0px 0px 15px rgba(0, 212, 255, 0.8),
      0px 0px 30px rgba(0, 212, 255, 0.5), 0px 2px 5px rgba(0, 0, 0, 0.5);
    background: linear-gradient(180deg, #ffffff 0%, #00d4ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 4px;
    letter-spacing: 1px;
  }
}
</style>
