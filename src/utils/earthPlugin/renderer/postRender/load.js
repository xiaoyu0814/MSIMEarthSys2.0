import loadGLSL from '../../glsl/postRenderGLSL/load.js'
/**
 * 加载效果
 * @param {*} Earth
 * @returns
 */
function createLoadStage(Earth) {
  var e = new Earth.PostProcessStage({
    name: 'czm_laod',
    fragmentShader: loadGLSL
  })
  return e
}
export default createLoadStage
