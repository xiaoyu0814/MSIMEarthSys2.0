<template>
  <div class="lineAnimation">
    <div class="lineAnimationInner" ref="lineAnimationInner"></div>
  </div>
</template>

<script>
import gsap from 'gsap'

export default {
  name: 'lineAnimation',
  props: {
    delay: {
      type: Number,
      default() {
        return 2
      }
    }
  },
  mounted() {
    gsap.to(this.$refs.lineAnimationInner, {
      duration: 2,
      delay: this.delay,
      width: 100 + '%',
      onComplete: () => {
        console.log('动画完成')
      }
    })
  }
}
</script>

<style lang="less" scoped>
.lineAnimation {
  width: 120px;
  height: 1px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;

  .lineAnimationInner {
    width: 0;
    height: 1px;
    background: rgba(54, 167, 237, 1);
  }
}
</style>
