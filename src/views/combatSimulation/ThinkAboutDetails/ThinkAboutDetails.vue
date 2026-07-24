<template>
  <div class="ThinkAboutDetails">
    <div class="navbarBox">
      <navbar :title="vueData.title"></navbar>
    </div>
    <div class="contentBox">
      <div class="title">{{ vueData.label }}</div>
      <el-row :gutter="20" justify="center" class="row-bg">
        <el-col :span="14">
          <sceneContent :sceneData="vueData.sceneData" />
        </el-col>
        <el-col :span="5">
          <div class="col-right">
            <div class="InformationBlock">
              <div class="BlockText">
                <p>信息检索</p>
              </div>
              <div class="BlockInput">
                <el-input
                  v-model="vueData.search"
                  style="width: 200px; height: 50px"
                  placeholder="请输入搜索信息内容"
                  clearable
                />
                <el-button
                  plain
                  style="
                    width: 80px;
                    height: 50px;
                    background-color: #000;
                    color: #fff;
                  "
                >
                  Search
                </el-button>
              </div>
            </div>
          </div>
          <div class="col-right">
            <div class="InformationBlock">
              <div class="BlockText">
                <p>重要目标</p>
              </div>
              <div class="BlockInput">
                <el-button :icon="Search" circle />
                <el-button :icon="Share" circle />
                <el-button :icon="InfoFilled" circle />
                <el-button :icon="TrendCharts" circle />
                <el-button :icon="BellFilled" circle />
              </div>
            </div>
          </div>
          <div class="col-right">
            <div>
              <div class="BlockText">
                <p>战术战法</p>
              </div>
              <div class="BlockInput2">
                <details>
                  <summary>
                    <div
                      style="
                        display: flex;
                        width: 100%;
                        justify-content: space-between;
                      "
                    >
                      <div>作战行动</div>
                      <div>(2)</div>
                    </div>
                  </summary>
                  <div class="tab-content">
                    <ul class="no-bullets">
                      <li class="cat-itemcm">低端廉价饱和耗能</li>
                      <li class="cat-itemcm">有人/无人协同作战</li>
                    </ul>
                  </div>
                </details>

                <details>
                  <summary>
                    <div
                      style="
                        display: flex;
                        width: 100%;
                        justify-content: space-between;
                      "
                    >
                      <div>行动方法</div>
                      <div>(4)</div>
                    </div>
                  </summary>
                  <div class="tab-content">
                    <ul class="no-bullets">
                      <li class="cat-itemcm">抵近耗能，自杀性攻击</li>
                      <li class="cat-itemcm">精准耗能，主动性攻击</li>
                      <li class="cat-itemcm">优选目标，火力毁体</li>
                      <li class="cat-itemcm">自杀性与主动性混合攻击</li>
                    </ul>
                  </div>
                </details>
                <details>
                  <summary>
                    <div
                      style="
                        display: flex;
                        width: 100%;
                        justify-content: space-between;
                      "
                    >
                      <div>作战阶段</div>
                      <div>(5)</div>
                    </div>
                  </summary>
                  <div class="tab-content">
                    <ul class="no-bullets">
                      <li class="cat-itemcm">抵近</li>
                      <li class="cat-itemcm">耗能</li>
                      <li class="cat-itemcm">自杀式攻击</li>
                      <li class="cat-itemcm">无人化侦察</li>
                      <li class="cat-itemcm">
                        有人/无人协同, 围剿剩余力量，控制要点
                      </li>
                    </ul>
                  </div>
                </details>
              </div>
            </div>
          </div>
          <div class="col-right">
            <div class="InformationBlock">
              <div class="BlockText">
                <p>标签</p>
              </div>
              <div class="BlockInput">
                <el-button style="padding: 25px 19px"> 自杀无人机 </el-button>
                <el-button style="padding: 25px 19px"> 机器狗 </el-button>
                <el-button style="padding: 25px 19px"> 空警-500 </el-button>
                <el-button style="padding: 25px 19px"> 登陆艇 </el-button>
                <el-button style="padding: 25px 19px"> XX卫星 </el-button>
                <el-button style="padding: 25px 19px"> UVA </el-button>
                <el-button style="padding: 25px 19px"> 无侦系列 </el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'
import {
  Search,
  Share,
  InfoFilled,
  TrendCharts,
  BellFilled
} from '@element-plus/icons-vue'
import navbar from './components/navbar.vue'
import sceneContent from './components/sceneContent.vue'

import sceneData from './components/hooks/sceneData.js'

const store = useStore()

const vueData = reactive({
  sceneData,
  title: '',
  label: '无人饱和攻击战想定详情',
  search: ''
})

onMounted(() => {
  vueData.title = sceneData.title
})
</script>
<style lang="less" scoped>
.ThinkAboutDetails {
  height: 100%;
  background-color: #f6f9f9;
  overflow-y: auto;

  .navbarBox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: #fff;
  }

  .contentBox {
    overflow-y: hidden;
    margin-top: 75px;
  }

  .row-bg {
    margin-right: 0 !important;
  }

  .el-button.is-circle {
    width: 40px;
    height: 40px;
  }
  .el-button + .el-button {
    margin-left: 1px;
  }
  .el-button:focus,
  .el-button:hover {
    color: #fff;
    border-color: #000;
    background-color: #000;
    outline: 0;
  }
}
.list-icon {
  position: absolute;
  top: 9%;
  left: 20px;
  font-size: 30px;
  z-index: 10;
  color: #fff;
}
.col-text {
  text-align: left;
  font-size: 32px;
  // line-height:;
  font-weight: 700;
  margin-bottom: 20px;
  padding-right: 0;
}
// }
.content-all {
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  padding-size: border-box;
}
.col-right {
  padding: 40px;
  overflow: hidden;
  margin-bottom: 40px;
  border: 2px solid #f5f5f5 !important;
  background: #fff;

  .InformationBlock {
    // display: flex;
  }
  .BlockList {
    width: 20px;
    background-color: #000;
  }
  .BlockText {
    font-size: 20px;
    margin-bottom: 0;
    line-height: 1;
    text-align: left;
    font-weight: 700;
    margin-bottom: 30px;
    border-left: 4px solid #000;
    padding-left: 15px;
  }
  .BlockInput {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 10px;
  }
}
.title {
  // text-align: left;
  text-align: center;
  width: 100%;
  display: block;
  box-sizing: border-box;
  position: relative;
  font-size: 25px;
  position: relative;
  line-height: 30px;
  font-weight: 700;
  margin: 20px 0;
}
.title-all {
  text-align: left;
  width: 100%;
  padding: 0 20px;
  display: block;
  box-sizing: border-box;
  position: relative;
  color: #fff;
  font-size: 14px;
  position: relative;
  line-height: 30px;

  span {
    position: absolute;
    top: 6px;
    right: 10px;
    width: 60px;
    color: blue;
    text-align: center;
    height: 100%;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
  }

  &:after {
    content: '';
    position: absolute;
    top: 10px;
    left: 6px;
    width: 10px;
    height: 10px;
    background: #00cbff;
    border-radius: 50%;
  }
}
.img-btn {
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 11%;
  right: 220px;
  font-size: 40px;
  z-index: 10;
  color: #fff;
}

.float-experiment {
  display: flex;
  align-items: flex-end;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 5%;
  left: 0;

  .left-shrinks {
    transform: translate(0, -8%);
    z-index: 2;
    cursor: pointer;
    width: 10px;
    font-size: 36px !important;
  }
}
.float-right {
  display: flex;
  align-items: flex-end;
  /* width: 50px; */
  height: 50px;
  position: absolute;
  top: 5%;
  right: 0;

  .left-shrinks {
    transform: rotate(180deg);
    z-index: 2;
    cursor: pointer;
    width: 10px;
    font-size: 36px !important;
  }
}
summary {
  display: flex;
  font-size: 16px;
  color: #000;
  text-align: justify;
  padding-bottom: 5px;
  border-bottom: 1px solid #e4e4e4;
  padding-top: 5px;
  float: left;
  width: 100%;
  min-height: 42px;
}

details[open] summary ~ * {
  animation: sweep 0.5s ease-in-out;
}

@keyframes sweep {
  0% {
    opacity: 0;
    margin-top: -10px;
  }

  100% {
    opacity: 1;
    margin-top: 0px;
  }
}
details {
  box-sizing: border-box;
}

details > summary::after {
  /* position: absolute; */
  /* content: '+'; */
  /* left: 20px; */
}

details[open] > summary::after {
  /* position: absolute; */
  /* content: '-'; */
  /* left: 20px; */
}

details > summary::-webkit-details-marker {
  display: none;
}
.cat-itemcm {
  font-size: 13px;
  color: #000;
  text-align: justify;
  border-bottom: 0px solid #e4e4e4a8 !important;
  padding-left: 15px;
  float: left;
  width: 100%;
  min-height: 42px;
  line-height: 40px;
}
.no-bullets {
  list-style-type: none;
}
</style>
