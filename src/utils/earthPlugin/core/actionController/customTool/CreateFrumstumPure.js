class CreateFrustumPure {
  constructor(options) {
    this.position = options.position
    this.orientation = options.orientation
    this.flowSpeed = options.flowSpeed || 2
    this.fov = options.fov || 30
    this.near = options.near || 10
    this.far = options.far || 100
    this.aspectRatio = options.aspectRatio
    this.lineColor =
      options.lineColor || new window.MSIMEarth.Color(0.0, 1.0, 1.0, 1.0)
    this.scanColor = options.scanColor
    this.scanColor2 = options.scanColor2
    this.frustumName = options.frustumName
    this.interval = options.interval
    this.side = options.side
    this.satelliteType = options.satelliteType || 0
    this.id = options.frustumName
    console.log('this.side', this.side)
    this.add()
  }

  // 更新视锥体的姿态
  update(position, orientation) {
    this.position = position
    this.orientation = orientation
    this.add()
  }

  // 创建视锥体和轮廓线
  add() {
    this.clear()
    this.addFrustum()
    // this.addOutline()
  }

  // 清除视锥体和轮廓线
  clear() {
    this.clearFrustum()
    this.clearOutline()
  }

  // 清除视锥体
  clearFrustum() {
    if (this.frustumPrimitive) {
      let primitives = window.EarthViewer.scene.primitives
      // console.log(primitives);
      // if (primitives && !primitives.isDestroyed() &&  )
      if (
        this.frustumPrimitive &&
        !this.frustumPrimitive.isDestroyed() &&
        primitives.contains(this.frustumPrimitive)
      ) {
        let is = primitives.remove(this.frustumPrimitive)
        // console.log('视锥清除', is);
        this.frustumPrimitive = null
      }
    }
  }

  // 清除轮廓线
  clearOutline() {
    let primitives = window.EarthViewer.scene.primitives
    if (
      this.outlinePrimitive &&
      !this.outlinePrimitive.isDestroyed() &&
      primitives.contains(this.outlinePrimitive)
    ) {
      primitives.remove(this.outlinePrimitive)
      this.outlinePrimitive = null
    }
  }

  // 创建视锥体
  addFrustum() {
    let that = this
    let frustum = new window.MSIMEarth.PerspectiveFrustum({
      // 查看的视场角，绕Z轴旋转，以弧度方式输入
      // fov: window.MSIMEarth.Math.PI_OVER_THREE,
      fov: window.MSIMEarth.Math.toRadians(this.fov),
      // 视锥体的宽度/高度
      aspectRatio: this.aspectRatio,
      // 近面距视点的距离
      near: this.near,
      // 远面距视点的距离
      far: this.far
    })
    //

    let geometry = new window.MSIMEarth.FrustumGeometry({
      frustum: frustum,
      origin: this.position,
      orientation: this.orientation,
      vertexFormat: window.MSIMEarth.VertexFormat.POSITION_ONLY
    })
    let cir = window.MSIMEarth.FrustumGeometry.createGeometry(geometry)

    let instance = new window.MSIMEarth.GeometryInstance({
      id: this.frustumName, // 当前锥体的id
      geometry: geometry,
      attributes: {
        color: window.MSIMEarth.ColorGeometryInstanceAttribute.fromColor(
          new window.MSIMEarth.Color(1.0, 0.0, 0.0, 0.5)
        )
      }
    })
    let lineColor = this.lineColor
    if (typeof lineColor == 'undefined') {
      lineColor = new window.MSIMEarth.Color(1.0, 1.0, 1.0, 1.0)
    }
    let scanColor = this.scanColor
    if (typeof scanColor == 'undefined') {
      scanColor = new window.MSIMEarth.Color(4.0, 0.0, 0.0, 1.0)
    }
    let scanColor2 = this.scanColor2
    if (typeof scanColor2 == 'undefined') {
      scanColor2 = new window.MSIMEarth.Color(4.0, 0.0, 0.0, 1.0)
    }
    let primitive = new window.MSIMEarth.Primitive({
      geometryInstances: instance,
      // appearance: new window.MSIMEarth.PerInstanceColorAppearance({
      //     closed: true,
      //     flat: true,
      // }),
      // appearance: new window.MSIMEarth.PerInstanceColorAppearance(),
      appearance: new window.MSIMEarth.EllipsoidSurfaceAppearance({
        material: new window.MSIMEarth.Material({
          fabric: {
            type: that.frustumName,
            uniforms: {
              update: true,
              color: new window.MSIMEarth.Color(0.1804, 0.9725, 0.0745, 0.5), // 颜色
              radians: 0, // 旋转
              width: 0.01, // 线条宽度
              repeat: new window.MSIMEarth.Cartesian2(4.0, 4.0),
              image: '', //'static/image/typhoon4.png',
              time2: 0,
              mixColor: lineColor, //new window.MSIMEarth.Color(0.0, 1.0, 0.0, 1.0),
              mixRatio: 0.0,
              flowSpeed: that.flowSpeed,
              duration: 3000.0,
              lineColor: lineColor,
              scanColor: scanColor,
              scanColor2: scanColor2,
              scanSide: parseFloat(that.side) || 1.0,
              satelliteType: this.satelliteType
              //   iTime: 0,
            },
            source: `
                      #define S(a,b,t) smoothstep(a,b,t)

                      float Rand(float i)
                      {
                          return fract(sin(i * 23325.) * 35543.);
                      }

                      float Random21(vec2 p)
                      {
                          p = fract(p*vec2(242.46,234.960));
                          p += dot(p,p + 23.64);
                          return fract(p.x*p.y);
                      }

                      vec2 Random22(vec2 p)
                      {
                          float n = Random21(p);
                          return vec2(n, Random21(p + n));
                      }

                      float DistLine(vec2 p, vec2 a, vec2 b){
                          vec2 pa = p - a;
                          vec2 ba = b - a;
                          float t = clamp(dot(pa,ba) / dot(ba,ba), 0.,1.);
                          return length(pa- ba*t);
                      }

                      float Line(vec2 p, vec2 a, vec2 b)
                      {
                          float d = DistLine(p,a,b);
                          float m = S(.03,.01,d);
                          m *= S(0.9,0.2,length(a-b));
                          return m;
                      }

                      vec2 GetPosition(vec2 id, vec2 offset){
                          float iTime = czm_frameNumber/60.0;
                          vec2 seed = id + offset;
                          vec2 n = Random22(seed) * (iTime*0.5 + 10.);
                         return offset + sin(n) * .4;
                      }

                      float DrawField(vec2 uv, float scale)
                      {
                          uv *= scale;
                          vec2 gv = fract(uv)- .5;
                          vec2 id = floor(uv);

                          float m = 0.;

                          vec2 p[9];
                          int i = 0;
                          for(float y = -1.; y <= 1.; y++)
                          {
                              for(float x = -1.; x <= 1.; x++)
                              {
                                // switch (i) {
                                //   case 0:
                                //       p[0] = GetPosition(id, vec2(x,y));
                                //       break;
                                //   case 1:
                                //       p[1] = GetPosition(id, vec2(x,y));
                                //       break;
                                //   }
                                  if(i ==0)
                                  {
                                    p[0] = GetPosition(id, vec2(x,y));
                                  }
                                  if(i ==1)
                                  {
                                    p[1] = GetPosition(id, vec2(x,y));
                                  }
                                  if(i ==2)
                                  {
                                    p[2] = GetPosition(id, vec2(x,y));
                                  }
                                  if(i ==3)
                                  {
                                    p[3] = GetPosition(id, vec2(x,y));
                                  }
                                  if(i ==4)
                                  {
                                    p[4] = GetPosition(id, vec2(x,y));
                                  }
                                  if(i ==5)
                                  {
                                    p[5] = GetPosition(id, vec2(x,y));
                                  }
                                  if(i ==6)
                                  {
                                    p[6] = GetPosition(id, vec2(x,y));
                                  }
                                  if(i ==7)
                                  {
                                    p[7] = GetPosition(id, vec2(x,y));
                                  }
                                  if(i ==8)
                                  {
                                    p[8] = GetPosition(id, vec2(x,y));
                                  }
                                  // p[index] = GetPosition(id, vec2(x,y));
                                  i++;
                              }
                          }

                          for(int i=0; i<9; i++)
                          {
                              m += Line(gv,p[4],p[i]);

                          }

                           m += Line(gv,p[1],p[3]);
                           m += Line(gv,p[1],p[5]);
                           m += Line(gv,p[5],p[7]);
                           m += Line(gv,p[7],p[3]);

                           return m;
                          //  return 1.0;
                      }

                      float Grain(vec2 uv)
                      {
                          return (fract(sin(dot(uv, vec2(12.9898,78.233)*2.0)) * 43758.5453));
                      }

                      czm_material czm_getMaterial(czm_materialInput materialInput)
                        {
                            czm_material material = czm_getDefaultMaterial(materialInput);
                            vec2 st = materialInput.st;
                            vec2 fragCoord = st*2.0-vec2(1.0);

                            float iTime = -czm_frameNumber/60.0; // 可见光
                            if(satelliteType == 1.1){ // sar1
                              iTime = czm_frameNumber/120.0;
                              if(st.x<0.5){
                                 iTime = -czm_frameNumber/120.0;
                              }
                            } else if(satelliteType == 1.2){
                              iTime = czm_frameNumber/240.0;
                            } else if(satelliteType == 1.3){ //sar2
                              iTime = sin(czm_frameNumber/30.0);
                            }
                            vec2 iResolution = normalize(czm_viewport.zw);

                            float t = iTime;
                            vec2 uv = st;//st*2.0-vec2(1.0);
                            vec2 mouse = vec2(0.0);//iMouse.xy/iResolution.xy - 0.5;

                            vec2 fieldUV = uv + vec2(-t* 0.5,-t* 0.5);
                            float field = DrawField(fieldUV,20.);
                            float fieldMask = clamp(S(3.5,0.,length(uv *vec2(1.,2.) + vec2(0.0,-0.5))),0.,1.);
                            field *= fieldMask;

                            vec3 backgroundColor = mix(vec3(0.0588, 0.0137, 0.),vec3(0.043,0.0689,0.0294),(uv.y*0.4 + 1.));
                            vec3 color = backgroundColor + lineColor.rgb * field; //backgroundColor + vec3(1.0, 0.0, 1.0) * field; //粒子色 黄
                            // vec3 color = backgroundColor + vec3(1.0, 0.0, 0.0) * field; //粒子色 红
                            // vec3 color = backgroundColor + vec3(0.0, 1.0, 1.0) * field; //粒子色 青

                            vec3 mountain = mix(vec3(0.),color,S(-0.82,-0.8,uv.y))- Grain(uv)*0.05;

                            float x = mod(iTime*1.5, 1.9) - 0.4;
                            float str = -pow((st.x - x) * 110., 2.) + .8;
                            st.y -= clamp(str * .05, 0., 1.);
                            vec4 fragColor2 = vec4(mixColor.rgb,1.0);

                            float colorAdd = pow(1. - pow(abs(st.x - x), .2), 4.);
                            fragColor2.g += colorAdd * .5;
                            if(scanSide < 1.0){
                                fragColor2.r += colorAdd * .5;
                            } else {
                                fragColor2.b += colorAdd * .5;
                            }


                            material.diffuse = lineColor.rgb;//fragColor2.rgb;//mix(fragColor2.rgb, mountain, 0.5);//col;

                            float a = smoothstep(0.0, 1.0, pow(fragColor2.b,0.5)); // 背景粒子感
                            float disY = distance(vec2(st.s,0.5), vec2(0.0,0.5));
                            // material.alpha = 0.6*((1.0-disY)+a*0.02);
                            material.alpha = 0.2;
                            return material;
                        }`
          }
        })
      }),
      asynchronous: false
    })
    primitive.id = this.id
    this.frustumPrimitive = window.EarthViewer.scene.primitives.add(primitive)
  }

  // 创建轮廓线
  addOutline() {
    let frustum = new window.MSIMEarth.PerspectiveFrustum({
      // 查看的视场角度，绕Z轴旋转，以弧度方式输入
      // The angle of the field of view (FOV), in radians.
      // This angle will be used as the horizontal FOV if the width is greater than the height, otherwise it will be the vertical FOV.
      fov: window.MSIMEarth.Math.toRadians(this.fov),
      // 视锥体的宽度/高度
      aspectRatio: this.aspectRatio,
      // 近面距视点的距离
      near: this.near,
      // 远面距视点的距离
      far: this.far
    })
    let geometry = new window.MSIMEarth.FrustumOutlineGeometry({
      frustum: frustum,
      origin: this.position,
      orientation: this.orientation,
      vertexFormat: window.MSIMEarth.VertexFormat.POSITION_ONLY
    })
    let instance = new window.MSIMEarth.GeometryInstance({
      geometry: geometry,
      attributes: {
        color: window.MSIMEarth.ColorGeometryInstanceAttribute.fromColor(
          this.lineColor
        )
      }
    })
    let primitive = new window.MSIMEarth.Primitive({
      geometryInstances: instance,
      appearance: new window.MSIMEarth.PerInstanceColorAppearance({
        closed: true,
        flat: true
      }),
      asynchronous: false
    })
    this.outlinePrimitive = window.EarthViewer.scene.primitives.add(primitive)
  }
}

export default CreateFrustumPure
