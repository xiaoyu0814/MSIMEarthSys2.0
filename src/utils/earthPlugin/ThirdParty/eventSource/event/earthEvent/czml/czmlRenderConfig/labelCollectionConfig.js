/*
 * @Author: root root@example.com
 * @Date: 2024-07-04 18:46:37
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-07-13 09:28:34
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\czml\czmlRenderConfig\labelCollectionConfig.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 通过labelCollection配置动态label的方法
 */
export function labelCollectionConfig(json, newImg) {
  let include = EarthAPP.elementArr.includes(json.name)
  if (!include) {
    // EarthAPP.elementArr.push(json.name)
    let billboardData = {
      id: json[1].name,
      position: window.MSIMEarth.Cartesian3.fromDegrees(0, 0, 0),
      image: newImg, //'static/image/billboard/border_bg_red.png', // default: undefined
      show: false, // default
      pixelOffset: new window.MSIMEarth.Cartesian2(5, -30), // default: (0, 0)
      color: window.MSIMEarth.Color.WHITE.withAlpha(1),
      horizontalOrigin: window.MSIMEarth.HorizontalOrigin.CENTER, // default
      verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER, // default: CENTER
      scale: 0.5, // default: 1.0
      // color: window.MSIMEarth.Color.LIME, // default: WHITE
      // rotation: window.MSIMEarth.Math.PI_OVER_FOUR, // default: 0.0
      // eyeOffset: new window.MSIMEarth.Cartesian3(0.0, 0.0, -10.0),
      alignedAxis: window.MSIMEarth.Cartesian3.ZERO, // default
      width: 260, // default: undefined
      height: 60 // default: undefined
    }
    let labelData = {
      id: json[1].name,
      position: window.MSIMEarth.Cartesian3.fromDegrees(0, 0, 0),
      text: json[1].description,
      font: 'bold 32px MicroSoft YaHei',
      scale: 0.5,
      show: false,
      fillColor: new window.MSIMEarth.Color(1.0, 1.0, 1.0, 1),
      outlineColor: new window.MSIMEarth.Color(1.0, 1.0, 1.0, 1),
      outlineWidth: 1,
      style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
      // horizontalOrigin: window.MSIMEarth.HorizontalOrigin.CENTER, //水平位置
      pixelOffset: new window.MSIMEarth.Cartesian2(5, -30),
      eyeOffset: new window.MSIMEarth.Cartesian3(0.0, 0.0, -10.0),
      horizontalOrigin: window.MSIMEarth.HorizontalOrigin.CENTER, // default
      verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER // default: CENTER
      // distanceDisplayCondition:
      //   new window.MSIMEarth.DistanceDisplayCondition(1000, 6e5), //20e5
      // distanceDisplayCondition: distance
      // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
      // disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
    EarthAPP.billboardCollection.add(billboardData)
    EarthAPP.labelCollectionD.add(labelData)
    // let hasLabel = false
  }
  // for (let i = 0; i < EarthAPP.labelCollectionD.length; ++i) {
  //   const l = EarthAPP.labelCollection.get(i)
  //   if (l&&l.text === json[1].description) {
  //     // EarthAPP.labelCollectionD.remove(l)
  //     hasLabel = true
  //   }
  // }
  // setTimeout(() => {
  //   if(!hasLabel){
  //     console.log('添加了',json[1].name);
  //     EarthAPP.billboardCollection.add(billboardData)
  //     EarthAPP.labelCollectionD.add(labelData)
  //   }
  // }, 1000);
}
