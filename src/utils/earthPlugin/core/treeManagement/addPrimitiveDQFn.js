/**
             * 添加DQ数据Primitive（三角形/线）
             * @param {Object} data - 数据对象
             * @param {Array} data.positions - 位置数组 [lon, lat, height, ...]
             * @param {Array} data.indices - 索引数组
             * @param {Array} data.colors - 颜色数组
             * @param {String} [name="-"] - 名称
             * @param {String} [type="triangles"] - 类型："triangles" 或 "lines"
             */
/**
   * 根据DQ值获取颜色（颜色映射）
   * @param {Number} value - DQ值
   * @returns {Array} - RGBA颜色数组 [r, g, b, a]
   */
const getDQColor = (value) => {
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
   * 计算笛卡尔坐标点的大地表面法向量
   * @param {Object} cartesian - Cartesian3坐标
   * @returns {Object} - 法向量
   */
const computeNormal = (cartesian) => {
    const ellipsoid = window.MSIMEarth.Ellipsoid.WGS84;
    return ellipsoid.geodeticSurfaceNormal(cartesian);
}


/**
     * 移除指定名称的DQ Primitive
     * @param {String} [name="-"] - 名称
     */
const removeDQPrimitive = (name = '-', viewers) => {
    const viewer = viewers;
    const curDQName = name || 'DQcustomPrimitive';

    viewer.scene.primitives._primitives.forEach(p => {
        if (p.name && p.name === curDQName) {
            viewer.scene.primitives.remove(p);
        }
    });
}
/**
     * 构建雷达网格线索引（针对雷达极坐标数据格式）
     * @private
     * @param {Object} data - 数据对象
     * @param {Number} lineStep - 线条密度步长
     * @returns {Uint16Array} - 线索引数组
     */
 const  _buildGridLineIndices = (data, lineStep) => {
    const posArray = data.positions;
    const totalPoints = posArray.length / 3;
    
    const tolerance = 0.00001;
    let pointsPerRay = 1;
    const refLon = posArray[0];
    
    for (let i = 3; i < posArray.length; i += 3) {
        const lon = posArray[i];
        if (Math.abs(lon - refLon) < tolerance) {
            pointsPerRay++;
        } else {
            break;
        }
    }
    
    const numRays = Math.floor(totalPoints / pointsPerRay);
    const lineIndices = [];

    for (let ray = 0; ray < numRays; ray += lineStep) {
        let prevValidIndex = null;
        for (let range = 0; range < pointsPerRay; range++) {
            const idx = ray * pointsPerRay + range;
            
            if (prevValidIndex !== null) {
                lineIndices.push(prevValidIndex, idx);
            }
            prevValidIndex = idx;
        }
    }

    for (let range = 0; range < pointsPerRay; range += lineStep) {
        let prevValidIndex = null;
        for (let ray = 0; ray < numRays; ray++) {
            const idx = ray * pointsPerRay + range;
            
            if (prevValidIndex !== null) {
                lineIndices.push(prevValidIndex, idx);
            }
            prevValidIndex = idx;
        }
    }

    return new Uint16Array(lineIndices);
}
export function addPrimitiveDQFn(data, name = '-', type = 'triangles', viewers) {
    const viewer = viewers;
    removeDQPrimitive(name, viewers)

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
        const color = getDQColor(value);
        colors.push(color[0] / 255, color[1] / 255, color[2] / 255, color[3]);

        const normal = computeNormal(cartesian3);
        normalsArray.push(normal.x, normal.y, normal.z);
    }

    const positions = new Float64Array(positionsCar3);
    const sts = new Float32Array(2 * (positions.length / 3));
    // const indices = new Uint16Array(data.indices);
    let indices
    const normals = new Float32Array(normalsArray);

    // 根据类型设置Primitive类型
    let primitiveType;
    switch (type) {
        case 'lines':
            primitiveType = window.MSIMEarth.PrimitiveType.LINES;
            // const newArray = [];
            // let number = 30
            // // const total = positions.length / 3
            // // const vertical = new Set()
            // // for(let i = 0; i < total; i+=number){
            // //     vertical.add(i)
            // // }
            // // console.log('vertical',vertical);
            // for(let i = 0; i<data.indices.length; i+=2*number){
            //     const v0 = data.indices[i]
            //     const v1 = data.indices[i+1]
            //     newArray.push(v0 , v1)
            //     // if (vertical.has(v0)&&vertical.has(v1)) {
            //     //     newArray.push(v0 , v1)
            //     // }
            // }
            // indices = new Uint16Array(newArray);
            indices = _buildGridLineIndices(data, 10);
            break;
        case 'triangles':
        default:
            primitiveType = window.MSIMEarth.PrimitiveType.TRIANGLES;
            indices = new Uint16Array(data.indices);
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
            // normal: new window.MSIMEarth.GeometryAttribute({
            //     componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
            //     componentsPerAttribute: 3,
            //     values: normals
            // }),
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
            vertexColors: true,
            flat: true,
            translucent: true,
            closed: true,
            lighting: false,
            unlit:true
        }),
        asynchronous: false
    });

    primitive.name = name || 'DQcustomPrimitive';
    viewer.scene.primitives.add(primitive);
}