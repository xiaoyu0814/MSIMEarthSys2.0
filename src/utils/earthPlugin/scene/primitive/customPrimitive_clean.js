import Winston from './winston/winston.js';
import WinstonHalf from './winston/winstonHalf.js';
import TriNetPrimitive from './verticlePrimitive.js';
import DCInstance from './DCInstance/DCInstance.js';

/**
 * 自定义Primitive管理器
 * 提供多种Primitive的创建、更新和移除功能
 * 
 * @class CustomPrimitive
 * @param {Object} earth - Cesium/MIMEarth实例
 * @param {Object} viewer - 视图实例
 */
class CustomPrimitive {
    constructor(earth, viewer) {
        this.earth = earth;
        this.viewer = viewer;
        this.TriNetPrimitive = TriNetPrimitive;
    }

    /**
     * 创建Winston四棱台（完整视场）
     * @param {Object} dimension - 尺寸参数
     * @param {Object} position - 位置参数
     * @param {Object} params - 其他参数
     * @returns {Object} - Winston Primitive对象
     */
    createWinston(dimension, position, params) {
        const winston = new Winston(this.earth, this.viewer);
        return winston.createWinstionPrimitive(dimension, position, params);
    }

    /**
     * 创建半Winston四棱台（半视场）
     * @param {Object} dimension - 尺寸参数
     * @param {Object} position - 位置参数
     * @param {Object} params - 其他参数
     * @returns {Object} - WinstonHalf Primitive对象
     */
    createWinstonHalf(dimension, position, params) {
        const winstonHalf = new WinstonHalf(this.earth, this.viewer);
        return winstonHalf.createWinstionPrimitive(dimension, position, params);
    }

    /**
     * 创建三角网Primitive
     * @param {Object} options - 配置选项
     * @param {Object} options.position - 位置
     * @param {Array} options.positions - 顶点数组
     * @param {Array} options.indices - 索引数组
     * @param {Array} options.colors - 颜色数组
     * @param {Number} options.primitiveType - 图元类型
     * @param {String} options.id - 唯一标识
     * @returns {Object} - TriNetPrimitive对象
     */
    createTriNetPrimitive(options) {
        const p = new TriNetPrimitive({
            position: options.position,
            viewer: this.viewer,
            color: this.earth.Color.fromCssColorString('#00FF00').withAlpha(0.5),
            positions: options.positions,
            indices: options.indices,
            colors: options.colors,
            scale: 1,
            earth: this.earth,
            primitiveType: options.primitiveType
        });
        p.id = options.id;
        return p;
    }

    /**
     * 添加DQ数据Primitive（三角形/线）
     * @param {Object} data - 数据对象
     * @param {Array} data.positions - 位置数组 [lon, lat, height, ...]
     * @param {Array} data.indices - 索引数组
     * @param {Array} data.colors - 颜色数组
     * @param {String} [name="-"] - 名称
     * @param {String} [type="triangles"] - 类型："triangles" 或 "lines"
     */
    addPrimitiveDQ(data, name = '-', type = 'triangles') {
        const viewer = this.viewer;
        const earth = this.earth;

        this.removeDQPrimitive(name);

        const positionsCar3 = [];
        const colors = [];
        const normalsArray = [];
        const values = data || [];

        // 遍历所有顶点，转换坐标并计算颜色和法向量
        for (let i = 0; i < data.positions.length; i += 3) {
            const cartesian3 = window.MSIMEarth.Cartesian3.fromDegrees(
                data.positions[i],
                data.positions[i + 1],
                data.positions[i + 2]
            );
            positionsCar3.push(cartesian3.x, cartesian3.y, cartesian3.z);

            const valueIndex = i / 3;
            const value = values[valueIndex] || -9.821739196777344;
            const color = this.getDQColor(value);
            colors.push(color[0] / 255, color[1] / 255, color[2] / 255, color[3]);

            const normal = this.computeNormal(cartesian3);
            normalsArray.push(normal.x, normal.y, normal.z);
        }

        const positions = new Float64Array(positionsCar3);
        const sts = new Float32Array(2 * (positions.length / 3));
        const indices = new Uint16Array(data.indices);
        const normals = new Float32Array(normalsArray);

        // 根据类型设置Primitive类型
        let primitiveType;
        switch (type) {
            case 'lines':
                primitiveType = window.MSIMEarth.PrimitiveType.LINES;
                break;
            case 'triangles':
            default:
                primitiveType = window.MSIMEarth.PrimitiveType.TRIANGLES;
                break;
        }

        // 创建几何体
        const geometry = new window.MSIMEarth.Geometry({
            attributes: {
                position: new window.MSIMEarth.GeometryAttribute({
                    componentDatatype: window.MSIMEarth.ComponentDatatype.DOUBLE,
                    componentsPerAttribute: 3,
                    values: positions
                }),
                normal: new window.MSIMEarth.GeometryAttribute({
                    componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
                    componentsPerAttribute: 3,
                    values: normals
                }),
                color: new window.MSIMEarth.GeometryAttribute({
                    componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
                    componentsPerAttribute: 4,
                    values: new Float32Array(data.colors)
                }),
                textureCoordinates: new window.MSIMEarth.GeometryAttribute({
                    componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
                    componentsPerAttribute: 2,
                    values: sts
                })
            },
            indices: indices,
            primitiveType: primitiveType,
            boundingSphere: window.MSIMEarth.BoundingSphere.fromVertices(positions)
        });

        const instance = new window.MSIMEarth.GeometryInstance({ geometry });

        // 创建Primitive并添加到场景
        const primitive = new window.MSIMEarth.Primitive({
            geometryInstances: instance,
            appearance: new window.MSIMEarth.PerInstanceColorAppearance({
                vertexColors: true
            }),
            asynchronous: false
        });

        primitive.name = name || 'DQcustomPrimitive';
        viewer.scene.primitives.add(primitive);
    }

    /**
     * 计算笛卡尔坐标点的大地表面法向量
     * @param {Object} cartesian - Cartesian3坐标
     * @returns {Object} - 法向量
     */
    computeNormal(cartesian) {
        const ellipsoid = window.MSIMEarth.Ellipsoid.WGS84;
        return ellipsoid.geodeticSurfaceNormal(cartesian);
    }

    /**
     * 移除指定名称的DQ Primitive
     * @param {String} [name="-"] - 名称
     */
    removeDQPrimitive(name = '-') {
        const viewer = this.viewer;
        const curDQName = name || 'DQcustomPrimitive';

        viewer.scene.primitives._primitives.forEach(p => {
            if (p.name && p.name === curDQName) {
                viewer.scene.primitives.remove(p);
            }
        });
    }

    /**
     * 根据DQ值获取颜色（颜色映射）
     * @param {Number} value - DQ值
     * @returns {Array} - RGBA颜色数组 [r, g, b, a]
     */
    getDQColor(value) {
        // 无效值返回透明黑色
        if (value === -9.821739196777344 || value === -9.82) {
            return [0, 0, 0, 0];
        }

        // 颜色渐变映射
        if (value <= 10) {
            return [0, 0, 255, 0.2];
        } else if (value <= 30) {
            const t = (value - 10) / 20;
            return [0, Math.round(0 * (1 - t) + 128 * t), 255, 0.2];
        } else if (value <= 50) {
            const t = (value - 30) / 20;
            return [0, Math.round(128 * (1 - t) + 255 * t), Math.round(255 * (1 - t) + 0 * t), 0.2];
        } else if (value <= 60) {
            const t = (value - 50) / 10;
            return [Math.round(0 * (1 - t) + 255 * t), Math.round(255 * (1 - t) + 255 * t), 0, 0.2];
        } else if (value <= 70) {
            const t = (value - 60) / 10;
            return [255, Math.round(255 * (1 - t) + 128 * t), 0, 0.2];
        } else if (value <= 85) {
            const t = (value - 70) / 15;
            return [255, Math.round(128 * (1 - t) + 0 * t), 0, 0.3];
        } else {
            return [255, 0, 0, 0.3];
        }
    }

    /**
     * 清除指定ID的Primitive
     * @param {String} id - Primitive ID
     */
    clear(id) {
        const viewer = this.viewer;
        viewer.scene.primitives._primitives.forEach(p => {
            if (p.id && p.id === id) {
                viewer.scene.primitives.remove(p);
            }
        });
    }

    /**
     * 批量清除多个Primitive
     */
    clearMulti() {
        const viewer = this.viewer;
        const targetPrimitiveCol = [];
        const primitiveCol = viewer.scene.primitives._primitives;

        if (primitiveCol && primitiveCol.length > 0) {
            primitiveCol.forEach(e => {
                if (e && e.name && e.name.indexOf('_primitive_custom') > -1) {
                    targetPrimitiveCol.push(e.id);
                }
            });

            targetPrimitiveCol.forEach(id => {
                viewer.scene.primitives._primitives.forEach(p => {
                    if (p && p.id && p.id === id) {
                        viewer.scene.primitives.remove(p);
                    }
                });
            });
        }
    }

    /**
     * 更新模型矩阵
     * @param {String} id - Primitive ID
     * @param {String} czmlname - CZML数据源名称
     */
    updateModelMatrix(id, czmlname) {
        const viewer = this.viewer;
        const earth = this.earth;

        const targetDs = window.EarthViewer.dataSources.getByName(czmlname);
        if (targetDs.length === 0) return;

        const targetEntity = targetDs[0].entities.getById(czmlname);
        if (!earth.defined(targetEntity)) return;

        const YGPosition = targetEntity.position.getValue(window.EarthViewer.clock.currentTime);
        if (!earth.defined(YGPosition)) return;

        const hpr = new earth.HeadingPitchRoll(0, 0, 0);
        const curModelMatrix = earth.Transforms.headingPitchRollToFixedFrame(
            YGPosition,
            hpr,
            earth.Ellipsoid.WGS84,
            earth.Transforms.eastNorthUpToFixedFrame,
            new earth.Matrix4()
        );

        if (!earth.defined(curModelMatrix)) return;

        viewer.scene.primitives._primitives.forEach(p => {
            if (p.id && p.id === id) {
                if (window.MSIMEarth.SceneMode !== 3) return;
                p.modelMatrix = curModelMatrix;
            }
        });
    }

    /**
     * 创建体纹理（3D体渲染）
     * 使用光线投射算法进行体渲染
     * @param {String} [name="-"] - 名称
     * @param {String} url - 纹理图片URL
     * @param {Object} options - 配置选项
     * @param {Number} [options.xmin=118.0] - 经度最小值
     * @param {Number} [options.xmax=125] - 经度最大值
     * @param {Number} [options.ymin=21.0] - 纬度最小值
     * @param {Number} [options.ymax=26] - 纬度最大值
     * @param {Number} [options.zmin=1000.0] - 高度最小值
     * @param {Number} [options.zmax=15000.0] - 高度最大值
     * @param {Number} [options.alphaCorrection=1.0] - 透明度校正系数
     */
    createTextureAtlas(name = '-', url, options) {
        const viewer = this.viewer;
        const earth = window.MSIMEarth;

        // 默认配置
        const config = options || {
            xmin: 118.0,
            xmax: 125,
            ymin: 21.0,
            ymax: 26,
            zmin: 1000.0,
            zmax: 15000.0,
            alphaCorrection: 1.0
        };

        // 计算中心点和尺寸
        const centerLon = (config.xmin + config.xmax) / 2;
        const centerLat = (config.ymin + config.ymax) / 2;
        const centerZ = (config.zmin + config.zmax) / 2 + 100000;

        // 计算边界点
        const p1 = earth.Cartesian3.fromDegrees(config.xmin, config.ymin, config.zmin);
        const p2 = earth.Cartesian3.fromDegrees(config.xmax, config.ymin, config.zmin);
        const p3 = earth.Cartesian3.fromDegrees(config.xmin, config.ymax, config.zmin);

        // 计算宽度和高度
        const width = earth.Cartesian3.distance(p1, p2);
        const height = earth.Cartesian3.distance(p1, p3);
        const depth = config.zmax - config.zmin;

        // 加载纹理图片
        Cesium.Resource.createIfNeeded(url).fetchImage().then(res => {
            const position = earth.Cartesian3.fromDegrees(centerLon, centerLat, centerZ);

            // 创建立方体几何体
            const box = earth.BoxGeometry.fromDimensions({
                vertexFormat: window.MSIMEarth.VertexFormat.POSITION_NORMAL_AND_ST,
                dimensions: new earth.Cartesian3(1, 1, 1)
            });
            const geometry = earth.BoxGeometry.createGeometry(box);

            // GUI控制参数
            const guiControls = {
                steps: 256.0,
                alphaCorrection: config.alphaCorrection || 1,
                color1: '#e9ece9ff',
                stepPos1: 0.1,
                color2: '#dededd',
                stepPos2: 0.7,
                color3: '#e9e9cdff',
                stepPos3: 1.0,
                scaleX: width,
                scaleY: depth,
                scaleZ: height
            };

            // 计算模型矩阵
            const rotationX = earth.Matrix4.fromRotationTranslation(
                earth.Matrix3.fromRotationX(earth.Math.toRadians(90))
            );
            const enuMatrix = earth.Transforms.eastNorthUpToFixedFrame(position);
            earth.Matrix4.multiply(enuMatrix, rotationX, enuMatrix);

            const scaleMatrix = earth.Matrix4.fromScale(
                new earth.Cartesian3(guiControls.scaleX, 1, guiControls.scaleZ)
            );
            const modelMatrix = earth.Matrix4.multiply(enuMatrix, scaleMatrix, new earth.Matrix4());
            const invModelMatrix = earth.Matrix4.inverse(modelMatrix, new earth.Matrix4());

            // 创建着色器外观（体渲染光线投射）
            const appearance = new earth.MaterialAppearance({
                fragmentShaderSource: `  
                    in vec2 v_st;
                    in vec3 vOrigin;
                    in vec3 vDirection; 

                    uniform sampler2D cubeTex, transferTex;
                    uniform mat4 invModelMatrix;
                    uniform float steps;
                    uniform float alphaCorrection;

                    const int MAX_STEPS = 887;

                    vec4 sampleAs3DTexture(vec3 texCoord) {
                        vec4 colorSlice1, colorSlice2;
                        vec2 texCoordSlice1, texCoordSlice2;

                        float zSliceNumber1 = floor(texCoord.z * 255.0);
                        float zSliceNumber2 = min(zSliceNumber1 + 1.0, 255.0);

                        texCoord.xy /= 16.0;
                        texCoordSlice1 = texCoordSlice2 = texCoord.xy;

                        texCoordSlice1.x += (mod(zSliceNumber1, 16.0) / 16.0);
                        texCoordSlice1.y += floor((255.0 - zSliceNumber1) / 16.0) / 16.0;
                        texCoordSlice2.x += (mod(zSliceNumber2, 16.0) / 16.0);
                        texCoordSlice2.y += floor((255.0 - zSliceNumber2) / 16.0) / 16.0;

                        colorSlice1 = texture(cubeTex, texCoordSlice1);
                        colorSlice2 = texture(cubeTex, texCoordSlice2);

                        colorSlice1.rgb = texture(transferTex, vec2(colorSlice1.a, 1.0)).rgb;
                        colorSlice2.rgb = texture(transferTex, vec2(colorSlice2.a, 1.0)).rgb;

                        float zDifference = mod(texCoord.z * 255.0, 1.0);
                        return mix(colorSlice1, colorSlice2, zDifference);
                    }

                    vec2 hitBox(vec3 orig, vec3 dir) {
                        const vec3 box_min = vec3(-0.5);
                        const vec3 box_max = vec3(0.5);
                        vec3 inv_dir = 1.0 / dir;
                        vec3 tmin_tmp = (box_min - orig) * inv_dir;
                        vec3 tmax_tmp = (box_max - orig) * inv_dir;
                        vec3 tmin = min(tmin_tmp, tmax_tmp);
                        vec3 tmax = max(tmin_tmp, tmax_tmp);
                        float t0 = max(tmin.x, max(tmin.y, tmin.z));
                        float t1 = min(tmax.x, min(tmax.y, tmax.z));
                        return vec2(t0, t1);
                    }

                    void main() {
                        vec3 rayDir = normalize(vDirection);
                        vec2 bounds = hitBox(vOrigin, rayDir);
                        vec4 color = vec4(0.0);

                        if (bounds.x > bounds.y) discard;
                        bounds.x = max(bounds.x, 0.0);

                        vec3 p = vOrigin + bounds.x * rayDir;
                        vec3 frontPos = p;
                        vec3 dir = rayDir;
                        float rayLength = bounds.y - bounds.x;
                        float delta = 1.0 / steps;
                        vec3 deltaDirection = normalize(dir) * delta;
                        float deltaDirectionLength = length(deltaDirection);

                        vec3 currentPosition = frontPos;
                        vec4 accumulatedColor = vec4(0.0);
                        float accumulatedAlpha = 0.0;
                        float accumulatedLength = 0.0;
                        float alphaScaleFactor = 25.6 * delta;

                        vec4 colorSample;
                        float alphaSample;

                        for (int i = 0; i < MAX_STEPS; i++) {
                            colorSample = sampleAs3DTexture(currentPosition + 0.5);
                            alphaSample = colorSample.a * alphaCorrection;
                            alphaSample *= (1.0 - accumulatedAlpha);
                            alphaSample *= alphaScaleFactor;

                            accumulatedColor += colorSample * alphaSample;
                            accumulatedAlpha += alphaSample;

                            currentPosition += deltaDirection;
                            accumulatedLength += deltaDirectionLength;

                            if (accumulatedLength >= rayLength || accumulatedAlpha >= 1.0)
                                break;
                        }

                        out_FragColor = accumulatedColor * 1.2;
                    }
                `,
                vertexShaderSource: `  
                    in vec3 position3DHigh;
                    in vec3 position3DLow;
                    in vec3 normal;
                    in vec2 st;
                    in float batchId;

                    out vec3 v_positionEC;
                    out vec3 v_normalEC;
                    out vec2 v_st;
                    out vec3 vOrigin;
                    out vec3 vDirection;

                    void main() {
                        vec4 p = vec4(position3DHigh + position3DLow, 1.0);
                        v_positionEC = (czm_modelView * p).xyz;
                        v_normalEC = czm_normal * normal;
                        vOrigin = czm_encodedCameraPositionMCHigh + czm_encodedCameraPositionMCLow;
                        vDirection = p.xyz - vOrigin;
                        gl_Position = czm_modelViewProjection * p;
                    }
                `
            });

            // 设置uniforms
            appearance.uniforms = {
                cubeTex: viewer.scene.context.defaultTexture,
                transferTex: viewer.scene.context.defaultTexture,
                invModelMatrix: invModelMatrix,
                steps: 256,
                alphaCorrection: 1
            };

            // 创建3D纹理
            const cubeTex = new earth.Texture({
                context: viewer.scene.context,
                source: res
            });
            cubeTex.type = 'sampler2D';
            appearance.uniforms.cubeTex = cubeTex;

            // 创建Primitive
            const primitive = new earth.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: geometry,
                    modelMatrix: modelMatrix
                }),
                appearance: appearance,
                asynchronous: false
            });

            primitive.name = name + 'textureAtlas';
            viewer.scene.primitives.add(primitive);

            // 创建传输函数纹理
            this._createTransferFunctionTexture(appearance, guiControls);
        });
    }

    /**
     * 创建传输函数纹理（内部方法）
     * @param {Object} appearance - MaterialAppearance对象
     * @param {Object} guiControls - GUI控制参数
     * @private
     */
    _createTransferFunctionTexture(appearance, guiControls) {
        const viewer = this.viewer;
        const earth = window.MSIMEarth;

        const canvas = document.createElement('canvas');
        canvas.height = 20;
        canvas.width = 256;

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, canvas.width - 1, canvas.height - 1);

        gradient.addColorStop(guiControls.stepPos1, guiControls.color1);
        gradient.addColorStop(guiControls.stepPos2, guiControls.color2);
        gradient.addColorStop(guiControls.stepPos3, guiControls.color3);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width - 1, canvas.height - 1);

        // 更新DOM元素（如果存在）
        const transferFuncEl = document.getElementById('transferFunctionImg');
        if (transferFuncEl) {
            transferFuncEl.src = canvas.toDataURL();
            transferFuncEl.style.width = '256px';
            transferFuncEl.style.height = '128px';
        }

        // 创建传输函数纹理
        const transferTex = new earth.Texture({
            context: viewer.scene.context,
            source: canvas
        });
        transferTex.type = 'sampler2D';

        appearance.uniforms.transferTex = transferTex;
    }

    /**
     * 移除体纹理Primitive
     * @param {String} [name="-"] - 名称
     */
    removeTextureAtlasPrimitive(name = '-') {
        const viewer = this.viewer;
        const curTextureAtlasName = name + 'textureAtlas';

        viewer.scene.primitives._primitives.forEach(p => {
            if (p.name && p.name === curTextureAtlasName) {
                viewer.scene.primitives.remove(p);
            }
        });
    }

    /**
     * 创建DC实例
     * @param {String} type - 类型
     * @param {Array} instances - 实例数组
     * @param {Boolean} enablePick - 是否启用拾取
     * @param {String} [name="-"] - 名称
     */
    createDCInstance(type, instances, enablePick, name = '-') {
        const dcInstance = new DCInstance(type, instances, enablePick);
        dcInstance.name = name + '_DCInstance';
        this.viewer.scene.primitives.add(dcInstance);
    }

    /**
     * 移除DC实例
     * @param {String} [name="-"] - 名称
     */
    removeDCInstance(name = '-') {
        const viewer = this.viewer;
        const curDCInstanceName = name + '_DCInstance';

        viewer.scene.primitives._primitives.forEach(p => {
            if (p.name && p.name === curDCInstanceName) {
                viewer.scene.primitives.remove(p);
            }
        });
    }
}

export default CustomPrimitive;