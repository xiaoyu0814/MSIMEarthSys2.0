<template>
  <div class="dialDetailSettingDiv">
    <!-- 左上角标题 -->
    <div class="title">日志入口</div>

    <!-- 右上角隐藏按钮 -->
    <div class="close-btn" @click="hidePanel">
      <el-icon :size="20" color="#fff">
        <Close />
      </el-icon>
    </div>

    <div class="menu-container">
      <div
        v-for="(item, index) in vueData.menuList"
        :key="index"
        class="menu-item"
      >
        <router-link :to="item.route" target="_blank" class="menu-link">
          <el-icon class="menu-icon">
            <component :is="item.icon" />
          </el-icon>
          <span class="menu-text">{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Close, Document, DataAnalysis } from '@element-plus/icons-vue'
const router = useRouter()

let vueData = reactive({
  menuList: [
    {
      label: '多链路统计',
      route: '/multiLink',
      icon: DataAnalysis
    },
    {
      label: '仿真日志',
      route: '/sselogo',
      icon: Document
    }
  ]
})

const goRoute = (item, index) => {
  if (item.route) {
    router.push(item.route)
  } else {
    window.open(item.url)
  }
}
const emit = defineEmits(['showDialDetailSetting'])

// 隐藏面板方法
const hidePanel = () => {
  // 传递一个标识，表明是从logoPageSelect组件触发的关闭事件
  emit('showDialDetailSetting', false, { type: 'logoPage' })
}

onMounted(() => {})
</script>

<style lang="less" scoped>
.dialDetailSettingDiv {
  position: absolute;
  right: 24%;
  top: 10%;
  margin-top: 0px;
  height: 200px;
  width: 180px;
  z-index: 998;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 15px 20px;
  background: linear-gradient(
    135deg,
    rgba(2, 26, 70, 0.95) 0%,
    rgba(0, 199, 251, 0.1) 100%
  );
  box-shadow: 0 0 30px rgba(16, 146, 213, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 199, 251, 0.3);

  // 标题样式
  .title {
    position: absolute;
    top: 10px;
    left: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #00c7fb;
    z-index: 999;
    text-shadow: 0 0 10px rgba(0, 199, 251, 0.5);
    font-family: 'Arial', sans-serif;
    letter-spacing: 1px;
  }

  // 关闭按钮样式
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    z-index: 999;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(0, 199, 251, 0.2);
      box-shadow: 0 0 15px rgba(0, 199, 251, 0.5);
      // transform: rotate(90deg);
    }
  }

  // 菜单容器
  .menu-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 15px;
  }

  // 菜单项
  .menu-item {
    width: 100%;
  }

  /* 菜单链接样式 */
  .menu-link {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #409efc;
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 8px 12px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(64, 158, 252, 0.2);
    font-family: 'Arial', sans-serif;
    letter-spacing: 0.5px;
    width: 100%;
    box-sizing: border-box;

    &:hover {
      color: #00c7fb;
      background: rgba(0, 199, 251, 0.15);
      border-color: rgba(0, 199, 251, 0.6);
      box-shadow: 0 0 20px rgba(0, 199, 251, 0.4),
        inset 0 0 10px rgba(0, 199, 251, 0.1);
      // transform: translateX(5px);
    }

    &:active {
      color: #3a8ee6;
      background: rgba(0, 199, 251, 0.25);
      transform: translateX(3px);
    }
  }

  // 菜单图标样式
  .menu-icon {
    color: #00c7fb;
    font-size: 18px;
    transition: all 0.3s ease;
    text-shadow: 0 0 10px rgba(0, 199, 251, 0.8);

    .menu-link:hover & {
      // transform: scale(1.2);
      text-shadow: 0 0 15px rgba(0, 199, 251, 1);
    }
  }

  // 菜单文本样式
  .menu-text {
    flex: 1;
    font-weight: 500;
  }
}
</style>
