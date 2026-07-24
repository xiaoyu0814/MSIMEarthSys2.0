import { toAltitude, updateSpeed, getPlateSWMessageV2 } from '@/service/command'
import { ElMessage } from 'element-plus'
import { sendToCommandShowResMsg } from '@/utils/mapTools'
import Bubble3 from '@/utils/bubble/dataBubble3'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'

export default function (val) {
  const store = useStore()
  console.log(val)

  switch (val.name) {
    case '攻击自定义指令':
      emitter.emit('fireByRawChange1', true)
      break
    case '变更到指定位置':
      break
    case '立即改变位置':
      break
    // case '发送干扰弹':
    //   break
    // case '激光定向干扰':
    //   break
    // case '激光欺骗':
    //   break
    // case '伴飞':
    //   break
    // case '飞机起飞':
    //   break
    default:
  }
  return {}
}
