/** * @Author: 858834013@qq.com * @Name: rememberPwd * @Date:
2023年08月04日09:06:08 * @Desc: 记住密码 */
<template>
  <div class="rememberPwd">
    <el-checkbox fill="#24cdff" v-model="rememberPwd">记住密码</el-checkbox>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import CryptoJS from 'crypto-js'

export default {
  name: 'rememberPwd',
  props: {
    password: String,
    username: String
  },
  setup(props, context) {
    const rememberPwd = ref(false)
    const secretKey = 'wanjunshijie.com' // 这只是一个示例，你应该使用一个安全的密钥

    watch(rememberPwd, (newVal) => {
      localStorage.setItem('rememberPwd', newVal)
      rememberPassword()
    })

    onMounted(() => {
      let username = localStorage.getItem('username')
      let password = localStorage.getItem('password')
      const rememberPwdStatus = localStorage.getItem('rememberPwd')

      if (username) {
        username = decrypt(username)
      }

      if (password) {
        password = decrypt(password)
      }

      if (rememberPwdStatus) {
        rememberPwd.value = true
      } else {
        rememberPwd.value = false
      }
      if (rememberPwd.value) {
        context.emit('update:username', username)
        context.emit('update:password', password)
      }
    })

    function rememberPassword() {
      if (rememberPwd.value) {
        localStorage.setItem('username', encrypt(props.username))
        localStorage.setItem('password', encrypt(props.password))
        localStorage.setItem('rememberPwd', true)
      } else {
        localStorage.removeItem('username')
        localStorage.removeItem('password')
        localStorage.removeItem('rememberPwd')
      }
    }

    function encrypt(text) {
      return CryptoJS.AES.encrypt(text, secretKey).toString()
    }

    function decrypt(ciphertext) {
      const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey)
      return bytes.toString(CryptoJS.enc.Utf8)
    }

    return {
      rememberPwd,
      rememberPassword
    }
  }
}
</script>

<style lang="less" scoped>
.rememberPwd {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  ::v-deep {
    .el-checkbox__label {
      color: #fff;
    }

    .el-checkbox.is-checked {
      color: #24cdff;

      .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #24cdff;
        border-color: #24cdff;
      }
    }

    .el-checkbox__label {
      color: #24cdff;
    }
  }
}
</style>
