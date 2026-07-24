import util from "./util"
/**
 * @description 三维热力图类，基于h337类扩展
 * @class
 */
class Heatmap3d {
  /**
   * @param {window.MSIMEarth.Viewer} viewer 地图viewer对象 
   * @param {Object} opt 基础参数
   * @param {Array} opt.list 热力值数组
   * @param {Array} opt.raduis 热力点半径
   * @param {Array} opt.baseHeight 最低高度 
   * @param {Array} opt.gradient 颜色配置
   */
  constructor(viewer, opt) {
    this.viewer = viewer;
    this.opt = opt || {};
    this.list = this.opt.list || [];
    if (!this.list || this.list.length < 2) {
      console.log("热力图点位不得少于3个！");
      return;
    }
    this.dom = undefined;
    this.id = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
    this.canvasw = 200;

    this.bound = undefined; // 四角坐标
    this.rect = {}; // 经纬度范围

    this.x_axios = undefined; // x 轴
    this.y_axios = undefined; // y 轴
    this.girthX = 0; // x轴长度
    this.girthY = 0; // y轴长度

    this.baseHeight = this.opt.baseHeight || 0;

    this.createDom();
    let config = {
      container: document.getElementById(`easy3d-heatmap-${this.id}`),
      radius: this.opt.raduis || 20,
      maxOpacity: .7,
      minOpacity: 0,
      blur: .75,
      gradient: this.opt.gradient || {
        '.1': 'blue',
        '.5': 'yellow',
        '.7': 'red',
        '.99': 'white'
      }
    };
    this.primitiveType = opt.primitiveType || "TRIANGLES";
    this.heatmapInstance = h337.create(config);
    /**
     *@property {window.MSIMEarth.Primitive} primitive 热力图图元
     */
    this.primitive = undefined;
    this.init();
  }

  init() {
    this.hierarchy = []
    for (let ind = 0; ind < this.list.length; ind++) {
      let position = window.MSIMEarth.Cartesian3.fromDegrees(this.list[ind].lnglat[0], this.list[ind].lnglat[1], 0);
      this.hierarchy.push(position);

    }
    this.computeBound(this.hierarchy);
    let points = [];
    for (let i = 0; i < this.hierarchy.length; i++) {
      let p1 = this.hierarchy[i];
      const rete = this.computeRateInBound(p1);
      points.push({
        x: rete.x,
        y: rete.y,
        value: this.list[i].value
      })
    }
    this.heatmapInstance.addData(points);

    let instance = new window.MSIMEarth.GeometryInstance({
      geometry: this.createGeometry(),
    });

    this.primitive = this.viewer.scene.primitives.add(new window.MSIMEarth.Primitive({
      geometryInstances: instance,
      appearance: new window.MSIMEarth.MaterialAppearance({
        material: new window.MSIMEarth.Material({
          fabric: {
            type: 'Image',
            uniforms: {
              image: this.heatmapInstance.getDataURL()
            }
          }
        }),
        translucent: true,
        flat: true
      }),
      asynchronous: false
    }));
    this.primitive.id = "heatmap3d";
  }

  /**
   * 销毁
   */
  destroy() {
    let dom = document.getElementById(`easy3d-heatmap-${this.id}`);
    if (dom) dom.remove();
    if (this.primitive) {
      this.viewer.scene.primitives.remove(this.primitive);
      this.primitive = undefined;
    }
  }

  // 计算当前坐标在范围中位置 换算为canvas中的像素坐标
  computeRateInBound(position) {
    if (!position) return;
    let ctgc = window.MSIMEarth.Cartographic.fromCartesian(position.clone());
    ctgc.height = 0;
    position = window.MSIMEarth.Cartographic.toCartesian(ctgc.clone());

    const p_origin = window.MSIMEarth.Cartesian3.subtract(position.clone(), this.bound.leftTop, new window.MSIMEarth.Cartesian3());
    const diffX = window.MSIMEarth.Cartesian3.dot(p_origin, this.x_axios);
    const diffY = window.MSIMEarth.Cartesian3.dot(p_origin, this.y_axios);
    return {
      x: Number(diffX / this.girthX * this.canvasw).toFixed(0),
      y: Number(diffY / this.girthY * this.canvasw).toFixed(0)
    }
  }

  computeBound(positions) {
    // 先转化为正方形
    if (!positions) return;
    let boundingSphere = window.MSIMEarth.BoundingSphere.fromPoints(positions, new window.MSIMEarth.BoundingSphere());
    let center = boundingSphere.center;
    const radius = boundingSphere.radius;

    let modelMatrix = window.MSIMEarth.Transforms.eastNorthUpToFixedFrame(center.clone());
    let modelMatrix_inverse = window.MSIMEarth.Matrix4.inverse(modelMatrix.clone(), new window.MSIMEarth.Matrix4());
    let roate_y = new window.MSIMEarth.Cartesian3(0, 1, 0);

    let rect = [];
    for (let i = 45; i <= 360; i += 90) {
      let roateZ_mtx = window.MSIMEarth.Matrix3.fromRotationZ(window.MSIMEarth.Math.toRadians(i), new window.MSIMEarth.Matrix3());
      let yaix_roate = window.MSIMEarth.Matrix3.multiplyByVector(roateZ_mtx, roate_y, new window.MSIMEarth.Cartesian3());
      yaix_roate = window.MSIMEarth.Cartesian3.normalize(yaix_roate, new window.MSIMEarth.Cartesian3());
      let third = window.MSIMEarth.Cartesian3.multiplyByScalar(yaix_roate, radius, new window.MSIMEarth.Cartesian3());
      let poi = window.MSIMEarth.Matrix4.multiplyByPoint(modelMatrix, third.clone(), new window.MSIMEarth.Cartesian3());

      rect.push(poi);
    }

    let lnglats = util.cartesiansToLnglats(rect, this.viewer);
    let minLat = Number.MAX_VALUE, maxLat = Number.MIN_VALUE, minLng = Number.MAX_VALUE, maxLng = Number.MIN_VALUE;
    const length = rect.length;
    for (let i = 0; i < length; i++) {
      const lnglat = lnglats[i];
      if (lnglat[0] < minLng) {
        minLng = lnglat[0];
      }
      if (lnglat[0] > maxLng) {
        maxLng = lnglat[0];
      }

      if (lnglat[1] < minLat) {
        minLat = lnglat[1];
      }
      if (lnglat[1] > maxLat) {
        maxLat = lnglat[1];
      }
    }

    const diff_lat = maxLat - minLat;
    const diff_lng = maxLng - minLng;

    // 放大正方形轮廓
    this.rect.minLat = minLat - diff_lat / length;
    this.rect.maxLat = maxLat + diff_lat / length;
    this.rect.minLng = minLng - diff_lng / length;
    this.rect.maxLng = maxLng + diff_lng / length;

    this.bound = {
      leftTop: window.MSIMEarth.Cartesian3.fromDegrees(this.rect.minLng, this.rect.maxLat),
      leftBottom: window.MSIMEarth.Cartesian3.fromDegrees(this.rect.minLng, this.rect.minLat),
      rightTop: window.MSIMEarth.Cartesian3.fromDegrees(this.rect.maxLng, this.rect.maxLat),
      rightBottom: window.MSIMEarth.Cartesian3.fromDegrees(this.rect.maxLng, this.rect.minLat),
    }


    this.x_axios = window.MSIMEarth.Cartesian3.subtract(this.bound.rightTop, this.bound.leftTop, new window.MSIMEarth.Cartesian3());
    this.x_axios = window.MSIMEarth.Cartesian3.normalize(this.x_axios, new window.MSIMEarth.Cartesian3());
    this.y_axios = window.MSIMEarth.Cartesian3.subtract(this.bound.leftBottom, this.bound.leftTop, new window.MSIMEarth.Cartesian3());
    this.y_axios = window.MSIMEarth.Cartesian3.normalize(this.y_axios, new window.MSIMEarth.Cartesian3());
    this.girthX = window.MSIMEarth.Cartesian3.distance(this.bound.rightTop, this.bound.leftTop);
    this.girthY = window.MSIMEarth.Cartesian3.distance(this.bound.leftBottom, this.bound.leftTop);

  }


  createGeometry() {
    let opt = this.getGrain();
    let geometry = new window.MSIMEarth.Geometry({
      attributes: new window.MSIMEarth.GeometryAttributes({
        position: new window.MSIMEarth.GeometryAttribute({
          componentDatatype: window.MSIMEarth.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: opt.positions,
        }),
        st: new window.MSIMEarth.GeometryAttribute({
          componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: new Float32Array(opt.st)
        })
      }),
      indices: new Uint16Array(opt.indices),
      primitiveType: window.MSIMEarth.PrimitiveType[this.primitiveType],
      boundingSphere: window.MSIMEarth.BoundingSphere.fromVertices(opt.positions),
    })
    return geometry;
  }

  // 根据经纬度跨度和canvas的宽高 来计算顶点坐标及顶点法向量
  getGrain(opt) {
    let canvasW = this.canvasW || 200;
    let canvasH = this.canvasW || 200;
    let maxLng = this.rect.maxLng;
    let maxLat = this.rect.maxLat;
    let minLng = this.rect.minLng;
    let minLat = this.rect.minLat;

    const granLng_w = (maxLng - minLng) / canvasW; // 经度粒度
    const granLat_H = (maxLat - minLat) / canvasH; // 经度粒度
    let positions = [];
    let st = [];
    let indices = [];

    let points = [];
    for (let i = 0; i < canvasW; i++) {
      let nowLng = minLng + granLng_w * i;

      for (let j = 0; j < canvasH; j++) {
        let nowLat = minLat + granLat_H * j;
        const value = this.heatmapInstance.getValueAt({
          x: i,
          y: j
        });
        let cartesian3 = window.MSIMEarth.Cartesian3.fromDegrees(nowLng, nowLat, this.baseHeight + value);
        positions.push(cartesian3.x, cartesian3.y, cartesian3.z);
        st.push(i / canvasW, j / canvasH);
        if (j != canvasH - 1 && i != canvasW - 1) {
          indices.push(i * canvasH + j, i * canvasH + j + 1, (i + 1) * canvasH + j);
          indices.push((i + 1) * canvasH + j, (i + 1) * canvasH + j + 1, i * canvasH + j + 1);
        }

      }
    }

    return {
      positions: positions,
      st: st,
      indices: indices
    }
  }


  createDom() {
    this.dom = window.document.createElement("div");
    this.dom.id = `easy3d-heatmap-${this.id}`;
    this.dom.className = `easy3d-heatmap`;
    this.dom.style.width = this.canvasw + "px";
    this.dom.style.height = this.canvasw + "px";
    this.dom.style.position = "absolute";
    this.dom.style.display = "none";
    let mapDom = window.document.getElementById(this.viewer.container.id);

    mapDom.appendChild(this.dom);
  }


}


export default Heatmap3d