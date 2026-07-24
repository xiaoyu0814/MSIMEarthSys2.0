<template>
  <div
    :class="vueData.showPanel ? 'XDPanel' : 'XDPanel-false'"
    v-if="vueData.showXDPanel"
    class="animate__animated animate__backInDown animate__delay-10s"
  >
    <!--头-->
    <div class="xd-title">
      <p class="xdName">想定列表</p>
      <!-- <img
        :class="vueData.showPanel ? 'flexible' : 'flexible_false'"
        src="@/assets/images/rwty/arrows.svg"
        @click="getPanel"
      /> -->
    </div>
    <div class="xd-content" v-if="vueData.showPanel">
      <!--顶部-->
      <div class="top-bar">
        <el-input
          v-model="vueData.input2"
          :class="!vueData.createBtn ? '' : 'bar-left'"
          placeholder="请输入想定名称"
          :suffix-icon="Search"
          style="width: 30%"
          clearable
        />
        <el-button type="primary" :icon="Search" @click="getListByName">
          查询
        </el-button>
        <ul class="bar-right" v-if="vueData.createBtn">
          <li class="right-item" @click="showCreatePanel">
            <img src="@/assets/images/xdbj/tj.svg" />
            <span>新建</span>
          </li>
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            :action="vueData.uploadUrl"
            :show-file-list="false"
            :auto-upload="true"
            :headers="vueData.uploadHeaders"
            :on-success="handleSuccess"
          >
            <template #trigger>
              <li class="right-item">
                <img src="@/assets/images/xdbj/dr.svg" />
                <span>导入</span>
              </li>
            </template>
          </el-upload>
        </ul>
      </div>
      <!--新增面板-->
      <div class="xd-item" v-if="vueData.showCreatePanel">
        <xdOption
          :mObj="createObj"
          @importSubmit="importSubmit"
          @cancelCreateM="cancelCreateM"
          @saveCreateM="saveCreateM"
          :optionType="vueData.optionType"
        ></xdOption>
      </div>
      <!--XD列表-->
      <div class="xd-list">
        <ul
          v-for="(item, index) in vueData.xdJason"
          :key="index"
          @click="getXDItem(item, index)"
          :class="
            index == vueData.selectXd_index ? 'selectStyle xd-item' : 'xd-item'
          "
        >
          <li class="xd-itemName" v-if="vueData.editShow != index">
            <div class="itemName-left">
              <img class="icon" src="@/assets/images/rwty/xdIcon.svg" />
              <span class="name">{{ item.name }}</span>
            </div>

            <div class="itemName-right">
              <!-- <div class="right-box" style="width: 80px">
                <img src="@/assets/images/rwty/yulan.svg" />
                <span @click="sceneSelectChange(item.name)">想定推演</span>
              </div> -->
              <div
                class="right-box"
                v-if="vueData.createBtn"
                @click="showEditXD(item, index)"
              >
                <img src="@/assets/images/rwty/bj.svg" />
                <span>编辑</span>
              </div>
              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="确定导出该想定吗?"
                @confirm="confirmDL(item)"
                @cancel="cancelDL"
              >
                <template #reference>
                  <div
                    class="right-box"
                    v-if="vueData.createBtn"
                    @click="downloadXD_"
                  >
                    <img src="@/assets/images/xdbj/dc.svg" />
                    <span>导出</span>
                  </div>
                </template>
              </el-popconfirm>
            </div>
          </li>
          <li class="xd-itemContent" v-if="vueData.editShow != index">
            <div class="itemContent-left">
              <p style="text-align: left; font-size: 14px">
                描述：{{ item.scenarioDescribe }}
              </p>
              <p style="text-align: left; font-size: 10px">
                生成时间：{{ item.ctime }}
              </p>
              <p style="text-align: left; font-size: 10px">
                修改时间：{{ item.uptime }}
              </p>
            </div>
            <img
              :src="
                item.picUrl
                  ? item.picUrl
                  : require('@/assets/images/e_u111.png')
              "
            />
          </li>
          <!--编辑面板-->
          <xdOption
            :mObj="item"
            @importSubmit="importSubmit"
            v-if="vueData.editShow == index"
            :optionType="vueData.optionType"
            @cancelCreateM="cancelEditM"
            @saveCreateM="saveEditM"
          ></xdOption>
        </ul>
      </div>
      <page
        :currentPage="vueData.pagePrams.pageNum"
        :pageSize="vueData.pagePrams.pageSize"
        :small="vueData.pagePrams.small"
        :background="vueData.pagePrams.background"
        :pagerCount="vueData.pagePrams.pagerCount"
        :total="vueData.pagePrams.total"
        @handleCurrentChange="handleCurrentChange"
        class="xd-page"
      ></page>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, ref } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { xdJason } from '@/components/missionRehearsal/xdJason.js'
import { Search } from '@element-plus/icons-vue'
import page from '@/components/page.vue'
import { useStore } from 'vuex'
import { getXDList } from '@/service/contingencyEditing'
import store from '@/store/index'
import { creatScene } from '@/views/homeHeader/hooks/index'
const { sceneSelectChange } = creatScene()
import emitter from '@/utils/eventbus'
// const store = useStore()

const upload = ref(null)

const uploadRef = ref(null)

const props = defineProps()

const emit = defineEmits(['showPanel', 'getXDItem'])

const vueData = reactive({
  input2: '',
  xdJason,
  showPanel: false,
  selectXd_model: null,
  selectXd_index: null,
  pagePrams: {
    pageNum: 1,
    pageSize: 6,
    small: true,
    background: true,
    pagerCount: 5,
    total: 100
  },
  showCreatePanel: false,
  saveItem: null,
  file: null,
  uploadHeaders: {
    Authorization: sessionStorage.getItem('token')
  },
  uploadData: {
    file: null
  },
  uploadUrl: null,
  editShow: null, //控制想定编辑面板显示隐藏
  optionType: null,
  simController: null,
  createBtn: false,
  sceneSelectContent: '',
  showXDList: true,
  showXDPanel: false
})

let createObj = reactive({
  name: '',
  scenarioDescribe: '',
  imageUrl: ''
})

/**
 * @description 想定面板展开收缩
 * @return {*}
 */
const getPanel = () => {
  vueData.showPanel = !vueData.showPanel
}

/**
 * @description
 * @param {*} item  所选想定
 * @param {*} index   索引
 * @return {*}
 */
const getXDItem = (item, index) => {
  // map.removeSim()
  emit('showPanel', true)
  emitter.emit('sendMinimize', false)
  vueData.showXDPanel = false
  vueData.selectXd_index = index
  console.log(item)
  let curSceneObj = {
    taskInfo: item.taskInfo,
    taskPurpose: item.taskPurpose,
    thinkGround: item.thinkGround,
    voiceName: '',
    name: item.name,
    scenarioDetailsMarkPicUrl: staticUrl + item.scenarioDetailsMarkPicUrl,
    scenarioWarEnvironment: item.scenarioWarEnvironment,
    intelligenceParam: item.intelligenceParam, //情报要素
    scenarioDetail: item.scenarioDetail, //详情
    troopsDescription: item.troopsDescription, //参战兵力
    id: item.id,
    scenarioId: item.id
  }
  if (item.voiceName) {
    curSceneObj.voiceName = staticUrl + item.voiceName
  }
  store.state.curSceneInfo = curSceneObj
  store.commit('setCurrentName', item.name)
  emitter.emit('sceneConfigComp', { name: 'scenario' })
}

const showUpload = () => {
  console.log(upload.value)
}

/**
 * @description 打开新建面板
 * @return {*}
 */
const showCreatePanel = () => {
  if (typeof vueData.editShow == 'number') vueData.editShow = null
  vueData.optionType = 'create'
  createObj.name = ''
  createObj.scenarioDescribe = ''
  createObj.picUrl = null
  vueData.pagePrams.pageSize = 3
  initXDList()
  vueData.showCreatePanel = true
}

/**
 * @description 取消新建
 * @return {*}
 */
const cancelCreateM = () => {
  vueData.showCreatePanel = false
  createObj.name = ''
  createObj.scenarioDescribe = ''
  vueData.pagePrams.pageSize = 4
  initXDList()
}

/**
 * @description 保存新建
 * @return {*}
 */
const saveCreateM = async (val) => {
  let path = './data/MAXSimScenario.xml'
  let datamodel = new PIESIM.CGFDataModel()
  datamodel.LoadXml(path)
  let picPrams = {
    file: vueData.file
  }
  let { data } = await uploadPic(picPrams)
  let params = {
    content: datamodel.upload(),
    name: createObj.name,
    picPath: data.picPath,
    picUrl: data.picUrl,
    scenarioDescribe: createObj.scenarioDescribe
  }
  createXD(params).then((res) => {
    if (res.code == 200) {
      vueData.pagePrams.pageSize = 4
      initXDList()
      vueData.showCreatePanel = false
    }
  })
}

/**
 * @description 取消编辑
 * @return {*}
 */
const cancelEditM = () => {
  vueData.editShow = null
  initXDList()
}

/**
 * @description 保存编辑
 * @return {*}
 */
const saveEditM = async (val) => {
  let params = {
    content: val.content,
    name: val.name,
    picPath: val.picPath,
    picUrl: val.picUrl,
    scenarioDescribe: val.scenarioDescribe,
    id: val.id
  }
  if (vueData.file != null) {
    let picPrams = {
      file: vueData.file
    }
    let { data } = await uploadPic(picPrams)
    params.picPath = data.picPath
    params.picUrl = data.picUrl
  }
  updateXD(params).then((res) => {
    if (res.code == 200) {
      vueData.pagePrams.pageSize = 4
      vueData.editShow = null
      initXDList()
    }
  })
}

/**
 * @description 导入想定XML成功后调用
 * @param {*} res
 * @param {*} file
 * @return {*}
 */
const handleSuccess = (res, file) => {
  // console.log(res);
  if (res.code == 200) {
    initXDList()
    vueData.showPanel = false
  }
}

const handleCurrentChange = (value) => {
  vueData.pagePrams.pageNum = value
  initXDList()
}

/**
 * @description 获取XD列表
 * @return {*}
 */
const initXDList = () => {
  let params = {
    name: vueData.input2,
    pageNum: vueData.pagePrams.pageNum,
    pageSize: vueData.pagePrams.pageSize
  }
  getXDList(params).then((res) => {
    console.log('想定列表', res)
    if (res.code == 200) {
      vueData.xdJason = res.data.records
      vueData.pagePrams.total = res.data.total
    }
  })
}

const getListByName = (value) => {
  initXDList()
}

const importSubmit = (e) => {
  // console.log(e);
  // console.log(file);
  vueData.file = e.raw
}

/**
 * @description 打开编辑面板
 * @param {*} item
 * @param {*} index
 * @return {*}
 */
const showEditXD = (item, index) => {
  if (vueData.showCreatePanel) vueData.showCreatePanel = false
  vueData.pagePrams.pageSize = 4
  let obj = Object.assign({}, item)
  createObj.picUrl = obj.picUrl
  initXDList()
  vueData.optionType = 'edit'
  vueData.editShow = index
}

const downloadXD_ = () => {}

const confirmDL = (item) => {
  downloadXD({ id: item.id }).then((res) => {
    let datamodel = new PIESIM.CGFDataModel()
    console.log(res)
    datamodel.loadXmlString(res)
    datamodel.save()
  })
}

const cancelDL = () => {}

// 场景变化后执行函数
async function toggleScene(bId) {
  let viewer = window.EarthViewer
  // 保存场景id
  store.commit('setSceneID', bId)
}

onMounted(() => {
  vueData.showPanel = true
  initXDList()
  // vueData.uploadUrl = uploadXD;
  let seatType = sessionStorage.getItem('roleName')
  // vueData.createBtn = showList[seatType].createBtn;
  // vueData.simController = new SIMController();
})
emitter.on('closeCheckBox', (val) => {
  vueData.showXDList = val
})
emitter.on('sendXDShow', (val) => {
  vueData.showXDPanel = val
})
</script>
<style lang="less" scoped>
.selectStyle {
  background: rgba(2, 167, 240, 0.290196078431373) !important;
  border-color: rgba(2, 167, 240, 1) !important;
  border-width: 1px;
  border-style: solid;
  box-sizing: border-box !important;
}

.XDPanel-false {
  border-width: 0px;
  position: fixed;
  left: 0;
  top: 10%;
  width: 400px;
  height: 46.59px;
  z-index: 25;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;

  .xd-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 15px;
    border-bottom: 1px solid #0b3855;
    height: 35px;

    .xdName {
      font-family: "Arial Negreta", "Arial Normal", "Arial";
      font-weight: 700;
      font-style: normal;
      font-size: 19px;
      color: #c2d7ee;
    }

    .flexible {
      width: 20px;
      height: 20px;
      transform: rotate(90deg);
    }

    .flexible_false {
      width: 20px;
      height: 20px;
      transform: rotate(270deg); // transform: rotate(90deg);
      cursor:pointer
    }
  }
}

.XDPanel {
  border-width: 0px;
  z-index: 25;
  position: absolute;
  left: 50%;
  top: 15%;
  width: 1000px;
  height: 670px;
  margin-left: -500px;
  overflow: hidden;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  .xd-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 15px;
    border-bottom: 1px solid #0b3855;
    height: 35px;

    .xdName {
      font-family: "Arial Negreta", "Arial Normal", "Arial";
      font-weight: 700;
      font-style: normal;
      font-size: 19px;
      color: #c2d7ee;
    }

    .flexible {
      width: 20px;
      height: 20px;
      transform: rotate(90deg);
      cursor:pointer
    }

    .flexible_false {
      width: 20px;
      height: 20px;
      cursor:pointer
      // transform: rotate(90deg);
    }
  }

  .xd-content {
    padding: 5px;
    .xd-list{
      width: 100%;
      text-align: left;
    }
    .top-bar {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 10px 0px 5px 4px;
      :deep(.el-input__wrapper) {
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset;
        .el-input__inner {
          color: #ffffff;
        }
      }
      .bar-left {
        width: 45%;
      }

      .bar-right {
        display: flex;
        justify-content: center;
        align-items: center;

        .right-item {
          width: 83px;
          height: 33px;
          margin-left: 10px;
          background-image: url(@/assets/images/xdbj/big-bg.svg);
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor:pointer;

          span {
            color: #ffff;
            padding-left: 5px;
          }
          // span:hover {
          //   padding-left: 5px;
          //   color: #a5a4b5;
          //   cursor:pointer
          // }
        }
      }
      .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 80px;
      height: 30px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }
    }

    :deep(.el-input) {
      .el-input__wrapper {
        border-radius: 3px;
        box-shadow: none;
        background: transparent;
        border: 1px solid #075D89;
      }
    }

    .xd-item {
      box-sizing: border-box !important;
      border: 1px solid #ffffff00;
      background-color: rgba(34, 59, 80, 1);
      margin: 8px 4px;
      cursor:pointer;
      padding: 0;
      display: inline-block;
      width: 49%;

      :deep(.el-input) {
        .el-input__wrapper {
          border-radius: 0;
          box-shadow: none;
          background: #0d1a2b;
          border: 1px solid #0b3855;
          color: #ffff;
        }
      }

      :deep(.el-textarea__inner) {
        height: 90px;
        border-radius: 0;
        box-shadow: none;
        color: #ffff;
        background-color: #0d1a2b;
        border: 1px solid #0b3855;
      }

      .xd-itemName {
        display: flex;
        justify-content: space-between;
        padding: 5px;

        .itemName-left {
          display: flex;
          justify-content: center;
          align-items: center;

          .icon {
            margin: 0 10px;
            border: 1px solid #81d3f8;
            height: 23px;
            width: 21px;
          }

          .name {
            font-family: "Arial Normal", "Arial";
            font-weight: 400;
            font-style: normal;
            font-size: 16px;
            color: #81D3F8;
          }
        }

        .itemName-right {
          display: flex;
          justify-content: center;
          align-items: center;

          .right-box {
            cursor: pointer;
            width: 59px;
            height: 27px;
            background: url(@/assets/images/rwty/btn.svg);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffff;
            font-size: 12px;
            margin-left: 5px;

            span {
              padding-left: 5px;
            }
            span:hover {
              padding-left: 5px;
              color: #a5a4b5;
            }
          }
        }
      }

      .xd-itemContent {
        display: flex;
        padding: 0 10px;

        .itemContent-left {
          width: 60%;
          height: 120px;
          color: #ffff;
          font-size: 12px;
          // padding-left: 10px;

          p {
            font-size: 14px;
            color: #ffff;
            text-align: left;
          }

          .item-Describe {
          //   height: 60px;
            text-align: center;
            font-size: 14px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }

        .itemContent-right {
          flex-grow: 1;
          padding-left: 5px;

          .add-bg {
            background-color: #0d1a2b;
            height: 90px;

            .noneStyle {
              display: none;
              z-index: 22;
              position: absolute;
            }

            .img-add {
              background-color: #0d1a2b;
              height: 80px;
            }

            .newImg {
              width: 100%;
              height: 100%;
            }
          }

          .add-bg:hover .img-add {
            display: inline-block;
          }

          p {
            font-size: 14px;
            color: #ffff;
            text-align: left;
          }
        }

        img {
          width: 148px;
          height: 99px;
        }
      }
    }
    .xd-page{
      width: 100%;
      display: flex;
      justify-content: center;
      padding-top: 15px
    }
  }

  :deep(.el-pagination) {
    justify-content: end;
  }

  :deep(.el-input) {
    --el-input-bg-color: #0d1a2b;
  }

  :deep(.el-upload-list) {
    margin: 0;
  }
}

// :deep(.el-popper-container-5343){
//         z-index: 1111111;
//     }
</style>
