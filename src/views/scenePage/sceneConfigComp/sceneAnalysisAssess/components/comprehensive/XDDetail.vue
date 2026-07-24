<!-- 想定详情弹框 -->
<template>
  <el-scrollbar max-height="390px">
    <div class="conclusion-plan">
      <!-- <div class="content-all">
        <span class="background-title">想定图片</span>
        <img :src="vueData.picUrl" />
      </div> -->
      <template v-for="(item, idx) in vueData.formDetailData">
        <div class="content-all" v-if="item.value != ''" :key="idx">
          <span class="background-title">{{ item.label }}</span>
          <div class="background-content">{{ item.value }}</div>
        </div>
      </template>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import emitter from '@/utils/eventbus'

const vueData = reactive({
  formDetailData: [],
  picUrl: ''
})

watch(
  () => store.getters.getTaskInfoTaskIdData,
  (newVal) => {
    vueData.picUrl = newVal.picUrl
    vueData.formDetailData = [
      {
        label: '想定名称',
        value: newVal.name
      },
      {
        label: '想定开始时间',
        value: newVal.startTime
      },
      {
        label: '想定结束时间',
        value: newVal.endTime
      },
      // {
      //   label: '场景毁伤评估统计时间点',
      //   value: newVal.damageTotalTimePort
      // },
      {
        label: '想定背景内容',
        value: newVal.thinkGround
      },
      {
        label: '想定描述',
        value: newVal.scenarioDescribe
      },
      {
        label: '想定详情',
        value: newVal.scenarioDetail
      },
      {
        label: '想定任务信息',
        value: newVal.taskInfo
      },
      {
        label: '想定文件内容',
        value: newVal.bJsonScenarioData
      },
      {
        label: '任务目的',
        value: newVal.taskPurpose
      },

      {
        label: '想定战场环境影响条件',
        value: newVal.scenarioWarEnvironment
      },

      {
        label: '想定情报要素',
        value: newVal.intelligenceParam
      },

      {
        label: '是否共有',
        value: (newVal.fileShared = 0 ? '公有' : '私有')
      }
    ]
  },
  { deep: true, immediate: true }
)

onMounted(() => {})
// const closeImg = () => {
//   emitter.emit('isShowDetails', false)
// }
/*
点击高亮文本进行后续操作
*/
// window.clickhighligtStr = function (_var) {
//   switch (_var) {
//     case '云区':
//       {
//         state.viewer.camera.flyTo({
//           destination: new state.earth.Cartesian3(
//             -3458813.895454278,
//             5781550.034114407,
//             2929028.2304659183
//           ),
//           orientation: {
//             heading: 6.164207376288082, //偏航角
//             pitch: -1.5424107973690484, //-0.08401170275668313, //水平俯仰角
//             roll: 0
//           },
//           duration: 4
//         })
//       }
//       break
//     default:
//       break
//   }
// }
/*
关键字高亮显示
*/
// const highLightDisplay = (searchstr, contentStr) => {
//   if (searchstr && contentStr) {
//     var serachkey = searchstr.split('|')
//     serachkey.forEach((element) => {
//       // 如果文本中包含关键字就替换
//       if (contentStr.includes(element)) {
//         contentStr = contentStr.replace(
//           element,
//           //替换高亮显示样式
//           `<span onclick="clickhighligtStr('${element}')" style="color:yellow;font-weight: bold; cursor: pointer">${element}</span>`
//         )
//       }
//     })
//     return contentStr
//   }
//   return contentStr
// }
</script>

<style lang="less" scoped>
.conclusion-plan {
  z-index: 999;
  width: 100%;
  color: #eee;
  border: 1px solid rgba(117, 252, 255, 0.8);
  border-radius: 4px;
  backdrop-filter: blur(1px);
  background: url('@/assets/image/panelIcons/背景.png') no-repeat;
  background-size: 100% 100%;
  // .content-title {
  //   background: url('@/assets/image/panelIcons/title-bg3.png') no-repeat;
  //   background-size: 100.1% 48px;
  //   height: 40px;
  //   line-height: 48px;
  //   font-size: 25px;
  //   color: #ffffff;
  //   letter-spacing: 2.4px;
  //   font-weight: 400;
  //   text-align: left;
  //   padding-left: 90px;
  // }
  .close_sty {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 20px;
    width: 20px;
    height: 20px;
  }

  .background-title {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
    padding-left: 46px;
    height: 35px;
    position: relative;
    display: flex;
    align-items: center;

    &::after {
      content: '';
      position: absolute;
      height: 2px;
      width: 40%;
      background-image: linear-gradient(45deg, #48edff, transparent);
      bottom: 0px;
      left: 19px;
    }

    &::before {
      content: '';
      position: absolute;
      height: 16px;
      width: 16px;
      top: 8;
      left: 20px;
      background: url('@/assets/image/panelIcons/title-bg3.png') no-repeat;
      background-size: 100.1% 48px;
    }
  }

  .background-content {
    width: calc(97% - 40px);
    padding: 10px;
    margin: 10px auto;
    background: rgba(0, 231, 255, 0.1);
    border: 1px solid rgba(0, 231, 255, 0.4);
    text-align: left;
    font-size: 20px;
    letter-spacing: 3px;
    text-indent: 2em;
    /*滚动条高宽度*/
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    /*滚动条滑块*/
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(48, 50, 53, 0.7);
    }

    /*滚动条里面轨道*/
    &::-webkit-scrollbar-track {
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
    }

    /*滚动条的小边角*/
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
}

:deep(.el-form-item__label) {
  color: white;
  font-size: 30px;
  padding: 10px;
}
.el-dialog__header,
.custom-dialog-background {
  background: rgba(2, 26, 70, 0.88) !important;
}
</style>
