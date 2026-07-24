/**
 * ARSIM 消息处理 Worker
 * 处理消息解析和数据处理，避免主线程卡顿
 */

// 监听主线程消息
self.onmessage = function (e) {
  const { type, data } = e.data;
  switch (type) {
    case 'parseMessage':
      parseMessage(data);
      break;
    default:
      console.error('Unknown message type:', type);
  }
};

/**
 * 解析消息内容
 * @param {Object} params 消息参数
 */
function parseMessage(params) {
  const { body } = params;

  try {
    // 解析消息内容
    let contentStr = JSON.parse(body).content;
    let contentObj = JSON.parse(contentStr);

    // 发送结果回主线程
    self.postMessage({
      type: 'parseMessageResult',
      data: {
        contentObj: contentObj
      }
    });
  } catch (error) {
    console.error('Error in parseMessage:', error);
    self.postMessage({
      type: 'error',
      data: { error: error.message }
    });
  }
}
