<template>
  <!-- G6不可折叠 -->
  <div class="redRadar-container">
    <div id="redRadar" ref="redRadar"></div>
  </div>
</template>

<script setup>
import G6 from '@antv/g6'
import { onMounted, reactive, nextTick, ref } from 'vue'

const state = reactive({
  data: {}, // 拓扑图数据
  graph: undefined, // new G6
  canvasWidth: 0, // 画布宽度
  canvasHeight: 0 // 画布高度
})
const redRadar = ref(null)
/**
 * 设置画布大小自适应
 */
const initSize = () => {
  // const self = this // 因为箭头函数会改变this指向，指向windows。所以先把this保存
  setTimeout(() => {
    // todo 浏览器窗口发生变化时
    window.onresize = function () {
      // todo 获取div parentContent 的宽度和高度
      state.canvasWidth = redRadar.value.scrollWidth
      state.canvasHeight = redRadar.value.scrollHeight
      // todo 修改画布的大小
      self.graph.changeSize(state.canvasWidth, state.canvasHeight)
      // todo 将图移动到画布中心位置
      self.graph.fitCenter()
    }
  }, 20)
}
/**
 * 创建G6，并对G6的一些设置
 * */
const initComponent = () => {
  state.data = {
    nodes: [
      {
        img: 'http://172.15.14.72:4042/images/hong1.png',
        id: '红方',
        label: '红方'
      },
      {
        img: 'http://172.15.14.72:4042/images/hong1.png',
        id: '空中力量',
        label: '空中力量'
      },
      {
        img: 'http://172.15.14.72:4042/images/hong1.png',
        id: '地面力量',
        label: '地面力量'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '驱逐舰2',
        label: '驱逐舰2'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '无人机4',
        label: '无人机4'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '电子战飞机2',
        label: '电子战飞机2'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '航母编队',
        label: '航母编队'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '无人机1',
        label: '无人机1'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '歼击机4',
        label: '歼击机4'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '电子战飞机1',
        label: '电子战飞机1'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '无人机2',
        label: '无人机2'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '无人机3',
        label: '无人机3'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '驱逐舰1',
        label: '驱逐舰1'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '作战飞机',
        label: '作战飞机'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '护航飞机1',
        label: '护航飞机1'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '歼击机3',
        label: '歼击机3'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '歼击机1',
        label: '歼击机1'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '歼击机2',
        label: '歼击机2'
      },
      {
        img: 'http://172.15.14.72:4042/images/1.png',
        id: '护航飞机2',
        label: '护航飞机2'
      }
    ],
    edges: [
      {
        source: '红方',
        target: '空中力量'
      },
      {
        source: '红方',
        target: '地面力量'
      },
      {
        source: '地面力量',
        target: '驱逐舰2'
      },
      {
        source: '空中力量',
        target: '无人机4'
      },
      {
        source: '空中力量',
        target: '电子战飞机2'
      },
      {
        source: '地面力量',
        target: '航母编队'
      },
      {
        source: '空中力量',
        target: '无人机1'
      },
      {
        source: '空中力量',
        target: '歼击机4'
      },
      {
        source: '空中力量',
        target: '电子战飞机1'
      },
      {
        source: '空中力量',
        target: '无人机2'
      },
      {
        source: '空中力量',
        target: '无人机3'
      },
      {
        source: '地面力量',
        target: '驱逐舰1'
      },
      {
        source: '空中力量',
        target: '作战飞机'
      },
      {
        source: '空中力量',
        target: '护航飞机1'
      },
      {
        source: '空中力量',
        target: '歼击机3'
      },
      {
        source: '空中力量',
        target: '歼击机1'
      },
      {
        source: '空中力量',
        target: '歼击机2'
      },
      {
        source: '空中力量',
        target: '护航飞机2'
      }
    ]
  }
  // todo 初始化画布宽高为div parentContent 的宽度和高度
  // console.log(redRadar.value,'vvvvvv')
  // console.log(document.getElementById('redRadar'), 'vvvvvv')
  // console.log(document.getElementById('redRadar').width, 'vvvvvv')
  // console.log(redRadar.value.offsetWidth, 'vvvvvv')
  state.canvasWidth = redRadar.value.offsetWidth
  state.canvasHeight = redRadar.value.offsetHeight
  state.graph = new G6.Graph({
    container: 'redRadar',
    width: state.canvasWidth,
    height: state.canvasHeight,
    fitView: true,
    linkCenter: true,
    // plugins: [tooltip], // 配置 Tooltip 插件
    modes: {
      default: ['drag-canvas', 'zoom-canvas', 'drag-node'] // 允许拖拽画布、放缩画布、拖拽节点
    },
    layout: {
      // 类型  总共三种：径向：radial   有向分层：dagre     力导：force
      type: 'dagre',
      // 'LR'：从左至右布局；
      rankdir: 'LR' // 可选可选值：'TB' | 'BT' | 'LR' | 'RL'，默认为图的中心 TB
    },
    defaultNode: {
      // 节点样式修改
      type: 'image', // 设置节点为图片
      size: [60, 60], // 节点大小
      labelCfg: {
        // 修改节点label样式
        style: {
          fill: '#fff', // 字体颜色
          fontSize: 14 // 字体大小
        }
      }
    }
  })
  // 接收数据并渲染
  state.graph.data(state.data)
  state.graph.render()
  /**
   * 更新节点数据<我这边例子是取第一个节点的数据进行更新，因为我的数据是前端写的假数据，不是实时更新的>
   * 如果真的在项目中，数据是实时更新的，可以在watch中写这段代码，通过for循环对数据进行遍历更新，大致代码如下，如果不正常的话适当微调即可
   * watch: {
'this.data.nodes'(val, oldVal) {
  if(val) {
      const that = this
    val.forEach(function(value, index, array) {
      const el = that.graph.findById(value.id)
      console.log('model', el._cfg.model)
      console.log('value', value)
      el._cfg.model.id = value.id
      el._cfg.model.label = value.label
      el._cfg.model.ip= value.ip
      el._cfg.model.status= value.status
      if (value.status == 1) { /
        el._cfg.model.img = '.....'
      }
      if (value.status == 0) {
        el._cfg.model.img = '.....'
      }
      that.graph.refreshItem(el)
    })
  }
  }
},
   */
  // const el = this.graph.findById(this.data.nodes[0].id)
  // console.log('model', el)
  // el._cfg.model.label = '哈哈哈，我变成了可爱的小奶龙'
  // el._cfg.model.ip = '192.168.....'
  // el._cfg.model.status = 4
  // el._cfg.model.img = 'https://img1.baidu.com/it/u=1049473449,988642504&fm=253&fmt=auto&app=120&f=JPEG?w=328&h=328'
  // this.graph.refreshItem(el)
}
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      initComponent()
      initSize()
    }, 200)
  })
})
</script>

<style lang="less" scoped>
.redRadar-container {
  // width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #f53730;

  #redRadar {
    width: 15vw;
    height: calc(44vh - 80px);
  }
}
</style>
