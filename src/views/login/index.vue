<template>
  <div class="loginBody">
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
    <div class="loginBodyLeft wow fadeInLeft" data-wow-delay="0.3s">
      <img src="./assets/qiu5.png" alt="" />
    </div>
    <div class="loginBodyCenter">
      <div class="shuzibg"></div>
      <div class="loginTitle wow fadeInDown">
        <p>{{ loginSysTitle }}</p>
      </div>
      <div class="loginR wow fadeInRight">
        <cornerMark></cornerMark>
        <div class="loginInner">
          <div class="loginTitle2 wow fadeInDown" data-wow-delay="0.8s">
            欢迎登录系统!
          </div>
          <div class="loginInput wow fadeInLeft" data-wow-delay="1.2s">
            <div class="icon"><img src="./assets/icon_user.png" alt="" /></div>
            <input
              id="nameInput"
              v-model="userName"
              type="text"
              placeholder="请输入账号"
              @keyup.enter="loginClick"
            />
            <div class="close" v-if="userName" @click="clearInfo('userName')">
              <img src="./assets/icon_login_delete.png" alt="" />
            </div>
          </div>
          <div class="loginInput wow fadeInLeft" data-wow-delay="1.5s">
            <div class="icon"><img src="./assets/icon_pwd.png" alt="" /></div>
            <input
              id="passwordInput"
              class="inputClass"
              v-model="password"
              placeholder="密码"
              type="password"
              @keyup.enter="loginClick"
            />
            <div class="close" v-if="password" @click="clearInfo('password')">
              <img src="./assets/icon_login_delete.png" alt="" />
            </div>
          </div>
          <div class="forgetBody"></div>
          <div
            class="loginBut cur wow fadeInUp"
            data-wow-delay="2.1s"
            @click="loginClick"
          >
            <span>登录</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="bolang" class="bolang wow fadeInUp" data-wow-delay="0.3s"></div>
    <div class="client-logo">
      <div class="logo-content">{{ copyrightInfo }}</div>
      <div class="version-info">{{ versionInfo }}</div>
    </div>
  </div>
</template>

<script>
import WOW from 'wow.js'
import cornerMark from './components/cornerMark.vue'
import rememberPwd from '@/components/login/rememberPwd/rememberPwd.vue'
import gsap from 'gsap'
import { ElMessage } from 'element-plus'
import { login } from '@/views/login/hooks/index'
import { websocket } from '@/views/hooks/index'
import { onMounted, toRefs, ref, reactive, computed, onUnmounted } from 'vue'
import store from '@/store'
export default {
  name: 'login',
  components: { cornerMark, rememberPwd },
  setup() {
    websocket()
    const loginSysTitle = computed(() => {
      const titleExtension = store.state.sceneModule.systemConfig.titleExtension
      if (titleExtension) {
        return EarthAPP.sysTitleQZ + EarthAPP.sysTitle
      }
      return EarthAPP.sysTitle
    })
    const loginTitle = ref(EarthAPP.sysTitle)
    if (EarthAPP.loginTitle != '') {
      loginTitle.value = EarthAPP.loginTitle
    }
    const copyrightInfo = ref(EarthAPP.Copyright)
    const versionInfo = ref(EarthAPP.Version)
    const { loginBGImgUrl, loginClick, state } = login()

    const particleCanvas = ref(null)
    let animationId = null
    let particles = []
    const particleCount = 150
    const connectionDistance = 150
    const mouseDistance = 200

    class Particle {
      constructor(canvas) {
        this.canvas = canvas
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 1
        this.color = this.getRandomColor()
        this.opacity = Math.random() * 0.5 + 0.3
      }

      getRandomColor() {
        const colors = [
          '0, 191, 255',
          '0, 255, 255',
          '0, 212, 255',
          '100, 149, 237',
          '72, 209, 204'
        ]
        return colors[Math.floor(Math.random() * colors.length)]
      }

      update(canvasWidth, canvasHeight) {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvasWidth) this.vx *= -1
        if (this.y < 0 || this.y > canvasHeight) this.vy *= -1

        this.x = Math.max(0, Math.min(canvasWidth, this.x))
        this.y = Math.max(0, Math.min(canvasHeight, this.y))
      }

      draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`
        ctx.fill()

        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 3
        )
        gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(${this.color}, 0)`)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    function initParticles(canvas) {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas))
      }
    }

    function animate() {
      const canvas = particleCanvas.value
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height)
        particle.draw(ctx)
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 191, 255, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    function handleResize() {
      const canvas = particleCanvas.value
      if (!canvas) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    onMounted(() => {
      const canvas = particleCanvas.value
      if (!canvas) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      initParticles(canvas)
      animate()
      window.addEventListener('resize', handleResize)

      var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true,
        callback: function (box) {},
        scrollContainer: null,
        resetAnimation: true
      })
      wow.init()
      gsap.to('.bolang wow fadeInUp', {
        duration: 20,
        bottom: -20,
        repeat: -1,
        yoyo: true
      })

      gsap.set('.loginBodyLeft', { opacity: 0, x: -40 })

      gsap.to('.loginBodyLeft', {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out'
      })

      slideInUp()
      localStorage.setItem('currentFlyType', JSON.stringify([{ name: '' }]))
    })

    onUnmounted(() => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', handleResize)
    })

    const slideInUp = () => {
      gsap.set('.loginInner', {
        opacity: 0,
        scale: 1.05,
        filter: 'blur(0) saturate(0.8)'
      })

      gsap.to('.loginInner', {
        opacity: 1,
        scale: 1,
        filter: 'blur(0) saturate(1)',
        duration: 1,
        ease: 'expo.out',
        delay: 0.1,
        onStart: function () {
          const img = document.querySelector('.loginInner')
          if (img.complete) return

          img.onload = () => {
            this.restart()
          }
        }
      })
    }
    const clearInfo = (e) => {
      console.log(e)
      if (e == 'userName') {
        document.getElementById('nameInput').value = ''
      } else if (e == 'password') {
        document.getElementById('passwordInput').value = ''
      }
    }
    return {
      loginBGImgUrl,
      loginClick,
      clearInfo,
      loginTitle,
      loginSysTitle,
      copyrightInfo,
      versionInfo,
      particleCanvas,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="less" scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.bolang {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 310px;
  background: url('./assets/bolang.png') no-repeat;
  background-size: 100% 100%;
  pointer-events: none;
  z-index: 10;
}

.loginBody {
  background: url('./assets/bg.png') center center no-repeat;
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;

  .loginBodyLeft {
    width: 50%;
    position: relative;
    height: 100%;
    left: 40px;
  }

  .shuzibg {
    background-size: contain;
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0.6;
    z-index: -1;
  }

  .loginBodyCenter {
    width: 50%;
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: column;
    align-content: flex-start;
    z-index: 10;

    .loginR {
      width: 631px;
      background: rgba(#20a3f5, 0.1);
      display: flex;
      min-height: 400px;
      justify-content: flex-start;
      border: 2px solid rgba(17, 107, 178, 1);
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: column;
      padding-bottom: 60px;
      align-content: flex-start;
      position: relative;

      .titleImg {
        width: 242px;
        height: 26px;
        margin: 0 auto;
        margin-top: 57px;
        margin-bottom: 42px;
      }

      .loginInput {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        background: rgba(24, 80, 136, 0.4);
        flex-direction: row;
        margin-bottom: 25px;
        align-content: flex-start;
        position: relative;
        height: 56px;
        border: 2px solid rgba(#20a3f5, 0.4);

        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: nowrap;
          flex-direction: row;
          align-content: flex-start;
          width: 65px;

          img {
            width: 23px;
          }
        }

        .inputClass {
          background: rgba(24, 80, 136, 0.4);
        }

        input {
          width: 100%;
          height: 57px;
          position: relative;
          border: none;
          color: #fff;
          outline: none;
          font-size: 20px;
          font-family: PingFang;
          font-weight: bold;
          background: rgba(24, 80, 136, 0.4);
        }

        input::-webkit-input-placeholder {
          color: rgba(#ffffff, 1);
        }

        input::-moz-placeholder {
          color: rgba(#ffffff, 1);
        }

        input:-moz-placeholder {
          color: rgba(#ffffff, 1);
        }

        input:-ms-input-placeholder {
          color: rgba(#ffffff, 1);
        }

        input:-webkit-autofill {
          font-size: 20px;
          transition: background-color 5000s ease-in-out 0s;
          -webkit-text-fill-color: rgba(#ffffff, 1);
        }
      }

      .loginInner {
        width: 512px;

        .loginTitle2 {
          font-family: PingFang;
          font-weight: 400;
          color: #34dcfc;
          font-size: 30px;
          height: 105px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: nowrap;
          flex-direction: row;
          align-content: flex-start;
        }
      }

      .loginBut {
        width: 515px;
        height: 56px;
        font-size: 32px;
        font-weight: 400;
        color: #ffffff;
        background: #20a3f5;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        flex-direction: row;
        align-content: flex-start;
        cursor: pointer;
        letter-spacing: 30px;
        text-indent: 30px;
      }
    }
  }
}

.rememberpwd {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  width: 381px;
}

.loginImg {
  width: 900px;
  height: 810px;
  background-size: 100% 100%;
  position: absolute;
  left: 0%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
}

.loginTitle {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;

  p {
    font-size: 49px;
    font-weight: 900;
    color: #00bff4;
    margin-bottom: 70px;
    font-family: 'PangMenZhengDao';
    background: linear-gradient(90deg, #009ff1 0%, #00e8cf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.forget {
  font-size: 18px;
  font-family: PingFang;
  font-weight: 400;
  color: #fff;
}

.close {
  height: 17px;
  width: 17px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  position: absolute;
  right: 15px;

  img {
    width: 17px;
  }
}

.forgetBody {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  height: 80px;
}

.loginBody .client-logo {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  pointer-events: none;
  text-align: center;
  padding: 10px 20px;
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

.loginBody .logo-content {
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

.loginBody .version-info {
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
</style>
