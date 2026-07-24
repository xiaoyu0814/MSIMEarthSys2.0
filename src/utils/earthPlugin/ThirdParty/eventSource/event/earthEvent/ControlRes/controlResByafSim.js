import store from '@/store'
export default function () {
  const handleControlRes = (json) => {
    if (json.IsSendToCommand && json.data) {
      let controlResData = JSON.parse(json.data)
      if (Object.keys(controlResData).length > 0) {
        if (controlResData.status != 'successes') {
          console.log(json)
          if (controlResData['reason'] && controlResData['reason'].length > 0) {
            ElMessage({
              type: 'error',
              message: '导调指令失败：' + controlResData['reason']
            })

            // 右上角消息提示
            // beautyToast.error({
            //   title: '导调指令',
            //   message: controlResData['reason'],
            //   darkTheme: true
            // })
          }
        }
      }
    }
  }
  return { handleControlRes }
}
