<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2023-12-04 14:00:17
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2023-12-04 14:07:00
 * @FilePath: \BB\src\components\utils_iconButton\components\communication\document\richText.vue
 * @Description: 富文本编辑器
-->
<template>
  <div id="richText">
    <tinymce-vue
      style="margin: 20px"
      v-model="vueData.content"
      :init="vueData.setting"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'

const vueData = reactive({
  content: '',
  setting: {
    menubar: false,
    toolbar:
      'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsize forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
    toolbar_drawer: 'sliding',
    quickbars_selection_toolbar:
      'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
    plugins: 'link image media table lists fullscreen quickbars',
    language: 'zh_CN',
    branding: false,
    elementpath: false,
    max_height: 400,
    min_height: 400
  }
})

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits()

watch(
  () => vueData.content,
  (nVal) => {
    emit('getContent', nVal)
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => props.content,
  (nVal) => {
    // console.log(nVal);
    vueData.content = nVal
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
