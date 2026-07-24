<template>
  <div class="entity-info">
    <div class="entity-info-box">
      <ul
        v-for="(item, index) in props.seriesData"
        :key="index"
        :class="
          index == props.seriesData.length - 1
            ? 'info-item last-item'
            : 'info-item'
        "
      >
        <li>
          <!--名称和线-->
          <div class="info-box">
            <div class="info-text" :style="`background:${item.color}`">
              <p class="text" @click="concealtitle(item)">
                {{ item.name }}
              </p>
              <div class="info-value">
                <div
                  class="info-value-conten"
                  v-if="state.dataList[index].value"
                >
                  <div v-for="(item_, index_) in item.info" :key="index_">
                    <div>
                      <img src="@/assets/images/indicator/icon11.png" /><span
                        class="content-time"
                        v-html="item_.time"
                      ></span>
                    </div>
                    <div class="content-description">
                      <span :style="`color:${item.color}`">
                        {{
                          item_.unitName == item_.deviceName
                            ? ''
                            : '【' + item_.unitName + '】'
                        }}
                      </span>
                      <span v-if="item.name != '匹配'"> 使用</span>
                      <span :style="`color:${item.color}`">{{
                        '【' + item_.deviceName + '】'
                      }}</span>
                      <span v-if="item.name == '探测'">发现</span>
                      <span v-if="item.name != '探测'">{{
                        item.name == '发射' ? '攻击目标' : item.name
                      }}</span>
                      <span
                        v-if="!['发射', '评估', '跟踪'].includes(item.name)"
                      >
                        {{
                          ['探测', '命中'].includes(item.name)
                            ? '目标'
                            : '本目标'
                        }}
                      </span>
                      <span
                        :style="`color:${item.color}`"
                        v-if="!['探测', '识别', '匹配'].includes(item.name)"
                      >
                        {{ '【' + item_.value + '】' }}
                      </span>
                      <span v-if="['命中', '发射'].includes(item.name)"
                        >次</span
                      >
                      <span v-if="['跟踪'].includes(item.name)">分钟</span>
                    </div>
                  </div>
                </div>
                <img
                  v-if="state.dataList[index].value"
                  class="bottomImg"
                  src="@/assets/images/indicator/icon13.png"
                />
              </div>
            </div>
            <div class="borderBox" v-if="index != props.seriesData.length - 1">
              <p class="borderStyle"></p>
              <img src="@/assets/images/indicator/icon12.png" />
              <p class="borderStyle"></p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <p class="borderStyleFinished">
      <svg
        t="1696929916016"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4193"
        id="mx_n_1696929916017"
        width="16"
        height="16"
      >
        <path
          d="M966.4 668.8l-435.2-432c-9.6-9.6-25.6-9.6-35.2 0l-441.6 432c-9.6 9.6-9.6 25.6 0 35.2 9.6 9.6 25.6 9.6 35.2 0l425.6-416 416 416c9.6 9.6 25.6 9.6 35.2 0S976 678.4 966.4 668.8z"
          p-id="4194"
          fill="#6C98BD"
        ></path>
      </svg>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  seriesData: String,
  defined: ''
})
</script>

<style lang="less" scoped>
.tree-title {
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: rgba(216, 240, 255, 0.8);
  padding: 0 0 10px 20px;
  color: red;
  line-height: 24px;
  font-size: 23px;
}

.myClassnone {
  display: none !important;
}

.entity-info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 50%;
  padding: 0 50px 20px;
  box-sizing: border-box;

  .entity-info-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
    // margin-left: 10%;
    box-sizing: border-box;

    .info-item {
      display: flex;
      align-items: center;
      // justify-content: center;
      width: 100%;
      height: 100%;

      li {
        width: 100%;
        height: 20px;

        .info-box {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          .info-text {
            display: inline-block;
            width: 100px;
            padding: 5px 0;
            box-sizing: border-box;
            border-radius: 2px;
            text-align: center;
            font-size: 14px;
            font-family: MicrosoftYaHeiSemibold;
            color: #ffffff;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: relative;
            cursor: pointer;

            .text {
              display: inline-block;
              width: 100px;
            }

            .info-value {
              color: #fff;
              font-weight: 400;
              font-size: 16px;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              width: 400px;
              height: 150px;
              position: absolute;
              right: 0.3125rem;
              bottom: 0;
              z-index: 100000;

              .info-value-conten {
                width: 100%;
                height: 100%;
                background-image: url('~@/assets/images/indicator/icon08.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                overflow: auto;
                text-align: left;
                padding: 10px;
                box-sizing: border-box;

                //滚动条样式
                &::-webkit-scrollbar {
                  width: 9px;
                  /*宽对应滚动条的尺寸*/
                  height: 9px;
                }

                /*轨道*/
                &::-webkit-scrollbar-track {
                  border-radius: 0px;
                  background: rgb(25, 72, 97);
                }

                /*滑块*/
                &::-webkit-scrollbar-thumb {
                  border: 2px solid transparent;
                  border-radius: 4px;
                  background: rgb(29, 150, 192);
                  background-clip: content-box;
                }

                .content-time {
                  font-size: 14px;
                  font-family: Digital-7Mono, Digital;
                  font-weight: normal;
                  color: #99e3ff;
                  padding-left: 5px;
                }

                .content-description {
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                }
              }

              .close {
                width: 20px;
                height: 20px;
                position: absolute;
                top: 5px;
                right: 5px;
                // color: #ffffff;
                background: url('@/assets/images/indicator/close-icon.png');
                background-image: 100% 100%;
              }

              .bottomImg {
                // flex-grow: 1;
                position: relative;
                left: -60px;
                bottom: -5px;
                max-width: 30px;
                max-height: 30px;
                cursor: pointer;
              }

              .bottomImmgfalse {
                position: relative;
                left: -60px;
                bottom: -71px;
                max-width: 30px;
                max-height: 30px;
                cursor: pointer;
              }
            }
          }

          .borderBox {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: calc(100% - 100px);
            height: 20px;

            .borderStyle {
              // padding: 0px 20%;
              // 第一种方式
              // border: 1px dashed #6c98bd;
              // height: 0px;
              // 第二种方式
              width: 40%;
              height: 2px;
              background: url('~@/assets/images/indicator/icon10.png');
            }
          }
        }
      }
    }

    .last-item {
      width: 100px;
    }
  }

  .borderStyleFinished {
    width: 94%;
    height: 90%;
    border-bottom: 1px dashed #6c98bd;
    border-right: 1px dashed #6c98bd;
    position: relative;
    border-left: 1px dashed #6c98bd;
    border-radius: 0 0 11% 11%;

    svg {
      position: absolute;
      left: -8px;
      top: -4px;
    }
  }
}
</style>
<style scoped>
.entity-info .info-item:nth-child(odd) li .info-box .info-text .info-value {
  bottom: 34px;
  left: -90px;
}

.entity-info .info-item:nth-child(even) li .info-box .info-text .info-value {
  top: 40px;
  right: -90px;
  transform: rotate(180deg);
}

.entity-info
  .info-item:nth-child(even)
  li
  .info-box
  .info-text
  .info-value
  .info-value-conten {
  transform: rotate(180deg);
  text-align: left;
  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
}

.entity-info .info-item:last-child li {
  width: 78px;
}

.entity-info
  .info-item:first-child
  li
  .info-box
  .info-text
  .info-value
  .info-value-conten {
  width: 270px;
}
</style>
