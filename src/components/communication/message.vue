<template>
  <div id="message">
    <header ref="message_header">
      <span style="font-size: 18px" v-if="!vueData.chatName">聊天窗口</span>
      <span style="font-size: 18px" v-else>{{ vueData.chatName }}</span>
      <el-icon style="cursor: pointer" @click="closeMessageBox">
        <Close />
      </el-icon>
    </header>
    <ul class="body">
      <!-- 聊天内容 -->
      <li class="content">
        <el-scrollbar ref="scrollbarRef" height="560px">
          <!-- 聊天记录 -->
          <ul class="messageBox">
            <li v-for="(item, index) in vueData.messageDataList" :key="index">
              <!-- 自己的 -->
              <div class="user_self" v-if="vueData.userId == item.fromId">
                <div>
                  <p>{{ item.nick }}</p>
                  <div>{{ item.text }}</div>
                </div>
                <img src="~@/assets/images/user.png" alt="" />
              </div>
              <!-- 其他人的 -->
              <div class="user_other" v-else>
                <img src="~@/assets/images/user.png" alt="" />
                <div>
                  <p>{{ item.nick }}</p>
                  <div>{{ item.text }}</div>
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
        <!-- 消息内容编辑 -->
        <div class="inputBox">
          <el-input
            v-model="vueData.textarea"
            :rows="10"
            type="textarea"
            resize="none"
            @keydown="sendMsg"
          />
          <el-button class="send_btn" @click="websocketSend"
            >发&nbsp;&nbsp;&nbsp;送</el-button
          >
        </div>
      </li>
      <!-- 联系人、群组列表 -->
      <li class="userListBox">
        <el-tabs v-model="vueData.activeName" @tab-click="getTabs">
          <el-tab-pane label="联系人" name="user">
            <ul class="addressBook">
              <li v-for="(item, index) in vueData.addressBook" :key="index">
                <p v-if="item.children.length > 0">{{ item.title }}</p>
                <el-scrollbar max-height="210px">
                  <div
                    v-if="item.children.length > 0"
                    v-for="(children, children_index) in item.children"
                    :key="children_index"
                    @click="
                      ;(vueData.select_user_index =
                        children_index + item.title),
                        (vueData.msgToId = children.userInfo.id),
                        (children.msgLength = 0),
                        store.commit(
                          'REMOVE_MESSAGESTORE',
                          children.userInfo.id
                        )
                      _getChatHistory(children.userInfo.id, children)
                    "
                  >
                    <el-badge
                      :value="children.msgLength"
                      :hidden="children.msgLength == 0"
                      style="width: 100%"
                      v-if="children.userInfo.nickName"
                    >
                      <div
                        class="userItem"
                        :class="
                          vueData.select_user_index ==
                          children_index + item.title
                            ? 'select_style'
                            : ''
                        "
                      >
                        <div style="display: flex; align-items: center">
                          <img
                            src="~@/assets/images/user.png"
                            alt=""
                            style="width: 16px; margin-right: 5px"
                          />
                          <span class="username">
                            {{ children.userInfo.nickName }}
                            <el-tag
                              v-if="vueData.userId == children.userInfo.id"
                              type="warning"
                              >我</el-tag
                            >
                          </span>
                        </div>

                        <el-tag>
                          <!-- {{ children.userRoleInf }} -->
                          <span class="role" v-if="children.userRoleInfo">{{
                            children.userRoleInfo.roleName
                          }}</span>
                        </el-tag>
                        <el-tag
                          :type="
                            children.userInfo.status != 0 ? 'success' : 'info'
                          "
                        >
                          <span class="liveType">
                            {{
                              children.userInfo.status != '0' ? '在线' : '离线'
                            }}
                          </span>
                        </el-tag>
                        <div class="userInfo" v-if="false">
                          <el-tag
                            :type="
                              children.userInfo.status != 0 ? 'success' : 'info'
                            "
                          >
                            <span class="liveType">
                              {{
                                children.userInfo.status != '0'
                                  ? '在线'
                                  : '离线'
                              }}
                            </span>
                          </el-tag>
                          <!-- <span class="liveType">
                          {{
                            children.userInfo.status != "0" ? "在线" : "离线"
                          }}
                        </span> -->
                          <!-- <span class="ip">{{ children.relation.ip }}</span> -->
                          <el-tag>
                            <span class="role" v-if="children.userRoleInfo">{{
                              children.userRoleInfo.roleName
                            }}</span>
                          </el-tag>
                        </div>
                      </div>
                    </el-badge>
                  </div>
                </el-scrollbar>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="群组" name="group">
            <ul class="group_box">
              <li
                class="itemGroup"
                v-for="(item, index) in vueData.roomList"
                :key="index"
                :class="
                  vueData.select_room_index == index ? 'select_style' : ''
                "
                @click="
                  ;(vueData.select_room_index = index),
                    (vueData.msgToId = item.id),
                    _getHistoryMessage(item.roomId, item)
                "
              >
                <div>
                  <img src="~@/assets/images/群.png" alt="" />
                  {{ item.roomName }}
                </div>
                <el-scrollbar max-height="180px">
                  <el-tree :data="item.userList">
                    <template #default="{ node, data }">
                      <div v-if="data.name">{{ data.name }}</div>
                      <div
                        v-else
                        style="
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          padding-bottom: 5px;
                        "
                        :style="{
                          color:
                            data.userInfo.status == '0' ? '#cccccc' : '#ffffff'
                        }"
                      >
                        <p style="margin-right: 10px; font-size: 16px">
                          名称：{{ data.userInfo.nickName }}
                        </p>
                        <span style="text-align: left">
                          <p>
                            状态：{{
                              data.userInfo.status == 0 ? '离线' : '在线'
                            }}
                          </p>
                          <p>
                            席位：<span v-if="data.userRoleInfo">{{
                              data.userRoleInfo.roleName
                            }}</span>
                          </p>
                        </span>
                      </div>
                    </template>
                  </el-tree>
                </el-scrollbar>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { Close } from '@element-plus/icons-vue'
import {
  getHistoryMessage,
  getChatHistory,
  getRoomList
} from '@/service/adjustControl/message'
import { getFriendsList } from '@/service/adjustControl/adjustControl'
// import drag from "@/utils/dragElement";

const vueData = reactive({
  activeName: 'user',
  userId: sessionStorage.getItem('userId'),
  messageDataList: [],
  addressBook: [],
  roomList: [],
  select_user_index: -1,
  select_room_index: -1,
  msgToId: '',
  roomId: '',
  chatName: ''
})

const store = useStore()

const props = defineProps({
  socketApi: {
    type: Object,
    default: {}
  },
  newMessage: {
    type: Object,
    default: {}
  },
  liveType: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits()

const message_header = ref(null)

const scrollbarRef = ref(null)

onMounted(async () => {
  // drag(message_header.value);
  await _getFriendsList()
  setMessageBadge(store.getters.get_messageStore)
})

/**
 * @description 设置滚动条到最下方
 */
let setScroll = () => {
  let scroll = document.getElementsByClassName('el-scrollbar__wrap')[0]
  setTimeout(() => {
    scroll.scrollTop = scroll.scrollHeight
  }, 0)
}

/**
 * @description 获取群聊天记录
 * @param { String } roomId 房间ID
 */
let _getHistoryMessage = (roomId, item) => {
  vueData.chatName = item.roomName
  vueData.roomId = roomId
  let params = {
    assignmentId: store.getters.get_taskData.id,
    roomId: vueData.roomId,
    pageSize: 100,
    pageNum: 1
  }
  getHistoryMessage(params).then((res) => {
    if (res.code == 200) {
      res.data.records.reverse()
      vueData.messageDataList = res.data.records
      setScroll()
    }
  })
}

/**
 * @description 获取单人聊天记录
 * @param { String } userId 聊天对象ID
 */
let _getChatHistory = (userId, children) => {
  vueData.chatName = children.userInfo.nickName
  let params = {
    assignmentId: store.getters.get_taskData.id,
    userId1: sessionStorage.getItem('userId'),
    userId2: userId
  }
  getChatHistory(params).then((res) => {
    if (res.code == 200) {
      res.data.reverse()
      vueData.messageDataList = res.data
      setScroll()
    }
  })
}

/**
 * @description 获取联系人列表
 */
let _getFriendsList = () => {
  return new Promise((resolve) => {
    let params = sessionStorage.getItem('userId')
    getFriendsList(params).then((res) => {
      if (res.code == 200) {
        vueData.addressBook = [
          {
            title: '导演部人员',
            children: []
          },
          {
            title: '模拟器',
            children: []
          },
          {
            title: '红方人员',
            children: []
          },
          {
            title: '橙方人员',
            children: []
          },
          {
            title: '黄方人员',
            children: []
          },
          {
            title: '绿方人员',
            children: []
          },
          {
            title: '青方人员',
            children: []
          },
          {
            title: '蓝方人员',
            children: []
          },
          {
            title: '紫方人员',
            children: []
          }
        ]
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i]
          // if (element.relation.status < 3) {
          vueData.addressBook[element.relation.status].children.push(element)
          // }
        }
        resolve()
      }
    })
  })
}

/**
 * @description 获取群聊列表
 */
let _getRoomList = () => {
  let params = sessionStorage.getItem('userId')
  getRoomList(params).then((res) => {
    if (res.code == 200) {
      for (let i = 0; i < res.data.rooms.length; i++) {
        const element = res.data.rooms[i]
        if (element.name == 'red') {
          element.roomName = '红方交流群'
        } else if (element.name == 'blue') {
          element.roomName = '蓝方交流群'
        } else {
          element.roomName = '导演交流群'
        }
        element.userList = [
          {
            name: '群成员',
            children: element.user
          }
        ]
      }
      vueData.roomList = res.data.rooms
    }
  })
}

/**
 * @description 点击时获取当前tab页
 * @param { Object } name 标签对象
 */
let getTabs = (name) => {
  vueData.messageDataList = []
  if (name.props.label == '联系人') {
    vueData.select_user_index = -1
    _getFriendsList()
  } else {
    vueData.select_room_index = -1
    _getRoomList()
  }
}

/**
 * @description 发送消息
 */
let websocketSend = () => {
  // type: 1是文本，2是图片，3是链接
  let content = vueData.textarea
  let tempMsg = {
    text: vueData.textarea,
    fromId: sessionStorage.getItem('userId'),
    nick: sessionStorage.getItem('username')
  }
  vueData.messageDataList.push(tempMsg)
  let params = {
    text: content,
    nick: sessionStorage.getItem('username'),
    type: '1',
    toUserId: '',
    roomId: ''
  }
  if (vueData.activeName == 'user') {
    params.toUserId = vueData.msgToId
    params.roomId = 0
  } else {
    params.toUserId = 0
    params.roomId = vueData.roomId
  }
  props.socketApi.sendSock(params)
  vueData.textarea = ''
  scrollbarRef.value.setScrollTop(5000)
  setScroll()
}

/**
 * @description 回车发送消息内容
 * @param { Object } e 事件Event对象
 */
let sendMsg = (e) => {
  if (e.keyCode == 13) {
    websocketSend()
  }
}

/**
 * @description 关闭聊天窗口
 */
let closeMessageBox = () => {
  emit('closeMessageBox', false)
}

/**
 * @description 设置消息数量显示徽标
 * @param { Array } data 消息仓库
 */
let setMessageBadge = (data) => {
  for (let i = 0; i < vueData.addressBook.length; i++) {
    const children = vueData.addressBook[i].children
    for (let j = 0; j < children.length; j++) {
      const user = children[j]
      user.msgLength = 0
      for (let k = 0; k < data.length; k++) {
        const msg_item = data[k]
        if (user.userInfo.id == msg_item.userId) {
          user.msgLength = msg_item.length
        }
      }
    }
  }
}

watch(
  [
    () => props.newMessage,
    () => props.liveType,
    () => store.getters.get_messageStore
  ],
  (nVal) => {
    let newMessage = nVal[0]
    let liveType = nVal[1]
    let get_messageStore = nVal[2]
    if (newMessage && JSON.stringify(newMessage) != '{}') {
      vueData.messageDataList.push(newMessage)
      setScroll()
    }
    if (liveType.liveType) {
      _getFriendsList()
    } else {
      _getFriendsList()
    }
    if (get_messageStore) {
    }
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
#message {
  color: #ffff;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -625px;
  margin-top: -415px;
  width: 1250px;
  height: 837px;
  background-color: rgba(8, 36, 62, 0.7);
  border: 1px solid #44566a;
  z-index: 23;
  header {
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #44566a;
    box-sizing: border-box;
  }

  .body {
    display: flex;
    height: calc(100% - 45px);
    margin: 0;
    padding: 0;

    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
      border-right: 1px solid #44566a;

      .messageBox {
        li > div {
          display: flex;
          padding: 10px;

          div {
            p {
              color: #7e9fc5;
              font-size: 12px;
            }

            div {
              color: #000000;
              background-color: #ffffff;
              padding: 5px 10px;
              border-radius: 10px;
              max-width: 500px;
              display: flex;
              flex-wrap: wrap;
              word-break: break-all;
              text-align: left;
            }
          }
        }

        img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }

        .user_other {
          div {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            p {
              text-align: left;
              margin-bottom: 5px;
            }
          }
        }

        .user_self {
          justify-content: flex-end;

          div {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-end;
            p {
              text-align: right;
              margin-bottom: 5px;
            }

            div {
              background-color: #2bff00;
            }
          }

          img {
            margin-left: 10px;
          }
        }
      }

      .inputBox {
        position: relative;
        ::v-deep(.el-textarea__inner) {
          background-color: #2b4559 !important;
          box-shadow: 0 0 0 1px #075d89 inset;
          color: #ffffff;
        }
        .send_btn {
          position: absolute;
          right: 10px;
          bottom: 10px;
        }
        .el-button {
          background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
          width: 80px;
          height: 30px;
          color: #ffff;
          border-radius: 5px;
          margin-left: 10px;
          cursor: pointer;
          border: none !important;
        }
      }
    }

    .userListBox {
      width: 300px;
      ::v-deep(.el-tabs__item.is-active) {
        color: #409eff;
      }
      ::v-deep(.el-tabs__item) {
        color: #ffffff;
      }
      ::v-deep(.el-tabs__item:hover) {
        color: #409eff;
      }
      // .el-tabs__item.is-active
      .addressBook {
        // background-color: #40a0ff3d;
        height: 717px;
        padding: 0 20px 10px;
        box-sizing: border-box;
        ::v-deep(li::marker) {
          content: '';
        }
        li {
          p {
            text-align: left;
            font-size: 20px;
            font-weight: bold;
          }
          .userItem {
            padding: 10px;
            border: 1px solid #00000000;
            display: flex;
            justify-content: space-between;
            &:hover {
              border: 1px solid #3781cee6;
              // background-color: #40a0ff3d;
            }
            .username {
              // width: 50%;
              // font-size: 20px;
              // display: flex;
              // align-items: center;
              // justify-content: center;
              display: inline-block;
              // width: 60px;
              width: 80px;
              text-align: left;
              letter-spacing: 1px;
            }
            .userInfo {
              width: 50%;
              text-align: left;
              display: flex;
              flex-direction: column;
              font-size: 14px;
            }
          }
        }
      }

      .group_box {
        padding: 0;
        .addGroup {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          padding: 10px;
          img {
            margin-right: 10px;
          }
        }
        .itemGroup {
          font-size: 18px;
          padding: 10px;
          border: 1px solid #ffffff00;
          img {
            margin-right: 10px;
          }
          &:hover {
            border: 1px solid #3781cee6;
            // background-color: #40a0ff3d;
          }
          ::v-deep(.el-tree-node__content) {
            height: auto;
          }
        }
      }
    }
  }

  .select_style {
    border: 1px solid #3781cee6 !important;
    background-color: #40a0ff3d !important;
  }

  ::v-deep(.el-tree-node__content:hover) {
    background-color: #40a0ff3d;
    // color: 40a0ff3d;
  }
  ::v-deep(.el-tree) {
    background: transparent;
    color: #ffffff;
    --el-tree-node-hover-bg-color: transparent;
  }
}
</style>
