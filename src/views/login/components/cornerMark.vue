/** * @Author: 858834013@qq.com * @Name: cornerMark * @Date: 2023年04月14日 *
@Desc: 角标动画效果 */
<template>
  <div class="cornerMark">
    <img
      ref="icon_leftTop"
      class="icon_leftTop"
      src="../assets/icon_leftTop.png"
      alt=""
    />
    <img
      ref="icon_rightTop"
      class="icon_rightTop"
      src="../assets/icon_rightTop.png"
      alt=""
    />
    <img
      ref="icon_leftBottom"
      class="icon_leftBottom"
      src="../assets/icon_leftBottom.png"
      alt=""
    />
    <img
      ref="icon_rightBottom"
      class="icon_rightBottom"
      src="../assets/icon_rightBottom.png"
      alt=""
    />
  </div>
</template>

<script>
import gsap from 'gsap'

export default {
  name: 'cornerMark',
  components: {},
  props: {},
  data() {
    return {
      delay: 1.5,
      duration: 1
    }
  },
  watch: {},
  mounted() {
    gsap.fromTo(
      this.$refs.icon_leftTop,
      {
        top: -20,
        left: -20
      },
      {
        duration: this.duration,
        delay: this.delay,
        top: -1,
        left: -1,
        opacity: 1
      }
    )
    gsap.fromTo(
      this.$refs.icon_rightTop,
      {
        top: -20,
        right: -20
      },
      {
        duration: this.duration,
        delay: this.delay,
        top: -1,
        right: -1,
        opacity: 1
      }
    )
    gsap.fromTo(
      this.$refs.icon_rightBottom,
      {
        bottom: -20,
        right: -20
      },
      {
        duration: this.duration,
        delay: this.delay,
        bottom: -1,
        right: -1,
        opacity: 1
      }
    )
    gsap.fromTo(
      this.$refs.icon_leftBottom,
      {
        bottom: -20,
        left: -20
      },
      {
        duration: this.duration,
        delay: this.delay,
        bottom: -1,
        left: -1,
        opacity: 1
      }
    )
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.cornerMark {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  .icon_leftTop {
    position: absolute;
    opacity: 0;
    top: -20px;
    left: -20px;
  }

  .icon_rightTop {
    position: absolute;
    opacity: 0;
    top: -20px;
    right: -20px;
  }

  .icon_leftBottom {
    position: absolute;
    opacity: 0;
    bottom: -20px;
    left: -20px;
  }

  .icon_rightBottom {
    position: absolute;
    opacity: 0;
    bottom: -20px;
    right: -20px;
  }
}
</style>
