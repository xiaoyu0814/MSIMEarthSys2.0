// 初始化西安JB功能
export function plotInit() {
  var script3 = document.createElement('script')
  script3.src = './EarthPlotCore.js'
  var script4 = document.createElement('script')
  script4.src = './EarthDraw.js'
  document.body.appendChild(script3)
  document.body.appendChild(script4)
}
