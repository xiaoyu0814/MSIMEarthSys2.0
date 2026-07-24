import store from '@/store'

// 实例缓存
let clusterByGroupInstance = null;
let effectByTurfInstance = null;
let cameraChangedListener = null;

// 聚合
function clusterToPoint(clusterArr, clusterId) {
  if (!clusterByGroupInstance) {
    clusterByGroupInstance = new window.EarthPlugn.ClusterByGroup(
      window.MSIMEarth,
      window.EarthViewer
    );
  }
  clusterByGroupInstance.createClusterByGroup(clusterArr, clusterId);
}

// 分散
function distributeGroup(clusterArr, clusterId) {
  if (!clusterByGroupInstance) {
    clusterByGroupInstance = new window.EarthPlugn.ClusterByGroup(
      window.MSIMEarth,
      window.EarthViewer
    );
  }
  clusterByGroupInstance.removeCluster(clusterArr, clusterId);
}

// 全局数组，避免每次创建新数组
const clusterArr = [];

const juhe = () => {
  store.state.AFSIMModule.showReconnaissanceResults = false
  try {
    let clusterTarget = store.state.AFSIMModule.reconnaissanceResults;
    if (!clusterTarget) {
      return;
    }
    let clusterId = '多机协同探测';
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    });

    // 清空数组
    clusterArr.length = 0;

    if (clusterTarget && clusterTarget.data && clusterTarget.data.threat_assessment) {
      clusterTarget.data.threat_assessment.forEach((item) => {
        entityMethod.removeRotateEntity(item.unit_name);
        let options = {
          entityId: item.unit_name,
          czmlSource: 'MSIMEarthCZMLProcessContainer'
        };
        window.sceneAction.popUp.cancleStyleEffect(options);
        clusterArr.push(item.unit_name);
      });
    }

    clusterToPoint(clusterArr, clusterId);
  } catch (error) {
    console.error('Juhe function error:', error);
  }
};

const fensan = () => {
  store.state.AFSIMModule.showReconnaissanceResults = true
  try {
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    });
    let clusterId = '多机协同探测';
    let clusterTarget = store.state.AFSIMModule.reconnaissanceResults;
    if (!clusterTarget) {
      return;
    }
    let threatAssessment = clusterTarget.data.threat_assessment;
    if (!threatAssessment || threatAssessment.length === 0) {
      return;
    }
    let captainName = threatAssessment[0].unit_name;
    let targetsIdArr = [];

    if (threatAssessment) {
      threatAssessment.forEach((item) => {
        // 如果item.unit_name为threatAssessment【0】，则添加菱形图标
        let name = item.unit_name;
        if (item.unit_name == captainName) {
          name = item.unit_name + '♦♦♦';
        }
        targetsIdArr.push(item.unit_name);
        let options = {
          entityId: item.unit_name,
          name: name,
          czmlSource: 'MSIMEarthCZMLProcessContainer',
          type: 'reconnaissance',
          threatLevel: item.threat_level,
          confidence: Math.floor(item.confidence * 100) / 100 // 保留两位小数但不四舍五入
        };
        entityMethod.createRotateEntity(
          item.unit_name,
          2300.0,
          'static/image/texture/rotate1.png'
        );
        window.sceneAction.popUp.cancleStyleEffect(options);
        window.sceneAction.popUp.setStyleEffectByReconnaissanceResults(
          options
        );
      });

      // 重用 EffectByTurf 实例
      if (!effectByTurfInstance) {
        effectByTurfInstance = new window.EarthPlugn.EffectByTurf(
          window.MSIMEarth,
          window.EarthViewer
        );
      }
      let EF = effectByTurfInstance;

      // targetIdArr ['red_3', 'red_4']
      EF.removeGroupCircleByTurf(targetsIdArr);
      EF.createGroupCircleByTurf(
        targetsIdArr,
        window.MSIMEarth.Color.BLUE,
        130
      );

      distributeGroup(clusterArr, clusterId);
      // 增加编组目标闪烁，其中targetsIdArr【0】为队长，其他为队员
    }
  } catch (error) {
    console.error('Fensan function error:', error);
  }
};

export default function cameraZoom(params) {
  // 监听相机获取zoom层级
  cameraChangedListener = () => {
    try {
      // 获取当前缩放级别（MSIMEarth 专用高度值）
      const height = window.EarthViewer.camera.positionCartographic.height;
      // 换算公式（近似值）
      const zoom = Math.round(window.MSIMEarth.Math.log2(40075016.68557849 / height) - 1);
      console.log('zoom', zoom, height);
      if (height >= 292081) {
        // 三级以上目标聚合
        juhe();
        // 去掉各个目标的旋转图标
        // 去掉威胁信息标牌
        // 保留威胁圈
      } else {
        // 三级以下目标恢复离散
        fensan();
      }
    } catch (error) {
      console.error('Camera listener error:', error);
    }
  };

  // 添加事件监听器
  window.EarthViewer.camera.moveEnd.addEventListener(cameraChangedListener);

  // 返回清理函数
  return () => {
    // 移除事件监听器
    if (cameraChangedListener) {
      window.EarthViewer.camera.moveEnd.removeEventListener(cameraChangedListener);
      cameraChangedListener = null;
    }

    // 清理实例
    clusterByGroupInstance = null;
    effectByTurfInstance = null;
  };
}