<!--
 * @description:
 * @Version: 1.0
 * @Author: Li
 * @Date: 2024-11-20 13:29:05
 * @LastEditors: 杜千存 duqiancun@piesat.cn
 * @LastEditTime: 2024-12-09 10:20:34
-->
<template>
  <div id="seatConfig">
    <div class="editDocFrom">
      <el-form :model="vueData.instructInfo" style="max-width: 600px">
        <el-form-item label="变量选择：" style="margin: 0 10px 0 0">
          <div class="FromHeader">
            <el-checkbox
              v-for="(item, index) in vueData.DataTypeList"
              :key="index"
              v-model="item.checked"
              :label="item.label"
              size="large"
              @change="selectchecked(item)"
            />
          </div>
          <div style="display: flex; justify-content: end; width: 100%">
            <el-button type="primary" @click="_reportTaskAdd"> 确认 </el-button>
            <el-button @click="reset"> 取消 </el-button>
            <el-button
              type="primary"
              v-show="vueData.showPreview"
              @click="Preview"
            >
              预览
            </el-button>
          </div>
        </el-form-item>
        <div
          style="max-height: 400px; overflow: auto"
          v-show="vueData.showPreview"
        >
          <el-form-item label="实验变量设计"> </el-form-item>
          <div v-for="(item, index) in vueData.formDataList" :key="index">
            <el-form-item
              :label="item.name + '：'"
              class="FromObj"
              v-show="item.type == 1 && item.show"
            >
              <!-- <el-input v-model="vueData.instructInfo.region" /> -->
              <div class="slider-demo-block">
                <el-slider
                  v-model="vueData.instructInfo[item.value]"
                  :marks="marks"
                  range
                  show-stops
                  :max="100"
                />
              </div>
            </el-form-item>
            <el-form-item
              :label="item.name + '：'"
              class="FromObj"
              v-show="item.type == 2 && item.show"
            >
              <div style="display: flex">
                <div style="margin-right: 10px">
                  <el-time-select
                    v-model="vueData.instructInfo[item.value]"
                    style="width: 140px"
                    start="08:30"
                    step="00:15"
                    end="18:30"
                    placeholder="开始时间"
                  />
                </div>
                <div>
                  <el-time-select
                    v-model="vueData.instructInfo[item.value02]"
                    style="width: 140px"
                    start="08:30"
                    step="00:15"
                    end="18:30"
                    placeholder="结束时间"
                  />
                </div>
              </div>
            </el-form-item>
            <el-form-item
              :label="item.name + '：'"
              class="FromObj"
              v-show="item.type == 3 && item.show"
            >
              <el-input
                style="width: 290px"
                v-model="vueData.instructInfo[item.value]"
                :placeholder="item.placeholder"
              />
            </el-form-item>
            <el-form-item
              :label="item.name + '：'"
              class="FromObj"
              v-show="item.type == 4 && item.show"
            >
              <div style="display: flex; color: #fff; margin-bottom: 10px">
                <span style="width: 180px; text-align: justify"
                  >热力持续时间</span
                >
                <el-input
                  v-model="
                    vueData.instructInfo.updateFrequencyOfHeatMap[item.value01]
                  "
                  :placeholder="item.placeholder01"
                />
              </div>
              <div style="display: flex; color: #fff; margin-bottom: 10px">
                <span style="width: 180px; text-align: justify">更新间隔</span>
                <el-input
                  v-model="
                    vueData.instructInfo.updateFrequencyOfHeatMap[item.value02]
                  "
                  :placeholder="item.placeholder02"
                />
              </div>
              <div style="display: flex; color: #fff; margin-bottom: 10px">
                <span style="width: 180px; text-align: justify"
                  >侦察需求满足情况</span
                >
                <el-input
                  v-model="
                    vueData.instructInfo.updateFrequencyOfHeatMap[item.value03]
                  "
                  :placeholder="item.placeholder03"
                />
              </div>
            </el-form-item>
            <el-form-item
              :label="item.name + '：'"
              class="FromObj"
              v-show="item.type == 5 && item.show"
            >
              <div>
                <el-radio-group v-model="vueData.instructInfo[item.value]">
                  <el-radio :value="1">1（全部星上规划）</el-radio>
                  <el-radio :value="0">0（全部地面规划）</el-radio>
                  <el-radio :value="0.5"
                    >0.5（地面规划与星上规划各一半）</el-radio
                  >
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item
              :label="item.name + '：'"
              class="FromObj"
              v-show="item.type == 6 && item.show"
            >
              <div style="display: flex; color: #fff; margin-bottom: 10px">
                <span style="width: 180px; text-align: justify">测控频次</span>
                <el-input
                  v-model="vueData.instructInfo.ckWindowsList[item.value]"
                  :placeholder="item.placeholder01"
                />
              </div>
              <div style="display: flex; color: #fff; margin-bottom: 10px">
                <span style="width: 180px; text-align: justify">数传频次</span>
                <el-input
                  v-model="vueData.instructInfo.ckWindowsList[item.value02]"
                  :placeholder="item.placeholder02"
                />
              </div>
            </el-form-item>
          </div>
          <el-form-item label="因子水平设计方法:" class="FromObj">
            <el-select
              v-model="vueData.instructInfo.selectvalue"
              placeholder="请选择实验因子水平设计方法"
              style="width: 140px"
            >
              <el-option
                v-for="item in vueData.optionsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <!-- 编辑窗口 -->
      <ul class="editDoc_box" v-if="vueData.editDoc_box">
        <li class="header">
          <span>ZZ实验变量设计预览</span>
          <el-icon><Close @click="vueData.editDoc_box = false" /></el-icon>
        </li>
        <li>
          <div class="carouselBox">
            <el-table
              :data="vueData.tableData"
              style="width: 100%"
              height="360"
              border
            >
              <el-table-column
                type="index"
                width="55"
                label="序号"
                align="center"
              />
              <el-table-column prop="name" label="变量名称" align="center" />
              <el-table-column
                prop="value"
                label="变量边界设置"
                align="center"
              />
            </el-table>
            <selfPage
              class="page_box"
              :currentPage="vueData.pageNum"
              :pageSize="vueData.pageSize"
              :total="vueData.total"
              @handleSizeChange="changePageSize"
              @handleCurrentChange="changePageNum"
            ></selfPage>
          </div>
        </li>
        <!-- <li class="footer">
          <el-button @click="vueData.editDoc_box = false">取消</el-button>
           <el-button type="primary" @click="editDocClick">确定</el-button>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { Plus, Search, Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElScrollbar } from 'element-plus'
import selfPage from '@/components/page.vue'
import emitter from '@/utils/eventbus'
import {
  getSeatList,
  getUseSeatScheme,
  getRoleSeatList,
  getUserList,
  updateSeat,
  getSimulatorList,
  getCampList,
  deleteSeat
} from '@/service/missionPreparation/seatManagement'

import { getMissionByid } from '@/service/contingencyEditing/contingencyEditing'
import { setSimulatorBL } from '@/service/taskManagement'

const emit = defineEmits(['selectSeatId'])

const vueData = reactive({
  instructInfo: {
    updateFrequencyOfHeatMap: {},
    ckWindowsList: {}
  },
  DataTypeList: [
    {
      checked: false,
      label: '气象情况'
    },
    {
      checked: false,
      label: '白昼情况'
    },
    {
      checked: false,
      label: '电磁情况'
    },
    {
      checked: false,
      label: '干扰情况'
    },
    {
      checked: false,
      label: '伪装情况'
    },
    {
      checked: false,
      label: '数传带宽'
    },
    {
      checked: false,
      label: '网格尺寸'
    },
    {
      checked: false,
      label: '卫星受损情况'
    },
    {
      checked: false,
      label: '地面站受损情况'
    },
    {
      checked: false,
      label: '热力图更新策略'
    },
    {
      checked: false,
      label: '测控数传频次'
    },
    {
      checked: false,
      label: '地面站网资源预分配比例'
    }
  ],
  optionsList: [
    {
      label: '均匀分布',
      value: '均匀分布'
    },
    {
      label: '二项分布',
      value: '均匀分布'
    },
    {
      label: '指数分布',
      value: '指数分布'
    },
    {
      label: '正数分布',
      value: '正数分布'
    },
    {
      label: '泊松分布',
      value: '泊松分布'
    }
  ],
  editDoc_box: false,
  tableData: [
    {
      name: '气象情况',
      value: '云量：10%-60%'
    }
  ],
  formDataList: [
    {
      name: '气象情况',
      value: 'weather',
      show: false,
      type: 1
    },
    {
      name: '电磁情况',
      value: 'situation',
      show: false,
      type: 1
    },
    {
      name: '干扰情况',
      value: 'Interference',
      show: false,
      type: 1
    },
    {
      name: '伪装情况',
      value: 'Disguise',
      show: false,
      type: 1
    },
    {
      name: '卫星受损情况',
      value: 'satelliteDamage',
      show: false,
      type: 1
    },
    {
      name: '地面站受损情况',
      value: 'groundStationDamage',
      show: false,
      type: 1
    },
    {
      name: '白昼情况',
      value: 'Daytime',
      value02: 'Daytime02',
      show: false,
      type: 2
    },
    {
      name: '网格尺寸',
      value: 'meshSize',
      show: false,
      placeholder:
        "请输入网格尺寸，不同尺寸数值用'，'隔开，如：1.2公里，8.5公里",
      type: 3
    },
    {
      name: '数传带宽',
      value: 'transmissionBandwidth',
      show: false,
      placeholder: '请输入数传贷款',
      type: 3
    },
    {
      name: '热力图更新策略',
      value01: 'ThermalDuration',
      value02: 'updateInterval',
      value03: 'Satisfaction',
      placeholder01: '请输入热力持续时间',
      placeholder02: '请输入更新间隔',
      placeholder03: '请输入侦察需求满足情况',
      show: false,
      type: 4
    },
    {
      name: '地面站网资源预分配比例',
      value: 'allocation',
      show: false,
      type: 5
    },
    {
      name: '测控数传频次',
      value: 'controlFrequency',
      value02: 'DataTransmissionFrequency',
      placeholder01: '请输入测控频次',
      placeholder02: '请输入数传频次',
      show: false,
      type: 6
    }
  ],
  pageNum: 1,
  pageSize: 13,
  total: 10,
  showPreview: false
})

const marks = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  60: '60',
  70: '70',
  80: '80',
  90: '90'
}
const store = useStore()

onMounted(() => {})
const allFalse = computed(() => {
  return vueData.formDataList.every((item) => item.show != true)
})

const Preview = () => {
  vueData.editDoc_box = true
}
const selectchecked = (val) => {
  vueData.formDataList.forEach((items) => {
    if (items.name == val.label) {
      items.show = val.checked
    }
  })
  console.log(allFalse)
}
const reset = () => {
  vueData.instructInfo.DataTypeList.forEach((item) => {
    item.checked = false
  })
  vueData.formDataList.forEach((item) => {
    item.show = false
  })
  vueData.showPreview = false
}
const _reportTaskAdd = () => {
  for (let i = 0; i < vueData.formDataList.length; i++) {
    if (vueData.formDataList[i].show == true) {
      vueData.showPreview = true
      break
    } else {
      vueData.showPreview = false
    }
  }
}

defineExpose({
  vueData
})
</script>

<style lang="less" scoped>
#seatConfig {
  height: 100%;
  box-sizing: border-box;
  padding: 10px;

  .editDoc_box {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 1000px;
    height: 480px;
    margin-top: -255px;
    margin-left: -500px;
    background-color: rgba(8, 36, 62, 0.7);
    z-index: 10;
    .carouselBox {
      margin: 0 auto;
      .carousel {
        width: 100%;
        .el-car-item {
          width: 100%;
          display: flex;
          padding-left: 15px;
          .divSrc {
            width: 285px;
            height: 295px;
            background: #fff;
            margin-right: 46px;
            .img {
              width: 285px;
              height: 295px;
            }
            .title {
              width: 90%;
              height: 80px;
              line-height: 80px;
              margin: 0 auto;
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              color: #222222;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        /deep/.el-carousel__arrow {
          // background: red !important;
          display: block !important;
        }
      }
      .el-car-item {
        width: 100%;
        display: flex;

        .img {
          width: 285px;
          height: 295px;
          margin-right: 20px;
          cursor: pointer;
          border: 1px solid red;
        }
        .img02 {
          width: 285px;
          height: 295px;
          margin-right: 20px;
          cursor: pointer;
          border: 1px solid blue;
        }
      }
    }
    .headers {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      :deep(.el-input) {
        .el-input__wrapper {
          border-radius: 5px;
          box-shadow: none;
          background-color: #2b4559 !important;
          box-shadow: 0 0 0 1px #075d89 inset !important;
        }
      }
      .el-button {
        background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
        width: 65px;
        height: 30px;
        color: #ffff;
        border-radius: 5px;
        margin-left: 10px;
        cursor: pointer;
      }
      .delBtn {
        box-shadow: inset 0px 0px 15px 5px rgba(224, 18, 8, 0.46),
          inset 0px 0px 25px 3px rgba(224, 18, 8, 0.61);
        border: 1px solid #e03608;
      }
    }
    li {
      padding: 0 10px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #2e4b64;
      color: #fff;
    }
    .footer {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px;
    }
  }

  .editDocFrom {
    width: 100%;
    height: 100%;
    // padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 15px;
    :deep(.el-form-item__label) {
      color: #fff;
    }

    .FromHeader {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      align-items: center;
    }
    .FromObj {
      margin: 20px 10px;

      .slider-demo-block {
        width: calc(100% - 10px);
        display: flex;
        align-items: center;
      }
      .slider-demo-block .el-slider {
        margin-top: 0;
        margin-left: 12px;
      }
    }
  }

  ::v-deep .el-table td.el-table__cell,
  ::v-deep .el-table th.el-table__cell.is-leaf,
  ::v-deep .el-table__body-wrapper {
    background: #2b4559 !important;
    color: #a3a6ad;
  }
  .el-table {
    --el-table-border-color: #075d89;
  }
  ::v-deep .el-checkbox.el-checkbox--large .el-checkbox__label {
    color: #060626;
  }
}
</style>
