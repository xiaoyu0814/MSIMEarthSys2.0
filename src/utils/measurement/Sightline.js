import { getCatesian3FromPX } from './utils.js'
/**
 * @class Sightline
 * @description 通视分析工具类，用于分析两点之间的通视情况
 * @param {Object} viewer - MSIMEarth Viewer实例
 * @param {Object} options - 配置选项
 * @param {MSIMEarth.Color} options.visibleColor - 可见区域颜色，默认绿色
 * @param {MSIMEarth.Color} options.hiddenColor - 遮挡区域颜色，默认红色
 * @param {Array} options.originPoint - 起点坐标（Cartesian3）
 * @param {Array} options.targetPoint - 终点坐标（Cartesian3）
 */
class Sightline {
  constructor(viewer, options = {}) {
    this.viewer = viewer;
    this.lines = [];
    this._visibleColor = MSIMEarth.defaultValue(
      options.visibleColor,
      new MSIMEarth.Color(0, 1, 0, 1)
    );
    this._hiddenColor = MSIMEarth.defaultValue(
      options.hiddenColor,
      new MSIMEarth.Color(1, 0, 0, 1)
    );
    this._depthFailMaterial = this._hiddenColor;
    this.frustrumLabel = undefined;
    this.viewPointFlag = false;
    this.handler = null;
    this.activeLine = null;
    this.pickPositions = [];
    if (options.originPoint && options.targetPoint) {
      this.add(options.originPoint, options.targetPoint);
    }
  }

  /**
   * @description 获取可见区域颜色
   * @returns {MSIMEarth.Color} 可见区域颜色
   */
  get visibleColor() {
    return this._visibleColor;
  }

  /**
   * @description 设置可见区域颜色
   * @param {MSIMEarth.Color} color - 可见区域颜色
   */
  set visibleColor(color) {
    this._visibleColor = color;
  }

  /**
   * @description 获取遮挡区域颜色
   * @returns {MSIMEarth.Color} 遮挡区域颜色
   */
  get hiddenColor() {
    return this._hiddenColor;
  }

  /**
   * @description 设置遮挡区域颜色
   * @param {MSIMEarth.Color} color - 遮挡区域颜色
   */
  set hiddenColor(color) {
    this._hiddenColor = color;
  }

  /**
   * @description 获取深度失败材质（被遮挡时显示的材质）
   * @returns {MSIMEarth.Color} 深度失败材质
   */
  get depthFailMaterial() {
    return this._depthFailMaterial;
  }

  /**
   * @description 设置深度失败材质
   * @param {MSIMEarth.Color} material - 深度失败材质
   */
  set depthFailMaterial(material) {
    this._depthFailMaterial = material;
  }

  /**
   * @description 添加通视线分析
   * @param {MSIMEarth.Cartesian3} originPoint - 起点坐标
   * @param {MSIMEarth.Cartesian3} targetPoint - 终点坐标
   * @returns {Array} 生成的线条实体数组
   */
  add(originPoint, targetPoint) {
    const originWithHeight = this._addHeightToPosition(originPoint, 1.8);
    const direction = MSIMEarth.Cartesian3.normalize(
      MSIMEarth.Cartesian3.subtract(
        targetPoint,
        originWithHeight,
        new MSIMEarth.Cartesian3()
      ),
      new MSIMEarth.Cartesian3()
    );
    const ray = new MSIMEarth.Ray(originWithHeight, direction);
    const intersectionResults = this.viewer.scene.drillPickFromRay(
      ray,
      2,
      this.lines
    );
    if (this._hasValidIntersection(intersectionResults)) {
      return this._createBlockedLine(originPoint, targetPoint, intersectionResults);
    }
    return this._createUnblockedLine(originPoint, targetPoint);
  }

  /**
   * @description 检查是否有有效的交点
   * @param {Array} results - 相交检测结果
   * @returns {boolean} 是否有有效交点
   * @private
   */
  _hasValidIntersection(results) {
    return (
      MSIMEarth.defined(results) &&
      results.length > 0 &&
      MSIMEarth.defined(results[0]) &&
      MSIMEarth.defined(results[0].position)
    );
  }

  /**
   * @description 创建被遮挡的通视线（分为可见段和遮挡段）
   * @param {MSIMEarth.Cartesian3} originPoint - 起点坐标
   * @param {MSIMEarth.Cartesian3} targetPoint - 终点坐标
   * @param {Array} intersectionResults - 相交检测结果
   * @returns {Array} 可见段和遮挡段线条实体数组
   * @private
   */
  _createBlockedLine(originPoint, targetPoint, intersectionResults) {
    const intersectionPoint = intersectionResults[0].position;
    const visibleLine = this._createLine(
      [originPoint, intersectionPoint],
      this._visibleColor
    );
    const hiddenLine = this._createLine(
      [intersectionPoint, targetPoint],
      this._hiddenColor
    );
    return [visibleLine, hiddenLine];
  }

  /**
   * @description 创建未被遮挡的通视线
   * @param {MSIMEarth.Cartesian3} originPoint - 起点坐标
   * @param {MSIMEarth.Cartesian3} targetPoint - 终点坐标
   * @returns {Array} 通视线线条实体数组
   * @private
   */
  _createUnblockedLine(originPoint, targetPoint) {
    const line = this.viewer.entities.add({
      polyline: {
        positions: [originPoint, targetPoint],
        width: 2,
        material: this._visibleColor,
        depthFailMaterial: this._depthFailMaterial
      }
    });
    this.lines.push(line);
    return [line];
  }

  /**
   * @description 创建线条实体
   * @param {Array} positions - 线条位置数组
   * @param {MSIMEarth.Color} material - 线条材质
   * @returns {Object} 线条实体
   * @private
   */
  _createLine(positions, material) {
    const line = this.viewer.entities.add({
      polyline: {
        positions: positions,
        width: 2,
        material: material
      }
    });
    this.lines.push(line);
    return line;
  }

  /**
   * @description 给位置坐标添加高度偏移
   * @param {MSIMEarth.Cartesian3|Array} position - 位置坐标或坐标数组
   * @param {number} heightOffset - 高度偏移量
   * @returns {MSIMEarth.Cartesian3|Array} 添加高度后的位置坐标
   * @private
   */
  _addHeightToPosition(position, heightOffset) {
    heightOffset = Number(heightOffset) || 0;
    if (isNaN(heightOffset) || heightOffset === 0) {
      return position;
    }
    if (Array.isArray(position)) {
      return position.map(pos => this._addHeightToSinglePosition(pos, heightOffset));
    }
    return this._addHeightToSinglePosition(position, heightOffset);
  }

  /**
   * @description 给单个位置坐标添加高度偏移
   * @param {MSIMEarth.Cartesian3} position - 位置坐标
   * @param {number} heightOffset - 高度偏移量
   * @returns {MSIMEarth.Cartesian3} 添加高度后的位置坐标
   * @private
   */
  _addHeightToSinglePosition(position, heightOffset) {
    const cartographic = MSIMEarth.Cartographic.fromCartesian(position);
    return MSIMEarth.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      cartographic.height + heightOffset
    );
  }

  /**
   * @description 创建标签实体
   * @param {MSIMEarth.Cartesian3} position - 标签位置
   * @param {string} text - 标签文本
   * @returns {Object} 标签实体
   */
  createLabel(position, text) {
    return this.viewer.entities.add({
      position: position,
      label: {
        text: text
      }
    });
  }

  /**
   * @description 绘制动态线条
   * @param {MSIMEarth.CallbackProperty|Array} positionData - 位置数据
   * @param {MSIMEarth.Color} material - 线条材质
   * @param {MSIMEarth.Color} depthFailMaterial - 深度失败材质
   * @returns {Object} 线条实体
   */
  drawLine(positionData, material, depthFailMaterial) {
    return this.viewer.entities.add({
      polyline: {
        positions: positionData,
        width: 5,
        material: material,
        depthFailMaterial: depthFailMaterial
      }
    });
  }

  /**
   * @description 激活通视分析交互模式
   */
  draw() {
    this.frustrumLabel = undefined;
    this.viewPointFlag = false;
    this.pickPositions = [];
    this.activeLine = null;
    this.handler = new MSIMEarth.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    this._setupLeftClickHandler();
    this._setupMouseMoveHandler();
  }

  /**
   * @description 设置左键点击事件处理器
   * @private
   */
  _setupLeftClickHandler() {
    this.handler.setInputAction((movement) => {
      // const cartesian = this.viewer.scene.pickPosition(movement.position);
      const cartesian = getCatesian3FromPX(movement.position);
      if (!cartesian) return;
      if (this.pickPositions.length >= 2) {
        this._finishAnalysis();
      } else {
        this._addPickPosition(cartesian);
      }
    }, MSIMEarth.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * @description 设置鼠标移动事件处理器
   * @private
   */
  _setupMouseMoveHandler() {
    this.handler.setInputAction((movement) => {
      // const newPosition = this.viewer.scene.pickPosition(movement.endPosition);
      const newPosition = getCatesian3FromPX(movement.endPosition);
      if (!MSIMEarth.defined(newPosition)) return;
      if (this.frustrumLabel === undefined) {
        this.frustrumLabel = this.createLabel(newPosition, '点击选择视点');
      } else {
        this.frustrumLabel.position = newPosition;
        if (this.viewPointFlag === true) {
          this.frustrumLabel.label.text = '点击视线方向';
          this.pickPositions.pop();
          this.pickPositions.push(newPosition);
        }
      }
    }, MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE);
  }

  /**
   * @description 添加拾取位置
   * @param {MSIMEarth.Cartesian3} cartesian - 拾取的笛卡尔坐标
   * @private
   */
  _addPickPosition(cartesian) {
    this.pickPositions.push(cartesian);
    this.viewPointFlag = true;
    const dynamicPositions = new MSIMEarth.CallbackProperty(() => {
      return this.pickPositions;
    }, false);
    this.pickPositions.push(cartesian);
    this.activeLine = this.drawLine(
      dynamicPositions,
      MSIMEarth.Color.WHITE,
      MSIMEarth.Color.WHITE
    );
  }

  /**
   * @description 完成通视分析
   * @private
   */
  _finishAnalysis() {
    if (this.frustrumLabel) {
      this.viewer.entities.remove(this.frustrumLabel);
      this.frustrumLabel = undefined;
    }
    if (this.activeLine) {
      this.viewer.entities.remove(this.activeLine);
      this.activeLine = null;
    }
    this.add(this.pickPositions[0], this.pickPositions[1]);
    this.pickPositions = [];
    this.viewPointFlag = false;
  }

  /**
   * @description 激活通视分析交互模式（与draw方法功能相同，为保持API一致性添加）
   */
  activate() {
    this.draw();
  }

  /**
   * @description 清除所有通视线和交互状态
   */
  clear() {
    if (this.handler) {
      this.handler.removeInputAction(MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE);
      this.handler.removeInputAction(MSIMEarth.ScreenSpaceEventType.LEFT_CLICK);
      this.handler = null;
    }
    if (this.frustrumLabel) {
      this.viewer.entities.remove(this.frustrumLabel);
      this.frustrumLabel = undefined;
    }
    if (this.activeLine) {
      this.viewer.entities.remove(this.activeLine);
      this.activeLine = null;
    }
    this.lines.forEach(line => {
      this.viewer.entities.remove(line);
    });
    this.lines = [];
    this.pickPositions = [];
    this.viewPointFlag = false;
  }

  /**
   * @description 销毁实例，释放所有资源
   */
  destroy() {
    this.clear();
    delete this.viewer;
    delete this._visibleColor;
    delete this._hiddenColor;
    delete this._depthFailMaterial;
    delete this.frustrumLabel;
    delete this.viewPointFlag;
    delete this.handler;
    delete this.activeLine;
    delete this.pickPositions;
  }
}

export default Sightline;