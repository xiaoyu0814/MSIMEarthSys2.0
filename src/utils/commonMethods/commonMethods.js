export default function () {
  const configldrw = (name) => {
    let commonMethods = new window.EarthPlugn.CommonMethods()
    commonMethods.taskConfig(name)
  }
  return { configldrw }
}
