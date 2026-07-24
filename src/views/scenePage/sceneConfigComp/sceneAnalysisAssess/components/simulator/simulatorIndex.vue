<!--
 * @Author: root you@example.com
 * @Date: 2024-08-13 16:28:08
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-08-25 15:33:36
 * @FilePath: \MSIMEarthSysN\src\views\scenePage\sceneConfigComp\sceneAnalysisAssess\components\simulator\simulatorIndex.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- 模拟器 -->
<template>
  <div class="simulator-Information">
    <!--说明描述-->
    <div class="top-content">
      <!-- <div class="content-all">
        <span class="form-title-all">描述</span>
       
      </div> -->
      <!-- 模拟器信息展示 -->
      <simulatorInformation :simulatorId="curData.id"></simulatorInformation>
    </div>
    <!--统计-->
    <div class="center-content">
      <div class="content-all">
        <div class="form-title-all">模拟器飞行高度变化</div>
        <div class="button-content">
          <el-button type="primary" size="small" @click="showHeightDetail"
            >高度详情</el-button
          >
        </div>
        <div
          v-loading="loadingStatus"
          element-loading-text="加载中..."
          element-loading-background="rgba(0,0,0,0.8)"
        >
          <echartsCom
            :chartId="'pointCloudCoverEcharts-' + curData.id"
            :option="echartsOptionsData"
            class="echarts-pointCloudCover"
          ></echartsCom>
        </div>
      </div>
    </div>

    <div class="bottom-content">
      <div class="form-title-all">模拟器事件</div>
      <div class="button-content">
        <el-button type="primary" size="small" @click="histroyLine"
          >路径</el-button
        >
        <el-button type="primary" size="small" @click="showDetail"
          >详情</el-button
        >
      </div>
      <!-- <simulatorTable :simulatorId="curData.id"></simulatorTable> -->
      <!-- 模拟器事件 -->
      <sxEventEcharts :simulatorId="curData.id"></sxEventEcharts>
      <!-- 模拟器事件统计饼图 -->
      <echartsCom
        :chartId="'pieEcharts' + curData.id"
        :option="pieOption"
        class="echarts-pie"
      ></echartsCom>
    </div>
    <!--表格-->
    <el-dialog
      v-model="isShowDetail"
      title="模拟器详情"
      :before-close="handleClose"
      draggable
      width="94%"
      :close-on-click-modal="false"
      :show-close="true"
      style="
        background-color: rgba(0, 0, 0, 0);
        border: none;
        box-shadow: none;
        height: 680px;
        top: 2%;
      "
    >
      <simulatorDetailTable :simulatorId="curData.id" />
    </el-dialog>
    <!--高度统计折线图详情弹框-->
    <el-dialog
      v-model="isShowHeight"
      :title="flyHeightTitle"
      :before-close="handleCloseHeight"
      draggable
      width="100%"
      :close-on-click-modal="false"
      :show-close="true"
      style="
        background-color: rgba(0, 0, 0, 0);
        border: none;
        box-shadow: none;
        height: 750px;
        top: 2%;
      "
    >
      <echartsCom
        :chartId="'cloudCoverEcharts-' + curData.id"
        :option="echartsOptionsData"
        class="echarts-detailCloudCover"
      ></echartsCom>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import emitter from '@/utils/eventbus'
import {
  onMounted,
  reactive,
  nextTick,
  watch,
  markRaw,
  onUnmounted,
  toRefs
} from 'vue'
import echartsCom from '@/components/content/echarts/echartsCom.vue'
import simulatorTable from './simulatorTable.vue' //表格
import simulatorDetailTable from './simulatorDetailTable.vue' //表格
import simulatorInformation from './simulatorInformation.vue' //模拟器基本信息
import sxEventEcharts from './sxEventEcharts.vue' //模拟器基本信息
import {
  getAirDataJson,
  getSimHeightForm,
  getSimHeightFormByTimeZone,
  getAirDataJsonByTimeZone
} from '@/service/simulatorServer'
import store from '@/store/index'
import { date2String } from '@/utils/mapTools'
let hexToRgba = (hex, opacity) => {
  let rgbaColor = ''
  let reg = /^#[\da-f]{6}$/i
  if (reg.test(hex)) {
    rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt(
      '0x' + hex.slice(3, 5)
    )},${parseInt('0x' + hex.slice(5, 7))},${opacity})`
  }
  return rgbaColor
}
export default {
  name: 'chartCommon',
  props: {
    curData: {
      type: Object,
      default: {}
    }
  },
  components: {
    simulatorTable,
    echartsCom,
    simulatorDetailTable,
    simulatorInformation,
    sxEventEcharts
  },
  setup(props, ctx) {
    let echartsConfigByType = {
      Y8: {
        color: '#28ffb3'
      },
      Y9: {
        color: '#8B5CFF'
      },
      教10: {
        color: '#0090FF'
      },
      轰6H: {
        color: '#FAC858'
      }
    }
    const vueData = reactive({
      tabPosition: 'left',
      activeName: 'Y8',
      echartsOptionsData: {
        // title: {
        //   text: "单位(米)",
        //   subtext: "",
        //   textStyle: {
        //     // 提示框浮层的文本样式。
        //     color: '#fff',
        //     fontStyle: 'normal',
        //     fontWeight: 'normal',
        //     fontFamily: 'MicroSoft YaHei',
        //     fontSize: 13
        //   },
        //   top: '8',
        //   left: '13', // 图例组件离容器左侧的距离
        //   orient: 'vertical',
        // },
        backgroundColor: '#05224d09',
        color: [echartsConfigByType[props.curData.name].color],
        grid: {
          borderWidth: 0,
          // left: '3%',
          // right: '4%',
          top: 20,
          bottom: 60,
          textStyle: {
            color: '#fff'
          },
          left: 60,
          right: 30
        },
        legend: {
          textStyle: {
            color: '#fff' // 这里设置颜色
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let html = ''
            params.forEach((v) => {
              html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  echartsConfigByType[v.seriesName].color
                };"></span>
                ${v.seriesName}-${v.name}：
                <span style="color:${
                  echartsConfigByType[v.seriesName].color
                };font-weight:700;font-size: 18px">${v.value}(m)</span>
                `
            })
            return html
          },
          extraCssText:
            'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: '#05224d00',
              shadowColor: 'rgba(225,225,225,1)',
              shadowBlur: 5
            }
          }
        },
        calculable: true,
        xAxis: [
          //横轴格式为 时:分
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#f9f9f9'
              }
            },
            boundaryGap: false, //false：从初始位置0开始；true:一段距离数据再开始
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            // 暂时注释
            //name: '时:分', // 这个设置只在末尾添加单位
            // axisLabel: {
            //   formatter: `{value}条` // 在每个x轴坐标都添加了单位
            // },
            data: [
              '00:01',
              '01:00',
              '02:00',
              '03:00',
              '04:00',
              '05:00',
              '06:00',
              '07:00',
              '08:00',
              '09:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00'
            ]
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            nameLocation: 'end',
            axisLabel: {
              textStyle: {
                color: '#fff'
              },
              formatter: `{value}米` // 在每个x轴坐标都添加了单位
            },
            nameTextStyle: {
              color: '#fff',
              fontSize: 12,
              lineHeight: 40
            },
            // 分割线
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#E9E9E9'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#fff'
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 10,
            start: 0,
            end: 100,
            handleIcon:
              'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#5B3AAE'
            },
            textStyle: {
              color: '#f9f9f9'
            },
            fillerColor: 'rgba(67,55,160,0.4)',
            borderColor: 'rgba(204,187,225,0.5)'
          },
          {
            type: 'inside',
            show: true,
            height: 15,
            start: 0,
            end: 100
          }
        ],
        series: []
      },
      ownership: '', //表格查询-兵力归属
      name: '', //表格查询-name
      progressData: [], //试试兵力
      tableData: [], //表格数据
      seriesData: [
        {
          name: 'Y8',
          type: 'line',
          showAllSymbol: true,
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: 6,
          lineStyle: {
            normal: {
              color: '#28ffb3', // 线条颜色
              shadowBlur: 3,
              shadowColor: hexToRgba('#28ffb3', 0.5),
              shadowOffsetY: 8
            },
            borderColor: '#28ffb3'
          },
          label: {
            show: false,
            // position: 'top',
            // textStyle: {
            //   color: '#fff'
            // }
            position: 'top',
            lineHeight: 20,
            backgroundColor: '#28ffb3',
            borderRadius: 5,
            borderColor: '#28ffb3',
            borderWidth: '1',
            padding: [5, 15, 4],
            color: '#000000',
            fontSize: 14,
            fontWeight: 'normal'
          },
          areaStyle: {
            //区域填充样式
            normal: {
              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: hexToRgba('#28ffb3', 0.4)
                  },
                  {
                    offset: 1,
                    color: hexToRgba('#28ffb3', 0.1)
                  }
                ],
                false
              ),
              shadowColor: hexToRgba('#28ffb3', 0.1), //阴影颜色
              shadowBlur: 10 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            }
          },
          data: [
            20, 188, 198, 231, 211, 189, 183, 219, 210, 198, 188, 221, 201, 199,
            223, 219, 233, 0
          ]
        },
        {
          name: 'Y9',
          type: 'line',
          showAllSymbol: true,
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: 6,
          lineStyle: {
            normal: {
              color: '#8B5CFF', // 线条颜色
              shadowBlur: 3,
              shadowColor: hexToRgba('#8B5CFF', 0.5),
              shadowOffsetY: 8
            },
            borderColor: '#8B5CFF'
          },
          label: {
            show: false,
            // position: 'top',
            // textStyle: {
            //   color: '#fff'
            // }
            position: 'top',
            lineHeight: 20,
            backgroundColor: '#8B5CFF',
            borderRadius: 5,
            borderColor: '#8B5CFF',
            borderWidth: '1',
            padding: [5, 15, 4],
            color: '#000000',
            fontSize: 14,
            fontWeight: 'normal'
          },
          areaStyle: {
            //区域填充样式
            normal: {
              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: hexToRgba('#8B5CFF', 0.3)
                  },
                  {
                    offset: 1,
                    color: hexToRgba('#8B5CFF', 0.1)
                  }
                ],
                false
              ),
              shadowColor: hexToRgba('#8B5CFF', 0.1), //阴影颜色
              shadowBlur: 10 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            }
          },
          data: [
            22, 183, 219, 210, 198, 188, 221, 189, 201, 199, 223, 219, 188, 198,
            231, 211, 233, 0
          ]
        },
        {
          name: '教10',
          type: 'line',
          showAllSymbol: true,
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: 6,
          lineStyle: {
            normal: {
              color: '#0090FF', // 线条颜色
              shadowBlur: 3,
              shadowColor: hexToRgba('#0090FF', 0.5),
              shadowOffsetY: 8
            },
            borderColor: '#0090FF'
          },
          areaStyle: {
            //区域填充样式
            normal: {
              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: hexToRgba('#0090FF', 0.3)
                  },
                  {
                    offset: 1,
                    color: hexToRgba('#0090FF', 0.1)
                  }
                ],
                false
              ),
              shadowColor: hexToRgba('#0090FF', 0.1), //阴影颜色
              shadowBlur: 10 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            }
          },
          data: [
            18, 183, 219, 219, 188, 198, 231, 211, 233, 210, 198, 188, 221, 189,
            201, 199, 213, 0
          ]
        },
        {
          name: '轰6H',
          type: 'line',
          showAllSymbol: true,
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: 6,
          lineStyle: {
            normal: {
              color: '#FAC858', // 线条颜色
              shadowBlur: 3,
              shadowColor: hexToRgba('#FAC858', 0.5),
              shadowOffsetY: 8
            },
            borderColor: '#FAC858'
          },
          areaStyle: {
            //区域填充样式
            normal: {
              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: hexToRgba('#FAC858', 0.3)
                  },
                  {
                    offset: 1,
                    color: hexToRgba('#FAC858', 0.1)
                  }
                ],
                false
              ),
              shadowColor: hexToRgba('#FAC858', 0.1), //阴影颜色
              shadowBlur: 10 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            }
          },
          data: [
            11, 233, 210, 198, 188, 221, 189, 201, 183, 219, 219, 188, 198, 231,
            211, 199, 213, 0
          ]
        }
      ],
      pieOption: {
        title: {
          text: '模拟器事件统计',
          subtext: '',
          textStyle: {
            // 提示框浮层的文本样式。
            color: '#fff',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontFamily: 'MicroSoft YaHei',
            fontSize: 15
          },
          top: '35',
          left: '0', // 图例组件离容器左侧的距离
          orient: 'vertical'
        },
        tooltip: {
          //提示框组件，用于配置鼠标滑过或点击图表时的显示框。
          show: true, // 是否显示
          trigger: 'item', // 触发类型  'item'图形触发：散点图，饼图等无类目轴的图表中使用； 'axis'坐标轴触发；'none'：什么都不触发。
          showContent: true, //是否显示提示框浮层，默认显示。
          // triggerOn: 'mouseover', // 触发时机'click'鼠标点击时触发。
          backgroundColor: 'rgba(50,50,50,0.7)', // 提示框浮层的背景颜色。
          borderColor: '#333', // 提示框浮层的边框颜色。
          borderWidth: 0, // 提示框浮层的边框宽。
          padding: 5, // 提示框浮层内边距，
          textStyle: {
            // 提示框浮层的文本样式。
            color: '#fff',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontFamily: 'sans-serif',
            fontSize: 14
          }
        },
        legend: {
          show: true,
          data: [],
          textStyle: {
            color: '#fff' // 这里设置颜色
          },
          orient: 'horizontal', // 图例列表的布局朝向，'horizontal' 为水平,'vertical' 为垂直
          top: '10',
          left: '0', // 图例组件离容器左侧的距离
          type: 'scroll',
          pageIconColor: '#fff',
          pageTextStyle: {
            color: '#fff'
          },
          pageIconSize: 12,
          // itemWidth: 12, // 设置宽度
          // itemHeight: 10, // 设置高度
          textStyle: {
            fontSize: 12, //字体大小
            color: '#fff' //字体颜色（图例与图例文字配色保持一致）
          }
          // padding: 5, // 提示框浮层内边距，
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          },
          show: false
        },
        series: [
          {
            name: '模拟器事件统计',
            type: 'pie',
            radius: ['45%', '55%'],
            center: ['50%', '55%'], //圆心的位置
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: 1000,
                name: '发射导弹',
                itemStyle: {
                  normal: {
                    //颜色渐变
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 1, color: '#0078EB' },
                      // { offset: 0.8, color: 'transparent' },
                      // { offset: 0.4, color: '#0078EB' },
                      { offset: 0, color: '#0078EB50' }
                    ]),
                    borderWidth: 0 //边框宽度
                  }
                }
              },
              {
                value: 500,
                name: '受到干扰',
                itemStyle: {
                  normal: {
                    //颜色渐变
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: '#F1AB00' },
                      { offset: 1, color: '#F1AB0047' }
                    ]),
                    borderWidth: 0 //边框宽度
                  }
                }
              }
            ]
          }
        ]
      },
      isShowDetail: false,
      isShowHeight: false,
      loadingStatus: true,
      flyHeightTitle: '',
      flyHeightTime: ''
    })
    const setPointCloudEchartsData = (value, id) => {
      getPointCloudData(id).then((res) => {
        vueData.echartsOptionsData.xAxis[0].data = res.xMinTime
        if (value == 'Y8') {
          vueData.seriesData[0].data = res.yData
          vueData.echartsOptionsData.series = [vueData.seriesData[0]]
        } else if (value == 'Y9') {
          vueData.seriesData[1].data = res.yData
          vueData.echartsOptionsData.series = [vueData.seriesData[1]]
        } else if (value == '教10') {
          vueData.seriesData[2].data = res.yData
          vueData.echartsOptionsData.series = [vueData.seriesData[2]]
        } else if (value == '轰6H') {
          vueData.seriesData[3].data = res.yData
          vueData.echartsOptionsData.series = [vueData.seriesData[3]]
        }
      })
    }
    onMounted(() => {
      vueData.activeName = props.curData.name
      store.commit('setEndSeeStaticTime', date2String(new Date(), 0)) //保存当前查看模拟器统计面板这一刻的计算机时间
      setPointCloudEchartsData(props.curData.name, props.curData.id)
      formatterPieData(props.curData.id).then((res) => {
        if (res.length > 0) {
          res.forEach((item) => {
            let name = item.name
            vueData.pieOption.legend.data.push(name)
          })
          vueData.pieOption.series[0].data = res
        }
      })
    })
    const histroyLine = () => {
      emitter.emit('isShowTrajectoryReplay', {
        simulatorId: props.curData.id,
        simulatorName: props.curData.name,
        showType: true
      })
    }
    const showDetail = () => {
      vueData.isShowDetail = true
    }
    const handleClose = () => {
      vueData.isShowDetail = false
    }
    //格式化数据称饼图统计可用格式
    const formatterPieData = (id) => {
      return new Promise((resolve, reject) => {
        let startTime = store.state.sceneModule.startSceneTime
        let endTime = store.state.sceneModule.endSeeStaticTime
        let params = {
          mnq: id, //模拟器Id
          startSceneTime: startTime,
          endSceneTime: endTime
        }
        // let params = {
        //   "messageId": store.state.curSceneInfo.id,//场景Id
        //   "mnq": id, //模拟器Id
        //   "replayId": store.state.sceneModule.sceneReplayId//回放id
        // }
        // getAirDataJson(params).then(res => {
        getAirDataJsonByTimeZone(params).then((res) => {
          if (res.code == 200) {
            if (Object.keys(res.data).length > 0) {
              let pieSeriesData = []
              for (let item in res.data) {
                pieSeriesData.push({
                  value: res.data[item],
                  name: item,
                  itemStyle: {
                    normal: {
                      //颜色渐变
                      // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      //   { offset: 1, color: '#0078EB' },
                      //   // { offset: 0.8, color: 'transparent' },
                      //   // { offset: 0.4, color: '#0078EB' },
                      //   { offset: 0, color: '#0078EB50' }
                      // ]),
                      borderWidth: 0 //边框宽度
                    }
                  }
                })
              }
              resolve(pieSeriesData)
            }
          } else {
            ElMessage.warning('获取数据失败，请稍后再试！')
          }
        })
      })
    }
    //获取模拟器高度折线图数据
    const getPointCloudData = (id) => {
      return new Promise((resolve, reject) => {
        let startTime = store.state.sceneModule.startSceneTime
        let endTime = store.state.sceneModule.endSeeStaticTime
        // let params = {
        //   "id": store.state.curSceneInfo.id,//场景Id
        //   "mnq": id, //模拟器Id
        //   "replayId": store.state.sceneModule.sceneReplayId//回放id
        // }
        // getSimHeightForm(params).then(res => {
        let params = {
          mnq: id, //模拟器Id
          startSceneTime: startTime,
          endSceneTime: endTime
        }
        getSimHeightFormByTimeZone(params).then((res) => {
          if (res.code == 200) {
            if (res.data.length > 0) {
              vueData.flyHeightTime =
                res.data[0].minuteInterval +
                '-' +
                res.data[res.data.length - 1].minuteInterval
              let xAxisMinInterval = [],
                yAxisData = []
              res.data.forEach((item, index) => {
                xAxisMinInterval.push(item.minuteInterval)
                yAxisData.push(item.height)
              })
              resolve({
                xMinTime: xAxisMinInterval,
                yData: yAxisData
              })
            }
          } else {
            ElMessage.warning('获取数据失败，请稍后再试！')
          }
          vueData.loadingStatus = false
        })
      })
    }
    //显示高度详情弹框
    const showHeightDetail = () => {
      vueData.flyHeightTitle = ''
      //运8模拟器飞行高度变化(2027-08-22 12:00:00)
      vueData.flyHeightTitle = `${vueData.activeName}模拟器飞行高度变化(${vueData.flyHeightTime})`
      vueData.isShowHeight = true
    }
    //关闭高度详情弹框
    const handleCloseHeight = () => {
      vueData.isShowHeight = false
    }
    return {
      ...toRefs(vueData),
      histroyLine,
      showDetail,
      handleClose,
      showHeightDetail,
      handleCloseHeight
    }
  }
}
</script>

<style lang="less" scoped>
.simulator-Information {
  color: #fff;
  width: 100%;
  height: 100%;
}

.bottom-content {
  /* height: 100%; */
  height: 45%;
  width: 100%;
  overflow: hidden;
  padding: 6px 10px;
  box-sizing: border-box;
  position: relative;
}

.top-content {
  display: flex;
  /* height: 60px; */
  height: 20%;
  width: 100%;
  overflow: hidden;
  padding: 6px 10px;
  box-sizing: border-box;
  position: relative;
}

.center-content {
  display: flex;
  height: 35%;
  /* height: 220px; */
  width: 100%;
  overflow: hidden;
  padding: 6px 10px;
  box-sizing: border-box;
  position: relative;
}

.content-all {
  flex: 1;

  :deep(.pie-echart) {
    width: 50%;
  }
}

:deep(.warning-row) {
  background-color: #132437 !important;
  color: #fff;
}

:deep(.success-row) {
  background-color: #16334f !important;
  color: #fff;
}

:deep(.el-table__header-wrapper),
:deep(.el-table tr),
:deep(.el-table thead) {
  background-color: rgba(2, 26, 70, 0.88) !important;
}

:deep(.el-table tbody tr:hover > td) {
  background-color: transparent !important;
}

:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  background: rgba(2, 26, 70, 0.88) !important;
  color: #fff;
}

:deep(.el-table thead),
:deep(.el-table th.el-table__cell) {
  color: white;
  background-color: rgba(2, 26, 70, 0.88) !important;
}

:deep(.pie-echart) {
  border: 1px solid #387ca6;
  width: 50%;
  margin-right: 6px;
}

.labelName {
  width: 80px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

:deep(.el-progress-bar__inner) {
  text-align: right;
  left: auto;
  right: 0;
  border: 1px solid #fff;
}

:deep(.progress .el-progress-bar__inner) {
  text-align: left !important;
  left: 0;
  right: auto;
  border: 1px solid #fff;
}

.progress-all {
  width: 40%;
}

.text-all {
  line-height: 32px;
}

:deep(.el-form) {
  color: #fff;
  font-size: 16px;
  margin-top: 10px;
  display: flex;

  .el-form-item__label,
  .el-form-item__label-wrap {
    color: #fff;
  }
}

:deep(.el-input__wrapper) {
  marign-right: 10px !important;
}

:deep(.el-table__empty-block) {
  background: rgba(2, 26, 70, 0.88) !important;

  .el-table__empty-text {
    color: #fff;
  }
}

:deep(.el-tabs__panel) {
  width: 80%;
}

:deep(.el-tabs__item) {
  color: #fff !important;
}

:deep(.el-tabs--left .el-tabs__nav-wrap.is-left::after) {
  width: 0;
}

:deep(.el-tabs--left .el-tabs__active-bar.is-left) {
  display: none;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff !important;
}

:deep(.el-tabs__nav-wrap) {
  padding-top: 10px;
  box-sizing: border-box;
}

:deep(.el-form-item) {
  margin-right: 10px !important;
}

.form-title-all {
  display: block;
  height: 24px;
  background: url('~@/assets/images/indicator/icon01.png');
  background-size: 100% 100%;
  padding: 0 10px;
  box-sizing: border-box;
  align-items: left;
  text-align: left;
  color: #fff;
  font-size: 16px;
  line-height: 24px;
}

.echarts-pointCloudCover {
  width: 100%;
  height: 180px !important;
  display: inline-block;
}

.echarts-detailCloudCover {
  width: 100%;
  height: 600px !important;
  display: inline-block;
}

.echarts-pie {
  width: 340px !important;
  height: 250px !important;
  // display: inline-block;
  float: right;
  margin-left: 5px;
}

.button-content {
  text-align: right;
  position: absolute;
  top: 6px;
  right: 1%;
  z-index: 11;
}

:deep(.el-overlay-dialog) {
  overflow: hidden !important;
}

:deep(.el-dialog) {
  margin: 20px auto !important;
}

.pie-title {
  position: absolute;
  right: 120px;
  top: 59px;
}
</style>
