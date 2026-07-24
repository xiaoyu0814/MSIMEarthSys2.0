class Wind3D {
  viewer
  scene
  context
  particlesTextureSize = 128
  particlesCount = 16384
  bounds
  gridDimensions = { x: 32, y: 32, z: 16 }
  windTexture = null
  particlesTextures = []
  velocityTextures = []
  framebuffers = []
  particleState = 0
  primitives = { update: null, draw: null }
  maxWindSpeed = 20
  initialized = !1
  _windThickness
  _windThicknessManual
  speedFactor
  cullSpeedMin
  cullSpeedMax
  windSpeedMin
  windSpeedMax
  arrowLength
  trailLength
  decaySpeed
  alphaFactor
  tadpoleWidth
  curveWidth
  dataSource = 'real'
  _baseParticleCount
  _autoScaleDensity
  _referenceBounds
  _windDataCache = null
  _modelMatrix = window.MSIMEarth.Matrix4.IDENTITY.clone()
  _centerCartesian = new window.MSIMEarth.Cartesian3()
  _centerLonRad = 0
  _centerLatRad = 0
  _needsRebuild = !1
  _fullscreenQuadVA = null
  _isDestroyed = !1
  _show = true
  constructor(viewer, options = {}) {
    this.viewer = viewer
    this.scene = viewer.scene
    this.context = viewer.scene.context
    this._modelMatrix = window.MSIMEarth.Matrix4.IDENTITY.clone()
    this._centerCartesian = new window.MSIMEarth.Cartesian3()
    this.particlesTextureSize = 128
    this.particlesCount = this.particlesTextureSize * this.particlesTextureSize
    this.gridDimensions = { x: 100, y: 100, z: 25 }
    this.bounds = {
      minLon: options.minLon || 0,
      maxLon: options.maxLon || 360,
      minLat: options.minLat || -90,
      maxLat: options.maxLat || 90,
      minHeight: options.minHeight !== undefined ? options.minHeight : 0,
      maxHeight: options.maxHeight !== undefined ? options.maxHeight : 1e4
    }
    this._minHeightManual = void 0 !== options.minHeight
    this._maxHeightManual = void 0 !== options.maxHeight
    this._windThickness = options.windThickness || 9000
    this._windThicknessManual = void 0 !== options.windThickness
    this.speedFactor = 1
    this.cullSpeedMin = 1
    this.cullSpeedMax = 100
    this.windSpeedMin = 0
    this.windSpeedMax = 20
    this.arrowLength = 15e3
    this.trailLength = 2e4
    this.decaySpeed = 0.005
    this.alphaFactor = 1
    this.visualMode = 'tadpole'
    this.tadpoleLength = 300
    this.tadpoleWidth = 15
    this.tadpoleSegments = 8
    this.curveLength = 3e4
    this.curveWidth = 800
    this.curveSegments = 16
    this._baseParticleCount = this.particlesCount
    this._autoScaleDensity = !0
    this._referenceBounds = { ...this.bounds }
    // 层级过滤配置
    this.levelFilterEnabled = false
    this.displayHeightMin = 0
    this.displayHeightMax = 1e4
    this.enabledLevels = []  // 启用的层级高度数组
    this.levelHeights = []   // 数据中的层级高度
    // 显隐控制
    this._show = options.show !== undefined ? Boolean(options.show) : true
    this._updateTransform()
    this.init()
  }

  // 将启用的层级编码为 uniform 数组（最多支持32个层级）
  _getEnabledLevelsUniform() {
    const levels = new Float32Array(32)
    // 第一个元素存储层级数量
    levels[0] = this.enabledLevels.length
    for (let i = 0; i < this.enabledLevels.length && i < 31; i++) {
      levels[i + 1] = this.enabledLevels[i]
    }
    return levels
  }
  get show() {
    return this._show
  }
  set show(value) {
    this._show = Boolean(value)
  }
  get windThickness() {
    return this._windThickness
  }
  set windThickness(e) {
    this._windThickness = Number(e)
    this._windThicknessManual = !0
    if (!this._maxHeightManual) {
      this.bounds.maxHeight = this.bounds.minHeight + this._windThickness
    }
    this._updateTransform()
    this._needsRebuild = !0
  }
  get minHeight() {
    return this.bounds.minHeight
  }
  set minHeight(e) {
    this.bounds.minHeight = Number(e)
    this._minHeightManual = !0
    if (!this._windThicknessManual) {
      this._windThickness = this.bounds.maxHeight - this.bounds.minHeight
    }
    this._updateTransform()
    this._needsRebuild = !0
  }
  get maxHeight() {
    return this.bounds.maxHeight
  }
  set maxHeight(e) {
    this.bounds.maxHeight = Number(e)
    this._maxHeightManual = !0
    if (!this._windThicknessManual) {
      this._windThickness = this.bounds.maxHeight - this.bounds.minHeight
    }
    this._updateTransform()
    this._needsRebuild = !0
  }
  setHeightBounds(min, max) {
    this.bounds.minHeight = Number(min)
    this.bounds.maxHeight = Number(max)
    this._minHeightManual = !0
    this._maxHeightManual = !0
    if (!this._windThicknessManual) {
      this._windThickness = this.bounds.maxHeight - this.bounds.minHeight
    }
    this._updateTransform()
    this._needsRebuild = !0
  }
  // 层级过滤相关API
  enableLevel(height) {
    if (!this.enabledLevels.includes(height)) {
      this.enabledLevels.push(height)
      this._needsRebuild = !0
    }
  }
  disableLevel(height) {
    this.enabledLevels = this.enabledLevels.filter(h => h !== height)
    this._needsRebuild = !0
  }
  setEnabledLevels(heights) {
    this.enabledLevels = [...heights]
    this._needsRebuild = !0
  }
  enableAllLevels() {
    this.enabledLevels = [...this.levelHeights]
    this._needsRebuild = !0
  }
  disableAllLevels() {
    this.enabledLevels = []
    this._needsRebuild = !0
  }
  init() {
    const e = this.generateFakeWindData()
    this.createWindTexture(e)
    this.createParticleTextures()
    this.initialized = !0
  }
  _updateTransform() {
    const e = (this.bounds.minLon + this.bounds.maxLon) / 2
    const t = (this.bounds.minLat + this.bounds.maxLat) / 2
    const n = (this.bounds.minHeight + this.bounds.maxHeight) / 2
    const a = window.MSIMEarth.Cartesian3.fromDegrees(e, t, n)
    this._modelMatrix = window.MSIMEarth.Transforms.eastNorthUpToFixedFrame(a)
    this._centerCartesian = a.clone()
    this._centerLonRad = (e * Math.PI) / 180
    this._centerLatRad = (t * Math.PI) / 180
    if (this.primitives.draw) {
      this.primitives.draw.modelMatrix = this._modelMatrix
    }

  }
  generateFakeWindData() {
    const { x: e, y: t, z: n } = this.gridDimensions
    const a = new Float32Array(e * t * n * 4)

    for (let i = 0; i < n; i++) {
      for (let n = 0; n < t; n++) {
        for (let s = 0; s < e; s++) {
          const o = 4 * (i * t * e + n * e + s)
          const r = (s / e) * 2 - 1
          const d = 20 * -((n / t) * 2 - 1) + 5 * (Math.random() - 0.5)
          const c = 20 * r + 5 * (Math.random() - 0.5)
          const l = 2 * (Math.random() - 0.5)

          a[o] = d
          a[o + 1] = c
          a[o + 2] = l
          a[o + 3] = 0
        }
      }
    }
    console.log('模拟数据', a)
    return a
  }
  createWindTexture(e) {
    const { x: t, y: n, z: a } = this.gridDimensions
    if (this.context.webgl2) {
      const i = this.context._gl
      const s = i.createTexture()
      i.bindTexture(i.TEXTURE_3D, s)
      i.texParameteri(i.TEXTURE_3D, i.TEXTURE_MIN_FILTER, i.LINEAR)
      i.texParameteri(i.TEXTURE_3D, i.TEXTURE_MAG_FILTER, i.LINEAR)
      i.texParameteri(i.TEXTURE_3D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE)
      i.texParameteri(i.TEXTURE_3D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE)
      i.texParameteri(i.TEXTURE_3D, i.TEXTURE_WRAP_R, i.CLAMP_TO_EDGE)
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1)
      i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1)
      i.texImage3D(i.TEXTURE_3D, 0, i.RGBA16F, t, n, a, 0, i.RGBA, i.FLOAT, e)
      this.windTexture = {
        _texture: s,
        _target: i.TEXTURE_3D,
        destroy: () => {
          i.deleteTexture(s)
        }
      }
    }
  }
  createParticleTextures() {
    const e = this.particlesTextureSize
    const t = e * e
    const n = new Float32Array(4 * t)
    for (let o = 0; o < t; o++) {
      n[4 * o] = Math.random()
      n[4 * o + 1] = Math.random()
      n[4 * o + 2] = Math.random()
      n[4 * o + 3] = Math.random()
    }

    const a = {
      context: this.context,
      width: e,
      height: e,
      pixelFormat: window.MSIMEarth.PixelFormat.RGBA,
      pixelDatatype: window.MSIMEarth.PixelDatatype.FLOAT,
      source: { arrayBufferView: n },
      sampler: new window.MSIMEarth.Sampler({
        minificationFilter: window.MSIMEarth.TextureMinificationFilter.NEAREST,
        magnificationFilter: window.MSIMEarth.TextureMagnificationFilter.NEAREST
      })
    }
    this.particlesTextures.push(new window.MSIMEarth.Texture(a))
    this.particlesTextures.push(new window.MSIMEarth.Texture(a))
    const i = new Float32Array(4 * t)
    const s = {
      context: this.context,
      width: e,
      height: e,
      pixelFormat: window.MSIMEarth.PixelFormat.RGBA,
      pixelDatatype: window.MSIMEarth.PixelDatatype.FLOAT,
      source: { arrayBufferView: i },
      sampler: new window.MSIMEarth.Sampler({
        minificationFilter: window.MSIMEarth.TextureMinificationFilter.NEAREST,
        magnificationFilter: window.MSIMEarth.TextureMagnificationFilter.NEAREST
      })
    }
    this.velocityTextures.push(new window.MSIMEarth.Texture(s))
    this.velocityTextures.push(new window.MSIMEarth.Texture(s))
  }
  setParticleCount(e) {
    const t = this.context._gl
    const n = t ? t.getParameter(t.MAX_TEXTURE_SIZE) : 2048
    const a = Math.min(2048, n)
    const i = Math.max(16, Math.min(a, Math.pow(2, Math.round(Math.log2(Math.sqrt(e))))))
    if (i !== this.particlesTextureSize) {
      this.particlesTextureSize = i
      this.particlesCount = i * i
      this.particlesTextures.forEach((e) => e.destroy())
      this.particlesTextures = []
      this.velocityTextures.forEach((e) => e.destroy())
      this.velocityTextures = []
      this.framebuffers.forEach((e) => e.destroy())
      this.framebuffers = []
      this.createParticleTextures()
      this._needsRebuild = !0
    }
  }
  _calcBoundsArea(e) {
    const t = e.maxLon - e.minLon
    const n = e.maxLat - e.minLat
    const a = (((e.minLat + e.maxLat) / 2) * Math.PI) / 180
    return t * n * Math.cos(a)
  }
  _autoScaleParticles() {
    if (!this._autoScaleDensity) return
    const e = this._calcBoundsArea(this._referenceBounds)
    const t = this._calcBoundsArea(this.bounds)
    if (e <= 0 || t <= 0) return
    const n = t / e
    const a = Math.round(this._baseParticleCount * n)
    this.setParticleCount(a)
  }
  setBaseParticleCount(e) {
    this._baseParticleCount = e
    this._referenceBounds = { ...this.bounds }
    this.setParticleCount(e)
  }
  update(e) {
    if (!this.windTexture || this._isDestroyed || !this._show) return
      ; (this.primitives.update && !this._needsRebuild) ||
        ((this._needsRebuild = !1), this.createCommands(e.context)),
        0 === this.framebuffers.length &&
        (this.framebuffers.push(
          new window.MSIMEarth.Framebuffer({
            context: this.context,
            colorTextures: [this.particlesTextures[0], this.velocityTextures[0]],
            destroyAttachments: !1
          })
        ),
          this.framebuffers.push(
            new window.MSIMEarth.Framebuffer({
              context: this.context,
              colorTextures: [this.particlesTextures[1], this.velocityTextures[1]],
              destroyAttachments: !1
            })
          ))
    const t = this.framebuffers[1 - this.particleState]
    this.primitives.update &&
      ((this.primitives.update.framebuffer = t), this.primitives.update.execute(e.context)),
      this.primitives.draw && e.commandList.push(this.primitives.draw),
      (this.particleState = 1 - this.particleState)
  }
  createCommands(e) {
    const t = window.MSIMEarth.RenderState.fromCache({
      viewport: new window.MSIMEarth.BoundingRectangle(
        0,
        0,
        this.particlesTextureSize,
        this.particlesTextureSize
      )
    })
    const n = window.MSIMEarth.ShaderProgram.fromCache({
      context: e,
      vertexShaderSource:
        `
          #version 300 es
          in vec2 position;
          in vec2 textureCoordinates;
          out vec2 v_textureCoordinates;
          void main() 
            {
              gl_Position = vec4(position, 0.0, 1.0);
              v_textureCoordinates = textureCoordinates;
            }   
          `,
      fragmentShaderSource:
        `
          #version 300 es
          precision highp float;
          uniform sampler2D currentParticlesPosition;
          uniform highp sampler3D windTexture;
          uniform float speedFactor;
          uniform float maxWindSpeed;
          uniform float decaySpeed;
          in vec2 v_textureCoordinates;
          layout(location = 0) out vec4 positionOut;
          layout(location = 1) out vec4 velocityOut;
          void main() 
            {
              vec4 particle = texture(currentParticlesPosition, v_textureCoordinates);
              vec3 pos = particle.xyz;
              float packed = particle.w;
              float age = fract(packed);
              age += decaySpeed;
              if (age > 1.0) 
                {
                  age = 0.0;
                  pos = vec3(fract(v_textureCoordinates.x * 12.9898 + v_textureCoordinates.y * 78.233),fract(v_textureCoordinates.x * 53.541 + v_textureCoordinates.y * 12.123),fract(v_textureCoordinates.x * 91.421 + v_textureCoordinates.y * 31.751));
                }
              vec3 windVector = texture(windTexture, pos).xyz;
              float speed = length(windVector);
              float normalizedSpeed = clamp(speed / maxWindSpeed, 0.0, 1.0);
              pos += windVector * speedFactor * 0.0001;
              if (pos.x < 0.0) pos.x += 1.0;
              if (pos.x > 1.0) pos.x -= 1.0;
              if (pos.y < 0.0) pos.y += 1.0;
              if (pos.y > 1.0) pos.y -= 1.0;
              if (pos.z < 0.0) pos.z += 1.0;
              if (pos.z > 1.0) pos.z -= 1.0;
              positionOut = vec4(pos, floor(normalizedSpeed * 255.0) + age);
              velocityOut = vec4(windVector, 0.0);
            }
          `,
      attributeLocations: { position: 0, textureCoordinates: 1 }
    })
    this.primitives.update = new window.MSIMEarth.DrawCommand({
      vertexArray: this.createFullscreenQuad(e),
      primitiveType: window.MSIMEarth.PrimitiveType.TRIANGLES,
      renderState: t,
      shaderProgram: n,
      uniformMap: {
        currentParticlesPosition: () => this.particlesTextures[this.particleState],
        windTexture: () => this.windTexture,
        speedFactor: () => this.speedFactor,
        maxWindSpeed: () => this.maxWindSpeed,
        decaySpeed: () => this.decaySpeed
      }
    })

    if (this.visualMode === 'curve') {
      const segmentsPerCurve = this.curveSegments
      const verticesPerCurve = (segmentsPerCurve + 1) * 2
      const totalVertices = verticesPerCurve * this.particlesCount
      const indices = new Float32Array(totalVertices)

      for (let i = 0; i < totalVertices; i++) {
        indices[i] = i
      }

      const vertexBuffer = window.MSIMEarth.Buffer.createVertexBuffer({
        context: e,
        typedArray: indices,
        usage: window.MSIMEarth.BufferUsage.STATIC_DRAW
      })

      const vertexArray = new window.MSIMEarth.VertexArray({
        context: e,
        attributes: [
          {
            index: 0,
            vertexBuffer: vertexBuffer,
            componentsPerAttribute: 1,
            componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
            normalize: !1
          }
        ]
      })

      const shaderProgram = window.MSIMEarth.ShaderProgram.fromCache({
        context: e,
        vertexShaderSource:
          `
            #version 300 es
            in float particleIndex;
            uniform sampler2D currentParticlesPosition;
            uniform sampler2D velocityTexture;
            uniform float particlesTextureSize;
            uniform float curveLength;
            uniform float curveWidth;
            uniform float speedMin;
            uniform float speedMax;
            uniform float boundsMinLon;
            uniform float boundsMaxLon;
            uniform float boundsMinLat;
            uniform float boundsMaxLat;
            uniform float boundsMinHeight;
            uniform float boundsMaxHeight;
            uniform vec3  centerECEF;
            uniform float centerLonRad;
            uniform float centerLatRad;
            out float v_age;
            out float v_speed;
            out float v_culled;
            out float v_segmentT;
            out float v_height;
            const float wgs84_a  = 6378137.0;
            const float wgs84_e2 = 0.00669437999014;
            vec3 geodeticToECEF(float lon, float lat, float h) 
              {
                float sinLat = sin(lat);
                float cosLat = cos(lat);
                float sinLon = sin(lon);
                float cosLon = cos(lon);
                float N = wgs84_a / sqrt(1.0 - wgs84_e2 * sinLat * sinLat);
                  return vec3((N + h) * cosLat * cosLon,(N + h) * cosLat * sinLon,(N * (1.0 - wgs84_e2) + h) * sinLat);
              }
            mat3 enuToECEFMat(float lon, float lat) 
              {
                float sinLat = sin(lat);
                float cosLat = cos(lat);
                float sinLon = sin(lon);
                float cosLon = cos(lon);
                return mat3
                  (vec3(-sinLon,cosLon,0.0),vec3(-sinLat * cosLon, -sinLat * sinLon,  cosLat),vec3( cosLat * cosLon,  cosLat * sinLon,  sinLat));
              }
            void main() 
              {
                float segmentsPerCurve = 16.0;
                float verticesPerCurve = (segmentsPerCurve + 1.0) * 2.0;
                float pIdx = floor(particleIndex / verticesPerCurve);
                float localIdx = particleIndex - pIdx * verticesPerCurve;
                float segmentIdx = floor(localIdx / 2.0);
                float side = mod(localIdx, 2.0) * 2.0 - 1.0;
                float t = segmentIdx / segmentsPerCurve;
                
                float width = particlesTextureSize;
                float u = (mod(pIdx, width) + 0.5) / width;
                float v = (floor(pIdx / width) + 0.5) / width;
                vec4 particle = texture(currentParticlesPosition, vec2(u, v));
                vec3 posNorm = particle.xyz;
                float packed = particle.w;
                v_age = fract(packed);
                v_speed = floor(packed) / 255.0;
                v_culled = (v_speed < speedMin || v_speed > speedMax) ? 1.0 : 0.0;
                vec3 velocity = texture(velocityTexture, vec2(u, v)).xyz;
                float lon    = mix(boundsMinLon, boundsMaxLon, posNorm.x);
                float lat    = mix(boundsMinLat, boundsMaxLat, posNorm.y);
                float height = mix(boundsMinHeight, boundsMaxHeight, posNorm.z);
                v_height = height;
                vec3 ecefPos = geodeticToECEF(lon, lat, height);
                mat3 ecefToLocal = transpose(enuToECEFMat(centerLonRad, centerLatRad));
                vec3 localPos = ecefToLocal * (ecefPos - centerECEF);
                mat3 particleEnuToEcef = enuToECEFMat(lon, lat);
                vec3 velLocal = ecefToLocal * (particleEnuToEcef * velocity);
                float dirLen = length(velLocal);
                vec3 forward = dirLen > 0.001 ? velLocal / dirLen : vec3(1.0, 0.0, 0.0);
                
                float noiseX = sin(posNorm.x * 20.0 + posNorm.y * 15.0 + pIdx * 0.01);
                float noiseY = cos(posNorm.x * 18.0 - posNorm.y * 22.0 + pIdx * 0.012);
                float noiseZ = sin(posNorm.x * 25.0 + posNorm.y * 12.0 + posNorm.z * 30.0);
                
                vec3 up = vec3(0.0, 0.0, 1.0);
                vec3 right = cross(forward, up);
                float rightLen = length(right);
                  if (rightLen < 0.001) 
                    {
                      right = cross(forward, vec3(0.0, 1.0, 0.0));
                      rightLen = length(right);
                    }
                right = right / max(rightLen, 0.001);
                
                vec3 lateral = cross(right, forward);
                
                float curveIntensity = 0.15 + v_speed * 0.3;
                float curveScale = t * (1.0 - t) * 4.0;
                
                vec3 basePos = localPos - forward * curveLength * t;
                
                vec3 curveOffset = (right * noiseX + lateral * noiseY + up * noiseZ * 0.3) * curveLength * curveScale * curveIntensity;
                
                float widthFactor = 1.0 - t * 0.6;
                float halfWidth = curveWidth * widthFactor * 0.5;
                
                vec3 pos = basePos + right * side * halfWidth + curveOffset;
                v_segmentT = t;
                
                gl_Position = (v_culled > 0.5) ? vec4(0.0) : czm_modelViewProjection * vec4(pos, 1.0);
             }
          `,
        fragmentShaderSource:
          `
            #version 300 es
            precision highp float;
            in float v_age;
            in float v_speed;
            in float v_culled;
            in float v_segmentT;
            in float v_height;
            uniform float alphaFactor;
            uniform float colorSpeedMin;
            uniform float colorSpeedMax;
            uniform float displayHeightMin;
            uniform float displayHeightMax;
            uniform float levelFilterEnabled;
            uniform float enabledLevels[32];
            vec3 speedToColor(float t) 
            {
              vec3 c;
              if (t < 0.25) 
                {
                  float f = t / 0.25;
                  c = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), f);
                } else if (t < 0.5) 
                {
                  float f = (t - 0.25) / 0.25;
                  c = mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), f);
                } else if (t < 0.75) 
                {
                  float f = (t - 0.5) / 0.25;
                  c = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), f);
                } else 
                  {
                    float f = (t - 0.75) / 0.25;
                    c = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), f);
                  }
              return c;
            }
            bool isHeightInEnabledLevels(float height) {
              float count = enabledLevels[0];
              float tolerance = 50.0;
              for (int i = 1; i <= 31; i++) {
                if (float(i) > count) break;
                float levelHeight = enabledLevels[i];
                if (abs(height - levelHeight) < tolerance) {
                  return true;
                }
              }
              return false;
            }
            void main() 
            {
              if (v_culled > 0.5) discard;
              if (levelFilterEnabled > 0.5) {
                if (!isHeightInEnabledLevels(v_height)) {
                  discard;
                }
              }
              float baseAlpha = (1.0 - v_age) * alphaFactor;
              float colorRange = max(colorSpeedMax - colorSpeedMin, 0.001);
              float colorT = clamp((v_speed - colorSpeedMin) / colorRange, 0.0, 1.0);
              vec3 color = speedToColor(colorT);
              float segmentAlpha = baseAlpha * (1.0 - v_segmentT * 0.95);
              out_FragColor = vec4(color, segmentAlpha);
            }
          `,
        attributeLocations: { particleIndex: 0 }
      })

      this.primitives.draw = new window.MSIMEarth.DrawCommand({
        vertexArray: vertexArray,
        primitiveType: window.MSIMEarth.PrimitiveType.TRIANGLE_STRIP,
        shaderProgram: shaderProgram,
        modelMatrix: this._modelMatrix,
        renderState: window.MSIMEarth.RenderState.fromCache({
          depthTest: { enabled: !0, writeMask: !1 },
          blending: window.MSIMEarth.BlendingState.ALPHA_BLEND
        }),
        uniformMap: {
          currentParticlesPosition: () => this.particlesTextures[this.particleState],
          velocityTexture: () => this.velocityTextures[this.particleState],
          particlesTextureSize: () => this.particlesTextureSize,
          curveLength: () => this.curveLength,
          curveWidth: () => this.curveWidth,
          speedMin: () => (this.maxWindSpeed > 0 ? this.cullSpeedMin / this.maxWindSpeed : 0),
          speedMax: () => (this.maxWindSpeed > 0 ? this.cullSpeedMax / this.maxWindSpeed : 1),
          alphaFactor: () => this.alphaFactor,
          colorSpeedMin: () => (this.maxWindSpeed > 0 ? this.windSpeedMin / this.maxWindSpeed : 0),
          colorSpeedMax: () =>
            this.maxWindSpeed > 0 ? Math.min(1, this.windSpeedMax / this.maxWindSpeed) : 1,
          boundsMinLon: () => (this.bounds.minLon * Math.PI) / 180,
          boundsMaxLon: () => (this.bounds.maxLon * Math.PI) / 180,
          boundsMinLat: () => (this.bounds.minLat * Math.PI) / 180,
          boundsMaxLat: () => (this.bounds.maxLat * Math.PI) / 180,
          boundsMinHeight: () => this.bounds.minHeight,
          boundsMaxHeight: () => this.bounds.maxHeight,
          displayHeightMin: () => this.displayHeightMin,
          displayHeightMax: () => this.displayHeightMax,
          levelFilterEnabled: () => this.levelFilterEnabled ? 1.0 : 0.0,
          enabledLevels: () => this._getEnabledLevelsUniform(),
          centerECEF: () => this._centerCartesian,
          centerLonRad: () => this._centerLonRad,
          centerLatRad: () => this._centerLatRad
        },
        pass: window.MSIMEarth.Pass.TRANSLUCENT
      })
    } else if (this.visualMode === 'tadpole') {
      const verticesPerTadpole = 6
      const totalVertices = verticesPerTadpole * this.particlesCount
      const indices = new Float32Array(totalVertices)

      for (let i = 0; i < totalVertices; i++) {
        indices[i] = i
      }

      const vertexBuffer = window.MSIMEarth.Buffer.createVertexBuffer({
        context: e,
        typedArray: indices,
        usage: window.MSIMEarth.BufferUsage.STATIC_DRAW
      })

      const vertexArray = new window.MSIMEarth.VertexArray({
        context: e,
        attributes: [
          {
            index: 0,
            vertexBuffer: vertexBuffer,
            componentsPerAttribute: 1,
            componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
            normalize: !1
          }
        ]
      })

      const shaderProgram = window.MSIMEarth.ShaderProgram.fromCache({
        context: e,
        vertexShaderSource:
          `
            #version 300 es
            in float particleIndex;
            uniform sampler2D currentParticlesPosition;
            uniform sampler2D velocityTexture;
            uniform float particlesTextureSize;
            uniform float tadpoleLength;
            uniform float tadpoleWidth;
            uniform float speedMin;
            uniform float speedMax;
            uniform float boundsMinLon;
            uniform float boundsMaxLon;
            uniform float boundsMinLat;
            uniform float boundsMaxLat;
            uniform float boundsMinHeight;
            uniform float boundsMaxHeight;
            uniform vec3  centerECEF;
            uniform float centerLonRad;
            uniform float centerLatRad;
            out float v_age;
            out float v_speed;
            out float v_culled;
            out float v_segmentT;
            out float v_height;
            const float wgs84_a  = 6378137.0;
            const float wgs84_e2 = 0.00669437999014;
            vec3 geodeticToECEF(float lon, float lat, float h) 
              {
                float sinLat = sin(lat);
                float cosLat = cos(lat);
                float sinLon = sin(lon);
                float cosLon = cos(lon);
                float N = wgs84_a / sqrt(1.0 - wgs84_e2 * sinLat * sinLat);
                  return vec3((N + h) * cosLat * cosLon,(N + h) * cosLat * sinLon,(N * (1.0 - wgs84_e2) + h) * sinLat);
              }
            mat3 enuToECEFMat(float lon, float lat) 
              {
                float sinLat = sin(lat);
                float cosLat = cos(lat);
                float sinLon = sin(lon);
                float cosLon = cos(lon);
                return mat3
                  (vec3(-sinLon,cosLon,0.0),vec3(-sinLat * cosLon, -sinLat * sinLon,  cosLat),vec3( cosLat * cosLon,  cosLat * sinLon,  sinLat));
              }
            void main() 
              {
                float verticesPerTadpole = 6.0;
                float pIdx = floor(particleIndex / verticesPerTadpole);
                float vType = particleIndex - pIdx * verticesPerTadpole;
                
                float width = particlesTextureSize;
                float u = (mod(pIdx, width) + 0.5) / width;
                float v = (floor(pIdx / width) + 0.5) / width;
                vec4 particle = texture(currentParticlesPosition, vec2(u, v));
                vec3 posNorm = particle.xyz;
                float packed = particle.w;
                v_age = fract(packed);
                v_speed = floor(packed) / 255.0;
                v_culled = (v_speed < speedMin || v_speed > speedMax) ? 1.0 : 0.0;
                vec3 velocity = texture(velocityTexture, vec2(u, v)).xyz;
                float lon    = mix(boundsMinLon, boundsMaxLon, posNorm.x);
                float lat    = mix(boundsMinLat, boundsMaxLat, posNorm.y);
                float height = mix(boundsMinHeight, boundsMaxHeight, posNorm.z);
                v_height = height;
                vec3 ecefPos = geodeticToECEF(lon, lat, height);
                mat3 ecefToLocal = transpose(enuToECEFMat(centerLonRad, centerLatRad));
                vec3 localPos = ecefToLocal * (ecefPos - centerECEF);
                mat3 particleEnuToEcef = enuToECEFMat(lon, lat);
                vec3 velLocal = ecefToLocal * (particleEnuToEcef * velocity);
                float dirLen = length(velLocal);
                vec3 forward = dirLen > 0.001 ? velLocal / dirLen : vec3(1.0, 0.0, 0.0);
                vec3 up = vec3(0.0, 0.0, 1.0);
                vec3 right = cross(forward, up);
                float rightLen = length(right);
                  if (rightLen < 0.001) 
                    {
                      right = cross(forward, vec3(0.0, 1.0, 0.0));
                      rightLen = length(right);
                    }
                right = right / max(rightLen, 0.001);
                
                vec3 headPos = localPos;
                vec3 tailPos = localPos - forward * tadpoleLength;
                float halfWidth = tadpoleWidth * 0.5;
                
                vec3 pos;
                float widthFactor;
                
                if (vType < 0.5) 
                {
                  pos = headPos + right * halfWidth;
                  v_segmentT = 0.0;
                } else if (vType < 1.5) {
                  pos = headPos - right * halfWidth;
                  v_segmentT = 0.0;
                } else if (vType < 2.5) {
                  widthFactor = 0.5;
                  pos = tailPos + right * halfWidth * widthFactor;
                  v_segmentT = 1.0;
                } else if (vType < 3.5) {
                  widthFactor = 0.5;
                  pos = tailPos - right * halfWidth * widthFactor;
                  v_segmentT = 1.0;
                } else if (vType < 4.5) {
                  widthFactor = 0.5;
                  pos = tailPos + right * halfWidth * widthFactor;
                  v_segmentT = 1.0;
                } else {
                  pos = headPos - right * halfWidth;
                  v_segmentT = 0.0;
                }
                
                gl_Position = (v_culled > 0.5) ? vec4(0.0) : czm_modelViewProjection * vec4(pos, 1.0);
             }
          `,
        fragmentShaderSource:
          `
            #version 300 es
            precision highp float;
            in float v_age;
            in float v_speed;
            in float v_culled;
            in float v_segmentT;
            in float v_height;
            uniform float alphaFactor;
            uniform float colorSpeedMin;
            uniform float colorSpeedMax;
            uniform float displayHeightMin;
            uniform float displayHeightMax;
            uniform float levelFilterEnabled;
            uniform float enabledLevels[32];
            vec3 speedToColor(float t) 
            {
              vec3 c;
              if (t < 0.25) 
                {
                  float f = t / 0.25;
                  c = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), f);
                } else if (t < 0.5) 
                {
                  float f = (t - 0.25) / 0.25;
                  c = mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), f);
                } else if (t < 0.75) 
                {
                  float f = (t - 0.5) / 0.25;
                  c = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), f);
                } else 
                  {
                    float f = (t - 0.75) / 0.25;
                    c = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), f);
                  }
              return c;
            }
            bool isHeightInEnabledLevels(float height) {
              float count = enabledLevels[0];
              float tolerance = 50.0;
              for (int i = 1; i <= 31; i++) {
                if (float(i) > count) break;
                float levelHeight = enabledLevels[i];
                if (abs(height - levelHeight) < tolerance) {
                  return true;
                }
              }
              return false;
            }
            void main() 
            {
              if (v_culled > 0.5) discard;
              if (levelFilterEnabled > 0.5) {
                if (!isHeightInEnabledLevels(v_height)) {
                  discard;
                }
              }
              float baseAlpha = (1.0 - v_age) * alphaFactor;
              float colorRange = max(colorSpeedMax - colorSpeedMin, 0.001);
              float colorT = clamp((v_speed - colorSpeedMin) / colorRange, 0.0, 1.0);
              vec3 color = speedToColor(colorT);
              float segmentAlpha = baseAlpha * (1.0 - v_segmentT * 0.95);
              out_FragColor = vec4(color, segmentAlpha);
            }
          `,
        attributeLocations: { particleIndex: 0 }
      })

      // 创建 bounding volume 用于深度排序
      const boundingSphere = new window.MSIMEarth.BoundingSphere(this._centerCartesian, (this.bounds.maxHeight - this.bounds.minHeight) * 2)

      this.primitives.draw = new window.MSIMEarth.DrawCommand({
        vertexArray: vertexArray,
        primitiveType: window.MSIMEarth.PrimitiveType.TRIANGLES,
        shaderProgram: shaderProgram,
        modelMatrix: this._modelMatrix,
        renderState: window.MSIMEarth.RenderState.fromCache({
          depthTest: { enabled: !0, writeMask: !1 },
          blending: window.MSIMEarth.BlendingState.ALPHA_BLEND
        }),
        uniformMap: {
          currentParticlesPosition: () => this.particlesTextures[this.particleState],
          velocityTexture: () => this.velocityTextures[this.particleState],
          particlesTextureSize: () => this.particlesTextureSize,
          tadpoleLength: () => this.tadpoleLength,
          tadpoleWidth: () => this.tadpoleWidth,
          speedMin: () => (this.maxWindSpeed > 0 ? this.cullSpeedMin / this.maxWindSpeed : 0),
          speedMax: () => (this.maxWindSpeed > 0 ? this.cullSpeedMax / this.maxWindSpeed : 1),
          alphaFactor: () => this.alphaFactor,
          colorSpeedMin: () => (this.maxWindSpeed > 0 ? this.windSpeedMin / this.maxWindSpeed : 0),
          colorSpeedMax: () =>
            this.maxWindSpeed > 0 ? Math.min(1, this.windSpeedMax / this.maxWindSpeed) : 1,
          boundsMinLon: () => (this.bounds.minLon * Math.PI) / 180,
          boundsMaxLon: () => (this.bounds.maxLon * Math.PI) / 180,
          boundsMinLat: () => (this.bounds.minLat * Math.PI) / 180,
          boundsMaxLat: () => (this.bounds.maxLat * Math.PI) / 180,
          boundsMinHeight: () => this.bounds.minHeight,
          boundsMaxHeight: () => this.bounds.maxHeight,
          displayHeightMin: () => this.displayHeightMin,
          displayHeightMax: () => this.displayHeightMax,
          levelFilterEnabled: () => this.levelFilterEnabled ? 1.0 : 0.0,
          enabledLevels: () => this._getEnabledLevelsUniform(),
          centerECEF: () => this._centerCartesian,
          centerLonRad: () => this._centerLonRad,
          centerLatRad: () => this._centerLatRad
        },
        pass: window.MSIMEarth.Pass.TRANSLUCENT,
        boundingVolume: boundingSphere
      })
    } else {
      const a = 6 * this.particlesCount
      const i = new Float32Array(a)
      for (let o = 0; o < a; o++) i[o] = o
      const s = window.MSIMEarth.Buffer.createVertexBuffer({
        context: e,
        typedArray: i,
        usage: window.MSIMEarth.BufferUsage.STATIC_DRAW
      })
      const r = new window.MSIMEarth.VertexArray({
        context: e,
        attributes: [
          {
            index: 0,
            vertexBuffer: s,
            componentsPerAttribute: 1,
            componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
            normalize: !1
          }
        ]
      })
      const d = window.MSIMEarth.ShaderProgram.fromCache({
        context: e,
        vertexShaderSource:
          `
            #version 300 es
            in float particleIndex;
            uniform sampler2D currentParticlesPosition;
            uniform sampler2D velocityTexture;
            uniform float particlesTextureSize;
            uniform float arrowLength;
            uniform float trailLength;
            uniform float speedMin;
            uniform float speedMax;
            uniform float boundsMinLon;
            uniform float boundsMaxLon;
            uniform float boundsMinLat;
            uniform float boundsMaxLat;
            uniform float boundsMinHeight;
            uniform float boundsMaxHeight;
            uniform vec3  centerECEF;
            uniform float centerLonRad;
            uniform float centerLatRad;
            out float v_age;
            out float v_speed;
            out float v_culled;
            const float wgs84_a  = 6378137.0;
            const float wgs84_e2 = 0.00669437999014;
            vec3 geodeticToECEF(float lon, float lat, float h) 
              {
                float sinLat = sin(lat);
                float cosLat = cos(lat);
                float sinLon = sin(lon);
                float cosLon = cos(lon);
                float N = wgs84_a / sqrt(1.0 - wgs84_e2 * sinLat * sinLat);
                  return vec3((N + h) * cosLat * cosLon,(N + h) * cosLat * sinLon,(N * (1.0 - wgs84_e2) + h) * sinLat);
              }
            mat3 enuToECEFMat(float lon, float lat) 
              {
                float sinLat = sin(lat);
                float cosLat = cos(lat);
                float sinLon = sin(lon);
                float cosLon = cos(lon);
                return mat3
                  (vec3(-sinLon,cosLon,0.0),vec3(-sinLat * cosLon, -sinLat * sinLon,  cosLat),vec3( cosLat * cosLon,  cosLat * sinLon,  sinLat));
              }
            void main() 
              {
                float pIdx = floor(particleIndex / 6.0);
                float vType = particleIndex - pIdx * 6.0;
                float width = particlesTextureSize;
                float u = (mod(pIdx, width) + 0.5) / width;
                float v = (floor(pIdx / width) + 0.5) / width;
                vec4 particle = texture(currentParticlesPosition, vec2(u, v));
                vec3 posNorm = particle.xyz;
                float packed = particle.w;
                v_age = fract(packed);
                v_speed = floor(packed) / 255.0;
                v_culled = (v_speed < speedMin || v_speed > speedMax) ? 1.0 : 0.0;
                vec3 velocity = texture(velocityTexture, vec2(u, v)).xyz;
                float lon    = mix(boundsMinLon, boundsMaxLon, posNorm.x);
                float lat    = mix(boundsMinLat, boundsMaxLat, posNorm.y);
                float height = mix(boundsMinHeight, boundsMaxHeight, posNorm.z);
                v_height = height;
                vec3 ecefPos = geodeticToECEF(lon, lat, height);
                mat3 ecefToLocal = transpose(enuToECEFMat(centerLonRad, centerLatRad));
                vec3 localPos = ecefToLocal * (ecefPos - centerECEF);
                mat3 particleEnuToEcef = enuToECEFMat(lon, lat);
                vec3 velLocal = ecefToLocal * (particleEnuToEcef * velocity);
                float dirLen = length(velLocal);
                vec3 forward = dirLen > 0.001 ? velLocal / dirLen : vec3(1.0, 0.0, 0.0);
                vec3 up = vec3(0.0, 0.0, 1.0);
                vec3 right = cross(forward, up);
                float rightLen = length(right);
                  if (rightLen < 0.001) 
                    {
                       right = cross(forward, vec3(0.0, 1.0, 0.0));
                       rightLen = length(right);
                    }
                right = right / max(rightLen, 0.001);
                float headLen   = arrowLength * 0.3;
                float headWidth = arrowLength * 0.15;
                vec3 tip = localPos + forward * arrowLength;
                vec3 tail = localPos - forward * trailLength;
                vec3 headBase  = tip - forward * headLen;
                vec3 leftWing  = headBase + right * headWidth;
                vec3 rightWing = headBase - right * headWidth;
                vec3 pos;
                if (vType < 0.5) 
                {
                  pos = tail;
                } else if (vType < 1.5) {
                  pos = tip;
                } else if (vType < 2.5) {
                 pos = tip;
                } else if (vType < 3.5) {
                 pos = leftWing;
                 } else if (vType < 4.5) {
                 pos = tip;
                 } else {
                 pos = rightWing;
                }
                gl_Position = (v_culled > 0.5) ? vec4(0.0) : czm_modelViewProjection * vec4(pos, 1.0);
             }
          `,
        fragmentShaderSource:
          `
            #version 300 es
            precision highp float;
            in float v_age;
            in float v_speed;
            in float v_culled;
            uniform float alphaFactor;
            uniform float colorSpeedMin;
            uniform float colorSpeedMax;
            vec3 speedToColor(float t) 
            {
              vec3 c;
              if (t < 0.25) 
                {
                  float f = t / 0.25;
                  c = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), f);
                } else if (t < 0.5) 
                {
                  float f = (t - 0.25) / 0.25;
                  c = mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), f);
                } else if (t < 0.75) 
                {
                  float f = (t - 0.5) / 0.25;
                  c = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), f);
                } else 
                  {
                    float f = (t - 0.75) / 0.25;
                    c = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), f);
                  }
              return c;
              }
              void main() 
                {
                  if (v_culled > 0.5) discard;
                  float alpha = (1.0 - v_age) * alphaFactor;
                  float colorRange = max(colorSpeedMax - colorSpeedMin, 0.001);
                  float colorT = clamp((v_speed - colorSpeedMin) / colorRange, 0.0, 1.0);
                  vec3 color = speedToColor(colorT);
                  out_FragColor = vec4(color, alpha);
                }

          `,
        attributeLocations: { particleIndex: 0 }
      })
      // 创建 bounding volume 用于深度排序
      const boundingSphere = new window.MSIMEarth.BoundingSphere(this._centerCartesian, (this.bounds.maxHeight - this.bounds.minHeight) * 2)

      this.primitives.draw = new window.MSIMEarth.DrawCommand({
        vertexArray: r,
        primitiveType: window.MSIMEarth.PrimitiveType.LINES,
        shaderProgram: d,
        modelMatrix: this._modelMatrix,
        renderState: window.MSIMEarth.RenderState.fromCache({
          depthTest: { enabled: !0, writeMask: !1 },
          blending: window.MSIMEarth.BlendingState.ALPHA_BLEND
        }),
        uniformMap: {
          currentParticlesPosition: () => this.particlesTextures[this.particleState],
          velocityTexture: () => this.velocityTextures[this.particleState],
          particlesTextureSize: () => this.particlesTextureSize,
          arrowLength: () => this.arrowLength,
          trailLength: () => this.trailLength,
          speedMin: () => (this.maxWindSpeed > 0 ? this.cullSpeedMin / this.maxWindSpeed : 0),
          speedMax: () => (this.maxWindSpeed > 0 ? this.cullSpeedMax / this.maxWindSpeed : 1),
          alphaFactor: () => this.alphaFactor,
          colorSpeedMin: () => (this.maxWindSpeed > 0 ? this.windSpeedMin / this.maxWindSpeed : 0),
          colorSpeedMax: () =>
            this.maxWindSpeed > 0 ? Math.min(1, this.windSpeedMax / this.maxWindSpeed) : 1,
          boundsMinLon: () => (this.bounds.minLon * Math.PI) / 180,
          boundsMaxLon: () => (this.bounds.maxLon * Math.PI) / 180,
          boundsMinLat: () => (this.bounds.minLat * Math.PI) / 180,
          boundsMaxLat: () => (this.bounds.maxLat * Math.PI) / 180,
          boundsMinHeight: () => this.bounds.minHeight,
          boundsMaxHeight: () => this.bounds.maxHeight,
          displayHeightMin: () => this.displayHeightMin,
          displayHeightMax: () => this.displayHeightMax,
          levelFilterEnabled: () => this.levelFilterEnabled ? 1.0 : 0.0,
          enabledLevels: () => this._getEnabledLevelsUniform(),
          centerECEF: () => this._centerCartesian,
          centerLonRad: () => this._centerLonRad,
          centerLatRad: () => this._centerLatRad
        },
        pass: window.MSIMEarth.Pass.TRANSLUCENT,
        boundingVolume: boundingSphere
      })
    }
  }
  createFullscreenQuad(e) {
    if (this._fullscreenQuadVA) return this._fullscreenQuadVA

    const t = window.MSIMEarth.Buffer.createVertexBuffer({
      context: e,
      typedArray: new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]),
      usage: window.MSIMEarth.BufferUsage.STATIC_DRAW
    })

    const n = window.MSIMEarth.Buffer.createVertexBuffer({
      context: e,
      typedArray: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      usage: window.MSIMEarth.BufferUsage.STATIC_DRAW
    })

    const a = window.MSIMEarth.Buffer.createIndexBuffer({
      context: e,
      typedArray: new Uint16Array([0, 1, 2, 0, 2, 3]),
      usage: window.MSIMEarth.BufferUsage.STATIC_DRAW,
      indexDatatype: window.MSIMEarth.IndexDatatype.UNSIGNED_SHORT
    })

    this._fullscreenQuadVA = new window.MSIMEarth.VertexArray({
      context: e,
      attributes: [
        {
          index: 0,
          vertexBuffer: t,
          componentsPerAttribute: 2,
          componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT
        },
        {
          index: 1,
          vertexBuffer: n,
          componentsPerAttribute: 2,
          componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT
        }
      ],
      indexBuffer: a
    })

    return this._fullscreenQuadVA
  }
  async switchToRealData(e) {
    if (this._isDestroyed) {
      return
    }

    try {
      const t = await fetch(e)

      if (this._isDestroyed) {
        return
      }

      const n = await t.json()
      debugger
      if (this._isDestroyed) {
        return
      }

      this._windDataCache = n
      this._rebuildFromCache()
      this.dataSource = 'real'
    } catch (t) {
    }
  }

  async switchToRealDataWithBounds(e, bounds) {
    if (this._isDestroyed) {
      return
    }

    try {
      const t = await fetch(e)

      if (this._isDestroyed) {
        return
      }

      const n = await t.json()
      if (this._isDestroyed) {
        return
      }

      if (bounds) {
        n.header.lo1 = bounds.lo1 !== undefined ? bounds.lo1 : n.header.lo1
        n.header.lo2 = bounds.lo2 !== undefined ? bounds.lo2 : n.header.lo2
        n.header.la1 = bounds.la1 !== undefined ? bounds.la1 : n.header.la1
        n.header.la2 = bounds.la2 !== undefined ? bounds.la2 : n.header.la2
        if (bounds.minHeight !== undefined) {
          this.bounds.minHeight = bounds.minHeight
          this._minHeightManual = true
        }
        if (bounds.maxHeight !== undefined) {
          this.bounds.maxHeight = bounds.maxHeight
          this._maxHeightManual = true
        }
      }

      this._windDataCache = n
      this._rebuildFromCache()
      this.dataSource = 'real'
    } catch (t) {
    }
  }
  _rebuildFromCache() {
    if (this._isDestroyed || !this._windDataCache) return
    const e = this._windDataCache.header
    this.bounds.minLon = e.lo1
    this.bounds.maxLon = e.lo2
    this.bounds.minLat = e.la1
    this.bounds.maxLat = e.la2
    const { nx: t, ny: n, nz: a } = e
    const i = this._windDataCache.data.u
    const s = this._windDataCache.data.v
    const o = this._windDataCache.data.w
    let r = Math.max(0, Math.floor((this.bounds.minLon - e.lo1) / e.dx))
    let d = Math.min(t - 1, Math.ceil((this.bounds.maxLon - e.lo1) / e.dx))
    let c = Math.max(0, Math.floor((this.bounds.minLat - e.la1) / e.dy))
    let l = Math.min(n - 1, Math.ceil((this.bounds.maxLat - e.la1) / e.dy))
    const h = Math.max(2, d - r + 1)
    const u = Math.max(2, l - c + 1)
    this.gridDimensions.x = h
    this.gridDimensions.y = u
    this.gridDimensions.z = a
    const m = new Float32Array(h * u * a * 4)
    for (let x = 0; x < a; x++) {
      const e = a - 1 - x
      for (let a = 0; a < u; a++) {
        const d = c + a
        for (let c = 0; c < h; c++) {
          const l = r + c
          const p = e * n * t + d * t + l
          const f = 4 * (x * u * h + a * h + c)
          if (d >= 0 &&
            d < n &&
            l >= 0 &&
            l < t) {
            m[f] = i[p]
            m[f + 1] = s[p]
            m[f + 2] = o[p]
            m[f + 3] = 0
          }
        }
      }
    }
    if (this.windTexture) {
      this.windTexture.destroy()
      this.windTexture = null
      this.createWindTexture(m)
    }
    const p = Math.max(Math.abs(e.uMin), Math.abs(e.uMax))
    const f = Math.max(Math.abs(e.vMin), Math.abs(e.vMax))
    this.maxWindSpeed = Math.sqrt(p * p + f * f)
    if (e.levelHeights &&
      e.levelHeights.length > 0) {
      this.levelHeights = [...e.levelHeights].sort((a, b) => a - b)
      // 初始化 enabledLevels 为全部启用
      if (this.enabledLevels.length === 0) {
        this.enabledLevels = [...this.levelHeights]
      }
      // 初始化 displayHeightMin/Max
      if (this.displayHeightMin === 0 && this.displayHeightMax === 1e4) {
        this.displayHeightMin = Math.min(...this.levelHeights)
        this.displayHeightMax = Math.max(...this.levelHeights)
      }
      if (!this._minHeightManual) {
        this.bounds.minHeight = Math.min(...e.levelHeights)
      }
      if (!this._maxHeightManual) {
        this.bounds.maxHeight = Math.max(...e.levelHeights)
      }
      if (!this._windThicknessManual) {
        this._windThickness = this.bounds.maxHeight - this.bounds.minHeight
      }
    }
    this._updateTransform()
    this._needsRebuild = !0
  }
  setBounds(e, t, n, a) {
    this.bounds.minLon = e
    this.bounds.maxLon = t
    this.bounds.minLat = n
    this.bounds.maxLat = a
    this._autoScaleParticles()

    if ('real' === this.dataSource && this._windDataCache) {
      this._rebuildFromCache()
    } else {
      this.gridDimensions.x = 100
      this.gridDimensions.y = 100
      this.gridDimensions.z = 25
      if (this.windTexture) {
        this.windTexture.destroy()
        this.windTexture = null
      }
      const e = this.generateFakeWindData()
      this.createWindTexture(e)
      this._updateTransform()
      this._needsRebuild = !0
    }
  }
  loadGeoJSON(e) {
    let t = e
    if ('string' == typeof t) {
      t = JSON.parse(t)
    }

    const n = []

    const a = (e) => {
      if (e) {
        if ('FeatureCollection' === e.type && e.features) {
          e.features.forEach((e) => a(e))
        } else if ('Feature' === e.type && e.geometry) {
          a(e.geometry)
        } else if ('GeometryCollection' === e.type && e.geometries) {
          e.geometries.forEach((e) => a(e))
        } else if (e.coordinates) {
          const t = (e) => {
            if (Array.isArray(e) && 'number' == typeof e[0]) {
              n.push(e)
            } else if (Array.isArray(e)) {
              e.forEach(t)
            }
          }
          t(e.coordinates)
        }
      }
    }

    a(t)

    if (0 === n.length) {
      return null
    }

    let i = 1 / 0
    let s = -1 / 0
    let o = 1 / 0
    let r = -1 / 0

    for (const d of n) {
      const e = d[0]
      const t = d[1]

      if (void 0 !== e && void 0 !== t) {
        if (e < i) {
          i = e
        }
        if (e > s) {
          s = e
        }
        if (t < o) {
          o = t
        }
        if (t > r) {
          r = t
        }
      }
    }

    i = Math.max(-180, i - 0.5)
    s = Math.min(360, s + 0.5)
    o = Math.max(-90, o - 0.5)
    r = Math.min(90, r + 0.5)

    this.setBounds(i, s, o, r)

    return { minLon: i, maxLon: s, minLat: o, maxLat: r }
  }
  switchToFakeData() {
    this._windDataCache = null
    this.gridDimensions.x = 100
    this.gridDimensions.y = 100
    this.gridDimensions.z = 25
    this.bounds.minHeight = 0
    this.bounds.maxHeight = 1e4

    if (this.windTexture) {
      this.windTexture.destroy()
      this.windTexture = null
    }

    const e = this.generateFakeWindData()
    this.createWindTexture(e)
    this.maxWindSpeed = 20
    this.dataSource = 'fake'
    this._updateTransform()
    this._needsRebuild = !0
  }
  destroy() {
    this._isDestroyed = !0

    if (this.windTexture) {
      this.windTexture.destroy()
    }

    this.particlesTextures.forEach((e) => {
      if (e) {
        e.destroy()
      }
    })

    this.velocityTextures.forEach((e) => {
      if (e) {
        e.destroy()
      }
    })

    this.framebuffers.forEach((e) => {
      if (e) {
        e.destroy()
      }
    })

    if (this._fullscreenQuadVA) {
      this._fullscreenQuadVA.destroy()
    }
  }
  isDestroyed() {
    return !0 === this._isDestroyed
  }
  flyTo() {
    const e = (this.bounds.minLon + this.bounds.maxLon) / 2
    const t = (this.bounds.minLat + this.bounds.maxLat) / 2
    this.viewer.camera.flyTo({
      destination: window.MSIMEarth.Cartesian3.fromDegrees(e, t, 2e6)
    })
  }
}

export default Wind3D