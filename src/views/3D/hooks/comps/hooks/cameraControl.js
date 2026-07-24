export default function () {
  // 视角跳转到目标所在区域
  const flyToTarget = (target) => {
    const { lat, lon, alt } = target
    const camera = document.getElementById('camera')
    camera.position.set(lat, lon, alt)
  }
  return {
    flyToTarget
  }
}