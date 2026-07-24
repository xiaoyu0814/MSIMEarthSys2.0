<template>
  <div
    :class="{ expanded: isExpanded }"
    class="bianzudaotiao-container animate__animated animate__fadeInRightBig animate__delay-0.3s"
  >
    <!-- 引入顶部工具栏子组件 -->
    <DaotiaoHeader
      @refresh="handleRefresh"
      @config="handleConfig"
      @commandChange="handleCommandChange"
      @selectAll="handleSelectAll"
      @deselectAll="handleDeselectAll"
      @close="handleClose"
    />

    <!-- 引入主体内容子组件 -->
    <DaotiaoMainContent ref="mainContentRef" :currentCommand="currentCommand" />

    <!-- 引入底部图例子组件 -->
    <DaotiaoFooter
      @save="handleSave"
      @reset="handleReset"
      @import="handleImport"
      @export="handleExport"
      @history="handleHistory"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import emitter from '@/utils/eventbus'

const isExpanded = ref(false)

// 引入顶部工具栏子组件
import DaotiaoHeader from './child/daotiaoHeader/index.vue'
// 引入主体内容子组件
import DaotiaoMainContent from './child/daotiaoMainContent/index.vue'
// 引入底部图例子组件
import DaotiaoFooter from './child/daotiaoFooter/index.vue'

import { issueBatchCommand } from '@/service/bldtServer/index'
// 主内容组件引用
const mainContentRef = ref(null)

// 当前指令
const currentCommand = ref('attack')

// 组件状态
const state = reactive({
  isLoading: false,
  data: []
})

// 生命周期钩子
onMounted(() => {
  console.log('编制导调父组件已挂载')
  // 可以在这里加载初始数据
  emitter.on('sendIsExpanded', (value) => {
    isExpanded.value = value
  })
})

// 处理刷新事件
const handleRefresh = () => {
  console.log('父组件处理刷新事件')
  if (mainContentRef.value) {
    mainContentRef.value.handleRefresh()
  }
}

// 处理配置事件
const handleConfig = () => {
  console.log('父组件处理配置事件')
  if (mainContentRef.value) {
    mainContentRef.value.handleConfig()
  }
}

// 处理指令变更事件
const handleCommandChange = (command) => {
  console.log('父组件处理指令变更事件:', command)
  currentCommand.value = command
  // 刷新主内容数据
  if (mainContentRef.value) {
    mainContentRef.value.handleRefresh()
  }
}

// 处理全选事件
const handleSelectAll = (command) => {
  console.log('父组件处理全选事件，指令:', command)
  if (mainContentRef.value) {
    mainContentRef.value.handleSelectAll(command)
  }
}

// 处理全不选事件
const handleDeselectAll = () => {
  console.log('父组件处理全不选事件')
  if (mainContentRef.value) {
    mainContentRef.value.handleDeselectAll()
  }
}

// 保存配置
const handleSave = () => {
  if (mainContentRef.value) {
    // 获取当前配置数据
    const configData = mainContentRef.value.state.filteredData
    let params = []
    let saveAnimation = []
    for (let i = 0; i < configData.length; i++) {
      for (let j = 0; j < configData[i].redForces.length; j++) {
        if (configData[i].redForces[j].commandConfigured) {
          let attackInfo = configData[i].redForces[j].attackInfo
          for (let t = 0; t < attackInfo.length; t++) {
            let object = {
              // commandType: 'AttackTarget',
              commandType: configData[i].redForces[j].command,
              executorPlat: attackInfo[t].redUnit.name,
              messageSender: 'AirBorneBrigade123_GJ-2_2',
              targetPlat: attackInfo[t].attackableTargets[0].name,
              time: configData[i].redForces[j].commandTime
            }
            let obj = {
              name: attackInfo[t].attackableTargets[0].nameCn,
              targetName: attackInfo[t].redUnit.nameCn,
              type: configData[i].redForces[j].command,
              elementId: `red-force-${i}-${j}-${t}`
            }
            params.push(object)
            saveAnimation.push(obj)
          }
        }
      }
    }
    issueBatchCommand(params).then((res) => {
      if (res.code == 200) {
        mainContentRef.value.handleSaveAnimation(saveAnimation)
      } else {
        ElMessage.error(res.message || '执行失败！')
      }
      // emitter.emit('showBLEventList', false)
    })
  }
}

// 保存历史记录
const handleHistory = () => {
  if (mainContentRef.value) {
    mainContentRef.value.handleHistorys()
  }
}

// 重置配置
const handleReset = () => {
  console.log('重置配置为初始状态')
  // 刷新数据，恢复初始状态
  if (mainContentRef.value) {
    mainContentRef.value.handleDeselectAll()
  }
}

// 导入配置
const handleImport = () => {
  console.log('导入配置')
  // 创建文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'

  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          console.log('导入的数据:', importedData)

          // 更新子组件的过滤数据
          if (mainContentRef.value) {
            // 确保每个红方卡牌的commandConfigured和commandTimeConfigured属性被正确设置
            const processedData = importedData.map((row) => ({
              ...row,
              redForces: row.redForces.map((redForce) => ({
                ...redForce,
                // 根据command是否存在来设置commandConfigured
                commandConfigured:
                  redForce.command !== undefined && redForce.command !== null,
                // 确保commandTime和commandTimeConfigured属性存在
                commandTime: redForce.commandTime || null,
                // 根据commandTime是否存在来设置commandTimeConfigured
                commandTimeConfigured:
                  redForce.commandTime !== undefined &&
                  redForce.commandTime !== null
              }))
            }))

            // 更新子组件的数据
            mainContentRef.value.state.filteredData = processedData
            console.log('数据导入成功，已更新到组件状态')
          }
        } catch (error) {
          console.error('导入数据失败:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  input.click()
}

// 导出配置
const handleExport = () => {
  console.log('导出配置')
  if (mainContentRef.value) {
    // 获取当前配置数据
    const configData = mainContentRef.value.state.filteredData
    // 创建JSON字符串
    const jsonStr = JSON.stringify(configData, null, 2)
    // 创建Blob对象
    const blob = new Blob([jsonStr], { type: 'application/json' })
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daotiao-config-${new Date().getTime()}.json`
    a.click()
    // 释放URL对象
    URL.revokeObjectURL(url)
  }
}

// 示例方法
const handleDataChange = (newData) => {
  state.data = newData
  console.log('数据已更新:', newData)
}

// 处理关闭事件
const handleClose = () => {
  console.log('父组件处理关闭事件')
  // 这里可以添加关闭组件的逻辑，例如：
  // 1. 关闭弹窗或模态框（如果该组件是通过弹窗展示）
  // 2. 导航到其他页面
  // 3. 发送关闭事件给上层组件
  console.log('编制导调组件已关闭')
}
</script>

<style lang="less" scoped>
.bianzudaotiao-container {
  width: 1400px;
  /* 宽度大于高度，横版设计 */
  height: 500px;
  background-size: 100% 100%;
  z-index: 999;
  padding: 0 10px;
  box-sizing: border-box;
  position: absolute;
  top: 13%;
  // right: 3px;
  right: 1%;
  // background: rgba(2, 26, 70, 0.78);
  // box-shadow: 0 0 25px #1092d58a;
  border-radius: 8px;
  transition: height 0.3s ease;
  display: flex;
  flex-direction: column;
  // 修改主背景色，使其与头部和底部有更明显区别
  // background: linear-gradient(135deg, #000510 0%, #001030 50%, #000510 100%);
  // 移除默认的margin和padding，确保与导航栏无缝衔接
  margin: 0;
  padding: 0;
}
&.expanded {
  width: 1880px;
  height: 800px;
  top: 7%;
}
</style>
