<template>
  <div class="panel_comp">
    <div class="wrap">
      <!-- <div class="angle"></div> -->
      <div class="header" v-if="showHeader" ref="header">
        <slot name="header"></slot>
      </div>
      <div class="main">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      default: '64%'
    },
    showHeader: {
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
.panel_comp {
  position: absolute;
  min-height: 50px;
  padding: 0 8px;

  .wrap {
    height: 100%;
    width: 65%;
    left: 17.5%;
    // background: rgba(0, 0, 0, 0.4);
    color: #fff;
    // border: 1px solid #3093d5;
    border: 1px solid #3093d500;
    box-sizing: border-box;
    position: relative;

    .header {
      padding: 11px 14px;
      font-size: 14px;
      border-bottom: 1px solid #3093d5;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .main {
      position: absolute;
      bottom: 0;
      height: 35px;
      width: 100%;
      top: auto;
      padding: 0;
    }
    @mixin horn {
      content: '';
      position: absolute;
      height: 12px;
      width: 12px;
      border: 3px solid #58d7fa;
      z-index: 2;
    }

    &::before {
      @include horn;
      bottom: -2px;
      left: -2px;
      border-right: none;
      border-top: none;
    }

    &::after {
      @include horn;
      top: -2px;
      right: -2px;
      border-left: none;
      border-bottom: none;
    }

    .angle {
      &::before {
        @include horn;
        top: -2px;
        left: -2px;
        border-right: none;
        border-bottom: none;
      }

      &::after {
        @include horn;
        bottom: -2px;
        right: -2px;
        border-left: none;
        border-top: none;
      }
    }
  }
}
</style>
