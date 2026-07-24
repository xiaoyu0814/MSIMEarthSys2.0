<template>
  <div class="task-feedback">
    <div class="feedback-container">
      <div class="content-title">蓝方干扰机</div>
      <div class="content-img">
        <img
          src="@/assets/image/jammer/雷达受干扰.jpg"
          alt=""
          style="width: 92%; height: 98%"
        />
      </div>
      <div class="content-desc">
        <div class="background-title">
          <div class="cicrle"></div>
          状态描述
        </div>
        <div class="background-content">
          <div class="content-main">
            <div class="content-text">蓝方干扰机关闭干扰雷达</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.task-feedback {
  position: absolute;
  left: 2%;
  top: 12%;
  // transform: translate(-50%, 0%);

  width: 500px;
  color: #eee;
  background: url('@/assets/image/panelIcons/背景.png') no-repeat;
  background-size: 100% 100%;
  border: 1px solid rgba(117, 252, 255, 0.8);
  border-radius: 4px;
  backdrop-filter: blur(1px);
  .feedback-container {
    // padding: 15px;
    // height: 97%;
    // width: 100%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    display: flex;
    flex-direction: column;
    .content-title {
      background: url('@/assets/image/panelIcons/title-bg3.png') no-repeat;
      background-size: 100.1% 48px;
      height: 40px;
      line-height: 48px;
      font-size: 25px;
      color: #ffffff;
      letter-spacing: 2.4px;
      font-weight: 400;
      text-align: left;
      padding-left: 50px;
    }
    .content-img {
      width: 100%;
      height: 200px;
    }
    .content-desc {
      .background-title {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        padding-left: 20px;
        height: 35px;
        position: relative;
        display: flex;
        align-items: center;

        &::after {
          content: '';
          position: absolute;
          height: 2px;
          width: 40%;
          background-image: linear-gradient(45deg, #48edff, transparent);
          bottom: 0px;
          left: 19px;
        }

        .cicrle {
          background: #80fbff;
          border: 3.5px solid rgba(128, 251, 255, 1);
          box-shadow: 0px 2px 3px 1px rgba(0, 0, 0, 0.3);
          box-shadow: 0px 0px 6px 1px rgba(0, 255, 245, 0.75);
          margin-right: 12px;
        }
      }

      .background-content {
        width: calc(97% - 40px);
        padding: 10px;
        margin: 10px auto;
        background: rgba(0, 231, 255, 0.1);
        border: 1px solid rgba(0, 231, 255, 0.4);
        text-align: left;
        font-size: 20px;
        letter-spacing: 3px;
        text-indent: 2em;

        .content-main {
          // height: 150px;
          padding: 10px;
          // overflow: auto;

          .content-text {
            color: rgba(0, 231, 255, 1);
            transition: color ease-out 0.3s, text-shadow ease-out 0.3s;
            text-shadow: 0 0 1rem #0cf;
            text-indent: 2em;
            word-wrap: break-word;
          }

          /*滚动条高宽度*/
          &::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }

          /*滚动条滑块*/
          &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: rgba(48, 50, 53, 0.7);
          }

          /*滚动条里面轨道*/
          &::-webkit-scrollbar-track {
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
          }

          /*滚动条的小边角*/
          &::-webkit-scrollbar-corner {
            background: transparent;
          }
        }

        .content-detail {
          width: 100%;
          height: 100px;
          // padding-top: 10px;
          font-size: 18px;
          display: flex;
          flex-direction: column;

          .task-time {
            // width: 50%;
            height: 100%;
            display: flex;
            text-indent: initial;

            .time-img {
              width: 10%;
              height: 100%;
              background: url('~@/assets/image/panelIcons/任务时间.png')
                no-repeat;
              background-size: 100%;
              margin-right: 10px;
              background-position: center;
            }

            .time-content {
              width: 85%;
              height: 100%;

              .time-title {
                color: rgba(196, 255, 255, 1);
              }

              .time-main {
                color: rgba(0, 231, 255, 1);
              }
            }
          }

          .task-area {
            // width: 50%;
            height: 100%;
            display: flex;
            text-indent: initial;

            .area-img {
              width: 10%;
              height: 100%;
              background: url('~@/assets/image/panelIcons/任务区域.png')
                no-repeat;
              background-size: 100%;
              background-position: center;
              margin-right: 10px;
            }

            .area-content {
              width: 85%;
              height: 100%;

              .area-title {
                color: rgba(196, 255, 255, 1);
              }

              .area-main {
                color: rgba(0, 231, 255, 1);
              }
            }
          }
        }
      }
    }
  }
}
</style>
