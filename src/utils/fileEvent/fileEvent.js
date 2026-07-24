import { receiveFile } from '@/service/adjustControl/document.js'
import { ElMessage, ElNotification } from 'element-plus'
export function getsocketResult_doc(res) {
  if (res.currentTarget.readyState == 1) {
    let data = JSON.parse(res.data)
    if (data.status == 'websocket连接成功!') {
    } else {
      _receiveFile(res.data)
    }
  }
}

function _receiveFile(id) {
  let params = { id }
  receiveFile(params).then((res) => {
    if (res.code == 200) {
      ElNotification({
        title: '通知',
        message: '收到一封新邮件',
        duration: 2000
      })
    } else {
      ElMessage.error('邮件接收失败')
    }
  })
}
