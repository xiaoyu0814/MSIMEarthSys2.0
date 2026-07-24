/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-01-11 17:23:30
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2024-01-11 18:20:22
 * @FilePath: \MSIMEarthSysN\src\utils\measurement\analysisVisible.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
class analysisVisible {
  constructor(viewer) {
    this.CesiumEventHandler = new MSIMEarth.ScreenSpaceEventHandler(
      viewer.scene.canvas
    )
    this.positions = []
    this.markers = [] //点实体
    this.obj = {
      startpointStyle: {
        image: './1.png',
        text: '观察点',
        pixelOffsetX: 10,
        pixelOffsetY: -20,
        scale: 0.5
      },
      endpointStyle: {
        image: './1.png',
        text: '目标点',
        pixelOffsetX: 10,
        pixelOffsetY: -20,
        scale: 0.5
      }
    }
    this._viewer = viewer
  }

  addPoint() {
    let self = this
    this.CesiumEventHandler.setInputAction(function (movement) {
      const cartesian = self._viewer.scene.pickPosition(movement.position)
      if (cartesian) {
        self.positions.push(cartesian) //加点
        if (self.markers.length == 0) {
          //创建点实体
          var startpoint = self._viewer.entities.add({
            position: cartesian,
            billboard: {
              image: self.obj.startpointStyle.image,
              heightReference: MSIMEarth.HeightReference.NONE
            },
            label: {
              text: self.obj.startpointStyle.text,
              fillColor: MSIMEarth.Color.YELLOW,
              pixelOffset: {
                x: self.obj.startpointStyle.pixelOffsetX,
                y: self.obj.startpointStyle.pixelOffsetY
              },
              scale: self.obj.startpointStyle.scale
            }
          })
          self.markers.push(startpoint)
        } else if (self.markers.length == 1) {
          const endpoint = self._viewer.entities.add({
            position: cartesian,
            billboard: {
              image: self.obj.endpointStyle.image,
              heightReference: MSIMEarth.HeightReference.NONE
            },
            label: {
              text: self.obj.endpointStyle.text,
              fillColor: MSIMEarth.Color.YELLOW,
              pixelOffset: {
                x: self.obj.endpointStyle.pixelOffsetX,
                y: self.obj.endpointStyle.pixelOffsetY
              },
              scale: self.obj.endpointStyle.scale
            }
          })
          self.markers.push(endpoint)
          self.CesiumEventHandler.removeInputAction(
            MSIMEarth.ScreenSpaceEventType.LEFT_CLICK
          ) //移除左键事件
          self.analysisVisible(self.positions) //开始分析
        }
      }
    }, MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
  }
  analysisVisible() {
    // 计算射线的方向
    let direction = MSIMEarth.Cartesian3.normalize(
      MSIMEarth.Cartesian3.subtract(
        this.positions[1],
        this.positions[0],
        new MSIMEarth.Cartesian3()
      ),
      new MSIMEarth.Cartesian3()
    )
    // 建立射线
    let ray = new MSIMEarth.Ray(this.positions[0], direction)
    // 计算交互点，返回第一个
    let result = this._viewer.scene.pickFromRay(ray)
    if (MSIMEarth.defined(result) && MSIMEarth.defined(result.object)) {
      this.drawLine(result.position, this.positions[0], MSIMEarth.Color.GREEN) // 可视区域
      this.drawLine(result.position, this.positions[1], MSIMEarth.Color.RED) // 不可视区域
    } else {
      this.drawLine(this.positions[0], this.positions[1], MSIMEarth.Color.GREEN)
      console.log('不在模型上')
    }
  }
  drawLine(leftPoint, secPoint, color) {
    this._viewer.entities.add({
      polyline: {
        positions: [leftPoint, secPoint],
        width: 2,
        material: color.withAlpha(0.08),
        depthFailMaterial: color.withAlpha(0.08)
      }
    })
    this._viewer.entities.add({
      polyline: {
        positions: [leftPoint, secPoint],
        width: 2,
        material: color,
        depthFailMaterial: color.TRANSPARENT
      }
    })
  }
}

export default analysisVisible
