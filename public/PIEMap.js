(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PIE = {}));
})(this, (function (exports) { 'use strict';

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 基础模块
     * ---
     */

    /**
     * 二维向量类
     * @name Vector2
     * @class Vector2
     *
     * @param {Number} x -x值
     * @param {Number} y -y值
     */
    function PIEVector2(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }
    Object.assign(PIEVector2.prototype, {
      /**
       * 进行规格化
       * @memberOf Vector2#
       *
       */
      normalize: function () {
        var length = this.length();
        if (length != 0) {
          this.x /= length;
          this.y /= length;
        }
      },
      /**
       * 进行归一化
       *
       * @memberOf Vector2#
       * @returns {PIEVector2} 返回归一化后的向量
       *
       */
      normalized: function () {
        var v = new PIEVector2(this.x, this.y);
        v.normalize();
        return v;
      },
      /**
       * 求向量的长度
       *
       * @memberOf Vector2#
       * @returns {number} 返回向量的长度
       *
       */
      length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      },
      /**
       * 自身缩放
       * @param {Number} s -value
       * @memberOf Vector2#
       *
       * @returns {PIEVector2} 返回缩放后的向量
       *
       */
      scale: function (s) {
        return new PIEVector2(this.x * s, this.y * s);
      },
      /**
       * 向量相减
       * @param {PIEVector2} vec -二维向量
       * @memberOf Vector2#
       *
       * @returns {PIEVector2} 返回相减后的向量
       */
      sub: function (vec) {
        return new PIEVector2(this.x - vec.x, this.y - vec.y);
      },
      /**
       * 向量相加
       * @param {PIEVector2} vec -二维向量
       * @memberOf Vector2#
       *
       * @returns {PIEVector2} 返回相加后的向量
       *
       */
      add: function (vec) {
        return new PIEVector2(this.x + vec.x, this.y + vec.y);
      },
      /**
       * 向量相乘
       * @param {PIEVector2} vec -二维向量
       * @memberOf Vector2#
       *
       * @returns {PIEVector2} 返回相加后的向量
       *
       */
      multiply(vec) {
        this.x *= vec.x;
        this.y *= vec.y;
        return this;
      },
      /**
       * 克隆向量
       *
       * @memberOf Vector2#
       * @returns {PIEVector2} 返回克隆后的向量
       *
       */
      clone: function () {
        return new PIEVector2(this.x, this.y);
      },
      toArray: function () {
        return [this.x, this.y];
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 基础模块
     * ---
     */

    /**
     * 数学模块
     * @name Math
     * @interface
     */
    function PIEMath() {}
    /**
     * 极小值定义
     *
     * @memberOf Math
     */
    PIEMath.EP = 1e-13;
    /**
     * 弧度转角度
     *
     * @memberOf Math
     */
    PIEMath.RTOD = 57.295779513082320876798154814;
    /**
     * 角度转弧度
     *
     * @memberOf Math
     */
    PIEMath.DTOR = 0.0174532925199432957692369077;
    /**
     * 地球半径
     *
     * @memberOf Math
     */
    PIEMath.EARTH_RADIUS = 6378137;
    /**
     * 地球周长
     *
     * @memberOf Math
     */
    PIEMath.EARTH_CIRCUM = 2 * Math.PI * PIEMath.EARTH_RADIUS;
    PIEMath.EARTH_LTOWRATIO = 0.762; // (423.0 / 555.0)
    /**
     * double最大值
     *
     * @memberOf Math
     */
    PIEMath.DBLMAX = 1.7976931348623158e+308;
    /**
     * double最小值
     *
     * @memberOf Math
     */
    PIEMath.DBLMIN = 2.2250738585072014e-308;
    /**
     * float 最大值
     *
     * @memberOf Math
     */
    PIEMath.FLTMAX = 3.402823466e+38;
    /**
     * float 最小值
     *
     * @memberOf Math
     */
    PIEMath.FLTMIN = 1.175494351e-38;
    PIEMath.round = function (value) {
      return value > 0 ? value + 0.5 : value - 0.5;
    };
    /**
     * 给出弧度计算点旋转(逆时针方向)
     * @param {PIEVector2} pntAnchor -中心点
     * @param {Number} dRadian -顺时针旋转角度
     * @param {PIEVector2} pntSource -待旋转坐标点
     *
     * @memberOf Math
     */
    PIEMath.rotateRadian = function (pntAnchor, dRadian, pntSource) {
      var dCos = Math.cos(dRadian);
      var dSin = Math.sin(dRadian);
      var xx = pntSource.x - pntAnchor.x;
      var yy = pntSource.y - pntAnchor.y;
      pntSource.x = xx * dCos - yy * dSin + pntAnchor.x;
      pntSource.y = xx * dSin + yy * dCos + pntAnchor.y;
      return pntSource;
    };

    /**
     * 给出圆心和半径求圆周上的坐标
     * @param {array} center -圆心点
     * @param {Number} radius -半径
     * @param {Number} count -点个数
     * @returns {array} 返回坐标数组
     * @memberOf Math
     */
    PIEMath.circularPoints = function (center, radius, count) {
      const pointsCircle = [];
      for (let times = 0; times < count; times++) {
        const radian = 2 * Math.PI / count * times;
        const x = center[0] + Math.sin(radian) * radius;
        const y = center[1] - Math.cos(radian) * radius;
        pointsCircle.push(x);
        pointsCircle.push(y);
      }
      return pointsCircle;
    };

    /**
     * 判断是否是零值
     * @param {Number} value -value值
     * @memberOf Math
     * @returns {Boolean} 返回判断结果
     */
    PIEMath.isZero = function (value) {
      return value < 1e-13 && value > -1e-13;
    };

    /**
     * 判断是否相等
     * @param {Number} value1 -value1值
     * @param {Number} value2 -value2值
     * @memberOf Math
     * @returns {Boolean} 返回是否相等
     */
    PIEMath.isEqual = function (value1, value2) {
      if (value1 == 0) {
        return PIEMath.isZero(value2);
      } else if (value2 == 0) {
        return PIEMath.isZero(value1);
      }
      var dMaxValue = Math.max(Math.abs(value1), Math.abs(value2));
      var dAbsolute = value1 - value2;
      return dAbsolute >= -1e-13 * dMaxValue && dAbsolute <= 1e-13 * dMaxValue;
    };
    PIEMath.isEq = function (dValue1, dValue2, dTolerance) {
      if (dTolerance > 0) {
        var dTemp = dValue1 - dValue2;
        return dTemp > -dTolerance && dTemp < dTolerance;
      }
      return false;
    };
    // /**
    //  * 矩阵和矩阵相乘
    //  * @param {Number} lhs -左矩阵
    //  * @param {Number} rhs -右矩阵
    //  * @param {Number} out -结果矩阵
    //  *
    //  * @memberOf Math
    //  */
    // PIEMath.multiplyMM = function (lhs, rhs, out) {
    //     var i = 0;
    //     var j = 0;
    //     for (i = 0; i < 4; i++) {
    //         var rhs_i0 = rhs[4 * i];
    //         var ri0 = lhs[0] * rhs_i0;
    //         var ri1 = lhs[1] * rhs_i0;
    //         var ri2 = lhs[2] * rhs_i0;
    //         var ri3 = lhs[3] * rhs_i0;
    //
    //         for (j = 1; j < 4; j++) {
    //             var rhs_ij = rhs[4 * i + j];
    //             ri0 += lhs[4 * j] * rhs_ij;
    //             ri1 += lhs[4 * j + 1] * rhs_ij;
    //             ri2 += lhs[4 * j + 2] * rhs_ij;
    //             ri3 += lhs[4 * j + 3] * rhs_ij;
    //         }
    //
    //         out[4 * i] = ri0;
    //         out[4 * i + 1] = ri1;
    //         out[4 * i + 2] = ri2;
    //         out[4 * i + 3] = ri3;
    //     }
    // }

    PIEMath.compute2DAngleFromY = function (x, y) {
      if (PIEMath.isZero(x)) {
        return 0;
      }
      var dAngle = 0.0;
      if (x < 0 && y > 0) {
        dAngle = Math.PI / 2 - Math.atan(Math.abs(y / x));
      } else if (x < 0 && y < 0) {
        dAngle = Math.atan(Math.abs(y / x)) + Math.PI / 2;
      } else if (x > 0 && y < 0) {
        dAngle = 3 * Math.PI / 2 - Math.atan(Math.abs(y / x));
      } else if (x > 0 && y > 0) {
        dAngle = 3 * Math.PI / 2 + Math.atan(Math.abs(y / x));
      } else if (PIEMath.isZero(y) && x < 0) {
        dAngle = Math.PI / 2;
      } else if (PIEMath.isZero(x) && y < 0) {
        dAngle = Math.PI;
      } else if (PIEMath.isZero(y) && x > 0) {
        dAngle = 3 * Math.PI / 2;
      } else if (PIEMath.isZero(x) && y > 0) {
        dAngle = 0;
      }
      return dAngle;
    };
    /**
     * 球面两点间的距离
     * @param {PIEVector2|Array} pntFrom -经纬坐标
     * @param {PIEVector2|Array} pntTo -经纬坐标
     *
     * @memberOf Math
     */
    PIEMath.sphereDistance = function (pntFrom, pntTo) {
      if (pntFrom instanceof Array) {
        pntFrom = new PIEVector2(pntFrom[0], pntFrom[1]);
      }
      if (pntTo instanceof Array) {
        pntTo = new PIEVector2(pntTo[0], pntTo[1]);
      }
      if (pntFrom.x > 180 || pntFrom.x < -180 || pntTo.x > 180 || pntTo.x < -180 || pntFrom.y > 180 / 2 || pntFrom.y < -180 / 2 || pntTo.y > 180 / 2 || pntTo.y < -180 / 2) {
        return 0;
      }
      var dLongDist = pntFrom.x - pntTo.x;
      if (dLongDist < -180) {
        dLongDist += 2 * 180;
      } else if (dLongDist > 180) {
        dLongDist = 2 * 180 - dLongDist;
      }
      var dPnt1Latitude = pntFrom.y;
      var dPnt2Latitude = pntTo.y;
      var dCospnt1 = Math.cos(dPnt1Latitude * (Math.PI / 180));
      var dCospnt2 = Math.cos(dPnt2Latitude * (Math.PI / 180));
      var dSinpnt1 = Math.sin(dPnt1Latitude * (Math.PI / 180));
      var dSinpnt2 = Math.sin(dPnt2Latitude * (Math.PI / 180));
      var dSinDist = dSinpnt1 - dSinpnt2;
      var dValue = dSinDist * dSinDist + dCospnt1 * dCospnt1 + dCospnt2 * dCospnt2 - 2 * dCospnt1 * dCospnt2 * Math.cos(dLongDist * (Math.PI / 180));
      if (dValue < 0) {
        dValue = 0;
      }
      //这是以pnt1和pnt2所在大圆最短圆弧长
      var dLength = 2 * Math.asin(Math.sqrt(dValue) / 2) * 6371118;
      return dLength;
    };
    /**
     * 返回范围内的一个数值
     * @param {Number} x -要钳制在范围内的属性或变量
     * @param {Number} lowerlimit -最小数值
     * @param {Number} upperlimit -最大数值
     *
     * @memberOf Math
     * @returns {Number} 如果参数大于范围，将返回最大数值，如果参数小于范围，该函数将返回最小数值
     *
     *
     */
    PIEMath.clamp = function (x, lowerlimit, upperlimit) {
      if (x < lowerlimit) {
        x = lowerlimit;
      } else if (x > upperlimit) {
        x = upperlimit;
      }
      return x;
    };

    // /**
    //  * 求解两个值之间的样条插值
    //  * @param {Number} edge0 -样条插值函数的下界
    //  * @param {Number} edge1 -样条插值函数的上界
    //  * @param {Number} x -插值的源输入
    //  *
    //  * @memberOf math#
    //  * @returns {number}
    //  */
    PIEMath.smoothstep = function (edge0, edge1, x) {
      x = PIEMath.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
      return x * x * x * (x * (x * 6 - 15) + 10);
    };

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 基础模块
     * ---
     */

    /**
     * 尺寸类
     * @name Size
     * @class Size
     *
     * @param {Number} cx -x值
     * @param {Number} cy -y值
     */
    function PIESize(cx, cy) {
      this.cx = cx;
      this.cy = cy;
    }
    Object.assign(PIESize.prototype, {
      toArray: function () {
        return [this.cx, this.cy];
      }
    });

    var PIEArrayType = {
      Int8: 0,
      UInt8: 1,
      UInt16: 2,
      Int16: 3,
      UInt32: 4,
      Int32: 5,
      Float32: 6,
      Float64: 7
    };

    function PIEArray(value, type) {
      var array = value;
      this.type = type;
      if (value instanceof Array) {
        if (type == PIEArrayType.Int8) {
          array = new Int8Array(value);
        } else if (type == PIEArrayType.UInt8) {
          array = new Uint8Array(value);
        } else if (type == PIEArrayType.UInt16) {
          array = new Uint16Array(value);
        } else if (type == PIEArrayType.Int16) {
          array = new Int16Array(value);
        } else if (type == PIEArrayType.UInt32) {
          array = new Uint32Array(value);
        } else if (type == PIEArrayType.Int32) {
          array = new Int32Array(value);
        } else if (type == PIEArrayType.Float32) {
          array = new Float32Array(value);
        } else if (type == PIEArrayType.Float64) {
          array = new Float64Array(value);
        }
      } else if (value instanceof Number || typeof value == "number") {
        if (type == PIEArrayType.Int8) {
          array = new Int8Array(value);
        } else if (type == PIEArrayType.UInt8) {
          array = new Uint8Array(value);
        } else if (type == PIEArrayType.UInt16) {
          array = new Uint16Array(value);
        } else if (type == PIEArrayType.Int16) {
          array = new Int16Array(value);
        } else if (type == PIEArrayType.UInt32) {
          array = new Uint32Array(value);
        } else if (type == PIEArrayType.Int32) {
          array = new Int32Array(value);
        } else if (type == PIEArrayType.Float32) {
          array = new Float32Array(value);
        } else if (type == PIEArrayType.Float64) {
          array = new Float64Array(value);
        }
      }
      if (array != null) {
        this.array = array;
        this.handle = PlotModule._malloc(this.array.length * this.array.BYTES_PER_ELEMENT);
        //this.handle = PlotModule._Array_Create(this.array, this.array.length, type);
      }

      if (array instanceof Int8Array) {
        PlotModule.HEAP8.set(this.array, this.handle);
        // PlotModule.GROWABLE_HEAP_I8().set(this.array, this.handle);
        // PlotModule.heapObjectForWebGLType(5120).set(this.array, this.handle);
      } else if (array instanceof Uint8Array) {
        PlotModule.HEAPU8.set(this.array, this.handle);
        // PlotModule.GROWABLE_HEAP_U8().set(this.array, this.handle);
        // PlotModule.heapObjectForWebGLType(5121).set(this.array, this.handle);
      } else if (array instanceof Int16Array) {
        PlotModule.HEAP16.set(this.array, this.handle >> 1);
        // PlotModule.GROWABLE_HEAP_I16().set(this.array, this.handle >> 1);
        // PlotModule.heapObjectForWebGLType(5122).set(this.array, this.handle >> 1);
      } else if (array instanceof Uint16Array) {
        PlotModule.HEAPU16.set(this.array, this.handle >> 1);
        // PlotModule.GROWABLE_HEAP_U16().set(this.array, this.handle >> 1);
        // PlotModule.heapObjectForWebGLType(0).set(this.array, this.handle >> 1);
      } else if (array instanceof Int32Array) {
        PlotModule.HEAP32.set(this.array, this.handle >> 2);
        // PlotModule.GROWABLE_HEAP_I32().set(this.array, this.handle >> 2);
        // PlotModule.heapObjectForWebGLType(5124).set(this.array, this.handle >> 2);
      } else if (array instanceof Uint32Array) {
        PlotModule.HEAPU32.set(this.array, this.handle >> 2);
        // PlotModule.GROWABLE_HEAP_U32().set(this.array, this.handle >> 2);
        // PlotModule.heapObjectForWebGLType(5125).set(this.array, this.handle >> 2);
      } else if (array instanceof Float32Array) {
        PlotModule.HEAPF32.set(this.array, this.handle >> 2);
        // PlotModule.GROWABLE_HEAP_F32().set(this.array, this.handle >> 2);
        // PlotModule.heapObjectForWebGLType(5126).set(this.array, this.handle >> 2);
      } else if (array instanceof Float64Array) {
        PlotModule.HEAPF64.set(this.array, this.handle >> 3);
        // PlotModule.GROWABLE_HEAP_F64().set(this.array, this.handle >> 3);
        // PlotModule.heapObjectForWebGLType(5127).set(this.array, this.handle >> 3);
      }
    }

    Object.assign(PIEArray.prototype, {
      getHandle: function () {
        return this.handle;
      },
      dispose: function () {
        if (this.handle != null) {
          PlotModule._free(this.handle);
          //PlotModule._Array_Delete(this.handle, this.type);
          this.handle = null;
        }
      },
      toArrayBuffer: function () {
        return this.array;
      },
      toArray: function () {
        let array = Array.prototype.slice.call(this.array);
        return array;
        //return Array.apply([], this.array);
      },

      updateData: function () {
        var type = this.type;
        if (type == PIEArrayType.Int8) {
          var ptr = this.getHandle();
          var buffer = PlotModule.HEAP8.subarray(ptr, ptr + this.array.length);
          this.array = new Int8Array(buffer);
        } else if (type == PIEArrayType.UInt8) {
          var ptr = this.getHandle();
          var buffer = PlotModule.HEAPU8.subarray(ptr, ptr + this.array.length);
          this.array = new Uint8Array(buffer);
        } else if (type == PIEArrayType.UInt16) {
          var ptr = this.getHandle() >> 1;
          var buffer = PlotModule.HEAPU16.subarray(ptr, ptr + this.array.length);
          this.array = new Uint16Array(buffer);
        } else if (type == PIEArrayType.Int16) {
          var ptr = this.getHandle() >> 1;
          var buffer = PlotModule.HEAP16.subarray(ptr, ptr + this.array.length);
          this.array = new Int16Array(buffer);
        } else if (type == PIEArrayType.UInt32) {
          var ptr = this.getHandle() >> 2;
          var buffer = PlotModule.HEAPU32.subarray(ptr, ptr + this.array.length);
          this.array = new Uint32Array(buffer);
        } else if (type == PIEArrayType.Int32) {
          var ptr = this.getHandle() >> 2;
          var buffer = PlotModule.HEAP32.subarray(ptr, ptr + this.array.length);
          this.array = new Int32Array(buffer);
        } else if (type == PIEArrayType.Float32) {
          var ptr = this.getHandle() >> 3;
          var buffer = PlotModule.HEAPF32.subarray(ptr, ptr + this.array.length);
          this.array = new Float32Array(buffer);
        } else if (type == PIEArrayType.Float64) {
          var ptr = this.getHandle() >> 3;
          var buffer = PlotModule.HEAPF64.subarray(ptr, ptr + this.array.length);
          this.array = new Float64Array(buffer);
        }
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 基础模块
     * ---
     */

    /**
     * 创建像素范围对象
     * @name Rect
     * @class Rect
     * 像素范围类相关函数
     *
     * @param {Number} left -左值
     * @param {Number} top -上值
     * @param {Number} right -右值
     * @param {Number} bottom -下值
     */
    function PIERect(left, top, right, bottom) {
      this.left = left;
      this.top = top;
      this.right = right;
      this.bottom = bottom;
    }
    Object.assign(PIERect.prototype, {
      /**
       * 获取宽度
       * @memberOf Rect#
       * @returns {Number} -返回宽度
       */
      getWidth: function () {
        return this.right - this.left;
      },
      /**
       * 获取高度
       * @memberOf Rect#
       * @returns {Number} -返回高度
       */
      getHeight: function () {
        return this.bottom - this.top;
      },
      /**
       * 矩形合并
       * @param {Number} x
       * @param {Number} y
       * @memberOf Rect#
       *
       */
      union: function (x, y) {
        this.left = Math.min(this.left, x);
        this.top = Math.min(this.top, y);
        this.right = Math.max(this.right, x);
        this.bottom = Math.max(this.bottom, y);
      },
      /**
       * 矩形膨胀
       * @param {Number} leftmargin -左值的膨胀尺寸
       * @param {Number} topmargin -上值的膨胀尺寸
       * @param {Number} rightmargin -右值的膨胀尺寸
       * @param {Number} bottommargin -下值的膨胀尺寸
       * @memberOf Rect#
       *
       */
      inflate: function (leftmargin, topmargin, rightmargin, bottommargin) {
        this.left -= leftmargin;
        this.top -= topmargin;
        this.right += rightmargin;
        this.bottom += bottommargin;
      },
      /**
       * 矩形收缩
       * @param {Number} leftmargin -左值的收缩尺寸
       * @param {Number} topmargin -上值的收缩尺寸
       * @param {Number} rightmargin -右值的收缩尺寸
       * @param {Number} bottommargin -下值的收缩尺寸
       * @memberOf Rect#
       *
       */
      deflate: function (leftmargin, topmargin, rightmargin, bottommargin) {
        this.inflate(-leftmargin, -topmargin, -rightmargin, -bottommargin);
      },
      toArray: function () {
        return [this.left, this.top, this.right, this.bottom];
      }
    });
    PIERect.fromArray = function (array) {
      var arrayBuffer = array.toArrayBuffer();
      return new PIERect(arrayBuffer[0], arrayBuffer[1], arrayBuffer[2], arrayBuffer[3]);
    };
    PIERect.toArray = function (rect) {
      return new PIEArray([rect.left, rect.top, rect.right, rect.bottom], PIEArrayType.Int32);
    };

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 基础模块
     * ---
     */

    /**
     * 新添加颜色对象
     * @name Color
     * @class Color
     * 颜色类
     *
     * @param {Number} r -红 -范围(0~255)
     * @param {Number} g -绿 -范围(0~255)
     * @param {Number} b -蓝 -范围(0~255)
     * @param {Number} a -透明 -范围(0~255)
     * @example
     * let color = new PIE.Color(255,0,0,255);//红色
     */
    function PIEColor(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
    Object.assign(PIEColor.prototype, {
      /**
       * color对象克隆
       * @memberOf Color#
       * @returns {PIEColor} 返回克隆的color对象
       *
       */
      clone() {
        return new PIEColor(this.r, this.g, this.b, this.a);
      },
      toArray: function () {
        var array = [this.r, this.g, this.b, this.a];
        return array;
      }
    });
    function defined(value) {
      return value !== undefined && value !== null;
    }
    function defaultValue(a, b) {
      if (a !== undefined && a !== null) {
        return a;
      }
      return b;
    }
    function hue2rgb(m1, m2, h) {
      if (h < 0) {
        h += 1;
      }
      if (h > 1) {
        h -= 1;
      }
      if (h * 6 < 1) {
        return m1 + (m2 - m1) * 6 * h;
      }
      if (h * 2 < 1) {
        return m2;
      }
      if (h * 3 < 2) {
        return m1 + (m2 - m1) * (2 / 3 - h) * 6;
      }
      return m1;
    }

    //#rgba
    var rgbaMatcher = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i;
    //#rrggbbaa
    var rrggbbaaMatcher = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i;
    //rgb(), rgba(), or rgb%()
    var rgbParenthesesMatcher = /^rgba?\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)(?:\s*,\s*([0-9.]+))?\s*\)$/i;
    //hsl() or hsla()
    var hslParenthesesMatcher = /^hsla?\(\s*([0-9.]+)\s*,\s*([0-9.]+%)\s*,\s*([0-9.]+%)(?:\s*,\s*([0-9.]+))?\s*\)$/i;
    PIEColor.clone = function (color, result) {
      if (!defined(color)) {
        return undefined;
      }
      if (!defined(result)) {
        return new PIEColor(color.r, color.g, color.b, color.a);
      }
      result.r = color.r;
      result.g = color.g;
      result.b = color.b;
      result.a = color.a;
      return result;
    };
    PIEColor.fromHsl = function (hue, saturation, lightness, alpha, result) {
      hue = defaultValue(hue, 0.0) % 1.0;
      saturation = defaultValue(saturation, 0.0);
      lightness = defaultValue(lightness, 0.0);
      alpha = defaultValue(alpha, 1.0);
      var red = lightness;
      var green = lightness;
      var blue = lightness;
      if (saturation !== 0) {
        var m2;
        if (lightness < 0.5) {
          m2 = lightness * (1 + saturation);
        } else {
          m2 = lightness + saturation - lightness * saturation;
        }
        var m1 = 2.0 * lightness - m2;
        red = hue2rgb(m1, m2, hue + 1 / 3);
        green = hue2rgb(m1, m2, hue);
        blue = hue2rgb(m1, m2, hue - 1 / 3);
      }
      if (!defined(result)) {
        return new PIEColor(red * 255, green * 255, blue * 255, alpha * 255);
      }
      result.r = red * 255;
      result.g = green * 255;
      result.b = blue * 255;
      result.a = alpha * 255;
      return result;
    };
    PIEColor.fromCssColorString = function (color, result) {
      //>>includeStart('debug', pragmas.debug);
      // Check.typeOf.string("color", color);
      //>>includeEnd('debug');

      if (!defined(result)) {
        result = new PIEColor();
      }

      // Remove all whitespaces from the color string
      color = color.replace(/\s/g, "");
      var namedColor = PIEColor[color.toUpperCase()];
      if (defined(namedColor)) {
        PIEColor.clone(namedColor, result);
        return result;
      }
      var matches = rgbaMatcher.exec(color);
      if (matches !== null) {
        result.r = parseInt(matches[1], 16) / 15.0 * 255;
        result.g = parseInt(matches[2], 16) / 15.0 * 255;
        result.b = parseInt(matches[3], 16) / 15.0 * 255;
        result.a = parseInt(defaultValue(matches[4], "f"), 16) / 15.0 * 255;
        return result;
      }
      matches = rrggbbaaMatcher.exec(color);
      if (matches !== null) {
        result.r = parseInt(matches[1], 16);
        result.g = parseInt(matches[2], 16);
        result.b = parseInt(matches[3], 16);
        result.a = parseInt(defaultValue(matches[4], "ff"), 16);
        return result;
      }
      matches = rgbParenthesesMatcher.exec(color);
      if (matches !== null) {
        result.r = parseFloat(matches[1]) * ("%" === matches[1].substring(-1) ? 2.55 : 1);
        result.g = parseFloat(matches[2]) * ("%" === matches[2].substring(-1) ? 2.55 : 1);
        result.b = parseFloat(matches[3]) * ("%" === matches[3].substring(-1) ? 2.55 : 1);
        result.a = parseFloat(defaultValue(matches[4], "1.0")) * 255;
        return result;
      }
      matches = hslParenthesesMatcher.exec(color);
      if (matches !== null) {
        return PIEColor.fromHsl(parseFloat(matches[1]) / 360.0, parseFloat(matches[2]) / 100.0, parseFloat(matches[3]) / 100.0, parseFloat(defaultValue(matches[4], "1.0")), result);
      }
      result = undefined;
      return result;
    };

    /**
     * An immutable Color instance initialized to CSS color #F0F8FF
     * <span class="colorSwath" style="background: #F0F8FF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.ALICEBLUE = Object.freeze(PIEColor.fromCssColorString("#F0F8FF"));

    /**
     * An immutable Color instance initialized to CSS color #FAEBD7
     * <span class="colorSwath" style="background: #FAEBD7;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.ANTIQUEWHITE = Object.freeze(PIEColor.fromCssColorString("#FAEBD7"));

    /**
     * An immutable Color instance initialized to CSS color #00FFFF
     * <span class="colorSwath" style="background: #00FFFF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.AQUA = Object.freeze(PIEColor.fromCssColorString("#00FFFF"));

    /**
     * An immutable Color instance initialized to CSS color #7FFFD4
     * <span class="colorSwath" style="background: #7FFFD4;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.AQUAMARINE = Object.freeze(PIEColor.fromCssColorString("#7FFFD4"));

    /**
     * An immutable Color instance initialized to CSS color #F0FFFF
     * <span class="colorSwath" style="background: #F0FFFF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.AZURE = Object.freeze(PIEColor.fromCssColorString("#F0FFFF"));

    /**
     * An immutable Color instance initialized to CSS color #F5F5DC
     * <span class="colorSwath" style="background: #F5F5DC;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.BEIGE = Object.freeze(PIEColor.fromCssColorString("#F5F5DC"));

    /**
     * An immutable Color instance initialized to CSS color #FFE4C4
     * <span class="colorSwath" style="background: #FFE4C4;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.BISQUE = Object.freeze(PIEColor.fromCssColorString("#FFE4C4"));

    /**
     * An immutable Color instance initialized to CSS color #000000
     * <span class="colorSwath" style="background: #000000;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.BLACK = Object.freeze(PIEColor.fromCssColorString("#000000"));

    /**
     * An immutable Color instance initialized to CSS color #FFEBCD
     * <span class="colorSwath" style="background: #FFEBCD;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.BLANCHEDALMOND = Object.freeze(PIEColor.fromCssColorString("#FFEBCD"));

    /**
     * An immutable Color instance initialized to CSS color #0000FF
     * <span class="colorSwath" style="background: #0000FF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.BLUE = Object.freeze(PIEColor.fromCssColorString("#0000FF"));

    /**
     * An immutable Color instance initialized to CSS color #8A2BE2
     * <span class="colorSwath" style="background: #8A2BE2;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.BLUEVIOLET = Object.freeze(PIEColor.fromCssColorString("#8A2BE2"));

    /**
     * An immutable Color instance initialized to CSS color #A52A2A
     * <span class="colorSwath" style="background: #A52A2A;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.BROWN = Object.freeze(PIEColor.fromCssColorString("#A52A2A"));

    /**
     * An immutable Color instance initialized to CSS color #DEB887
     * <span class="colorSwath" style="background: #DEB887;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.BURLYWOOD = Object.freeze(PIEColor.fromCssColorString("#DEB887"));

    /**
     * An immutable Color instance initialized to CSS color #5F9EA0
     * <span class="colorSwath" style="background: #5F9EA0;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.CADETBLUE = Object.freeze(PIEColor.fromCssColorString("#5F9EA0"));
    /**
     * An immutable Color instance initialized to CSS color #7FFF00
     * <span class="colorSwath" style="background: #7FFF00;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.CHARTREUSE = Object.freeze(PIEColor.fromCssColorString("#7FFF00"));

    /**
     * An immutable Color instance initialized to CSS color #D2691E
     * <span class="colorSwath" style="background: #D2691E;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.CHOCOLATE = Object.freeze(PIEColor.fromCssColorString("#D2691E"));

    /**
     * An immutable Color instance initialized to CSS color #FF7F50
     * <span class="colorSwath" style="background: #FF7F50;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.CORAL = Object.freeze(PIEColor.fromCssColorString("#FF7F50"));

    /**
     * An immutable Color instance initialized to CSS color #6495ED
     * <span class="colorSwath" style="background: #6495ED;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.CORNFLOWERBLUE = Object.freeze(PIEColor.fromCssColorString("#6495ED"));

    /**
     * An immutable Color instance initialized to CSS color #FFF8DC
     * <span class="colorSwath" style="background: #FFF8DC;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.CORNSILK = Object.freeze(PIEColor.fromCssColorString("#FFF8DC"));

    /**
     * An immutable Color instance initialized to CSS color #DC143C
     * <span class="colorSwath" style="background: #DC143C;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.CRIMSON = Object.freeze(PIEColor.fromCssColorString("#DC143C"));

    /**
     * An immutable Color instance initialized to CSS color #00FFFF
     * <span class="colorSwath" style="background: #00FFFF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.CYAN = Object.freeze(PIEColor.fromCssColorString("#00FFFF"));

    /**
     * An immutable Color instance initialized to CSS color #00008B
     * <span class="colorSwath" style="background: #00008B;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKBLUE = Object.freeze(PIEColor.fromCssColorString("#00008B"));

    /**
     * An immutable Color instance initialized to CSS color #008B8B
     * <span class="colorSwath" style="background: #008B8B;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKCYAN = Object.freeze(PIEColor.fromCssColorString("#008B8B"));

    /**
     * An immutable Color instance initialized to CSS color #B8860B
     * <span class="colorSwath" style="background: #B8860B;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKGOLDENROD = Object.freeze(PIEColor.fromCssColorString("#B8860B"));

    /**
     * An immutable Color instance initialized to CSS color #A9A9A9
     * <span class="colorSwath" style="background: #A9A9A9;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKGRAY = Object.freeze(PIEColor.fromCssColorString("#A9A9A9"));

    /**
     * An immutable Color instance initialized to CSS color #006400
     * <span class="colorSwath" style="background: #006400;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKGREEN = Object.freeze(PIEColor.fromCssColorString("#006400"));

    /**
     * An immutable Color instance initialized to CSS color #A9A9A9
     * <span class="colorSwath" style="background: #A9A9A9;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKGREY = PIEColor.DARKGRAY;

    /**
     * An immutable Color instance initialized to CSS color #BDB76B
     * <span class="colorSwath" style="background: #BDB76B;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKKHAKI = Object.freeze(PIEColor.fromCssColorString("#BDB76B"));

    /**
     * An immutable Color instance initialized to CSS color #8B008B
     * <span class="colorSwath" style="background: #8B008B;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKMAGENTA = Object.freeze(PIEColor.fromCssColorString("#8B008B"));

    /**
     * An immutable Color instance initialized to CSS color #556B2F
     * <span class="colorSwath" style="background: #556B2F;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKOLIVEGREEN = Object.freeze(PIEColor.fromCssColorString("#556B2F"));

    /**
     * An immutable Color instance initialized to CSS color #FF8C00
     * <span class="colorSwath" style="background: #FF8C00;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKORANGE = Object.freeze(PIEColor.fromCssColorString("#FF8C00"));

    /**
     * An immutable Color instance initialized to CSS color #9932CC
     * <span class="colorSwath" style="background: #9932CC;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKORCHID = Object.freeze(PIEColor.fromCssColorString("#9932CC"));

    /**
     * An immutable Color instance initialized to CSS color #8B0000
     * <span class="colorSwath" style="background: #8B0000;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKRED = Object.freeze(PIEColor.fromCssColorString("#8B0000"));

    /**
     * An immutable Color instance initialized to CSS color #E9967A
     * <span class="colorSwath" style="background: #E9967A;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKSALMON = Object.freeze(PIEColor.fromCssColorString("#E9967A"));

    /**
     * An immutable Color instance initialized to CSS color #8FBC8F
     * <span class="colorSwath" style="background: #8FBC8F;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKSEAGREEN = Object.freeze(PIEColor.fromCssColorString("#8FBC8F"));

    /**
     * An immutable Color instance initialized to CSS color #483D8B
     * <span class="colorSwath" style="background: #483D8B;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKSLATEBLUE = Object.freeze(PIEColor.fromCssColorString("#483D8B"));

    /**
     * An immutable Color instance initialized to CSS color #2F4F4F
     * <span class="colorSwath" style="background: #2F4F4F;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKSLATEGRAY = Object.freeze(PIEColor.fromCssColorString("#2F4F4F"));

    /**
     * An immutable Color instance initialized to CSS color #2F4F4F
     * <span class="colorSwath" style="background: #2F4F4F;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKSLATEGREY = PIEColor.DARKSLATEGRAY;

    /**
     * An immutable Color instance initialized to CSS color #00CED1
     * <span class="colorSwath" style="background: #00CED1;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKTURQUOISE = Object.freeze(PIEColor.fromCssColorString("#00CED1"));

    /**
     * An immutable Color instance initialized to CSS color #9400D3
     * <span class="colorSwath" style="background: #9400D3;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DARKVIOLET = Object.freeze(PIEColor.fromCssColorString("#9400D3"));

    /**
     * An immutable Color instance initialized to CSS color #FF1493
     * <span class="colorSwath" style="background: #FF1493;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DEEPPINK = Object.freeze(PIEColor.fromCssColorString("#FF1493"));

    /**
     * An immutable Color instance initialized to CSS color #00BFFF
     * <span class="colorSwath" style="background: #00BFFF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DEEPSKYBLUE = Object.freeze(PIEColor.fromCssColorString("#00BFFF"));

    /**
     * An immutable Color instance initialized to CSS color #696969
     * <span class="colorSwath" style="background: #696969;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DIMGRAY = Object.freeze(PIEColor.fromCssColorString("#696969"));

    /**
     * An immutable Color instance initialized to CSS color #696969
     * <span class="colorSwath" style="background: #696969;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DIMGREY = PIEColor.DIMGRAY;

    /**
     * An immutable Color instance initialized to CSS color #1E90FF
     * <span class="colorSwath" style="background: #1E90FF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.DODGERBLUE = Object.freeze(PIEColor.fromCssColorString("#1E90FF"));

    /**
     * An immutable Color instance initialized to CSS color #B22222
     * <span class="colorSwath" style="background: #B22222;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.FIREBRICK = Object.freeze(PIEColor.fromCssColorString("#B22222"));

    /**
     * An immutable Color instance initialized to CSS color #FFFAF0
     * <span class="colorSwath" style="background: #FFFAF0;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.FLORALWHITE = Object.freeze(PIEColor.fromCssColorString("#FFFAF0"));

    /**
     * An immutable Color instance initialized to CSS color #228B22
     * <span class="colorSwath" style="background: #228B22;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.FORESTGREEN = Object.freeze(PIEColor.fromCssColorString("#228B22"));

    /**
     * An immutable Color instance initialized to CSS color #FF00FF
     * <span class="colorSwath" style="background: #FF00FF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.FUCHSIA = Object.freeze(PIEColor.fromCssColorString("#FF00FF"));

    /**
     * An immutable Color instance initialized to CSS color #DCDCDC
     * <span class="colorSwath" style="background: #DCDCDC;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.GAINSBORO = Object.freeze(PIEColor.fromCssColorString("#DCDCDC"));

    /**
     * An immutable Color instance initialized to CSS color #F8F8FF
     * <span class="colorSwath" style="background: #F8F8FF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.GHOSTWHITE = Object.freeze(PIEColor.fromCssColorString("#F8F8FF"));

    /**
     * An immutable Color instance initialized to CSS color #FFD700
     * <span class="colorSwath" style="background: #FFD700;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.GOLD = Object.freeze(PIEColor.fromCssColorString("#FFD700"));

    /**
     * An immutable Color instance initialized to CSS color #DAA520
     * <span class="colorSwath" style="background: #DAA520;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.GOLDENROD = Object.freeze(PIEColor.fromCssColorString("#DAA520"));

    /**
     * An immutable Color instance initialized to CSS color #808080
     * <span class="colorSwath" style="background: #808080;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.GRAY = Object.freeze(PIEColor.fromCssColorString("#808080"));

    /**
     * An immutable Color instance initialized to CSS color #008000
     * <span class="colorSwath" style="background: #008000;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.GREEN = Object.freeze(PIEColor.fromCssColorString("#008000"));

    /**
     * An immutable Color instance initialized to CSS color #ADFF2F
     * <span class="colorSwath" style="background: #ADFF2F;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.GREENYELLOW = Object.freeze(PIEColor.fromCssColorString("#ADFF2F"));

    /**
     * An immutable Color instance initialized to CSS color #808080
     * <span class="colorSwath" style="background: #808080;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.GREY = PIEColor.GRAY;

    /**
     * An immutable Color instance initialized to CSS color #F0FFF0
     * <span class="colorSwath" style="background: #F0FFF0;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.HONEYDEW = Object.freeze(PIEColor.fromCssColorString("#F0FFF0"));

    /**
     * An immutable Color instance initialized to CSS color #FF69B4
     * <span class="colorSwath" style="background: #FF69B4;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.HOTPINK = Object.freeze(PIEColor.fromCssColorString("#FF69B4"));

    /**
     * An immutable Color instance initialized to CSS color #CD5C5C
     * <span class="colorSwath" style="background: #CD5C5C;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.INDIANRED = Object.freeze(PIEColor.fromCssColorString("#CD5C5C"));

    /**
     * An immutable Color instance initialized to CSS color #4B0082
     * <span class="colorSwath" style="background: #4B0082;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.INDIGO = Object.freeze(PIEColor.fromCssColorString("#4B0082"));

    /**
     * An immutable Color instance initialized to CSS color #FFFFF0
     * <span class="colorSwath" style="background: #FFFFF0;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.IVORY = Object.freeze(PIEColor.fromCssColorString("#FFFFF0"));

    /**
     * An immutable Color instance initialized to CSS color #F0E68C
     * <span class="colorSwath" style="background: #F0E68C;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.KHAKI = Object.freeze(PIEColor.fromCssColorString("#F0E68C"));

    /**
     * An immutable Color instance initialized to CSS color #E6E6FA
     * <span class="colorSwath" style="background: #E6E6FA;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LAVENDER = Object.freeze(PIEColor.fromCssColorString("#E6E6FA"));

    /**
     * An immutable Color instance initialized to CSS color #FFF0F5
     * <span class="colorSwath" style="background: #FFF0F5;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LAVENDAR_BLUSH = Object.freeze(PIEColor.fromCssColorString("#FFF0F5"));

    /**
     * An immutable Color instance initialized to CSS color #7CFC00
     * <span class="colorSwath" style="background: #7CFC00;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LAWNGREEN = Object.freeze(PIEColor.fromCssColorString("#7CFC00"));

    /**
     * An immutable Color instance initialized to CSS color #FFFACD
     * <span class="colorSwath" style="background: #FFFACD;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LEMONCHIFFON = Object.freeze(PIEColor.fromCssColorString("#FFFACD"));

    /**
     * An immutable Color instance initialized to CSS color #ADD8E6
     * <span class="colorSwath" style="background: #ADD8E6;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTBLUE = Object.freeze(PIEColor.fromCssColorString("#ADD8E6"));

    /**
     * An immutable Color instance initialized to CSS color #F08080
     * <span class="colorSwath" style="background: #F08080;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTCORAL = Object.freeze(PIEColor.fromCssColorString("#F08080"));

    /**
     * An immutable Color instance initialized to CSS color #E0FFFF
     * <span class="colorSwath" style="background: #E0FFFF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTCYAN = Object.freeze(PIEColor.fromCssColorString("#E0FFFF"));

    /**
     * An immutable Color instance initialized to CSS color #FAFAD2
     * <span class="colorSwath" style="background: #FAFAD2;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTGOLDENRODYELLOW = Object.freeze(PIEColor.fromCssColorString("#FAFAD2"));

    /**
     * An immutable Color instance initialized to CSS color #D3D3D3
     * <span class="colorSwath" style="background: #D3D3D3;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTGRAY = Object.freeze(PIEColor.fromCssColorString("#D3D3D3"));

    /**
     * An immutable Color instance initialized to CSS color #90EE90
     * <span class="colorSwath" style="background: #90EE90;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTGREEN = Object.freeze(PIEColor.fromCssColorString("#90EE90"));

    /**
     * An immutable Color instance initialized to CSS color #D3D3D3
     * <span class="colorSwath" style="background: #D3D3D3;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTGREY = PIEColor.LIGHTGRAY;

    /**
     * An immutable Color instance initialized to CSS color #FFB6C1
     * <span class="colorSwath" style="background: #FFB6C1;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTPINK = Object.freeze(PIEColor.fromCssColorString("#FFB6C1"));

    /**
     * An immutable Color instance initialized to CSS color #20B2AA
     * <span class="colorSwath" style="background: #20B2AA;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTSEAGREEN = Object.freeze(PIEColor.fromCssColorString("#20B2AA"));

    /**
     * An immutable Color instance initialized to CSS color #87CEFA
     * <span class="colorSwath" style="background: #87CEFA;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTSKYBLUE = Object.freeze(PIEColor.fromCssColorString("#87CEFA"));

    /**
     * An immutable Color instance initialized to CSS color #778899
     * <span class="colorSwath" style="background: #778899;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTSLATEGRAY = Object.freeze(PIEColor.fromCssColorString("#778899"));

    /**
     * An immutable Color instance initialized to CSS color #778899
     * <span class="colorSwath" style="background: #778899;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTSLATEGREY = PIEColor.LIGHTSLATEGRAY;

    /**
     * An immutable Color instance initialized to CSS color #B0C4DE
     * <span class="colorSwath" style="background: #B0C4DE;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTSTEELBLUE = Object.freeze(PIEColor.fromCssColorString("#B0C4DE"));

    /**
     * An immutable Color instance initialized to CSS color #FFFFE0
     * <span class="colorSwath" style="background: #FFFFE0;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIGHTYELLOW = Object.freeze(PIEColor.fromCssColorString("#FFFFE0"));

    /**
     * An immutable Color instance initialized to CSS color #00FF00
     * <span class="colorSwath" style="background: #00FF00;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIME = Object.freeze(PIEColor.fromCssColorString("#00FF00"));

    /**
     * An immutable Color instance initialized to CSS color #32CD32
     * <span class="colorSwath" style="background: #32CD32;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LIMEGREEN = Object.freeze(PIEColor.fromCssColorString("#32CD32"));

    /**
     * An immutable Color instance initialized to CSS color #FAF0E6
     * <span class="colorSwath" style="background: #FAF0E6;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.LINEN = Object.freeze(PIEColor.fromCssColorString("#FAF0E6"));

    /**
     * An immutable Color instance initialized to CSS color #FF00FF
     * <span class="colorSwath" style="background: #FF00FF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MAGENTA = Object.freeze(PIEColor.fromCssColorString("#FF00FF"));

    /**
     * An immutable Color instance initialized to CSS color #800000
     * <span class="colorSwath" style="background: #800000;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MAROON = Object.freeze(PIEColor.fromCssColorString("#800000"));

    /**
     * An immutable Color instance initialized to CSS color #66CDAA
     * <span class="colorSwath" style="background: #66CDAA;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MEDIUMAQUAMARINE = Object.freeze(PIEColor.fromCssColorString("#66CDAA"));

    /**
     * An immutable Color instance initialized to CSS color #0000CD
     * <span class="colorSwath" style="background: #0000CD;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MEDIUMBLUE = Object.freeze(PIEColor.fromCssColorString("#0000CD"));

    /**
     * An immutable Color instance initialized to CSS color #BA55D3
     * <span class="colorSwath" style="background: #BA55D3;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MEDIUMORCHID = Object.freeze(PIEColor.fromCssColorString("#BA55D3"));

    /**
     * An immutable Color instance initialized to CSS color #9370DB
     * <span class="colorSwath" style="background: #9370DB;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MEDIUMPURPLE = Object.freeze(PIEColor.fromCssColorString("#9370DB"));

    /**
     * An immutable Color instance initialized to CSS color #3CB371
     * <span class="colorSwath" style="background: #3CB371;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MEDIUMSEAGREEN = Object.freeze(PIEColor.fromCssColorString("#3CB371"));

    /**
     * An immutable Color instance initialized to CSS color #7B68EE
     * <span class="colorSwath" style="background: #7B68EE;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MEDIUMSLATEBLUE = Object.freeze(PIEColor.fromCssColorString("#7B68EE"));

    /**
     * An immutable Color instance initialized to CSS color #00FA9A
     * <span class="colorSwath" style="background: #00FA9A;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MEDIUMSPRINGGREEN = Object.freeze(PIEColor.fromCssColorString("#00FA9A"));

    /**
     * An immutable Color instance initialized to CSS color #48D1CC
     * <span class="colorSwath" style="background: #48D1CC;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MEDIUMTURQUOISE = Object.freeze(PIEColor.fromCssColorString("#48D1CC"));

    /**
     * An immutable Color instance initialized to CSS color #C71585
     * <span class="colorSwath" style="background: #C71585;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MEDIUMVIOLETRED = Object.freeze(PIEColor.fromCssColorString("#C71585"));

    /**
     * An immutable Color instance initialized to CSS color #191970
     * <span class="colorSwath" style="background: #191970;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MIDNIGHTBLUE = Object.freeze(PIEColor.fromCssColorString("#191970"));

    /**
     * An immutable Color instance initialized to CSS color #F5FFFA
     * <span class="colorSwath" style="background: #F5FFFA;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MINTCREAM = Object.freeze(PIEColor.fromCssColorString("#F5FFFA"));

    /**
     * An immutable Color instance initialized to CSS color #FFE4E1
     * <span class="colorSwath" style="background: #FFE4E1;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MISTYROSE = Object.freeze(PIEColor.fromCssColorString("#FFE4E1"));

    /**
     * An immutable Color instance initialized to CSS color #FFE4B5
     * <span class="colorSwath" style="background: #FFE4B5;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.MOCCASIN = Object.freeze(PIEColor.fromCssColorString("#FFE4B5"));

    /**
     * An immutable Color instance initialized to CSS color #FFDEAD
     * <span class="colorSwath" style="background: #FFDEAD;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.NAVAJOWHITE = Object.freeze(PIEColor.fromCssColorString("#FFDEAD"));

    /**
     * An immutable Color instance initialized to CSS color #000080
     * <span class="colorSwath" style="background: #000080;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.NAVY = Object.freeze(PIEColor.fromCssColorString("#000080"));

    /**
     * An immutable Color instance initialized to CSS color #FDF5E6
     * <span class="colorSwath" style="background: #FDF5E6;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.OLDLACE = Object.freeze(PIEColor.fromCssColorString("#FDF5E6"));

    /**
     * An immutable Color instance initialized to CSS color #808000
     * <span class="colorSwath" style="background: #808000;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.OLIVE = Object.freeze(PIEColor.fromCssColorString("#808000"));

    /**
     * An immutable Color instance initialized to CSS color #6B8E23
     * <span class="colorSwath" style="background: #6B8E23;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.OLIVEDRAB = Object.freeze(PIEColor.fromCssColorString("#6B8E23"));

    /**
     * An immutable Color instance initialized to CSS color #FFA500
     * <span class="colorSwath" style="background: #FFA500;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.ORANGE = Object.freeze(PIEColor.fromCssColorString("#FFA500"));

    /**
     * An immutable Color instance initialized to CSS color #FF4500
     * <span class="colorSwath" style="background: #FF4500;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.ORANGERED = Object.freeze(PIEColor.fromCssColorString("#FF4500"));

    /**
     * An immutable Color instance initialized to CSS color #DA70D6
     * <span class="colorSwath" style="background: #DA70D6;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.ORCHID = Object.freeze(PIEColor.fromCssColorString("#DA70D6"));

    /**
     * An immutable Color instance initialized to CSS color #EEE8AA
     * <span class="colorSwath" style="background: #EEE8AA;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.PALEGOLDENROD = Object.freeze(PIEColor.fromCssColorString("#EEE8AA"));

    /**
     * An immutable Color instance initialized to CSS color #98FB98
     * <span class="colorSwath" style="background: #98FB98;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.PALEGREEN = Object.freeze(PIEColor.fromCssColorString("#98FB98"));

    /**
     * An immutable Color instance initialized to CSS color #AFEEEE
     * <span class="colorSwath" style="background: #AFEEEE;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.PALETURQUOISE = Object.freeze(PIEColor.fromCssColorString("#AFEEEE"));

    /**
     * An immutable Color instance initialized to CSS color #DB7093
     * <span class="colorSwath" style="background: #DB7093;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.PALEVIOLETRED = Object.freeze(PIEColor.fromCssColorString("#DB7093"));

    /**
     * An immutable Color instance initialized to CSS color #FFEFD5
     * <span class="colorSwath" style="background: #FFEFD5;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.PAPAYAWHIP = Object.freeze(PIEColor.fromCssColorString("#FFEFD5"));

    /**
     * An immutable Color instance initialized to CSS color #FFDAB9
     * <span class="colorSwath" style="background: #FFDAB9;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.PEACHPUFF = Object.freeze(PIEColor.fromCssColorString("#FFDAB9"));

    /**
     * An immutable Color instance initialized to CSS color #CD853F
     * <span class="colorSwath" style="background: #CD853F;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.PERU = Object.freeze(PIEColor.fromCssColorString("#CD853F"));

    /**
     * An immutable Color instance initialized to CSS color #FFC0CB
     * <span class="colorSwath" style="background: #FFC0CB;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.PINK = Object.freeze(PIEColor.fromCssColorString("#FFC0CB"));

    /**
     * An immutable Color instance initialized to CSS color #DDA0DD
     * <span class="colorSwath" style="background: #DDA0DD;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.PLUM = Object.freeze(PIEColor.fromCssColorString("#DDA0DD"));

    /**
     * An immutable Color instance initialized to CSS color #B0E0E6
     * <span class="colorSwath" style="background: #B0E0E6;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.POWDERBLUE = Object.freeze(PIEColor.fromCssColorString("#B0E0E6"));

    /**
     * An immutable Color instance initialized to CSS color #800080
     * <span class="colorSwath" style="background: #800080;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.PURPLE = Object.freeze(PIEColor.fromCssColorString("#800080"));

    /**
     * An immutable Color instance initialized to CSS color #FF0000
     * <span class="colorSwath" style="background: #FF0000;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.RED = Object.freeze(PIEColor.fromCssColorString("#FF0000"));

    /**
     * An immutable Color instance initialized to CSS color #BC8F8F
     * <span class="colorSwath" style="background: #BC8F8F;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.ROSYBROWN = Object.freeze(PIEColor.fromCssColorString("#BC8F8F"));

    /**
     * An immutable Color instance initialized to CSS color #4169E1
     * <span class="colorSwath" style="background: #4169E1;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.ROYALBLUE = Object.freeze(PIEColor.fromCssColorString("#4169E1"));

    /**
     * An immutable Color instance initialized to CSS color #8B4513
     * <span class="colorSwath" style="background: #8B4513;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SADDLEBROWN = Object.freeze(PIEColor.fromCssColorString("#8B4513"));

    /**
     * An immutable Color instance initialized to CSS color #FA8072
     * <span class="colorSwath" style="background: #FA8072;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SALMON = Object.freeze(PIEColor.fromCssColorString("#FA8072"));

    /**
     * An immutable Color instance initialized to CSS color #F4A460
     * <span class="colorSwath" style="background: #F4A460;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SANDYBROWN = Object.freeze(PIEColor.fromCssColorString("#F4A460"));

    /**
     * An immutable Color instance initialized to CSS color #2E8B57
     * <span class="colorSwath" style="background: #2E8B57;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SEAGREEN = Object.freeze(PIEColor.fromCssColorString("#2E8B57"));

    /**
     * An immutable Color instance initialized to CSS color #FFF5EE
     * <span class="colorSwath" style="background: #FFF5EE;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SEASHELL = Object.freeze(PIEColor.fromCssColorString("#FFF5EE"));

    /**
     * An immutable Color instance initialized to CSS color #A0522D
     * <span class="colorSwath" style="background: #A0522D;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SIENNA = Object.freeze(PIEColor.fromCssColorString("#A0522D"));

    /**
     * An immutable Color instance initialized to CSS color #C0C0C0
     * <span class="colorSwath" style="background: #C0C0C0;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SILVER = Object.freeze(PIEColor.fromCssColorString("#C0C0C0"));

    /**
     * An immutable Color instance initialized to CSS color #87CEEB
     * <span class="colorSwath" style="background: #87CEEB;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SKYBLUE = Object.freeze(PIEColor.fromCssColorString("#87CEEB"));

    /**
     * An immutable Color instance initialized to CSS color #6A5ACD
     * <span class="colorSwath" style="background: #6A5ACD;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SLATEBLUE = Object.freeze(PIEColor.fromCssColorString("#6A5ACD"));

    /**
     * An immutable Color instance initialized to CSS color #708090
     * <span class="colorSwath" style="background: #708090;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SLATEGRAY = Object.freeze(PIEColor.fromCssColorString("#708090"));

    /**
     * An immutable Color instance initialized to CSS color #708090
     * <span class="colorSwath" style="background: #708090;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SLATEGREY = PIEColor.SLATEGRAY;

    /**
     * An immutable Color instance initialized to CSS color #FFFAFA
     * <span class="colorSwath" style="background: #FFFAFA;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SNOW = Object.freeze(PIEColor.fromCssColorString("#FFFAFA"));

    /**
     * An immutable Color instance initialized to CSS color #00FF7F
     * <span class="colorSwath" style="background: #00FF7F;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.SPRINGGREEN = Object.freeze(PIEColor.fromCssColorString("#00FF7F"));

    /**
     * An immutable Color instance initialized to CSS color #4682B4
     * <span class="colorSwath" style="background: #4682B4;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.STEELBLUE = Object.freeze(PIEColor.fromCssColorString("#4682B4"));

    /**
     * An immutable Color instance initialized to CSS color #D2B48C
     * <span class="colorSwath" style="background: #D2B48C;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.TAN = Object.freeze(PIEColor.fromCssColorString("#D2B48C"));

    /**
     * An immutable Color instance initialized to CSS color #008080
     * <span class="colorSwath" style="background: #008080;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.TEAL = Object.freeze(PIEColor.fromCssColorString("#008080"));

    /**
     * An immutable Color instance initialized to CSS color #D8BFD8
     * <span class="colorSwath" style="background: #D8BFD8;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.THISTLE = Object.freeze(PIEColor.fromCssColorString("#D8BFD8"));

    /**
     * An immutable Color instance initialized to CSS color #FF6347
     * <span class="colorSwath" style="background: #FF6347;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.TOMATO = Object.freeze(PIEColor.fromCssColorString("#FF6347"));

    /**
     * An immutable Color instance initialized to CSS color #40E0D0
     * <span class="colorSwath" style="background: #40E0D0;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.TURQUOISE = Object.freeze(PIEColor.fromCssColorString("#40E0D0"));

    /**
     * An immutable Color instance initialized to CSS color #EE82EE
     * <span class="colorSwath" style="background: #EE82EE;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.VIOLET = Object.freeze(PIEColor.fromCssColorString("#EE82EE"));

    /**
     * An immutable Color instance initialized to CSS color #F5DEB3
     * <span class="colorSwath" style="background: #F5DEB3;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.WHEAT = Object.freeze(PIEColor.fromCssColorString("#F5DEB3"));

    /**
     * An immutable Color instance initialized to CSS color #FFFFFF
     * <span class="colorSwath" style="background: #FFFFFF;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.WHITE = Object.freeze(PIEColor.fromCssColorString("#FFFFFF"));

    /**
     * An immutable Color instance initialized to CSS color #F5F5F5
     * <span class="colorSwath" style="background: #F5F5F5;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.WHITESMOKE = Object.freeze(PIEColor.fromCssColorString("#F5F5F5"));

    /**
     * An immutable Color instance initialized to CSS color #FFFF00
     * <span class="colorSwath" style="background: #FFFF00;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.YELLOW = Object.freeze(PIEColor.fromCssColorString("#FFFF00"));

    /**
     * An immutable Color instance initialized to CSS color #9ACD32
     * <span class="colorSwath" style="background: #9ACD32;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.YELLOWGREEN = Object.freeze(PIEColor.fromCssColorString("#9ACD32"));

    /**
     * An immutable Color instance initialized to CSS transparent.
     * <span class="colorSwath" style="background: transparent;"></span>
     *
     * @constant
     * @type {PIEColor}
     */
    PIEColor.TRANSPARENT = Object.freeze(new PIEColor(0, 0, 0, 0));

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 基础模块
     * ---
     */

    /**
     * 创建四至范围
     * @name Bounds
     * @class Bounds
     * 四至范围类
     *
     * @param {Number} left -左值
     * @param {Number} top -上值
     * @param {Number} right -右值
     * @param {Number} bottom -下值
     */
    function PIEBounds(left, top, right, bottom) {
      this.left = left;
      this.top = top;
      this.right = right;
      this.bottom = bottom;
    }
    Object.assign(PIEBounds.prototype, {
      /**
       * 设置为空
       * @memberOf Bounds#
       *
       */
      setEmpty: function () {
        this.left = this.top = this.right = this.bottom = 0;
      },
      /**
       * 判断是否为空
       * @memberOf Bounds#
       * @returns {Boolean} 返回是否为空
       *
       */
      isEmpty: function () {
        return this.left >= this.right || this.bottom >= this.top;
      },
      /**
       * 判断是否为空
       * @memberOf Bounds#
       * @returns {Boolean} 返回是否为空
       */
      isNull: function () {
        return PIEMath.isZero(this.left) && PIEMath.isZero(this.right) && PIEMath.isZero(this.bottom) && PIEMath.isZero(this.top);
      },
      /**
       * 获取宽度
       * @memberOf Bounds#
       * @returns {Number} 返回宽度
       */
      getWidth: function () {
        return this.right - this.left;
      },
      /**
       * 获取高度
       * @memberOf Bounds#
       * @returns {Number} 返回高度
       *
       */
      getHeight: function () {
        return this.top - this.bottom;
      },
      /**
       * 点扩充
       * @param {PIEVector2} point -点
       * @memberOf Bounds#
       *
       */
      unionPoint: function (point) {
        if (this.left > point.x) {
          this.left = point.x;
        }
        if (this.right < point.x) {
          this.right = point.x;
        }
        if (this.top < point.y) {
          this.top = point.y;
        }
        if (this.bottom > point.y) {
          this.bottom = point.y;
        }
      },
      /**
       * 范围扩充
       * @param {PIEBounds} bounds -范围
       * @memberOf Bounds#
       *
       */
      unionBounds: function (bounds) {
        if (this.left > bounds.left) {
          this.left = bounds.left;
        }
        if (this.right < bounds.right) {
          this.right = bounds.right;
        }
        if (this.top < bounds.top) {
          this.top = bounds.top;
        }
        if (this.bottom > bounds.bottom) {
          this.bottom = bounds.bottom;
        }
      },
      /**
       * 范围扩大
       * @param {Number} leftmargin -左值的膨胀尺寸
       * @param {Number} topmargin -上值的膨胀尺寸
       * @param {Number} rightmargin -右值的膨胀尺寸
       * @param {Number} bottommargin -下值的膨胀尺寸
       * @memberOf Bounds#
       *
       */
      inflate: function (leftmargin, topmargin, rightmargin, bottommargin) {
        this.left -= leftmargin;
        this.top += topmargin;
        this.right += rightmargin;
        this.bottom -= bottommargin;
      },
      /**
       * 范围缩小
       * @param {Number} leftmargin -左值的收缩尺寸
       * @param {Number} topmargin -上值的收缩尺寸
       * @param {Number} rightmargin -右值的收缩尺寸
       * @param {Number} bottommargin -下值的收缩尺寸
       * @memberOf Bounds#
       *
       */
      deflate: function (leftmargin, topmargin, rightmargin, bottommargin) {
        this.inflate(-leftmargin, -topmargin, -rightmargin, -bottommargin);
      },
      /**
       * 范围是否相交
       * @param {PIEBounds} bounds -范围
       * @memberOf Bounds#
       * @returns {Boolean} 返回是否相交
       *
       */
      isIntersect: function (bounds) {
        return this.right >= bounds.left && this.left <= bounds.right && this.top >= bounds.bottom && this.bottom <= bounds.top;
      },
      /**
       * 获取中心点
       * @memberOf Bounds#
       * @returns {PIEVector2} 返回中心点
       *
       */
      getCenter: function () {
        return new PIEVector2((this.right + this.left) / 2, (this.top + this.bottom) / 2);
      },
      /**
       * 拷贝数据
       * @param {PIEBounds} bounds -范围
       * @memberOf Bounds#
       *
       */
      copy: function (bounds) {
        this.left = bounds.left;
        this.top = bounds.top;
        this.right = bounds.right;
        this.bottom = bounds.bottom;
      },
      toArray: function () {
        var array = [this.left, this.top, this.right, this.bottom];
        return array;
      }
    });
    PIEBounds.fromArray = function (array) {
      var arrayBuffer = null;
      if (array instanceof PIEArray) {
        arrayBuffer = array.toArrayBuffer();
      } else if (array instanceof Array) {
        arrayBuffer = array;
      }
      return new PIEBounds(arrayBuffer[0], arrayBuffer[1], arrayBuffer[2], arrayBuffer[3]);
    };
    PIEBounds.toArray = function (rect) {
      return new PIEArray([rect.left, rect.top, rect.right, rect.bottom], PIEArrayType.Float64);
    };

    function PIEString(value) {
      var type = typeof value;
      if (type == 'string') {
        //this.handle = PlotModule.allocate(intArrayFromString(value), 1);
        this.handle = PlotModule.allocateUTF8(value);
      } else if (type == 'number') {
        this.handle = PlotModule._malloc(value);
      } else {
        this.handle = null;
      }
    }
    Object.assign(PIEString.prototype, {
      getHandle: function () {
        return this.handle;
      },
      dispose: function () {
        if (this.handle != null) {
          PlotModule._free(this.handle);
          this.handle = null;
        }
      },
      toString: function () {
        if (this.handle != null) {
          return PlotModule.UTF8ToString(this.handle);
        }
        return null;
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 基础模块
     * ---
     */

    /**
     * 三维4阶向量类
     * @name Vector4
     * @class Vector4
     *
     * @param {Number} x -x值
     * @param {Number} y -y值
     * @param {Number} z -z值
     * @param {Number} w -w值
     *
     */
    function PIEVector4(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }
    Object.assign(PIEVector4.prototype, {
      /**
       * 向量相乘
       * @param {PIEVector4} v -向量
       * @memberOf Vector4#
       *
       */
      multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        this.w *= v.w;
        return this;
      },
      /**
       * 求向量乘以一个4*4矩阵
       * @param {PIEMatrix4} matrix -4*4矩阵
       * @memberOf Vector4#
       *
       */
      applyMatrix4(m) {
        const x = this.x,
          y = this.y,
          z = this.z,
          w = this.w;
        const e = m.m;
        this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
        this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
        return this;
      },
      toArray: function () {
        return [this.x, this.y, this.z, this.w];
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 基础模块
     * ---
     */

    /**
     * 创建四维矩阵
     * @name Matrix4
     * @class Matrix4
     * 四维矩阵操作函数
     */
    function PIEMatrix4() {
      this.m = new Float32Array(16);
      {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 1;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = 1;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
      }
    }
    Object.assign(PIEMatrix4.prototype, {
      /**
       * 创建矩阵
       * @param {Number} m0
       * @param {Number} m1
       * @param {Number} m2
       * @param {Number} m3
       * @param {Number} m4
       * @param {Number} m5
       * @param {Number} m6
       * @param {Number} m7
       * @param {Number} m8
       * @param {Number} m9
       * @param {Number} m10
       * @param {Number} m11
       * @param {Number} m12
       * @param {Number} m13
       * @param {Number} m14
       * @param {Number} m15
       *
       * @memberOf Matrix4#
       * @returns {PIEMatrix4} 返回创建的矩阵
       */
      create: function (m0, m4, m8, m12, m1, m5, m9, m13, m2, m6, m10, m14, m3, m7, m11, m15) {
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        this.m[6] = m6;
        this.m[7] = m7;
        this.m[8] = m8;
        this.m[9] = m9;
        this.m[10] = m10;
        this.m[11] = m11;
        this.m[12] = m12;
        this.m[13] = m13;
        this.m[14] = m14;
        this.m[15] = m15;
        return this;
      },
      /**
       * 构造float的4*4单位矩阵
       * @memberOf Matrix4#
       * @returns {PIEMatrix4} 返回单位矩阵
       */
      identity: function () {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 1;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = 1;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
        return this;
      },
      /**
       * 初始化4*4的单位矩阵
       * @memberOf Matrix4#
       * @returns {PIEMatrix4} 返回初始化的矩阵
       */
      zero: function () {
        this.m[0] = 0;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 0;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = 0;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 0;
        return this;
      },
      /**
       * 矩阵相乘
       * @param {PIEMatrix4} matrix -4*4矩阵对象
       * @memberOf Matrix4#
       * @returns {PIEMatrix4} 返回相乘后的矩阵
       */
      multiply(matrix) {
        const ae = this.m;
        const be = matrix.m;
        const a11 = ae[0],
          a12 = ae[4],
          a13 = ae[8],
          a14 = ae[12];
        const a21 = ae[1],
          a22 = ae[5],
          a23 = ae[9],
          a24 = ae[13];
        const a31 = ae[2],
          a32 = ae[6],
          a33 = ae[10],
          a34 = ae[14];
        const a41 = ae[3],
          a42 = ae[7],
          a43 = ae[11],
          a44 = ae[15];
        const b11 = be[0],
          b12 = be[4],
          b13 = be[8],
          b14 = be[12];
        const b21 = be[1],
          b22 = be[5],
          b23 = be[9],
          b24 = be[13];
        const b31 = be[2],
          b32 = be[6],
          b33 = be[10],
          b34 = be[14];
        const b41 = be[3],
          b42 = be[7],
          b43 = be[11],
          b44 = be[15];
        this.m[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        this.m[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        this.m[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        this.m[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        this.m[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        this.m[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        this.m[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        this.m[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        this.m[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        this.m[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        this.m[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        this.m[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        this.m[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        this.m[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        this.m[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        this.m[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return this;
      },
      /**
       * 平移矩阵
       * @param {Number} x -x值
       * @param {Number} y -y值
       * @param {Number} z -z值
       * @memberOf Matrix4#
       * @returns {PIEMatrix4} 返回平移后的矩阵
       */
      translation: function (x, y, z) {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 1;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = 1;
        this.m[11] = 0;
        this.m[12] = x;
        this.m[13] = y;
        this.m[14] = z;
        this.m[15] = 1;
        return this;
      },
      /**
       * 缩放矩阵
       * @param {Number} x -x值
       * @param {Number} y -y值
       * @param {Number} z -z值
       * @memberOf Matrix4#
       * @returns {PIEMatrix4} 返回缩放后的矩阵
       */
      scaling: function (x, y, z) {
        this.m[0] = x;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = y;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = z;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
        return this;
      },
      /**
       * 以X轴旋转
       * @param {Number} radian -顺时针旋转角度
       * @memberOf Matrix4#
       * @returns {PIEMatrix4} 返回旋转后的矩阵
       */
      rotationX: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = c;
        this.m[6] = s;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = -s;
        this.m[10] = c;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
        return this;
      },
      /**
       * 以Y轴旋转
       * @param {Number} radian -顺时针旋转角度
       * @returns {PIEMatrix4} 返回旋转后的矩阵
       * @memberOf Matrix4#
       */
      rotationY: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = c;
        this.m[1] = 0;
        this.m[2] = -s;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 1;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = s;
        this.m[9] = 0;
        this.m[10] = c;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
        return this;
      },
      /**
       * 以Z轴旋转
       * @param {Number} radian -顺时针旋转角度
       *@returns {PIEMatrix4} 返回旋转后的矩阵
       * @memberOf Matrix4#
       */
      rotationZ: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = c;
        this.m[1] = s;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = -s;
        this.m[5] = c;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = 1;
        this.m[11] = 0;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = 0;
        this.m[15] = 1;
        return this;
      },
      /**
       * 计算逆矩阵
       * @returns {PIEMatrix4} 矩阵
       * @returns {PIEMatrix4} 返回逆矩阵
       * @memberOf Matrix4#
       */
      invert: function () {
        // transpose matrix
        var src0 = this.m[0];
        var src4 = this.m[1];
        var src8 = this.m[2];
        var src12 = this.m[3];
        var src1 = this.m[4];
        var src5 = this.m[5];
        var src9 = this.m[6];
        var src13 = this.m[7];
        var src2 = this.m[8];
        var src6 = this.m[9];
        var src10 = this.m[10];
        var src14 = this.m[11];
        var src3 = this.m[12];
        var src7 = this.m[13];
        var src11 = this.m[14];
        var src15 = this.m[15];

        // calculate pairs for first 8 elements (cofactors)
        var atmp0 = src10 * src15;
        var atmp1 = src11 * src14;
        var atmp2 = src9 * src15;
        var atmp3 = src11 * src13;
        var atmp4 = src9 * src14;
        var atmp5 = src10 * src13;
        var atmp6 = src8 * src15;
        var atmp7 = src11 * src12;
        var atmp8 = src8 * src14;
        var atmp9 = src10 * src12;
        var atmp10 = src8 * src13;
        var atmp11 = src9 * src12;

        // calculate first 8 elements (cofactors)
        var dst0 = atmp0 * src5 + atmp3 * src6 + atmp4 * src7 - (atmp1 * src5 + atmp2 * src6 + atmp5 * src7);
        var dst1 = atmp1 * src4 + atmp6 * src6 + atmp9 * src7 - (atmp0 * src4 + atmp7 * src6 + atmp8 * src7);
        var dst2 = atmp2 * src4 + atmp7 * src5 + atmp10 * src7 - (atmp3 * src4 + atmp6 * src5 + atmp11 * src7);
        var dst3 = atmp5 * src4 + atmp8 * src5 + atmp11 * src6 - (atmp4 * src4 + atmp9 * src5 + atmp10 * src6);
        var dst4 = atmp1 * src1 + atmp2 * src2 + atmp5 * src3 - (atmp0 * src1 + atmp3 * src2 + atmp4 * src3);
        var dst5 = atmp0 * src0 + atmp7 * src2 + atmp8 * src3 - (atmp1 * src0 + atmp6 * src2 + atmp9 * src3);
        var dst6 = atmp3 * src0 + atmp6 * src1 + atmp11 * src3 - (atmp2 * src0 + atmp7 * src1 + atmp10 * src3);
        var dst7 = atmp4 * src0 + atmp9 * src1 + atmp10 * src2 - (atmp5 * src0 + atmp8 * src1 + atmp11 * src2);

        // calculate pairs for second 8 elements (cofactors)
        var btmp0 = src2 * src7;
        var btmp1 = src3 * src6;
        var btmp2 = src1 * src7;
        var btmp3 = src3 * src5;
        var btmp4 = src1 * src6;
        var btmp5 = src2 * src5;
        var btmp6 = src0 * src7;
        var btmp7 = src3 * src4;
        var btmp8 = src0 * src6;
        var btmp9 = src2 * src4;
        var btmp10 = src0 * src5;
        var btmp11 = src1 * src4;

        // calculate second 8 elements (cofactors)
        var dst8 = btmp0 * src13 + btmp3 * src14 + btmp4 * src15 - (btmp1 * src13 + btmp2 * src14 + btmp5 * src15);
        var dst9 = btmp1 * src12 + btmp6 * src14 + btmp9 * src15 - (btmp0 * src12 + btmp7 * src14 + btmp8 * src15);
        var dst10 = btmp2 * src12 + btmp7 * src13 + btmp10 * src15 - (btmp3 * src12 + btmp6 * src13 + btmp11 * src15);
        var dst11 = btmp5 * src12 + btmp8 * src13 + btmp11 * src14 - (btmp4 * src12 + btmp9 * src13 + btmp10 * src14);
        var dst12 = btmp2 * src10 + btmp5 * src11 + btmp1 * src9 - (btmp4 * src11 + btmp0 * src9 + btmp3 * src10);
        var dst13 = btmp8 * src11 + btmp0 * src8 + btmp7 * src10 - (btmp6 * src10 + btmp9 * src11 + btmp1 * src8);
        var dst14 = btmp6 * src9 + btmp11 * src11 + btmp3 * src8 - (btmp10 * src11 + btmp2 * src8 + btmp7 * src9);
        var dst15 = btmp10 * src10 + btmp4 * src8 + btmp9 * src9 - (btmp8 * src9 + btmp11 * src10 + btmp5 * src8);

        // calculate determinant
        var det = src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;
        if (det == 0) {
          return this.identity();
        }

        // calculate matrix inverse
        var invdet = 1.0 / det;
        this.m[0] = dst0 * invdet;
        this.m[1] = dst1 * invdet;
        this.m[2] = dst2 * invdet;
        this.m[3] = dst3 * invdet;
        this.m[4] = dst4 * invdet;
        this.m[5] = dst5 * invdet;
        this.m[6] = dst6 * invdet;
        this.m[7] = dst7 * invdet;
        this.m[8] = dst8 * invdet;
        this.m[9] = dst9 * invdet;
        this.m[10] = dst10 * invdet;
        this.m[11] = dst11 * invdet;
        this.m[12] = dst12 * invdet;
        this.m[13] = dst13 * invdet;
        this.m[14] = dst14 * invdet;
        this.m[15] = dst15 * invdet;
        return this;
      },
      // /**
      //  * 设置旋转矩阵
      //  * @param {PIEMatrix4d} matrix -矩阵
      //  *
      //  * @memberOf Matrix4#
      //  */
      // fromRotationMatrix: function (matrix) {
      //     this.m[0] = matrix.m[0];
      //     this.m[1] = matrix.m[1];
      //     this.m[2] = matrix.m[2];
      //     this.m[3] = matrix.m[4];
      //     this.m[4] = matrix.m[5];
      //     this.m[5] = matrix.m[6];
      //     this.m[6] = matrix.m[8];
      //     this.m[7] = matrix.m[9];
      //     this.m[8] = matrix.m[10];
      // },
      // /**
      //  * 取旋转矩阵
      //  * @returns {PIEMatrix3f} -矩阵
      //  *
      //  * @memberOf Matrix4#
      //  */
      // toRotationMatrix: function () {
      //     var matrix = new PIEMatrix3f();
      //     matrix.m[0] = this.m[0];
      //     matrix.m[1] = this.m[1];
      //     matrix.m[2] = this.m[2];
      //     matrix.m[3] = this.m[4];
      //     matrix.m[4] = this.m[5];
      //     matrix.m[5] = this.m[6];
      //     matrix.m[6] = this.m[8];
      //     matrix.m[7] = this.m[9];
      //     matrix.m[8] = this.m[10];
      //     return matrix;
      // },
      /**
       * 转置矩阵
       * @returns {PIEMatrix4} 矩阵
       * @returns {PIEMatrix4} 返回转置矩阵
       * @memberOf Matrix4#
       */
      transpose: function () {
        const te = this.m;
        let tmp;
        tmp = te[1];
        te[1] = te[4];
        te[4] = tmp;
        tmp = te[2];
        te[2] = te[8];
        te[8] = tmp;
        tmp = te[6];
        te[6] = te[9];
        te[9] = tmp;
        tmp = te[3];
        te[3] = te[12];
        te[12] = tmp;
        tmp = te[7];
        te[7] = te[13];
        te[13] = tmp;
        tmp = te[11];
        te[11] = te[14];
        te[14] = tmp;
        return this;
      },
      /**
       * 采用施密特正交方法计算出正交矩阵
       * @param {Number} left -x的最小值
       * @param {Number} right -x的最大值
       * @param {Number} bottom -y的最小值
       * @param {Number} top -y的最大值
       * @param {Number} nearly -z的最小值
       * @param {Number} faraway -z的最大值
       *@returns {PIEMatrix4} 返回正交矩阵
       * @memberOf Matrix4#
       */
      ortho: function (left, right, bottom, top, nearly, faraway) {
        var a = 2.0 / (right - left);
        var b = 2.0 / (top - bottom);
        var c = -2.0 / (faraway - nearly);
        var tx = (right + left) / (right - left);
        var ty = (top + bottom) / (top - bottom);
        var tz = (faraway + nearly) / (faraway - nearly);
        this.m[0] = a;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = b;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        this.m[9] = 0;
        this.m[10] = c;
        this.m[11] = 0;
        this.m[12] = tx;
        this.m[13] = ty;
        this.m[14] = tz;
        this.m[15] = 1;
        return this;
      },
      /**
       * 设置视图矩阵
       * @param {Number} left -设定相机视锥的左平面的值
       * @param {Number} right -设定相机视锥的右平面的值
       * @param {Number} bottom -设定相机视锥的底面的值
       * @param {Number} top -设定相机视锥的顶面的值
       * @param {Number} nearly -设置相机视锥台的近平面的值
       * @param {Number} faraway -设置相机视锥台接远平面的值
       * @returns {PIEMatrix4} 返回view矩阵
       * @memberOf Matrix4#
       */
      frustum: function (left, right, bottom, top, nearly, faraway) {
        var a = 2 * nearly / (right - left);
        var b = 2 * nearly / (top - bottom);
        var c = (right + left) / (right - left);
        var d = (top + bottom) / (top - bottom);
        var e = -(faraway + nearly) / (faraway - nearly);
        var f = -2 * faraway * nearly / (faraway - nearly);
        this.m[0] = a;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = b;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = c;
        this.m[9] = d;
        this.m[10] = e;
        this.m[11] = -1;
        this.m[12] = 0;
        this.m[13] = 0;
        this.m[14] = f;
        this.m[15] = 1;
        return this;
      },
      /**
       * 设置视图矩阵
       * @param {Number} fovy -视角的大小
       * @param {Number} aspect -表示裁剪面的宽高比
       * @param {Number} zNear -近裁剪面到眼睛的距离
       * @param {Number} zFar -远裁剪面到眼睛的距离
       * @returns {PIEMatrix4} 返回视图矩阵
       * @memberOf Matrix4#
       */
      perspective: function (fovy, aspect, zNear, zFar) {
        var f = 1.0 / Math.tan(fovy / 2);
        var rangeReciprocal = 1.0 / (zNear - zFar);
        this.m[0] = f / aspect;
        this.m[1] = 0.0;
        this.m[2] = 0.0;
        this.m[3] = 0.0;
        this.m[4] = 0.0;
        this.m[5] = f;
        this.m[6] = 0.0;
        this.m[7] = 0.0;
        this.m[8] = 0.0;
        this.m[9] = 0.0;
        this.m[10] = (zFar + zNear) * rangeReciprocal;
        this.m[11] = -1.0;
        this.m[12] = 0.0;
        this.m[13] = 0.0;
        this.m[14] = 2.0 * zFar * zNear * rangeReciprocal;
        this.m[15] = 0.0;
        return this;
      },
      /**
       * 克隆
       * @memberOf Matrix4#
       * @returns {PIEMatrix4} 返回克隆后的矩阵
       */
      clone: function () {
        var matrix = new PIEMatrix4();
        for (var i = 0; i < 16; i++) {
          matrix.m[i] = this.m[i];
        }
        return matrix;
      },
      toArray: function (array = [], offset = 0) {
        const te = this.m;
        array[offset] = te[0];
        array[offset + 1] = te[1];
        array[offset + 2] = te[2];
        array[offset + 3] = te[3];
        array[offset + 4] = te[4];
        array[offset + 5] = te[5];
        array[offset + 6] = te[6];
        array[offset + 7] = te[7];
        array[offset + 8] = te[8];
        array[offset + 9] = te[9];
        array[offset + 10] = te[10];
        array[offset + 11] = te[11];
        array[offset + 12] = te[12];
        array[offset + 13] = te[13];
        array[offset + 14] = te[14];
        array[offset + 15] = te[15];
        return array;
      }
    });
    PIEMatrix4.fromArray = function (m) {
      if (m instanceof Array && m.length == 16) {
        let resMatrix = new PIEMatrix4();
        resMatrix.create(m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]);
        return resMatrix;
      }
      return null;
    };

    /**
     * 矩阵和矩阵相乘
     * @param {PIEMatrix4} lhs -左矩阵
     * @param {PIEMatrix4} rhs -右矩阵
     *
     * @memberOf Matrix4
     * @returns {PIEMatrix4} 返回结果
     *
     *
     */
    PIEMatrix4.multiply = function (lhs, rhs) {
      var result = lhs.clone();
      return result.multiply(rhs);
    };

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 基础模块
     * ---
     */

    /**
     * 三维向量类
     * @name Vector3
     * @class Vector3
     *
     * @param {Number} x -x值
     * @param {Number} y -y值
     * @param {Number} z -z值
     */
    function PIEVector3(x, y, z) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
    }
    Object.assign(PIEVector3.prototype, {
      /**
       * 进行规格化
       * @memberOf Vector3#
       *
       */
      normalize: function () {
        var length = this.length();
        if (length != 0) {
          this.x /= length;
          this.y /= length;
          this.z /= length;
        }
      },
      /**
       * 进行归一化
       *
       * @memberOf Vector3#
       * @returns {PIEVector3} 返回归一化后的向量
       *
       */
      normalized: function () {
        var v = new PIEVector3(this.x, this.y, this.z);
        v.normalize();
        return v;
      },
      /**
       * 求向量的长度
       *
       * @memberOf Vector3#
       * @returns {number} 返回向量的长度
       *
       */
      length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      },
      /**
       * 自身缩放
       * @param {Number} s -value
       * @memberOf Vector3#
       *
       * @returns {PIEVector3} 返回缩放后的向量
       *
       */
      scale: function (s) {
        return new PIEVector3(this.x * s, this.y * s, this.z * s);
      },
      /**
       * 判断向量的长度是否为0
       *
       * @memberOf Vector3#
       * @returns {Boolean} 如果向量长度为0返回0，否则返回向量长度
       *
       */
      isZero: function () {
        return PIEMath.isZero(this.length());
      },
      /**
       * 求两个向量的叉积
       * @param {PIEVector3} vec -三维向量
       * @memberOf Vector3#
       *
       * @returns {PIEVector3} 返回叉积结果
       *
       */
      cross: function (vec) {
        return new PIEVector3(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x);
      },
      /**
       * 求两个向量的点积
       * @param {PIEVector3} vec -三维向量
       * @memberOf Vector3#
       *
       * @returns {Number} 返回点积结果
       *
       */
      dot: function (vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
      },
      /**
       * 向量相减
       * @param {PIEVector3} vec -三维向量
       * @memberOf Vector3#
       *
       * @returns {PIEVector3} 返回相减后的向量
       *
       */
      sub: function (vec) {
        return new PIEVector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
      },
      /**
       * 向量相加
       * @param {PIEVector3} vec -三维向量
       * @memberOf Vector3#
       *
       * @returns {PIEVector3} 返回相加后的向量
       *
       */
      add: function (vec) {
        return new PIEVector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
      },
      /**
       * 向量克隆
       *
       * @memberOf Vector3#
       * @returns {PIEVector3} 返回克隆的向量
       *
       */
      clone: function () {
        return new PIEVector3(this.x, this.y, this.z);
      },
      // /**
      //  * 求向量乘以一个4*3的矩阵
      //  * @param {PIEVector4} v -向量
      //  * @param {PIEMatrix4} matrix -4*4矩阵
      //  * @memberOf Vector3#
      //  *
      //  * @returns {PIEVector4} 返回相乘后的结果
      //  *
      //  */
      // multiply: function (matrix) {
      //     var v = new PIEVector4(this.x, this.y, this.z, 1.0);
      //     var m11 = 0, m12 = 0, m13 = 0, ml4 = 0;
      //
      //     m11 = v.x * matrix.m[0] + v.y * matrix.m[4] + v.z * matrix.m[8] + v.w * matrix.m[12];
      //     m12 = v.x * matrix.m[1] + v.y * matrix.m[5] + v.z * matrix.m[9] + v.w * matrix.m[13];
      //     m13 = v.x * matrix.m[2] + v.y * matrix.m[6] + v.z * matrix.m[10] + v.w * matrix.m[14];
      //     ml4 = v.x * matrix.m[3] + v.y * matrix.m[7] + v.z * matrix.m[11] + v.w * matrix.m[15];
      //     return new PIEVector4(m11, m12, m13, ml4);
      // },

      /**
       * 向量相乘
       * @param {PIEVector3} v -向量
       * @memberOf Vector3#
       * @returns {PIEVector3} 返回相乘后的结果
       *
       */
      multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
      },
      /**
       * 将空间坐标转换成windows坐标
       * @param {PIEVector4} viewport -视口
       * @param {PIEMatrix4} projection -投影矩阵
       * @param {PIEMatrix4} view -视图矩阵
       * @param {PIEMatrix4} world -世界矩阵
       * @memberOf Vector3#
       *
       */
      project: function (viewport, projection, view, world) {
        var m = PIEMatrix4.multiply(projection, view);
        m = PIEMatrix4.multiply(m, world);
        var v = new PIEVector4(this.x, this.y, this.z, 1.0);
        v.applyMatrix4(m);
        if (v.w == 0) {
          return;
        }
        v.x /= v.w;
        v.y /= v.w;
        v.z /= v.w;

        /* Map x, y and z to range 0-1 */
        v.x = v.x * 0.5 + 0.5;
        v.y = v.y * 0.5 + 0.5;
        v.z = v.z * 0.5 + 0.5;

        /* Map x,y to viewport */
        v.x = v.x * viewport.z + viewport.x;
        v.y = v.y * viewport.w + viewport.y;
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
      },
      /**
       * 将window坐标转换成空间坐标
       * @param {PIEVector4} viewport -视口
       * @param {PIEMatrix4} projection -投影矩阵
       * @param {PIEMatrix4} view -视图矩阵
       * @param {PIEMatrix4} world -世界矩阵
       * @memberOf Vector3#
       *
       */
      unProject: function (viewport, projection, view, world) {
        var m = PIEMatrix4.multiply(projection, view);
        m = PIEMatrix4.multiply(m, world);
        m = m.invert();
        var v = new PIEVector4();
        v.x = 2.0 * (this.x - viewport.x) / viewport.z - 1.0;
        v.y = 2.0 * (this.y - viewport.y) / viewport.w - 1.0;
        v.z = 2.0 * this.z - 1.0;
        v.w = 1.0;
        v.applyMatrix4(m);
        if (v.w == 0.0) {
          return;
        }
        this.x = v.x / v.w;
        this.y = v.y / v.w;
        this.z = v.z / v.w;
      },
      toArray: function () {
        var array = [this.x, this.y, this.z];
        return array;
      }
    });

    /**
     * 向量与矩阵相乘
     * @param {PIEVector3} v -向量
     * @param {PIEMatrix4} matrix -矩阵
     *
     * @memberOf Vector3#
     * @returns {PIEVector3} 返回结果
     */
    PIEVector3.multiplyMatrix4 = function (v, matrix) {
      var w = 1;
      var m11 = 0,
        m12 = 0,
        m13 = 0,
        m14 = 0;
      m11 = v.x * matrix.m[0] + v.y * matrix.m[4] + v.z * matrix.m[8] + w * matrix.m[12];
      m12 = v.x * matrix.m[1] + v.y * matrix.m[5] + v.z * matrix.m[9] + w * matrix.m[13];
      m13 = v.x * matrix.m[2] + v.y * matrix.m[6] + v.z * matrix.m[10] + w * matrix.m[14];
      m14 = v.x * matrix.m[3] + v.y * matrix.m[7] + v.z * matrix.m[11] + w * matrix.m[15];
      return new PIEVector3(m11 / m14, m12 / m14, m13 / m14);
    };

    /**
     * 向量与矩阵相乘
     * @param {PIEVector3} v -向量
     * @param {PIEMatrix3d} matrix -矩阵
     *
     * @memberOf Vector3#
     * @returns {PIEVector3} 返回结果
     */
    PIEVector3.multiplyMatrix3 = function (v, matrix) {
      var m11 = 0,
        m12 = 0,
        m13 = 0;
      m11 = v.x * matrix.m[0] + v.y * matrix.m[3] + v.z * matrix.m[6];
      m12 = v.x * matrix.m[1] + v.y * matrix.m[4] + v.z * matrix.m[7];
      m13 = v.x * matrix.m[2] + v.y * matrix.m[5] + v.z * matrix.m[8];
      return new PIEVector3(m11, m12, m13);
    };

    /**
     * 球面坐标转笛卡尔坐标
     * @param {Number} dLongitude -经度
     * @param {Number} dLatitude -纬度
     * @param {Number} dRadius -半径
     *
     * @memberOf Vector3#
     * @returns {PIEVector3} 返回笛卡尔坐标
     */
    PIEVector3.sphericalToCartesian = function (dLongitude, dLatitude, dRadius) {
      var dRadCosLat = dRadius * Math.cos(dLatitude);
      return new PIEVector3(dRadCosLat * Math.sin(dLongitude), dRadius * Math.sin(dLatitude), dRadCosLat * Math.cos(dLongitude));
    };

    /**
     * 笛卡尔坐标转球面坐标
     * @param {Number} x -x值
     * @param {Number} y -y值
     * @param {Number} z -z值
     *
     * @memberOf Vector3#
     * @returns {PIEVector3} 返回球面坐标
     */
    PIEVector3.cartesianToSpherical = function (x, y, z) {
      var rho = Math.sqrt(x * x + y * y + z * z);
      if (PIEMath.isZero(rho)) {
        return new PIEVector3(0, 0, 0);
      }
      var longitude = Math.atan2(x, z);
      var latitude = Math.asin(y / rho);
      return new PIEVector3(longitude, latitude, rho);
    };

    /**
     * 向量与平面的交点
     * @param {PIEVector3} vecStart -向量起点
     * @param {PIEVector3} vecEnd -向量终点
     *
     * @memberOf Vector3#
     * @returns {PIEVector3} 返回交点
     */
    PIEVector3.rayIntersectionWithPlane = function (vecStart, vecEnd) {
      var vecLineVector = new PIEVector3();
      vecLineVector.x = vecEnd.x - vecStart.x;
      vecLineVector.y = vecEnd.y - vecStart.y;
      vecLineVector.z = vecEnd.z - vecStart.z;
      vecLineVector.normalize();
      var vecPlaneNormal = new PIEVector3();
      vecPlaneNormal.x = 0;
      vecPlaneNormal.y = 0;
      vecPlaneNormal.z = 1;
      var vecPlanePoint = new PIEVector3();
      vecPlanePoint.x = 0;
      vecPlanePoint.y = 0;
      vecPlanePoint.z = 0;
      new PIEVector3();
      var vp1, vp2, vp3, n1, n2, n3, v1, v2, v3, m1, m2, m3, t, vpt;
      vp1 = vecPlaneNormal.x;
      vp2 = vecPlaneNormal.y;
      vp3 = vecPlaneNormal.z;
      n1 = vecPlanePoint.x;
      n2 = vecPlanePoint.y;
      n3 = vecPlanePoint.z;
      v1 = vecLineVector.x;
      v2 = vecLineVector.y;
      v3 = vecLineVector.z;
      m1 = vecStart.x;
      m2 = vecStart.y;
      m3 = vecStart.z;
      vpt = v1 * vp1 + v2 * vp2 + v3 * vp3;
      if (vpt == 0) {
        return null;
      } else {
        t = ((n1 - m1) * vp1 + (n2 - m2) * vp2 + (n3 - m3) * vp3) / vpt;
        var vecIntersect = new PIEVector3();
        vecIntersect.x = m1 + v1 * t;
        vecIntersect.y = m2 + v2 * t;
        vecIntersect.z = m3 + v3 * t;
        return vecIntersect;
      }
    };

    /**
     * 向量与球体的交点
     * @param {PIEVector3} vecStart -向量起点
     * @param {PIEVector3} vecEnd -向量终点
     * @param {Number} dRadius -半径
     *
     * @memberOf Vector3#
     * @returns {PIEVector3} 返回交点
     */
    PIEVector3.rayIntersectionWithSphere = function (vecStart, vecEnd, dRadius) {
      var p1 = vecStart;
      var p2 = vecEnd;
      p2.x * p2.x + p2.y * p2.y + p2.z * p2.z;
      var a = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y) + (p2.z - p1.z) * (p2.z - p1.z);
      var b = 2.0 * ((p2.x - p1.x) * p1.x + (p2.y - p1.y) * p1.y + (p2.z - p1.z) * p1.z);
      var c = p1.x * p1.x + p1.y * p1.y + p1.z * p1.z - dRadius * dRadius;
      var discriminant = b * b - 4 * a * c;
      if (discriminant <= 0) {
        return null;
      }
      var t1 = (-1.0 * b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
      var vecIntersect = new PIEVector3(p1.x + t1 * (p2.x - p1.x), p1.y + t1 * (p2.y - p1.y), p1.z + t1 * (p2.z - p1.z));
      return vecIntersect;
    };

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 基础模块
     * ---
     */

    /**
     * 创建三维矩阵
     * @name Matrix3
     * @class Matrix3
     * 三维矩阵操作函数
     */
    function PIEMatrix3() {
      this.m = new Float32Array(9);
      {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 1;
        this.m[5] = 0;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 1;
      }
    }
    Object.assign(PIEMatrix3.prototype, {
      /**
       * 创建矩阵
       * @param {Number} m0
       * @param {Number} m1
       * @param {Number} m2
       * @param {Number} m3
       * @param {Number} m4
       * @param {Number} m5
       * @param {Number} m6
       * @param {Number} m7
       * @param {Number} m8
       * @returns {PIEMatrix3} 返回创建的矩阵
       * @memberOf Matrix3#
       */
      create: function (m0, m1, m2, m3, m4, m5, m6, m7, m8) {
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        this.m[6] = m6;
        this.m[7] = m7;
        this.m[8] = m8;
        return this;
      },
      /**
       * 构造3*3单位矩阵
       *@returns {PIEMatrix3} 返回单位矩阵
       * @memberOf Matrix3#
       */
      identity: function () {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 1;
        this.m[5] = 0;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 1;
        return this;
      },
      /**
       * 初始化3*3的单位矩阵
       * @returns {PIEMatrix3} 返回初始化的矩阵
       * @memberOf Matrix3#
       */
      zero: function () {
        this.m[0] = 0;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 0;
        this.m[5] = 0;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 0;
        return this;
      },
      /**
       * 平移矩阵
       * @param {Number} x
       * @param {Number} y
       * @param {Number} z
       * @returns {PIEMatrix3} 返回平移后的矩阵
       * @memberOf Matrix3#
       */
      translation: function (x, y, z) {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = 1;
        this.m[5] = 0;
        this.m[6] = x;
        this.m[7] = y;
        this.m[8] = 1;
        return this;
      },
      /**
       * 缩放矩阵
       * @param {Number} x
       * @param {Number} y
       * @param {Number} z
       * @returns {PIEMatrix3} 返回缩放后的矩阵
       * @memberOf Matrix3#
       */
      scaling: function (x, y, z) {
        this.m[0] = x;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = y;
        this.m[5] = 0;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = z;
        return this;
      },
      /**
       * 以X轴旋转
       * @param {Number} radian -顺时针旋转角度
       * @returns {PIEMatrix3} 返回旋转后的矩阵
       * @memberOf Matrix3#
       */
      rotationX: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 0;
        this.m[4] = c;
        this.m[5] = s;
        this.m[6] = 0;
        this.m[7] = -s;
        this.m[8] = c;
        return this;
      },
      /**
       * 以Y轴旋转
       * @param {Number} radian -顺时针旋转角度
       * @returns {PIEMatrix3} 返回旋转后的矩阵
       * @memberOf Matrix3#
       */
      rotationY: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = c;
        this.m[1] = 0;
        this.m[2] = -s;
        this.m[3] = 0;
        this.m[4] = 1;
        this.m[5] = 0;
        this.m[6] = s;
        this.m[7] = 0;
        this.m[8] = c;
        return this;
      },
      /**
       * 以Z轴旋转
       * @param {Number} radian -顺时针旋转角度
       * @returns {PIEMatrix3} 返回旋转后的矩阵
       * @memberOf Matrix3#
       */
      rotationZ: function (radian) {
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        this.m[0] = c;
        this.m[1] = s;
        this.m[2] = 0;
        this.m[3] = -s;
        this.m[4] = c;
        this.m[5] = 0;
        this.m[6] = 0;
        this.m[7] = 0;
        this.m[8] = 1;
        return this;
      },
      // /**
      //  * 把矩阵分解成位置、缩放和四元数
      //  * @param {PIEMatrix3} kQ
      //  * @param {PIEVector3} kD
      //  * @param {PIEVector3} kU
      //  *
      //  * @memberOf Matrix3#
      //  */
      // decomposition: function (kQ, kD, kU) {
      //     var kM = this;
      //
      //     var fInvLength = this.invertSqrt(kM.m[0] * kM.m[0] + kM.m[3] * kM.m[3] + kM.m[6] * kM.m[6]);
      //     kQ.m[0] = kM.m[0] * fInvLength;
      //     kQ.m[3] = kM.m[3] * fInvLength;
      //     kQ.m[6] = kM.m[6] * fInvLength;
      //
      //     var fDot = kQ.m[0] * kM.m[1] + kQ.m[3] * kM.m[4] + kQ.m[6] * kM.m[7];
      //     kQ.m[1] = kM.m[1] - fDot * kQ.m[0];
      //     kQ.m[4] = kM.m[4] - fDot * kQ.m[3];
      //     kQ.m[7] = kM.m[7] - fDot * kQ.m[6];
      //     fInvLength = this.invertSqrt(kQ.m[1] * kQ.m[1] + kQ.m[4] * kQ.m[4] + kQ.m[7] * kQ.m[7]);
      //     kQ.m[1] *= fInvLength;
      //     kQ.m[4] *= fInvLength;
      //     kQ.m[7] *= fInvLength;
      //
      //     fDot = kQ.m[0] * kM.m[2] + kQ.m[3] * kM.m[5] + kQ.m[6] * kM.m[8];
      //     kQ.m[2] = kM.m[2] - fDot * kQ.m[0];
      //     kQ.m[5] = kM.m[5] - fDot * kQ.m[3];
      //     kQ.m[8] = kM.m[8] - fDot * kQ.m[6];
      //     fDot = kQ.m[1] * kM.m[2] + kQ.m[4] * kM.m[5] + kQ.m[7] * kM.m[8];
      //     kQ.m[2] -= fDot * kQ.m[1];
      //     kQ.m[5] -= fDot * kQ.m[4];
      //     kQ.m[8] -= fDot * kQ.m[7];
      //     fInvLength = this.invertSqrt(kQ.m[2] * kQ.m[2] + kQ.m[5] * kQ.m[5] + kQ.m[8] * kQ.m[8]);
      //     kQ.m[2] *= fInvLength;
      //     kQ.m[5] *= fInvLength;
      //     kQ.m[8] *= fInvLength;
      //
      //     // guarantee that orthogonal matrix has determinant 1 (no reflections)
      //     var fDet = kQ.m[0] * kQ.m[4] * kQ.m[8] + kQ.m[1] * kQ.m[5] * kQ.m[6] +
      //         kQ.m[2] * kQ.m[3] * kQ.m[7] - kQ.m[2] * kQ.m[4] * kQ.m[6] -
      //         kQ.m[1] * kQ.m[3] * kQ.m[8] - kQ.m[0] * kQ.m[5] * kQ.m[7];
      //
      //     if (fDet < 0.0) {
      //         for (var iRow = 0; iRow < 3; iRow++) {
      //             for (var iCol = 0; iCol < 3; iCol++) {
      //                 kQ.m[3 * iRow + iCol] = -kQ.m[3 * iRow + iCol];
      //             }
      //         }
      //     }
      //
      //     // build "right" matrix R
      //     var kR = new PIEMatrix3();
      //     kR.m[0] = kQ.m[0] * kM.m[0] + kQ.m[3] * kM.m[3] + kQ.m[6] * kM.m[6];
      //     kR.m[1] = kQ.m[0] * kM.m[1] + kQ.m[3] * kM.m[4] + kQ.m[6] * kM.m[7];
      //     kR.m[4] = kQ.m[1] * kM.m[1] + kQ.m[4] * kM.m[4] + kQ.m[7] * kM.m[7];
      //     kR.m[2] = kQ.m[0] * kM.m[2] + kQ.m[3] * kM.m[5] + kQ.m[6] * kM.m[8];
      //     kR.m[5] = kQ.m[1] * kM.m[2] + kQ.m[4] * kM.m[5] + kQ.m[7] * kM.m[8];
      //     kR.m[8] = kQ.m[2] * kM.m[2] + kQ.m[5] * kM.m[5] + kQ.m[8] * kM.m[8];
      //
      //     // the scaling component
      //     kD.x = kR.m[0];
      //     kD.y = kR.m[4];
      //     kD.z = kR.m[8];
      //
      //     // the shear component
      //     var fInvD0 = 1.0 / kD.x;
      //     kU.x = kR.m[1] * fInvD0;
      //     kU.y = kR.m[2] * fInvD0;
      //     kU.z = kR.m[5] / kD.y;
      // },
      /**
       * 计算机矩阵转置矩阵
       * @returns {PIEMatrix3} 返回转置矩阵
       * @memberOf Matrix3#
       */
      transpose: function () {
        let tmp;
        const m = this.m;
        tmp = m[1];
        m[1] = m[3];
        m[3] = tmp;
        tmp = m[2];
        m[2] = m[6];
        m[6] = tmp;
        tmp = m[5];
        m[5] = m[7];
        m[7] = tmp;
        return this;
      }
    });

    /**
     * 向量和矩阵相乘
     * @param {PIEVector3} v -向量
     * @param {PIEMatrix3} matrix -矩阵
     * @returns {PIEVector3} 返回相乘后的结果
     * @memberOf Matrix3
     */
    PIEMatrix3.prototype.multiplyMV = function (v, matrix) {
      var m11 = 0,
        m12 = 0,
        m13 = 0;
      m11 = v.x * matrix.m[0] + v.y * matrix.m[3] + v.z * matrix.m[6];
      m12 = v.x * matrix.m[1] + v.y * matrix.m[4] + v.z * matrix.m[7];
      m13 = v.x * matrix.m[2] + v.y * matrix.m[5] + v.z * matrix.m[8];
      return new PIEVector3(m11, m12, m13);
    };

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 基础模块
     * ---
     */

    /**
     * 文件操作
     * @name File
     *
     *
     */
    function PIEFile(value, type) {}
    Object.assign(PIEFile.prototype, {});
    /**
     * 创建目录
     * @param {String} file -文件路径
     * @memberOf File
     */
    PIEFile.makeFolder = function (file) {
      if (file != null) {
        var fileNames = file.split('/');
        if (fileNames.length > 0) {
          if (fileNames[0] == '.') {
            fileNames.splice(0, 1);
          }
          if (fileNames.length > 0) {
            var lastIndex = fileNames.length - 1;
            if (fileNames[lastIndex].indexOf('.') != -1) {
              fileNames.splice(lastIndex, 1);
            }
          }
          if (fileNames.length > 0) {
            var filePath = "";
            for (var i = 0; i < fileNames.length; i++) {
              filePath += fileNames[i];
              filePath += "/";
              try {
                PlotModule.FS.mkdir(filePath);
              } catch (e) {}
            }
          }
        }
      }
    };
    function loadFile(handler, file, url) {
      var xhr = new XMLHttpRequest();
      xhr.timeout = 0;
      xhr.withCredentials = false;
      xhr.responseType = "arraybuffer";
      xhr.onload = function () {
        var content = this.response;
        if (content != null && this.status == 200) {
          PIEFile.makeFolder(file);
          var data = new Uint8Array(content);
          var stream = PlotModule.FS.open(file, 'w+');
          PlotModule.FS.write(stream, data, 0, data.length, 0);
          PlotModule.FS.close(stream);
          handler.loaded(file, url, data);
        } else {
          handler.loaded(file, url, null);
        }
      };
      xhr.open("GET", url, true);
      xhr.send(null);
    }

    /**
     * 加载文件
     * @param {String} file -文件路径
     * @param {String} url -服务路径
     * @param {PIEEvent} callback -回调函数
     * @memberOf File
     */
    PIEFile.loadFile = function (file, url, callback) {
      if (file != null && url != null) {
        var handler = {};
        handler.callback = callback;
        handler.loaded = function (file, url, data) {
          this.callback(file, url, data);
        };
        loadFile(handler, file, url);
      }
    };
    /**
     * 加载文件
     * @param {String} files -文件路径
     * @param {String} urls -服务路径
     * @param {PIEEvent} callback -回调函数
     * @memberOf File
     */
    PIEFile.loadFiles = function (files, urls, callback) {
      if (files.length == urls.length) {
        var handler = {};
        handler.count = urls.length;
        handler.files = [];
        handler.urls = [];
        handler.fileMap = {};
        handler.datas = [];
        handler.callback = callback;
        for (let i = 0; i < files.length; i++) {
          handler.fileMap[files[i]] = i;
        }
        handler.loaded = function (file, url, data) {
          this.files[handler.fileMap[file]] = file;
          this.urls[handler.fileMap[file]] = url;
          this.datas[handler.fileMap[file]] = data;
          handler.count--;
          if (handler.count == 0) {
            this.callback(this.files, this.urls, this.datas);
          }
        };
        for (let i = 0; i < urls.length; i++) {
          loadFile(handler, files[i], urls[i]);
        }
      }
    };
    PIEFile.uuid = function (len, radix) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      var uuid = [],
        i;
      radix = radix || chars.length;
      if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      } else {
        // rfc4122, version 4 form
        var r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
          }
        }
      }
      return uuid.join('');
    };
    PIEFile.getFileName = function (url) {
      if (url.indexOf('?') > -1) {
        var filePath = url.split('?');
        url = filePath[0];
      }
      var pos1 = url.lastIndexOf('/');
      var pos2 = url.lastIndexOf('\\');
      var pos = Math.max(pos1, pos2);
      if (pos < 0) return url;else return url.substring(pos + 1);
    };
    PIEFile.getExtFromName = function (fileName) {
      if (fileName.indexOf('.') > -1) {
        var fileMsg = fileName.split('.');
        var fileExt = fileMsg[fileMsg.length - 1];
        return fileExt;
      }
      return "";
    };

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 标绘几何对象路径操作函数
     * @name PlotPath
     */
    function PIEPlotPath(handle, autoRelease) {
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIEPlotPath.prototype, {
      getHandle: function () {
        return this.handle;
      },
      /**
       * 获取路径类型
       * @memberOf PlotPath#
       * @returns {PlotPathType}  返回path类型
       */
      getPathType: function () {
        return PlotModule._PlotPath_GetPathType(this.handle);
      },
      /**
       * 获取线宽
       *
       * @memberOf PlotPath#
       * @returns {Number} 返回线宽
       */
      getLineWidth: function () {
        return PlotModule._PlotPath_GetLineWidth(this.handle);
      },
      /**
       * 获取线型
       *
       * @memberOf PlotPath#
       * @returns {PlotLineType} 返回线型
       */
      getLineType: function () {
        return PlotModule._PlotPath_GetLineType(this.handle);
      },
      /**
       * 获取线颜色
       * @returns {PIEColor} 返回线颜色
       * @memberOf PlotPath#
       */
      getLineColor: function () {
        let colorArray = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._PlotPath_GetLineColor(this.handle, colorArray.getHandle());
        colorArray.updateData();
        let color = colorArray.toArray();
        colorArray.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 获取填充模式
       *
       * @memberOf PlotPath#
       * @returns {PIEPlotFillMode} 返回填充模式
       */
      getFillMode: function () {
        return PlotModule._PlotPath_GetFillMode(this.handle);
      },
      /**
       * 获取填充颜色
       *
       * @memberOf PlotPath#
       * @returns {PIEColor} 返回填充颜色
       */
      getFillColor: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._PlotPath_GetFillColor(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 获取渐变色1
       *
       * @memberOf PlotPath#
       * @returns {PIEColor} 返回渐变色1
       */
      getFadeColor1: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._PlotPath_GetFadeColor1(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 获取渐变色2
       *
       * @memberOf PlotPath#
       * @returns {PIEColor} 返回渐变色2
       */
      getFadeColor2: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._PlotPath_GetFadeColor2(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 获取渐变方向
       *
       * @memberOf PlotPath#
       * @returns {Number} 返回渐变方向
       */
      getFadeDirect: function () {
        return PlotModule._PlotPath_GetFadeDirect(this.handle);
      },
      /**
       * 获取渐变中心点X值
       *
       * @memberOf PlotPath#
       * @returns {Number} 返回X值
       */
      getFadeCenterX: function () {
        return PlotModule._PlotPath_GetFadeCenterX(this.handle);
      },
      /**
       * 获取渐变中心点Y值
       *
       * @memberOf PlotPath#
       * @returns {Number} 返回Y值
       */
      getFadeCenterY: function () {
        return PlotModule._PlotPath_GetFadeCenterY(this.handle);
      },
      /**
       * 获取子路径个数
       * @memberOf PlotPath#
       * @returns {Number}  返回子路径个数
       */
      getSubPathCount: function () {
        return PlotModule._PlotPath_GetSubPathCount(this.handle);
      },
      /**
       * 根据索引查询子路径坐标点个数
       * @memberOf PlotPath#
       * @param {Number} index-子路径索引
       * @returns {Number}  返回子路径个数
       */
      getSubPathPointCount: function (index) {
        return PlotModule._PlotPath_GetSubPathPointCount(this.handle, index);
      },
      /**
       * 根据索引查询子路径坐标点数组
       * @memberOf PlotPath#
       * @param {Number} index-子路径索引
       * @returns {Array}  返回子路径点串数组
       */
      getSubPath: function (index) {
        let count = this.getSubPathPointCount(index);
        if (count > 0) {
          let pointArray = new PIEArray(count * 3, PIEArrayType.Float64);
          PlotModule._PlotPath_GetSubPath(this.handle, index, pointArray.getHandle());
          pointArray.updateData();
          let points = pointArray.toArray();
          pointArray.dispose();
          return points;
        }
        return [];
      },
      /**
       * 获取Z索引
       *
       * @memberOf PlotPath#
       * @returns {Number} 返回索引
       */
      getZIndex: function () {
        return PlotModule._PlotPath_GetZIndex(this.handle);
      },
      /**
       * 判断子path是否是顺时针
       * @param {Number} index -索引
       *
       * @memberOf PlotPath#
       * @returns {Boolean} 返回是否顺时针
       */
      isClockwise: function (index) {
        return PlotModule._PlotPath_IsClockwise(this.handle, index);
      },
      /**
       * 判断子path是否闭合
       * @param {Number} index -索引
       *
       * @memberOf PlotPath#
       * @returns {Boolean} 返回是否闭合
       */
      isClose: function (index) {
        return PlotModule._PlotPath_IsClose(this.handle, index);
      },
      /**
       * 子path1是否包含子path2
       * @param {Number} index1 -索引1
       * @param {Number} index2 -索引2
       *
       * @memberOf PlotPath#
       * @returns {Boolean} 返回是否包含
       */
      isContains: function (index1, index2) {
        return PlotModule._PlotPath_IsContains(this.handle, index1, index2);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 标绘显示属性操作函数
     * @name SgDrawAttr
     */
    function PIESgDrawAttr(handle, autoRelease) {
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIESgDrawAttr.prototype, {
      /**
       * 设置标绘的颜色
       * @param{PIEColor|Array} color-颜色
       * @memberOf SgDrawAttr#
       */
      setLineColor: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgDrawAttr_SetLineColor(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取设置标绘的颜色
       * @memberOf SgDrawAttr#
       * @returns {PIEColor} 返回线颜色
       */
      getLineColor: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgDrawAttr_GetLineColor(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 设置标绘的颜色
       * @param{PIEColor|Array} color-颜色
       * @memberOf SgDrawAttr#
       */
      setLineColor2: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgDrawAttr_SetLineColor2(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取设置标绘的颜色
       * @memberOf SgDrawAttr#
       * @returns {PIEColor} 返回线颜色
       */
      getLineColor2: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgDrawAttr_GetLineColor2(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 设置标绘的颜色
       * @param{PIEColor|Array} color-颜色
       * @memberOf SgDrawAttr#
       */
      setLineColor3: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgDrawAttr_SetLineColor3(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取设置标绘的颜色
       * @memberOf SgDrawAttr#
       * @returns {PIEColor} 返回线颜色
       */
      getLineColor3: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgDrawAttr_GetLineColor3(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 设置标绘的线宽（单位为像素）
       * @memberOf SgDrawAttr#
       * @param{Number} lineWidth-线宽
       */
      setLineWidth: function (lineWidth) {
        return PlotModule._SgDrawAttr_SetLineWidth(this.handle, lineWidth);
      },
      /**
       * 获取标绘的线宽
       * @memberOf SgDrawAttr#
       * @returns {Number}  返回线宽
       */
      getLineWidth: function () {
        return PlotModule._SgDrawAttr_GetLineWidth(this.handle);
      },
      /**
       * 设置标绘的线类型（单位为像素）
       * @memberOf SgDrawAttr#
       * @param{PlotLineType} lineType-线类型
       */
      setLineType: function (lineType) {
        return PlotModule._SgDrawAttr_SetLineType(this.handle, lineType);
      },
      /**
       * 获取标绘的线宽
       * @memberOf SgDrawAttr#
       * @returns {PlotLineType}  返回线类型
       */
      getLineType: function () {
        return PlotModule._SgDrawAttr_GetLineType(this.handle);
      },
      /**
       * 设置标绘的衬线颜色
       * @param{PIEColor|Array} color-颜色
       * @memberOf SgDrawAttr#
       */
      setOutLineColor: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgDrawAttr_SetOutLineColor(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取设置标绘的衬线颜色
       * @memberOf SgDrawAttr#
       * @returns {PIEColor} 返回衬线颜色
       */
      getOutLineColor: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgDrawAttr_GetOutLineColor(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 设置标绘的衬线线宽（单位为像素）
       * @memberOf SgDrawAttr#
       * @param{Number} lineWidth-颜色
       */
      setOutLineWidth: function (lineWidth) {
        return PlotModule._SgDrawAttr_SetOutLineWidth(this.handle, lineWidth);
      },
      /**
       * 获取标绘衬线的线宽
       * @memberOf SgDrawAttr#
       * @returns {Number}  返回线宽
       */
      getOutLineWidth: function () {
        return PlotModule._SgDrawAttr_GetOutLineWidth(this.handle);
      },
      /**
       * 设置标绘的衬线方向
       * @memberOf SgDrawAttr#
       * @param{PlotOutLineDirect} outLineDirect-衬线方向
       */
      setOutLineDirect: function (outLineDirect) {
        return PlotModule._SgDrawAttr_SetOutLineDirect(this.handle, outLineDirect);
      },
      /**
       * 获取标绘衬线的方向
       * @memberOf SgDrawAttr#
       * @returns {PlotOutLineDirect}  返回衬线方向
       */
      getOutLineDirect: function () {
        return PlotModule._SgDrawAttr_GetOutLineDirect(this.handle);
      },
      /**
       * 设置标绘的填充风格
       * @memberOf SgDrawAttr#
       * @param{PlotFillStyle} fillStyle-衬线方向
       */
      setFillStyle: function (fillStyle) {
        return PlotModule._SgDrawAttr_SetFillStyle(this.handle, fillStyle);
      },
      /**
       * 获取标绘填充风格
       * @memberOf SgDrawAttr#
       * @returns {PlotFillStyle}  返回填充风格
       */
      getFillStyle: function () {
        return PlotModule._SgDrawAttr_GetFillStyle(this.handle);
      },
      /**
       * 设置标绘的填充颜色
       * @param{PIEColor|Array} color-颜色
       * @memberOf SgDrawAttr#
       */
      setFillColor: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgDrawAttr_SetFillColor(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取设置标绘的填充颜色
       * @memberOf SgDrawAttr#
       * @returns {PIEColor} 返回填充颜色
       */
      getFillColor: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgDrawAttr_GetFillColor(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      // /**
      //  * 设置标绘填充颜色的透明度，取值范围为：0~255
      //  * @memberOf SgDrawAttr#
      //  * @param{Number} fillTransparent-透明度
      //  */
      // setFillTransparent: function (fillTransparent) {
      //     return PlotModule._SgDrawAttr_SetFillTransparent(this.handle, fillTransparent);
      // },
      //
      // /**
      //  * 获取标绘填充颜色的透明度
      //  * @memberOf SgDrawAttr#
      //  * @returns {Number}  返回填充颜色的透明度
      //  */
      // getFillTransparent: function () {
      //     return PlotModule._SgDrawAttr_GetFillTransparent(this.handle);
      // },
      /**
       * 设置是否随图缩放
       * @memberOf SgDrawAttr#
       * @param{Boolean} scaleWidthMap-是否随图缩放
       */
      setScaleWidthMap: function (scaleWidthMap) {
        PlotModule._SgDrawAttr_SetScaleWidthMap(this.handle, scaleWidthMap);
      },
      /**
       * 获取是否随图缩放
       * @memberOf SgDrawAttr#
       * @returns {Boolean}  返回是否随图缩放
       */
      getScaleWidthMap: function () {
        return PlotModule._SgDrawAttr_IsScaleWidthMap(this.handle);
      },
      /**
       * 设置最大最小可见比例尺
       * @param {Number} maxVisibleScaleLimit -最大可见比例尺
       * @param {Number} minVisibleScaleLimit -最小可见比例尺
       * @memberOf SgDrawAttr#
       */
      setVisibleScaleLimit: function (maxVisibleScaleLimit, minVisibleScaleLimit) {
        PlotModule._SgDrawAttr_SetVisibleScaleLimit(this.handle, maxVisibleScaleLimit, minVisibleScaleLimit);
      },
      /**
       * 获取最大最小可见比例尺
       * @memberOf SgDrawAttr#
       * @returns {Array} 返回最大最小可见比例尺数组
       */
      getVisibleScaleLimit: function () {
        let scaleLimitArray = new PIEArray(2, PIEArrayType.Float64);
        PlotModule._SgDrawAttr_GetVisibleScaleLimit(this.handle, scaleLimitArray.getHandle());
        scaleLimitArray.updateData();
        let scaleLimit = scaleLimitArray.toArray();
        scaleLimitArray.dispose();
        return scaleLimit;
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 点标绘显示属性操作函数
     * @name SgDotDrawAttr
     */
    function PIESgDotDrawAttr(handle, autoRelease) {
      PIESgDrawAttr.call(this, handle, autoRelease);
    }
    PIESgDotDrawAttr.prototype = Object.assign(Object.create(PIESgDrawAttr.prototype), {
      /**
       * 设置点标绘大小
       * @memberOf SgDotDrawAttr#
       * @param{PIESize|Array} size-点宽高范围
       */
      setSymbolSize: function (size) {
        let arraySize = null;
        if (size instanceof PIESize) {
          arraySize = size.toArray();
        } else if (size instanceof Array) {
          arraySize = size;
        }
        if (arraySize) {
          let sizeArray = new PIEArray(arraySize, PIEArrayType.Float64);
          PlotModule._SgDotDrawAttr_SetSymbolSize(this.handle, sizeArray.getHandle());
          sizeArray.dispose();
        }
      },
      /**
       * 获取点标绘大小
       * @memberOf SgDotDrawAttr#
       * @returns {PIESize}  返回点宽高范围
       */
      getSymbolSize: function () {
        let sizeArray = new PIEArray(2, PIEArrayType.Float64);
        PlotModule._SgDotDrawAttr_GetSymbolSize(this.handle, sizeArray.getHandle());
        sizeArray.updateData();
        let size = sizeArray.toArray();
        sizeArray.dispose();
        return new PIESize(size[0], size[1]);
      },
      /**
       * 设置是否锁定宽高比
       * @memberOf SgDotDrawAttr#
       * @param{Boolean} lockAspectRatio-是否锁定宽高比
       */
      setLockAspectRatio: function (lockAspectRatio) {
        PlotModule._SgDotDrawAttr_SetLockAspectRatio(this.handle, lockAspectRatio);
      },
      /**
       * 获取是否锁定宽高比
       * @memberOf SgDotDrawAttr#
       * @returns {Boolean}  返回是否锁定宽高比
       */
      isLockAspectRatio: function () {
        return PlotModule._SgDotDrawAttr_IsLockAspectRatio(this.handle);
      },
      /**
       * 获取宽高比
       * @memberOf SgDotDrawAttr#
       * @returns {Number}  宽高比
       */
      getAspectRatio: function () {
        return PlotModule._SgDotDrawAttr_GetAspectRatio(this.handle);
      },
      /**
       * 设置角度
       * @memberOf SgDotDrawAttr#
       * @param{Number} angle-角度
       */
      setAngle: function (angle) {
        PlotModule._SgDotDrawAttr_SetAngle(this.handle, angle);
      },
      /**
       * 获取角度
       * @memberOf SgDotDrawAttr#
       * @returns {Number}  返回角度
       */
      getAngle: function () {
        return PlotModule._SgDotDrawAttr_GetAngle(this.handle);
      },
      /**
       * 设置镜像模式
       * @memberOf SgDotDrawAttr#
       * @param{PlotMirrorMode} mirrorMode-镜像模式
       */
      setMirrorMode: function (mirrorMode) {
        PlotModule._SgDotDrawAttr_SetMirrorMode(this.handle, mirrorMode);
      },
      /**
       * 获取镜像模式
       * @memberOf SgDotDrawAttr#
       * @returns {PlotMirrorMode}  返回镜像模式
       */
      getMirrorMode: function () {
        return PlotModule._SgDotDrawAttr_GetMirrorMode(this.handle);
      },
      /**
       * 设置内联文本字体（仅对具有内联文本属性的J标有效）
       * @memberOf SgDotDrawAttr#
       * @param{String} name-内联文本字体
       */
      setInlineTextFontName: function (name) {
        let strName = new PIEString(name);
        PlotModule._SgDotDrawAttr_SetInlineTextFontName(this.handle, strName.getHandle());
        strName.dispose();
      },
      /**
       * 获取内联文本字体
       * @memberOf SgDotDrawAttr#
       * @returns {String}  返回内联文本字体
       */
      getInlineTextFontName: function () {
        let strName = new PIEString(256);
        PlotModule._SgDotDrawAttr_GetInlineTextFontName(this.handle, strName.getHandle());
        return strName.toString();
      },
      /**
       * 设置内联文本颜色
       * @memberOf SgDotDrawAttr#
       * @param{PIEColor|Array} color-内联文本颜色
       */
      setInlineTextFontColor: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgDotDrawAttr_SetInlineTextFontColor(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取内联文本
       * @memberOf SgDotDrawAttr#
       * @returns {PIEColor}  返回内联文本颜色
       */
      getInlineTextFontColor: function () {
        let colorArray = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgDotDrawAttr_GetInlineTextFontColor(this.handle, colorArray.getHandle());
        colorArray.updateData();
        let color = colorArray.toArray();
        colorArray.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 设置内联文本
       * @memberOf SgDotDrawAttr#
       * @param{String} name-内联文本字体
       */
      setInlineTextString: function (name) {
        let strName = new PIEString(name);
        PlotModule._SgDotDrawAttr_SetInlineTextString(this.handle, strName.getHandle());
        strName.dispose();
      },
      /**
       * 获取内联文本
       * @memberOf SgDotDrawAttr#
       * @returns {String}  返回内联文本字体
       */
      getInlineTextString: function () {
        let strName = new PIEString(256);
        PlotModule._SgDotDrawAttr_GetInlineTextString(this.handle, strName.getHandle());
        return strName.toString();
      },
      /**
       * 设置编辑模式
       * @memberOf SgDotDrawAttr#
       * @param{PlotEditMode} editMode-编辑模式
       */
      setEditMode: function (editMode) {
        PlotModule._SgDotDrawAttr_SetEditMode(this.handle, editMode);
      },
      /**
       * 获取编辑模式
       * @memberOf SgDotDrawAttr#
       * @returns {PlotEditMode}  返回编辑模式
       */
      getEditMode: function () {
        return PlotModule._SgDotDrawAttr_GetEditMode(this.handle);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 线面标绘显示属性操作函数
     * @name SgLADrawAttr
     */
    function PIESgLADrawAttr(handle, autoRelease) {
      PIESgDrawAttr.call(this, handle, autoRelease);
    }
    PIESgLADrawAttr.prototype = Object.assign(Object.create(PIESgDrawAttr.prototype), {
      /**
       * 设置标绘的渐变填充色1
       * @memberOf SgLADrawAttr#
       * @param{PIEColor|Array} color-内联文本颜色
       */
      setFadeColor1: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgLADrawAttr_SetFadeColor1(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取标绘的渐变填充色1
       * @memberOf SgLADrawAttr#
       * @returns {PIEColor}  返回内联文本颜色
       */
      getFadeColor1: function () {
        let colorArray = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgLADrawAttr_GetFadeColor1(this.handle, colorArray.getHandle());
        colorArray.updateData();
        let color = colorArray.toArray();
        colorArray.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 设置标绘的渐变填充色2
       * @memberOf SgLADrawAttr#
       * @param{PIEColor|Array} color-内联文本颜色
       */
      setFadeColor2: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgLADrawAttr_SetFadeColor2(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取标绘的渐变填充色2
       * @memberOf SgLADrawAttr#
       * @returns {PIEColor}  返回内联文本颜色
       */
      getFadeColor2: function () {
        let colorArray = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgLADrawAttr_GetFadeColor2(this.handle, colorArray.getHandle());
        colorArray.updateData();
        let color = colorArray.toArray();
        colorArray.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 设置渐变填充色1的透明度
       * @memberOf SgLADrawAttr#
       * @param{Number} transparent-透明度
       */
      setFadeTransparent1: function (transparent) {
        PlotModule._SgDotDrawAttr_SetFadeTransparent1(this.handle, transparent);
      },
      /**
       * 获取渐变填充色1的透明度
       * @memberOf SgLADrawAttr#
       * @returns {Number}  返回透明度
       */
      getFadeTransparent1: function () {
        return PlotModule._SgDotDrawAttr_GetFadeTransparent1(this.handle);
      },
      /**
       * 设置渐变填充色2的透明度
       * @memberOf SgLADrawAttr#
       * @param{Number} transparent-透明度
       */
      setFadeTransparent2: function (transparent) {
        PlotModule._SgDotDrawAttr_SetFadeTransparent1(this.handle, transparent);
      },
      /**
       * 获取渐变填充色2的透明度
       * @memberOf SgLADrawAttr#
       * @returns {Number}  返回透明度
       */
      getFadeTransparent2: function () {
        return PlotModule._SgDotDrawAttr_GetFadeTransparent1(this.handle);
      },
      /**
       * 设置渐变方向
       * @memberOf SgLADrawAttr#
       * @param{Number} direct-渐变方向
       */
      setFadeDirect: function (direct) {
        PlotModule._SgLADrawAttr_SetFadeDirect(this.handle, direct);
      },
      /**
       * 获取渐变方向
       * @memberOf SgLADrawAttr#
       * @returns {Number}  返回透明度
       */
      getFadeDirect: function () {
        return PlotModule._SgLADrawAttr_GetFadeDirect(this.handle);
      },
      /**
       * 设置渐变点的横向偏移
       * @memberOf SgLADrawAttr#
       * @param{Number} centerX-渐变点的横向偏移
       */
      setFadeCenterX: function (centerX) {
        PlotModule._SgLADrawAttr_SetFadeCenterX(this.handle, centerX);
      },
      /**
       * 获取渐变点的横向偏移
       * @memberOf SgLADrawAttr#
       * @returns {Number}  返回渐变点的横向偏移
       */
      getFadeCenterX: function () {
        return PlotModule._SgLADrawAttr_GetFadeCenterX(this.handle);
      },
      /**
       * 设置渐变点的纵向偏移
       * @memberOf SgLADrawAttr#
       * @param{Number} centerY-渐变点的纵向偏移
       */
      setFadeCenterY: function (centerY) {
        PlotModule._SgLADrawAttr_SetFadeCenterY(this.handle, centerY);
      },
      /**
       * 获取渐变点的纵向偏移
       * @memberOf SgLADrawAttr#
       * @returns {Number}  返回渐变点的纵向偏移
       */
      getFadeCenterY: function () {
        return PlotModule._SgLADrawAttr_GetFadeCenterY(this.handle);
      },
      /**
       * 设置子标绘编码
       * @memberOf SgLADrawAttr#
       * @param{Number} index-索引
       * @param{Number} code-编码
       */
      setSubCode: function (index, code) {
        PlotModule._SgLADrawAttr_SetSubCode(this.handle, index, code);
      },
      /**
       * 获取子标绘编码
       * @memberOf SgLADrawAttr#
       * @param{Number} index-索引
       * @returns {Number}  返回子标绘编码
       */
      getSubCode: function (index) {
        return PlotModule._SgLADrawAttr_GetSubCode(this.handle, index);
      },
      /**
       * 设置子标绘颜色
       * @memberOf SgLADrawAttr#
       * @param{PIEColor|Array} color-颜色
       */
      setSubColor: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgLADrawAttr_SetSubColor(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取子标绘颜色
       * @memberOf SgLADrawAttr#
       * @returns {PIEColor}  返回子标绘颜色
       */
      getSubColor: function () {
        let colorArray = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgLADrawAttr_GetFadeColor2(this.handle, colorArray.getHandle());
        colorArray.updateData();
        let color = colorArray.toArray();
        colorArray.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 获取子标绘个数
       * @memberOf SgLADrawAttr#
       * @returns {Number}  返回子标绘个数
       */
      getSubCodeCount: function () {
        return PlotModule._SgLADrawAttr_GetSubCodeCount(this.handle);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 标绘三维显示属性操作函数
     * @name SgTDAttr
     */
    function PIESgTDAttr(handle, autoRelease) {
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIESgTDAttr.prototype, {
      /**
       * 设置标绘渲染类型
       * @param{PlotRenderType} renderType-渲染类型
       * @memberOf SgTDAttr#
       */
      setRenderType: function (renderType) {
        PlotModule._SgTDAttr_SetRenderType(this.handle, renderType);
      },
      /**
       * 获取标绘渲染类型
       * @memberOf SgTDAttr#
       *  @returns{PlotRenderType} 返回渲染类型
       */
      getRenderType: function () {
        return PlotModule._SgTDAttr_GetRenderType(this.handle);
      },
      /**
       * 设置拉伸厚度
       * @memberOf SgTDAttr#
       * @param{Number} depth-拉伸厚度
       */
      setDepth: function (depth) {
        PlotModule._SgTDAttr_SetDepth(this.handle, depth);
      },
      /**
       * 获取拉伸厚度
       * @memberOf SgTDAttr#
       * @returns {Number}  返回拉伸厚度
       */
      getDepth: function () {
        return PlotModule._SgTDAttr_GetDepth(this.handle);
      },
      /**
       * 设置离地高度
       * @memberOf SgTDAttr#
       * @param{Number} height-离地高度
       */
      setHeight: function (height) {
        PlotModule._SgTDAttr_SetHeight(this.handle, height);
      },
      /**
       * 获取离地高度
       * @memberOf SgTDAttr#
       * @returns {Number}  返回离地高度
       */
      getHeight: function () {
        return PlotModule._SgTDAttr_GetHeight(this.handle);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 点标绘三维显示属性操作函数
     * @name SgDotTDAttr
     */
    function PIESgDotTDAttr(handle, autoRelease) {
      PIESgTDAttr.call(this, handle, autoRelease);
    }
    PIESgDotTDAttr.prototype = Object.assign(Object.create(PIESgTDAttr.prototype), {
      /**
       * 设置点标绘显示类型
       * @memberOf SgDotTDAttr#
       * @param{PlotDotDisplayType} displayType-点标绘显示类型
       */
      setDisplayType: function (displayType) {
        PlotModule._SgDotTDAttr_SetDisplayType(this.handle, displayType);
      },
      /**
       * 获取点标绘显示类型
       * @memberOf SgDotTDAttr#
       * @returns {PlotDotDisplayType}  返回点标绘显示类型
       */
      getDisplayType: function () {
        return PlotModule._SgDotTDAttr_GetDisplayType(this.handle);
      },
      /**
       * 设置点标绘竖直旋转
       * @memberOf SgDotTDAttr#
       * @param{Number} vertRotate-竖直旋转角度
       */
      setVertRotate: function (vertRotate) {
        PlotModule._SgDotTDAttr_SetVertRotate(this.handle, vertRotate);
      },
      /**
       * 获取点标绘竖直旋转
       * @memberOf SgDotTDAttr#
       * @returns {Number}  返回点标绘竖直旋转角度
       */
      getVertRotate: function () {
        return PlotModule._SgDotTDAttr_GetVertRotate(this.handle);
      },
      /**
       * 设置点标绘是否允许被遮挡
       * @memberOf SgDotTDAttr#
       * @param{Boolean} occlusion-是否允许被遮挡
       */
      setOcclusion: function (occlusion) {
        PlotModule._SgDotTDAttr_SetOcclusion(this.handle, occlusion);
      },
      /**
       * 获取点标绘是否允许被遮挡
       * @memberOf SgDotTDAttr#
       * @returns {Boolean}  返回点标绘是否允许被遮挡
       */
      getOcclusion: function () {
        return PlotModule._SgDotTDAttr_GetOcclusion(this.handle);
      },
      /**
       * 设置点标绘是否显示高度示意线
       * @memberOf SgDotTDAttr#
       * @param{Boolean} heightLine-是否显示高度示意线
       */
      setHeightLine: function (heightLine) {
        PlotModule._SgDotTDAttr_SetHeightLine(this.handle, heightLine);
      },
      /**
       * 获取点标绘是否显示高度示意线
       * @memberOf SgDotTDAttr#
       * @returns {Boolean}  返回点标绘是否显示高度示意线
       */
      getHeightLine: function () {
        return PlotModule._SgDotTDAttr_GetHeightLine(this.handle);
      },
      /**
       * 设置点标绘是绝对高度还是相对高度
       * @memberOf SgDotTDAttr#
       * @param{Boolean} absHeight-是否绝对高度
       */
      setAbsHeight: function (absHeight) {
        PlotModule._SgDotTDAttr_SetAbsHeight(this.handle, absHeight);
      },
      /**
       * 获取点标绘是绝对高度还是相对高度
       * @memberOf SgDotTDAttr#
       * @returns {Boolean}  返回点标绘是否绝对高度
       */
      getAbsHeight: function () {
        return PlotModule._SgDotTDAttr_GetAbsHeight(this.handle);
      },
      /**
       * 设置模型路径
       * @memberOf SgDotTDAttr#
       * @param{String} modelPath-模型路径
       */
      setModelPath: function (modelPath) {
        let strModelPath = new PIEString(modelPath);
        PlotModule._SgDotTDAttr_SetModelPath(this.handle, strModelPath.getHandle());
        strModelPath.dispose();
      },
      /**
       * 获取模型路径
       * @memberOf SgDotTDAttr#
       * @returns{String} 返回模型路径
       */
      getModelPath: function () {
        let strModelPath = new PIEString(512);
        PlotModule._SgDotTDAttr_GetModelPath(this.handle, strModelPath.getHandle());
        let modelPath = strModelPath.toString();
        strModelPath.dispose();
        return modelPath;
      },
      /**
       * 设置模型大小
       * @memberOf SgDotTDAttr#
       * @param{Number} modelSize-模型大小((0, 1000]（单位：毫米）该值为屏幕尺度的值，乘以合适的比例尺分母值后即为实际地理尺度的值)
       */
      setModelSize: function (modelSize) {
        PlotModule._SgDotTDAttr_SetModelSize(this.handle, modelSize);
      },
      /**
       * 获取模型大小
       * @memberOf SgDotTDAttr#
       * @returns{String} 返回模型大小
       */
      getModelSize: function () {
        return PlotModule._SgDotTDAttr_GetModelSize(this.handle);
      },
      /**
       * 设置模型滚转角
       * @memberOf SgDotTDAttr#
       * @param{Number} modelRoll-滚转角[-180,180°]
       */
      setModelRoll: function (modelRoll) {
        PlotModule._SgDotTDAttr_SetModelRoll(this.handle, modelRoll);
      },
      /**
       * 获取模型滚转角
       * @memberOf SgDotTDAttr#
       * @returns{Number} 返回模型滚转角
       */
      getModelRoll: function () {
        return PlotModule._SgDotTDAttr_GetModelRoll(this.handle);
      },
      /**
       * 设置模型俯仰角
       * @memberOf SgDotTDAttr#
       * @param{Number} modelPitch-俯仰角[-90,90°]
       */
      setModelPitch: function (modelPitch) {
        PlotModule._SgDotTDAttr_SetModelPitch(this.handle, modelPitch);
      },
      /**
       * 获取模型俯仰角
       * @memberOf SgDotTDAttr#
       * @returns{Number} 返回模型俯仰角
       */
      getModelPitch: function () {
        return PlotModule._SgDotTDAttr_GetModelPitch(this.handle);
      },
      /**
       * 设置模型亮度
       * @memberOf SgDotTDAttr#
       * @param{Number} modelLightIntensity-模型亮度(1.0：默认亮度,<1.0：调暗  >1.0：调亮)
       */
      setModelLightIntensity: function (modelLightIntensity) {
        PlotModule._SgDotTDAttr_SetModelLightIntensity(this.handle, modelLightIntensity);
      },
      /**
       * 获取模型亮度
       * @memberOf SgDotTDAttr#
       * @returns{Number} 返回模型亮度
       */
      getModelLightIntensity: function () {
        return PlotModule._SgDotTDAttr_GetModelLightIntensity(this.handle);
      },
      /**
       * 设置模型套色透明度
       * @memberOf SgDotTDAttr#
       * @param{Number} modelColorTrans-模型套色透明度(0：不透明  1：全透明)
       */
      setModelColorTrans: function (modelColorTrans) {
        PlotModule._SgDotTDAttr_SetModelColorTrans(this.handle, modelColorTrans);
      },
      /**
       * 获取模型套色透明度
       * @memberOf SgDotTDAttr#
       * @returns{Number} 返回模型套色透明度
       */
      getModelColorTrans: function () {
        return PlotModule._SgDotTDAttr_GetModelColorTrans(this.handle);
      },
      /**
       * 设置模型原点信息
       * @memberOf SgDotTDAttr#
       * @param{Array|PIEVector3} modelPivot-模型原点(每个方向上取值为[-1, 1]，当原点信息为0, 0, 0时，说明模型原点在模型的中心位置)
       */
      setModelPivot: function (modelPivot) {
        let arrayPivot = new PIEArray(modelPivot, PIEArrayType.Float64);
        PlotModule._SgDotTDAttr_SetModelPivot(this.handle, arrayPivot.getHandle());
        arrayPivot.dispose();
      },
      /**
       * 获取模型原点信息
       * @memberOf SgDotTDAttr#
       * @returns{PIEVector3} 返回模型原点
       */
      getModelPivot: function () {
        let arrayPivot = new PIEArray(3, PIEArrayType.Float64);
        PlotModule._SgDotTDAttr_GetModelPivot(this.handle, arrayPivot.getHandle());
        arrayPivot.updateData();
        let pivot = arrayPivot.toArray();
        arrayPivot.dispose();
        return new PIEVector3(pivot[0], pivot[1], pivot[2]);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 线面标绘显示属性操作函数
     * @name SgLATDAttr
     */
    function PIESgLATDAttr(handle, autoRelease) {
      PIESgTDAttr.call(this, handle, autoRelease);
    }
    PIESgLATDAttr.prototype = Object.assign(Object.create(PIESgTDAttr.prototype), {
      /**
       * 设置标绘显示类型
       * @memberOf SgLATDAttr#
       * @param{PlotLADisplayType} displayType-标绘显示类型
       */
      setDisplayType: function (displayType) {
        PlotModule._SgLATDAttr_SetDisplayType(this.handle, displayType);
      },
      /**
       * 获取标绘显示类型
       * @memberOf SgLATDAttr#
       * @returns {PlotLADisplayType}  返回标绘显示类型
       */
      getDisplayType: function () {
        return PlotModule._SgLATDAttr_GetDisplayType(this.handle);
      },
      /**
       * 设置是否绘制墙
       * @memberOf SgLATDAttr#
       * @param{Boolean} showWall-是否绘制墙
       */
      setShowWall: function (showWall) {
        PlotModule._SgLATDAttr_SetShowWall(this.handle, showWall);
      },
      /**
       * 获取是否绘制墙
       * @memberOf SgLATDAttr#
       * @returns {Boolean}  返回是否绘制墙
       */
      getShowWall: function () {
        return PlotModule._SgLATDAttr_GetShowWall(this.handle);
      },
      /**
       * 设置墙透明度
       * @memberOf SgLATDAttr#
       * @param{Number} wallTrans-墙透明度
       */
      setWallTrans: function (wallTrans) {
        PlotModule._SgLATDAttr_SetWallTrans(this.handle, wallTrans);
      },
      /**
       * 获取墙透明度
       * @memberOf SgLATDAttr#
       * @returns {Number}  返回墙透明度
       */
      getWallTrans: function () {
        return PlotModule._SgLATDAttr_GetWallTrans(this.handle);
      },
      /**
       * 设置是否仅三维选取
       * @memberOf SgLATDAttr#
       * @param{Boolean} pickOnly-是否仅三维选取
       */
      setPickOnly: function (pickOnly) {
        PlotModule._SgLATDAttr_SetPickOnly(this.handle, pickOnly);
      },
      /**
       * 获取是否仅三维选取
       * @memberOf SgLATDAttr#
       * @returns {Boolean}  返回是否仅三维选取
       */
      getPickOnly: function () {
        return PlotModule._SgLATDAttr_GetPickOnly(this.handle);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 注记操作函数
     * @name SgAnnoAttr
     */
    function PIESgAnnoAttr(handle, autoRelease) {
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIESgAnnoAttr.prototype, {
      /**
       * 设置注记文本
       * @param {String} annoText -注记文本
       * @memberOf SgAnnoAttr#
       */
      setAnnoText: function (annoText) {
        let strText = new PIEString(annoText);
        PlotModule._SgAnnoAttr_SetAnnoText(this.handle, strText.getHandle());
        strText.dispose();
      },
      /**
       * 获取注记文本
       *
       * @memberOf SgAnnoAttr#
       * @returns {String} 返回注记文本
       */
      getAnnoText: function () {
        let strText = new PIEString(256);
        PlotModule._SgAnnoAttr_GetAnnoText(this.handle, strText.getHandle());
        let text = strText.toString();
        strText.dispose();
        return text;
      },
      /**
       * 设置注记位置
       * @param {PlotAnnoPos} annoPos -注记位置
       * @memberOf SgAnnoAttr#
       */
      setAnnoPos: function (annoPos) {
        PlotModule._SgAnnoAttr_SetAnnoPos(this.handle, annoPos);
      },
      /**
       * 获取注记位置
       *
       * @memberOf SgAnnoAttr#
       * @returns {PlotAnnoPos} 返回注记位置
       */
      getAnnoPos: function () {
        return PlotModule._SgAnnoAttr_GetAnnoPos(this.handle);
      },
      /**
       * 设置字体名称
       * @param {String} fontName -字体名称
       *
       * @memberOf SgAnnoAttr#
       */
      setFontName: function (fontName) {
        let strName = new PIEString(fontName);
        PlotModule._SgAnnoAttr_SetFontName(this.handle, strName.getHandle());
        strName.dispose();
      },
      /**
       * 获取字体名称
       *
       * @memberOf SgAnnoAttr#
       * @returns {String} 返回字体名称
       */
      getFontName: function () {
        let strName = new PIEString(256);
        PlotModule._SgAnnoAttr_GetFontName(this.handle, strName.getHandle());
        let name = strName.toString();
        strName.dispose();
        return name;
      },
      /**
       * 设置字体颜色
       * @param {PIEColor} color -字体颜色
       *
       * @memberOf SgAnnoAttr#
       */
      setFontColor: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgAnnoAttr_SetFontColor(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取字体颜色
       *
       * @memberOf SgAnnoAttr#
       * @returns {PIEColor} 返回字体颜色
       */
      getFontColor: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgAnnoAttr_GetFontColor(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 设置字体大小
       * @param {Number} fontSize -字体大小
       *
       * @memberOf SgAnnoAttr#
       */
      setFontSize: function (fontSize) {
        PlotModule._SgAnnoAttr_SetFontSize(this.handle, fontSize);
      },
      /**
       * 获取字体大小
       *
       * @memberOf SgAnnoAttr#
       * @returns {Number} 返回字体大小
       */
      getFontSize: function () {
        return PlotModule._SgAnnoAttr_GetFontSize(this.handle);
      },
      /**
       * 判断当前字体是否是粗体
       *
       * @memberOf SgAnnoAttr#
       * @returns {Boolean} 返回是否是粗体
       */
      isBold: function () {
        return Boolean(PlotModule._SgAnnoAttr_IsBold(this.handle));
      },
      /**
       * 设置设置字体为粗体
       * @param {Boolean} bold -是否为粗体
       *
       * @memberOf SgAnnoAttr#
       * @returns {Boolean} 返回是否设置成功
       */
      setBold: function (bold) {
        return Boolean(PlotModule._SgAnnoAttr_SetBold(this.handle, bold));
      },
      /**
       * 判断当前字体是否带有下划线
       *
       * @memberOf SgAnnoAttr#
       * @returns {Boolean} 返回是否带有下划线
       */
      isUnderline: function () {
        return Boolean(PlotModule._SgAnnoAttr_IsUnderline(this.handle));
      },
      /**
       * 设置字体带下划线
       * @param {Boolean} underLine -是否带有下划线
       *
       * @memberOf SgAnnoAttr#
       * @returns {Boolean}  返回是否设置成功
       */
      setUnderline: function (underLine) {
        return Boolean(PlotModule._SgAnnoAttr_SetUnderline(this.handle, underLine));
      },
      /**
       * 判断当前字体是否带有删除线
       *
       * @memberOf SgAnnoAttr#
       * @returns {Boolean} 返回是否带有删除线
       */
      isStrikeOut: function () {
        return Boolean(PlotModule._SgAnnoAttr_IsStrikeOut(this.handle));
      },
      /**
       * 设置字体带删除线
       * @param {Boolean} strikeOut -字体是否带删除线
       *
       * @memberOf SgAnnoAttr#
       * @returns {Boolean} 返回是否设置成功
       */
      setStrikeOut: function (strikeOut) {
        return Boolean(PlotModule._SgAnnoAttr_SetStrikeOut(this.handle, strikeOut));
      },
      /**
       * 判断当前字体是否是斜体
       *
       * @memberOf SgAnnoAttr#
       * @returns {Boolean} 返回是否是斜体
       */
      isItalic: function () {
        return Boolean(PlotModule._SgAnnoAttr_IsItalic(this.handle));
      },
      /**
       * 设置字体为斜体
       * @param {Boolean} italic -是否是斜体
       *
       * @memberOf SgAnnoAttr#
       * @returns {Boolean} 返回是否是斜体
       */
      setItalic: function (italic) {
        return Boolean(PlotModule._SgAnnoAttr_SetItalic(this.handle, italic));
      },
      /**
       * 设置行空间
       * @param {Number} rowSpace -行空间
       * @memberOf SgAnnoAttr#
       */
      setRowSpace: function (rowSpace) {
        PlotModule._SgAnnoAttr_SetRowSpace(this.handle, rowSpace);
      },
      /**
       * 获取行空间
       *
       * @memberOf SgAnnoAttr#
       * @returns {Number} 返回行空间
       */
      getRowSpace: function () {
        return PlotModule._SgAnnoAttr_GetRowSpace(this.handle);
      },
      /**
       * 设置列空间
       * @param {Number} colSpace 列空间
       *
       * @memberOf SgAnnoAttr#
       */
      setColSpace: function (colSpace) {
        PlotModule._SgAnnoAttr_SetColSpace(this.handle, colSpace);
      },
      /**
       * 获取列空间
       *
       * @memberOf SgAnnoAttr#
       * @returns {Number} 返回列空间
       */
      getColSpace: function () {
        return PlotModule._SgAnnoAttr_GetColSpace(this.handle);
      },
      /**
       * 设置背景色
       * @param {PIEColor} color -背景色
       *
       * @memberOf SgAnnoAttr#
       */
      setBackColor: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgAnnoAttr_SetBackColor(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取背景色
       *
       * @memberOf SgAnnoAttr#
       * @returns {PIEColor} 返回背景色
       */
      getBackColor: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgAnnoAttr_GetBackColor(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 设置边界色
       * @param {PIEColor} color -边界色
       *
       * @memberOf SgAnnoAttr#
       */
      setBorderColor: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgAnnoAttr_SetBorderColor(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取边界色
       *
       * @memberOf SgAnnoAttr#
       * @returns {PIEColor} 返回边界色
       */
      getBorderColor: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgAnnoAttr_GetBorderColor(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 设置阴影色
       * @param {PIEColor} color -阴影颜色
       *
       * @memberOf SgAnnoAttr#
       */
      setShadowColor: function (color) {
        let arrayColor = null;
        if (color instanceof PIEColor) {
          arrayColor = color.toArray();
        } else if (color instanceof Array) {
          arrayColor = color;
        }
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          PlotModule._SgAnnoAttr_SetShadowColor(this.handle, colorArray.getHandle());
          colorArray.dispose();
        }
      },
      /**
       * 获取阴影颜色
       *
       * @memberOf SgAnnoAttr#
       * @returns {PIEColor} 返回阴影颜色
       */
      getShadowColor: function () {
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgAnnoAttr_GetShadowColor(this.handle, arrayColor.getHandle());
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      },
      /**
       * 设置边界宽度
       * @param {Number} borderWidth -边界宽度
       * @memberOf SgAnnoAttr#
       */
      setBorderWidth: function (borderWidth) {
        PlotModule._SgAnnoAttr_SetBorderWidth(this.handle, borderWidth);
      },
      /**
       * 获取边界宽度
       *
       * @memberOf SgAnnoAttr#
       * @returns {Number} 返回边界宽度
       */
      getBorderWidth: function () {
        return PlotModule._SgAnnoAttr_GetBorderWidth(this.handle);
      },
      /**
       * 设置阴影的X偏离值
       * @param {Number} shadowOffsetX -X偏离值
       * @memberOf SgAnnoAttr#
       */
      setShadowOffsetX: function (shadowOffsetX) {
        PlotModule._SgAnnoAttr_SetShadowOffsetX(this.handle, shadowOffsetX);
      },
      /**
       * 获取阴影的X偏离值
       *
       * @memberOf SgAnnoAttr#
       * @returns {Number} 返回X偏离值
       */
      getShadowOffsetX: function () {
        return PlotModule._SgAnnoAttr_GetShadowOffsetX(this.handle);
      },
      /**
       * 设置阴影的Y偏离值
       * @param {Number} shadowOffsetY -Y偏离值
       * @memberOf SgAnnoAttr#
       */
      setShadowOffsetY: function (shadowOffsetY) {
        PlotModule._SgAnnoAttr_SetShadowOffsetY(this.handle, shadowOffsetY);
      },
      /**
       * 获取阴影的Y偏离值
       *
       * @memberOf SgAnnoAttr#
       * @returns {Number} 返回Y偏离值
       */
      getShadowOffsetY: function () {
        return PlotModule._SgAnnoAttr_GetShadowOffsetY(this.handle);
      },
      /**
       * 设置注记与符号之间的距离
       * @param {Number} posOffset -注记与符号之间的距离
       * @memberOf SgAnnoAttr#
       */
      setPosOffset: function (posOffset) {
        PlotModule._SgAnnoAttr_SetPosOffset(this.handle, posOffset);
      },
      /**
       * 获取注记与符号之间的距离
       *
       * @memberOf SgAnnoAttr#
       * @returns {Number} 返回注记与符号之间的距离
       */
      getPosOffset: function () {
        return PlotModule._SgAnnoAttr_GetPosOffset(this.handle);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 标绘符号类型
     * @readonly
     * @enum {number}
     */
    var PIEPlotSymbolType = {
      /**
      * 点状J标
      */
      Dot: 0,
      /**
      * 线面状J标
      */
      Algo: 1,
      /**
      * 注记
      */
      ANNO: 3,
      /**
      * 表格
      */
      TABLE: 4,
      /**
      * 标签
      */
      MARK: 5,
      /**
      * 文本框
      */
      BOXTEXT: 8,
      /**
      * 组合J标
      */
      COMBO: 11,
      /**
      * 字库符号
      */
      FONT: 21,
      /**
      * 图片符号
      */
      PICTURE: 22
    };

    /**
     * 标绘Path类型
     * @readonly
     * @enum {number}
     */
    var PIEPlotPathType = {
      /**
       * 线
       */
      Line: 0,
      /**
       * 填充
       */
      Fill: 1,
      /**
       * 既是线又是面
       */
      Both: 2
    };

    /**
     * 标绘线型
     * @readonly
     * @enum {number}
     */
    var PIEPlotLineType = {
      /**
       * 实线
       */
      SolidLine: 0,
      /**
       * 虚线
       */
      DashLine: 1
    };

    /**
     * 标绘衬线的方向
     * @readonly
     * @enum {number}
     */
    var PIEPlotOutLineDirect = {
      /**
       * 无衬线
       */
      None: -1,
      /**
       * 内衬
       */
      IN: 0,
      /**
       * 外衬
       */
      OUT: 1,
      /**
       * 双衬
       */
      BOTH: 2
    };

    /**
     * 标绘填充风格
     * @readonly
     * @enum {number}
     */
    var PIEPlotFillStyle = {
      /**
       * 无填充
       */
      None: 1,
      /**
       * 实填充
       */
      Solid: 2,
      /**
       * 横线-----填充
       */
      Horizontal: 3,
      /**
       * 竖线|||||填充
       */
      Vertical: 4,
      /**
       * 左斜线/////填充
       */
      LeftDiagonal: 5,
      /**
       * 右斜线\\\\\填充
       */
      RightDiagonal: 6,
      /**
       * 横竖格网 +++++填充
       */
      HVGrid: 7,
      /**
       * 斜格网xxxxx填充
       */
      DiagonalGrid: 8,
      /**
       * 线性渐变填充
       */
      LinearGradient: 9,
      /**
       * 中心渐变填充
       */
      CenterGradient: 10
    };

    /**
     * 标绘镜像模式
     * @readonly
     * @enum {number}
     */
    var PIEPlotMirrorMode = {
      /**
       * 不镜像
       */
      NONE: 0,
      /**
       * 水平镜像
       */
      HORIZONTAL: 1,
      /**
       * 垂直镜像
       */
      VERTICAL: 2,
      /**
       * 水平+垂直镜像
       */
      BOTH: 3
    };

    /**
     * 标绘编辑模式
     * @readonly
     * @enum {number}
     */
    var PIEPlotEditMode = {
      /**
       * 三点式
       */
      ThreePoint: 0,
      /**
       * 九点式
       */
      NinePoint: 1
    };

    /**
     * 标绘渲染模式
     * @readonly
     * @enum {number}
     */
    var PIEPlotRenderType = {
      /**
       * 矢量
       */
      _Vector: 0,
      /**
       * 模型
       */
      _Model: 1
    };

    /**
     * 点标绘显示模式
     * @readonly
     * @enum {number}
     */
    var PIEPlotDotDisplayType = {
      /**
       * 拉伸直立
       */
      Billboard: 0,
      /**
       * 拉伸平放
       */
      Lie: 1,
      /**
       * 模型
       */
      Model: 3
    };

    /**
     * 线面标绘显示模式
     * @readonly
     * @enum {number}
     */
    var PIEPlotLADisplayType = {
      /**
       * 平面贴地
       */
      ClampGround: 0,
      /**
       * 立体悬空
       */
      Suspension: 1,
      /**
       * 立体渐变高度
       */
      GradientHeight: 2
    };

    /**
     * 标绘注记方位
     * @readonly
     * @enum {number}
     */
    var PIEPlotAnnoPos = {
      /**
       * 正下方
       */
      BottomCenter: 0,
      /**
       * 正右方
       */
      RightCenter: 1,
      /**
       * 正上方
       */
      TopCenter: 2,
      /**
       * 正左方
       */
      LeftCenter: 3,
      /**
       * 左上
       */
      LeftTop: 4,
      /**
       * 左下
       */
      LeftBottom: 5,
      /**
       * 右上
       */
      RightTop: 6,
      /**
       * 右下
       */
      RightBottom: 7,
      /**
       * 中
       */
      Center: 8
    };

    /**
     * 演播动画开始模式
     * @readonly
     * @enum {number}
     */
    var PIEPlotActionMode = {
      /**
       * 无模式
       */
      Null: -1,
      /**
       * 在上一动画之后
       */
      Next: 0,
      /**
       * 与上一动画同时
       */
      Together: 1,
      /**
       * 单击时
       */
      OnceClick: 2
    };

    /**
     * 演播动画速度模式
     * @readonly
     * @enum {number}
     */
    var PIEPlotActionSpeedMode = {
      /**
       * 匀速
       */
      Uniform: 0,
      /**
       * 加速
       */
      Accelerate: 1,
      /**
       * 减速
       */
      Decelerate: 2,
      /**
       * 加减速
       */
      AceDec: 3
    };

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 标绘多媒体信息操作函数
     * @name SgMediaAttr
     */
    function PIESgMediaAttr(handle, autoRelease) {
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIESgMediaAttr.prototype, {
      getHandle: function () {
        return this.handle;
      },
      /**
       * 设置名称
       * @param{String} name-名称
       * @memberOf SgMediaAttr#
       */
      setName: function (name) {
        let strName = new PIEString(name);
        PlotModule._SgMediaAttr_SetName(this.handle, strName.getHandle());
        strName.dispose();
      },
      /**
       * 获取名称
       * @memberOf SgMediaAttr#
       * @returns {String} 返回名称
       */
      getName: function () {
        let strName = new PIEString(512);
        PlotModule._SgMediaAttr_GetName(this.handle, strName.getHandle());
        let name = strName.toString();
        strName.dispose();
        return name;
      },
      /**
       * 设置标号描述信息
       * @param{String} desc-描述信息
       * @memberOf SgMediaAttr#
       */
      setDesc: function (desc) {
        let strDesc = new PIEString(desc);
        PlotModule._SgMediaAttr_SetDesc(this.handle, strDesc.getHandle());
        strDesc.dispose();
      },
      /**
       * 获取标号描述信息
       * @memberOf SgMediaAttr#
       * @returns {String} 返回标号描述信息
       */
      getDesc: function () {
        let strDesc = new PIEString(512);
        PlotModule._SgMediaAttr_GetDesc(this.handle, strDesc.getHandle());
        let desc = strDesc.toString();
        strDesc.dispose();
        return desc;
      },
      /**
       * 添加标号关联文件路径
       * @param{String} extFile-文件路径
       * @memberOf SgMediaAttr#
       */
      addExtFile: function (extFile) {
        let strExtFile = new PIEString(extFile);
        PlotModule._SgMediaAttr_AddExtFile(this.handle, strExtFile.getHandle());
        strExtFile.dispose();
      },
      /**
       * 删除标号关联文件路径
       * @memberOf SgMediaAttr#
       * @returns {Number} index-索引
       */
      removeExtFile: function (index) {
        PlotModule._SgMediaAttr_RemoveExtFile(this.handle, index);
      },
      /**
       * 清除标号关联文件路径
       * @memberOf SgMediaAttr#
       */
      clearExtFiles: function () {
        PlotModule._SgMediaAttr_ClearExtFiles(this.handle);
      },
      /**
       * 获取所有标号关联文件路径
       * @memberOf SgMediaAttr#
       */
      getExtFiless: function () {
        //PlotModule._SgMediaAttr_GetExtFiles(this.handle);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     *
     * 创建标绘实体对象
     * @name PlotEntity
     * @class PlotEntity
     * 标绘实体类操作函数
     *
     */
    function PIEPlotEntity(handle, autoRelease) {
      if (!handle) {
        handle = PlotModule._PlotEntity_Create();
        autoRelease = true;
      }
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIEPlotEntity.prototype, {
      setAutoRelease: function (autoRelease) {
        this.autoRelease = autoRelease;
      },
      getHandle: function () {
        return this.handle;
      },
      /**
       * 释放几何对象
       * @memberOf PlotEntity#
       *
       */
      dispose: function () {
        if (this.autoRelease) {
          PlotModule._PlotEntity_Delete(this.handle);
          this.autoRelease = false;
        }
        this.handle = null;
      },
      /**
       * 克隆几何对象
       * @memberOf PlotEntity#
       * @returns {PIEPlotEntity} 返回标绘对象
       */
      cloning: function () {
        let handle = PlotModule._PlotEntity_Clone(this.handle);
        return new PIEPlotEntity(handle);
      },
      /**
       * 获取符号唯一标识
       * @memberOf PlotEntity#
       * @returns {String} 返回符号唯一标识
       */
      getID: function () {
        let strID = new PIEString(256);
        PlotModule._PlotEntity_GetID(this.handle, strID.getHandle());
        return strID.toString();
      },
      /**
       * 设置标绘符号的名称
       * @param {String} name -符号名称
       * @memberOf PlotEntity#
       */
      setName: function (name) {
        let strName = new PIEString(name);
        PlotModule._PlotEntity_SetName(this.handle, strName.getHandle());
      },
      /**
       * 获取符号名称
       * @memberOf PlotEntity#
       * @returns {String} 返回符号名称
       */
      getName: function () {
        let strName = new PIEString(256);
        PlotModule._PlotEntity_GetName(this.handle, strName.getHandle());
        return strName.toString();
      },
      /**
       * 获取是否可见
       *
       * @memberOf PlotEntity#
       * @returns {Boolean} 返回是否可见
       */
      isVisible: function () {
        return Boolean(PlotModule._PlotEntity_IsVisible(this.handle));
      },
      /**
       * 设置是否可见
       * @param {Boolean} visible -是否可见
       *
       * @memberOf PlotEntity#
       */
      setVisible: function (visible) {
        PlotModule._PlotEntity_SetVisible(this.handle, visible);
      },
      /**
       * 设置符号ID
       * @param {Number} code -符号ID
       * @memberOf PlotEntity#
       */
      setSymbolCode: function (code) {
        if (code != null) {
          PlotModule._PlotEntity_SetSymbolCode(this.handle, code);
        }
      },
      /**
       * 获取符号ID
       * @memberOf PlotEntity#
       * @returns {Number} 返回符号ID
       */
      getSymbolCode: function () {
        return PlotModule._PlotEntity_GetSymbolCode(this.handle);
      },
      /**
       * 获取符号类型
       * @memberOf PlotEntity#
       * @returns {PlotSymbolType} 返回符号类型
       */
      getSymbolType: function () {
        return PlotModule._PlotEntity_GetSymbolType(this.handle);
      },
      /**
       * 获取军标对象线军标的点最小个数
       * @memberOf PlotEntity#
       * @returns {Number} 返回标绘点最小个数
       */
      getMinPointCount: function () {
        return PlotModule._PlotEntity_GetMinPointCount(this.handle);
      },
      /**
       * 获取军标对象线军标的点最大个数
       * @memberOf PlotEntity#
       * @returns {Number} 返回标绘点最大个数
       */
      getMaxPointCount: function () {
        return PlotModule._PlotEntity_GetMaxPointCount(this.handle);
      },
      /**
       * 获取绘制属性
       * @memberOf PlotEntity#
       * @returns {PIESgDrawAttr} 返回标绘属性对象
       */
      getDrawAttr: function () {
        let handle = PlotModule._PlotEntity_GetDrawAttr(this.handle);
        let type = this.getSymbolType();
        if (type == PIEPlotSymbolType.Dot) {
          return new PIESgDotDrawAttr(handle);
        } else if (type == PIEPlotSymbolType.Algo) {
          return new PIESgLADrawAttr(handle);
        }
        return new PIESgDrawAttr(handle);
      },
      /**
       * 获取三维属性
       * @memberOf PlotEntity#
       * @returns {PIESgTDAttr} 返回标绘三维属性对象
       */
      getTDAttr: function () {
        let handle = PlotModule._PlotEntity_GetTDAttr(this.handle);
        let type = this.getSymbolType();
        if (type == PIEPlotSymbolType.Dot) {
          return new PIESgDotTDAttr(handle);
        } else if (type == PIEPlotSymbolType.Algo) {
          return new PIESgLATDAttr(handle);
        }
        return new PIESgTDAttr(handle);
      },
      /**
       * 获取注记属性
       * @memberOf PlotEntity#
       * @returns {PIESgAnnoAttr} 返回标绘注记属性对象
       */
      getAnnoAttr: function () {
        let handle = PlotModule._PlotEntity_GetAnnoAttr(this.handle);
        return new PIESgAnnoAttr(handle);
      },
      /**
       * 获取标绘多媒体信息
       * @memberOf PlotEntity#
       * @returns {PIESgMediaAttr} 返回标绘多媒体对象
       */
      getMediaAttr: function () {
        let handle = PlotModule._PlotEntity_GetMediaAttr(this.handle);
        return new PIESgMediaAttr(handle);
      },
      /**
       * 构建点标绘几何数据
       * @param {Vector2|Array} point -点坐标
       * @param {Number} referenceScale -基准比例尺
       * @memberOf PlotEntity#
       */
      makeDot: function (point, referenceScale) {
        let pointArray = null;
        if (!referenceScale || referenceScale <= 0) {
          referenceScale = 1;
        }
        if (point instanceof PIEVector2) {
          pointArray = point.toArray();
        } else if (point instanceof Array) {
          pointArray = point;
        }
        if (pointArray) {
          let arrayPoint = new PIEArray(pointArray, PIEArrayType.Float64);
          PlotModule._PlotEntity_MakeDot(this.handle, arrayPoint.getHandle(), referenceScale);
          arrayPoint.dispose();
        }
      },
      /**
       * 构建线面标绘几何数据
       * @param {Array} points -点坐标串
       * @param {Number} referenceScale -基准比例尺
       * @memberOf PlotEntity#
       */
      makeLA: function (points, referenceScale) {
        if (!referenceScale || referenceScale <= 0) {
          referenceScale = 1;
        }
        if (points instanceof Array && points.length >= 2) {
          let pointsArray = new PIEArray(points, PIEArrayType.Float64);
          PlotModule._PlotEntity_MakeLA(this.handle, pointsArray.getHandle(), points.length / 2, referenceScale);
          pointsArray.dispose();
        }
      },
      /**
       * 设置几何点
       * @param {Number} index -索引
       * @param {PIEVector2|Array} point -点坐标
       * @memberOf PlotEntity#
       * @returns {Boolean} 返回是否设置成功
       */
      setGeoPoint: function (index, point) {
        let arrayPoint = null;
        if (point instanceof PIEVector2) {
          arrayPoint = point.toArray();
        } else if (point instanceof Array) {
          arrayPoint = point;
        }
        if (arrayPoint) {
          let pointArray = new PIEArray(arrayPoint, PIEArrayType.Float64);
          return PlotModule._PlotEntity_SetGeoPoint(this.handle, index, pointArray.getHandle());
        }
        return false;
      },
      /**
       * 设置比例点
       * @param {Number} index -索引
       * @param {PIEVector2|Array} point -点坐标
       * @memberOf PlotEntity#
       * @returns {Boolean} 返回是否设置成功
       */
      setScalePoint: function (index, point) {
        let arrayPoint = null;
        if (point instanceof PIEVector2) {
          arrayPoint = point.toArray();
        } else if (point instanceof Array) {
          arrayPoint = point;
        }
        if (arrayPoint) {
          let pointArray = new PIEArray(arrayPoint, PIEArrayType.Float64);
          return PlotModule._PlotEntity_SetScalePoint(this.handle, index, pointArray.getHandle());
        }
        return false;
      },
      /**
       * 获取几何点个数
       * @memberOf PlotEntity#
       * @returns {Number} 返回几何点个数
       */
      getGeoPtsCount: function () {
        return PlotModule._PlotEntity_GetGeoPtsCount(this.handle);
      },
      /**
       * 获取几何点数组
       * @memberOf PlotEntity#
       * @returns {Array} 返回几何点
       */
      getGeoPts: function () {
        let count = this.getGeoPtsCount();
        if (count > 0) {
          let arrayPoints = new PIEArray(count * 2, PIEArrayType.Float64);
          PlotModule._PlotEntity_GetGeoPts(this.handle, arrayPoints.getHandle());
          arrayPoints.updateData();
          let geoPts = arrayPoints.toArray();
          arrayPoints.dispose();
          return geoPts;
        }
      },
      /**
       * 获取比例点个数
       * @memberOf PlotEntity#
       * @returns {Number} 返回比例点个数
       */
      getScalePtsCount: function () {
        return PlotModule._PlotEntity_GetScalePtsCount(this.handle);
      },
      /**
       * 获取比例点数组
       * @memberOf PlotEntity#
       * @returns {Array} 返回比例点
       */
      getScalePts: function () {
        let count = this.getGeoPtsCount();
        if (count > 0) {
          let arrayPoints = new PIEArray(count * 2, PIEArrayType.Float64);
          PlotModule._PlotEntity_GetScalePts(this.handle, arrayPoints.getHandle());
          arrayPoints.updateData();
          let geoPts = arrayPoints.toArray();
          arrayPoints.dispose();
          return geoPts;
        }
      },
      /**
       * 准备标绘path
       * @memberOf PlotEntity#
       * @returns {Number} 返回标绘路径数组中成员总个数
       */
      preparePlotPaths: function () {
        return PlotModule._PlotEntity_PreparePlotPaths(this.handle);
      },
      /**
       * 获取标绘对象的路径数组
       * @memberOf PlotEntity#
       * @returns {Array} 返回标绘路径对象数组
       */
      getPaths: function () {
        let count = this.preparePlotPaths();
        let plotPaths = [];
        if (count > 0) {
          let arrayPath = new PIEArray(count, PIEArrayType.Int32);
          PlotModule._PlotEntity_GetPaths(this.handle, arrayPath.getHandle());
          arrayPath.updateData();
          let pathArray = arrayPath.toArray();
          pathArray.forEach(item => {
            let path = new PIEPlotPath(item);
            plotPaths.push(path);
          });
        }
        return plotPaths;
      },
      /**
       *  释放标绘path
       * @memberOf PlotEntity#
       */
      releasePlotPaths: function () {
        PlotModule._PlotEntity_ReleasePlotPaths(this.handle);
      },
      /**
       * 获取是否有内部文字
       * @memberOf PlotEntity#
       * @returns {Boolean} 返回是否有内部文字
       */
      hasInnerText: function () {
        return PlotModule._PlotEntity_HasInnerText(this.handle);
      },
      /**
       * 获取是否有填充路径
       * @memberOf PlotEntity#
       * @returns {Boolean} 返回是否有填充路径
       */
      hasFillPath: function () {
        return PlotModule._PlotEntity_HasFillPath(this.handle);
      },
      /**
       * 获取范围
       * @memberOf PlotEntity#
       * @returns {PIEBounds}  返回范围
       */
      getBounds: function () {
        let arrayBounds = new PIEArray(4, PIEArrayType.Float64);
        PlotModule._PlotEntity_GetBounds(this.handle, arrayBounds.getHandle());
        arrayBounds.updateData();
        let bounds = arrayBounds.toArray();
        arrayBounds.dispose();
        return new PIEBounds(bounds[0], bounds[1], bounds[2], bounds[3]);
      },
      /**
       *  平移
       * @param {Number} x -x方向
       * @param {Number} y -y方向
       * @memberOf PlotEntity#
       */
      offset: function (x, y) {
        PlotModule._PIE_PlotEntity_Offset(this.handle, x, y);
      },
      /**
       * 旋转
       * @param {PIEVector2|Array} pointOrigin -旋转中心
       * @param {Number} angle -旋转角度
       * @memberOf PlotEntity#
       */
      rotate: function (pointOrigin, angle) {
        let arrayPoint = null;
        if (pointOrigin instanceof PIEVector2) {
          arrayPoint = pointOrigin.toArray();
        } else if (pointOrigin instanceof Array) {
          arrayPoint = pointOrigin;
        }
        if (arrayPoint) {
          let PointArr = new PIEArray(arrayPoint, PIEArrayType.Float64);
          PlotModule._PlotEntity_Rotate(this.handle, PointArr.getHandle(), angle);
          PointArr.dispose();
        }
      },
      /**
       * 调整几何数据,限定在新的Bounds中
       * @param {PIEBounds|Array} points -新的Bounds
       * @memberOf PlotEntity#
       */
      resize: function (bounds) {
        let arrayBounds = null;
        if (bounds instanceof PIEBounds) {
          arrayBounds = bounds.toArray();
        } else if (bounds instanceof Array) {
          arrayBounds = bounds;
        }
        if (arrayBounds) {
          let boundsArr = new PIEArray(arrayBounds, PIEArrayType.Float64);
          PlotModule._PlotEntity_Resize(this.handle, boundsArr.getHandle());
          boundsArr.dispose();
        }
      },
      /**
       * 获取父图层
       * @memberOf PlotEntity#
       * @returns {PIEPlotSubGraphicLayer} 返回父图层
       */
      parentLayer: function () {
        let handle = PlotModule._PlotEntity_ParentLayer(this.handle);
        return new PIEPlotSubGraphicLayer({
          handle: handle
        });
      },
      /**
       * 获取祖先图层
       * @memberOf PlotEntity#
       * @returns {PIEPlotGraphicLayer} 返回祖先图层
       */
      ancestorLayer: function () {
        let handle = PlotModule._PlotEntity_AncestorLayer(this.handle);
        return new PIEPlotGraphicLayer(handle);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 创建标绘子图层
     * @name PlotSubGraphicLayer
     * @class PlotSubGraphicLayer
     * 标绘子图层操作函数
     * @param {Object} options -
     * @param {PIEPlotGraphicLayer} options.parent -父图层
     */
    function PIEPlotSubGraphicLayer(options) {
      let handle = null;
      let autoRelease = false;
      if (options != null) {
        let plotGraphicLayer = options.parent;
        if (plotGraphicLayer != null && (plotGraphicLayer instanceof PIEPlotGraphicLayer || plotGraphicLayer instanceof PIEPlotSubGraphicLayer)) {
          handle = PlotModule._PlotSubGraphicLayer_Create(plotGraphicLayer.getHandle());
          autoRelease = true;
        }
        if (options.handle != null) {
          handle = options.handle;
          autoRelease = false;
        }
      }
      PIEIPlotGraphicLayer.call(this, handle, autoRelease);
    }
    PIEPlotSubGraphicLayer.prototype = Object.assign(Object.create(PIEIPlotGraphicLayer.prototype), {
      /**
       * 添加标绘
       * @param {PIEPlotEntity} plotEntity -标绘实体
       *
       * @memberOf PlotSubGraphicLayer#
       * @returns {Boolean} 返回是否添加
       */
      addPlot: function (plotEntity) {
        return Boolean(PlotModule._PlotSubGraphicLayer_AddPlot(this.handle, plotEntity.getHandle()));
      },
      /**
       * 插入标绘
       * @param {Number} index -标绘索引
       * @param {PlotEntity} plotEntity -标绘实体
       *
       * @memberOf PlotSubGraphicLayer#
       */
      insertPlot: function (index, plotEntity) {
        PlotModule._PlotSubGraphicLayer_InsertPlot(this.handle, index, plotEntity.getHandle());
      },
      /**
       * 移除标绘
       * @param {PlotEntity} plotEntity -标绘实体
       *
       * @memberOf PlotSubGraphicLayer#
       * @returns {Boolean} 返回是否移除
       */
      removePlot: function (plotEntity) {
        return Boolean(PlotModule._PlotSubGraphicLayer_RemovePlot(this.handle, plotEntity.getHandle()));
      },
      /**
       * 通过索引移除标绘
       * @param {Number} index -标绘索引
       *
       * @memberOf PlotSubGraphicLayer#
       * @returns {PIEPlotEntity} 返回标绘实体
       */
      removePlotByIndex: function (index) {
        var handle = PlotModule._PlotSubGraphicLayer_RemovePlotByIndex(this.handle, index);
        if (handle) {
          return new PIEPlotEntity(handle, index);
        } else {
          return null;
        }
      },
      /**
       * 获取标绘
       * @param {Number} index -标绘索引
       *
       * @memberOf PlotSubGraphicLayer#
       * @returns {PIEPlotEntity} 返回标绘实体
       */
      getPlot: function (index) {
        var handle = PlotModule._PlotSubGraphicLayer_GetPlot(this.handle, index);
        if (handle) {
          return new PIEPlotEntity(handle, index);
        } else {
          return null;
        }
      },
      /**
       * 获取标绘索引
       * @param {PIEPlotEntity} plotEntity -标绘实体
       *
       * @memberOf PlotSubGraphicLayer#
       * @returns {Number} 返回标绘索引
       */
      indexOfPlot: function (plotEntity) {
        return PlotModule._PlotSubGraphicLayer_IndexOfPlot(this.handle, plotEntity.getHandle());
      },
      /**
       * 获取标绘数量
       *
       * @memberOf PlotSubGraphicLayer#
       * @returns {Number} 返回标绘数量
       */
      getPlotCount: function () {
        return PlotModule._PlotSubGraphicLayer_GetPlotCount(this.handle);
      },
      /**
       * 获取标绘
       *
       * @memberOf PlotSubGraphicLayer#
       * @returns {Array} 返回标绘点
       */
      getPlots: function () {
        let count = this.getPathCount();
        let pPlot = [];
        if (count > 0) {
          let arrayPlot = new PIEArray(count, PIEArrayType.Int32);
          PlotModule._PlotSubGraphicLayer_GetPlots(this.handle, arrayPlot.getHandle());
          arrayPlot.updateData();
          let pathArray = arrayPlot.toArray();
          pathArray.forEach(item => {
            let path = new PIEPlotPath(item);
            pPlot.push(path);
          });
        }
        return pPlot;
      },
      /**
       * 清除标绘
       * @param {Boolean} destroy -是否清除
       *
       * @memberOf PlotSubGraphicLayer#
       */
      clearPlots: function (destroy) {
        PlotModule._PlotSubGraphicLayer_ClearPlots(this.handle, destroy);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 标绘图层类操作函数
     * @name IPlotGraphicLayer
     */
    function PIEIPlotGraphicLayer(handle, autoRelease) {
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIEIPlotGraphicLayer.prototype, {
      getHandle: function () {
        return this.handle;
      },
      /**
       * 删除图层
       * @memberOf IPlotGraphicLayer#
       */
      despose: function () {
        PlotModule._IPlotGraphicLayer_Delete();
      },
      /**
       * 设置图层名称
       * @param {String} name -图层名称
       * @memberOf IPlotGraphicLayer#
       */
      setName: function (name) {
        let strName = new PIEString(name);
        PlotModule._IPlotGraphicLayer_SetName(this.handle, strName.getHandle());
      },
      /**
       * 获取图层名称
       *
       * @memberOf IPlotGraphicLayer#
       * @returns {String} 返回图层名称
       */
      getName: function () {
        let strName = new PIEString(56);
        PlotModule._IPlotGraphicLayer_GetName(this.handle, strName.getHandle());
        return strName.toString();
      },
      /**
       * 设置父图层
       * @param {PIEIPlotGraphicLayer} parent -父图层
       * @memberOf IPlotGraphicLayer#
       */
      setParent: function (parent) {
        PlotModule._IPlotGraphicLayer_SetParent(this.handle, parent.getHandle());
      },
      /**
       * 获取父图层
       *
       * @memberOf IPlotGraphicLayer#
       * @returns {PIEIPlotGraphicLayer} 返回父图层
       */
      getParent: function () {
        var handle = PlotModule._IPlotGraphicLayer_GetParent(this.handle);
        if (handle) {
          return new PIEIPlotGraphicLayer(handle);
        } else {
          return null;
        }
      },
      /**
       * 设置是否可见
       * @param {Boolean} visible -是否可见
       * @memberOf IPlotGraphicLayer#
       */
      seVisible: function (visible) {
        PlotModule._IPlotGraphicLayer_SeVisible(this.handle, visible);
      },
      /**
       * 获取是否可见
       *
       * @memberOf IPlotGraphicLayer#
       * @returns {Boolean} 返回是否可见
       */
      getVisible: function () {
        return Boolean(PlotModule._IPlotGraphicLayer_GetVisible(this.handle));
      },
      /**
       * 添加子图层
       * @param {PIEIPlotGraphicLayer} subGraphicLayer -子图层
       * @returns {Boolean} 返回子图层
       */
      addSubGraphicLayer: function (subGraphicLayer) {
        return Boolean(PlotModule._IPlotGraphicLayer_AddSubGraphicLayer(this.handle, subGraphicLayer.getHandle()));
      },
      /**
       * 插入子图层
       * @param {Number} index -图层索引
       * @param {PIEIPlotGraphicLayer} subGraphicLayer -子图层
       * @memberOf IPlotGraphicLayer#
       */
      insertSubGraphicLayer: function (index, subGraphicLayer) {
        PlotModule._IPlotGraphicLayer_InsertSubGraphicLayer(this.handle, index, subGraphicLayer.getHandle());
      },
      /**
       * 移除子图层
       * @param {PIEIPlotGraphicLayer} subGraphicLayer -子图层
       *
       * @memberOf IPlotGraphicLayer#
       * @returns {Boolean} 返回是否移除
       */
      removeSubGraphicLayer: function (subGraphicLayer) {
        return Boolean(PlotModule._IPlotGraphicLayer_RemoveSubGraphicLayer(this.handle, subGraphicLayer.getHandle()));
      },
      /**
       * 通过索引删除子图层
       * @param {Number} index -索引
       *；
       * @memberOf IPlotGraphicLayer#
       * @returns {PIEIPlotGraphicLayer} 返回删除后图层
       */
      removeSubGraphicLayerByIndex: function (index) {
        var handle = PlotModule._IPlotGraphicLayer_RemoveSubGraphicLayerByIndex(this.handle, index);
        if (handle) {
          return new PIEIPlotGraphicLayer(handle, index);
        } else {
          return null;
        }
      },
      /**
       * 通过索引获取子图层
       * @param {Number} index -索引
       *
       * @memberOf IPlotGraphicLayer#
       * @returns {PIEPlotSubGraphicLayer} 返回获取的子图层
       */
      getSubGraphicLayer: function (index) {
        var handle = PlotModule._IPlotGraphicLayer_GetSubGraphicLayer(this.handle, index);
        if (handle) {
          return new PIEPlotSubGraphicLayer({
            handle: handle
          });
        } else {
          return null;
        }
      },
      /**
       * 获取子图层索引
       * @param {PIEIPlotGraphicLayer} subGraphicLayer -子图层
       *
       * @memberOf IPlotGraphicLayer#
       * @returns {Number} 返回子图层索引
       */
      indexOfSubGraphicLayer: function (subGraphicLayer) {
        return PlotModule._IPlotGraphicLayer_IndexOfSubGraphicLayer(this.handle, subGraphicLayer.getHandle());
      },
      /**
       * 获取子图层数量
       *
       * @memberOf IPlotGraphicLayer#
       * @returns {Number} 返回图层数量
       */
      getSubGraphicLayerCount: function () {
        return PlotModule._IPlotGraphicLayer_GetSubGraphicLayerCount(this.handle);
      },
      /**
       * 清理子图层
       * @param {Boolean} destory -是否清除
       *
       * @memberOf IPlotGraphicLayer#
       */
      clearSubGraphicLayers: function (destory) {
        PlotModule._IPlotGraphicLayer_ClearSubGraphicLayers(this.handle, destory);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 创建标绘图层
     * @name PlotGraphicLayer
     * @class PlotGraphicLayer
     * 标绘图层操作函数
     *
     */
    function PIEPlotGraphicLayer(handle, autoRelease) {
      if (handle == null) {
        handle = PlotModule._PlotGraphicLayer_Create();
        autoRelease = true;
      }
      PIEIPlotGraphicLayer.call(this, handle, autoRelease);
    }
    PIEPlotGraphicLayer.prototype = Object.assign(Object.create(PIEIPlotGraphicLayer.prototype), {
      /**
       * 设置坐标系
       * @param {Number} epsg -坐标系EPSG
       * @memberOf PlotGraphicLayer#
       */
      setSpatialReference: function (epsg) {
        PlotModule._PlotGraphicLayer_SetSpatialReference(this.handle, epsg);
      },
      /**
       * 获取坐标系
       *
       * @memberOf PlotGraphicLayer#
       * @returns {Number} 返回坐标系EPSG
       */
      getSpatialReference: function () {
        return PlotModule._PlotGraphicLayer_GetSpatialReference(this.handle);
      },
      /**
       * 设置基准比例尺
       * @param {Number} scale -比例尺
       * @memberOf PlotGraphicLayer#
       */
      setReferenceScale: function (scale) {
        PlotModule._PlotGraphicLayer_SetReferenceScale(this.handle, scale);
      },
      /**
       * 获取基准比例尺
       * @memberOf PlotGraphicLayer#
       * @returns {Number} 返回基准比例尺
       */
      getReferenceScale: function () {
        return PlotModule._PlotGraphicLayer_GetReferenceScale(this.handle);
      },
      /**
       * 获取缩放系数
       * @memberOf PlotGraphicLayer#
       * @returns {Number} 返回缩放系数
       */
      getRatio: function () {
        return PlotModule._PlotGraphicLayer_GetRatio(this.handle);
      },
      /**
       * 设置最大最小放大倍数
       * @param {Number} maxZoomLimit -最大放大倍数
       * @param {Number} minZoomLimit -最小放大倍数
       * @memberOf PlotGraphicLayer#
       */
      setZoomLimit: function (maxZoomLimit, minZoomLimit) {
        PlotModule._PlotGraphicLayer_SetZoomLimit(this.handle, maxZoomLimit, minZoomLimit);
      },
      /**
       * 获取最大最小放大倍数
       * @memberOf PlotGraphicLayer#
       * @returns {Array} 返回最大最小放大倍数数组
       */
      getZoomLimit: function () {
        let zoomLimitArray = new PIEArray(2, PIEArrayType.Float64);
        return PlotModule._PlotGraphicLayer_GetZoomLimit(this.handle, zoomLimitArray.getHandle());
      },
      /**
       * 设置最大最小可见比例尺
       * @param {Number} maxVisibleScaleLimit -最大可见比例尺
       * @param {Number} minVisibleScaleLimit -最小可见比例尺
       * @memberOf PlotGraphicLayer#
       */
      setVisibleScaleLimit: function (maxVisibleScaleLimit, minVisibleScaleLimit) {
        PlotModule._PlotGraphicLayer_SetVisibleScaleLimit(this.handle, maxVisibleScaleLimit, minVisibleScaleLimit);
      },
      /**
       * 获取最大最小可见比例尺
       * @memberOf PlotGraphicLayer#
       * @returns {Array} 返回最大最小可见比例尺数组
       */
      getVisibleScaleLimit: function () {
        let scaleLimitArray = new PIEArray(2, PIEArrayType.Float64);
        PlotModule._PlotGraphicLayer_GetVisibleScaleLimit(this.handle, scaleLimitArray.getHandle());
        scaleLimitArray.updateData();
        let scaleLimit = scaleLimitArray.toArray();
        scaleLimitArray.dispose();
        return scaleLimit;
      },
      /**
       * 设置图层是否可选择
       * @param {Boolean} selectable -是否可选择
       * @memberOf PlotGraphicLayer#
       */
      setSelectable: function (selectable) {
        PlotModule._PlotGraphicLayer_SetSelectable(this.handle, selectable);
      },
      /**
       * 获取图层是否可选择
       * @memberOf PlotGraphicLayer#
       * @returns {Boolean} 返回是否可选择
       */
      getSelectable: function () {
        return PlotModule._PlotGraphicLayer_GetSelectable(this.handle);
      },
      /**
       * 设置图层是否可编辑
       * @param {Boolean} editable -是否可编辑
       * @memberOf PlotGraphicLayer#
       */
      setEditable: function (editable) {
        PlotModule._PlotGraphicLayer_SetEditable(this.handle, editable);
      },
      /**
       * 获取图层是否可编辑
       * @memberOf PlotGraphicLayer#
       * @returns {Boolean} 返回是否可编辑
       */
      getEditable: function () {
        return PlotModule._PlotGraphicLayer_GetEditable(this.handle);
      },
      /**
       * 设置图层描述信息
       * @param {String} description -描述信息
       * @memberOf PlotGraphicLayer#
       */
      setDescription: function (description) {
        let strDescription = new PIEString(description);
        PlotModule._PlotGraphicLayer_SetDescription(this.handle, strDescription.getHandle());
      },
      /**
       * 获取图层描述信息
       * @memberOf PlotGraphicLayer#
       * @returns {String} 返回描述信息
       */
      getDescription: function () {
        let strDescription = new PIEString(512);
        PlotModule._PlotGraphicLayer_GetDescription(this.handle, strDescription.getHandle());
        let description = strDescription.toString();
        return description;
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 标绘图层管理函数
     * @name PlotGraphicLayerManager
     */
    function PIEPlotGraphicLayerManager(handle, autoRelease) {
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIEPlotGraphicLayerManager.prototype, {
      getHandle: function () {
        return this.handle;
      },
      /**
       * 添加图层
       * @param {PIEPlotGraphicLayer} group -图层组
       *
       * @memberOf PlotGraphicLayerManager#
       * @returns {Boolean} 返回图层组
       */
      addGraphicLayer: function (group) {
        return Boolean(PlotModule._PlotGraphicLayerManager_AddGraphicLayer(this.handle, group.getHandle()));
      },
      /**
       * 插入图层
       * @param {Number} index -图层索引
       * @param {PIEPlotGraphicLayer} graphicLayer -图层
       *
       * @memberOf PlotGraphicLayerManager#
       */
      insertGraphicLayer: function (index, graphicLayer) {
        PlotModule._PlotGraphicLayerManager_InsertGraphicLayer(this.handle, index, graphicLayer.getHandle());
      },
      /**
       * 移除图层
       * @param {PIEPlotGraphicLayer} graphicLayer -图层
       *
       * @memberOf PlotGraphicLayerManager#
       * @returns {Boolean} 返回是否移除图层
       */
      removeGraphicLayer: function (graphicLayer) {
        return Boolean(PlotModule._PlotGraphicLayerManager_RemoveGraphicLayer(this.handle, graphicLayer.getHandle()));
      },
      /**
       * 通过索引移除图层
       * @param {Number} index -图层索引
       *
       * @memberOf PlotGraphicLayerManager#
       * @returns {PIEPlotGraphicLayer} 返回移除后的图层
       */
      removeGraphicLayerByIndex: function (index) {
        var handle = PlotModule._PlotGraphicLayerManager_RemoveGraphicLayerByIndex(this.handle, index);
        if (handle) {
          return new PIEPlotGraphicLayer(handle);
        }
        return null;
      },
      /**
       * 通过索引获取图层
       * @param {Number} index -图层索引
       * @memberOf PlotGraphicLayerManager#
       * @returns {PIEPlotGraphicLayer} 返回图层
       */
      graphicLayer: function (index) {
        var handle = PlotModule._PlotGraphicLayerManager_GraphicLayer(this.handle, index);
        if (handle) {
          return new PIEPlotGraphicLayer(handle);
        }
        return null;
      },
      /**
       * 获取图层索引
       * @param {PIEPlotGraphicLayer} group -图层组
       *
       * @memberOf PlotGraphicLayerManager#
       * @returns {Number} 返回图层索引
       */
      indexOfGraphicLayer: function (group) {
        return PlotModule._PlotGraphicLayerManager_IndexOfGraphicLayer(this.handle, group.getHandle());
      },
      /**
       * 获取图层数量
       *
       * @memberOf PlotGraphicLayerManager#
       * @returns {Number} 返回图层数量
       */
      graphicLayerCount: function () {
        return PlotModule._PlotGraphicLayerManager_GraphicLayerCount(this.handle);
      },
      /**
       * 清除图层
       * @param {Boolean} destory -是否清除
       *
       * @memberOf PlotGraphicLayerManager#
       * @returns {PIEPlotGraphicLayer} 返回清除后的图层
       */
      clear: function (destory) {
        return PlotModule._PlotGraphicLayerManager_Clear(this.handle, destory);
      },
      /**
       * 获取当前子图层
       *
       * @memberOf PlotGraphicLayerManager#
       * @returns {PIEPlotSubGraphicLayer} 返回当前子图层
       */
      currentSubGraphicLayer: function () {
        var hSubGraphicLayer = PlotModule._PlotGraphicLayerManager_CurrentSubGraphicLayer(this.handle);
        if (hSubGraphicLayer) {
          return new PIEPlotSubGraphicLayer({
            handle: hSubGraphicLayer
          });
        }
      },
      /**
       * 设置当前子图层
       * @param {PIEPlotSubGraphicLayer} currentSubGraphicLayer -当前子图层
       *
       * @memberOf PlotGraphicLayerManager#
       * @returns {PIEPlotSubGraphicLayer} 返回设置的子图层
       */
      setCurrentSubGraphicLayer: function (currentSubGraphicLayer) {
        return PlotModule._PlotGraphicLayerManager_SetCurrentSubGraphicLayer(this.handle, currentSubGraphicLayer.getHandle());
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 创建标绘演播动画
     * @name SgAction
     * @class SgAction
     * 标绘动画操作函数
     * @param {Object} options -
     * @param {Number} options.code -时序动作编码
     * @param {Number} options.codeExt -时序动作子类型
     */
    function PIESgAction(options) {
      let handle = null;
      let autoRelease = false;
      if (options != null) {
        let actionCode = options.code;
        let actionCodeExt = options.codeExt;
        if (actionCode != undefined && actionCodeExt != undefined) {
          handle = PlotModule._SgAction_Create(actionCode, actionCodeExt);
          if (handle) {
            autoRelease = true;
          }
        }
        if (options.handle != null) {
          handle = options.handle;
          autoRelease = false;
        }
      }
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIESgAction.prototype, {
      getHandle: function () {
        return this.handle;
      },
      /**
       * 释放动画对象
       * @memberOf SgAction#
       */
      dispose: function () {
        if (this.handle && this.autoRelease) {
          PlotModule._SgAction_Delete(this.handle);
          this.handle = null;
          this.autoRelease = false;
        }
      },
      /**
       * 获取动作编码
       * @memberOf SgAction#
       * @returns {Number} 返回时序动作编码
       */
      getActionCode: function () {
        return PlotModule._SgAction_GetActionCode(this.handle);
      },
      /**
       * 获取时序动作子类型
       * @memberOf SgAction#
       * @returns {Number} 返回时序动作子类型
       */
      getActionCodeExt: function () {
        return PlotModule._SgAction_GetActionCodeExt(this.handle);
      },
      /**
       * 获取演播动画开始模式
       * @memberOf SgAction#
       * @returns {PlotActionMode} 返回动画开始模式
       */
      getActionMode: function () {
        return PlotModule._SgAction_GetActionMode(this.handle);
      },
      /**
       * 设置演播动画开始模式
       * @memberOf SgAction#
       * @param {PlotActionMode} mode -动画开始模式
       */
      setActionMode: function (mode) {
        PlotModule._SgAction_SetActionMode(this.handle, mode);
      },
      /**
       * 获取基准时间索引
       * @memberOf SgAction#
       * @returns {Number} 返回基准时间索引
       */
      getBaseDateTimeIndex: function () {
        return PlotModule._SgAction_GetBaseDateTimeIndex(this.handle);
      },
      /**
       * 设置基准时间索引
       * @memberOf SgAction#
       * @param {Number} index -基准时间索引
       */
      setBaseDateTimeIndex: function (index) {
        PlotModule._SgAction_SetBaseDateTimeIndex(this.handle, index);
      },
      /**
       * 获取开始时间
       * @memberOf SgAction#
       * @returns {Number} 返回开始时间
       */
      getStartTime: function () {
        return PlotModule._SgAction_GetStartTime(this.handle);
      },
      /**
       * 设置开始时间
       * @memberOf SgAction#
       * @param {Number} time -开始时间
       */
      setStartTime: function (time) {
        PlotModule._SgAction_SetStartTime(this.handle, time);
      },
      /**
       * 获取结束时间
       * @memberOf SgAction#
       * @returns {Number} 返回结束时间
       */
      getEndTime: function () {
        return PlotModule._SgAction_GetEndTime(this.handle);
      },
      /**
       * 设置结束时间
       * @memberOf SgAction#
       * @param {Number} time -结束时间
       */
      setEndTime: function (time) {
        PlotModule._SgAction_SetEndTime(this.handle, time);
      },
      /**
       * 获取演播动画开始模式
       * @memberOf SgAction#
       * @returns {PlotActionSpeedMode} 返回动画开始模式
       */
      getSpeedMode: function () {
        return PlotModule._SgAction_GetSpeedMode(this.handle);
      },
      /**
       * 设置演播动画速度模式
       * @memberOf SgAction#
       * @param {PlotActionSpeedMode} mode -动画速度模式
       */
      setSpeedMode: function (mode) {
        PlotModule._SgAction_SetSpeedMode(this.handle, mode);
      },
      /**
       * 设置int类型字段值
       * @memberOf SgAction#
       * @param {String} field -字段名
       * @param {Number} value -字段值
       * @returns {Boolean} 返回是否成功
       */
      setInt: function (field, value) {
        let strField = new PIEString(field);
        let res = PlotModule._SgAction_SetInt(this.handle, strField.getHandle(), value);
        strField.dispose();
        return res;
      },
      /**
       * 获取int类型字段值
       * @memberOf SgAction#
       * @param {String} field -字段名
       * @returns {Number} 返回字段值
       */
      getInt: function (field) {
        let strField = new PIEString(field);
        let value = PlotModule._SgAction_GetInt(this.handle, strField.getHandle());
        strField.dispose();
        return value;
      },
      /**
       * 设置double类型字段值
       * @memberOf SgAction#
       * @param {String} field -字段名
       * @param {Number} value -字段值
       * @returns {Boolean} 返回是否成功
       */
      setDouble: function (field, value) {
        let strField = new PIEString(field);
        let res = PlotModule._SgAction_SetDouble(this.handle, strField.getHandle(), value);
        strField.dispose();
        return res;
      },
      /**
       * 获取double类型字段值
       * @memberOf SgAction#
       * @param {String} mode -字段名
       * @returns {Number} 返回字段值
       */
      getDouble: function (field) {
        let strField = new PIEString(field);
        let value = PlotModule._SgAction_GetDouble(this.handle, strField.getHandle());
        strField.dispose();
        return value;
      },
      /**
       * 设置String类型字段值
       * @memberOf SgAction#
       * @param {String} field -字段名
       * @param {String} value -字段值
       * @returns {Boolean} 返回是否成功
       */
      setString: function (field, value) {
        let strField = new PIEString(field);
        let strValue = new PIEString(value);
        let res = PlotModule._SgAction_SetString(this.handle, strField.getHandle(), strValue.getHandle());
        strField.dispose();
        strValue.dispose();
        return res;
      },
      /**
       * 获取String类型字段值
       * @memberOf SgAction#
       * @param {String} mode -字段名
       * @returns {String} 返回字段值
       */
      getString: function (field) {
        let strField = new PIEString(field);
        let strValue = new PIEString(256);
        PlotModule._SgAction_GetString(this.handle, strField.getHandle(), strValue.getHandle());
        let value = strValue.toString();
        strField.dispose();
        strValue.dispose();
        return value;
      },
      /**
       * 设置Color类型字段值
       * @memberOf SgAction#
       * @param {String} field -字段名
       * @param {PIEColor|Array} value -字段值
       * @returns {Boolean} 返回是否成功
       */
      setColor: function (field, value) {
        let strField = new PIEString(field);
        let arrayColor = null;
        if (value instanceof PIEColor) {
          arrayColor = value.toArray();
        } else if (value instanceof Array) {
          arrayColor = value;
        }
        let res = null;
        if (arrayColor) {
          let colorArray = new PIEArray(arrayColor, PIEArrayType.UInt8);
          res = PlotModule._SgAction_SetColor(this.handle, strField.getHandle(), colorArray.getHandle());
          colorArray.dispose();
        }
        strField.dispose();
        return res;
      },
      /**
       * 获取Color类型字段值
       * @memberOf SgAction#
       * @param {String} field -字段名
       * @returns {PIEColor|Array} 返回字段值
       */
      getColor: function (field) {
        let strField = new PIEString(field);
        let arrayColor = new PIEArray(4, PIEArrayType.UInt8);
        PlotModule._SgAction_GetColor(this.handle, strField.getHandle(), arrayColor.getHandle());
        strField.dispose();
        arrayColor.updateData();
        let color = arrayColor.toArray();
        arrayColor.dispose();
        return new PIEColor(color[0], color[1], color[2], color[3]);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 标绘时序动画管理函数
     * @name PlotActionManager
     */
    function PIEPlotActionManager(handle, autoRelease) {
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIEPlotActionManager.prototype, {
      getHandle: function () {
        return this.handle;
      },
      /**
       * 添加动画
       * @param {PIESgAction} action -标绘动画
       *
       * @memberOf PlotActionManager#
       * @returns {Boolean} 返回是否添加成功
       */
      addPlotAction: function (action) {
        return Boolean(PlotModule._PlotActionManager_AddPlotAction(this.handle, action.getHandle()));
      },
      /**
       * 删除动画
       * @param {PIESgAction} action -标绘动画
       *
       * @memberOf PlotActionManager#
       * @returns {Boolean} 返回是否删除成功
       */
      removePlotAction: function (action) {
        return Boolean(PlotModule._PlotActionManager_RemovePlotAction(this.handle, action.getHandle()));
      },
      /**
       * 通过索引删除动画
       * @param {Number} index -标绘动画索引
       *
       * @memberOf PlotActionManager#
       * @returns {PIESgAction} 返回删除的标绘动画对象
       */
      removePlotActionByIndex: function (index) {
        let handle = PlotModule._PlotActionManager_RemovePlotActionByIndex(this.handle, index);
        return new PIESgAction({
          handle: handle
        });
      },
      /**
       * 通过索引获取标绘动画
       * @param {Number} index -标绘动画索引
       *
       * @memberOf PlotActionManager#
       * @returns {PIESgAction} 返回标绘动画对象
       */
      plotAction: function (index) {
        let handle = PlotModule._PlotActionManager_PlotAction(this.handle, index);
        return new PIESgAction({
          handle: handle
        });
      },
      /**
       * 获取标绘动画索引
       * @param {PIESgAction} action -标绘动画
       *
       * @memberOf PlotActionManager#
       * @returns {Number} 返回标绘动画索引
       */
      indexOfPlotAction: function (action) {
        return PlotModule._PlotActionManager_IndexOfPlotAction(this.handle, action.getHandle());
      },
      /**
       * 获取标绘动画个数
       * @memberOf PlotActionManager#
       * @returns {Number} 返回标绘动画个数
       */
      plotActionCount: function () {
        return PlotModule._PlotActionManager_PlotActionCount(this.handle);
      },
      /**
       * 获取所有标绘动画
       * @memberOf PlotActionManager#
       * @returns {Array} 返回标绘动画数组
       */
      plotActions: function () {
        let count = this.plotActionCount();
        let actions = [];
        if (count > 0) {
          let actionArray = new PIEArray(count, PIEArrayType.Int32);
          PlotModule._PlotActionManager_PlotActions(this.handle, actionArray.getHandle());
          actionArray.updateData();
          let hadleArray = actionArray.toArray();
          actionArray.dispose();
          hadleArray.forEach(handle => {
            let action = new PIESgAction({
              handle: handle
            });
            actions.push(action);
          });
        }
        return actions;
      },
      /**
       * 清空标绘动画
       * @param {Boolean} destroy -是否释放标绘动画
       *
       * @memberOf PlotActionManager#
       */
      clearPlotActions: function (destroy) {
        return PlotModule._PlotActionManager_ClearPlotActions(this.handle, destroy);
      },
      /**
       * 清除标绘对象的关联动画
       * @param {PIEPlotEntity} plotEntity -标绘对象
       * @memberOf PlotActionManager#
       */
      removeRelationAction: function (plotEntity) {
        return PlotModule._PlotActionManager_RemoveRelationAction(this.handle, plotEntity.getHandle());
      },
      /**
       * 更新动画总时长
       * @memberOf PlotActionManager#
       */
      updateTotalTimeLength: function () {
        return PlotModule._PlotActionManager_UpdateTotalTimeLength(this.handle);
      },
      /**
       * 获取动画总时长
       * @memberOf PlotActionManager#
       * @returns {Number} 返回总时长
       */
      getTotalTimeLength: function () {
        return PlotModule._PlotActionManager_GetTotalTimeLength(this.handle);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 标绘系统操作函数
     * @name PlotSystem
     * @class PlotSystem
     */
    function PIEPlotSystem(handle, autoRelease) {
      if (!handle) {
        handle = PlotModule._PlotSystem_Create();
        autoRelease = true;
      }
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIEPlotSystem.prototype, {
      /**
       * 注册标绘库路径
       * @param{String} filePath-文件路径
       * @memberOf PlotSystem#
       */
      // registerPlots: function (filePath) {
      //     let strFilePath = new PIEString(filePath);
      //     PlotModule._PlotSystem_RegisterPlots(this.handle, strFilePath.getHandle());
      //     strFilePath.dispose();
      // },

      getHandle: function () {
        return this.handle;
      },
      dispose: function () {
        if (this.handle && this.autoRelease) {
          PlotModule._PlotSystem_Delete(this.handle);
          this.handle = null;
          this.autoRelease = false;
        }
      },
      /**
       * 获取标绘图层管理对象
       * @memberOf PlotSystem#
       * @returns{PIEPlotGraphicLayerManager}  返回标绘图层管理对象
       */
      getPlotGraphicLayerManager: function () {
        let handle = PlotModule._PlotSystem_GetPlotGraphicLayerManager(this.handle);
        return new PIEPlotGraphicLayerManager(handle);
      },
      /**
       * 获取标绘动画管理对象
       * @memberOf PlotSystem#
       * @returns{PIEPlotActionManager}  返回标绘图层管理对象
       */
      getPlotActionManager: function () {
        let handle = PlotModule._PlotSystem_GetPlotActionManager(this.handle);
        return new PIEPlotActionManager(handle);
      },
      /**
       * 通过文件打开标绘图层管理对象
       * @memberOf PlotSystem#
       * @param {String} filePath -文件路径
       * @returns{Boolean}  返回是否成功
       */
      open: function (filePath) {
        let strFile = new PIEString(filePath);
        let res = PlotModule._PlotSystem_Open(this.handle, strFile.getHandle());
        strFile.dispose();
        return res;
      },
      /**
       * 保存标绘图层管理对象
       * @memberOf PlotSystem#
       * @param {String} filePath -文件路径
       * @returns{Boolean}  返回是否成功
       */
      save: function (filePath) {
        let strFile = new PIEString(filePath);
        let res = PlotModule._PlotSystem_Save(this.handle, strFile.getHandle());
        strFile.dispose();
        return res;
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 标绘符号组操作函数
     * @name PlotSymbolGroup
     */
    function PIEPlotSymbolGroup(handle, autoRelease) {
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIEPlotSymbolGroup.prototype, {
      /**
       * 获取符号组名
       * @memberOf PlotSymbolGroup#
       * @returns {String} 返回名称
       */
      getGroupName: function () {
        let strName = new PIEString(256);
        PlotModule._PlotSymbolGroup_GetGroupName(this.handle, strName.getHandle());
        let name = strName.toString();
        strName.dispose();
        return name;
      },
      /**
       * 获取设置标绘的颜色
       * @memberOf PlotSymbolGroup#
       * @returns {PIEColor} 返回线颜色
       */
      childGroupCount: function () {
        return PlotModule._PlotSymbolGroup_ChildGroupCount(this.handle);
      },
      /**
       * 获取子标绘符号组
       * @memberOf PlotSymbolGroup#
       * @returns {Array} 返回标绘符号组数组(PlotSymbolGroup数组)
       */
      childGroups: function () {
        let count = this.childGroupCount();
        let symbolGroups = [];
        if (count > 0) {
          let groupArray = new PIEArray(count, PIEArrayType.Int32);
          PlotModule._PlotSymbolGroup_ChildGroups(this.handle, groupArray.getHandle());
          groupArray.updateData();
          let groups = groupArray.toArray();
          groupArray.dispose();
          groups.forEach(item => {
            let plotSymbolGroup = new PIEPlotSymbolGroup(item);
            symbolGroups.push(plotSymbolGroup);
          });
        }
        return symbolGroups;
      },
      /**
       * 获取组中符号个数
       * @memberOf PlotSymbolGroup#
       * @returns {PIEColor} 返回符号个数
       */
      getSymbolCount: function () {
        return PlotModule._PlotSymbolGroup_GetSymbolCount(this.handle);
      },
      /**
       * 获取组中所有符号
       * @memberOf PlotSymbolGroup#
       * @returns {Array} 返回标绘符号组中所有符号
       */
      getSymbolNodes: function () {
        let count = this.getSymbolCount();
        if (count > 0) {
          // symbolNodes = PlotModule._PlotSymbolGroup_GetSymbolNodes(this.handle);
          return PlotModule['PlotSymbolGroup_GetSymbolNodes'](this.handle);
        }
        return [];
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 标绘符号库
     * @name PlotSymbolLib
     * @interface
     */
    var PIEPlotSymbolLib = function (handle) {
      this.handle = handle;
    };
    var plotSymbolLib = new PIEPlotSymbolLib();
    /**
     *  获取符号库单例
     *  @memberOf PlotSymbolLib
     */
    PIEPlotSymbolLib.getInstance = function () {
      plotSymbolLib.handle = PlotModule._PlotSymbolLib_GetInstance();
      return plotSymbolLib;
    };
    Object.assign(PIEPlotSymbolLib.prototype, {
      getSymbolIconLength: function (groupName, code, symbolType) {
        let strGroupName = new PIEString(groupName);
        let length = PlotModule._PlotSymbolLib_GetSymbolIconLength(this.handle, strGroupName.getHandle(), code, symbolType);
        strGroupName.dispose();
        return length;
      },
      /**
       * 获取标绘符号图标
       * @memberOf PlotSymbolLib#
       * @param{String} groupName-符号组名
       * @param{Number} code-符号
       * @param{PIEPlotSymbolType} symbolType-符号类型
       * @returns {Array} 返回图标二进制流
       */
      getSymbolIcon: function (groupName, code, symbolType) {
        let length = this.getSymbolIconLength(groupName, code, symbolType);
        if (length > 0) {
          let strGroupName = new PIEString(groupName);
          let iconDataArray = new PIEArray(length, PIEArrayType.UInt8);
          PlotModule._PlotSymbolLib_GetSymbolIcon(this.handle, strGroupName.getHandle(), code, symbolType, iconDataArray.getHandle(), length);
          iconDataArray.updateData();
          let iconData = iconDataArray.toArray();
          strGroupName.dispose();
          iconDataArray.dispose();
          return iconData;
        }
        return [];
      },
      /**
       * 获取标绘符号组
       * @memberOf PlotSymbolLib#
       * @returns {PIEPlotSymbolGroup} 返回标绘符号组对象
       */
      getRootGroup: function () {
        let symbolTreeHandle = PlotModule._PlotSymbolLib_GetSymbolTree(this.handle);
        let rootGrouphandle = PlotModule._PlotSymbolTree_GetRootGroup(symbolTreeHandle);
        return new PIEPlotSymbolGroup(rootGrouphandle);
      }
    });

    /**
     * @vuepress
     *
     * ---
     * title: PIE-Earth SDK
     * headline: 标绘模块
     * ---
     */

    /**
     * 创建标绘生长（退缩）动画
     * @name PlotGrowAnimation
     * @class PlotGrowAnimation
     * 标绘子图层操作函数
     * @param {Object} options -
     * @param {PIEPlotEntity} options.plotEntity -标绘实体
     * @param {Boolean} options.isGrow -是否是生长动画 true 生长动画  false 退缩动画
     */
    function PIEPlotGrowAnimation(options) {
      let handle = null;
      let autoRelease = false;
      if (options != null) {
        let plotEntity = options.plotEntity;
        let isGrow = options.isGrow;
        if (plotEntity != null) {
          handle = PlotModule._PlotGrowAnimation_Create(plotEntity.getHandle(), isGrow);
          autoRelease = true;
        }
        if (options.handle != null) {
          handle = options.handle;
          autoRelease = false;
        }
      }
      this.handle = handle;
      this.autoRelease = autoRelease;
    }
    Object.assign(PIEPlotGrowAnimation.prototype, {
      getHandle: function () {
        return this.handle;
      },
      dispose: function () {
        if (this.handle && this.autoRelease) {
          PlotModule._PlotGrowAnimation_Delete(this.handle);
          this.handle = null;
          this.autoRelease = false;
        }
      },
      /**
       * 准备标绘实体几何点集
       * @memberOf PlotGrowAnimation#
       * @param {Number} scale-生长退缩比例
       */
      prepareGrowGeoPoints: function (scale) {
        return PlotModule._PlotGrowAnimation_PrepareGrowGeoPoints(this.handle, scale);
      },
      /**
       * 获取标绘实体生长动画的点集
       * @memberOf PlotGrowAnimation#
       * @param {Number} dt-动画当前时间
       * @param {Number} duration-动画持续时间
       * @returns {Array}  返回生长动画的点集(Vector3数组)
       */
      getGrowPoints: function (dt, duration) {
        let growPoints = [];
        let arrGrowPoints = PlotModule['PlotGrowAnimation_GetGrowPoints'](this.handle, dt, duration);
        if (arrGrowPoints.length > 0) {
          for (let i = 0; i < arrGrowPoints.length; i += 3) {
            let vecPoint = new PIEVector3(arrGrowPoints[i], arrGrowPoints[i + 1], arrGrowPoints[i + 2]);
            growPoints.push(vecPoint);
          }
        }
        return growPoints;
      },
      /**
       * 释放标绘实体几何点集
       * @memberOf PlotGrowAnimation#
       */
      releaseGrowGeoPoints: function () {
        PlotModule._PlotGrowAnimation_ReleaseGrowGeoPoints(this.handle);
      }
    });

    //Core
    const VERSION = '1.0.0';

    exports.Array = PIEArray;
    exports.ArrayType = PIEArrayType;
    exports.Bounds = PIEBounds;
    exports.Color = PIEColor;
    exports.File = PIEFile;
    exports.Math = PIEMath;
    exports.Matrix3 = PIEMatrix3;
    exports.Matrix4 = PIEMatrix4;
    exports.PlotActionManager = PIEPlotActionManager;
    exports.PlotActionMode = PIEPlotActionMode;
    exports.PlotActionSpeedMode = PIEPlotActionSpeedMode;
    exports.PlotAnnoPos = PIEPlotAnnoPos;
    exports.PlotDotDisplayType = PIEPlotDotDisplayType;
    exports.PlotEditMode = PIEPlotEditMode;
    exports.PlotEntity = PIEPlotEntity;
    exports.PlotFillStyle = PIEPlotFillStyle;
    exports.PlotGraphicLayer = PIEPlotGraphicLayer;
    exports.PlotGraphicLayerManager = PIEPlotGraphicLayerManager;
    exports.PlotGrowAnimation = PIEPlotGrowAnimation;
    exports.PlotLADisplayType = PIEPlotLADisplayType;
    exports.PlotLineType = PIEPlotLineType;
    exports.PlotMirrorMode = PIEPlotMirrorMode;
    exports.PlotOutLineDirect = PIEPlotOutLineDirect;
    exports.PlotPath = PIEPlotPath;
    exports.PlotPathType = PIEPlotPathType;
    exports.PlotRenderType = PIEPlotRenderType;
    exports.PlotSubGraphicLayer = PIEPlotSubGraphicLayer;
    exports.PlotSymbolGroup = PIEPlotSymbolGroup;
    exports.PlotSymbolLib = PIEPlotSymbolLib;
    exports.PlotSymbolType = PIEPlotSymbolType;
    exports.PlotSystem = PIEPlotSystem;
    exports.Rect = PIERect;
    exports.SgAction = PIESgAction;
    exports.SgAnnoAttr = PIESgAnnoAttr;
    exports.SgDotDrawAttr = PIESgDotDrawAttr;
    exports.SgDotTDAttr = PIESgDotTDAttr;
    exports.SgDrawAttr = PIESgDrawAttr;
    exports.SgLADrawAttr = PIESgLADrawAttr;
    exports.SgLATDAttr = PIESgLATDAttr;
    exports.SgMediaAttr = PIESgMediaAttr;
    exports.SgTDAttr = PIESgTDAttr;
    exports.Size = PIESize;
    exports.String = PIEString;
    exports.VERSION = VERSION;
    exports.Vector2 = PIEVector2;
    exports.Vector3 = PIEVector3;
    exports.Vector4 = PIEVector4;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=PIEMap.js.map
