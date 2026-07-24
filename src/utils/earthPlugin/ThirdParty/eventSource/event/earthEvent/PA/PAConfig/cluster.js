export default function () {
  // 聚合
  const clusterPA = (json) => {
    const staticDataSource = new window.MSIMEarth.CustomDataSource(
      'staticLabel'
    )
    window.EarthViewer.dataSources.add(staticDataSource).then((data) => {
      window.sceneAction.environmentController.handleClusterBillboard(
        data,
        120,
        4
      )
    })
  }

  return { clusterPA }
}
