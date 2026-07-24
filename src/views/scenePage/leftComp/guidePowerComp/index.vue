<template>
  <div>
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <img
        v-show="!vueData.leftShow"
        class="left-shrink-guidePowerComp"
        :src="
          vueData.leftShow
            ? require('@/assets/image/panelIcons/telescoping.png')
            : require('@/assets/image/panelIcons/telescoping_1.png')
        "
        @click="leftContentShow"
      />
    </Transition>
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__backInLeft"
      leave-active-class="animate__animated animate__backOutLeft"
    >
      <div class="menuPanel-guidePowerComp" v-show="vueData.leftShow">
        <img
          class="content-img"
          :src="
            vueData.leftShow
              ? require('@/assets/image/panelIcons/telescoping.png')
              : require('@/assets/image/panelIcons/telescoping_1.png')
          "
          @click="leftContentShow"
        />
        <ul class="leftMenu-item">
          <li>兵力列表</li>
        </ul>
        <div class="LLBC">
          <div class="BL-content-box">
            <el-scrollbar style="height: 100%">
              <div class="LLBC-box LLBC-red">
                <div
                  class="boxStyle"
                  v-for="(item, index) in vueData.redList"
                  :key="index"
                >
                  <p>{{ item.k_name }}(装备数量：{{ item.num }})</p>
                  <div class="blInfo">
                    <div
                      v-for="(itemc, itemi) in item.children"
                      :key="itemi"
                      style="width: 50%"
                    >
                      <div>{{ itemc.name }}:{{ itemc.num }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="LLBC-box LLBC-blue">
                <div
                  class="boxStyle"
                  v-for="(item, index) in vueData.blueList"
                  :key="index"
                >
                  <p>{{ item.k_name }}(装备数量：{{ item.num }})</p>
                  <div class="blInfo">
                    <div v-for="(itemc, itemi) in item.children" :key="itemi">
                      <div>{{ itemc.name }}:{{ itemc.num }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { reactive, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import emitter from '@/utils/eventbus'

const store = useStore()
const props = defineProps({})
let vueData = reactive({
  redData: [],
  blueData: [],
  defaultProps: {
    children: 'children',
    label: 'name'
  },
  llbc: [
    {
      name: '红方',
      side: 'red',
      children: [
        {
          name: '红方力量',
          children: []
        }
      ]
    },
    {
      name: '蓝方',
      side: 'blue',
      children: [
        {
          name: '蓝方力量',
          children: []
        }
      ]
    }
  ],
  selectItem: null, //选中的节点数据
  leftShow: true, // 左侧伸缩关闭按钮
  node: {
    data: {
      position: {
        z: 0
      }
    }
  },
  side: '',
  curNodeData: null,
  showRightMenu: false, // 快捷菜单显隐
  rightMenuList: [{ name: '删除' }], // 快捷菜单列表
  rightMenuStyle: {}, // 快捷菜单样式
  showTargentConfig: false,
  showBLconfig: false,
  treeJson: {},
  treelistblue: [],
  treelistred: [],
  platFormMap: {},
  redList: [],
  blueList: [],
  lindex: undefined,
  dindex: undefined
})

const setPlatFromMap = () => {
  axios
    .get(`${serverUrls.platformUrl}/uploadplatformMap.txt`, {
      responseType: 'text'
    })
    .then((res) => {
      if (res.status == 200) {
        vueData.platFormMap = JSON.parse(res.data)
        pushItem() // 接收到消息之后处理并push到数组中
        sortList() // 数组排序
        setName() // 修改名称(空中装备等)
        concatLD() // 合并陆和地类型
        setName() // 修改名称(空中装备等)  重新调用一次为了合并完之后重新计数
      }
    })
}

const pushItem = () => {
  let data_ = {
    Data: {
      Platforms: [
        {
          Id: 1,
          Name: '10_soc_cmdr',
          WeaponQ: 0
        },
        {
          Id: 12,
          Name: '10_iads_cmdr',
          WeaponQ: 0
        },
        {
          Id: 22,
          Name: '100_radar_company',
          WeaponQ: 0
        },
        {
          Id: 32,
          Name: '200_ew_radar',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 45,
          Name: '300_ew_radar',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 58,
          Name: '3500_large_sam_battalion',
          WeaponQ: 0
        },
        {
          Id: 68,
          Name: '3510_acq_radar',
          Sensors: [
            {
              CMN: 'default',
              Name: 'acq_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 81,
          Name: '3520_large_sam_ttr',
          Sensors: [
            {
              CMN: 'ACQUIRE',
              Name: 'ttr',
              ON: false
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 96,
          Name: '3530_large_sam_launcher',
          WeaponQ: 4
        },
        {
          Id: 107,
          Name: '3540_large_sam_launcher',
          WeaponQ: 4
        },
        {
          Id: 118,
          Name: '3550_large_sam_launcher',
          WeaponQ: 4
        },
        {
          Id: 129,
          Name: '10_gci_cmdr',
          WeaponQ: 0
        },
        {
          Id: 140,
          Name: 'flight_lead_north',
          WeaponQ: 0
        },
        {
          FuelMaxQ: 6350.293242934187,
          FuelQ: 6302.66806935574,
          Id: 151,
          Name: 'cap_north_1',
          Sensors: [
            {
              CMN: 'default',
              Name: 'geo_sensor',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          FuelMaxQ: 6350.293242934187,
          FuelQ: 6302.668069355736,
          Id: 162,
          Name: 'cap_north_2',
          Sensors: [
            {
              CMN: 'default',
              Name: 'geo_sensor',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 173,
          Name: 'flight_lead_south',
          WeaponQ: 0
        },
        {
          FuelMaxQ: 6350.293242934187,
          FuelQ: 2120.6309456733845,
          Id: 184,
          Name: 'cap_south_1',
          Sensors: [
            {
              CMN: 'default',
              Name: 'geo_sensor',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          FuelMaxQ: 6350.293242934187,
          FuelQ: 6302.723773550773,
          Id: 201,
          Name: 'cap_south_2',
          Sensors: [
            {
              CMN: 'default',
              Name: 'geo_sensor',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 218,
          Name: 'target_1',
          WeaponQ: 0
        },
        {
          Id: 220,
          Name: 'target_2',
          WeaponQ: 0
        },
        {
          Id: 222,
          Name: 'ss-uav_1',
          WeaponQ: 51
        },
        {
          Id: 236,
          Name: 'ss-uav_2',
          WeaponQ: 51
        },
        {
          Id: 250,
          Name: 'kvd-001_1',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'laser_designator',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 271,
          Name: 'z-10_1',
          Sensors: [
            {
              CMN: 'TRACK',
              Name: 'laser_tracker',
              ON: true
            }
          ],
          WeaponQ: 16
        },
        {
          Id: 285,
          Name: 'kvd-001_2',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'laser_designator',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 306,
          Name: 'z-10_2',
          Sensors: [
            {
              CMN: 'TRACK',
              Name: 'laser_tracker',
              ON: true
            }
          ],
          WeaponQ: 16
        },
        {
          Id: 320,
          Name: 'kvd-001_3',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'laser_designator',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 341,
          Name: 'z-10_3',
          Sensors: [
            {
              CMN: 'TRACK',
              Name: 'laser_tracker',
              ON: true
            }
          ],
          WeaponQ: 16
        },
        {
          Id: 355,
          Name: 'kvd-001_4',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'laser_designator',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 376,
          Name: 'z-10_4',
          Sensors: [
            {
              CMN: 'TRACK',
              Name: 'laser_tracker',
              ON: true
            }
          ],
          WeaponQ: 16
        },
        {
          Id: 390,
          Name: 'wz-7_1',
          Sensors: [
            {
              CMN: 'default',
              Name: 'rwr',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            }
          ],
          WeaponQ: 4
        },
        {
          Id: 421,
          Name: 'wz-7_2',
          Sensors: [
            {
              CMN: 'default',
              Name: 'rwr',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            }
          ],
          WeaponQ: 4
        },
        {
          Id: 452,
          Name: 'wz-7_3',
          Sensors: [
            {
              CMN: 'default',
              Name: 'rwr',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            }
          ],
          WeaponQ: 4
        },
        {
          Id: 483,
          Name: 'wz-7_4',
          Sensors: [
            {
              CMN: 'default',
              Name: 'rwr',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            }
          ],
          WeaponQ: 4
        },
        {
          Id: 514,
          Name: 'wz-8_1',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 530,
          Name: 'wz-8_2',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 546,
          Name: 'wz-8_3',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 562,
          Name: 'wz-8_4',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'sar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 578,
          Name: 'wz-10_1',
          Sensors: [
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 595,
          Name: 'wz-10_2',
          Sensors: [
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 612,
          Name: 'wz-10_3',
          Sensors: [
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 629,
          Name: 'wz-10_4',
          Sensors: [
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 646,
          Name: 'gj-2_1',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: false
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 666,
          Name: 'gj-2_2',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: false
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 686,
          Name: 'gj-2_3',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: false
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 706,
          Name: 'gj-2_4',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: false
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 726,
          Name: 'gj-11_1',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 8
        },
        {
          Id: 746,
          Name: 'gj-11_2',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 8
        },
        {
          Id: 766,
          Name: 'gj-11_3',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 8
        },
        {
          Id: 786,
          Name: 'gj-11_4',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 8
        },
        {
          Id: 806,
          Name: 'gj-2_5',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: false
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 826,
          Name: 'gj-2_6',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: false
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 846,
          Name: 'gj-2_7',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: false
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 866,
          Name: 'gj-2_8',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: false
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 6
        },
        {
          Id: 886,
          Name: 'gj-11_5',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 8
        },
        {
          Id: 906,
          Name: 'gj-11_6',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 8
        },
        {
          Id: 926,
          Name: 'gj-11_7',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 8
        },
        {
          Id: 946,
          Name: 'gj-11_8',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 8
        },
        {
          Id: 966,
          Name: 'YAOGAN',
          Sensors: [
            {
              CMN: 'default',
              Name: 'opt_sensor',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 979,
          Name: 'dmz_1',
          WeaponQ: 0
        },
        {
          Id: 988,
          Name: 'KJ-500',
          WeaponQ: 0
        },
        {
          Id: 1000,
          Name: 'hsu-001lduuv__1',
          WeaponQ: 0
        },
        {
          Id: 1003,
          Name: 'hsu-001lduuv__2',
          WeaponQ: 0
        },
        {
          Id: 1006,
          Name: 'hsu-001lduuv__3',
          WeaponQ: 0
        },
        {
          Id: 1009,
          Name: 'hsu-001lduuv__4',
          WeaponQ: 0
        },
        {
          Id: 1012,
          Name: 'hsu-001lduuv__5',
          WeaponQ: 0
        },
        {
          Id: 1015,
          Name: 'hsu-001lduuv__6',
          WeaponQ: 0
        },
        {
          Id: 1018,
          Name: 'hsu-001lduuv__7',
          WeaponQ: 0
        },
        {
          Id: 1021,
          Name: 'hsu-001lduuv__8',
          WeaponQ: 0
        },
        {
          Id: 1024,
          Name: 'hsu-001lduuv__9',
          WeaponQ: 0
        },
        {
          Id: 1027,
          Name: 'Hawk1',
          WeaponQ: 3
        },
        {
          Id: 1038,
          Name: 'Hawk_Radar1',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 1050,
          Name: 'Hawk2',
          WeaponQ: 3
        },
        {
          Id: 1061,
          Name: 'Hawk_Radar2',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 1073,
          Name: 'Hawk3',
          WeaponQ: 3
        },
        {
          Id: 1084,
          Name: 'Hawk_Radar3',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 1096,
          Name: 'Hawk4',
          WeaponQ: 3
        },
        {
          Id: 1107,
          Name: 'Hawk_Radar4',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 1119,
          Name: 'Hawk5',
          WeaponQ: 3
        },
        {
          Id: 1130,
          Name: 'Hawk_Radar5',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 1142,
          Name: 'hawk__6',
          WeaponQ: 3
        },
        {
          Id: 1153,
          Name: 'Hawk_Radar6',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 1165,
          Name: 'Hawk7',
          WeaponQ: 3
        },
        {
          Id: 1176,
          Name: 'Hawk_Radar7',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 1188,
          Name: 'hawk__8',
          WeaponQ: 3
        },
        {
          Id: 1199,
          Name: 'Hawk_Radar8',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 1211,
          Name: 'hawk__9',
          WeaponQ: 3
        },
        {
          Id: 1222,
          Name: 'Hawk_Radar9',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 1234,
          Name: 'Hawk10',
          WeaponQ: 3
        },
        {
          Id: 1245,
          Name: 'Hawk_Radar10',
          Sensors: [
            {
              CMN: 'default',
              Name: 'ew_radar',
              ON: true
            }
          ],
          WeaponQ: 0
        },
        {
          Id: 1257,
          Name: '003__1',
          WeaponQ: 0
        },
        {
          Id: 1260,
          Name: '071__1',
          WeaponQ: 0
        },
        {
          Id: 1263,
          Name: '071__2',
          WeaponQ: 0
        },
        {
          Id: 1266,
          Name: '076lha__1',
          WeaponQ: 0
        },
        {
          Id: 1276,
          Name: 'NimitzCarrier_1',
          WeaponQ: 0
        },
        {
          Id: 1279,
          Name: 'Burke_1',
          WeaponQ: 0
        },
        {
          Id: 1283,
          Name: 'BlueArtillery1',
          Sensors: [
            {
              CMN: 'default',
              Name: 'Eyes',
              ON: true
            }
          ],
          WeaponQ: 42
        },
        {
          Id: 1289,
          Name: 'BlueArtillery2',
          Sensors: [
            {
              CMN: 'default',
              Name: 'Eyes',
              ON: true
            }
          ],
          WeaponQ: 42
        },
        {
          Id: 1295,
          Name: 'BlueArtillery3',
          Sensors: [
            {
              CMN: 'default',
              Name: 'Eyes',
              ON: true
            }
          ],
          WeaponQ: 42
        },
        {
          Id: 1301,
          Name: 'BlueArtillery4',
          Sensors: [
            {
              CMN: 'default',
              Name: 'Eyes',
              ON: true
            }
          ],
          WeaponQ: 42
        },
        {
          Id: 1309,
          Name: 'gj-11__101',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: true
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: true
            }
          ],
          WeaponQ: 8
        },
        {
          Id: 1330,
          Name: 'gj-11__102',
          Sensors: [
            {
              CMN: 'default',
              Name: 'radar',
              ON: false
            },
            {
              CMN: 'default',
              Name: 'IR',
              ON: false
            },
            {
              CMN: 'default',
              Name: 'ccd',
              ON: false
            }
          ],
          WeaponQ: 8
        }
      ],
      T: 15
    },
    Type: 'Statistics'
  }
  data_.Data.Platforms.forEach((item) => {
    for (let i in vueData.platFormMap) {
      if (item.Name == i) {
        let bl = vueData.platFormMap[i]
        if (bl.camp == 'red') {
          if (vueData.redList.length == 0) {
            let obj = {
              name: bl.domain,
              num: 1,
              children: [{ name: bl.kinds, num: 1 }]
            }
            vueData.redList.push(obj)
          } else {
            let do_flag = false
            let do_index = 0
            let c_flag = false
            let c_index = 0
            vueData.redList.forEach((item, index) => {
              if (bl.domain == item.name) {
                do_flag = true
                do_index = index
              }
            })
            if (do_flag) {
              vueData.redList[do_index].children.forEach(
                (item_child, index_child) => {
                  if (item_child.name == bl.kinds) {
                    c_flag = true
                    c_index = index_child
                  }
                }
              )
              if (c_flag) {
                vueData.redList[do_index].children[c_index].num++
              } else {
                let obj = { name: bl.kinds, num: 1 }
                vueData.redList[do_index].children.push(obj)
              }
            } else {
              let obj = {
                name: bl.domain,
                num: 1,
                children: [{ name: bl.kinds, num: 1 }]
              }
              vueData.redList.push(obj)
            }
          }
        } else if (bl.camp == 'blue') {
          if (vueData.blueList.length == 0) {
            let obj = {
              name: bl.domain,
              num: 1,
              children: [{ name: bl.kinds, num: 1 }]
            }
            vueData.blueList.push(obj)
          } else {
            let do_flag = false
            let do_index = 0
            let c_flag = false
            let c_index = 0
            vueData.blueList.forEach((item, index) => {
              if (bl.domain == item.name) {
                do_flag = true
                do_index = index
              }
            })
            if (do_flag) {
              vueData.blueList[do_index].children.forEach(
                (item_child, index_child) => {
                  if (item_child.name == bl.kinds) {
                    c_flag = true
                    c_index = index_child
                  }
                }
              )
              if (c_flag) {
                vueData.blueList[do_index].children[c_index].num++
              } else {
                let obj = { name: bl.kinds, num: 1 }
                vueData.blueList[do_index].children.push(obj)
              }
            } else {
              let obj = {
                name: bl.domain,
                num: 1,
                children: [{ name: bl.kinds, num: 1 }]
              }
              vueData.blueList.push(obj)
            }
          }
        }
      }
    }
  })
}
const sortList = () => {
  const arr = ['空', '天', '陆', '地', '海', '电']
  // 创建一个空数组来存放排序后的结果
  const sortedArray_blue = []
  const sortedArray_red = []
  // 按照自定义顺序将元素添加到新数组中
  for (const name of arr) {
    const item = vueData.redList.find((obj) => obj.name === name)
    if (item) {
      sortedArray_red.push(item)
    }
  }
  for (const name of arr) {
    const item = vueData.blueList.find((obj) => obj.name === name)
    if (item) {
      sortedArray_blue.push(item)
    }
  }
  vueData.redList = sortedArray_red
  vueData.blueList = sortedArray_blue
}
const setName = () => {
  vueData.blueList.forEach((item, index) => {
    let num = 0
    item.children.forEach((itemc) => {
      num += itemc.num
    })
    item.num = num
    if (item.name == '空') {
      item.k_name = '空中装备'
    } else if (item.name == '天') {
      item.k_name = '航天装备'
    } else if (item.name == '陆') {
      item.k_name = '地面装备'
    } else if (item.name == '地') {
      item.k_name = '地面装备'
    } else if (item.name == '海') {
      item.k_name = '海上装备'
    } else if (item.name == '电') {
      item.k_name = '电磁装备'
    }
  })
  vueData.redList.forEach((item) => {
    let num = 0
    item.children.forEach((itemc) => {
      num += itemc.num
    })
    item.num = num
    if (item.name == '空') {
      item.k_name = '空中装备'
    } else if (item.name == '天') {
      item.k_name = '航天装备'
    } else if (item.name == '陆') {
      item.k_name = '地面装备'
    } else if (item.name == '地') {
      item.k_name = '地面装备'
    } else if (item.name == '海') {
      item.k_name = '海上装备'
    } else if (item.name == '电') {
      item.k_name = '电磁装备'
    }
  })
}
const concatLD = () => {
  let obj = {}
  vueData.blueList.forEach((item, index) => {
    if (item.k_name == '地面装备') {
      obj = item
      let obj1 = vueData.blueList[index + 1]
      if (obj1.k_name == '地面装备') {
        const mergedArray = [...obj.children, ...obj1.children].reduce(
          (acc, current) => {
            const found = acc.find((item) => item.name === current.name)
            if (found) {
              found.num += current.num
            } else {
              acc.push(current)
            }
            return acc
          },
          []
        )
        obj.children = mergedArray
      }
      vueData.blueList.splice(index + 1, 1)
    }
  })
  console.log('vueData.blueList', vueData.blueList)
}
// 控制伸缩按钮
const leftContentShow = () => {
  vueData.leftShow = !vueData.leftShow
}
onMounted(() => {
  setPlatFromMap()
})
onUnmounted(() => {})
</script>
<style lang="less" scoped>
.left-shrink-guidePowerComp {
  position: fixed;
  top: calc(50% - 31.5px);
  left: 0;
  cursor: pointer;
  width: 20px;
  font-size: 36px !important;
}

.menuPanel-guidePowerComp {
  border-width: 0px;
  position: fixed;
  left: 0px;
  top: 15%;
  width: 350px;
  height: 810px;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;

  .content-img {
    position: absolute;
    right: -5%;
    top: calc(50% - 31.5px);
    z-index: 2;
    cursor: pointer;
    font-size: 36px !important;
  }

  .leftMenu-item {
    font-size: 20px;
    list-style: none;
    text-align: left;
    margin: 0;
    padding: 0 0 0 20px;
    height: 50px;
    line-height: 50px;
    color: #ffffff;
    cursor: pointer;
    border-bottom: 1px solid #0b3855;
  }

  .LLBC {
    box-sizing: content-box;
    position: fixed;
    width: 350px;
    padding: 10px;
    box-sizing: border-box;
    height: 760px;

    .BL-content-box {
      height: 100%;
    }

    .topBtn-box {
      align-items: center;
      display: flex;
      justify-content: end;

      .top-btn {
        background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
        width: 83px;
        height: 33px;
        color: #ffff;
        border-radius: 5px;
        margin-left: 10px;
        line-height: 33px;
        cursor: pointer;
      }
    }

    .node-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;

      .iconBox {
        padding: 0 2px;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }

    .LLBC-box {
      padding: 10px 6px;
      box-sizing: border-box;
      margin-bottom: 10px;

      .boxStyle {
        height: 100px;
        position: relative;
        border: 1px solid #2e4b64;
        margin: 20px 10px;
        padding: 10px;
        box-sizing: border-box;

        p {
          position: absolute;
          left: 10px;
          top: -28px;
          color: #fff;
          font-size: 15px !important;
        }

        .blInfo {
          text-align: left;
          color: #fff;
          font-size: 13px;
          padding-left: 20px;
          height: 100%;
          overflow: auto;

          span {
            margin-right: 20px;
          }
        }
      }

      .LLBC-item {
        text-align: left;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .utilsBTN_box {
          img {
            width: 26px;
          }
        }

        span {
          padding: 0 5px;
        }
      }

      :deep(.el-tree) {
        background: transparent;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 700;
        font-style: normal;
        font-size: 13px;
        letter-spacing: normal;
        color: #ffffff;
      }
    }

    .LLBC-red {
      background-color: rgba(65, 27, 42, 1);
      border: 1px solid rgba(200, 8, 13, 1);

      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(161, 45, 45, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgba(200, 8, 13, 0.8);
        }
      }
    }

    .LLBC-blue {
      background-color: rgba(16, 55, 91, 1);
      border: 1px solid rgba(9, 110, 180, 1);

      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(8, 165, 239, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgba(9, 110, 180, 1);
        }
      }
    }

    .LLBC-green {
      background-color: rgb(0, 63, 5);
      border: 1px solid rgb(9, 180, 9);

      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(62, 239, 8, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgb(23, 180, 9);
        }
      }
    }

    .LLBC-orange {
      background-color: rgb(91, 65, 16);
      border: 1px solid rgb(180, 120, 9);

      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(239, 177, 8, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgb(180, 134, 9);
        }
      }
    }

    .LLBC-yellow {
      background-color: rgb(69, 91, 16);
      border: 1px solid rgb(163, 180, 9);

      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(197, 239, 8, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgb(154, 180, 9);
        }
      }
    }

    .LLBC-purple {
      background-color: rgb(48, 5, 59);
      border: 1px solid rgb(146, 9, 180);

      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(200, 8, 239, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgb(180, 9, 180);
        }
      }
    }

    .createCamp_box {
      position: fixed;
      left: 50%;
      top: 50%;
      width: 300px;
      height: 160px;
      margin-left: -150px;
      margin-top: -150px;
      background-color: rgba(8, 36, 62, 0.7);

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid #0b3855;
      }

      .content {
        height: calc(100% - 64px);
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}

.right_menu {
  width: 150px;
  background: #1f436d;
  border-radius: 5px;
  text-align: left;
  padding: 10px 5px;

  ul {
    margin: 0;
    padding: 0;

    li {
      font-size: 14px;
      padding: 10px 15px;
      color: #fff;
    }

    li:hover {
      font-size: 14px;
      padding: 10px 15px;
      background: #006eb1;
      color: #fff;
    }
  }
}
</style>
