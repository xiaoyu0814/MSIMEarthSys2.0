// // AirSim 官方图像 API 参数
// const params = {
//   camera_name: "front_center", // 相机名称：前视中心相机
//   image_type: 0,               // 图像类型：0=RGB场景图
//   compress: true               // 压缩为JPG，返回Base64
// };

// // 请求 AirSim API
// const response = await axios.get('http://localhost:41451/simGetImage', { params });

// // 返回 Base64 图像数据给前端
// res.json({
//   success: true,
//   imageBase64: response.data // AirSim 直接返回 Base64 字符串
// });

/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-06-17 19:32:30
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-06-22 15:42:22
 */
import http from './request/http'
// 根据阵营获取当前场景中的平台编组树接口
export const getSimGetImage = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.ueServer}/simGetImage`,
    params
  })
}
