export default class DCInstance {
  constructor(type, instances, enablePick) {
    this.type = type
    this.instances = instances
    this.drawCommand = null
    this.pickIds = []
    this.show = true
    this._hoveredBatchId = -1.0
    this.enablePick = enablePick !== undefined ? enablePick : true
    this.boundingVolume = null
    this._updateBoundingVolume()
  }

  _updateBoundingVolume() {
    if (!this.instances || this.instances.length === 0) {
      this.boundingVolume = null
      return
    }
    let min = new window.MSIMEarth.Cartesian3(
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY
    )
    let max = new window.MSIMEarth.Cartesian3(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY
    )
    const boxHalfSize = 10.0
    for (let i = 0; i < this.instances.length; i++) {
      const inst = this.instances[i]
      const matrix = inst.matrix
      const center = new window.MSIMEarth.Cartesian3(matrix[12], matrix[13], matrix[14])
      min.x = Math.min(min.x, center.x - boxHalfSize)
      min.y = Math.min(min.y, center.y - boxHalfSize)
      min.z = Math.min(min.z, center.z - boxHalfSize)
      max.x = Math.max(max.x, center.x + boxHalfSize)
      max.y = Math.max(max.y, center.y + boxHalfSize)
      max.z = Math.max(max.z, center.z + boxHalfSize)
    }
    this.boundingVolume = window.MSIMEarth.BoundingSphere.fromCornerPoints(min, max)
  }

  createInstancedColorBuffer(context) {
    let instances = this.instances,
      instanceCount = instances.length,
      vertexSizeInFloats = 4,
      bufferData = new Float32Array(instanceCount * vertexSizeInFloats)

    for (let i = 0; i < instanceCount; i++) {
      const instance = instances[i],
        instanceColor = instance.color,
        offset = i * vertexSizeInFloats

      bufferData[offset] = instanceColor.red
      bufferData[offset + 1] = instanceColor.green
      bufferData[offset + 2] = instanceColor.blue
      bufferData[offset + 3] = instanceColor.alpha
    }

    return window.MSIMEarth.Buffer.createVertexBuffer({
      context: context,
      typedArray: bufferData,
      usage: window.MSIMEarth.BufferUsage.STATIC_DRAW
    })
  }

  createInstancedBatchIdBuffer(context) {
    let instances = this.instances,
      instanceCount = instances.length,
      bufferData = new Float32Array(instanceCount)

    for (let i = 0; i < instanceCount; i++) {
      bufferData[i] = i
    }

    return window.MSIMEarth.Buffer.createVertexBuffer({
      context: context,
      typedArray: bufferData,
      usage: window.MSIMEarth.BufferUsage.STATIC_DRAW
    })
  }

  createInstancedPickColorBuffer(context) {
    let instances = this.instances,
      instanceCount = instances.length,
      vertexSizeInFloats = 4,
      bufferData = new Float32Array(instanceCount * vertexSizeInFloats)

    for (let i = 0; i < instanceCount; i++) {
      const instance = instances[i],
        instancePickId = context.createPickId({
          instance: instance,
          primitive: this,
          description: `实例id：${instance.id}`,
          batchId: i
        }),
        pickColor = instancePickId.color,
        offset = i * vertexSizeInFloats
      this.pickIds.push(instancePickId)
      instance.pickId = instancePickId

      bufferData[offset] = pickColor.red
      bufferData[offset + 1] = pickColor.green
      bufferData[offset + 2] = pickColor.blue
      bufferData[offset + 3] = pickColor.alpha
    }

    return window.MSIMEarth.Buffer.createVertexBuffer({
      context: context,
      typedArray: bufferData,
      usage: window.MSIMEarth.BufferUsage.STATIC_DRAW
    })
  }

  createInstancedMatrixBuffer(context) {
    let instances = this.instances,
      instanceCount = instances.length,
      vertexSizeInFloats = 16,
      bufferData = new Float32Array(instanceCount * vertexSizeInFloats)

    for (let i = 0; i < instanceCount; i++) {
      const instance = instances[i],
        instanceMatrix = instance.matrix,
        offset = i * vertexSizeInFloats

      bufferData[offset] = instanceMatrix[0]
      bufferData[offset + 1] = instanceMatrix[4]
      bufferData[offset + 2] = instanceMatrix[8]
      bufferData[offset + 3] = instanceMatrix[12]
      bufferData[offset + 4] = instanceMatrix[1]
      bufferData[offset + 5] = instanceMatrix[5]
      bufferData[offset + 6] = instanceMatrix[9]
      bufferData[offset + 7] = instanceMatrix[13]
      bufferData[offset + 8] = instanceMatrix[2]
      bufferData[offset + 9] = instanceMatrix[6]
      bufferData[offset + 10] = instanceMatrix[10]
      bufferData[offset + 11] = instanceMatrix[14]
      bufferData[offset + 12] = instanceMatrix[3]
      bufferData[offset + 13] = instanceMatrix[7]
      bufferData[offset + 14] = instanceMatrix[11]
      bufferData[offset + 15] = instanceMatrix[15]
    }

    return window.MSIMEarth.Buffer.createVertexBuffer({
      context: context,
      typedArray: bufferData,
      usage: window.MSIMEarth.BufferUsage.STATIC_DRAW
    })
  }

  createCommand(context) {
    var strPickId = 'czm_pickColor'
    var enablePick = this.enablePick

    var box = new window.MSIMEarth.BoxGeometry({
      vertexFormat: window.MSIMEarth.VertexFormat.POSITION_ONLY,
      maximum: new window.MSIMEarth.Cartesian3(10.0, 10.0, 10.0),
      minimum: new window.MSIMEarth.Cartesian3(-10.0, -10.0, -10.0)
    })
    var geometry = window.MSIMEarth.BoxGeometry.createGeometry(box)
    var attributeLocations =
      window.MSIMEarth.GeometryPipeline.createAttributeLocations(geometry)

    var maxAttribLocation = 0
    for (var location in attributeLocations) {
      if (attributeLocations.hasOwnProperty(location)) {
        maxAttribLocation = Math.max(
          maxAttribLocation,
          attributeLocations[location]
        )
      }
    }

    var instances = this.instances,
      instanceCount = instances.length
    var matrixVertexSizeInFloats = 16

    var modelMatrixBuffer = this.createInstancedMatrixBuffer(context)
    var colorBuffer = this.createInstancedColorBuffer(context)

    var componentSizeInBytes = window.MSIMEarth.ComponentDatatype.getSizeInBytes(
      window.MSIMEarth.ComponentDatatype.FLOAT
    )
    var instancedAttributes = {
      modelMatrixRow0: {
        index: maxAttribLocation + 1,
        vertexBuffer: modelMatrixBuffer,
        componentsPerAttribute: 4,
        componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: 0,
        strideInBytes: componentSizeInBytes * matrixVertexSizeInFloats,
        instanceDivisor: 1
      },
      modelMatrixRow1: {
        index: maxAttribLocation + 2,
        vertexBuffer: modelMatrixBuffer,
        componentsPerAttribute: 4,
        componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: componentSizeInBytes * 4,
        strideInBytes: componentSizeInBytes * matrixVertexSizeInFloats,
        instanceDivisor: 1
      },
      modelMatrixRow2: {
        index: maxAttribLocation + 3,
        vertexBuffer: modelMatrixBuffer,
        componentsPerAttribute: 4,
        componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: componentSizeInBytes * 8,
        strideInBytes: componentSizeInBytes * matrixVertexSizeInFloats,
        instanceDivisor: 1
      },
      modelMatrixRow3: {
        index: maxAttribLocation + 4,
        vertexBuffer: modelMatrixBuffer,
        componentsPerAttribute: 4,
        componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: componentSizeInBytes * 12,
        strideInBytes: componentSizeInBytes * matrixVertexSizeInFloats,
        instanceDivisor: 1
      },
      color: {
        index: maxAttribLocation + 5,
        vertexBuffer: colorBuffer,
        componentsPerAttribute: 4,
        componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: 0,
        strideInBytes: componentSizeInBytes * 4,
        instanceDivisor: 1
      }
    }

    if (enablePick) {
      var pickColorBuffer = this.createInstancedPickColorBuffer(context)
      var batchIdBuffer = this.createInstancedBatchIdBuffer(context)
      instancedAttributes.pickColor = {
        index: maxAttribLocation + 6,
        vertexBuffer: pickColorBuffer,
        componentsPerAttribute: 4,
        componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: 0,
        strideInBytes: componentSizeInBytes * 4,
        instanceDivisor: 1
      }
      instancedAttributes.batchId = {
        index: maxAttribLocation + 7,
        vertexBuffer: batchIdBuffer,
        componentsPerAttribute: 1,
        componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
        normalize: false,
        offsetInBytes: 0,
        strideInBytes: 0,
        instanceDivisor: 1
      }
    }

    var vertexArrayAttributes = []
    for (var location in instancedAttributes) {
      if (instancedAttributes.hasOwnProperty(location)) {
        attributeLocations[location] = ++maxAttribLocation
        vertexArrayAttributes.push(instancedAttributes[location])
      }
    }

    var va = window.MSIMEarth.VertexArray.fromGeometry({
      context: context,
      geometry: geometry,
      attributeLocations: attributeLocations,
      vertexArrayAttributes: vertexArrayAttributes
    })

    var vs, fs, uniformMap
    if (enablePick) {
      vs = `
        in vec3 position;
        in vec4 modelMatrixRow0;
        in vec4 modelMatrixRow1;
        in vec4 modelMatrixRow2;
        in vec4 modelMatrixRow3;
        in vec4 pickColor;
        in vec4 color;
        in float batchId;
        out vec4 v_color;
        out vec4 ${strPickId};
        out float v_batchId;
        void main(){
            v_color=color;
            ${strPickId}=pickColor;
            v_batchId=batchId;
            mat4 modelMatrix = mat4(
                modelMatrixRow0.x, modelMatrixRow1.x, modelMatrixRow2.x, modelMatrixRow3.x,
                modelMatrixRow0.y, modelMatrixRow1.y, modelMatrixRow2.y, modelMatrixRow3.y,
                modelMatrixRow0.z, modelMatrixRow1.z, modelMatrixRow2.z, modelMatrixRow3.z,
                modelMatrixRow0.w, modelMatrixRow1.w, modelMatrixRow2.w, modelMatrixRow3.w
            );
            mat4 modelView = czm_view * modelMatrix;
            gl_Position = czm_projection * modelView * vec4(position, 1.0);
        }
        `
      fs = `
        in vec4 ${strPickId};
        in vec4 v_color;
        in float v_batchId;
        uniform float u_hoveredBatchId;
        void main(){
            if (u_hoveredBatchId >= 0.0 && abs(v_batchId - u_hoveredBatchId) < 0.5) {
                out_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
            } else {
                out_FragColor = v_color;
            }
        }
        `
      var that = this
      uniformMap = {
        u_hoveredBatchId() {
          return that._hoveredBatchId
        }
      }
    } else {
      vs = `
        in vec3 position;
        in vec4 modelMatrixRow0;
        in vec4 modelMatrixRow1;
        in vec4 modelMatrixRow2;
        in vec4 modelMatrixRow3;
        in vec4 color;
        out vec4 v_color;
        void main(){
            v_color=color;
            mat4 modelMatrix = mat4(
                modelMatrixRow0.x, modelMatrixRow1.x, modelMatrixRow2.x, modelMatrixRow3.x,
                modelMatrixRow0.y, modelMatrixRow1.y, modelMatrixRow2.y, modelMatrixRow3.y,
                modelMatrixRow0.z, modelMatrixRow1.z, modelMatrixRow2.z, modelMatrixRow3.z,
                modelMatrixRow0.w, modelMatrixRow1.w, modelMatrixRow2.w, modelMatrixRow3.w
            );
            mat4 modelView = czm_view * modelMatrix;
            gl_Position = czm_projection * modelView * vec4(position, 1.0);
        }
        `
      fs = `
        in vec4 v_color;
        void main(){
            out_FragColor = v_color;
        }
        `
      uniformMap = {}
    }

    var shaderProgram = window.MSIMEarth.ShaderProgram.fromCache({
      context: context,
      vertexShaderSource: vs,
      fragmentShaderSource: fs,
      attributeLocations: attributeLocations
    })

    var defaults = {
      frontFace: window.MSIMEarth.WindingOrder.COUNTER_CLOCKWISE,
      cull: {
        enabled: true,
        face: window.MSIMEarth.CullFace.BACK
      },
      lineWidth: 1,
      polygonOffset: {
        enabled: false,
        factor: 0,
        units: 0
      },
      scissorTest: {
        enabled: false,
        rectangle: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      },
      depthRange: {
        near: 0,
        far: 1
      },
      depthTest: {
        enabled: true,
        func: window.MSIMEarth.DepthFunction.LESS
      },
      colorMask: {
        red: true,
        green: true,
        blue: true,
        alpha: true
      },
      depthMask: true,
      stencilMask: ~0,
      blending: {
        enabled: true,
        equationRgb: window.MSIMEarth.BlendEquation.ADD,
        equationAlpha: window.MSIMEarth.BlendEquation.ADD,
        functionSourceRgb: window.MSIMEarth.BlendFunction.SOURCE_ALPHA,
        functionDestinationRgb: window.MSIMEarth.BlendFunction.ONE_MINUS_SOURCE_ALPHA,
        functionSourceAlpha: window.MSIMEarth.BlendFunction.ONE,
        functionDestinationAlpha: window.MSIMEarth.BlendFunction.ZERO
      },
      stencilTest: {
        enabled: false,
        frontFunction: window.MSIMEarth.StencilFunction.ALWAYS,
        backFunction: window.MSIMEarth.StencilFunction.ALWAYS,
        reference: 0,
        mask: ~0,
        frontOperation: {
          fail: window.MSIMEarth.StencilOperation.KEEP,
          zFail: window.MSIMEarth.StencilOperation.KEEP,
          zPass: window.MSIMEarth.StencilOperation.KEEP
        },
        backOperation: {
          fail: window.MSIMEarth.StencilOperation.KEEP,
          zFail: window.MSIMEarth.StencilOperation.KEEP,
          zPass: window.MSIMEarth.StencilOperation.KEEP
        }
      },
      sampleCoverage: {
        enabled: true,
        value: 1.0,
        invert: false
      }
    }

    var renderState = window.MSIMEarth.RenderState.fromCache(defaults)
    var drawCommandOpts = {
      modelMatrix: window.MSIMEarth.Matrix4.IDENTITY,
      vertexArray: va,
      shaderProgram: shaderProgram,
      uniformMap: uniformMap,
      renderState: renderState,
      pass: window.MSIMEarth.Pass.OPAQUE,
      castShadows: false,
      instanceCount: instanceCount
    }
    if (enablePick) {
      drawCommandOpts.pickId = strPickId
    }
    this.drawCommand = new window.MSIMEarth.DrawCommand(drawCommandOpts)
  }

  update(frameState) {
    if (!this.show) {
      return
    }
    if (!this.drawCommand) {
      this.createCommand(frameState.context)
    }
    // 直接用我们预计算的 bounding volume，避免 window.MSIMEarth 每次重新计算
    if (this.boundingVolume) {
      this.drawCommand.boundingVolume = this.boundingVolume
    }
    frameState.commandList.push(this.drawCommand)
  }

  updateInstances(instances) {
    this.instances = instances
    this._updateBoundingVolume()
    this.drawCommand = null
  }

  setEnablePick(enablePick) {
    if (this.enablePick === enablePick) return
    this.enablePick = enablePick
    this.drawCommand = null
  }

  setHoveredBatchId(batchId) {
    this._hoveredBatchId = batchId
  }

  isDestroyed() {
    return false
  }

  destroy() {
    console.log('destroyafafa')

    var drawCommand = this.drawCommand
    if (drawCommand) {
      var va = drawCommand.vertexArray,
        sp = drawCommand.shaderProgram
      if (!va.isDestroyed()) va.destroy()
      if (!sp.isDestroyed || !sp.isDestroyed()) {
        sp.destroy()
      }
      drawCommand.isDestroyed = function returnTrue() {
        return true
      }
      drawCommand.uniformMap = undefined
      drawCommand.renderState = window.MSIMEarth.RenderState.removeFromCache(
        drawCommand.renderState
      )
      this.drawCommand = null
    }
    if (this.pickId) {
      this.pickId.destroy()
      this.pickId = null
    }
    if (this.pickIds) {
      this.pickIds.forEach((pickId) => {
        const flag = pickId.destroy()
      })
      this.pickIds.length = 0
    }
  }
}
