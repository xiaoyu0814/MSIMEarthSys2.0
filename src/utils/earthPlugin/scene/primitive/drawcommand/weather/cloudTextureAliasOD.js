// 加载云数据的主函数
export default function createCloudTextureAliasOD(config, earth, viewer) {
  try {
    // 计算中心点
    const centerLon = (config.xmin + config.xmax) / 2;
    const centerLat = (config.ymin + config.ymax) / 2;
    const centerZ = (config.zmin + config.zmax) / 2;

    // 计算四至点的笛卡尔坐标
    const p1 = earth.Cartesian3.fromDegrees(
      config.xmin,
      config.ymin,
      config.zmin
    );
    const p2 = earth.Cartesian3.fromDegrees(
      config.xmax,
      config.ymin,
      config.zmin
    );
    const p3 = earth.Cartesian3.fromDegrees(
      config.xmin,
      config.ymax,
      config.zmin
    );

    const width = earth.Cartesian3.distance(p1, p2);
    const height = earth.Cartesian3.distance(p1, p3);
    const depth = config.zmax - config.zmin;

    const position = earth.Cartesian3.fromDegrees(
      centerLon,
      centerLat,
      centerZ
    );

    const box = earth.BoxGeometry.fromDimensions({
      dimensions: new earth.Cartesian3(1, 1, 1),
    });
    const geometry = earth.BoxGeometry.createGeometry(box);

    // 创建外观
    const humidityAppearance = createHumidityAppearance(earth);

    const rotationX = earth.Matrix4.fromRotationTranslation(
      earth.Matrix3.fromRotationX(earth.Math.toRadians(90))
    );

    const enuMatrix = earth.Transforms.eastNorthUpToFixedFrame(position);
    earth.Matrix4.multiply(enuMatrix, rotationX, enuMatrix);
    const scaleMatrix = earth.Matrix4.fromScale(
      new earth.Cartesian3(width, depth, height)
    );
    const modelMatrix = earth.Matrix4.multiply(
      enuMatrix,
      scaleMatrix,
      new earth.Matrix4()
    );

    // 设置 uniforms
    humidityAppearance.uniforms = {
      cubeTex: viewer.scene.context.defaultTexture,
      transferTex: viewer.scene.context.defaultTexture,
      steps: config.steps,
      alphaCorrection: config.alphaCorrection,
      humidityColorLow: hexToRgb(config.humidityLowColor, earth),
      humidityColorMid: hexToRgb(config.humidityMidColor, earth),
      humidityColorHigh: hexToRgb(config.humidityHighColor, earth),
      gammaCorrection: config.gamma,
      alphaPower: config.alphaPower,
      minThreshold: config.minThreshold,
      maxThreshold: config.maxThreshold,
      opacityScale: config.opacityScale,
      dataCompression: config.dataCompression !== undefined ? config.dataCompression : 0.5,
      // 剖切参数
      clipXEnabled: config.clipXEnabled !== undefined ? config.clipXEnabled : false,
      clipXMin: config.clipXMin !== undefined ? config.clipXMin : 0.0,
      clipXMax: config.clipXMax !== undefined ? config.clipXMax : 1.0,
      clipYEnabled: config.clipYEnabled !== undefined ? config.clipYEnabled : false,
      clipYMin: config.clipYMin !== undefined ? config.clipYMin : 0.0,
      clipYMax: config.clipYMax !== undefined ? config.clipYMax : 1.0,
      clipZEnabled: config.clipZEnabled !== undefined ? config.clipZEnabled : false,
      clipZMin: config.clipZMin !== undefined ? config.clipZMin : 0.0,
      clipZMax: config.clipZMax !== undefined ? config.clipZMax : 1.0,
      // 颜色过滤参数
      colorFilterEnabled: config.colorFilterEnabled !== undefined ? config.colorFilterEnabled : false,
      targetColor: config.targetColor ? hexToRgb(config.targetColor, earth) : new earth.Cartesian3(1.0, 1.0, 1.0),
      colorTolerance: config.colorTolerance !== undefined ? config.colorTolerance : 0.3
    };

    // 创建图元
    const humidityPrimitive = new earth.Primitive({
      geometryInstances: new earth.GeometryInstance({
        geometry: geometry,
        modelMatrix: modelMatrix,
      }),
      appearance: humidityAppearance,
      asynchronous: false,
      // 性能优化参数
      releaseGeometryInstances: false,
      interleave: true,
      shadows: earth.ShadowMode.DISABLED,
      // 确保视锥体剔除正常工作
      cull: true,
    });
    humidityPrimitive.id = config.id || 'CloudPrimitive'

    // 加载纹理
    if (config.texturePath) {
      earth.Resource.createIfNeeded(config.texturePath)
        .fetchImage()
        .then((res) => {
          const cubeTex = new earth.Texture({
            context: viewer.scene.context,
            source: res,
          });
          cubeTex.type = "sampler2D";
          humidityAppearance.uniforms.cubeTex = cubeTex;

          // 添加到场景
          viewer.scene.primitives.add(humidityPrimitive);
          console.log("云层数据加载成功！");
        })
        .catch((error) => {
          console.error("加载云层数据失败：", error);
        });
    } else {
      // 添加到场景
      viewer.scene.primitives.add(humidityPrimitive);
    }

    return humidityPrimitive;
  } catch (error) {
    console.error("加载过程出错：", error);
  }
}

// 将十六进制颜色转换为RGB向量
function hexToRgb(hex, earth) {
  hex = hex.replace(/^#/, "");
  let r = parseInt(hex.substring(0, 2), 16) / 255.0;
  let g = parseInt(hex.substring(2, 4), 16) / 255.0;
  let b = parseInt(hex.substring(4, 6), 16) / 255.0;
  return new earth.Cartesian3(r, g, b);
}

// 创建外观对象
function createHumidityAppearance(earth) {
  return new earth.MaterialAppearance({
    fragmentShaderSource: `
      in vec2 v_st;
      in vec3 vOrigin;
      in vec3 vDirection;
        
      uniform sampler2D  cubeTex, transferTex;
		uniform float steps;
		uniform float alphaCorrection;
		uniform vec3 humidityColorLow;
		uniform vec3 humidityColorMid;
		uniform vec3 humidityColorHigh;
		uniform float gammaCorrection;
		uniform float alphaPower;
		uniform float minThreshold;
		uniform float maxThreshold;
		uniform float opacityScale;
		uniform float dataCompression;
		// 剖切参数
		uniform bool clipXEnabled;
		uniform float clipXMin;
		uniform float clipXMax;
		uniform bool clipYEnabled;
		uniform float clipYMin;
		uniform float clipYMax;
		uniform bool clipZEnabled;
		uniform float clipZMin;
		uniform float clipZMax;
		// 颜色过滤参数
		uniform bool colorFilterEnabled;
		uniform vec3 targetColor;
		uniform float colorTolerance;
		const int MAX_STEPS = 887;

		//Acts like a texture3D using Z slices and trilinear filtering.
		vec4 sampleAs3DTexture( vec3 texCoord )
		{
			const float slicesPerRow = 16.0;
			const float totalSlices = 256.0;
			const float invSlicesPerRow = 1.0 / slicesPerRow;
			
			float zSliceNumber1 = floor(texCoord.z * (totalSlices - 1.0));
			float zSliceNumber2 = min(zSliceNumber1 + 1.0, totalSlices - 1.0);

			vec2 scaledTexCoord = texCoord.xy * invSlicesPerRow;

			vec2 texCoordSlice1 = scaledTexCoord;
			texCoordSlice1.x += mod(zSliceNumber1, slicesPerRow) * invSlicesPerRow;
			texCoordSlice1.y += floor((totalSlices - 1.0 - zSliceNumber1) / slicesPerRow) * invSlicesPerRow;

			vec2 texCoordSlice2 = scaledTexCoord;
			texCoordSlice2.x += mod(zSliceNumber2, slicesPerRow) * invSlicesPerRow;
			texCoordSlice2.y += floor((totalSlices - 1.0 - zSliceNumber2) / slicesPerRow) * invSlicesPerRow;

			vec4 colorSlice1 = texture(cubeTex, texCoordSlice1);
			vec4 colorSlice2 = texture(cubeTex, texCoordSlice2);

			float zDifference = fract(texCoord.z * (totalSlices - 1.0));

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

        void main(){
          vec3 rayDir = normalize(vDirection);
          vec2 bounds = hitBox(vOrigin, rayDir);
          if (bounds.x > bounds.y) discard;
                
          bounds.x = max(bounds.x, 0.0);

          vec3 frontPos = vOrigin + bounds.x * rayDir;
          float rayLength = bounds.y - bounds.x;

          float delta = 1.0 / steps;
          vec3 deltaDirection = rayDir * delta;
          float deltaDirectionLength = length(deltaDirection);

          vec3 currentPosition = frontPos;
          vec4 accumulatedColor = vec4(0.0);
          float accumulatedAlpha = 0.0;
          float accumulatedLength = 0.0;

          float alphaScaleFactor = 25.6 * delta;
          float finalDepth = gl_FragCoord.z;

          for(int i = 0; i < MAX_STEPS; i++)
          {
            vec3 samplePos = currentPosition + 0.5;
            vec4 colorSample = sampleAs3DTexture(samplePos);
            float humidityValue = colorSample.a;
            
            // 剖切检查
            bool clipped = false;
            if(clipXEnabled && (samplePos.x < clipXMin || samplePos.x > clipXMax)) {
              clipped = true;
            }
            if(clipYEnabled && (samplePos.y < clipYMin || samplePos.y > clipYMax)) {
              clipped = true;
            }
            if(clipZEnabled && (samplePos.z < clipZMin || samplePos.z > clipZMax)) {
              clipped = true;
            }
            
            // 颜色过滤检查
            if(colorFilterEnabled) {
              float colorDist = distance(colorSample.rgb, targetColor);
              if(colorDist > colorTolerance) {
                clipped = true;
              }
            }
            
            if(clipped || humidityValue < minThreshold || humidityValue > maxThreshold) {
              currentPosition += deltaDirection;
              accumulatedLength += deltaDirectionLength;
              continue;
            }
            
            float normalizedHumidity = (humidityValue - minThreshold) / (maxThreshold - minThreshold);
            normalizedHumidity = clamp(normalizedHumidity, 0.0, 1.0);

            float alphaSample = pow(normalizedHumidity, alphaPower) * alphaCorrection * opacityScale;
            alphaSample *= (1.0 - accumulatedAlpha);
            alphaSample *= alphaScaleFactor;

            accumulatedColor.rgb += colorSample.rgb * alphaSample;
            accumulatedAlpha += alphaSample;

            if(accumulatedAlpha > 0.01) {
              vec4 clipPos = czm_modelViewProjection * vec4(vOrigin + rayDir * accumulatedLength, 1.0);
              float ndcDepth = clipPos.z / clipPos.w;
              finalDepth = (gl_DepthRange.diff * ndcDepth + gl_DepthRange.near + gl_DepthRange.far) / 2.0;
            }

            currentPosition += deltaDirection;
            accumulatedLength += deltaDirectionLength;

            if(accumulatedLength >= rayLength || accumulatedAlpha >= 1.0) {
              break;
            }
          }

          accumulatedColor.a = accumulatedAlpha;
          
          out_FragColor = accumulatedColor * 1.2;
          gl_FragDepth = finalDepth;
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
      void main()
      {   
          vec4 p=vec4(position3DHigh + position3DLow,1.);
          v_positionEC = (czm_modelView * p).xyz;
          v_normalEC = czm_normal * normal;
          vOrigin=czm_encodedCameraPositionMCHigh+czm_encodedCameraPositionMCLow;
          vDirection=p.xyz-vOrigin;
          gl_Position=czm_modelViewProjection * p;
      }
      `,
    translucent: false,
    closed: true,
    renderState: {
      depthTest: {
        enabled: true,
      },
      depthMask: true,
      blending: {
        enabled: false,
      }
    }
  });
}

