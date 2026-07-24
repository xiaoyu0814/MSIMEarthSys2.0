const loadGLSL = `
uniform sampler2D colorTexture; //输入的场景渲染照片
varying vec2 v_textureCoordinates;
#define PI 3.14159265
void main(void) {
float iTime = czm_frameNumber / 20.0;
vec2 resolution = czm_viewport.zw;
// vec2 FC = gl_FragCoord.xy;
// vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
// vec2 uv = gl_FragCoord.xy / resolution.xy * 2. -1.;
// vec2 uv = gl_FragCoord.xy;
// uv = vec2( uv.x - 0.5 * resolution.x, uv.y - 0.5 * resolution.y);

float time = iTime;
float mx = max(resolution.x, resolution.y);
vec2 scrs = resolution.xy/mx;
vec2 uv = vec2(gl_FragCoord.x, resolution.y-gl_FragCoord.y)/mx;
// vec2 m = vec2(iMouse.x/mx,scrs.y-iMouse.y/mx);


vec3 col = vec3(0.0);
float x,y = 0.0;
float radius = 0.01;
const float dotsnb = 10.0;

for(float i = 0.0 ; i < dotsnb ; i++){
    x = 0.03*cos(2.0*PI*i/dotsnb+time*(i+3.0)/3.0);
    y = 0.03*sin(2.0*PI*i/dotsnb+time*(i+3.0)/3.0);

    col += vec3(smoothstep(radius, radius-0.01, distance(uv, scrs/2.0 + vec2(x,y)) ) * (sin(i/dotsnb+time+2.0*PI/3.0)+1.0)/2.0,
                smoothstep(radius, radius-0.01, distance(uv, scrs/2.0 + vec2(x,y)) ) * (sin(i/dotsnb+time+4.0*PI/3.0)+1.0)/2.0,
                smoothstep(radius, radius-0.01, distance(uv, scrs/2.0 + vec2(x,y)) ) * (sin(i/dotsnb+time+6.0*PI/3.0)+1.0)/2.0);
}

vec4 fragColor = vec4(col,1.0);
gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), fragColor, 0.5); //将雨和三维场景融合
}
`
export default loadGLSL
