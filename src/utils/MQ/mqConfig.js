let type = 'test'
export const RMQ_SERVER =
  type == 'test' ? 'xx:xx:xx:xx:xxxx' : 'xx:xx:xx:xx:xxxx' // mq服务地址
export const RMQ_VIRTUAL_HOST = type == 'test' ? '/' : '/' //虚拟主机
export const RMQ_ACCOUNT = type == 'test' ? 'xxxxx' : 'xxxxx' // 用户名
export const RMQ_PASSWORD = type == 'test' ? 'xxxxxxx' : 'xxxxxxx' // 密码
