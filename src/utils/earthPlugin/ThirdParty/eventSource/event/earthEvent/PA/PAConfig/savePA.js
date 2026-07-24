/*
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-06-22 18:28:44
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-06-23 10:48:50
 * @FilePath: \MSIMEarthSys\src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\PA\PAConfig\savePA.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'
import { get } from 'lodash-es'
import{getSatlliteData} from '@/service/battlefieldEnvironment'
export default function () {
  // 保存PA数据到store,用于场景内信息查询
  const savePAData = (json) => {
    let exits = false
    store.state.sceneModule.sceneEnityData.map((item) => {
      if (item.Data.Name == json.Data.Name) {
        exits = true
        return
      }
    })
    //此处加载两颗卫星的轨道数据
    if(json.Data.Name == 'OpticalSatellite-1' || json.Data.Name == 'OpticalSatellite-2') 
    {
      let planLineData = store.state.sceneModule.planLineData
      getSatlliteData(json.Data.Name).then((res) => {
        planLineData[json.Data.Name] = res.RouteData
        store.commit('setPlanLineData', planLineData)
      })
    }
    if (json.Data.Route && json.Data.Route.length > 0) {
      let planLineData = store.state.sceneModule.planLineData
      if (!planLineData[json.Data.Name]) {
        planLineData[json.Data.Name] = json.Data.Route
        store.commit('setPlanLineData', planLineData)
      }
    }
    if (!exits) store.state.sceneModule.sceneEnityData.push(json)
  }

  return { savePAData }
}
