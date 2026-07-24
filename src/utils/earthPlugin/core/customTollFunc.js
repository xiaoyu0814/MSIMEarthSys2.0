import CreateFrustumPure from './/actionController/customTool/CreateFrumstumPure'
export default class CustomTollFunc {
  constructor(config) {
    this.earth = config.earth
    this.viewer = config.viewer
  }
  getCreateFrumstumPureMethod() {
    return CreateFrustumPure
  }
}
