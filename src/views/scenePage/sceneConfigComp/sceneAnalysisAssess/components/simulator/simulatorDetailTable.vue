<template>
  <div class="detail-table">
    <el-form>
      <el-form-item label="事件名称">
        <el-select v-model="eventName" clearable placeholder="请选择事件名称">
          <el-option
            v-for="(item, index) in eventNameDataList"
            :key="index"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAirDataByPageFun">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      show-overflow-tooltip
      style="width: 100%; background: #061d476e; height: 400px"
      v-loading="tableLoading"
    >
      <el-table-column
        label="序号"
        prop="xh"
        width="55"
        align="center"
        fit
      ></el-table-column>
      <!-- <el-table-column prop="name" label="名称" align="center" fit>
      </el-table-column> -->
      <!-- <el-table-column prop="work" label="事件名称" width="110" align="center" fit /> -->
      <el-table-column
        prop="longitude"
        label="经度"
        width="110"
        align="center"
        fit
      />
      <el-table-column
        prop="lati"
        label="纬度"
        width="110"
        align="center"
        fit
      />
      <el-table-column
        prop="height"
        label="高度"
        width="90"
        align="center"
        fit
      />
      <el-table-column
        prop="psi"
        label="航向角"
        width="90"
        align="center"
        fit
      />
      <el-table-column
        prop="theta"
        label="俯仰角"
        width="110"
        align="center"
        fit
      />
      <el-table-column
        prop="gama"
        label="滚动角"
        width="110"
        align="center"
        fit
      />
      <el-table-column
        prop="alpha"
        label="迎角"
        width="90"
        align="center"
        fit
      />
      <el-table-column
        prop="beta"
        label="侧滑角"
        width="80"
        align="center"
        fit
      />
      <el-table-column
        prop="createTime"
        label="时间"
        width="160"
        align="center"
        fit
      />
      <el-table-column prop="vel" label="真速" align="center" fit />
    </el-table>
    <div class="pagination-style">
      <el-pagination
        small
        background
        layout=" sizes, prev, pager, next,"
        :total="total"
        class="mt-4"
        :pager-count="8"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[5, 10, 15]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  getChainStatus,
  getAirDataByPage,
  getAirDataByPageByTimeZone
} from '@/service/simulatorServer.js'
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
      eventNameDataList: [],
      eventName: '',
      total: 10,
      pageSize: 10,
      currentPage: 1,
      tableLoading: true
    })

    onMounted(() => {
      nextTick(() => {
        getChainStatusFun()
        getAirDataByPageFun()
      })
    })

    onUnmounted(() => {})

    //表格数据查询
    const getAirDataByPageFun = () => {
      vueData.tableLoading = true
      let startTime = store.state.sceneModule.startSceneTime
      let endTime = store.state.sceneModule.endSeeStaticTime
      let param = {
        mnq: props.simulatorId,
        messageId: store.state.curSceneInfo.id, //场景Id
        chainStatus: vueData.eventName, //事件
        pageNum: vueData.currentPage,
        pageSize: vueData.pageSize,
        startSceneTime: startTime,
        endSceneTime: endTime
      }
      // let param = {
      //   mnq: props.simulatorId,
      //   messageId: store.state.curSceneInfo.id,//场景Id
      //   chainStatus: vueData.eventName,//事件
      //   pageNum: vueData.currentPage,
      //   pageSize: vueData.pageSize
      // }
      // getAirDataByPage(param).then((res) => {
      getAirDataByPageByTimeZone(param).then((res) => {
        if (res.code != 200) {
          ElMessage.warning('获取数据失败，请稍后再试！')
          vueData.tableLoading = false
          return
        }
        if (res.data) {
          vueData.total = res.data.total
          if (res.data.records && res.data.records.length > 0) {
            for (let i = 0; i < res.data.records.length; i++) {
              let recordsItem = res.data.records[i]
              recordsItem['xh'] =
                vueData.currentPage * vueData.pageSize -
                vueData.pageSize +
                (i + 1)
            }
            vueData.tableData = res.data.records
          } else {
            vueData.tableData = []
          }
          vueData.tableLoading = false
        }
      })
    }

    const getChainStatusFun = () => {
      getChainStatus().then((res) => {
        if (res.code != 200) {
          ElMessage.warning('获取数据失败，请稍后再试！')
          return
        }
        if (res.data) {
          vueData.eventNameDataList = res.data
        }
      })
    }

    const handleSizeChange = (val) => {
      vueData.pageSize = val
      vueData.currentPage = 1
      getAirDataByPageFun()
    }

    const handleCurrentChange = (val) => {
      vueData.currentPage = val
      getAirDataByPageFun()
    }
    return {
      ...toRefs(vueData),
      getAirDataByPageFun,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style lang="less" scoped>
:deep(.el-pagination.is-background .btn-prev:disabled) {
  background-color: #021a46;
  color: #fff;
}

:deep(.el-pagination.is-background .btn-prev:disabled) {
  background-color: #021a46;
  color: #fff;
}

:deep(.el-pagination.is-background .el-pager li) {
  background-color: #021a46;
  color: #fff;
  border: 1px solid #fff;
}

:deep(.el-pagination.is-background .btn-next) {
  background-color: #021a46;
  color: #fff;
}

:deep(.el-pagination.is-background .btn-prev) {
  background-color: #021a46;
  color: #fff;
}

:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-image: linear-gradient(0deg, #021a46 0%, #021a46 100%);
}

:deep(
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li
  ) {
  background: #021a46 !important;
}

.pagination-style {
  margin: 20px 0;
  position: absolute;
  right: 10px;
}

:deep(.el-dialog__body) {
  padding-top: 0 !important;
}

:deep(.el-loading-mask) {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
