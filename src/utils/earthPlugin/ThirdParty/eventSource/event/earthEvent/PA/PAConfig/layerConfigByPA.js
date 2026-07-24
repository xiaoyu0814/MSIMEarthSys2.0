import store from '@/store'
export default function () {
  // 基于PA信息初始化图层列表
  const initLayerConfig = (json) => {
    console.log('json.Data', json.Data)
    //如果锁定则不自动刷新图层
    if (!store.state.sceneModule.islayerListLock) {
      layerList.panelManagement.deleteNode(
        store.state.sceneModule.layerManagementData,
        json.Data.Name
      )
      let resultTreeData
      if (json.Data.Side == 'blue') {
        // 图层添加
        resultTreeData = layerList.panelManagement.addNode(
          store.state.sceneModule.layerManagementData,
          {
            name: json.Data.Name, //json.Data.LabelName,
            type: json.Data.Type,
            code: json.Data.Name,
            checked: true,
            clickable: true
          },
          '蓝方实体'
        )
        // 图层勾选
        resultTreeData = layerList.panelManagement.updateTickStatus(
          store.state.sceneModule.layerManagementData,
          {
            name: json.Data.Name, //json.Data.LabelName,
            type: json.Data.Type,
            code: json.Data.Name
          },
          'add'
        )
        // 蓝方目标布设完成 绿色
      } else if (json.Data.Side == 'red') {
        // 图层添加
        resultTreeData = layerList.panelManagement.addNode(
          store.state.sceneModule.layerManagementData,
          {
            name: json.Data.Name, //json.Data.LabelName,
            type: json.Data.Type,
            code: json.Data.Name,
            checked: true,
            clickable: true
          },
          '红方实体'
        )
        // 图层勾选
        resultTreeData = layerList.panelManagement.updateTickStatus(
          store.state.sceneModule.layerManagementData,
          {
            name: json.Data.Name, //json.Data.LabelName,
            type: json.Data.Type,
            code: json.Data.Name
          },
          'add'
        )
      }
      store.commit(
        'setLayerManagementData',
        JSON.parse(JSON.stringify(resultTreeData))
      )
    }
  }

  return { initLayerConfig }
}
