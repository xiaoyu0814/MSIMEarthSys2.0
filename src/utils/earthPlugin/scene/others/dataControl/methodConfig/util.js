/**
 * 三维基础方法
 * @example util.getCameraView(viewer);
 * @exports util
 * @alias util
 */
let util = {};
/**
 * 世界坐标转经纬度
 * @param {window.MSIMEarth.Cartesian3 } cartesian 世界坐标
 * @param {window.MSIMEarth.Viewer} viewer 当前viewer对象
 * @returns { Array } 经纬度坐标s
 */
util.cartesianToLnglat = function (cartesian, viewer) {
    if (!cartesian) return [];
    viewer = viewer || window.EarthViewer;
    var lnglat = window.MSIMEarth.Cartographic.fromCartesian(cartesian);
    var lat = window.MSIMEarth.Math.toDegrees(lnglat.latitude);
    var lng = window.MSIMEarth.Math.toDegrees(lnglat.longitude);
    var hei = lnglat.height;
    return [lng, lat, hei];
}

util.getViewCenter = (viewer) => {
    if (!viewer) return;
    var rectangle = viewer.camera.computeViewRectangle();
    var west = rectangle.west / Math.PI * 180;
    var north = rectangle.north / Math.PI * 180;
    var east = rectangle.east / Math.PI * 180;
    var south = rectangle.south / Math.PI * 180;
    return [(east + west) / 2, (north + south) / 2]
}

/**
 * 世界坐标数组转经纬度数组
 * @param {window.MSIMEarth.Cartesian3[]} cartesians 世界坐标数组
 * @param {window.MSIMEarth.Viewer} viewer 当前viewer对象
 * @returns { Array } 经纬度坐标数组
 */
util.cartesiansToLnglats = function (cartesians, viewer) {
    if (!cartesians || cartesians.length < 1) return;
    viewer = viewer || window.viewer;
    if (!viewer) {
        console.log('util.cartesiansToLnglats方法缺少viewer对象');
        return;
    }
    var arr = [];
    for (var i = 0; i < cartesians.length; i++) {
        arr.push(util.cartesianToLnglat(cartesians[i], viewer));
    }
    return arr;
}

/**
 * 经纬度坐标数组转世界坐标数组
 * @param {Array[]} lnglats 经纬度坐标数组
 * @returns {window.MSIMEarth.Cartesian3[]} cartesians 世界坐标数组
 * @example util.lnglatsToCartesians([[117,40],[118.41]])
 */
util.lnglatsToCartesians = function (lnglats) {
    if (!lnglats || lnglats.length < 1) return;
    var arr = [];
    for (var i = 0; i < lnglats.length; i++) {
        var c3 = window.MSIMEarth.Cartesian3.fromDegrees(lnglats[i][0], lnglats[i][1], lnglats[i][2] || 0);
        arr.push(c3);
    }
    return arr;
}

/**
 * 视角定位方法
 * @param {Object} opt 定位参数
 * @param {Cartesian3|Array} opt.center 当前定位中心点
 * @param {Number} opt.heading 当前定位偏转角度 默认为0 
 * @param {Number} opt.pitch 当前定位仰俯角 默认为-60
 * @param {Number} opt.range 当前定位距离 默认为1000米
 * @param {window.MSIMEarth.Viewer} viewer 当前viewer对象
 */
util.flyTo = function (opt, viewer) {
    if (!viewer) {
        console.log('util.flyTo缺少viewer对象');
        return;
    }
    opt = opt || {};
    let center = opt.center;
    if (!center) {
        console.log("缺少定位坐标！");
        return;
    }
    if (center instanceof window.MSIMEarth.Cartesian3) {
        viewer.camera.flyToBoundingSphere(new window.MSIMEarth.BoundingSphere(center), {
            offset: new window.MSIMEarth.HeadingPitchRange(
                window.MSIMEarth.Math.toRadians(opt.heading || 0),
                window.MSIMEarth.Math.toRadians(opt.pitch || -60),
                opt.range || 10000
            )
        });
    }
    if (center instanceof Array) {
        var boundingSphere = new window.MSIMEarth.BoundingSphere(window.MSIMEarth.Cartesian3.fromDegrees(center[0], center[1], center[2]));
        viewer.camera.flyToBoundingSphere(boundingSphere, {
            offset: new window.MSIMEarth.HeadingPitchRange(
                window.MSIMEarth.Math.toRadians(opt.heading || 0),
                window.MSIMEarth.Math.toRadians(opt.pitch || -60),
                opt.range || 10000
            )
        });
    }
}

/**
 * 获取当相机姿态
 * @param {window.MSIMEarth.Viewer} viewer 当前viewer对象
 * @returns {Object} cameraView 当前相机姿态
 */
util.getCameraView = function (viewer) {
    viewer = viewer || window.viewer;
    if (!viewer) {
        console.log('util.getCameraView缺少viewer对象');
        return;
    }
    var camera = viewer.camera;
    var position = camera.position;
    var heading = camera.heading;
    var pitch = camera.pitch;
    var roll = camera.roll;
    var lnglat = window.MSIMEarth.Cartographic.fromCartesian(position);

    var cameraV = {
        "x": window.MSIMEarth.Math.toDegrees(lnglat.longitude),
        "y": window.MSIMEarth.Math.toDegrees(lnglat.latitude),
        "z": lnglat.height,
        "heading": window.MSIMEarth.Math.toDegrees(heading),
        "pitch": window.MSIMEarth.Math.toDegrees(pitch),
        "roll": window.MSIMEarth.Math.toDegrees(roll)
    };
    return cameraV;
}

/**
 * 设置相机姿态 一般和getCameraView搭配使用
 * @param {Object} cameraView 相机姿态参数
 * @param {Number} cameraView.duration 定位所需时间
 * @param {window.MSIMEarth.Viewer} viewer 当前viewer对象
 */
util.setCameraView = function (obj, viewer) {
    viewer = viewer || window.viewer;
    if (!viewer) {
        console.log('util.setCameraView缺少viewer对象');
        return;
    }
    if (!obj) return;
    var position = obj.destination || window.MSIMEarth.Cartesian3.fromDegrees(obj.x, obj.y, obj.z); // 兼容cartesian3和xyz
    viewer.camera.flyTo({
        destination: position,
        orientation: {
            heading: window.MSIMEarth.Math.toRadians(obj.heading || 0),
            pitch: window.MSIMEarth.Math.toRadians(obj.pitch || 0),
            roll: window.MSIMEarth.Math.toRadians(obj.roll || 0)
        },
        duration: obj.duration === undefined ? 3 : obj.duration,
        complete: obj.complete
    });
}

/**
 * 计算当前三角形面积
 * @param {window.MSIMEarth.Cartesian3 } pos1 当前点坐标1
 * @param {window.MSIMEarth.Cartesian3 } pos2 当前点坐标2
 * @param {window.MSIMEarth.Cartesian3 } pos3 当前点坐标3
 * @returns {Number} area，面积
 */
util.computeAreaOfTriangle = function (pos1, pos2, pos3) {
    if (!pos1 || !pos2 || !pos3) {
        console.log("传入坐标有误！");
        return 0;
    }
    var a = window.MSIMEarth.Cartesian3.distance(pos1, pos2);
    var b = window.MSIMEarth.Cartesian3.distance(pos2, pos3);
    var c = window.MSIMEarth.Cartesian3.distance(pos3, pos1);
    var S = (a + b + c) / 2;
    return Math.sqrt(S * (S - a) * (S - b) * (S - c));
}

export default util;

