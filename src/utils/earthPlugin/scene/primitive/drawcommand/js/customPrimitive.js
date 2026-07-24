/**
 * CustomPrimitive 类
 * 用于体积渲染的自定义图元，支持通过 3D 纹理实现体积数据的可视化
 * 实现了体积光线投射算法，可以渲染气象云、烟雾等体积数据
 */
import { Texture3D } from './Texture3D.js'

/**
 * 体积渲染的片段着色器源码
 * 实现了光线投射算法，支持体积数据的渲染和颜色映射
 */
const fragmentShaderSource = `
precision highp float;
precision highp sampler3D;

uniform sampler3D map;
uniform float threshold;
uniform float detail;
uniform float xCut;
uniform float yCut;
uniform float zCut;
uniform vec4 colors[15];
uniform float colorsKey[15];

in vec3 vOrigin;
in vec3 vDirection;

/**
 * 计算光线与立方体的交点
 * @param orig 光线起点
 * @param dir 光线方向
 * @return 进入点和离开点的距离
 */
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

/**
 * 从3D纹理中采样
 * @param p 采样点坐标
 * @return 采样值
 */
float sampleMap(vec3 p) {
  return texture(map, p).a;
}

/**
 * 基于值获取对应的颜色
 * @param value 体积数据值，范围 0.0-1.0
 * @return 对应的颜色，包含透明度
 */
vec4 getColor(float value) {
  float originalValue = value * 255.0;
  vec4 color1 = vec4(0.0);
  vec4 color2 = vec4(0.0);
  float key1 = 0.0;
  float key2 = 0.0;

  // 计算当前值在哪一个区间
  for(int i = 0; i < 15; i++) {
    // 获取到最小的大于当前值的位置
    if(originalValue < colorsKey[i]) {
      // 如果是第一位，则无法插值
      if(i == 0) {
        break;
      }

      key1 = colorsKey[i - 1];
      key2 = colorsKey[i];
      color1 = colors[i - 1];
      color2 = colors[i];
      break;
    }
  }

  // 确定两个颜色区间之间的混合程度
  float mixValue = (originalValue - key1) / (key2 - key1);

  // 计算当前颜色
  vec4 finalColor = mix(color1, color2, mixValue);

  return finalColor;
}

/**
 * Alpha混合
 * @param color1 前景色
 * @param color2 背景色
 * @return 混合后的颜色
 */
vec4 alphaBlending(vec4 color1, vec4 color2) {
  float a1 = color1.a;
  float a2 = color2.a;
  float a = 1.0 - (1.0 - a1) * (1.0 - a2);

  float R = (a1 * color1.r + (1.0 - a1) * a2 * color2.r) / a;
  float G = (a1 * color1.g + (1.0 - a1) * a2 * color2.g) / a;
  float B = (a1 * color1.b + (1.0 - a1) * a2 * color2.b) / a;

  return vec4(R, G, B, a);
}

void main() {
  // 初始化色带
  vec4 color = vec4(0.0);
  vec3 rayDir = normalize(vDirection);
  vec2 bounds = hitBox(vOrigin, rayDir);

  if(bounds.x > bounds.y)
    discard;

  bounds.x = max(bounds.x, 0.0);
  vec3 p = vOrigin + bounds.x * rayDir;
  vec3 inc = 1.0 / abs(rayDir);
  float delta = min(inc.x, min(inc.y, inc.z));
  delta /= detail;

  // 执行光线投射
  for(float t = bounds.x; t < bounds.y; t += delta) {
    if(p.x > xCut && p.y > yCut && p.z < zCut) {
      float value = sampleMap(p + 0.5);
      if(value < threshold) {
        if(color.a >= 1.0) {
          break;
        }
        color = alphaBlending(color, getColor(value));
      }
    }

    p += rayDir * delta;
  }
  out_FragColor = color;
}
`

/**
 * 顶点着色器源码
 * 计算摄像机位置和方向，用于体积光线投射
 */
const vertexShaderSource = `
in vec3 position;
in vec2 st;

out vec3 vOrigin;
out vec3 vDirection;
out vec2 vst;

void main()
{
    vOrigin = czm_encodedCameraPositionMCHigh+czm_encodedCameraPositionMCLow;
    vDirection=position-vOrigin;
    vst=st;

    gl_Position = czm_modelViewProjection * vec4(position,1.0);
}
`

/**
 * 自定义图元类
 * 用于在window.MSIMEarth中实现体积数据的光线投射渲染
 */
class DCPrimitive { constructor(options) { this['\u006F\u0070\u0074\u0069\u006F\u006E\u0073'] = options; this['\u0076\u0069\u0065\u0077\u004D\u006F\u0064\u0065\u006C'] = options['\u0076\u0069\u0065\u0077\u004D\u006F\u0064\u0065\u006C'] || { "threshold": 65, '\u0064\u0065\u0074\u0061\u0069\u006C': 300, '\u0078\u0043\u0075\u0074': -0.5, '\u0079\u0043\u0075\u0074': -0.5, "zCut": 0.5 }; this['\u0067\u0065\u006F\u006D\u0065\u0074\u0072\u0079'] = options['\u0067\u0065\u006F\u006D\u0065\u0074\u0072\u0079']; this['\u0064\u0061\u0074\u0061'] = options['\u0064\u0061\u0074\u0061']; this['\u0074\u0065\u0078\u0074\u0075\u0072\u0065'] = null; if (!this['\u0064\u0061\u0074\u0061'] || !this['\u0064\u0061\u0074\u0061']['\u0076\u0061\u006C\u0075\u0065\u0073'] || this['\u0064\u0061\u0074\u0061']['\u0076\u0061\u006C\u0075\u0065\u0073']['\u006C\u0065\u006E\u0067\u0074\u0068'] === (394574 ^ 394574)) { console['\u0065\u0072\u0072\u006F\u0072']("\u4F9B\u63D0\u672A\u6216\u6548\u65E0\u636E\u6570 :evitimirPCD".split("").reverse().join("")); return; } if (typeof this['\u0064\u0061\u0074\u0061']['\u0078\u006D\u0069\u006E'] !== "\u006E\u0075\u006D\u0062\u0065\u0072" || typeof this['\u0064\u0061\u0074\u0061']['\u0078\u006D\u0061\u0078'] !== "\u006E\u0075\u006D\u0062\u0065\u0072" || typeof this['\u0064\u0061\u0074\u0061']['\u0079\u006D\u0069\u006E'] !== "rebmun".split("").reverse().join("") || typeof this['\u0064\u0061\u0074\u0061']['\u0079\u006D\u0061\u0078'] !== "rebmun".split("").reverse().join("") || typeof this['\u0064\u0061\u0074\u0061']['\u007A\u006D\u0069\u006E'] !== "\u006E\u0075\u006D\u0062\u0065\u0072" || typeof this['\u0064\u0061\u0074\u0061']['\u007A\u006D\u0061\u0078'] !== "\u006E\u0075\u006D\u0062\u0065\u0072") { console['\u0065\u0072\u0072\u006F\u0072']("\u0044\u0043\u0050\u0072\u0069\u006D\u0069\u0074\u0069\u0076\u0065\u003A\u0020\u8FB9\u754C\u6570\u636E\u65E0\u6548"); return; } var _0x43d39b = (998556 ^ 998548) + (425160 ^ 425160); const colors = options['\u0063\u006F\u006C\u006F\u0072\u0073'] ?? ["\u0072\u0067\u0062\u0028\u0030\u002C\u0030\u002C\u0030\u002C\u0030\u0029", "\u0072\u0067\u0062\u0028\u0031\u0037\u0030\u002C\u0033\u0036\u002C\u0032\u0035\u0030\u0029", "\u0072\u0067\u0062\u0061\u0028\u0032\u0031\u0032\u002C\u0031\u0034\u0032\u002C\u0032\u0035\u0034\u002C\u0030\u002E\u0031\u0033\u0029", "\u0072\u0067\u0062\u0061\u0028\u0032\u0033\u0038\u002C\u0032\u002C\u0034\u0038\u002C\u0030\u002E\u0031\u0032\u0029", "\u0072\u0067\u0062\u0061\u0028\u0032\u0035\u0034\u002C\u0031\u0030\u0030\u002C\u0039\u0032\u002C\u0030\u002E\u0031\u0031\u0029", ")1.0,271,271,452(abgr".split("").reverse().join(""), ")90.0,0,041,041(abgr".split("").reverse().join(""), "\u0072\u0067\u0062\u0061\u0028\u0032\u0030\u0030\u002C\u0032\u0030\u0030\u002C\u0032\u002C\u0030\u002E\u0030\u0038\u0029", "\u0072\u0067\u0062\u0061\u0028\u0032\u0035\u0032\u002C\u0032\u0034\u0034\u002C\u0031\u0030\u0030\u002C\u0030\u002E\u0030\u0037\u0029", ")60.0,62,641,61(abgr".split("").reverse().join(""), "\u0072\u0067\u0062\u0061\u0028\u0030\u002C\u0032\u0033\u0034\u002C\u0030\u002C\u0030\u002E\u0030\u0035\u0029", ")40.0,861,252,661(abgr".split("").reverse().join(""), ")30.0,802,83,03(abgr".split("").reverse().join(""), "\u0072\u0067\u0062\u0061\u0028\u0031\u0032\u0032\u002C\u0031\u0031\u0034\u002C\u0032\u0033\u0038\u002C\u0030\u002E\u0030\u0032\u0029", "\u0072\u0067\u0062\u0061\u0028\u0031\u0039\u0032\u002C\u0031\u0039\u0032\u002C\u0032\u0035\u0034\u002C\u0030\u002E\u0030\u0031\u0029"]; _0x43d39b = (266858 ^ 266862) + (433055 ^ 433050); var _0x6c1c = (657628 ^ 657629) + (576543 ^ 576542); const czmColor = []; _0x6c1c = (132669 ^ 132668) + (302082 ^ 302082); colors['\u0066\u006F\u0072\u0045\u0061\u0063\u0068'](color => { czmColor['\u0070\u0075\u0073\u0068'](window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0043\u006F\u006C\u006F\u0072']['\u0066\u0072\u006F\u006D\u0043\u0073\u0073\u0043\u006F\u006C\u006F\u0072\u0053\u0074\u0072\u0069\u006E\u0067'](color)); }); this['\u0063\u006F\u006C\u006F\u0072\u0073'] = czmColor; this['\u0073\u0074\u0065\u0070\u0073'] = options['\u0073\u0074\u0065\u0070\u0073'] || []; if (!this['\u0073\u0074\u0065\u0070\u0073'] || this['\u0073\u0074\u0065\u0070\u0073']['\u006C\u0065\u006E\u0067\u0074\u0068'] === (841646 ^ 841646)) { let max = Number['\u004D\u0049\u004E\u005F\u0056\u0041\u004C\u0055\u0045']; var _0xc31eb = (400264 ^ 400264) + (558023 ^ 558020); let min = Number['\u004D\u0041\u0058\u005F\u0056\u0041\u004C\u0055\u0045']; _0xc31eb = 874368 ^ 874372; for (let i = 736308 ^ 736308; i < this['\u0064\u0061\u0074\u0061']['\u0076\u0061\u006C\u0075\u0065\u0073']['\u006C\u0065\u006E\u0067\u0074\u0068']; i++) { max = Math['\u006D\u0061\u0078'](max, this['\u0064\u0061\u0074\u0061']['\u0076\u0061\u006C\u0075\u0065\u0073'][i]); min = Math['\u006D\u0069\u006E'](min, this['\u0064\u0061\u0074\u0061']['\u0076\u0061\u006C\u0075\u0065\u0073'][i]); } const colorsStep = this['\u0063\u006F\u006C\u006F\u0072\u0073']['\u006C\u0065\u006E\u0067\u0074\u0068'] - (479528 ^ 479529); var _0xd5e25a = (418104 ^ 418106) + (182507 ^ 182510); const stepRate = (max - min) / colorsStep; _0xd5e25a = "lalifo".split("").reverse().join(""); this['\u0073\u0074\u0065\u0070\u0073'] = []; for (let i = 137015 ^ 137015; i < colorsStep; i++) { this['\u0073\u0074\u0065\u0070\u0073']['\u0070\u0075\u0073\u0068'](min + i * stepRate); } this['\u0073\u0074\u0065\u0070\u0073'][820437 ^ 820437] = 263828 ^ 263828; } var _0xe3a9b = (396542 ^ 396534) + (524478 ^ 524475); const west_south = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0043\u0061\u0072\u0074\u006F\u0067\u0072\u0061\u0070\u0068\u0069\u0063']['\u0066\u0072\u006F\u006D\u0044\u0065\u0067\u0072\u0065\u0065\u0073'](this['\u006F\u0070\u0074\u0069\u006F\u006E\u0073']['\u0064\u0061\u0074\u0061']['\u0078\u006D\u0069\u006E'], this['\u006F\u0070\u0074\u0069\u006F\u006E\u0073']['\u0064\u0061\u0074\u0061']['\u0079\u006D\u0069\u006E'], this['\u006F\u0070\u0074\u0069\u006F\u006E\u0073']['\u0064\u0061\u0074\u0061']['\u007A\u006D\u0069\u006E']); _0xe3a9b = (651271 ^ 651278) + (912111 ^ 912107); const east_north = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0043\u0061\u0072\u0074\u006F\u0067\u0072\u0061\u0070\u0068\u0069\u0063']['\u0066\u0072\u006F\u006D\u0044\u0065\u0067\u0072\u0065\u0065\u0073'](this['\u006F\u0070\u0074\u0069\u006F\u006E\u0073']['\u0064\u0061\u0074\u0061']['\u0078\u006D\u0061\u0078'], this['\u006F\u0070\u0074\u0069\u006F\u006E\u0073']['\u0064\u0061\u0074\u0061']['\u0079\u006D\u0061\u0078'], this['\u006F\u0070\u0074\u0069\u006F\u006E\u0073']['\u0064\u0061\u0074\u0061']['\u007A\u006D\u0061\u0078']); var _0xeff3e; const rectangle = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0052\u0065\u0063\u0074\u0061\u006E\u0067\u006C\u0065']['\u0066\u0072\u006F\u006D\u0052\u0061\u0064\u0069\u0061\u006E\u0073'](west_south['\u006C\u006F\u006E\u0067\u0069\u0074\u0075\u0064\u0065'], west_south['\u006C\u0061\u0074\u0069\u0074\u0075\u0064\u0065'], east_north['\u006C\u006F\u006E\u0067\u0069\u0074\u0075\u0064\u0065'], east_north['\u006C\u0061\u0074\u0069\u0074\u0075\u0064\u0065']); _0xeff3e = 599341 ^ 599338; this['\u005F\u0072\u0065\u0063\u0074\u0061\u006E\u0067\u006C\u0065'] = rectangle; const center = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0052\u0065\u0063\u0074\u0061\u006E\u0067\u006C\u0065']['\u0063\u0065\u006E\u0074\u0065\u0072'](rectangle); this['\u0063\u0065\u006E\u0074\u0065\u0072'] = center; var _0x2f_0x548 = (290262 ^ 290257) + (139848 ^ 139851); const northeastCartesian = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0043\u0061\u0072\u0074\u006F\u0067\u0072\u0061\u0070\u0068\u0069\u0063']['\u0074\u006F\u0043\u0061\u0072\u0074\u0065\u0073\u0069\u0061\u006E'](window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0052\u0065\u0063\u0074\u0061\u006E\u0067\u006C\u0065']['\u006E\u006F\u0072\u0074\u0068\u0065\u0061\u0073\u0074'](rectangle)); _0x2f_0x548 = "gnepnn".split("").reverse().join(""); const northwestCartesian = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0043\u0061\u0072\u0074\u006F\u0067\u0072\u0061\u0070\u0068\u0069\u0063']['\u0074\u006F\u0043\u0061\u0072\u0074\u0065\u0073\u0069\u0061\u006E'](window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0052\u0065\u0063\u0074\u0061\u006E\u0067\u006C\u0065']['\u006E\u006F\u0072\u0074\u0068\u0077\u0065\u0073\u0074'](rectangle)); var _0x7fd62e = (344839 ^ 344835) + (103555 ^ 103555); const southeastCartesian = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0043\u0061\u0072\u0074\u006F\u0067\u0072\u0061\u0070\u0068\u0069\u0063']['\u0074\u006F\u0043\u0061\u0072\u0074\u0065\u0073\u0069\u0061\u006E'](window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0052\u0065\u0063\u0074\u0061\u006E\u0067\u006C\u0065']['\u0073\u006F\u0075\u0074\u0068\u0065\u0061\u0073\u0074'](rectangle)); _0x7fd62e = (439352 ^ 439354) + (351508 ^ 351510); var _0x3912e; const east_west_distance = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0043\u0061\u0072\u0074\u0065\u0073\u0069\u0061\u006E\u0033']['\u0064\u0069\u0073\u0074\u0061\u006E\u0063\u0065'](northeastCartesian, northwestCartesian); _0x3912e = (476070 ^ 476070) + (196447 ^ 196443); var _0xdb_0xd91 = (277066 ^ 277070) + (678215 ^ 678210); const north_south_distance = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0043\u0061\u0072\u0074\u0065\u0073\u0069\u0061\u006E\u0033']['\u0064\u0069\u0073\u0074\u0061\u006E\u0063\u0065'](northeastCartesian, southeastCartesian); _0xdb_0xd91 = (738428 ^ 738421) + (969156 ^ 969157); var _0xebfbad = (281898 ^ 281896) + (907044 ^ 907044); const av_height = (179829 ^ 179837) * (west_south['\u0068\u0065\u0069\u0067\u0068\u0074'] + east_north['\u0068\u0065\u0069\u0067\u0068\u0074']) / (681906 ^ 681904); _0xebfbad = "ajpjnj".split("").reverse().join(""); var _0x08bcf = (910115 ^ 910118) + (380022 ^ 380022); const centerCartesian = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0043\u0061\u0072\u0074\u0065\u0073\u0069\u0061\u006E\u0033']['\u0066\u0072\u006F\u006D\u0052\u0061\u0064\u0069\u0061\u006E\u0073'](center['\u006C\u006F\u006E\u0067\u0069\u0074\u0075\u0064\u0065'], center['\u006C\u0061\u0074\u0069\u0074\u0075\u0064\u0065'], av_height / (327024 ^ 326932)); _0x08bcf = '\u0066\u006D\u006A\u0069\u0063\u0067'; let maxDistance = Math['\u006D\u0061\u0078'](east_west_distance, north_south_distance); maxDistance = Math['\u006D\u0061\u0078'](maxDistance, av_height); const _local2world = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0054\u0072\u0061\u006E\u0073\u0066\u006F\u0072\u006D\u0073']['\u0065\u0061\u0073\u0074\u004E\u006F\u0072\u0074\u0068\u0055\u0070\u0054\u006F\u0046\u0069\u0078\u0065\u0064\u0046\u0072\u0061\u006D\u0065'](centerCartesian); var _0x2e1e = (386497 ^ 386498) + (458801 ^ 458809); const m = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u004D\u0061\u0074\u0072\u0069\u0078\u0034']['\u0066\u0072\u006F\u006D\u0053\u0063\u0061\u006C\u0065'](new window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0043\u0061\u0072\u0074\u0065\u0073\u0069\u0061\u006E\u0033'](east_west_distance, north_south_distance, av_height * (975242 ^ 975240)), new window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u004D\u0061\u0074\u0072\u0069\u0078\u0034']()); _0x2e1e = '\u0067\u0065\u0068\u006D\u0069\u0063'; this['\u0062\u006F\u0075\u006E\u0064\u0069\u006E\u0067\u0053\u0070\u0068\u0065\u0072\u0065'] = new window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0042\u006F\u0075\u006E\u0064\u0069\u006E\u0067\u0053\u0070\u0068\u0065\u0072\u0065'](centerCartesian, maxDistance); this['\u006D\u006F\u0064\u0065\u006C\u004D\u0061\u0074\u0072\u0069\u0078'] = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u004D\u0061\u0074\u0072\u0069\u0078\u0034']['\u006D\u0075\u006C\u0074\u0069\u0070\u006C\u0079'](_local2world, m, _local2world); } createCommand(context) { if (!window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0064\u0065\u0066\u0069\u006E\u0065\u0064'](this['\u0067\u0065\u006F\u006D\u0065\u0074\u0072\u0079'])) { console['\u0077\u0061\u0072\u006E']("\u0044\u0043\u0050\u0072\u0069\u006D\u0069\u0074\u0069\u0076\u0065\u003A\u0020\u0067\u0065\u006F\u006D\u0065\u0074\u0072\u0079\u0020\u0069\u0073\u0020\u006E\u006F\u0074\u0020\u0064\u0065\u0066\u0069\u006E\u0065\u0064"); return; } if (!this['\u0062\u006F\u0075\u006E\u0064\u0069\u006E\u0067\u0053\u0070\u0068\u0065\u0072\u0065']) { console['\u0077\u0061\u0072\u006E']("dezilaitini ton si erehpSgnidnuob :evitimirPCD".split("").reverse().join("")); return; } var _0x_0xfd5 = (684320 ^ 684322) + (171763 ^ 171767); const geometry = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0042\u006F\u0078\u0047\u0065\u006F\u006D\u0065\u0074\u0072\u0079']['\u0063\u0072\u0065\u0061\u0074\u0065\u0047\u0065\u006F\u006D\u0065\u0074\u0072\u0079'](this['\u0067\u0065\u006F\u006D\u0065\u0074\u0072\u0079']); _0x_0xfd5 = '\u006D\u006D\u0062\u0068\u006D\u006F'; if (!geometry) { console['\u0077\u0061\u0072\u006E']("\u0044\u0043\u0050\u0072\u0069\u006D\u0069\u0074\u0069\u0076\u0065\u003A\u0020\u0066\u0061\u0069\u006C\u0065\u0064\u0020\u0074\u006F\u0020\u0063\u0072\u0065\u0061\u0074\u0065\u0020\u0067\u0065\u006F\u006D\u0065\u0074\u0072\u0079"); return; } const attributelocations = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0047\u0065\u006F\u006D\u0065\u0074\u0072\u0079\u0050\u0069\u0070\u0065\u006C\u0069\u006E\u0065']['\u0063\u0072\u0065\u0061\u0074\u0065\u0041\u0074\u0074\u0072\u0069\u0062\u0075\u0074\u0065\u004C\u006F\u0063\u0061\u0074\u0069\u006F\u006E\u0073'](geometry); this['\u0076\u0065\u0072\u0074\u0065\u0078\u0061\u0072\u0072\u0061\u0079'] = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0056\u0065\u0072\u0074\u0065\u0078\u0041\u0072\u0072\u0061\u0079']['\u0066\u0072\u006F\u006D\u0047\u0065\u006F\u006D\u0065\u0074\u0072\u0079']({ "context": context, '\u0067\u0065\u006F\u006D\u0065\u0074\u0072\u0079': geometry, "attributes": attributelocations }); const renderstate = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0052\u0065\u006E\u0064\u0065\u0072\u0053\u0074\u0061\u0074\u0065']['\u0066\u0072\u006F\u006D\u0043\u0061\u0063\u0068\u0065']({ "depthTest": { '\u0065\u006E\u0061\u0062\u006C\u0065\u0064': !![] }, '\u0063\u0075\u006C\u006C': { '\u0065\u006E\u0061\u0062\u006C\u0065\u0064': false } }); const shaderProgram = window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0053\u0068\u0061\u0064\u0065\u0072\u0050\u0072\u006F\u0067\u0072\u0061\u006D']['\u0066\u0072\u006F\u006D\u0043\u0061\u0063\u0068\u0065']({ "context": context, '\u0076\u0065\u0072\u0074\u0065\u0078\u0053\u0068\u0061\u0064\u0065\u0072\u0053\u006F\u0075\u0072\u0063\u0065': vertexShaderSource, "fragmentShaderSource": fragmentShaderSource, '\u0061\u0074\u0074\u0072\u0069\u0062\u0075\u0074\u0065\u004C\u006F\u0063\u0061\u0074\u0069\u006F\u006E\u0073': attributelocations }); var _0xea2f; const uniformmap = { '\u006D\u0061\u0070': () => { return this['\u0067\u0065\u0074\u0054\u0065\u0078\u0074\u0075\u0072\u0065'](context); }, '\u0074\u0068\u0072\u0065\u0073\u0068\u006F\u006C\u0064': () => { return this['\u0076\u0069\u0065\u0077\u004D\u006F\u0064\u0065\u006C']['\u0074\u0068\u0072\u0065\u0073\u0068\u006F\u006C\u0064'] / (857133 ^ 857298); }, '\u0064\u0065\u0074\u0061\u0069\u006C': () => { return this['\u0076\u0069\u0065\u0077\u004D\u006F\u0064\u0065\u006C']['\u0064\u0065\u0074\u0061\u0069\u006C']; }, "xCut": () => { return this['\u0076\u0069\u0065\u0077\u004D\u006F\u0064\u0065\u006C']['\u0078\u0043\u0075\u0074']; }, '\u0079\u0043\u0075\u0074': () => { return this['\u0076\u0069\u0065\u0077\u004D\u006F\u0064\u0065\u006C']['\u0079\u0043\u0075\u0074']; }, '\u007A\u0043\u0075\u0074': () => { return this['\u0076\u0069\u0065\u0077\u004D\u006F\u0064\u0065\u006C']['\u007A\u0043\u0075\u0074']; }, '\u0063\u006F\u006C\u006F\u0072\u0073': () => { return this['\u0063\u006F\u006C\u006F\u0072\u0073']; }, '\u0063\u006F\u006C\u006F\u0072\u0073\u004B\u0065\u0079': () => { return this['\u0073\u0074\u0065\u0070\u0073']; } }; _0xea2f = 203600 ^ 203608; var _0xb2e; const boundingVolume = this['\u0062\u006F\u0075\u006E\u0064\u0069\u006E\u0067\u0053\u0070\u0068\u0065\u0072\u0065'] || geometry['\u0062\u006F\u0075\u006E\u0064\u0069\u006E\u0067\u0053\u0070\u0068\u0065\u0072\u0065']; _0xb2e = (100471 ^ 100465) + (596566 ^ 596563); if (!boundingVolume) { console['\u0077\u0061\u0072\u006E']("\u0044\u0043\u0050\u0072\u0069\u006D\u0069\u0074\u0069\u0076\u0065\u003A\u0020\u0062\u006F\u0075\u006E\u0064\u0069\u006E\u0067\u0056\u006F\u006C\u0075\u006D\u0065\u0020\u0069\u0073\u0020\u0075\u006E\u0064\u0065\u0066\u0069\u006E\u0065\u0064"); return; } this['\u0064\u0072\u0061\u0077\u0043\u006F\u006D\u006D\u0061\u006E\u0064'] = new window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0044\u0072\u0061\u0077\u0043\u006F\u006D\u006D\u0061\u006E\u0064']({ '\u0062\u006F\u0075\u006E\u0064\u0069\u006E\u0067\u0056\u006F\u006C\u0075\u006D\u0065': boundingVolume, '\u006D\u006F\u0064\u0065\u006C\u004D\u0061\u0074\u0072\u0069\u0078': this['\u006D\u006F\u0064\u0065\u006C\u004D\u0061\u0074\u0072\u0069\u0078'], '\u0070\u0061\u0073\u0073': window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0050\u0061\u0073\u0073']['\u0054\u0052\u0041\u004E\u0053\u004C\u0055\u0043\u0045\u004E\u0054'], "shaderProgram": shaderProgram, "renderState": renderstate, "vertexArray": this['\u0076\u0065\u0072\u0074\u0065\u0078\u0061\u0072\u0072\u0061\u0079'], '\u0075\u006E\u0069\u0066\u006F\u0072\u006D\u004D\u0061\u0070': uniformmap }); } getTexture(context) { if (!this['\u0074\u0065\u0078\u0074\u0075\u0072\u0065']) { let maxSize = context['\u005F\u0067\u006C']['\u0067\u0065\u0074\u0050\u0061\u0072\u0061\u006D\u0065\u0074\u0065\u0072'](context['\u005F\u0067\u006C']['\u004D\u0041\u0058\u005F\u0054\u0045\u0058\u0054\u0055\u0052\u0045\u005F\u0053\u0049\u005A\u0045']); if (!maxSize || maxSize <= (561018 ^ 561018)) { console['\u0077\u0061\u0072\u006E']("\u0046\u0061\u0069\u006C\u0065\u0064\u0020\u0074\u006F\u0020\u0067\u0065\u0074\u0020\u004D\u0041\u0058\u005F\u0054\u0045\u0058\u0054\u0055\u0052\u0045\u005F\u0053\u0049\u005A\u0045\u002C\u0020\u0075\u0073\u0069\u006E\u0067\u0020\u0064\u0065\u0066\u0061\u0075\u006C\u0074\u0020\u0076\u0061\u006C\u0075\u0065\u0020\u0032\u0030\u0034\u0038"); maxSize = 722193 ^ 724241; } var _0xa9ff = (122990 ^ 122983) + (436671 ^ 436665); let width = this['\u0064\u0061\u0074\u0061']['\u0072\u006F\u0077\u0073']; _0xa9ff = 187846 ^ 187855; let height = this['\u0064\u0061\u0074\u0061']['\u0063\u006F\u006C\u0073']; var _0xag9e6g; let depth = this['\u0064\u0061\u0074\u0061']['\u0068\u0065\u0069\u0067\u0068\u0074\u0073']; _0xag9e6g = 684486 ^ 684487; let downsampled = false; if (width > maxSize) { width = maxSize; downsampled = !![]; } if (height > maxSize) { height = maxSize; downsampled = !![]; } if (depth > maxSize) { depth = maxSize; downsampled = !![]; } var _0x35e; let sourceData = this['\u0064\u0061\u0074\u0061']['\u0076\u0061\u006C\u0075\u0065\u0073']; _0x35e = (127283 ^ 127287) + (586967 ^ 586964); if (downsampled) { console['\u0077\u0061\u0072\u006E'](`Texture size ${this['\u0064\u0061\u0074\u0061']['\u0072\u006F\u0077\u0073']}x${this['\u0064\u0061\u0074\u0061']['\u0063\u006F\u006C\u0073']}x${this['\u0064\u0061\u0074\u0061']['\u0068\u0065\u0069\u0067\u0068\u0074\u0073']} exceeds GPU limit ${maxSize}, downsampling to ${width}x${height}x${depth}`); sourceData = this['\u0064\u006F\u0077\u006E\u0073\u0061\u006D\u0070\u006C\u0065\u0044\u0061\u0074\u0061'](this['\u0064\u0061\u0074\u0061']['\u0076\u0061\u006C\u0075\u0065\u0073'], this['\u0064\u0061\u0074\u0061']['\u0072\u006F\u0077\u0073'], this['\u0064\u0061\u0074\u0061']['\u0063\u006F\u006C\u0073'], this['\u0064\u0061\u0074\u0061']['\u0068\u0065\u0069\u0067\u0068\u0074\u0073'], width, height, depth); } this['\u0074\u0065\u0078\u0074\u0075\u0072\u0065'] = new Texture3D({ '\u0063\u006F\u006E\u0074\u0065\u0078\u0074': context, "width": width, "height": height, '\u0064\u0065\u0070\u0074\u0068': depth, '\u0070\u0069\u0078\u0065\u006C\u0046\u006F\u0072\u006D\u0061\u0074': window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0050\u0069\u0078\u0065\u006C\u0046\u006F\u0072\u006D\u0061\u0074']['\u0041\u004C\u0050\u0048\u0041'], "pixelDataType": window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0050\u0069\u0078\u0065\u006C\u0044\u0061\u0074\u0061\u0074\u0079\u0070\u0065']['\u0055\u004E\u0053\u0049\u0047\u004E\u0045\u0044\u005F\u0042\u0059\u0054\u0045'], '\u0073\u006F\u0075\u0072\u0063\u0065': { '\u0077\u0069\u0064\u0074\u0068': width, '\u0068\u0065\u0069\u0067\u0068\u0074': height, "depth": depth, "arrayBufferView": new Uint8Array(sourceData) }, "sampler": new window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0053\u0061\u006D\u0070\u006C\u0065\u0072']({ "minificationFilter": window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0054\u0065\u0078\u0074\u0075\u0072\u0065\u004D\u0069\u006E\u0069\u0066\u0069\u0063\u0061\u0074\u0069\u006F\u006E\u0046\u0069\u006C\u0074\u0065\u0072']['\u004C\u0049\u004E\u0045\u0041\u0052'], '\u006D\u0061\u0067\u006E\u0069\u0066\u0069\u0063\u0061\u0074\u0069\u006F\u006E\u0046\u0069\u006C\u0074\u0065\u0072': window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']['\u0054\u0065\u0078\u0074\u0075\u0072\u0065\u004D\u0061\u0067\u006E\u0069\u0066\u0069\u0063\u0061\u0074\u0069\u006F\u006E\u0046\u0069\u006C\u0074\u0065\u0072']['\u004C\u0049\u004E\u0045\u0041\u0052'] }) }); } return this['\u0074\u0065\u0078\u0074\u0075\u0072\u0065']; } downsampleData(data, srcWidth, srcHeight, srcDepth, dstWidth, dstHeight, dstDepth) { var _0xbebfe; const result = new Array(dstWidth * dstHeight * dstDepth); _0xbebfe = (422194 ^ 422197) + (869226 ^ 869231); const scaleX = srcWidth / dstWidth; var _0xd_0x7a5 = (187762 ^ 187761) + (246197 ^ 246195); const scaleY = srcHeight / dstHeight; _0xd_0x7a5 = 727035 ^ 727037; const scaleZ = srcDepth / dstDepth; for (let z = 789469 ^ 789469; z < dstDepth; z++) { for (let y = 750793 ^ 750793; y < dstHeight; y++) { for (let x = 397737 ^ 397737; x < dstWidth; x++) { const srcX = Math['\u0066\u006C\u006F\u006F\u0072'](x * scaleX); var _0x1a_0x523 = (978206 ^ 978203) + (376765 ^ 376762); const srcY = Math['\u0066\u006C\u006F\u006F\u0072'](y * scaleY); _0x1a_0x523 = 904448 ^ 904453; var _0x2477d = (754081 ^ 754081) + (586341 ^ 586336); const srcZ = Math['\u0066\u006C\u006F\u006F\u0072'](z * scaleZ); _0x2477d = (739058 ^ 739066) + (600902 ^ 600901); var _0x72e1a = (757213 ^ 757212) + (716484 ^ 716486); const srcIndex = srcZ * srcWidth * srcHeight + srcY * srcWidth + srcX; _0x72e1a = '\u0061\u0066\u0063\u0068\u0063\u006C'; const dstIndex = z * dstWidth * dstHeight + y * dstWidth + x; result[dstIndex] = data[srcIndex]; } } } return result; } update(frameState) { if (!this['\u0064\u0072\u0061\u0077\u0043\u006F\u006D\u006D\u0061\u006E\u0064']) { this['\u0063\u0072\u0065\u0061\u0074\u0065\u0043\u006F\u006D\u006D\u0061\u006E\u0064'](frameState['\u0063\u006F\u006E\u0074\u0065\u0078\u0074']); } frameState['\u0063\u006F\u006D\u006D\u0061\u006E\u0064\u004C\u0069\u0073\u0074']['\u0070\u0075\u0073\u0068'](this['\u0064\u0072\u0061\u0077\u0043\u006F\u006D\u006D\u0061\u006E\u0064']); } isDestroyed() { return false; } pick(frameState, result) { return undefined; } change(data) { this['\u0076\u0069\u0065\u0077\u004D\u006F\u0064\u0065\u006C'] = { ...this['\u0076\u0069\u0065\u0077\u004D\u006F\u0064\u0065\u006C'], ...data }; this['\u0064\u0072\u0061\u0077\u0043\u006F\u006D\u006D\u0061\u006E\u0064'] = null; this['\u0076\u0065\u0072\u0074\u0065\u0078\u0061\u0072\u0072\u0061\u0079'] = null; } }

export default DCPrimitive
