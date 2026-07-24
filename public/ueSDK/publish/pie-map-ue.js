(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.UEMap = {}));
})(this, (function (exports) { 'use strict';

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	  }, _typeof(obj);
	}
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
	  }
	}
	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  Object.defineProperty(Constructor, "prototype", {
	    writable: false
	  });
	  return Constructor;
	}
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }
	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  Object.defineProperty(subClass, "prototype", {
	    writable: false
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}
	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}
	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };
	  return _setPrototypeOf(o, p);
	}
	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;
	  try {
	    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}
	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	  return self;
	}
	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  } else if (call !== void 0) {
	    throw new TypeError("Derived constructors may only return object or undefined");
	  }
	  return _assertThisInitialized(self);
	}
	function _createSuper(Derived) {
	  var hasNativeReflectConstruct = _isNativeReflectConstruct();
	  return function _createSuperInternal() {
	    var Super = _getPrototypeOf(Derived),
	      result;
	    if (hasNativeReflectConstruct) {
	      var NewTarget = _getPrototypeOf(this).constructor;
	      result = Reflect.construct(Super, arguments, NewTarget);
	    } else {
	      result = Super.apply(this, arguments);
	    }
	    return _possibleConstructorReturn(this, result);
	  };
	}
	function _toPrimitive(input, hint) {
	  if (typeof input !== "object" || input === null) return input;
	  var prim = input[Symbol.toPrimitive];
	  if (prim !== undefined) {
	    var res = prim.call(input, hint || "default");
	    if (typeof res !== "object") return res;
	    throw new TypeError("@@toPrimitive must return a primitive value.");
	  }
	  return (hint === "string" ? String : Number)(input);
	}
	function _toPropertyKey(arg) {
	  var key = _toPrimitive(arg, "string");
	  return typeof key === "symbol" ? key : String(key);
	}

	//==========================================================================
	// 版权所有，航天宏图信息技术股份有限公司，2023-02
	// 本接口只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播
	// 团队：        PIEMap SDK For UE WebClient Team
	// 文件名：      Config.js
	// 功能：        配置相关定义
	// 修改者：      gongyinliang
	// 审查者：
	// 最后修改时间：
	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 基础模块
	 * ---
	 */

	var Config = {
	  API: {
	    wsUrl: "ws://localhost:8081"
	  },
	  formatURLParam: function formatURLParam(value) {
	    var _value = JSON.stringify(value);
	    _value = encodeURIComponent(_value);
	    _value = _value.replace("%20", " ");
	    return _value;
	  },
	  formatDate: function formatDate(date, fmt) {
	    var o = {
	      "M+": date.getMonth() + 1,
	      //月份
	      "d+": date.getDate(),
	      //日
	      "h+": date.getHours(),
	      //小时
	      "m+": date.getMinutes(),
	      //分
	      "s+": date.getSeconds(),
	      //秒
	      "q+": Math.floor((date.getMonth() + 3) / 3),
	      //季度
	      "S": date.getMilliseconds() //毫秒
	    };

	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	    return fmt;
	  },
	  checkIsString: function checkIsString(data) {
	    return typeof data === "string" && data.constructor === String;
	  },
	  checkIsNumber: function checkIsNumber(data) {
	    return typeof data === "number" && data.constructor === Number;
	  },
	  checkIsArray: function checkIsArray(data) {
	    return _typeof(data) === "object" && data.constructor === Array;
	  },
	  checkIsObject: function checkIsObject(data) {
	    return _typeof(data) === "object" && data.constructor === Object;
	  },
	  checkIsDate: function checkIsDate(data) {
	    return _typeof(data) === "object" && data.constructor === Date;
	  },
	  checkIsBoolean: function checkIsBoolean(data) {
	    return typeof data === "boolean" && data.constructor === Boolean;
	  },
	  checkIsFunction: function checkIsFunction(data) {
	    return typeof data === "function";
	  }
	};

	//==========================================================================
	// 版权所有，航天宏图信息技术股份有限公司，2023-02
	// 本接口只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播
	// 团队：        PIEMap SDK For UE WebClient Team
	// 文件名：      ScreenSpaceEventType.js
	// 功能：        屏幕空间事件类型
	// 修改者：      yangchen
	// 审查者：
	// 最后修改时间：
	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 基础模块
	 * ---
	 */

	/**
	 * 鼠标事件枚举
	 * @readonly
	 * @enum {Number}
	 */
	var ScreenSpaceEventType = {
	  //鼠标左键按下事件
	  SCREENSPACEEVENT_LEFT_DOWN: 1001,
	  //鼠标左键弹起事件
	  SCREENSPACEEVENT_LEFT_UP: 1002,
	  //鼠标左键点击事件
	  SCREENSPACEEVENT_LEFT_CLICK: 1003,
	  //鼠标左键双击事件
	  SCREENSPACEEVENT_LEFT_DOUBLE_CLICK: 1004,
	  //鼠标右键按下事件
	  SCREENSPACEEVENT_RIGHT_DOWN: 1005,
	  //鼠标右键弹起事件
	  SCREENSPACEEVENT_RIGHT_UP: 1006,
	  //鼠标右键点击事件
	  SCREENSPACEEVENT_RIGHT_CLICK: 1007,
	  //鼠标中键按下事件
	  SCREENSPACEEVENT_MIDDLET_DOWN: 1008,
	  //鼠标中键弹起事件
	  SCREENSPACEEVENT_MIDDLE_UP: 1009,
	  //鼠标中键点击事件
	  SCREENSPACEEVENT_MIDDLE_CLICK: 1010,
	  //鼠标移动事件
	  SCREENSPACEEVENT_MOUSE_MOVE: 1011,
	  //鼠标滚轮滚动事件
	  SCREENSPACEEVENT_WHEEL: 1012
	};

	//==========================================================================
	// 版权所有，航天宏图信息技术股份有限公司，2023-02
	// 本接口只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播
	// 团队：        PIEMap SDK For UE WebClient Team
	// 文件名：      CameraEventType.js
	// 功能：        相机事件类型
	// 修改者：      yangchen
	// 审查者：
	// 最后修改时间：
	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 * 相机交互操作枚举
	 * @readonly
	 * @enum {Number}
	 */
	var CameraEventType = {
	  //鼠标左键按住，然后移动鼠标并松开按键
	  CAMERAEVENT_LEFT_DRAG: 2001,
	  //鼠标右键键按住，然后移动鼠标并松开按键
	  CAMERAEVENT_RIGHT_DRAG: 202,
	  //鼠标中键键键按住，然后移动鼠标并松开按键
	  CAMERAEVENT_MIDDLE_DRAG: 203,
	  //滚动鼠标中键滚轮
	  CAMERAEVENT_WHEEL: 2004,
	  //双指触控屏幕
	  CAMERAEVENT_PINCH: 2005
	};

	//==========================================================================
	// 版权所有，航天宏图信息技术股份有限公司，2023-02
	// 本接口只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播
	// 团队：        PIEMap SDK For UE WebClient Team
	// 文件名：      DefaultValue.js
	// 功能：        默认值定义
	// 修改者：      gongyinliang
	// 审查者：
	// 最后修改时间：
	//==========================================================================

	/**
	 * 如果未定义，则返回第一个参数，否则返回第二个参数
	 *
	 * @name DefaultValue
	 * @class DefaultValue
	 *
	 * @param {*} a -第一个参数
	 * @param {*} b -第二个参数
	 *
	 * @returns {*} 如果未定义，则返回第一个参数，否则返回第二个参数
	 *
	 * @example
	 * param = UEMap.DefaultValue(param, 'default');
	 */
	function DefaultValue(a, b) {
	  if (a !== undefined && a !== null) {
	    return a;
	  }
	  return b;
	}

	/**
	 * 一个冻结的空对象，可用作传递的选项的默认值
	 *
	 * @memberof DefaultValue
	 */
	DefaultValue.EMPTY_OBJECT = Object.freeze({});

	//==========================================================================

	/**
	 * 2D笛卡尔点
	 * @name Cartesian2
	 * @class Cartesian2
	 *
	 * @param {Number} x  -X分量
	 * @param {Number} y  -Y分量
	 *
	 */
	function Cartesian2(x, y) {
	  this.x = DefaultValue(x, 0.0);
	  this.y = DefaultValue(y, 0.0);
	}

	/**
	 * 创建一个以（x，y）格式表示此笛卡尔坐标的字符串
	 *
	 * @memberOf Cartesian2
	 * @returns {String}  返回（x，y）格式的字符串
	 */
	Cartesian2.prototype.toString = function () {
	  return "(".concat(this.x, ", ").concat(this.y, ")");
	};

	//==========================================================================
	// 版权所有，航天宏图信息技术股份有限公司，2023-02
	// 本接口只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播
	// 团队：        PIEMap SDK For UE WebClient Team
	// 文件名：      Defined.js
	// 功能：        Defined
	// 修改者：      gongyinliang
	// 审查者：
	// 最后修改时间：
	//==========================================================================

	/**
	 * 定义
	 * @name Defined
	 * @class Defined
	 *
	 * @param {*} value  -对象
	 *
	 * @example
	 * if (UEMap.defined(positions)) {
	 *      doSomething();
	 * } else {
	 *      doSomethingElse();
	 * }
	 */
	function Defined(value) {
	  return value !== undefined && value !== null;
	}

	//==========================================================================

	/**
	 * 构造由于开发人员错误（例如，无效参数）而引发的异常对象，仅在开发过程中抛出此异常；它通常表示调用代码中的错误
	 *
	 * @name DeveloperError
	 * @class DeveloperError
	 * @extends Error
	 *
	 * @param {String} message  -此异常的错误消息
	 *
	 */
	function DeveloperError(message) {
	  this.name = "DeveloperError";
	  this.message = message;

	  //Browsers such as IE don't have a stack property until you actually throw the error.
	  var stack;
	  try {
	    throw new Error();
	  } catch (e) {
	    stack = e.stack;
	  }
	  this.stack = stack;
	}
	if (Defined(Object.create)) {
	  DeveloperError.prototype = Object.create(Error.prototype);
	  DeveloperError.prototype.constructor = DeveloperError;
	}
	DeveloperError.prototype.toString = function () {
	  var str = "".concat(this.name, ": ").concat(this.message);
	  if (Defined(this.stack)) {
	    str += "\n".concat(this.stack.toString());
	  }
	  return str;
	};

	/**
	 * @private
	 */
	DeveloperError.throwInstantiationError = function () {
	  throw new DeveloperError("This function defines an interface and should not be called directly.");
	};

	/**
	 * Contains functions for checking that supplied arguments are of a specified type
	 * or meet specified conditions
	 * @private
	 */
	var Check = {};

	/**
	 * Contains type checking functions, all using the typeof operator
	 */
	Check.typeOf = {};
	function getUndefinedErrorMessage(name) {
	  return "".concat(name, " is required, actual value was undefined");
	}
	function getFailedTypeErrorMessage(actual, expected, name) {
	  return "Expected ".concat(name, " to be typeof ").concat(expected, ", actual typeof was ").concat(actual);
	}

	/**
	 * Throws if test is not defined
	 *
	 * @param {String} name The name of the variable being tested
	 * @param {*} test The value that is to be checked
	 * @exception {DeveloperError} test must be defined
	 */
	Check.defined = function (name, test) {
	  if (!Defined(test)) {
	    throw new DeveloperError(getUndefinedErrorMessage(name));
	  }
	};

	/**
	 * Throws if test is not typeof 'function'
	 *
	 * @param {String} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'function'
	 */
	Check.typeOf.func = function (name, test) {
	  if (typeof test !== "function") {
	    throw new DeveloperError(getFailedTypeErrorMessage(_typeof(test), "function", name));
	  }
	};

	/**
	 * Throws if test is not typeof 'string'
	 *
	 * @param {String} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'string'
	 */
	Check.typeOf.string = function (name, test) {
	  if (typeof test !== "string") {
	    throw new DeveloperError(getFailedTypeErrorMessage(_typeof(test), "string", name));
	  }
	};

	/**
	 * Throws if test is not typeof 'number'
	 *
	 * @param {String} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'number'
	 */
	Check.typeOf.number = function (name, test) {
	  if (typeof test !== "number") {
	    throw new DeveloperError(getFailedTypeErrorMessage(_typeof(test), "number", name));
	  }
	};

	/**
	 * Throws if test is not typeof 'number' and less than limit
	 *
	 * @param {String} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @param {Number} limit The limit value to compare against
	 * @exception {DeveloperError} test must be typeof 'number' and less than limit
	 */
	Check.typeOf.number.lessThan = function (name, test, limit) {
	  Check.typeOf.number(name, test);
	  if (test >= limit) {
	    throw new DeveloperError("Expected ".concat(name, " to be less than ").concat(limit, ", actual value was ").concat(test));
	  }
	};

	/**
	 * Throws if test is not typeof 'number' and less than or equal to limit
	 *
	 * @param {String} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @param {Number} limit The limit value to compare against
	 * @exception {DeveloperError} test must be typeof 'number' and less than or equal to limit
	 */
	Check.typeOf.number.lessThanOrEquals = function (name, test, limit) {
	  Check.typeOf.number(name, test);
	  if (test > limit) {
	    throw new DeveloperError("Expected ".concat(name, " to be less than or equal to ").concat(limit, ", actual value was ").concat(test));
	  }
	};

	/**
	 * Throws if test is not typeof 'number' and greater than limit
	 *
	 * @param {String} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @param {Number} limit The limit value to compare against
	 * @exception {DeveloperError} test must be typeof 'number' and greater than limit
	 */
	Check.typeOf.number.greaterThan = function (name, test, limit) {
	  Check.typeOf.number(name, test);
	  if (test <= limit) {
	    throw new DeveloperError("Expected ".concat(name, " to be greater than ").concat(limit, ", actual value was ").concat(test));
	  }
	};

	/**
	 * Throws if test is not typeof 'number' and greater than or equal to limit
	 *
	 * @param {String} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @param {Number} limit The limit value to compare against
	 * @exception {DeveloperError} test must be typeof 'number' and greater than or equal to limit
	 */
	Check.typeOf.number.greaterThanOrEquals = function (name, test, limit) {
	  Check.typeOf.number(name, test);
	  if (test < limit) {
	    throw new DeveloperError("Expected ".concat(name, " to be greater than or equal to ").concat(limit, ", actual value was ").concat(test));
	  }
	};

	/**
	 * Throws if test is not typeof 'object'
	 *
	 * @param {String} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'object'
	 */
	Check.typeOf.object = function (name, test) {
	  if (_typeof(test) !== "object") {
	    throw new DeveloperError(getFailedTypeErrorMessage(_typeof(test), "object", name));
	  }
	};

	/**
	 * Throws if test is not typeof 'boolean'
	 *
	 * @param {String} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'boolean'
	 */
	Check.typeOf.bool = function (name, test) {
	  if (typeof test !== "boolean") {
	    throw new DeveloperError(getFailedTypeErrorMessage(_typeof(test), "boolean", name));
	  }
	};

	/**
	 * Throws if test is not typeof 'bigint'
	 *
	 * @param {String} name The name of the variable being tested
	 * @param {*} test The value to test
	 * @exception {DeveloperError} test must be typeof 'bigint'
	 */
	Check.typeOf.bigint = function (name, test) {
	  if (typeof test !== "bigint") {
	    throw new DeveloperError(getFailedTypeErrorMessage(_typeof(test), "bigint", name));
	  }
	};

	/**
	 * Throws if test1 and test2 is not typeof 'number' and not equal in value
	 *
	 * @param {String} name1 The name of the first variable being tested
	 * @param {String} name2 The name of the second variable being tested against
	 * @param {*} test1 The value to test
	 * @param {*} test2 The value to test against
	 * @exception {DeveloperError} test1 and test2 should be type of 'number' and be equal in value
	 */
	Check.typeOf.number.equals = function (name1, name2, test1, test2) {
	  Check.typeOf.number(name1, test1);
	  Check.typeOf.number(name2, test2);
	  if (test1 !== test2) {
	    throw new DeveloperError("".concat(name1, " must be equal to ").concat(name2, ", the actual values are ").concat(test1, " and ").concat(test2));
	  }
	};

	//==========================================================================

	/**
	 * Math functions.
	 *
	 * @exports EngineMath
	 * @alias Math
	 */
	var EngineMath = {};

	/**
	 * 0.1
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON1 = 0.1;

	/**
	 * 0.01
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON2 = 0.01;

	/**
	 * 0.001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON3 = 0.001;

	/**
	 * 0.0001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON4 = 0.0001;

	/**
	 * 0.00001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON5 = 0.00001;

	/**
	 * 0.000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON6 = 0.000001;

	/**
	 * 0.0000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON7 = 0.0000001;

	/**
	 * 0.00000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON8 = 0.00000001;

	/**
	 * 0.000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON9 = 0.000000001;

	/**
	 * 0.0000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON10 = 0.0000000001;

	/**
	 * 0.00000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON11 = 0.00000000001;

	/**
	 * 0.000000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON12 = 0.000000000001;

	/**
	 * 0.0000000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON13 = 0.0000000000001;

	/**
	 * 0.00000000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON14 = 0.00000000000001;

	/**
	 * 0.000000000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON15 = 0.000000000000001;

	/**
	 * 0.0000000000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON16 = 0.0000000000000001;

	/**
	 * 0.00000000000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON17 = 0.00000000000000001;

	/**
	 * 0.000000000000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON18 = 0.000000000000000001;

	/**
	 * 0.0000000000000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON19 = 0.0000000000000000001;

	/**
	 * 0.00000000000000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON20 = 0.00000000000000000001;

	/**
	 * 0.000000000000000000001
	 * @type {Number}
	 * @constant
	 */
	EngineMath.EPSILON21 = 0.000000000000000000001;

	/**
	 * The gravitational parameter of the Earth in meters cubed
	 * per second squared as defined by the WGS84 model: 3.986004418e14
	 * @type {Number}
	 * @constant
	 */
	EngineMath.GRAVITATIONALPARAMETER = 3.986004418e14;

	/**
	 * Radius of the sun in meters: 6.955e8
	 * @type {Number}
	 * @constant
	 */
	EngineMath.SOLAR_RADIUS = 6.955e8;

	/**
	 * The mean radius of the moon, according to the "Report of the IAU/IAG Working Group on
	 * Cartographic Coordinates and Rotational Elements of the Planets and satellites: 2000",
	 * Celestial Mechanics 82: 83-110, 2002.
	 * @type {Number}
	 * @constant
	 */
	EngineMath.LUNAR_RADIUS = 1737400.0;

	/**
	 * 64 * 1024
	 * @type {Number}
	 * @constant
	 */
	EngineMath.SIXTY_FOUR_KILOBYTES = 64 * 1024;

	/**
	 * 4 * 1024 * 1024 * 1024
	 * @type {Number}
	 * @constant
	 */
	EngineMath.FOUR_GIGABYTES = 4 * 1024 * 1024 * 1024;

	/**
	 * Returns the sign of the value; 1 if the value is positive, -1 if the value is
	 * negative, or 0 if the value is 0.
	 *
	 * @function
	 * @param {Number} value The value to return the sign of.
	 * @returns {Number} The sign of value.
	 */
	// eslint-disable-next-line es/no-math-sign
	EngineMath.sign = DefaultValue(Math.sign, function sign(value) {
	  value = +value; // coerce to number
	  if (value === 0 || value !== value) {
	    // zero or NaN
	    return value;
	  }
	  return value > 0 ? 1 : -1;
	});

	/**
	 * Returns 1.0 if the given value is positive or zero, and -1.0 if it is negative.
	 * This is similar to {@link EngineMath#sign} except that returns 1.0 instead of
	 * 0.0 when the input value is 0.0.
	 * @param {Number} value The value to return the sign of.
	 * @returns {Number} The sign of value.
	 */
	EngineMath.signNotZero = function (value) {
	  return value < 0.0 ? -1.0 : 1.0;
	};

	/**
	 * Converts a scalar value in the range [-1.0, 1.0] to a SNORM in the range [0, rangeMaximum]
	 * @param {Number} value The scalar value in the range [-1.0, 1.0]
	 * @param {Number} [rangeMaximum=255] The maximum value in the mapped range, 255 by default.
	 * @returns {Number} A SNORM value, where 0 maps to -1.0 and rangeMaximum maps to 1.0.
	 *
	 * @see EngineMath.fromSNorm
	 */
	EngineMath.toSNorm = function (value, rangeMaximum) {
	  rangeMaximum = DefaultValue(rangeMaximum, 255);
	  return Math.round((EngineMath.clamp(value, -1.0, 1.0) * 0.5 + 0.5) * rangeMaximum);
	};

	/**
	 * Converts a SNORM value in the range [0, rangeMaximum] to a scalar in the range [-1.0, 1.0].
	 * @param {Number} value SNORM value in the range [0, rangeMaximum]
	 * @param {Number} [rangeMaximum=255] The maximum value in the SNORM range, 255 by default.
	 * @returns {Number} Scalar in the range [-1.0, 1.0].
	 *
	 * @see EngineMath.toSNorm
	 */
	EngineMath.fromSNorm = function (value, rangeMaximum) {
	  rangeMaximum = DefaultValue(rangeMaximum, 255);
	  return EngineMath.clamp(value, 0.0, rangeMaximum) / rangeMaximum * 2.0 - 1.0;
	};

	/**
	 * Converts a scalar value in the range [rangeMinimum, rangeMaximum] to a scalar in the range [0.0, 1.0]
	 * @param {Number} value The scalar value in the range [rangeMinimum, rangeMaximum]
	 * @param {Number} rangeMinimum The minimum value in the mapped range.
	 * @param {Number} rangeMaximum The maximum value in the mapped range.
	 * @returns {Number} A scalar value, where rangeMinimum maps to 0.0 and rangeMaximum maps to 1.0.
	 */
	EngineMath.normalize = function (value, rangeMinimum, rangeMaximum) {
	  rangeMaximum = Math.max(rangeMaximum - rangeMinimum, 0.0);
	  return rangeMaximum === 0.0 ? 0.0 : EngineMath.clamp((value - rangeMinimum) / rangeMaximum, 0.0, 1.0);
	};

	/**
	 * Returns the hyperbolic sine of a number.
	 * The hyperbolic sine of <em>value</em> is defined to be
	 * (<em>e<sup>x</sup>&nbsp;-&nbsp;e<sup>-x</sup></em>)/2.0
	 * where <i>e</i> is Euler's number, approximately 2.71828183.
	 *
	 * <p>Special cases:
	 *   <ul>
	 *     <li>If the argument is NaN, then the result is NaN.</li>
	 *
	 *     <li>If the argument is infinite, then the result is an infinity
	 *     with the same sign as the argument.</li>
	 *
	 *     <li>If the argument is zero, then the result is a zero with the
	 *     same sign as the argument.</li>
	 *   </ul>
	 *</p>
	 *
	 * @function
	 * @param {Number} value The number whose hyperbolic sine is to be returned.
	 * @returns {Number} The hyperbolic sine of <code>value</code>.
	 */
	// eslint-disable-next-line es/no-math-sinh
	EngineMath.sinh = DefaultValue(Math.sinh, function sinh(value) {
	  return (Math.exp(value) - Math.exp(-value)) / 2.0;
	});

	/**
	 * Returns the hyperbolic cosine of a number.
	 * The hyperbolic cosine of <strong>value</strong> is defined to be
	 * (<em>e<sup>x</sup>&nbsp;+&nbsp;e<sup>-x</sup></em>)/2.0
	 * where <i>e</i> is Euler's number, approximately 2.71828183.
	 *
	 * <p>Special cases:
	 *   <ul>
	 *     <li>If the argument is NaN, then the result is NaN.</li>
	 *
	 *     <li>If the argument is infinite, then the result is positive infinity.</li>
	 *
	 *     <li>If the argument is zero, then the result is 1.0.</li>
	 *   </ul>
	 *</p>
	 *
	 * @function
	 * @param {Number} value The number whose hyperbolic cosine is to be returned.
	 * @returns {Number} The hyperbolic cosine of <code>value</code>.
	 */
	// eslint-disable-next-line es/no-math-cosh
	EngineMath.cosh = DefaultValue(Math.cosh, function cosh(value) {
	  return (Math.exp(value) + Math.exp(-value)) / 2.0;
	});

	/**
	 * Computes the linear interpolation of two values.
	 *
	 * @param {Number} p The start value to interpolate.
	 * @param {Number} q The end value to interpolate.
	 * @param {Number} time The time of interpolation generally in the range <code>[0.0, 1.0]</code>.
	 * @returns {Number} The linearly interpolated value.
	 *
	 * @example
	 * const n = Cesium.Math.lerp(0.0, 2.0, 0.5); // returns 1.0
	 */
	EngineMath.lerp = function (p, q, time) {
	  return (1.0 - time) * p + time * q;
	};

	/**
	 * pi
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.PI = Math.PI;

	/**
	 * 1/pi
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.ONE_OVER_PI = 1.0 / Math.PI;

	/**
	 * pi/2
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.PI_OVER_TWO = Math.PI / 2.0;

	/**
	 * pi/3
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.PI_OVER_THREE = Math.PI / 3.0;

	/**
	 * pi/4
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.PI_OVER_FOUR = Math.PI / 4.0;

	/**
	 * pi/6
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.PI_OVER_SIX = Math.PI / 6.0;

	/**
	 * 3pi/2
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.THREE_PI_OVER_TWO = 3.0 * Math.PI / 2.0;

	/**
	 * 2pi
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.TWO_PI = 2.0 * Math.PI;

	/**
	 * 1/2pi
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.ONE_OVER_TWO_PI = 1.0 / (2.0 * Math.PI);

	/**
	 * The number of radians in a degree.
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.RADIANS_PER_DEGREE = Math.PI / 180.0;

	/**
	 * The number of degrees in a radian.
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.DEGREES_PER_RADIAN = 180.0 / Math.PI;

	/**
	 * The number of radians in an arc second.
	 *
	 * @type {Number}
	 * @constant
	 */
	EngineMath.RADIANS_PER_ARCSECOND = EngineMath.RADIANS_PER_DEGREE / 3600.0;

	/**
	 * Converts degrees to radians.
	 * @param {Number} degrees The angle to convert in degrees.
	 * @returns {Number} The corresponding angle in radians.
	 */
	EngineMath.toRadians = function (degrees) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(degrees)) {
	    throw new DeveloperError("degrees is required.");
	  }
	  //>>includeEnd('debug');
	  return degrees * EngineMath.RADIANS_PER_DEGREE;
	};

	/**
	 * Converts radians to degrees.
	 * @param {Number} radians The angle to convert in radians.
	 * @returns {Number} The corresponding angle in degrees.
	 */
	EngineMath.toDegrees = function (radians) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(radians)) {
	    throw new DeveloperError("radians is required.");
	  }
	  //>>includeEnd('debug');
	  return radians * EngineMath.DEGREES_PER_RADIAN;
	};

	/**
	 * Converts a longitude value, in radians, to the range [<code>-Math.PI</code>, <code>Math.PI</code>).
	 *
	 * @param {Number} angle The longitude value, in radians, to convert to the range [<code>-Math.PI</code>, <code>Math.PI</code>).
	 * @returns {Number} The equivalent longitude value in the range [<code>-Math.PI</code>, <code>Math.PI</code>).
	 *
	 * @example
	 * // Convert 270 degrees to -90 degrees longitude
	 * const longitude = Cesium.Math.convertLongitudeRange(Cesium.Math.toRadians(270.0));
	 */
	EngineMath.convertLongitudeRange = function (angle) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(angle)) {
	    throw new DeveloperError("angle is required.");
	  }
	  //>>includeEnd('debug');
	  var twoPi = EngineMath.TWO_PI;
	  var simplified = angle - Math.floor(angle / twoPi) * twoPi;
	  if (simplified < -Math.PI) {
	    return simplified + twoPi;
	  }
	  if (simplified >= Math.PI) {
	    return simplified - twoPi;
	  }
	  return simplified;
	};

	/**
	 * Convenience function that clamps a latitude value, in radians, to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
	 * Useful for sanitizing data before use in objects requiring correct range.
	 *
	 * @param {Number} angle The latitude value, in radians, to clamp to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
	 * @returns {Number} The latitude value clamped to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
	 *
	 * @example
	 * // Clamp 108 degrees latitude to 90 degrees latitude
	 * const latitude = Cesium.Math.clampToLatitudeRange(Cesium.Math.toRadians(108.0));
	 */
	EngineMath.clampToLatitudeRange = function (angle) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(angle)) {
	    throw new DeveloperError("angle is required.");
	  }
	  //>>includeEnd('debug');

	  return EngineMath.clamp(angle, -1 * EngineMath.PI_OVER_TWO, EngineMath.PI_OVER_TWO);
	};

	/**
	 * Produces an angle in the range -Pi <= angle <= Pi which is equivalent to the provided angle.
	 *
	 * @param {Number} angle in radians
	 * @returns {Number} The angle in the range [<code>-EngineMath.PI</code>, <code>EngineMath.PI</code>].
	 */
	EngineMath.negativePiToPi = function (angle) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(angle)) {
	    throw new DeveloperError("angle is required.");
	  }
	  //>>includeEnd('debug');
	  if (angle >= -EngineMath.PI && angle <= EngineMath.PI) {
	    // Early exit if the input is already inside the range. This avoids
	    // unnecessary math which could introduce floating point error.
	    return angle;
	  }
	  return EngineMath.zeroToTwoPi(angle + EngineMath.PI) - EngineMath.PI;
	};

	/**
	 * Produces an angle in the range 0 <= angle <= 2Pi which is equivalent to the provided angle.
	 *
	 * @param {Number} angle in radians
	 * @returns {Number} The angle in the range [0, <code>EngineMath.TWO_PI</code>].
	 */
	EngineMath.zeroToTwoPi = function (angle) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(angle)) {
	    throw new DeveloperError("angle is required.");
	  }
	  //>>includeEnd('debug');
	  if (angle >= 0 && angle <= EngineMath.TWO_PI) {
	    // Early exit if the input is already inside the range. This avoids
	    // unnecessary math which could introduce floating point error.
	    return angle;
	  }
	  var mod = EngineMath.mod(angle, EngineMath.TWO_PI);
	  if (Math.abs(mod) < EngineMath.EPSILON14 && Math.abs(angle) > EngineMath.EPSILON14) {
	    return EngineMath.TWO_PI;
	  }
	  return mod;
	};

	/**
	 * The modulo operation that also works for negative dividends.
	 *
	 * @param {Number} m The dividend.
	 * @param {Number} n The divisor.
	 * @returns {Number} The remainder.
	 */
	EngineMath.mod = function (m, n) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(m)) {
	    throw new DeveloperError("m is required.");
	  }
	  if (!Defined(n)) {
	    throw new DeveloperError("n is required.");
	  }
	  if (n === 0.0) {
	    throw new DeveloperError("divisor cannot be 0.");
	  }
	  //>>includeEnd('debug');
	  if (EngineMath.sign(m) === EngineMath.sign(n) && Math.abs(m) < Math.abs(n)) {
	    // Early exit if the input does not need to be modded. This avoids
	    // unnecessary math which could introduce floating point error.
	    return m;
	  }
	  return (m % n + n) % n;
	};

	/**
	 * Determines if two values are equal using an absolute or relative tolerance test. This is useful
	 * to avoid problems due to roundoff error when comparing floating-point values directly. The values are
	 * first compared using an absolute tolerance test. If that fails, a relative tolerance test is performed.
	 * Use this test if you are unsure of the magnitudes of left and right.
	 *
	 * @param {Number} left The first value to compare.
	 * @param {Number} right The other value to compare.
	 * @param {Number} [relativeEpsilon=0] The maximum inclusive delta between <code>left</code> and <code>right</code> for the relative tolerance test.
	 * @param {Number} [absoluteEpsilon=relativeEpsilon] The maximum inclusive delta between <code>left</code> and <code>right</code> for the absolute tolerance test.
	 * @returns {Boolean} <code>true</code> if the values are equal within the epsilon; otherwise, <code>false</code>.
	 *
	 * @example
	 * const a = Cesium.Math.equalsEpsilon(0.0, 0.01, Cesium.Math.EPSILON2); // true
	 * const b = Cesium.Math.equalsEpsilon(0.0, 0.1, Cesium.Math.EPSILON2);  // false
	 * const c = Cesium.Math.equalsEpsilon(3699175.1634344, 3699175.2, Cesium.Math.EPSILON7); // true
	 * const d = Cesium.Math.equalsEpsilon(3699175.1634344, 3699175.2, Cesium.Math.EPSILON9); // false
	 */
	EngineMath.equalsEpsilon = function (left, right, relativeEpsilon, absoluteEpsilon) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(left)) {
	    throw new DeveloperError("left is required.");
	  }
	  if (!Defined(right)) {
	    throw new DeveloperError("right is required.");
	  }
	  //>>includeEnd('debug');

	  relativeEpsilon = DefaultValue(relativeEpsilon, 0.0);
	  absoluteEpsilon = DefaultValue(absoluteEpsilon, relativeEpsilon);
	  var absDiff = Math.abs(left - right);
	  return absDiff <= absoluteEpsilon || absDiff <= relativeEpsilon * Math.max(Math.abs(left), Math.abs(right));
	};

	/**
	 * Determines if the left value is less than the right value. If the two values are within
	 * <code>absoluteEpsilon</code> of each other, they are considered equal and this function returns false.
	 *
	 * @param {Number} left The first number to compare.
	 * @param {Number} right The second number to compare.
	 * @param {Number} absoluteEpsilon The absolute epsilon to use in comparison.
	 * @returns {Boolean} <code>true</code> if <code>left</code> is less than <code>right</code> by more than
	 *          <code>absoluteEpsilon<code>. <code>false</code> if <code>left</code> is greater or if the two
	 *          values are nearly equal.
	 */
	EngineMath.lessThan = function (left, right, absoluteEpsilon) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(left)) {
	    throw new DeveloperError("first is required.");
	  }
	  if (!Defined(right)) {
	    throw new DeveloperError("second is required.");
	  }
	  if (!defined(absoluteEpsilon)) {
	    throw new DeveloperError("absoluteEpsilon is required.");
	  }
	  //>>includeEnd('debug');
	  return left - right < -absoluteEpsilon;
	};

	/**
	 * Determines if the left value is less than or equal to the right value. If the two values are within
	 * <code>absoluteEpsilon</code> of each other, they are considered equal and this function returns true.
	 *
	 * @param {Number} left The first number to compare.
	 * @param {Number} right The second number to compare.
	 * @param {Number} absoluteEpsilon The absolute epsilon to use in comparison.
	 * @returns {Boolean} <code>true</code> if <code>left</code> is less than <code>right</code> or if the
	 *          the values are nearly equal.
	 */
	EngineMath.lessThanOrEquals = function (left, right, absoluteEpsilon) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(left)) {
	    throw new DeveloperError("first is required.");
	  }
	  if (!Defined(right)) {
	    throw new DeveloperError("second is required.");
	  }
	  if (!Defined(absoluteEpsilon)) {
	    throw new DeveloperError("absoluteEpsilon is required.");
	  }
	  //>>includeEnd('debug');
	  return left - right < absoluteEpsilon;
	};

	/**
	 * Determines if the left value is greater the right value. If the two values are within
	 * <code>absoluteEpsilon</code> of each other, they are considered equal and this function returns false.
	 *
	 * @param {Number} left The first number to compare.
	 * @param {Number} right The second number to compare.
	 * @param {Number} absoluteEpsilon The absolute epsilon to use in comparison.
	 * @returns {Boolean} <code>true</code> if <code>left</code> is greater than <code>right</code> by more than
	 *          <code>absoluteEpsilon<code>. <code>false</code> if <code>left</code> is less or if the two
	 *          values are nearly equal.
	 */
	EngineMath.greaterThan = function (left, right, absoluteEpsilon) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(left)) {
	    throw new DeveloperError("first is required.");
	  }
	  if (!Defined(right)) {
	    throw new DeveloperError("second is required.");
	  }
	  if (!Defined(absoluteEpsilon)) {
	    throw new DeveloperError("absoluteEpsilon is required.");
	  }
	  //>>includeEnd('debug');
	  return left - right > absoluteEpsilon;
	};

	/**
	 * Determines if the left value is greater than or equal to the right value. If the two values are within
	 * <code>absoluteEpsilon</code> of each other, they are considered equal and this function returns true.
	 *
	 * @param {Number} left The first number to compare.
	 * @param {Number} right The second number to compare.
	 * @param {Number} absoluteEpsilon The absolute epsilon to use in comparison.
	 * @returns {Boolean} <code>true</code> if <code>left</code> is greater than <code>right</code> or if the
	 *          the values are nearly equal.
	 */
	EngineMath.greaterThanOrEquals = function (left, right, absoluteEpsilon) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(left)) {
	    throw new DeveloperError("first is required.");
	  }
	  if (!Defined(right)) {
	    throw new DeveloperError("second is required.");
	  }
	  if (!Defined(absoluteEpsilon)) {
	    throw new DeveloperError("absoluteEpsilon is required.");
	  }
	  //>>includeEnd('debug');
	  return left - right > -absoluteEpsilon;
	};
	var factorials = [1];

	/**
	 * Computes the factorial of the provided number.
	 *
	 * @param {Number} n The number whose factorial is to be computed.
	 * @returns {Number} The factorial of the provided number or undefined if the number is less than 0.
	 *
	 * @exception {DeveloperError} A number greater than or equal to 0 is required.
	 *
	 *
	 * @example
	 * //Compute 7!, which is equal to 5040
	 * const computedFactorial = Cesium.Math.factorial(7);
	 *
	 * @see {@link http://en.wikipedia.org/wiki/Factorial|Factorial on Wikipedia}
	 */
	EngineMath.factorial = function (n) {
	  //>>includeStart('debug', pragmas.debug);
	  if (typeof n !== "number" || n < 0) {
	    throw new DeveloperError("A number greater than or equal to 0 is required.");
	  }
	  //>>includeEnd('debug');

	  var length = factorials.length;
	  if (n >= length) {
	    var sum = factorials[length - 1];
	    for (var i = length; i <= n; i++) {
	      var next = sum * i;
	      factorials.push(next);
	      sum = next;
	    }
	  }
	  return factorials[n];
	};

	/**
	 * Increments a number with a wrapping to a minimum value if the number exceeds the maximum value.
	 *
	 * @param {Number} [n] The number to be incremented.
	 * @param {Number} [maximumValue] The maximum incremented value before rolling over to the minimum value.
	 * @param {Number} [minimumValue=0.0] The number reset to after the maximum value has been exceeded.
	 * @returns {Number} The incremented number.
	 *
	 * @exception {DeveloperError} Maximum value must be greater than minimum value.
	 *
	 * @example
	 * const n = Cesium.Math.incrementWrap(5, 10, 0); // returns 6
	 * const m = Cesium.Math.incrementWrap(10, 10, 0); // returns 0
	 */
	EngineMath.incrementWrap = function (n, maximumValue, minimumValue) {
	  minimumValue = DefaultValue(minimumValue, 0.0);

	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(n)) {
	    throw new DeveloperError("n is required.");
	  }
	  if (maximumValue <= minimumValue) {
	    throw new DeveloperError("maximumValue must be greater than minimumValue.");
	  }
	  //>>includeEnd('debug');

	  ++n;
	  if (n > maximumValue) {
	    n = minimumValue;
	  }
	  return n;
	};

	/**
	 * Determines if a non-negative integer is a power of two.
	 * The maximum allowed input is (2^32)-1 due to 32-bit bitwise operator limitation in Javascript.
	 *
	 * @param {Number} n The integer to test in the range [0, (2^32)-1].
	 * @returns {Boolean} <code>true</code> if the number if a power of two; otherwise, <code>false</code>.
	 *
	 * @exception {DeveloperError} A number between 0 and (2^32)-1 is required.
	 *
	 * @example
	 * const t = Cesium.Math.isPowerOfTwo(16); // true
	 * const f = Cesium.Math.isPowerOfTwo(20); // false
	 */
	EngineMath.isPowerOfTwo = function (n) {
	  //>>includeStart('debug', pragmas.debug);
	  if (typeof n !== "number" || n < 0 || n > 4294967295) {
	    throw new DeveloperError("A number between 0 and (2^32)-1 is required.");
	  }
	  //>>includeEnd('debug');

	  return n !== 0 && (n & n - 1) === 0;
	};

	/**
	 * Computes the next power-of-two integer greater than or equal to the provided non-negative integer.
	 * The maximum allowed input is 2^31 due to 32-bit bitwise operator limitation in Javascript.
	 *
	 * @param {Number} n The integer to test in the range [0, 2^31].
	 * @returns {Number} The next power-of-two integer.
	 *
	 * @exception {DeveloperError} A number between 0 and 2^31 is required.
	 *
	 * @example
	 * const n = Cesium.Math.nextPowerOfTwo(29); // 32
	 * const m = Cesium.Math.nextPowerOfTwo(32); // 32
	 */
	EngineMath.nextPowerOfTwo = function (n) {
	  //>>includeStart('debug', pragmas.debug);
	  if (typeof n !== "number" || n < 0 || n > 2147483648) {
	    throw new DeveloperError("A number between 0 and 2^31 is required.");
	  }
	  //>>includeEnd('debug');

	  // From http://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2
	  --n;
	  n |= n >> 1;
	  n |= n >> 2;
	  n |= n >> 4;
	  n |= n >> 8;
	  n |= n >> 16;
	  ++n;
	  return n;
	};

	/**
	 * Computes the previous power-of-two integer less than or equal to the provided non-negative integer.
	 * The maximum allowed input is (2^32)-1 due to 32-bit bitwise operator limitation in Javascript.
	 *
	 * @param {Number} n The integer to test in the range [0, (2^32)-1].
	 * @returns {Number} The previous power-of-two integer.
	 *
	 * @exception {DeveloperError} A number between 0 and (2^32)-1 is required.
	 *
	 * @example
	 * const n = Cesium.Math.previousPowerOfTwo(29); // 16
	 * const m = Cesium.Math.previousPowerOfTwo(32); // 32
	 */
	EngineMath.previousPowerOfTwo = function (n) {
	  //>>includeStart('debug', pragmas.debug);
	  if (typeof n !== "number" || n < 0 || n > 4294967295) {
	    throw new DeveloperError("A number between 0 and (2^32)-1 is required.");
	  }
	  //>>includeEnd('debug');

	  n |= n >> 1;
	  n |= n >> 2;
	  n |= n >> 4;
	  n |= n >> 8;
	  n |= n >> 16;
	  n |= n >> 32;

	  // The previous bitwise operations implicitly convert to signed 32-bit. Use `>>>` to convert to unsigned
	  n = (n >>> 0) - (n >>> 1);
	  return n;
	};

	/**
	 * Constraint a value to lie between two values.
	 *
	 * @param {Number} value The value to clamp.
	 * @param {Number} min The minimum value.
	 * @param {Number} max The maximum value.
	 * @returns {Number} The clamped value such that min <= result <= max.
	 */
	EngineMath.clamp = function (value, min, max) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("value", value);
	  Check.typeOf.number("min", min);
	  Check.typeOf.number("max", max);
	  //>>includeEnd('debug');

	  return value < min ? min : value > max ? max : value;
	};

	/**
	 * Computes <code>Math.acos(value)</code>, but first clamps <code>value</code> to the range [-1.0, 1.0]
	 * so that the function will never return NaN.
	 *
	 * @param {Number} value The value for which to compute acos.
	 * @returns {Number} The acos of the value if the value is in the range [-1.0, 1.0], or the acos of -1.0 or 1.0,
	 *          whichever is closer, if the value is outside the range.
	 */
	EngineMath.acosClamped = function (value) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined(value)) {
	    throw new DeveloperError("value is required.");
	  }
	  //>>includeEnd('debug');
	  return Math.acos(EngineMath.clamp(value, -1.0, 1.0));
	};

	/**
	 * Computes <code>Math.asin(value)</code>, but first clamps <code>value</code> to the range [-1.0, 1.0]
	 * so that the function will never return NaN.
	 *
	 * @param {Number} value The value for which to compute asin.
	 * @returns {Number} The asin of the value if the value is in the range [-1.0, 1.0], or the asin of -1.0 or 1.0,
	 *          whichever is closer, if the value is outside the range.
	 */
	EngineMath.asinClamped = function (value) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(value)) {
	    throw new DeveloperError("value is required.");
	  }
	  //>>includeEnd('debug');
	  return Math.asin(EngineMath.clamp(value, -1.0, 1.0));
	};

	/**
	 * Finds the chord length between two points given the circle's radius and the angle between the points.
	 *
	 * @param {Number} angle The angle between the two points.
	 * @param {Number} radius The radius of the circle.
	 * @returns {Number} The chord length.
	 */
	EngineMath.chordLength = function (angle, radius) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(angle)) {
	    throw new DeveloperError("angle is required.");
	  }
	  if (!Defined(radius)) {
	    throw new DeveloperError("radius is required.");
	  }
	  //>>includeEnd('debug');
	  return 2.0 * radius * Math.sin(angle * 0.5);
	};

	/**
	 * Finds the logarithm of a number to a base.
	 *
	 * @param {Number} number The number.
	 * @param {Number} base The base.
	 * @returns {Number} The result.
	 */
	EngineMath.logBase = function (number, base) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(number)) {
	    throw new DeveloperError("number is required.");
	  }
	  if (!Defined(base)) {
	    throw new DeveloperError("base is required.");
	  }
	  //>>includeEnd('debug');
	  return Math.log(number) / Math.log(base);
	};

	/**
	 * Finds the cube root of a number.
	 * Returns NaN if <code>number</code> is not provided.
	 *
	 * @function
	 * @param {Number} [number] The number.
	 * @returns {Number} The result.
	 */
	// eslint-disable-next-line es/no-math-cbrt
	EngineMath.cbrt = DefaultValue(Math.cbrt, function cbrt(number) {
	  var result = Math.pow(Math.abs(number), 1.0 / 3.0);
	  return number < 0.0 ? -result : result;
	});

	/**
	 * Finds the base 2 logarithm of a number.
	 *
	 * @function
	 * @param {Number} number The number.
	 * @returns {Number} The result.
	 */
	// eslint-disable-next-line es/no-math-log2
	EngineMath.log2 = DefaultValue(Math.log2, function log2(number) {
	  return Math.log(number) * Math.LOG2E;
	});

	/**
	 * @private
	 */
	EngineMath.fog = function (distanceToCamera, density) {
	  var scalar = distanceToCamera * density;
	  return 1.0 - Math.exp(-(scalar * scalar));
	};

	/**
	 * Computes a fast approximation of Atan for input in the range [-1, 1].
	 *
	 * Based on Michal Drobot's approximation from ShaderFastLibs,
	 * which in turn is based on "Efficient approximations for the arctangent function,"
	 * Rajan, S. Sichun Wang Inkol, R. Joyal, A., May 2006.
	 * Adapted from ShaderFastLibs under MIT License.
	 *
	 * @param {Number} x An input number in the range [-1, 1]
	 * @returns {Number} An approximation of atan(x)
	 */
	EngineMath.fastApproximateAtan = function (x) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("x", x);
	  //>>includeEnd('debug');

	  return x * (-0.1784 * Math.abs(x) - 0.0663 * x * x + 1.0301);
	};

	/**
	 * Computes a fast approximation of Atan2(x, y) for arbitrary input scalars.
	 *
	 * Range reduction math based on nvidia's cg reference implementation: http://developer.download.nvidia.com/cg/atan2.html
	 *
	 * @param {Number} x An input number that isn't zero if y is zero.
	 * @param {Number} y An input number that isn't zero if x is zero.
	 * @returns {Number} An approximation of atan2(x, y)
	 */
	EngineMath.fastApproximateAtan2 = function (x, y) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("x", x);
	  Check.typeOf.number("y", y);
	  //>>includeEnd('debug');

	  // atan approximations are usually only reliable over [-1, 1]
	  // So reduce the range by flipping whether x or y is on top based on which is bigger.
	  var opposite;
	  var t = Math.abs(x); // t used as swap and atan result.
	  opposite = Math.abs(y);
	  var adjacent = Math.max(t, opposite);
	  opposite = Math.min(t, opposite);
	  var oppositeOverAdjacent = opposite / adjacent;
	  //>>includeStart('debug', pragmas.debug);
	  if (isNaN(oppositeOverAdjacent)) {
	    throw new DeveloperError("either x or y must be nonzero");
	  }
	  //>>includeEnd('debug');
	  t = EngineMath.fastApproximateAtan(oppositeOverAdjacent);

	  // Undo range reduction
	  t = Math.abs(y) > Math.abs(x) ? EngineMath.PI_OVER_TWO - t : t;
	  t = x < 0.0 ? EngineMath.PI - t : t;
	  t = y < 0.0 ? -t : t;
	  return t;
	};

	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 基础模块
	 * ---
	 */

	/**
	 * 3D笛卡尔点
	 * @name Cartesian3
	 * @class Cartesian3
	 *
	 * @param {Number} x  -X分量
	 * @param {Number} y  -Y分量
	 * @param {Number} z  -Z分量
	 *
	 */
	function Cartesian3(x, y, z) {
	  this.x = DefaultValue(x, 0.0);
	  this.y = DefaultValue(y, 0.0);
	  this.z = DefaultValue(z, 0.0);
	}

	/**
	 * 以x,y,z坐标建立一个Cartesian3实例
	 *
	 * @param {Number} x  -x坐标
	 * @param {Number} y  -y坐标
	 * @param {Number} z  -z坐标
	 * @param {Cartesian3} result  -将结果存储其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3} 返回修改后的结果参数或一个新的Cartesian3实例(如果没有提供的话)
	 */
	Cartesian3.fromElements = function (x, y, z, result) {
	  if (!Defined(result)) {
	    return new Cartesian3(x, y, z);
	  }
	  result.x = x;
	  result.y = y;
	  result.z = z;
	  return result;
	};

	/**
	 * 复制Cartesian3实例
	 *
	 * @param {Cartesian3} cartesian  -要复制的Cartesian3实例
	 * @param {Cartesian3} result  -将结果存储其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3} 修改后的结果参数或一个新的Cartesian3实例(如果没有提供的话)。(如果笛卡尔坐标未定义则返回未定义)
	 */
	Cartesian3.clone = function (cartesian, result) {
	  if (!Defined(cartesian)) {
	    return undefined;
	  }
	  if (!Defined(result)) {
	    return new Cartesian3(cartesian.x, cartesian.y, cartesian.z);
	  }
	  result.x = cartesian.x;
	  result.y = cartesian.y;
	  result.z = cartesian.z;
	  return result;
	};

	/**
	 * 从现有Cartesian4创建Cartesian3实例
	 *
	 * @param {Cartesian4} cartesian  -从中创建Cartesian3实例的Cartesian4实例
	 * @param {Cartesian3} result  -将结果存储其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回修改后的结果参数或一个新的Cartesian3实例(如果没有提供的话)
	 */
	Cartesian3.fromCartesian4 = Cartesian3.clone;

	/**
	 * 用于将对象打包到数组中的元素数
	 * @type {Number}
	 */
	Cartesian3.packedLength = 3;

	/**
	 * 将实例打包存储到数组中
	 *
	 * @param {Cartesian3} value  -要打包的值
	 * @param {Array} array  -打包的值存储的数组
	 * @param {Number} startingIndex  -开始打包元素的数组索引
	 *
	 * @memberOf Cartesian3
	 * @returns {Array}  返回打包的数组
	 */
	Cartesian3.pack = function (value, array, startingIndex) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("value", value);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);
	  array[startingIndex++] = value.x;
	  array[startingIndex++] = value.y;
	  array[startingIndex] = value.z;
	  return array;
	};

	/**
	 * 从打包数组中检索实例
	 *
	 * @param {Array} array  -打包的数组
	 * @param {Number} startingIndex  -要解包的元素的起始索引
	 * @param {Cartesian3} result  -将结果存储到其中的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回修改后的结果参数或一个新的Cartesian3实例(如果没有提供的话)
	 */
	Cartesian3.unpack = function (array, startingIndex, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  startingIndex = defaultValue(startingIndex, 0);
	  if (!Defined(result)) {
	    result = new Cartesian3();
	  }
	  result.x = array[startingIndex++];
	  result.y = array[startingIndex++];
	  result.z = array[startingIndex];
	  return result;
	};

	/**
	 * 将Cartesian3数组平展为一个组件数组
	 *
	 * @param {Array} array  -要打包的笛卡尔数组
	 * @param {Array} result  -要将结果存储到其中的数组
	 *
	 * @memberOf Cartesian3
	 * @returns {Array}  返回组件数组
	 */
	Cartesian3.packArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  //>>includeEnd('debug');

	  var length = array.length;
	  var resultLength = length * 3;
	  if (!Defined(result)) {
	    result = new Array(resultLength);
	  } else if (!Array.isArray(result) && result.length !== resultLength) {
	    //>>includeStart('debug', pragmas.debug);
	    throw new DeveloperError("If result is a typed array, it must have exactly array.length * 3 elements");
	    //>>includeEnd('debug');
	  } else if (result.length !== resultLength) {
	    result.length = resultLength;
	  }
	  for (var i = 0; i < length; ++i) {
	    Cartesian3.pack(array[i], result, i * 3);
	  }
	  return result;
	};

	/**
	 * 将一个笛卡尔分量数组解包到一个笛卡尔分量数组中
	 *
	 * @param {Array} array  -要解包的组件数组
	 * @param {Array} result  -要将结果存储到其中的数组
	 *
	 * @memberOf Cartesian3
	 * @returns {Array} 返回解包后的数组
	 */
	Cartesian3.unpackArray = function (array, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("array", array);
	  Check.typeOf.number.greaterThanOrEquals("array.length", array.length, 3);
	  if (array.length % 3 !== 0) {
	    throw new DeveloperError("array length must be a multiple of 3.");
	  }
	  //>>includeEnd('debug');

	  var length = array.length;
	  if (!Defined(result)) {
	    result = new Array(length / 3);
	  } else {
	    result.length = length / 3;
	  }
	  for (var i = 0; i < length; i += 3) {
	    var index = i / 3;
	    result[index] = Cartesian3.unpack(array, i, result[index]);
	  }
	  return result;
	};

	/**
	 * 用数组中的三个连续元素创建Cartesian3数组
	 *
	 * @param {Array} array  -三个连续元素分别对应x、y和z分量的数组
	 * @param {Number} startingIndex  -第一个元素在数组中的偏移量，它对应于x分量
	 * @param {Cartesian3} result  -将结果存储在其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  修改后的结果参数或一个新的Cartesian3实例(如果没有提供的话)
	 *
	 * @example
	 * // Create a Cartesian3 with (1.0, 2.0, 3.0)
	 * const v = [1.0, 2.0, 3.0];
	 * const p = Cesium.Cartesian3.fromArray(v);
	 *
	 * // Create a Cartesian3 with (1.0, 2.0, 3.0) using an offset into an array
	 * const v2 = [0.0, 0.0, 1.0, 2.0, 3.0];
	 * const p2 = Cesium.Cartesian3.fromArray(v2, 2);
	 */
	Cartesian3.fromArray = Cartesian3.unpack;

	/**
	 * 为笛卡尔坐标计算最大分量的值
	 *
	 * @param {Cartesian3} cartesian  -笛卡尔坐标
	 *
	 * @memberOf Cartesian3
	 * @returns {Number} 返回笛卡尔坐标的最大分量的值
	 */
	Cartesian3.maximumComponent = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return Math.max(cartesian.x, cartesian.y, cartesian.z);
	};

	/**
	 * 为笛卡尔坐标计算最小分量的值
	 *
	 * @param {Cartesian3} cartesian  -笛卡尔坐标
	 *
	 * @memberOf Cartesian3
	 * @returns {Number}  返回笛卡尔坐标的最小分量的值
	 */
	Cartesian3.minimumComponent = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return Math.min(cartesian.x, cartesian.y, cartesian.z);
	};

	/**
	 * 比较两个笛卡尔式，计算一个包含所提供笛卡尔式最小分量的笛卡尔式
	 *
	 * @param {Cartesian3} first  -第一个用于比较的笛卡尔式
	 * @param {Cartesian3} second  -第二个用于比较的笛卡尔式
	 * @param {Cartesian3} result  -将结果存储在其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回有最小分量的笛卡尔坐标
	 */
	Cartesian3.minimumByComponent = function (first, second, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("first", first);
	  Check.typeOf.object("second", second);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.min(first.x, second.x);
	  result.y = Math.min(first.y, second.y);
	  result.z = Math.min(first.z, second.z);
	  return result;
	};

	/**
	 * 比较两个笛卡尔式并计算一个包含所提供笛卡尔式的最大分量的笛卡尔式
	 *
	 * @param {Cartesian3} first  -第一个用于比较的笛卡尔式
	 * @param {Cartesian3} second  -第二个用于比较的笛卡尔式
	 * @param {Cartesian3} result  -将结果存储在其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3} 返回有最大分量的笛卡尔坐标
	 */
	Cartesian3.maximumByComponent = function (first, second, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("first", first);
	  Check.typeOf.object("second", second);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.max(first.x, second.x);
	  result.y = Math.max(first.y, second.y);
	  result.z = Math.max(first.z, second.z);
	  return result;
	};

	/**
	 * 将一个值约束为位于两个值之间
	 *
	 * @param {Cartesian3} value  -要进行约束的值
	 * @param {Cartesian3} min  -最小范围
	 * @param {Cartesian3} max  -最大范围
	 * @param {Cartesian3} result  -将结果存储在其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3} 返回使 min < value < max 的值
	 */
	Cartesian3.clamp = function (value, min, max, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("value", value);
	  Check.typeOf.object("min", min);
	  Check.typeOf.object("max", max);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  var x = EngineMath.clamp(value.x, min.x, max.x);
	  var y = EngineMath.clamp(value.y, min.y, max.y);
	  var z = EngineMath.clamp(value.z, min.z, max.z);
	  result.x = x;
	  result.y = y;
	  result.z = z;
	  return result;
	};

	/**
	 * 计算所提供的笛卡尔的平方大小
	 *
	 * @param {Cartesian3} cartesian  -要计算其平方大小的笛卡尔实例
	 *
	 * @memberOf Cartesian3
	 * @returns {Number}  返回计算的结果
	 */
	Cartesian3.magnitudeSquared = function (cartesian) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  //>>includeEnd('debug');

	  return cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z;
	};

	/**
	 * 计算笛卡尔坐标的幅值(长度)
	 *
	 * @param {Cartesian3} cartesian  -要计算其大小的笛卡尔实例
	 *
	 * @memberOf Cartesian3
	 * @returns {Number} 返回计算出的长度
	 */
	Cartesian3.magnitude = function (cartesian) {
	  return Math.sqrt(Cartesian3.magnitudeSquared(cartesian));
	};
	var distanceScratch = new Cartesian3();

	/**
	 * 计算两点之间的距离
	 *
	 * @param {Cartesian3} left  -计算第一个点的距离
	 * @param {Cartesian3} right -计算到第二个点的距离
	 *
	 * @memberOf Cartesian3
	 * @returns {Number}  返回两点之间的距离
	 *
	 * @example
	 * // Returns 1.0
	 * const d = Cesium.Cartesian3.distance(new Cesium.Cartesian3(1.0, 0.0, 0.0), new Cesium.Cartesian3(2.0, 0.0, 0.0));
	 */
	Cartesian3.distance = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  Cartesian3.subtract(left, right, distanceScratch);
	  return Cartesian3.magnitude(distanceScratch);
	};

	/**
	 * 计算两点之间距离的平方
	 *
	 * @param {Cartesian3} left  -计算第一个点的距离
	 * @param {Cartesian3} right  -计算到第二个点的距离
	 *
	 * @memberOf Cartesian3
	 * @returns {Number}  返回两点之间距离的平方
	 *
	 * @example
	 * // Returns 4.0, not 2.0
	 * const d = Cesium.Cartesian3.distanceSquared(new Cesium.Cartesian3(1.0, 0.0, 0.0), new Cesium.Cartesian3(3.0, 0.0, 0.0));
	 */
	Cartesian3.distanceSquared = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  Cartesian3.subtract(left, right, distanceScratch);
	  return Cartesian3.magnitudeSquared(distanceScratch);
	};

	/**
	 * 计算笛卡尔坐标的归一化形式
	 *
	 * @param {Cartesian3} cartesian  -要归一化的笛卡尔坐标
	 * @param {Cartesian3} result  -将结果存储在其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3} 返回归一化后的笛卡尔坐标
	 */
	Cartesian3.normalize = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  var magnitude = Cartesian3.magnitude(cartesian);
	  result.x = cartesian.x / magnitude;
	  result.y = cartesian.y / magnitude;
	  result.z = cartesian.z / magnitude;

	  //>>includeStart('debug', pragmas.debug);
	  if (isNaN(result.x) || isNaN(result.y) || isNaN(result.z)) {
	    throw new DeveloperError("normalized result is not a number");
	  }
	  //>>includeEnd('debug');

	  return result;
	};

	/**
	 * 计算两个笛卡尔的点积
	 *
	 * @param {Cartesian3} left  -第一个笛卡尔点
	 * @param {Cartesian3} right  -第二个笛卡尔点
	 *
	 * @memberOf Cartesian3
	 * @returns {Number} 返回计算结果
	 */
	Cartesian3.dot = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  return left.x * right.x + left.y * right.y + left.z * right.z;
	};

	/**
	 * 计算两个笛卡尔坐标的分量积
	 *
	 * @param {Cartesian3} left  -第一个笛卡尔坐标
	 * @param {Cartesian3} right  -第二个笛卡尔坐标
	 * @param {Cartesian3} result  -将结果存储在其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回计算出的分量积
	 */
	Cartesian3.multiplyComponents = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x * right.x;
	  result.y = left.y * right.y;
	  result.z = left.z * right.z;
	  return result;
	};

	/**
	 * 计算两个笛卡尔坐标的分量商
	 *
	 * @param {Cartesian3} left  -第一个笛卡尔坐标
	 * @param {Cartesian3} right  -第二个笛卡尔坐标
	 * @param {Cartesian3} result  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回计算出的分量商
	 */
	Cartesian3.divideComponents = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x / right.x;
	  result.y = left.y / right.y;
	  result.z = left.z / right.z;
	  return result;
	};

	/**
	 * 计算两个笛卡尔坐标的分量和
	 *
	 * @param {Cartesian3} left  -第一个笛卡尔坐标
	 * @param {Cartesian3} right  -第二个笛卡尔坐标
	 * @param {Cartesian3} result  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3} 返回计算的分量和
	 */
	Cartesian3.add = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x + right.x;
	  result.y = left.y + right.y;
	  result.z = left.z + right.z;
	  return result;
	};

	/**
	 * 计算两个笛卡尔坐标的分量差
	 *
	 * @param {Cartesian3} left  -第一个笛卡尔坐标
	 * @param {Cartesian3} right  -第二个笛卡尔坐标
	 * @param {Cartesian3} result  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回计算的分量差
	 */
	Cartesian3.subtract = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = left.x - right.x;
	  result.y = left.y - right.y;
	  result.z = left.z - right.z;
	  return result;
	};

	/**
	 * 笛卡尔分量乘以标量
	 *
	 * @param {Cartesian3} cartesian -要缩放的笛卡尔坐标
	 * @param {Number} scalar  -标量
	 * @param {Cartesian3} result  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回计算结果
	 */
	Cartesian3.multiplyByScalar = function (cartesian, scalar, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.number("scalar", scalar);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = cartesian.x * scalar;
	  result.y = cartesian.y * scalar;
	  result.z = cartesian.z * scalar;
	  return result;
	};

	/**
	 * 笛卡尔分量除以标量
	 *
	 * @param {Cartesian3} cartesian  -笛卡尔分量
	 * @param {Number} scalar  -标量
	 * @param {Cartesian3} result  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回计算结果
	 */
	Cartesian3.divideByScalar = function (cartesian, scalar, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.number("scalar", scalar);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = cartesian.x / scalar;
	  result.y = cartesian.y / scalar;
	  result.z = cartesian.z / scalar;
	  return result;
	};

	/**
	 * 笛卡尔坐标求反
	 *
	 * @param {Cartesian3} cartesian  -笛卡尔坐标
	 * @param {Cartesian3} result  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回求反后的结果
	 */
	Cartesian3.negate = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = -cartesian.x;
	  result.y = -cartesian.y;
	  result.z = -cartesian.z;
	  return result;
	};

	/**
	 * 计算笛卡尔坐标的绝对值
	 *
	 * @param {Cartesian3} cartesian  -笛卡尔坐标
	 * @param {Cartesian3} result  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回笛卡尔坐标的绝对值
	 */
	Cartesian3.abs = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = Math.abs(cartesian.x);
	  result.y = Math.abs(cartesian.y);
	  result.z = Math.abs(cartesian.z);
	  return result;
	};
	var lerpScratch = new Cartesian3();
	/**
	 * 使用提供的笛卡尔坐标计算t点的线性插值
	 *
	 * @param {Cartesian3} start  -t在0.0处的值
	 * @param {Cartesian3} end  -t在1.0处对应的值
	 * @param {Number} t  -沿着t进行插值的点
	 * @param {Cartesian3} result  -将结果存储在其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3} 返回t点的线性插值
	 */
	Cartesian3.lerp = function (start, end, t, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("start", start);
	  Check.typeOf.object("end", end);
	  Check.typeOf.number("t", t);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  Cartesian3.multiplyByScalar(end, t, lerpScratch);
	  result = Cartesian3.multiplyByScalar(start, 1.0 - t, result);
	  return Cartesian3.add(lerpScratch, result, result);
	};
	var angleBetweenScratch = new Cartesian3();
	var angleBetweenScratch2 = new Cartesian3();
	/**
	 * 计算笛卡尔坐标之间的角度(以弧度为单位）
	 *
	 * @param {Cartesian3} left  -第一个笛卡尔坐标
	 * @param {Cartesian3} right  -第二个笛卡尔坐标
	 *
	 * @memberOf Cartesian3
	 * @returns {Number}  返回两个坐标之间的角度
	 */
	Cartesian3.angleBetween = function (left, right) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  //>>includeEnd('debug');

	  Cartesian3.normalize(left, angleBetweenScratch);
	  Cartesian3.normalize(right, angleBetweenScratch2);
	  var cosine = Cartesian3.dot(angleBetweenScratch, angleBetweenScratch2);
	  var sine = Cartesian3.magnitude(Cartesian3.cross(angleBetweenScratch, angleBetweenScratch2, angleBetweenScratch));
	  return Math.atan2(sine, cosine);
	};
	var mostOrthogonalAxisScratch = new Cartesian3();
	/**
	 * 返回与所提供的直角坐标最正交的轴
	 *
	 * @param {Cartesian3} cartesian  -在笛卡尔坐标系上找到最正交的轴
	 * @param {Cartesian3} result  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}   返回最正交的轴
	 */
	Cartesian3.mostOrthogonalAxis = function (cartesian, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("cartesian", cartesian);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  var f = Cartesian3.normalize(cartesian, mostOrthogonalAxisScratch);
	  Cartesian3.abs(f, f);
	  if (f.x <= f.y) {
	    if (f.x <= f.z) {
	      result = Cartesian3.clone(Cartesian3.UNIT_X, result);
	    } else {
	      result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
	    }
	  } else if (f.y <= f.z) {
	    result = Cartesian3.clone(Cartesian3.UNIT_Y, result);
	  } else {
	    result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
	  }
	  return result;
	};

	/**
	 * 把向量a投射到向量b上
	 *
	 * @param {Cartesian3} a  -需要投射的向量
	 * @param {Cartesian3} b  -投影到的向量
	 * @param {Cartesian3} result  -笛卡尔形式的结果
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回最终的笛卡尔坐标
	 */
	Cartesian3.projectVector = function (a, b, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("a", a);
	  Check.defined("b", b);
	  Check.defined("result", result);
	  //>>includeEnd('debug');

	  var scalar = Cartesian3.dot(a, b) / Cartesian3.dot(b, b);
	  return Cartesian3.multiplyByScalar(b, scalar, result);
	};

	/**
	 * 比较两个笛卡尔坐标是否相等
	 *
	 * @param {Cartesian3} left  -第一个笛卡尔坐标
	 * @param {Cartesian3} right  -第二个笛卡尔坐标
	 *
	 * @memberOf Cartesian3
	 * @returns {Boolean}  如果相等返回true，否则返回false
	 */
	Cartesian3.equals = function (left, right) {
	  return left === right || defined(left) && defined(right) && left.x === right.x && left.y === right.y && left.z === right.z;
	};

	/**
	 *
	 * @param {} cartesian -
	 * @param {} array -
	 * @param {} offset -
	 *
	 * @memberOf Cartesian3
	 * @returns {Boolean}
	 */
	Cartesian3.equalsArray = function (cartesian, array, offset) {
	  return cartesian.x === array[offset] && cartesian.y === array[offset + 1] && cartesian.z === array[offset + 2];
	};

	/**
	 * 按分量比较所提供的笛卡尔坐标
	 *
	 * @param {Cartesian3} left  -第一个笛卡尔坐标
	 * @param {Cartesian3} right  -第二个笛卡尔坐标
	 * @param {Number} relativeEpsilon  -用于相等性检验的相对容差
	 * @param {Number} absoluteEpsilon  -用于相等性检验的绝对容差
	 *
	 * @memberOf Cartesian3
	 * @returns {Boolean} 如果两个坐标位于Epsilon之内，则返回true，否则返回false
	 */
	Cartesian3.equalsEpsilon = function (left, right, relativeEpsilon, absoluteEpsilon) {
	  return left === right || defined(left) && defined(right) && EngineMath.equalsEpsilon(left.x, right.x, relativeEpsilon, absoluteEpsilon) && EngineMath.equalsEpsilon(left.y, right.y, relativeEpsilon, absoluteEpsilon) && EngineMath.equalsEpsilon(left.z, right.z, relativeEpsilon, absoluteEpsilon);
	};

	/**
	 * 计算两个笛卡尔坐标的外积
	 *
	 * @param {Cartesian3} left  -第一个笛卡尔坐标
	 * @param {Cartesian3} right  -第二个笛卡尔坐标
	 * @param {Cartesian3} result  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3} 返回两个笛卡尔坐标的外积
	 */
	Cartesian3.cross = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  var leftX = left.x;
	  var leftY = left.y;
	  var leftZ = left.z;
	  var rightX = right.x;
	  var rightY = right.y;
	  var rightZ = right.z;
	  var x = leftY * rightZ - leftZ * rightY;
	  var y = leftZ * rightX - leftX * rightZ;
	  var z = leftX * rightY - leftY * rightX;
	  result.x = x;
	  result.y = y;
	  result.z = z;
	  return result;
	};

	/**
	 * 计算两个笛卡尔坐标之间的中点
	 *
	 * @param {Cartesian3} left  -第一个笛卡尔坐标
	 * @param {Cartesian3} right  -第二个笛卡尔坐标
	 * @param {Cartesian3} result  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回中点坐标
	 */
	Cartesian3.midpoint = function (left, right, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.object("left", left);
	  Check.typeOf.object("right", right);
	  Check.typeOf.object("result", result);
	  //>>includeEnd('debug');

	  result.x = (left.x + right.x) * 0.5;
	  result.y = (left.y + right.y) * 0.5;
	  result.z = (left.z + right.z) * 0.5;
	  return result;
	};

	/**
	 * 用以度为单位的经度和纬度值计算笛卡尔坐标
	 *
	 * @param {Number} longitude  -以度为单位的经度
	 * @param {Number} latitude   -以度为单位的纬度
	 * @param {Number} height  -椭球以上的高度，单位为米
	 * @param {Ellipsoid} ellipsoid  -椭球所在位置
	 * @param {Cartesian3} [result]  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回计算出的笛卡尔坐标
	 * @example
	 * const position = Cesium.Cartesian3.fromDegrees(-115.0, 37.0);
	 */
	Cartesian3.fromDegrees = function (longitude, latitude, height, ellipsoid, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("longitude", longitude);
	  Check.typeOf.number("latitude", latitude);
	  //>>includeEnd('debug');

	  longitude = EngineMath.toRadians(longitude);
	  latitude = EngineMath.toRadians(latitude);
	  return Cartesian3.fromRadians(longitude, latitude, height, ellipsoid, result);
	};
	var scratchN = new Cartesian3();
	var scratchK = new Cartesian3();
	var wgs84RadiiSquared = new Cartesian3(6378137.0 * 6378137.0, 6378137.0 * 6378137.0, 6356752.3142451793 * 6356752.3142451793);

	/**
	 * 用以弧度表示的经度和纬度值计算笛卡尔坐标
	 *
	 * @param {Number} longitude  -以弧度为单位的经度
	 * @param {Number} latitude  -以弧度为单位的纬度
	 * @param {Number} height  -椭球以上的高度，单位为米
	 * @param {Ellipsoid} ellipsoid  -椭球所在位置
	 * @param {Cartesian3} [result]  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3}  返回计算出的笛卡尔坐标
	 * @example
	 * const position = Cesium.Cartesian3.fromRadians(-2.007, 0.645);
	 */
	Cartesian3.fromRadians = function (longitude, latitude, height, ellipsoid, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("longitude", longitude);
	  Check.typeOf.number("latitude", latitude);
	  //>>includeEnd('debug');

	  height = defaultValue(height, 0.0);
	  var radiiSquared = Defined(ellipsoid) ? ellipsoid.radiiSquared : wgs84RadiiSquared;
	  var cosLatitude = Math.cos(latitude);
	  scratchN.x = cosLatitude * Math.cos(longitude);
	  scratchN.y = cosLatitude * Math.sin(longitude);
	  scratchN.z = Math.sin(latitude);
	  scratchN = Cartesian3.normalize(scratchN, scratchN);
	  Cartesian3.multiplyComponents(radiiSquared, scratchN, scratchK);
	  var gamma = Math.sqrt(Cartesian3.dot(scratchN, scratchK));
	  scratchK = Cartesian3.divideByScalar(scratchK, gamma, scratchK);
	  scratchN = Cartesian3.multiplyByScalar(scratchN, height, scratchN);
	  if (!Defined(result)) {
	    result = new Cartesian3();
	  }
	  return Cartesian3.add(scratchK, scratchN, result);
	};

	/**
	 * 计算用度表示的经度和纬度值数组的笛卡尔坐标数组
	 *
	 * @param {Array} coordinates  -经度和纬度值的列表
	 * @param {Ellipsoid} ellipsoid  -坐标所在的椭球
	 * @param {Array} result  -用于存储结果的Cartesian3对象数组
	 *
	 * @memberOf Cartesian3
	 * @returns {Array} 笛卡尔坐标数组
	 * @example
	 * const positions = Cesium.Cartesian3.fromDegreesArray([-115.0, 37.0, -107.0, 33.0]);
	 */
	Cartesian3.fromDegreesArray = function (coordinates, ellipsoid, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("coordinates", coordinates);
	  if (coordinates.length < 2 || coordinates.length % 2 !== 0) {
	    throw new DeveloperError("the number of coordinates must be a multiple of 2 and at least 2");
	  }
	  //>>includeEnd('debug');

	  var length = coordinates.length;
	  if (!Defined(result)) {
	    result = new Array(length / 2);
	  } else {
	    result.length = length / 2;
	  }
	  for (var i = 0; i < length; i += 2) {
	    var longitude = coordinates[i];
	    var latitude = coordinates[i + 1];
	    var index = i / 2;
	    result[index] = Cartesian3.fromDegrees(longitude, latitude, 0, ellipsoid, result[index]);
	  }
	  return result;
	};

	/**
	 * 计算用弧度表示的经度和纬度值数组的笛卡尔坐标数组
	 *
	 * @param {Array} coordinates  -经度和纬度值的列表
	 * @param {Ellipsoid} ellipsoid  -坐标所在的椭球
	 * @param {Array} result  -用于存储结果的Cartesian3对象数组
	 *
	 * @memberOf Cartesian3
	 * @returns {Array} 返回笛卡尔坐标数组
	 * @example
	 * const positions = Cesium.Cartesian3.fromRadiansArray([-2.007, 0.645, -1.867, .575]);
	 */
	Cartesian3.fromRadiansArray = function (coordinates, ellipsoid, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("coordinates", coordinates);
	  if (coordinates.length < 2 || coordinates.length % 2 !== 0) {
	    throw new DeveloperError("the number of coordinates must be a multiple of 2 and at least 2");
	  }
	  //>>includeEnd('debug');

	  var length = coordinates.length;
	  if (!Defined(result)) {
	    result = new Array(length / 2);
	  } else {
	    result.length = length / 2;
	  }
	  for (var i = 0; i < length; i += 2) {
	    var longitude = coordinates[i];
	    var latitude = coordinates[i + 1];
	    var index = i / 2;
	    result[index] = Cartesian3.fromRadians(longitude, latitude, 0, ellipsoid, result[index]);
	  }
	  return result;
	};

	/**
	 * 计算给定经度、纬度和高度值的笛卡尔位置数组，其中经度和纬度以度数表示
	 *
	 * @param {Array} coordinates  -经度、纬度和高度值的列表
	 * @param {Ellipsoid} ellipsoid  -位置所在的椭球
	 * @param {Array} result  -用来存储结果的Cartesian3数组
	 *
	 * @memberOf Cartesian3
	 * @returns {Array}  返回笛卡尔位置数组
	 * @example
	 * const positions = Cesium.Cartesian3.fromDegreesArrayHeights([-115.0, 37.0, 100000.0, -107.0, 33.0, 150000.0]);
	 */
	Cartesian3.fromDegreesArrayHeights = function (coordinates, ellipsoid, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("coordinates", coordinates);
	  if (coordinates.length < 3 || coordinates.length % 3 !== 0) {
	    throw new DeveloperError("the number of coordinates must be a multiple of 3 and at least 3");
	  }
	  //>>includeEnd('debug');

	  var length = coordinates.length;
	  if (!Defined(result)) {
	    result = new Array(length / 3);
	  } else {
	    result.length = length / 3;
	  }
	  for (var i = 0; i < length; i += 3) {
	    var longitude = coordinates[i];
	    var latitude = coordinates[i + 1];
	    var height = coordinates[i + 2];
	    var index = i / 3;
	    result[index] = Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result[index]);
	  }
	  return result;
	};

	/**
	 * 计算给定经度、纬度和高度值的笛卡尔位置数组，其中经度和纬度以弧度表示
	 *
	 * @param {Array} coordinates  -经度、纬度和高度值的列表
	 * @param {Ellipsoid} ellipsoid  -位置所在的椭球
	 * @param {Array} result  -用来存储结果的Cartesian3数组
	 *
	 * @memberOf Cartesian3
	 * @returns {Array}  返回笛卡尔位置数组
	 * @example
	 * const positions = Cesium.Cartesian3.fromRadiansArrayHeights([-2.007, 0.645, 100000.0, -1.867, .575, 150000.0]);
	 */
	Cartesian3.fromRadiansArrayHeights = function (coordinates, ellipsoid, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("coordinates", coordinates);
	  if (coordinates.length < 3 || coordinates.length % 3 !== 0) {
	    throw new DeveloperError("the number of coordinates must be a multiple of 3 and at least 3");
	  }
	  //>>includeEnd('debug');

	  var length = coordinates.length;
	  if (!Defined(result)) {
	    result = new Array(length / 3);
	  } else {
	    result.length = length / 3;
	  }
	  for (var i = 0; i < length; i += 3) {
	    var longitude = coordinates[i];
	    var latitude = coordinates[i + 1];
	    var height = coordinates[i + 2];
	    var index = i / 3;
	    result[index] = Cartesian3.fromRadians(longitude, latitude, height, ellipsoid, result[index]);
	  }
	  return result;
	};

	/**
	 * 初始化为(0.0,0.0,0.0)的不可变Cartesian3实例
	 *
	 * @memberOf Cartesian3
	 */
	Cartesian3.ZERO = Object.freeze(new Cartesian3(0.0, 0.0, 0.0));

	/**
	 * 初始化为(1.0,1.0,1.0)的不可变Cartesian3实例
	 *
	 * @memberOf Cartesian3
	 */
	Cartesian3.ONE = Object.freeze(new Cartesian3(1.0, 1.0, 1.0));

	/**
	 * 初始化为(1.0,0.0,0.0)的不可变Cartesian3实例
	 *
	 * @memberOf Cartesian3
	 */
	Cartesian3.UNIT_X = Object.freeze(new Cartesian3(1.0, 0.0, 0.0));

	/**
	 * 初始化为(0.0,1.0,0.0)的不可变Cartesian3实例
	 *
	 * @memberOf Cartesian3
	 */
	Cartesian3.UNIT_Y = Object.freeze(new Cartesian3(0.0, 1.0, 0.0));

	/**
	 * 初始化为(0.0,0.0,1.0)的不可变Cartesian3实例
	 *
	 * @memberOf Cartesian3
	 */
	Cartesian3.UNIT_Z = Object.freeze(new Cartesian3(0.0, 0.0, 1.0));

	/**
	 * 复制这个Cartesian3实例
	 *
	 * @param {Cartesian3} result  -将结果存储于其上的对象
	 *
	 * @memberOf Cartesian3
	 * @returns {Cartesian3} 修改后的结果参数或一个新的Cartesian3实例(如果没有提供的话)
	 */
	Cartesian3.prototype.clone = function (result) {
	  return Cartesian3.clone(this, result);
	};

	/**
	 * 比较两个笛卡尔坐标
	 *
	 * @param {Cartesian3} right  -笛卡尔坐标
	 *
	 * @memberOf Cartesian3
	 * @returns {Boolean} 如果相等返回true，否则返回false
	 */
	Cartesian3.prototype.equals = function (right) {
	  return Cartesian3.equals(this, right);
	};

	/**
	 *对两个笛卡尔矩阵进行分量比较
	 *
	 * @param {Cartesian3}  right  -笛卡尔坐标
	 * @param {Number} relativeEpsilon  -用于相等性检验的相对容差
	 * @param {Number} absoluteEpsilon  -用于相等性检验的绝对容差
	 *
	 * @memberOf Cartesian3
	 * @returns {Boolean} 如果在Epsilon范围里，返回true，否则返回false
	 */
	Cartesian3.prototype.equalsEpsilon = function (right, relativeEpsilon, absoluteEpsilon) {
	  return Cartesian3.equalsEpsilon(this, right, relativeEpsilon, absoluteEpsilon);
	};

	/**
	 * 创建一个以'(x, y, z)'格式表示直角坐标的字符串
	 *
	 * @memberOf Cartesian3
	 * @returns {String}  返回表示这个笛卡尔坐标的字符串，格式为'(x, y, z)'
	 */
	Cartesian3.prototype.toString = function () {
	  return "(".concat(this.x, ", ").concat(this.y, ", ").concat(this.z, ")");
	};

	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 基础模块
	 * ---
	 */

	/**
	 * 4D笛卡尔点
	 * @name Cartesian4
	 * @class Cartesian4
	 *
	 * @param {Number} x  -X分量
	 * @param {Number} y  -Y分量
	 * @param {Number} z  -Z分量
	 * @param {Number} w  -W分量
	 *
	 */
	function Cartesian4(x, y, z, w) {
	  this.x = DefaultValue(x, 0.0);
	  this.y = DefaultValue(y, 0.0);
	  this.z = DefaultValue(z, 0.0);
	  this.w = DefaultValue(w, 0.0);
	}

	//==========================================================================
	new Cartesian3();
	new Cartesian3();

	//==========================================================================

	/**
	 * 通过经度，纬度和高度确定的点
	 * @name Cartographic
	 * @class Cartographic
	 *
	 * @param {Number} longitude  -经度
	 * @param {Number} latitude  -纬度
	 * @param {Number} height  -高度
	 *
	 */
	function Cartographic(longitude, latitude, height) {
	  this.longitude = DefaultValue(longitude, 0.0);
	  this.latitude = DefaultValue(latitude, 0.0);
	  this.height = DefaultValue(height, 0.0);
	}

	/**
	 * 用以弧度表示的经度和纬度创建一个新的实例
	 *
	 * @param {Number} longitude  -以弧度表示的经度
	 * @param {Number} latitude  -以弧度表示的纬度
	 * @param {Number} height -椭球以上的高度，单位为米
	 * @param {Cartographic} result  -将结果存储于其上的对象
	 *
	 *
	 * @memberOf Cartographic
	 * @returns {Cartographic}  返回修改后的结果参数或一个新的制图实例(如果没有提供的话)
	 */
	Cartographic.fromRadians = function (longitude, latitude, height, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("longitude", longitude);
	  Check.typeOf.number("latitude", latitude);
	  //>>includeEnd('debug');

	  height = DefaultValue(height, 0.0);
	  if (!Defined(result)) {
	    return new Cartographic(longitude, latitude, height);
	  }
	  result.longitude = longitude;
	  result.latitude = latitude;
	  result.height = height;
	  return result;
	};

	/**
	 * 从经度和纬度创建一个新的制图实例
	 *
	 * @param {Number} longitude  -以度为单位的经度
	 * @param {Number} latitude  -以度为单位的纬度
	 * @param {Number} height   -椭球上方的高度，以米为单位
	 * @param {Cartographic} result  -结果存储到的对象
	 *
	 * @memberOf Cartographic
	 * @returns {Cartographic}  返回修改后的结果参数或一个新的制图实例（如果未提供）
	 */
	Cartographic.fromDegrees = function (longitude, latitude, height, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.typeOf.number("longitude", longitude);
	  Check.typeOf.number("latitude", latitude);
	  //>>includeEnd('debug');
	  longitude = EngineMath.toRadians(longitude);
	  latitude = EngineMath.toRadians(latitude);
	  return Cartographic.fromRadians(longitude, latitude, height, result);
	};
	var cartesianToCartographicN = new Cartesian3();
	var cartesianToCartographicP = new Cartesian3();
	var cartesianToCartographicH = new Cartesian3();
	var wgs84OneOverRadii = new Cartesian3(1.0 / 6378137.0, 1.0 / 6378137.0, 1.0 / 6356752.3142451793);
	var wgs84OneOverRadiiSquared = new Cartesian3(1.0 / (6378137.0 * 6378137.0), 1.0 / (6378137.0 * 6378137.0), 1.0 / (6356752.3142451793 * 6356752.3142451793));
	var wgs84CenterToleranceSquared = EngineMath.EPSILON1;

	/**
	 * 从笛卡尔位置创建一个新的制图实例
	 *
	 * @param {Cartesian3} cartesian  -要转换为制图表达的笛卡尔位置
	 * @param {Ellipsoid} ellipsoid  -位置所在的椭圆体
	 * @param {Cartographic} result  -将结果存储到的对象
	 *
	 * @memberOf Cartographic
	 * @returns {Cartographic}  返回修改后的结果参数，如果未提供，则为新的制图实例；如果笛卡尔位于椭圆体的中心，则为未定义
	 */
	Cartographic.fromCartesian = function (cartesian, ellipsoid, result) {
	  var oneOverRadii = Defined(ellipsoid) ? ellipsoid.oneOverRadii : wgs84OneOverRadii;
	  var oneOverRadiiSquared = Defined(ellipsoid) ? ellipsoid.oneOverRadiiSquared : wgs84OneOverRadiiSquared;
	  var centerToleranceSquared = Defined(ellipsoid) ? ellipsoid._centerToleranceSquared : wgs84CenterToleranceSquared;

	  //`cartesian is required.` is thrown from scaleToGeodeticSurface
	  var p = scaleToGeodeticSurface(cartesian, oneOverRadii, oneOverRadiiSquared, centerToleranceSquared, cartesianToCartographicP);
	  if (!Defined(p)) {
	    return undefined;
	  }
	  var n = Cartesian3.multiplyComponents(p, oneOverRadiiSquared, cartesianToCartographicN);
	  n = Cartesian3.normalize(n, n);
	  var h = Cartesian3.subtract(cartesian, p, cartesianToCartographicH);
	  var longitude = Math.atan2(n.y, n.x);
	  var latitude = Math.asin(n.z);
	  var height = EngineMath.sign(Cartesian3.dot(h, cartesian)) * Cartesian3.magnitude(h);
	  if (!Defined(result)) {
	    return new Cartographic(longitude, latitude, height);
	  }
	  result.longitude = longitude;
	  result.latitude = latitude;
	  result.height = height;
	  return result;
	};

	/**
	 * 根据制图输入创建一个新的Cartesian3实例
	 *
	 * @param {Cartographic} cartographic  -输入将转换为Cartesian3输出
	 * @param {Ellipsoid} ellipsoid  -位置所在的椭圆体
	 * @param {Cartesian3} result  -将结果存储到的对象
	 *
	 * @memberOf Cartographic
	 * @returns {Cartesian3}  返回创建的实例
	 */
	Cartographic.toCartesian = function (cartographic, ellipsoid, result) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.defined("cartographic", cartographic);
	  //>>includeEnd('debug');

	  return Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height, ellipsoid, result);
	};

	/**
	 * 复制实例
	 *
	 * @param {Cartographic} cartographic  -要复制的实例
	 * @param {Cartographic} result  -将结果存储的对象
	 *
	 * @memberOf Cartographic
	 * @returns {Cartographic}  返回修改后的结果参数或一个新的制图实例（如果未提供）
	 */
	Cartographic.clone = function (cartographic, result) {
	  if (!Defined(cartographic)) {
	    return undefined;
	  }
	  if (!Defined(result)) {
	    return new Cartographic(cartographic.longitude, cartographic.latitude, cartographic.height);
	  }
	  result.longitude = cartographic.longitude;
	  result.latitude = cartographic.latitude;
	  result.height = cartographic.height;
	  return result;
	};

	/**
	 * 将提供的内容与此制图成分进行比较
	 *
	 * @param {Cartographic} left  -第一个实例
	 * @param {Cartographic} right  -第二个实例
	 *
	 * @memberOf Cartographic
	 * @returns {Boolean}  如果两个实例相等返回true，否则返回false
	 */
	Cartographic.equals = function (left, right) {
	  return left === right || Defined(left) && Defined(right) && left.longitude === right.longitude && left.latitude === right.latitude && left.height === right.height;
	};

	/**
	 * 将提供的内容与此制图成分进行比较
	 *
	 * @param {Cartographic} left  -第一个实例
	 * @param {Cartographic} right  -第二个实例
	 * @param {Number} epsilon  -用于相等性测试的epsilon
	 *
	 * @memberOf Cartographic
	 * @returns {Boolean}  如果两个实例在提供的epsilon之内，返回true，否则返回false
	 */
	Cartographic.equalsEpsilon = function (left, right, epsilon) {
	  epsilon = DefaultValue(epsilon, 0);
	  return left === right || Defined(left) && Defined(right) && Math.abs(left.longitude - right.longitude) <= epsilon && Math.abs(left.latitude - right.latitude) <= epsilon && Math.abs(left.height - right.height) <= epsilon;
	};

	/**
	 * 初始化为(0.0,0.0,0.0)的不可变制图实例
	 *
	 * @memberOf Cartographic
	 */
	Cartographic.ZERO = Object.freeze(new Cartographic(0.0, 0.0, 0.0));

	/**
	 * 复制此实例
	 *
	 * @param {Cartographic} result  -存储结果的对象
	 *
	 * @memberOf Cartographic
	 * @returns {Cartographic}  返回修改后的结果参数或一个新的制图实例（如果未提供）
	 */
	Cartographic.prototype.clone = function (result) {
	  return Cartographic.clone(this, result);
	};

	/**
	 * 将提供的内容与此制图成分进行比较
	 *
	 * @param {Cartographic} right  -用来比较的实例
	 *
	 * @memberOf Cartographic
	 * @returns {Boolean}  如果两个实例相等返回true，否则返回false
	 */
	Cartographic.prototype.equals = function (right) {
	  return Cartographic.equals(this, right);
	};

	/**
	 * 将提供的内容与此制图成分进行比较
	 *
	 * @param {Cartographic} right  -用来比较的实例
	 * @param {Number} epsilon  -用于相等性测试的epsilon
	 *
	 * @memberOf Cartographic
	 * @returns {Boolean}  如果两个实例在提供的epsilon之内，返回true，否则返回false
	 */
	Cartographic.prototype.equalsEpsilon = function (right, epsilon) {
	  return Cartographic.equalsEpsilon(this, right, epsilon);
	};

	/**
	 * 创建以'(经度，纬度，高度)'格式表示此地图的字符串
	 *
	 * @memberOf Cartographic
	 * @returns {String} 返回以'(经度，纬度，高度)'格式表示此地图的字符串
	 */
	Cartographic.prototype.toString = function () {
	  return "(".concat(this.longitude, ", ").concat(this.latitude, ", ").concat(this.height, ")");
	};

	//==========================================================================

	/**
	 * 在局部框架中定义航向角，俯仰角和范围
	 *
	 * @name HeadingPitchRange
	 * @class HeadingPitchRange
	 *
	 * @param {Number} heading  -航向角（弧度）
	 * @param {Number} pitch  -俯仰角（弧度）
	 * @param {Number} range  -距中心的距离，以米为单位
	 */
	function HeadingPitchRange(heading, pitch, range) {
	  this.heading = DefaultValue(heading, 0.0);
	  this.pitch = DefaultValue(pitch, 0.0);
	  this.range = DefaultValue(range, 0.0);
	}

	/**
	 * 复制HeadingPitchRange实例
	 *
	 * @param {HeadingPitchRange} hpr  -要复制的HeadingPitchRange
	 * @param {HeadingPitchRange} result  -将结果存储到的对象
	 *
	 * @memberOf HeadingPitchRange
	 * @returns {HeadingPitchRange}  返回修改后的结果参数或一个新的HeadingPitchRange实例（如果未提供）
	 */
	HeadingPitchRange.clone = function (hpr, result) {
	  if (!Defined(hpr)) {
	    return undefined;
	  }
	  if (!Defined(result)) {
	    result = new HeadingPitchRange();
	  }
	  result.heading = hpr.heading;
	  result.pitch = hpr.pitch;
	  result.range = hpr.range;
	  return result;
	};

	//==========================================================================

	/**
	 * 旋转表示为航向，俯仰和横滚
	 *
	 * @name HeadingPitchRoll
	 * @class HeadingPitchRoll
	 *
	 * @param {Number} heading  -弧度的航向分量
	 * @param {Number} pitch  -弧度的螺距分量
	 * @param {Number} roll  -滚动分量（以弧度为单位）
	 */
	function HeadingPitchRoll(heading, pitch, roll) {
	  this.heading = DefaultValue(heading, 0.0);
	  this.pitch = DefaultValue(pitch, 0.0);
	  this.roll = DefaultValue(roll, 0.0);
	}

	/**
	 * 计算四元数的航向，俯仰和横滚
	 *
	 * @param {Quaternion} quaternion  -用于检索航向，俯仰和横滚的四元数，全部以弧度表示
	 * @param {HeadingPitchRoll} result  -存储结果的对象。如果未提供，则会创建并返回一个新实例
	 *
	 * @memberOf HeadingPitchRoll
	 * @returns {HeadingPitchRoll}  返回修改后的结果参数；如果未提供，则为新的HeadingPitchRoll实例
	 */
	HeadingPitchRoll.fromQuaternion = function (quaternion, result) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(quaternion)) {
	    throw new DeveloperError("quaternion is required");
	  }
	  //>>includeEnd('debug');
	  if (!Defined(result)) {
	    result = new HeadingPitchRoll();
	  }
	  var test = 2 * (quaternion.w * quaternion.y - quaternion.z * quaternion.x);
	  var denominatorRoll = 1 - 2 * (quaternion.x * quaternion.x + quaternion.y * quaternion.y);
	  var numeratorRoll = 2 * (quaternion.w * quaternion.x + quaternion.y * quaternion.z);
	  var denominatorHeading = 1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z);
	  var numeratorHeading = 2 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y);
	  result.heading = -Math.atan2(numeratorHeading, denominatorHeading);
	  result.roll = Math.atan2(numeratorRoll, denominatorRoll);
	  result.pitch = -EngineMath.asinClamped(test);
	  return result;
	};

	/**
	 * 从以度为单位的角度返回一个新的HeadingPitchRoll实例
	 *
	 * @param {Number} heading  -航向度
	 * @param {Number} pitch  -音调，以度为单位
	 * @param {Number} roll  -航向度
	 * @param {HeadingPitchRoll} result  -存储结果的对象。如果未提供，则会创建并返回一个新实例
	 *
	 * @memberOf HeadingPitchRoll
	 * @returns {HeadingPitchRoll}  返回一个新的HeadingPitchRoll实例
	 */
	HeadingPitchRoll.fromDegrees = function (heading, pitch, roll, result) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(heading)) {
	    throw new DeveloperError("heading is required");
	  }
	  if (!Defined(pitch)) {
	    throw new DeveloperError("pitch is required");
	  }
	  if (!Defined(roll)) {
	    throw new DeveloperError("roll is required");
	  }
	  //>>includeEnd('debug');
	  if (!Defined(result)) {
	    result = new HeadingPitchRoll();
	  }
	  result.heading = heading * EngineMath.RADIANS_PER_DEGREE;
	  result.pitch = pitch * EngineMath.RADIANS_PER_DEGREE;
	  result.roll = roll * EngineMath.RADIANS_PER_DEGREE;
	  return result;
	};

	/**
	 * 复制此HeadingPitchRoll实例
	 *
	 * @param {HeadingPitchRoll} headingPitchRoll  -需要复制的HeadingPitchRoll实例
	 * @param {HeadingPitchRoll} result  -将结果存储到的对象
	 *
	 * @memberOf HeadingPitchRoll
	 * @returns {HeadingPitchRoll}  返回修改后的结果参数；如果未提供，则为新的HeadingPitchRoll实例
	 */
	HeadingPitchRoll.clone = function (headingPitchRoll, result) {
	  if (!Defined(headingPitchRoll)) {
	    return undefined;
	  }
	  if (!Defined(result)) {
	    return new HeadingPitchRoll(headingPitchRoll.heading, headingPitchRoll.pitch, headingPitchRoll.roll);
	  }
	  result.heading = headingPitchRoll.heading;
	  result.pitch = headingPitchRoll.pitch;
	  result.roll = headingPitchRoll.roll;
	  return result;
	};

	/**
	 * 将此HeadingPitchRoll与提供的HeadingPitchRoll组件进行比较
	 *
	 * @param {HeadingPitchRoll} left  -第一个HeadingPitchRoll组件
	 * @param {HeadingPitchRoll} right  -第二个HeadingPitchRoll组件
	 *
	 * @memberOf HeadingPitchRoll
	 * @returns {Boolean}  如果两个组件相等返回true，否则返回false
	 */
	HeadingPitchRoll.equals = function (left, right) {
	  return left === right || Defined(left) && Defined(right) && left.heading === right.heading && left.pitch === right.pitch && left.roll === right.roll;
	};

	/**
	 * 将此HeadingPitchRoll与提供的HeadingPitchRoll组件进行比较
	 *
	 * @param {HeadingPitchRoll} left  -第一个HeadingPitchRoll组件
	 * @param {HeadingPitchRoll} right  -第二个HeadingPitchRoll组件
	 * @param {Number} relativeEpsilon  -用于相等性测试的相对epsilon公差
	 * @param {Number} absoluteEpsilon  -用于相等性测试的绝对epsilon公差
	 *
	 * @memberOf HeadingPitchRoll
	 * @returns {Boolean} 如果两个组件在提供的epsilon中返回true，否则返回false
	 */
	HeadingPitchRoll.equalsEpsilon = function (left, right, relativeEpsilon, absoluteEpsilon) {
	  return left === right || Defined(left) && Defined(right) && EngineMath.equalsEpsilon(left.heading, right.heading, relativeEpsilon, absoluteEpsilon) && EngineMath.equalsEpsilon(left.pitch, right.pitch, relativeEpsilon, absoluteEpsilon) && EngineMath.equalsEpsilon(left.roll, right.roll, relativeEpsilon, absoluteEpsilon);
	};

	/**
	 * 复制此HeadingPitchRoll实例
	 *
	 * @param {HeadingPitchRoll} result  -将结果存储到的对象
	 *
	 * @memberOf HeadingPitchRoll
	 * @returns {HeadingPitchRoll}  返回修改后的结果参数；如果未提供，则为新的HeadingPitchRoll实例
	 */
	HeadingPitchRoll.prototype.clone = function (result) {
	  return HeadingPitchRoll.clone(this, result);
	};

	/**
	 * 将此HeadingPitchRoll与提供的HeadingPitchRoll组件进行比较
	 *
	 * @param {HeadingPitchRoll} right  -提供的HeadingPitchRoll组件
	 *
	 * @memberOf HeadingPitchRoll
	 * @returns {Boolean}  如果两个组件相等返回true，否则返回false
	 */
	HeadingPitchRoll.prototype.equals = function (right) {
	  return HeadingPitchRoll.equals(this, right);
	};

	/**
	 * 将此HeadingPitchRoll与提供的HeadingPitchRoll组件进行比较
	 *
	 * @param {HeadingPitchRoll} right  -提供的HeadingPitchRoll组件
	 * @param {Number} relativeEpsilon  -用于相等性测试的相对epsilon公差
	 * @param {Number} absoluteEpsilon  -用于相等性测试的绝对epsilon公差
	 *
	 * @memberOf HeadingPitchRoll
	 * @returns {Boolean} 如果两个组件在提供的epsilon中返回true，否则返回false
	 */
	HeadingPitchRoll.prototype.equalsEpsilon = function (right, relativeEpsilon, absoluteEpsilon) {
	  return HeadingPitchRoll.equalsEpsilon(this, right, relativeEpsilon, absoluteEpsilon);
	};

	/**
	 * 创建一个以弧度为单位的'(heading, pitch, roll)'格式表示此HeadingPitchRoll的字符串
	 *
	 * @returns {String}  返回一个以弧度为单位的'(heading, pitch, roll)'格式表示此HeadingPitchRoll的字符串
	 */
	HeadingPitchRoll.prototype.toString = function () {
	  return "(".concat(this.heading, ", ").concat(this.pitch, ", ").concat(this.roll, ")");
	};

	//==========================================================================

	/**
	 *
	 * 类对象基类
	 * @name Object
	 * @class Object
	 * 基类操作函数
	 */
	var BaseObject = function BaseObject() {
	  this.name = "BaseObject";
	  this.pre = null;
	};
	Object.assign(BaseObject.prototype, {
	  _evaluate: function _evaluate() {
	    var evaluate = {
	      "function": "evaluate",
	      statement: this.statement
	    };
	    var statement = Config.formatURLParam(evaluate);
	    return statement;
	  },
	  /**
	   * 获取信息
	   *
	   * @memberOf Object#
	   * @returns {String} 返回信息
	   */
	  getInfo: function getInfo() {
	    return this.statement;
	  },
	  /**
	   * json对象转string对象
	   *
	   * @memberOf Object#
	   * @returns {String}  返回string对象
	   */
	  toString: function toString() {
	    return JSON.stringify(this.statement).toString();
	  }
	});

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 *
	 * 相机操作函数
	 * @name Camera
	 *
	 * @extends BaseObject
	 */
	var Camera = /*#__PURE__*/function (_BaseObject) {
	  _inherits(Camera, _BaseObject);
	  var _super = _createSuper(Camera);
	  function Camera(name) {
	    var _this;
	    _classCallCheck(this, Camera);
	    _this = _super.call(this, "Camera");
	    _this.name = name;
	    _this.pre = null;
	    _this.statement = {
	      type: "Invocation",
	      arguments: {
	        name: name
	      },
	      functionName: "Camera"
	    };
	    return _this;
	  }
	  return _createClass(Camera);
	}(BaseObject);
	Object.assign(Camera.prototype, {
	  /**
	   * 飞行动画
	   * @param {Number} long -经度
	   * @param {Number} lat -纬度
	   * @param {Number} zoomDistance -缩放距离
	   * @param {Number} pitch -俯仰角
	   * @param {Number} heading -偏航角
	   *
	   * @memberOf Camera#
	   * @returns {Camera} 返回相机
	   */
	  flyTo: function flyTo(_long, lat, zoomDistance, pitch, heading) {
	    var camera = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        camera: camera,
	        "long": _long,
	        lat: lat,
	        zoomDistance: zoomDistance,
	        pitch: pitch,
	        heading: heading
	      },
	      functionName: "Camera.flyTo"
	    };
	    var cameraObject = new Camera();
	    cameraObject.pre = this;
	    cameraObject.statement = obj;
	    return cameraObject;
	  },
	  /**
	   * 使用目标和偏移量设置摄像机的位置和方向
	   * @param {Number} long -经度
	   * @param {Number} lat -纬度
	   * @param {Number} zoomDistance -缩放距离
	   * @param {Number} pitch -俯仰角
	   * @param {Number} heading -偏航角
	   *
	   * @memberOf Camera#
	   * @returns {Camera}  返回相机
	   */
	  lookAt: function lookAt(_long2, lat, zoomDistance, pitch, heading) {
	    var camera = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        camera: camera,
	        "long": _long2,
	        lat: lat,
	        zoomDistance: zoomDistance,
	        pitch: pitch,
	        heading: heading
	      },
	      functionName: "Camera.lookAt"
	    };
	    var cameraObject = new Camera();
	    cameraObject.pre = this;
	    cameraObject.statement = obj;
	    return cameraObject;
	  },
	  /**
	   * 执行命令(临时接口)
	   * @param {params} params -命令参数(json格式)
	   *
	   * @memberOf Camera#
	   * @returns {Camera}  返回相机
	   */
	  doCommand: function doCommand(params) {
	    var camera = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        camera: camera,
	        params: params
	      },
	      functionName: "Camera.doCommand"
	    };
	    var cameraObject = new Camera();
	    cameraObject.pre = this;
	    cameraObject.statement = obj;
	    return cameraObject;
	  },
	  /**
	   * 地理坐标转世界坐标
	   * @param {params} params -坐标参数
	   *
	   * @memberOf Camera#
	   * @returns {Camera}  返回相机
	   */
	  geoToWorld: function geoToWorld(geoX, geoY, worldX, worldY, worldZ) {
	    var camera = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        camera: camera,
	        geoX: geoX,
	        geoY: geoY,
	        worldX: worldX,
	        worldY: worldY,
	        worldZ: worldZ
	      },
	      functionName: "Camera.geoToWorld"
	    };
	    var cameraObject = new Camera();
	    cameraObject.pre = this;
	    cameraObject.statement = obj;
	    return cameraObject;
	  },
	  /**
	   * 世界坐标转屏幕
	   * @param {params} params -坐标参数
	   *
	   * @memberOf Camera#
	   * @returns {Camera}  返回相机
	   */
	  worldToScreen: function worldToScreen(worldX, worldY, worldZ, ScreenX, ScreenY) {
	    var camera = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        camera: camera,
	        worldX: worldX,
	        worldY: worldY,
	        worldZ: worldZ,
	        ScreenX: ScreenX,
	        ScreenY: ScreenY
	      },
	      functionName: "Camera.worldToScreen"
	    };
	    var cameraObject = new Camera();
	    cameraObject.pre = this;
	    cameraObject.statement = obj;
	    return cameraObject;
	  },
	  getInfo: function getInfo() {
	    var camera = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        camera: camera
	      },
	      functionName: "Camera.getInfo"
	    };
	    var cameraObject = new Camera();
	    cameraObject.pre = this;
	    cameraObject.statement = obj;
	    return cameraObject;
	  }
	});

	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 基础模块
	 * ---
	 */

	/**
	 * 关联数组
	 * @name AssociativeArray
	 * @class AssociativeArray
	 */
	function AssociativeArray() {
	  this._array = [];
	  this._hash = {};
	}
	Object.defineProperties(AssociativeArray.prototype, {
	  /**
	   * 计算数组长度
	   * @memberOf AssociativeArray#
	   * @returns {Number} 返回数组长度
	   */
	  length: {
	    get: function get() {
	      return this._array.length;
	    }
	  },
	  /**
	   * 获取集合中所有值的无序数组
	   *
	   * @memberOf AssociativeArray#
	   * @returns {Array} 返回数组
	   */
	  values: {
	    get: function get() {
	      return this._array;
	    }
	  }
	});

	/**
	 * 确定所提供的key是否在数组中
	 * @param {String/Number} key -提供的key
	 *
	 * @memberOf AssociativeArray
	 * @returns {Boolean} 如果key在数组中返回true，否则返回false
	 */
	AssociativeArray.prototype.contains = function (key) {
	  //>>includeStart('debug', pragmas.debug);
	  if (typeof key !== "string" && typeof key !== "number") {
	    throw new DeveloperError("key is required to be a string or number.");
	  }
	  //>>includeEnd('debug');
	  return Defined(this._hash[key]);
	};

	/**
	 * 设置和key关联的值
	 * @param {String/Number} key -唯一标识符
	 * @param {String/Number} value -要与key关联的值
	 *
	 * @memberOf AssociativeArray
	 */
	AssociativeArray.prototype.set = function (key, value) {
	  //>>includeStart('debug', pragmas.debug);
	  if (typeof key !== "string" && typeof key !== "number") {
	    throw new DeveloperError("key is required to be a string or number.");
	  }
	  //>>includeEnd('debug');

	  var oldValue = this._hash[key];
	  if (value !== oldValue) {
	    this.remove(key);
	    this._hash[key] = value;
	    this._array.push(value);
	  }
	};

	/**
	 * 获取和key关联的值
	 * @param {String/Number} key -要检索的key
	 *
	 * @memberOf AssociativeArray
	 * @returns {String/Number} 返回关联的值，如果不存在则为未定义
	 */
	AssociativeArray.prototype.get = function (key) {
	  //>>includeStart('debug', pragmas.debug);
	  if (typeof key !== "string" && typeof key !== "number") {
	    throw new DeveloperError("key is required to be a string or number.");
	  }
	  //>>includeEnd('debug');
	  return this._hash[key];
	};

	/**
	 * 从数组中移除一个键值对
	 * @param {String|Number} key -要移除的key
	 *
	 * @memberOf AssociativeArray
	 * @returns {Boolean} 移除成功返回true，失败返回false
	 */
	AssociativeArray.prototype.remove = function (key) {
	  //>>includeStart('debug', pragmas.debug);
	  if (Defined(key) && typeof key !== "string" && typeof key !== "number") {
	    throw new DeveloperError("key is required to be a string or number.");
	  }
	  //>>includeEnd('debug');

	  var value = this._hash[key];
	  var hasValue = Defined(value);
	  if (hasValue) {
	    var array = this._array;
	    array.splice(array.indexOf(value), 1);
	    delete this._hash[key];
	  }
	  return hasValue;
	};

	/**
	 * 移除所有键值对
	 * @memberOf AssociativeArray
	 */
	AssociativeArray.prototype.removeAll = function () {
	  var array = this._array;
	  if (array.length > 0) {
	    this._hash = {};
	    array.length = 0;
	  }
	};

	//==========================================================================
	// 版权所有，航天宏图信息技术股份有限公司，2023-02
	// 本接口只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播
	// 团队：        PIEMap SDK For UE WebClient Team
	// 文件名：      GenerateGuid.js
	// 功能：        guid创建
	// 修改者：      gongyinliang
	// 审查者：
	// 最后修改时间：
	//==========================================================================

	function GenerateGuid() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = Math.random() * 16 | 0,
	      v = c == 'x' ? r : r & 0x3 | 0x8;
	    return v.toString(16);
	  });
	}

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 数据源模块
	 * ---
	 */

	/**
	 *
	 * 实体集合操作函数
	 * @name EntityCollection
	 * @extends BaseObject
	 *
	 */
	var EntityCollection = /*#__PURE__*/function (_BaseObject) {
	  _inherits(EntityCollection, _BaseObject);
	  var _super = _createSuper(EntityCollection);
	  function EntityCollection(name) {
	    var _this;
	    _classCallCheck(this, EntityCollection);
	    _this = _super.call(this, "EntityCollection");
	    _this.name = name;
	    _this.pre = null;
	    _this.statement = {
	      type: "Invocation",
	      arguments: {
	        name: name
	      },
	      functionName: "EntityCollection"
	    };
	    _this._entities = new AssociativeArray();
	    _this._addedEntities = new AssociativeArray();
	    _this._removedEntities = new AssociativeArray();
	    _this._changedEntities = new AssociativeArray();
	    _this._suspendCount = 0;
	    _this._id = GenerateGuid();
	    _this._show = true;
	    return _this;
	  }
	  return _createClass(EntityCollection);
	}(BaseObject);
	Object.assign(EntityCollection.prototype, {
	  /**
	   * 计算长度
	   *
	   * @memberOf EntityCollection#
	   * @returns {EntityCollection} 返回实体集合
	   */
	  length: function length() {
	    var entityCollection = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        entityCollection: entityCollection
	      },
	      functionName: "EntityCollection.length"
	    };
	    var entityCollectionObject = new EntityCollection();
	    entityCollectionObject.pre = this;
	    entityCollectionObject.statement = obj;
	    return entityCollectionObject;
	  },
	  /**
	   * 添加实体
	   * @param {Entity} entity -要添加的实体
	   *
	   * @memberOf EntityCollection#
	   * @returns {EntityCollection} 返回实体集合
	   */
	  add: function add(entity) {
	    var entityCollection = this.statement;
	    var entityJsonStr = JSON.stringify(entity);
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        entityCollection: entityCollection,
	        entityJsonStr: entityJsonStr
	      },
	      functionName: "EntityCollection.add"
	    };
	    var entityCollectionObject = new EntityCollection();
	    entityCollectionObject.pre = this;
	    entityCollectionObject.statement = obj;
	    return entityCollectionObject;
	  },
	  /**
	   * 移除实体
	   * @param {Number} index -要删除的实体的索引
	   * @param {Boolean} destroy -除了删除实体外，是否还要破坏这些实体
	   *
	   * @memberOf EntityCollection#
	   * @returns {EntityCollection} 返回实体集合
	   */
	  remove: function remove(index, destroy) {
	    var entityCollection = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        entityCollection: entityCollection,
	        index: index
	      },
	      functionName: "EntityCollection.remove"
	    };
	    var entityCollectionObject = new EntityCollection();
	    entityCollectionObject.pre = this;
	    entityCollectionObject.statement = obj;
	    return entityCollectionObject;
	  }
	});

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 *
	 * 实景三维数据集合
	 * @name Layer3DCollection
	 *
	 * @extends BaseObject
	 */
	var Layer3DCollection = /*#__PURE__*/function (_BaseObject) {
	  _inherits(Layer3DCollection, _BaseObject);
	  var _super = _createSuper(Layer3DCollection);
	  function Layer3DCollection(name) {
	    var _this;
	    _classCallCheck(this, Layer3DCollection);
	    _this = _super.call(this, "Layer3DCollection");
	    _this.name = name;
	    _this.pre = null;
	    _this.statement = {
	      type: "Invocation",
	      arguments: {
	        name: name
	      },
	      functionName: "Layer3DCollection"
	    };
	    return _this;
	  }
	  return _createClass(Layer3DCollection);
	}(BaseObject);
	Object.assign(Layer3DCollection.prototype, {
	  /**
	   * 计算三维图层集合的长度
	   *
	   * @memberOf Layer3DCollection#
	   * @returns {Layer3DCollection} 返回三维场景集合
	   */
	  length: function length() {
	    var layer3DCollection = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        layer3DCollection: layer3DCollection
	      },
	      functionName: "Layer3DCollection.length"
	    };
	    var layer3DCollectionObject = new Layer3DCollection();
	    layer3DCollectionObject.pre = this;
	    layer3DCollectionObject.statement = obj;
	    return layer3DCollectionObject;
	  },
	  /**
	   * 添加实景三维图层
	   * @param {Layer3DProvider} layer3DProvider -实景三维图层
	   * @param {Number} index -在其上添加图层的索引
	   *
	   * @memberOf Layer3DCollection#
	   * @returns {Layer3DCollection} 返回三维图层集合
	   */
	  addLayer3DProvider: function addLayer3DProvider(layer3DProvider, index) {
	    if (!Defined(layer3DProvider)) {
	      throw new DeveloperError("layer3DProvider is required.");
	    }
	    var layer3DCollection = this.statement;
	    var options = layer3DProvider;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        layer3DCollection: layer3DCollection,
	        options: options
	      },
	      functionName: "Layer3DCollection.add"
	    };
	    var layer3DCollectionObject = new Layer3DCollection();
	    layer3DCollectionObject.pre = this;
	    layer3DCollectionObject.statement = obj;
	    return layer3DCollectionObject;
	  },
	  /**
	   * 添加图层
	   * @param {Layer3D} layer -要添加的图层
	   * @param {Number} index -在其上添加图层的索引
	   *
	   * @memberOf Layer3DCollection#
	   * @returns {Layer3DCollection} 返回三维图层集合
	   */
	  add: function add(layer, index) {
	    var layer3DCollection = this.statement;
	    var options = layer.layer3DProvider;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        layer3DCollection: layer3DCollection,
	        options: options
	      },
	      functionName: "Layer3DCollection.add"
	    };
	    var layer3DCollectionObject = new Layer3DCollection();
	    layer3DCollectionObject.pre = this;
	    layer3DCollectionObject.statement = obj;
	    return layer3DCollectionObject;
	  },
	  /**
	   * 从该集合中删除一个图层（如果存在）
	   * @param {Number} index -要删除的图层索引
	   * @param {Boolean} destroy -除了删除图层外，是否还要破坏这些图层
	   *
	   * @memberOf Layer3DCollection#
	   * @returns {Layer3DCollection} 返回三维图层集合
	   */
	  remove: function remove(index, destroy) {
	    var layer3DCollection = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        layer3DCollection: layer3DCollection,
	        index: index
	      },
	      functionName: "Layer3DCollection.remove"
	    };
	    var layer3DCollectionObject = new Layer3DCollection();
	    layer3DCollectionObject.pre = this;
	    layer3DCollectionObject.statement = obj;
	    return layer3DCollectionObject;
	  }
	});

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 *
	 * 影像图层集合
	 * @name ImageryLayerCollection
	 *
	 * @extends BaseObject
	 */
	var ImageryLayerCollection = /*#__PURE__*/function (_BaseObject) {
	  _inherits(ImageryLayerCollection, _BaseObject);
	  var _super = _createSuper(ImageryLayerCollection);
	  function ImageryLayerCollection(name) {
	    var _this;
	    _classCallCheck(this, ImageryLayerCollection);
	    _this = _super.call(this, "ImageryLayerCollection");
	    _this.name = name;
	    _this.pre = null;
	    _this.statement = {
	      type: "Invocation",
	      arguments: {
	        name: name
	      },
	      functionName: "ImageryLayerCollection"
	    };
	    return _this;
	  }
	  return _createClass(ImageryLayerCollection);
	}(BaseObject);
	Object.assign(ImageryLayerCollection.prototype, {
	  /**
	   * 计算影像图层长度
	   *
	   * @memberOf ImageryLayerCollection#
	   * @returns {Layer3DCollection} 返回三维数组集合
	   */
	  length: function length() {
	    var layer3DCollection = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        layer3DCollection: layer3DCollection
	      },
	      functionName: "ImageryLayerCollection.length"
	    };
	    var object = new Layer3DCollection();
	    object.pre = this;
	    object.statement = obj;
	    return object;
	  },
	  /**
	   * 添加影像数据参数
	   * @param {ImageryProvider} imageryProvider -影像数据参数
	   * @param {Number} index -在其上添加图层的索引
	   *
	   * @memberOf ImageryLayerCollection#
	   * @returns {ImageryLayerCollection} 返回影像图层集合
	   */
	  addImageryProvider: function addImageryProvider(imageryProvider, index) {
	    if (!Defined(imageryProvider)) {
	      throw new DeveloperError("imageryProvider is required.");
	    }
	    var imageryLayerCollection = this.statement;
	    var options = imageryProvider;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        imageryLayerCollection: imageryLayerCollection,
	        options: options
	      },
	      functionName: "ImageryLayerCollection.add"
	    };
	    var imageryLayerCollectionObject = new ImageryLayerCollection();
	    imageryLayerCollectionObject.pre = this;
	    imageryLayerCollectionObject.statement = obj;
	    return imageryLayerCollectionObject;
	  },
	  /**
	   * 添加图层
	   * @param {ImageryLayer} layer -要添加的图层
	   * @param {Number} index -在其上添加图层的索引
	   *
	   * @memberOf ImageryLayerCollection#
	   * @returns {ImageryLayerCollection} 返回影像图层集合
	   */
	  add: function add(layer, index) {
	    var imageryLayerCollection = this.statement;
	    var options = layer.imageryProvider;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        imageryLayerCollection: imageryLayerCollection,
	        options: options
	      },
	      functionName: "ImageryLayerCollection.add"
	    };
	    var imageryLayerCollectionOject = new ImageryLayerCollection();
	    imageryLayerCollectionOject.pre = this;
	    imageryLayerCollectionOject.statement = obj;
	    return imageryLayerCollectionOject;
	  },
	  /**
	   * 从该集合中删除一个图层（如果存在）
	   * @param {Number} index -要删除的图层索引
	   * @param {Boolean} destroy -除了删除图层外，是否还要破坏这些图层
	   *
	   * @memberOf ImageryLayerCollection#
	   * @returns {ImageryLayerCollection} 返回影像图层集合
	   */
	  remove: function remove(index, destroy) {
	    var imageryLayerCollection = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        imageryLayerCollection: imageryLayerCollection,
	        index: index
	      },
	      functionName: "ImageryLayerCollection.remove"
	    };
	    var imageryLayerCollectionOject = new ImageryLayerCollection();
	    imageryLayerCollectionOject.pre = this;
	    imageryLayerCollectionOject.statement = obj;
	    return imageryLayerCollectionOject;
	  }
	});

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 *
	 * 场景操作函数
	 * @name Scene
	 *
	 * @extends BaseObject
	 */
	var Scene = /*#__PURE__*/function (_BaseObject) {
	  _inherits(Scene, _BaseObject);
	  var _super = _createSuper(Scene);
	  function Scene(name) {
	    var _this;
	    _classCallCheck(this, Scene);
	    _this = _super.call(this, "Scene");
	    _this.name = name;
	    _this.pre = null;
	    _this.statement = {
	      type: "Invocation",
	      arguments: {
	        name: name
	      },
	      functionName: "Scene"
	    };
	    return _this;
	  }
	  return _createClass(Scene);
	}(BaseObject);
	Object.assign(Scene.prototype, {
	  /**
	   * 获取相机
	   *
	   * @memberOf Scene#
	   * @returns {Camera} 返回相机
	   */
	  getCamera: function getCamera() {
	    var scene = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        scene: scene
	      },
	      functionName: "Scene.getCamera"
	    };
	    var cameraObject = new Camera();
	    cameraObject.pre = this;
	    cameraObject.statement = obj;
	    return cameraObject;
	  },
	  /**
	   * 获取影像数据集合
	   *
	   * @memberOf Scene#
	   * @returns {ImageryLayerCollection} 返回影像图层集合
	   */
	  getImageryLayers: function getImageryLayers() {
	    var scene = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        scene: scene
	      },
	      functionName: "Scene.getImageryLayers"
	    };
	    var imageryLayerCollectionObject = new ImageryLayerCollection();
	    imageryLayerCollectionObject.pre = this;
	    imageryLayerCollectionObject.statement = obj;
	    return imageryLayerCollectionObject;
	  },
	  /**
	   * 获取实景三维数据集合
	   *
	   * @memberOf Scene#
	   * @returns {Layer3DCollection} 返回实景三维数据集合
	   */
	  get3DLayers: function get3DLayers() {
	    var scene = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        scene: scene
	      },
	      functionName: "Scene.get3DLayers"
	    };
	    var layer3DCollectionObject = new Layer3DCollection();
	    layer3DCollectionObject.pre = this;
	    layer3DCollectionObject.statement = obj;
	    return layer3DCollectionObject;
	  },
	  /**
	   * 获取实体
	   *
	   * @memberOf Scene#
	   * @returns {EntityCollection} 返回实体集合
	   */
	  getEntities: function getEntities() {
	    var scene = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        scene: scene
	      },
	      functionName: "Scene.getEntities"
	    };
	    var entityCollectionObject = new EntityCollection();
	    entityCollectionObject.pre = this;
	    entityCollectionObject.statement = obj;
	    return entityCollectionObject;
	  },
	  /**
	   * 添加地形数据
	   * @param {TerrainProvider} terrainProvider -地形参数定义
	   *
	   * @memberOf Scene#
	   * @returns {Scene} 返回场景
	   */
	  setTerrainProvider: function setTerrainProvider(terrainProvider) {
	    var scene = this.statement;
	    var options = terrainProvider;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        scene: scene,
	        options: options
	      },
	      functionName: "Scene.setTerrainProvider"
	    };
	    var sceneObject = new Scene(this.name);
	    sceneObject.pre = this;
	    sceneObject.statement = obj;
	    return sceneObject;
	  }
	});

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 * 影像图层操作函数
	 * @name ImageryLayer
	 * @class ImageryLayer
	 * 影像图层
	 */
	var ImageryLayer = /*#__PURE__*/_createClass(function ImageryLayer(imageryProvider, options) {
	  _classCallCheck(this, ImageryLayer);
	  this.imageryProvider = imageryProvider;
	});

	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 基础模块
	 * ---
	 */

	/**
	 * 矩形盒子操作函数
	 * @name BoundingRectangle
	 * @class BoundingRectangle
	 *
	 * @param {Number} left 矩形的x坐标
	 * @param {Number} top 矩形的y坐标
	 * @param {Number} right 矩形的宽度
	 * @param {Number} bottom 矩形的高度
	 *
	 */
	function BoundingRectangle(left, top, right, bottom) {
	  this.left = DefaultValue(left, 0.0);
	  this.top = DefaultValue(top, 0.0);
	  this.right = DefaultValue(right, 0.0);
	  this.bottom = DefaultValue(bottom, 0.0);
	}
	Object.assign(BoundingRectangle.prototype, {
	  left: {
	    /**
	     * 获取矩形的x坐标
	     * @memberOf BoundingRectangle#
	     * @returns {Number} 返回矩形的x坐标
	     */
	    get: function get() {
	      return this.left;
	    },
	    /**
	     * 设置矩形的x坐标
	     * @param {Number} value -x坐标的值
	     *
	     * @memberOf BoundingRectangle#
	     */
	    set: function set(value) {
	      this.left = value;
	    }
	  },
	  top: {
	    /**
	     * 获取矩形的y坐标
	     *
	     * @memberOf BoundingRectangle#
	     * @returns {Number} 返回矩形的y坐标
	     */
	    get: function get() {
	      return this.top;
	    },
	    /**
	     * 设置矩形的y坐标
	     * @param {Number} value -y坐标的值
	     *
	     * @memberOf BoundingRectangle#
	     */
	    set: function set(value) {
	      this.top = value;
	    }
	  },
	  right: {
	    /**
	     * 获取矩形的宽度
	     *
	     * @memberOf BoundingRectangle#
	     * @returns {Number} 返回矩形的宽度
	     */
	    get: function get() {
	      return this.right;
	    },
	    /**
	     * 设置矩形的宽度
	     * @param {Number}  value -矩形的宽度值
	     *
	     * @memberOf BoundingRectangle#
	     */
	    set: function set(value) {
	      this.rich = value;
	    }
	  },
	  bottom: {
	    /**
	     * 获取矩形的高度
	     *
	     * @memberOf BoundingRectangle#
	     * @returns {Number} 返回矩形的高度
	     */
	    get: function get() {
	      return this.bottom;
	    },
	    /**
	     * 设置矩形的高度
	     * @param {Number} value -矩形的高度值
	     *
	     * @memberOf BoundingRectangle#
	     */
	    set: function set(value) {
	      this.bottom = value;
	    }
	  }
	});

	/**
	 * 用于将对象打包到数组中的元素数
	 * @type {Number}
	 */
	BoundingRectangle.packedLength = 4;
	BoundingRectangle.MAX_VALUE = Object.freeze(new BoundingRectangle(-20037508.342789243906736, 20037508.342789243906736, 20037508.342789243906736, -20037508.342789243906736));

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 * 影像数据参数基类
	 * @name ImageryProvider
	 * @class ImageryProvider
	 * 影像数据参数
	 */
	var ImageryProvider = /*#__PURE__*/_createClass(function ImageryProvider(options) {
	  _classCallCheck(this, ImageryProvider);
	  this.label = DefaultValue(options.label, "defaultLabel");
	  this.guid = DefaultValue(options.guid, GenerateGuid());
	  this.providerName = undefined;
	});

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 * 模板类影像参数
	 * @name UrlTemplateImageryProvider
	 *
	 * @extends ImageryProvider
	 */
	var UrlTemplateImageryProvider = /*#__PURE__*/function (_ImageryProvider) {
	  _inherits(UrlTemplateImageryProvider, _ImageryProvider);
	  var _super = _createSuper(UrlTemplateImageryProvider);
	  function UrlTemplateImageryProvider(options) {
	    var _this;
	    _classCallCheck(this, UrlTemplateImageryProvider);
	    _this = _super.call(this, options);
	    _this.uri = DefaultValue(options.uri, "");
	    _this.url = DefaultValue(options.url, "");
	    _this.cacheUrl = DefaultValue(options.cacheUrl, "");
	    _this.boundingRectangle = DefaultValue(options.boundingRectangle, BoundingRectangle.MAX_VALUE);
	    _this.epsg = DefaultValue(options.epsg, 3857);
	    _this.providerName = "UrlTemplateImageryProvider";
	    return _this;
	  }
	  return _createClass(UrlTemplateImageryProvider);
	}(ImageryProvider);

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 * 实景三维数据
	 * @name Layer3D
	 *
	 * @class Layer3D
	 */
	var Layer3D = /*#__PURE__*/_createClass(function Layer3D(layer3DProvider, options) {
	  _classCallCheck(this, Layer3D);
	  this.layer3DProvider = layer3DProvider;
	});

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 * 实景三维数据参数
	 * @name Layer3DProvider
	 *
	 * @class Layer3DProvider
	 */
	var Layer3DProvider = /*#__PURE__*/_createClass(function Layer3DProvider(options) {
	  _classCallCheck(this, Layer3DProvider);
	  this.label = DefaultValue(options.label, "defaultLabel");
	  this.guid = DefaultValue(options.guid, GenerateGuid());
	  this.providerName = undefined;
	});

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 * osgb参数
	 * @name OSGBProvider
	 * @extends Layer3DProvider
	 *
	 */
	var OSGBProvider = /*#__PURE__*/function (_Layer3DProvider) {
	  _inherits(OSGBProvider, _Layer3DProvider);
	  var _super = _createSuper(OSGBProvider);
	  function OSGBProvider(options) {
	    var _this;
	    _classCallCheck(this, OSGBProvider);
	    _this = _super.call(this, options);
	    _this.uri = DefaultValue(options.uri, "");
	    _this.url = DefaultValue(options.url, "");
	    _this.tileUrl = DefaultValue(options.tileUrl, "");
	    _this.cacheUrl = DefaultValue(options.cacheUrl, "");
	    _this.position = DefaultValue(options.position, new Cartesian3());
	    _this.offset = DefaultValue(options.offset, new Cartesian3());
	    _this.autoProjection = DefaultValue(options.autoProjection, true);
	    _this.providerName = "OSGBProvider";
	    return _this;
	  }
	  return _createClass(OSGBProvider);
	}(Layer3DProvider);

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 * 地形参数定义
	 * @name TerrainProvider
	 * @class TerrainProvider
	 */
	var TerrainProvider = /*#__PURE__*/_createClass(function TerrainProvider(options) {
	  _classCallCheck(this, TerrainProvider);
	  this.label = DefaultValue(options.label, "defaultLabel");
	  this.guid = DefaultValue(options.guid, GenerateGuid());
	  this.providerName = undefined;
	});

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 * cesium地形参数操作函数
	 * @name EngineTerrainProvider
	 * @extends TerrainProvider
	 *
	 */
	var EngineTerrainProvider = /*#__PURE__*/function (_TerrainProvider) {
	  _inherits(EngineTerrainProvider, _TerrainProvider);
	  var _super = _createSuper(EngineTerrainProvider);
	  function EngineTerrainProvider(options) {
	    var _this;
	    _classCallCheck(this, EngineTerrainProvider);
	    _this = _super.call(this, options);
	    _this.url = DefaultValue(options.url, "");
	    _this.cacheUrl = DefaultValue(options.cacheUrl, "");
	    _this.minLevel = DefaultValue(options.minLevel, 0);
	    _this.maxLevel = DefaultValue(options.maxLevel, 18);
	    _this.isTMSServer = DefaultValue(options.isTMSServer, true);
	    _this.providerName = "EngineTerrainProvider";
	    return _this;
	  }
	  return _createClass(EngineTerrainProvider);
	}(TerrainProvider);

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 场景模块
	 * ---
	 */

	/**
	 * 默认地形参数操作函数
	 * @name EllipsoidTerrainProvider
	 * @extends TerrainProvider
	 */
	var EllipsoidTerrainProvider = /*#__PURE__*/function (_TerrainProvider) {
	  _inherits(EllipsoidTerrainProvider, _TerrainProvider);
	  var _super = _createSuper(EllipsoidTerrainProvider);
	  function EllipsoidTerrainProvider(options) {
	    var _this;
	    _classCallCheck(this, EllipsoidTerrainProvider);
	    _this = _super.call(this, options);
	    _this.providerName = "EllipsoidTerrainProvider";
	    return _this;
	  }
	  return _createClass(EllipsoidTerrainProvider);
	}(TerrainProvider);

	//==========================================================================
	var Execute = function () {
	  var instance = null;
	  return function () {
	    if (instance != null) {
	      return instance;
	    }
	    this.ws = null; //websocket链接
	    this.listeners = []; //UE直接回传的监听器
	    this.eventMap = {}; //普通函数的返回值存储器，key是guid value是函数的回调函数，即返回值
	    return instance = this;
	  };
	}();
	Execute.eventListeners_1 = [];
	Execute.eventListeners = [];
	Execute.prototype.addListener = function (listener) {
	  this.listeners.push(listener);
	};
	Execute.prototype.removeListener = function (listener) {
	  for (var i = 0; i < this.listeners.length; i++) {
	    if (this.listeners[i] == listener) {
	      this.listeners.splice(i, 1);
	    }
	  }
	};
	Execute.prototype.addMessageListener = function (messageType, listener) {
	  var messageListersobject = {
	    messageType: messageType,
	    listeners: []
	  };
	  for (var i = 0; i < Execute.eventListeners.length; i++) {
	    if (Execute.eventListeners[i].messageType == messageType) {
	      messageListersobject = Execute.eventListeners[i];
	      break;
	    }
	    continue;
	  }
	  messageListersobject.listeners.push(listener);
	  if (messageListersobject.listeners.length == 1) {
	    Execute.eventListeners.push(messageListersobject);
	  }
	};
	Execute.prototype.removeMessageListener = function (messageType, listener) {
	  for (var i = 0; i < Execute.eventListeners.length; i++) {
	    if (Execute.eventListeners[i].messageType == messageType) {
	      Execute.eventListeners[i].listeners.slice(listener);
	    }
	  }
	};
	Execute.prototype.load = function (wsUrl, callback) {
	  if (this.ws == null) {
	    var that = this;
	    this.ws = new WebSocket(wsUrl);
	    this.ws.onopen = function () {
	      callback();
	    };
	    this.ws.onmessage = function (evt) {
	      var inputMessage = decodeURIComponent(evt.data);
	      var message = JSON.parse(inputMessage);
	      var received_msg = JSON.stringify(message);
	      console.log("received_msg" + received_msg);
	      if (Execute.eventListeners_1) {
	        console.log("Execute.eventListeners_1", Execute.eventListeners_1.length);
	      }
	      if ("fid" in message) {
	        console.log("\"fid\" in message");
	        //如果传过来的消息中含有fid字段
	        if (message != null && message.fid != null) {
	          //执行回调函数，返回message.data
	          if (that.eventMap && that.eventMap[message.fid]) {
	            that.eventMap[message.fid](message);
	            delete that.eventMap[message.fid];
	          }
	        }
	      } else if ("MessageType" in message) {
	        console.log("\"fid\" MessageType message");
	        if (Execute.eventListeners) {
	          console.log("\"fid\" MessageType message", Execute.eventListeners.length);
	          for (var i = 0; i < Execute.eventListeners.length; i++) {
	            if (Execute.eventListeners[i].messageType == message.MessageType) {
	              for (var j = 0; j < Execute.eventListeners[i].listeners.length; j++) {
	                Execute.eventListeners[i].listeners[j](received_msg);
	              }
	            }
	          }
	        }
	      } else {
	        //如果传过来的消息没有fid字段证明是UE主动发送的信号，使用Listener处理
	        that.listeners.length;
	        for (i = 0; i < that.listeners.length; i++) {
	          that.listeners[i](received_msg);
	        }
	      }
	    };
	    this.ws.onclose = function () {};
	  }
	};
	Execute.prototype.registerMessageListener = function (messageType, callBack) {
	  if (this.ws != null && callBack != null) {
	    var statement = {
	      "function": "registerMessageListener",
	      callBack: callBack
	    };
	    statement = Execute.formatURLParam(statement);
	    statement = decodeURIComponent(statement);
	    statement = JSON.parse(statement);
	    //1.首先生成函数对应的唯一标识guid
	    var register_message_guid = GenerateGuid();
	    //3.将fid和js执行结果对象组成一个结构体
	    var message = {
	      register_message_guid: register_message_guid,
	      statement: statement
	    };
	    //4.序列化并发送至js后台
	    var sendText = Execute.formatURLParam(message);
	    this.ws.send(sendText);
	  }
	};
	Execute.prototype.unRegisterMessageListener = function (messageType, callBack) {
	  for (var i = 0; i < this.messageListers.length; i++) {
	    if (Execute.messageListers[i].messageType == messageType) {
	      Execute.messageListers[i].listeners.slice(callBack);
	      if (Execute.messageListers[i].listeners.length <= 0) {
	        if (this.ws != null && callBack != null) {
	          var statement = {
	            "function": "unRegisterMessageListener",
	            callBack: callBack
	          };
	          statement = this.formatURLParam(statement);
	          statement = decodeURIComponent(statement);
	          statement = JSON.parse(statement);
	          //1.首先生成函数对应的唯一标识guid
	          var unregister_message_guid = GenerateGuid();
	          //3.将fid和js执行结果对象组成一个结构体
	          var message = {
	            unregister_message_guid: unregister_message_guid,
	            statement: statement
	          };
	          //4.序列化并发送至js后台
	          var sendText = this.formatURLParam(message);
	          this.ws.send(sendText);
	        }
	      }
	    }
	  }
	};
	Execute.prototype.run = function (element, callBack) {
	  if (this.ws != null && element != null) {
	    var statement = element._evaluate();
	    statement = decodeURIComponent(statement);
	    statement = JSON.parse(statement);
	    //1.首先生成函数对应的唯一标识guid
	    var fid = GenerateGuid();
	    //2.eventMap里记录下这个id及其返回值（callBack回调函数）
	    this.eventMap[fid] = callBack;
	    //3.将fid和js执行结果对象组成一个结构体
	    var message = {
	      fid: fid,
	      statement: statement
	    };
	    //4.序列化并发送至js后台
	    var sendText = this.formatURLParam(message);
	    if (this.ws.readyState === 1) {
	      this.ws.send(sendText);
	    }
	    //
	  }
	};

	Execute.prototype.returnData = function (result) {
	  if (result.code != 0) {
	    console.log("return code != 0");
	    console.log(result);
	  }
	  console.log("functionName = " + result.data.statement.functionName);
	  //console.log("arguments = " + result.data.statement.arguments.name);
	};

	Execute.prototype.formatURLParam = function (value) {
	  var _value = JSON.stringify(value);
	  _value = encodeURIComponent(_value);
	  _value = _value.replace("%20", " ");
	  return _value;
	};
	Execute.prototype.waitForConnection = function (callBack, interval) {
	  if (this.ws.readyState === 1) {
	    callBack();
	  } else {
	    var that = this;
	    setTimeout(function () {
	      that.waitForConnection(callBack, interval);
	    }, interval);
	  }
	};

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 基础模块
	 * ---
	 */

	/**
	 *
	 * 消息管理器操作函数
	 * @name World
	 *
	 * @extends Object
	 */
	var MessageManager = /*#__PURE__*/function (_BaseObject) {
	  _inherits(MessageManager, _BaseObject);
	  var _super = _createSuper(MessageManager);
	  function MessageManager() {
	    var _this;
	    _classCallCheck(this, MessageManager);
	    _this = _super.call(this);
	    _this.pre = null;
	    _this.statement = {
	      type: "Invocation",
	      arguments: {
	        name: "MessageManager"
	      },
	      functionName: "MessageManager"
	    };
	    _this.messageListers = [];
	    return _this;
	  }
	  return _createClass(MessageManager);
	}(BaseObject);
	Object.assign(EntityCollection.prototype, {
	  /**
	   * 注册监听器
	   * @param {Number} messageType -类型
	   * @param {Listener} listener -监听器
	   *
	   * @memberOf MessageManager#
	   * @returns {MessageManager}  返回消息管理器
	   */
	  registerListener: function registerListener(messageType, listener) {
	    var messageListersobject = {
	      messageType: messageType,
	      listeners: []
	    };
	    for (var i = 0; i < this.messageListers.length; i++) {
	      if (this.messageListers[i].messageType == messageType) {
	        messageListersobject = this.messageListers[i];
	        break;
	      }
	      continue;
	    }
	    messageListersobject.listeners.push(listener);
	    if (messageListersobject.listeners.length == 1) {
	      this.messageListers.push(messageListersobject);
	    }
	    var messageManager = this.statement;
	    var obj = {
	      type: "Invocation",
	      arguments: {
	        messageManager: messageManager,
	        messageType: messageType
	      },
	      functionName: "MessageManager.registerListener"
	    };
	    var messageManagerObject = new MessageManager();
	    messageManagerObject.pre = this;
	    messageManagerObject.statement = obj;
	    return messageManagerObject;
	  },
	  /**
	   * 注销监听器
	   * @param {Number} messageType -类型
	   * @param {Listener} listener -监听器
	   *
	   * @memberOf MessageManager#
	   * @returns {MessageManager}  返回消息管理器
	   */
	  unRegisterListener: function unRegisterListener(messageType, listener) {
	    for (var i = 0; i < this.messageListers.length; i++) {
	      if (this.messageListers[i].messageType == messageType) {
	        this.messageListers[i].listeners.slice(listener);
	        if (this.messageListers[i].listeners.length <= 0) {
	          var messageManager = this.statement;
	          var obj = {
	            type: "Invocation",
	            arguments: {
	              messageManager: messageManager,
	              messageType: messageType
	            },
	            functionName: "MessageManager.unRegisterListener"
	          };
	          var messageManagerObject = new MessageManager();
	          messageManagerObject.pre = this;
	          messageManagerObject.statement = obj;
	          return messageManagerObject;
	        }
	      }
	    }
	  }
	});

	function Viewer(container, options) {
	  //>>includeStart('debug', pragmas.debug);
	  //     if (!Defined(container)) {
	  //         throw new DeveloperError("container is required.");
	  //     }
	  //     //>>includeEnd('debug');
	  //     container = GetElement(container);
	  //     options = defaultValue(options, defaultValue.EMPTY_OBJECT);

	  //连接webSocket
	  var wsUrl = DefaultValue(options.wsUrl, new Scene(""));
	  if (!Defined(wsUrl)) {
	    throw new DeveloperError("wsUrl is NULL.");
	  }
	  var execute = new Execute();
	  execute.load(wsUrl, function () {});

	  //scene
	  var scene = DefaultValue(options.scene, new Scene("defaultScene"));

	  //terrainProvider
	  var terrainProvider = DefaultValue(options.terrainProvider, undefined);
	  this._execute = execute;
	  this._container = container;
	  this._scene = scene;
	  this.terrainProvider = terrainProvider;
	}
	Object.defineProperties(Viewer.prototype, {
	  /**
	   * Gets the parent container.
	   * @memberof Viewer.prototype
	   * @type {Element}
	   * @readonly
	   */
	  container: {
	    get: function get() {
	      return this._container;
	    }
	  },
	  /**
	   * Gets the scene.
	   * @memberof Viewer.prototype
	   * @type {Element}
	   * @readonly
	   */
	  scene: {
	    get: function get() {
	      return this._scene;
	    }
	  },
	  /**
	   * Gets the camera.
	   * @memberof Viewer.prototype
	   * @type {Element}
	   * @readonly
	   */
	  camera: {
	    get: function get() {
	      return this._scene.getCamera();
	    }
	  },
	  /**
	   * Set/Gets the terrainProvider.
	   * @memberof Viewer.prototype
	   * @type {Element}
	   * @readonly
	   */
	  terrainProvider: {
	    get: function get() {
	      return this._terrainProvider;
	    },
	    set: function set(value) {
	      var _this = this;
	      if (value) {
	        new Promise(function (resolve) {
	          var setTerrainProvider = _this.scene.setTerrainProvider(value);
	          _this.execute(setTerrainProvider, function (data) {
	            resolve(data);
	          });
	        });
	        this._terrainProvider = value;
	      }
	    }
	  },
	  /**
	   * Gets the imageryLayers.
	   * @memberof Viewer.prototype
	   * @type {Element}
	   * @readonly
	   */
	  imageryLayers: {
	    get: function get() {
	      return this._scene.getImageryLayers();
	    }
	  },
	  /**
	   * Gets the layers3D.
	   * @memberof Viewer.prototype
	   * @type {Element}
	   * @readonly
	   */
	  layers3D: {
	    get: function get() {
	      return this._scene.get3DLayers();
	    }
	  },
	  /**
	   * Gets the entities.
	   * @memberof Viewer.prototype
	   * @type {Element}
	   * @readonly
	   */
	  entities: {
	    get: function get() {
	      return this._scene.getEntities();
	    }
	  }
	});
	Viewer.prototype.flyTo = function (options) {
	  var _this2 = this;
	  return new Promise(function (resolve) {
	    var result = _this2.camera.flyTo(options["long"], options.lat, options.zoomDistance, options.pitch, options.heading);
	    _this2.execute(result, function (data) {
	      resolve(data);
	    });
	  });
	};
	Viewer.prototype.execute = function (element, callBack) {
	  return this._execute.run(element, callBack);
	};
	Viewer.prototype.addListener = function (listener) {
	  return this._execute.addListener(listener);
	};
	Viewer.prototype.removeListener = function (listener) {
	  return this._execute.removeListener(listener);
	};

	//==========================================================================

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 数据源模块
	 * ---
	 */

	/**
	 * 常量属性操作函数
	 * @param {String} value -属性
	 * @class ConstantProperty
	 * 常量属性
	 */
	function ConstantProperty(value) {
	  this._value = undefined;
	  this._hasClone = false;
	  this._hasEquals = false;
	  this.setValue(value);
	}
	Object.defineProperties(ConstantProperty.prototype, {
	  isConstant: {
	    value: true
	  }
	});

	/**
	 * 获取属性值
	 * @param {JulianDate} time -检索值的时间。此参数未使用，因为该值不随时间变化
	 * @param {Object} result -如果省略用于存储值的对象，则创建并返回一个新实例
	 *
	 * @memberOf ConstantProperty
	 * @returns {Object} 返回修改后的结果参数或一个新实例(如果没有提供结果参数)
	 */
	ConstantProperty.prototype.getValue = function (time, result) {
	  return this._hasClone ? this._value.clone(result) : this._value;
	};

	/**
	 * 设置属性值
	 * @param {string} value -属性值
	 *
	 * @memberOf ConstantProperty
	 */
	ConstantProperty.prototype.setValue = function (value) {
	  var oldValue = this._value;
	  if (oldValue !== value) {
	    var isDefined = Defined(value);
	    isDefined && typeof value.clone === "function";
	    isDefined && typeof value.equals === "function";
	  }
	};
	ConstantProperty.prototype.equals = function (other) {
	  return this === other ||
	  //
	  other instanceof ConstantProperty && (
	  //
	  !this._hasEquals && this._value === other._value ||
	  //
	  this._hasEquals && this._value.equals(other._value));
	};

	/**
	 * 获取此属性的值
	 *
	 * @memberOf ConstantProperty
	 * @returns {String} 返回此属性的值
	 */
	ConstantProperty.prototype.valueOf = function () {
	  return this._value;
	};

	/**
	 * 创建表示此属性值的字符串
	 *
	 * @memberOf ConstantProperty
	 * @returns {String} 表示属性值的字符串
	 */
	ConstantProperty.prototype.toString = function () {
	  return String(this._value);
	};

	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 数据源模块
	 * ---
	 */

	function CreateProperty(name, privateName, subscriptionName, configurable, createPropertyCallback) {
	  return {
	    configurable: configurable,
	    get: function get() {
	      return this[privateName];
	    },
	    set: function set(value) {
	      this[privateName];
	      var subscription = this[subscriptionName];
	      if (Defined(subscription)) {
	        subscription();
	        this[subscriptionName] = undefined;
	      }
	      var hasValue = value !== undefined;
	      if (hasValue && (!Defined(value) || !Defined(value.getValue)) && Defined(createPropertyCallback)) {
	        value = createPropertyCallback(value);
	      }
	    }
	  };
	}
	function createConstantProperty(value) {
	  return new ConstantProperty(value);
	}

	/**
	 * Used to consistently define all DataSources graphics objects.
	 * This is broken into two functions because the Chrome profiler does a better
	 * job of optimizing lookups if it notices that the string is constant throughout the function.
	 * @private
	 */
	function CreatePropertyDescriptor(name, configurable, createPropertyCallback) {
	  //Safari 8.0.3 has a JavaScript bug that causes it to confuse two variables and treat them as the same.
	  //The two extra toString calls work around the issue.
	  return CreateProperty(name, "_".concat(name.toString()), "_".concat(name.toString(), "Subscription"), DefaultValue(configurable, false), DefaultValue(createPropertyCallback, createConstantProperty));
	}

	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 数据源模块
	 * ---
	 */

	/**
	 * 标牌操作函数
	 * @param {Object} options -
	 * @class BillboardGraphics
	 * 标牌
	 */
	function BillboardGraphics(options) {
	  this.type = DefaultValue(options.type, "");
	  this.text = DefaultValue(options.text, "");
	  this.position = DefaultValue(options.position, "");
	  this.textColor = DefaultValue(options.textColor, "");
	}

	/**
	 * 复制标牌
	 * @param {BillboardGraphics} result 要复制的标牌
	 *
	 * @memberOf BillboardGraphics
	 * @returns {BillboardGraphics} 返回新的标牌
	 */
	BillboardGraphics.prototype.clone = function (result) {
	  if (!Defined(result)) {
	    return new BillboardGraphics(this);
	  }
	  result.show = this._show;
	  result.scale = this._scale;
	  result.pixelOffset = this._pixelOffset;
	  return result;
	};

	/**
	 * 将此对象上每个未赋值的属性赋值给该值所提供的源对象上的相同属性
	 * @param {BillboardGraphics}  source -要合并到此对象中的对象
	 *
	 * @memberOf BillboardGraphics
	 */
	BillboardGraphics.prototype.merge = function (source) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!Defined(source)) {
	    throw new DeveloperError("source is required.");
	  }
	  this.show = defaultValue(this._show, source.show);
	  this.scale = defaultValue(this._scale, source.scale);
	  this.pixelOffset = defaultValue(this._pixelOffset, source.pixelOffset);
	};

	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 数据源模块
	 * ---
	 */

	/**
	 * 盒子操作函数
	 * @param {Object} options -
	 * @class BoxGraphics
	 * 盒子
	 */
	function BoxGraphics(options) {
	  this._show = undefined;
	  this._scale = undefined;
	  this._pixelOffset = undefined;
	  this.merge(defaultValue(options, defaultValue.EMPTY_OBJECT));
	}
	Object.defineProperties(BoxGraphics.prototype, {
	  scale: CreatePropertyDescriptor("scale"),
	  pixelOffset: CreatePropertyDescriptor("pixelOffset")
	});

	/**
	 * 复制盒子
	 * @param {BillboardGraphics} result -将结果存储在其上的对象
	 *
	 * @memberOf BoxGraphics
	 * @return {BillboardGraphics/BoxGraphics} 返回盒子
	 */
	BoxGraphics.prototype.clone = function (result) {
	  if (!Defined(result)) {
	    return new BoxGraphics(this);
	  }
	  result.show = this._show;
	  result.scale = this._scale;
	  result.pixelOffset = this._pixelOffset;
	  return result;
	};

	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 数据源模块
	 * ---
	 */

	/**
	 * 模型操作函数
	 * @param {Object} options -
	 * @class ModelGraphics
	 * 模型
	 */
	function ModelGraphics(options) {
	  this.url = DefaultValue(options.url, "");
	  this.position = DefaultValue(options.position, "");
	  this.rotation = DefaultValue(options.rotation, "");
	  this.scale = DefaultValue(options.scale, "");
	}
	ModelGraphics.prototype.toJsonOptions = function () {
	  var jsonOptions = {
	    url: this.url,
	    position: this.position,
	    rotation: this.rotation,
	    scale: this.scale
	  };
	  return jsonOptions;
	};

	/**
	 * 复制
	 * @param {BillboardGraphics} result -将结果储存在其上的对象
	 *
	 * @memberOf ModelGraphics
	 * @returns {BillboardGraphics} 修改后的结果参数或一个新实例（如果没有提供）
	 */
	ModelGraphics.prototype.clone = function (result) {
	  if (!Defined(result)) {
	    return new ModelGraphics(this);
	  }
	  result.show = this._show;
	  result.scale = this._scale;
	  result.pixelOffset = this._pixelOffset;
	  return result;
	};

	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 数据源模块
	 * ---
	 */

	/**
	 * 点操作函数
	 * @param {Object} options -
	 * @class PointGraphics
	 * 点
	 */
	function PointGraphics(options) {
	  this._show = undefined;
	  this._scale = undefined;
	  this._pixelOffset = undefined;
	  this.merge(defaultValue(options, defaultValue.EMPTY_OBJECT));
	}
	Object.defineProperties(PointGraphics.prototype, {
	  scale: CreatePropertyDescriptor("scale"),
	  pixelOffset: CreatePropertyDescriptor("pixelOffset")
	});

	/**
	 * 复制
	 * @param {BillboardGraphics} result -将结果储存在其上的对象
	 *
	 * @memberOf PointGraphics
	 * @returns {BillboardGraphics} 修改后的结果参数或一个新实例（如果没有提供）
	 */
	PointGraphics.prototype.clone = function (result) {
	  if (!Defined(result)) {
	    return new PointGraphics(this);
	  }
	  result.show = this._show;
	  result.scale = this._scale;
	  result.pixelOffset = this._pixelOffset;
	  return result;
	};

	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 数据源模块
	 * ---
	 */

	/**
	 * 面操作函数
	 * @param {Object} options -
	 * @class PolygonGraphics
	 * 面
	 */
	function PolygonGraphics(options) {
	  this._show = undefined;
	  this._scale = undefined;
	  this._pixelOffset = undefined;
	  this.merge(defaultValue(options, defaultValue.EMPTY_OBJECT));
	}
	Object.defineProperties(PolygonGraphics.prototype, {
	  scale: CreatePropertyDescriptor("scale"),
	  pixelOffset: CreatePropertyDescriptor("pixelOffset")
	});

	/**
	 * 复制
	 * @param {BillboardGraphics} result -将结果储存在其上的对象
	 *
	 * @memberOf PolygonGraphics
	 * @returns {BillboardGraphics} 修改后的结果参数或一个新实例（如果没有提供）
	 */
	PolygonGraphics.prototype.clone = function (result) {
	  if (!Defined(result)) {
	    return new PolygonGraphics(this);
	  }
	  result.show = this._show;
	  result.scale = this._scale;
	  result.pixelOffset = this._pixelOffset;
	  return result;
	};

	//==========================================================================
	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 数据源模块
	 * ---
	 */

	/**
	 * 线操作函数
	 * @param {Object} options -
	 * @class PolylineGraphics
	 * 线
	 */
	function PolylineGraphics(options) {
	  this._show = undefined;
	  this._scale = undefined;
	  this._pixelOffset = undefined;
	  this.merge(defaultValue(options, defaultValue.EMPTY_OBJECT));
	}
	Object.defineProperties(PolylineGraphics.prototype, {
	  scale: CreatePropertyDescriptor("scale"),
	  pixelOffset: CreatePropertyDescriptor("pixelOffset")
	});

	/**
	 * 复制
	 * @param {BillboardGraphics} result -将结果储存在其上的对象
	 *
	 * @memberOf PolylineGraphics
	 * @returns {BillboardGraphics} 修改后的结果参数或一个新实例（如果没有提供）
	 */
	PolylineGraphics.prototype.clone = function (result) {
	  if (!Defined(result)) {
	    return new PolylineGraphics(this);
	  }
	  result.show = this._show;
	  result.scale = this._scale;
	  result.pixelOffset = this._pixelOffset;
	  return result;
	};

	/**
	 * @vuepress
	 *
	 * ---
	 * title: PIE-Map UE
	 * headline: 数据源模块
	 * ---
	 */

	/**
	 * 实体操作函数
	 * @name Entity
	 * @class Entity
	 * 实体
	 */
	var Entity = /*#__PURE__*/_createClass(function Entity(options) {
	  _classCallCheck(this, Entity);
	  options = DefaultValue(options, DefaultValue.EMPTY_OBJECT);
	  this.id = DefaultValue(options.id, GenerateGuid());
	  this.name = DefaultValue(options.name, "defaultEntity");
	  this._propertyNames = ["billboard", "box", "model", "point", "polygon", "polyline"];
	  this.box = undefined;
	  this.model = undefined;
	  this.point = undefined;
	  this.polygon = undefined;
	  this.polyline = undefined;
	  var billboardOptions = DefaultValue(options.billboard, undefined);
	  if (billboardOptions) {
	    this.billboard = new BillboardGraphics(billboardOptions);
	  }
	  var modelOptions = DefaultValue(options.model, undefined);
	  if (modelOptions) {
	    this.model = new ModelGraphics(modelOptions);
	  }
	});

	exports.Camera = Camera;
	exports.CameraEventType = CameraEventType;
	exports.Cartesian2 = Cartesian2;
	exports.Cartesian3 = Cartesian3;
	exports.Cartesian4 = Cartesian4;
	exports.Cartographic = Cartographic;
	exports.Config = Config;
	exports.EllipsoidTerrainProvider = EllipsoidTerrainProvider;
	exports.EngineTerrainProvider = EngineTerrainProvider;
	exports.Entity = Entity;
	exports.EntityCollection = EntityCollection;
	exports.HeadingPitchRange = HeadingPitchRange;
	exports.HeadingPitchRoll = HeadingPitchRoll;
	exports.ImageryLayer = ImageryLayer;
	exports.ImageryLayerCollection = ImageryLayerCollection;
	exports.Layer3D = Layer3D;
	exports.Layer3DCollection = Layer3DCollection;
	exports.MessageManager = MessageManager;
	exports.OSGBProvider = OSGBProvider;
	exports.Scene = Scene;
	exports.ScreenSpaceEventType = ScreenSpaceEventType;
	exports.TerrainProvider = TerrainProvider;
	exports.UrlTemplateImageryProvider = UrlTemplateImageryProvider;
	exports.Viewer = Viewer;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=pie-map-ue.js.map
