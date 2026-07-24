<template>
  <div
    class="list-carousel animate__animated animate__bounceInUp animate__delay-40s"
  >
    <swiper
      ref="swiperRef"
      :navigation="navigation"
      :pagination="{ clickable: true }"
      :autoplay="true"
      :loop="true"
      :space-between="30"
      :slides-per-view="4"
    >
      <swiper-slide
        v-for="(item, index) in state.accidentList"
        @click="changeCarousel(index)"
      >
        <div class="norem-swiper-item">
          <img :src="item.image" alt="" srcset="" style="width: 100%" />
        </div>
      </swiper-slide>
    </swiper>
    <div
      class="swiper-button-prev"
      slot="button-prev"
      @click.stop="prevEl(item, index)"
    ></div>
    <!--左箭头。如果放置在swiper外面，需要自定义样式。-->
    <div
      class="swiper-button-next"
      slot="button-next"
      @click.stop="nextEl"
    ></div>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps } from 'vue'
import 'swiper/swiper-bundle.css'
/**js**/
//第一步-导入swiper组件
import { Swiper, SwiperSlide } from 'swiper/vue'
//第二步-导入插件
import SwiperCore, { Pagination, Autoplay, Navigation } from 'swiper'
//第三步-使用插件（同时在模板中swiper标签使用）
SwiperCore.use([Pagination, Autoplay, Navigation])

const props = defineProps(['accidentList'])
const state = reactive({
  accidentList: props.accidentList
})
const navigation = ref({
  nextEl: '.swiper-button-next',
  prevEl: '.swiper-button-prev'
})
const swiperRef = ref(null)

const prevEl = () => {
  swiperRef.value.slidePrev()
}
const nextEl = () => {
  swiperRef.value.slideNext()
}
</script>

<style lang="less" scoped>
.list-carousel {
  .norem-swiper-item {
    // background: rgba(8, 36, 41, 0.7);
    // margin: 10px;
    // border-radius: 10px;
    width: 99%;
    // height: 300px;
    background: rgba(7, 8, 11, 0.6);
    box-shadow: 0 12px 12px 0 rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(117, 252, 255, 0.8);
    // border-top: transparent;
    border-radius: 4px;
    backdrop-filter: blur(1px);
    animation: zoomIn 0.4s;
    // margin-bottom: 1.5vh;

    .carousel-image {
      border-radius: 10px 10px 0 0;
    }

    .carousel-describe {
      height: calc(100% - 140px);
      color: #5ab5ca;
      text-indent: 2em;
      text-align: left;
      font-size: 16px;
      padding: 5px;
      overflow: auto;
    }
  }

  .swiper-button-next {
    right: -30px;
  }

  .swiper-button-prev {
    left: -30px;
  }
}

.norem-list-video {
  width: 400px;
  height: 300px;
  position: fixed;
  left: 1%;
  bottom: 10%;
  border-radius: 10px;

  video {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
}

.norem-list-introduce {
  width: 400px;
  position: absolute;
  right: 5%;
  top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: rgba(8, 36, 41, 0.7);
  border-radius: 10px;
  overflow: hidden;

  .panel-container {
    width: 100%;
    height: 100%;
    border: 1.5px solid;
    border-image: linear-gradient(
        270deg,
        rgba(255, 255, 255, 1),
        rgba(255, 255, 255, 0.4)
      )
      1 1;
    box-sizing: border-box;
    overflow: hidden;

    .container-title {
      height: 40px;
      width: 100%;
      background: url('@/assets/image/header/头.png');
      background-size: 100% 100%;
      text-align: left;
      color: white;
      font-size: 23px;
      font-weight: 500;

      .title-span {
        display: flex;
        align-items: center;
        height: 100%;
        margin: auto 20px;
        font-family: PangMenZhengDao;
        // padding: 8px 15px;
      }
    }

    .container-image {
      height: 200px;
      width: 92%;
      margin: 15px auto;
    }

    .container-describe {
      color: #5ab5ca;
      text-indent: 2em;
      text-align: left;
      font-size: 15px;
      padding: 20px;
      letter-spacing: 5px;
    }
  }
}

// :deep(.swiper-slide) {
//   width: 300px !important;
//   padding: 0 7px 0 10px;
// }
</style>
