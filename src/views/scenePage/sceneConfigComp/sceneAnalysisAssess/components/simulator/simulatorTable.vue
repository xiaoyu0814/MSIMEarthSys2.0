<!--
 * @Author: root you@example.com
 * @Date: 2024-08-13 16:28:08
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-08-25 15:09:21
 * @FilePath: \MSIMEarthSysN\src\views\scenePage\sceneConfigComp\sceneAnalysisAssess\components\simulator\simulatorTable.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-scrollbar max-height="300px">
    <el-table
      :data="tableData"
      show-overflow-tooltip
      style="width: 100%; background: #061d476e"
      :row-class-name="tableRowClassName"
      height="300px"
    >
      <el-table-column
        label="序号"
        width="55"
        type="index"
        align="center"
        fit
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in columnName"
        :prop="item"
        :label="item"
        :key="index"
        align="center"
        fit
      />
    </el-table>
  </el-scrollbar>
</template>

<script>
import {
  getAirDataJson,
  getAirDataJsonByTimeZone
} from '@/service/simulatorServer'
import {
  reactive,
  toRefs,
  ref,
  onMounted,
  onUnmounted,
  nextTick,
  watch
} from 'vue'
import store from '@/store/index'
export default {
  name: 'simulatorTable',
  props: {
    simulatorId: {
      type: String,
      default: '13'
    }
  },
  setup(props, ctx) {
    const vueData = reactive({
      tableData: [], //表格数据
      columnName: []
    })

    onMounted(() => {
      nextTick(() => {
        onSearch(props.simulatorId)
      })
    })

    onUnmounted(() => {})
    //表格数据查询
    const onSearch = (id) => {
      let startTime = store.state.sceneModule.startSceneTime
      let endTime = store.state.sceneModule.endSeeStaticTime
      let params = {
        mnq: id + '', //模拟器Id
        startSceneTime: startTime,
        endSceneTime: endTime
      }
      // let params = {
      //   "messageId": store.state.curSceneInfo.id,//场景Id
      //   "mnq": id + '', //模拟器Id
      //   "replayId": store.state.sceneModule.sceneReplayId//回放id
      // }
      // getAirDataJson(params).then((res) => {
      getAirDataJsonByTimeZone(params).then((res) => {
        if (res.code != 200) {
          ElMessage.warning('获取数据失败，请稍后再试！')
          return
        }
        if (res.data) {
          let dataArr = []
          for (let item in res.data) {
            vueData.columnName.push(item)
          }
          vueData.tableData = [res.data]
        }
      })
    }
    const tableRowClassName = ({ row, rowIndex }) => {
      return rowIndex % 2 == 0 ? 'warning-row' : 'success-row'
    }
    return { tableRowClassName, ...toRefs(vueData) }
  }
}
</script>

<style lang="less" scoped></style>
