<template>
  <div id="experimentalPreparation">
    <div class="main-background"></div>
    <!-- 粒子效果容器 -->
    <div class="particles-container">
      <div class="particle" v-for="n in 50" :key="n"></div>
    </div>
    <!-- 流光效果 -->
    <div class="light-flow light-flow-1"></div>
    <div class="light-flow light-flow-2"></div>
    <div class="light-flow light-flow-3"></div>
    <!-- <selfHeader class="header"></selfHeader> -->
    <div class="header-box">
      <home-header :title="systemTitle" class="header"> </home-header>
    </div>
    <div class="menu-box">
      <ul
        class="menu-item"
        v-for="(item, index) in vueData.menuList"
        :style="item.style"
        :key="index"
        @click="goRoute(item, index)"
      >
        <img
          :src="require(`@/assets/images/dheader/${item.image}`)"
          width="430"
          height="350"
        />
        <li class="item-label">{{ item.label }}</li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import selfHeader from './/header/header.vue'
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
let vueData = reactive({
  systemTitle: '数据资源中心-' + currentSeat, // 系统标题
  menuList: [
    {
      label: '实验资源管理',
      url: experimentalResourceManagement,
      image: '实验数据资源管理.png',
      style: 'bottom:5%;left:16%',
      list: [
        {
          name: '基础数据管理',
          image: '左1.png',
          url: experimentalPreparation
        }
      ]
    },
    {
      label: '实验准备',
      url: experimentalPreparation,
      image: '实验准备.png',
      style: 'bottom:5%;right:11%',
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
      image: '实验仿真.png',
      style: 'top:10%;left:14%',
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
      image: '实验数据分析.png',
      style: 'top:24%;left:41%',
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
      image: '实验回放.png',
      style: 'top:16%;right:9%',
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

  .main-background {
    // background: url(@/assets/images/底座.png);
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    z-index: 1;
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
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 29%;
    z-index: 999;
    animation: fadeIn 2s;
    /* 动画名称 持续时间 */

    .menu-item {
      // background: url(@/assets/images/menu-bg.png) no-repeat;
      height: 350px;
      width: 430px;
      padding: 0;
      position: fixed;

      ::v-deep(li::marker) {
        content: '';
      }

      .item-label {
        position: relative;
        top: -120px;
        // padding: 60px 50px 20px 50px;
        font-size: 21px;
        font-family: YouSheBiaoTiHei;
        color: #ffffff;
        line-height: 47px;
        text-shadow: 0px 2px 2px rgba(15, 69, 85, 0.5);
        background: linear-gradient(180deg, #ffffff 0%, #a5daff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
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

  .menu-box ul:first-child li {
    transform: rotate(2deg) !important;
  }

  .menu-box ul:nth-child(2) li {
    transform: rotate(1deg) !important;
    top: -107px !important;
  }

  .menu-box ul:nth-child(3) li {
    top: -103px !important;
  }

  .menu-box ul:nth-child(4) li {
    transform: rotate(-1deg) !important;
    top: -107px !important;
  }

  .menu-box ul:nth-child(5) li {
    transform: rotate(-3deg) !important;
    top: -117px !important;
  }
}
</style>
