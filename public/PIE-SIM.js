(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PIESIM = {}));
})(this, (function (exports) { 'use strict';

	// Polyfills

	if ( Number.EPSILON === undefined ) {

		Number.EPSILON = Math.pow( 2, - 52 );

	}

	if ( Number.isInteger === undefined ) {

		// Missing in IE
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger

		Number.isInteger = function ( value ) {

			return typeof value === 'number' && isFinite( value ) && Math.floor( value ) === value;

		};

	}

	//

	if ( Math.sign === undefined ) {

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

		Math.sign = function ( x ) {

			return ( x < 0 ) ? - 1 : ( x > 0 ) ? 1 : + x;

		};

	}

	if ( 'name' in Function.prototype === false ) {

		// Missing in IE
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name

		Object.defineProperty( Function.prototype, 'name', {

			get: function () {

				return this.toString().match( /^\s*function\s*([^\(\s]*)/ )[ 1 ];

			}

		} );

	}

	if ( Object.assign === undefined ) {

		// Missing in IE
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

		( function () {

			Object.assign = function ( target ) {

				if ( target === undefined || target === null ) {

					throw new TypeError( 'Cannot convert undefined or null to object' );

				}

				var output = Object( target );

				for ( var index = 1; index < arguments.length; index ++ ) {

					var source = arguments[ index ];

					if ( source !== undefined && source !== null ) {

						for ( var nextKey in source ) {

							if ( Object.prototype.hasOwnProperty.call( source, nextKey ) ) {

								output[ nextKey ] = source[ nextKey ];

							}

						}

					}

				}

				return output;

			};

		} )();

	}

	function XML2String(xmlObject) { //XML转字符串
	    if (window.ActiveXObject) {
	        return xmlObject.xml;
	    } else {
	        return (new XMLSerializer()).serializeToString(xmlObject);
	    }
	}
	function String2XML(xmlString) { //字符串转xml
	    if (window.ActiveXObject) {
	        var xmlobject = new ActiveXObject("Microsoft.XMLDOM");
	        xmlobject.async = "false";
	        xmlobject.loadXML(xmlString);
	        return xmlobject;
	    } else {
	        var parser = new DOMParser();
	        var xmlobject = parser.parseFromString(xmlString, "text/xml");
	        // console.log(xmlobject)
	        return xmlobject;
	    }
	}
	function DownloadXML(data, filename) {
	    var urlObject = window.URL || window.webkitURL || window;
	    if (!data) {
	        alert('data is null');
	        return;
	    }
	    if (!filename) filename = 'xx.xml';
	    if (typeof data === 'object') {
	        data = JSON.stringify(data, undefined, 4);
	    }
	    var blob = new Blob([data], {
	        type: 'text/xml'
	    });
	    var dlLink = document.createElement('a');
	    dlLink.download = filename;
	    dlLink.href = urlObject.createObjectURL(blob);
	    dlLink.dataset.downloadurl = ['text/xml', dlLink.download, dlLink.href].join(':');

	    document.body.appendChild(dlLink);
	    dlLink.click();
	    document.body.removeChild(dlLink);

	}

	function sideToSim(side){
	    let sideAfsim={
	        1:"red",
	        2:"blue",
	        3:"green"
	    };
	    return sideAfsim[side]
	}

	const SideEnum = {
	    SideRed:1,
	    SideBlue:2,
	    SideGreen:3,
	    SideOrange:4,
	    SideYellow:5,
	    SidePurple:6,
	};
	const NodeUnit = {
	    NodeType:{
	        NodeGroup:1,
	        Unkown:-1
	    },
	    // NodeGroup:1, 
	    Unkown:-1,
	    NodeGroup:"指挥",
	    NodeCGF:"兵力",
	    nodeId:0,
	    navPathNum:0,
	    areaPathNum:0,
	    routePathNum:0,
	};

	const AreaTypes = [
	    {label:'无',value:-1},
	    {label:"渔区",value:0},
	    {label:"贸易区",value:1},
	    {label:"民事禁区",value:2},
	    {label:"雷区",value:3},
	    {label:"军事区",value:4},
	    {label:"环境",value:5},
	    {label:"停泊区",value:6},
	    {label:"无菌区",value:11},
	    {label:"军事分离区",value:12},
	    {label:"可疑区",value:19},
	    {label:"禁区",value:20},
	    {label:"地形区",value:21},
	    {label:"水",value:22},
	    {label:"泥",value:23},
	    {label:"平坦道路",value:24},
	    {label:"非平坦道路",value:25},
	    {label:"沙丘",value:26},
	    {label:"沼泽",value:27},
	    {label:"海岸",value:28},
	    {label:"房屋",value:29},
	    {label:"树",value:30},
	    {label:"林区",value:31},
	];

	const AreaAscriptions = [
	    {label:"无",value:-1},
	    {label:"红方",value:1},
	    {label:"蓝方",value:2},
	    {label:"绿方",value:3},
	    {label:"橙方",value:4},
	    {label:"黄方",value:5},
	    {label:"紫方",value:6},
	];

	var NavPath = function () {
	    this.LoopIndex = -1;
	    this.NavPointlist = [];
	    this.name = null;
	    this.num = null;
	};
	NavPath.prototype = Object.assign({
	    getList:function(){
	        return this.NavPointlist;
	    },
	    getLoopIndex: function () {
	        return this.LoopIndex;
	    },
	    SetLoopIndex: function (loopIndex) {
	        this.LoopIndex = loopIndex;
	    },
	    setName:function(name){
	        this.name = name;
	    },
	    getName:function(){
	        return this.name;
	    },
	    setNum:function(num){
	        this.num = num;
	    },
	    getNum:function(){
	        return this.num;
	    },
	    setNavPointList:function(pointList){
	        this.NavPointlist = pointList;
	    },
	    getNavPointCount: function () {
	        return this.NavPointlist.length;
	    },
	    getNavPointByIndex: function (nIndex) {
	        var result;
	        result = this.NavPointlist[nIndex];
	        return result;
	    },
	    setNavPointByIndex: function (nIndex, navPoint) {
	        this.NavPointlist[nIndex] = navPoint;
	    },
	    removeNavPointByIndex: function (nIndex) {
	        if (this.NavPointlist.length < 1) {
	            this.NavPointlist = [];
	        } else {
	            this.NavPointlist.splice(nIndex, 1);
	        }
	    },
	    insertNavPointByIndex(nIndex, navPoint) {
	        this.NavPointlist.splice(nIndex, 0, navPoint);
	    },
	}, {
	    /**
	     * 添加导航点 
	     *{
	     *   position:{
	     *       x：,
	     *       y: ,
	     *       z:,
	     *             }，
	     *   stamp:
	     * }
	     * @param {Object} NavPoint 
	     */
	    AddNavPoint: function (NavPoint) {
	        this.NavPointlist.push(NavPoint);
	    },
	    copy: function ( source ) {
	        let obj = Object.assign(source);
			this.name = obj.name;
			this.NavPointlist = [...obj.NavPointlist];
			this.LoopIndex = obj.LoopIndex;
			this.num = obj.num;
			return this;

		},
	    clone: function () {
			return new NavPath().copy( this );
		},
	});

	// import {navPathNum} from './NodeConfig';
	var xmlStream$6 = String2XML();

	function NavPathList(element) {
	    this.list = [];
	    this.readXml(element);
	}
	NavPathList.prototype = Object.assign({
	    getList: function () {
	        return this.list;
	    },

	    getChildByNum: function (num) {
	        let length = this.list.length;
	        let result = null;
	        for (let i = 0; i < length; i++) {
	            if (this.list[i].getNum() == num) {
	                result = this.list[i];
	            }
	        }
	        return result;
	    },
	    getIndexByNum: function (num) {
	        let length = this.list.length;
	        let result = -1;
	        for (let i = 0; i < length; i++) {
	            if (this.list[i].getNum() == num) {
	                result = i;
	            }
	        }
	        return result;
	    },
	    addChild: function (navPath) {
	        // NodeUnit.navPathNum++;
	        navPath.setNum(NodeUnit.navPathNum);
	        this.list.push(navPath);
	    },
	    setChildByNum: function (num, navPath) {
	        let _index = this.getIndexByNum(num);
	        if (_index >= 0) {
	            let child = this.list[_index];
	            navPath.setNum(child.getNum());
	            //navPath.setName(child.getName())
	            this.list.splice(_index, 1, navPath);
	        }
	    },
	    readNavPath: function (eleNavPath) {
	        console.log(eleNavPath);
	        if (eleNavPath) {
	            let navPath = new NavPath();
	            var strLoopIndex = eleNavPath.getAttribute("循环");
	            var strName = eleNavPath.getAttribute("名称");
	            var strNum = eleNavPath.getAttribute("标识");
	            navPath.SetLoopIndex(Number(strLoopIndex));
	            navPath.setName(strName);
	            navPath.setNum(Number(strNum));
	            if (Number(strNum) > NodeUnit.navPathNum) {
	                NodeUnit.navPathNum = Number(strNum);
	            }

	            var navPointElements = eleNavPath.children;
	            for (let i = 0; i < navPointElements.length; i++) {
	                var childElement = navPointElements[i];
	                var strtime = childElement.getAttribute("时间");
	                var strlon = childElement.getAttribute("经度");
	                var strlat = childElement.getAttribute("纬度");
	                var strhei = childElement.getAttribute("高度");

	                var navPoint = {
	                    position: {

	                    }
	                };
	                navPoint.stamp = Number(strtime);
	                navPoint.position.x = Number(strlon);
	                navPoint.position.y = Number(strlat);
	                navPoint.position.z = Number(strhei);

	                navPath.AddNavPoint(navPoint);
	            }
	            return navPath;
	        } else {
	            return null;
	        }
	    },
	    readXml: function (element) {
	        console.log(element);
	        if (element.length == 0) {
	            return;
	        }
	        let navPathElements = element[0].children;
	        for (let i = 0; i < navPathElements.length; i++) {
	            let navPath = this.readNavPath(navPathElements[i]);
	            if (navPath) {
	                this.list.push(navPath);
	            }
	        }
	    },
	    writeNavPath: function (node, navPath) {
	        
	        var navPointCount = navPath.getNavPointCount();
	        if (navPointCount > 0) {

	            var node_navPath = xmlStream$6.createElement("导航线");
	            node.appendChild(node_navPath);
	            node.append("\n\t");
	            node_navPath.setAttribute("循环", navPath.getLoopIndex());
	            node_navPath.setAttribute("名称", navPath.getName());
	            node_navPath.setAttribute("标识", navPath.getNum());
	            for (let k = 0; k < navPointCount; k++) {
	                var navPoint = navPath.getNavPointByIndex(k);
	                var node_navPoint = xmlStream$6.createElement("航路点");
	                node_navPath.appendChild(node_navPoint);
	                node_navPath.append("\n\t");
	                node_navPoint.setAttribute("时间", navPoint.stamp);

	                node_navPoint.setAttribute("经度", navPoint.position.x);
	                node_navPoint.setAttribute("纬度", navPoint.position.y);
	                node_navPoint.setAttribute("高度", navPoint.position.z);
	            }
	            console.log(node_navPath);
	        }
	    },
	    writeXml: function (node) {
	        
	        for (let i = 0; i < this.list.length; i++) {
	            this.writeNavPath(node, this.list[i]);
	        }
	    }
	});

	var AreaPath = function () {
	    this.areaPointlist = [];
	    this.name=null;
	    this.num = null;
	};
	AreaPath.prototype = Object.assign({
	    init:function(){

	    },
	    getList:function(){
	        return this.areaPointlist;
	    },
	    setName:function(name){
	        this.name = name;
	    },
	    getName:function(){
	        return this.name;
	    },
	    setNum:function(num){
	        this.num = num;
	    },
	    getNum:function(){
	        return this.num;
	    },
	    setAreaPointList:function(pointList){
	        this.areaPointlist = pointList;
	    },
	    getAreaPointCount: function () {
	        return this.areaPointlist.length;
	    },
	    getAreaPointByIndex: function (nIndex) {
	        var result;
	        result = this.areaPointlist[nIndex];
	        return result;
	    },
	    setAreaPointByIndex: function (nIndex, areaPoint) {
	        this.areaPointlist[nIndex] = areaPoint;
	    },
	    removeAreaPointByIndex: function (nIndex) {
	        if (this.areaPointlist.length < 1) {
	            this.areaPointlist = [];
	        } else {
	            this.areaPointlist.splice(nIndex, 1);
	        }
	    },
	    insertAreaPointByIndex(nIndex, areaPoint) {
	        this.areaPointlist.splice(nIndex, 0, areaPoint);
	    },
	}, {
	    /**
	     * 添加导航点 
	     *{
	     *   position:{
	     *       x：,
	     *       y: ,
	     *       z:,
	     *             }，
	     *   stamp:
	     * }
	     * @param {Object} areaPoint 
	     */
	    AddAreaPoint: function (areaPoint) {
	        this.areaPointlist.push(areaPoint);
	    },
	    copy: function ( source ) {
	        let obj = Object.assign(source);
			this.name = obj.name;
			this.areaPointlist = [...obj.areaPointlist];
			this.num = obj.num;
			return this;

		},
	    clone: function () {
			return new AreaPath().copy( this );
		},
	});

	var xmlStream$5 = String2XML();
	Object.assign({
	    getList:function(){
	        return this.list;
	    },
	    removeChildByNum:function(num){
	        let index = this.getIndexByNum(num);
	        if(index>=0){
	            this.list.splice(index,1);
	        }

	    },
	    getChildByNum:function(num){
	        let length = this.list.length;
	        let result = null;
	        for(let i=0;i<length;i++){
	            if(this.list[i].getNum() == num){
	                result = this.list[i];
	            }
	        }
	        return result;
	    },
	    getIndexByNum:function(num){
	        let length = this.list.length;
	        let result = -1;
	        for(let i=0;i<length;i++){
	            if(this.list[i].getNum() == num){
	                result = i;
	            }
	        }
	        return result;
	    },
	    addChild:function(navPath){
	        NodeUnit.areaPathNum ++ ;
	        navPath.setNum(NodeUnit.areaPathNum);
	        this.list.push(navPath);
	    },
	    setChildByNum:function(num,navPath){
	        let _index = this.getIndexByNum(num);
	        if(_index>=0){
	            let child = this.list[_index];
	            navPath.setNum(child.getNum());
	            //navPath.setName(child.getName())
	            this.list.splice(_index,1,navPath);
	        }   
	    },
	    readAreaPath:function(eleAreaPath){
	        console.log(eleAreaPath);
	        if(eleAreaPath){
	            let areaPath = new AreaPath();
	           // var strLoopIndex = eleNavPath.getAttribute("循环");
	            var strName = eleAreaPath.getAttribute("名称");
	            var strNum = eleAreaPath.getAttribute("标识");
	           
	            areaPath.setName(strName);
	            areaPath.setNum(Number(strNum));
	            if(Number(strNum) > NodeUnit.areaPathNum){
	                NodeUnit.areaPathNum = Number(strNum);
	            }
	            
	            var areaPointElements = eleAreaPath.children;
	            for (let i = 0; i < areaPointElements.length; i++)
	            {
	                var childElement = areaPointElements[i];
	               
	                var strlon = childElement.getAttribute("经度");
	                var strlat = childElement.getAttribute("纬度");
	                var strhei = childElement.getAttribute("高度");

	                let areaPoint = {
	                    position:{

	                    }
	                };
	                areaPoint.position.x = Number(strlon);
	                areaPoint.position.y = Number(strlat);
	                areaPoint.position.z = Number(strhei);

	                areaPath.AddAreaPoint(areaPoint);
	            }
	            return areaPath;  
	        }else {
	            return null;
	        }
	        
	    },
	    readXml:function(element){
	        console.log(element);
	        if(element.length==0){
	            return;
	        }
	        let areaPathElements = element[0].children;
	        for(let i=0;i<areaPathElements.length;i++){
	            let areaPath = this.readAreaPath(areaPathElements[i]);
	            if(areaPath){
	                this.list.push(areaPath);
	            }  
	        }  
	    },
	    writeNavPath:function(node,navPath){
	        var navPointCount = navPath.getAreaPointCount();
	        if (navPointCount > 0)
	        {
	            
	            var node_navPath = xmlStream$5.createElement("区域");
	            node.appendChild(node_navPath);
	            node.append("\n\t");
	            node_navPath.setAttribute("名称", navPath.getName());
	            node_navPath.setAttribute("标识", navPath.getNum());
	            for (let k = 0; k < navPointCount; k++)
	            {
	                var navPoint = navPath.getAreaPointByIndex(k);
	                var node_navPoint = xmlStream$5.createElement("区域点");
	                node_navPath.appendChild(node_navPoint);
	                node_navPath.append("\n\t");

	                node_navPoint.setAttribute("经度", navPoint.position.x);
	                node_navPoint.setAttribute("纬度", navPoint.position.y);
	                node_navPoint.setAttribute("高度", navPoint.position.z);
	                
	            }
	            
	        }
	    },
	    writeXml:function(node){
	        for(let i=0;i<this.list.length;i++){
	            this.writeNavPath(node,this.list[i]);
	        }
	    }
	});

	var AreaLibPath = function () {
	    this.areaPointlist = [];
	    this.name = null;
	    this.num = null;
	    this.type = -1; //类型
	    this.ascription = null; //属方
	};
	AreaLibPath.prototype = Object.assign({
	    init: function () {

	    },
	    setList:function (list) {
	        this.areaPointlist = list;
	    },
	    getList: function () {
	        return this.areaPointlist;
	    },
	    setName: function (name) {
	        this.name = name;
	    },
	    getName: function () {
	        return this.name;
	    },
	    setNum: function (num) {
	        this.num = num;
	    },
	    getNum: function () {
	        return this.num;
	    },
	    setType: function (type) {
	        this.type = type;
	    },
	    getType: function () {
	        return this.type;
	    },
	    setAscription: function (ascription) {
	        this.ascription = ascription;
	    },
	    getAscription: function () {
	        return this.ascription;
	    },
	    setAreaPointList: function (pointList) {
	        this.areaPointlist = pointList;
	    },
	    getAreaPointCount: function () {
	        return this.areaPointlist.length;
	    },
	    getAreaPointByIndex: function (nIndex) {
	        var result;
	        result = this.areaPointlist[nIndex];
	        return result;
	    },
	    setAreaPointByIndex: function (nIndex, areaPoint) {
	        this.areaPointlist[nIndex] = areaPoint;
	    },
	    removeAreaPointByIndex: function (nIndex) {
	        if (this.areaPointlist.length < 1) {
	            this.areaPointlist = [];
	        } else {
	            this.areaPointlist.splice(nIndex, 1);
	        }
	    },
	    insertAreaPointByIndex(nIndex, areaPoint) {
	        this.areaPointlist.splice(nIndex, 0, areaPoint);
	    },
	}, {
	    /**
	     * 添加导航点
	     *{
	     *   position:{
	     *       x：,
	     *       y: ,
	     *       z:,
	     *             }，
	     *   stamp:
	     * }
	     * @param {Object} areaPoint
	     */
	    AddAreaPoint: function (areaPoint) {
	        this.areaPointlist.push(areaPoint);
	    },
	    copy: function (source) {
	        let obj = Object.assign(source);
	        this.name = obj.name;
	        this.areaPointlist = [...obj.areaPointlist];
	        this.num = obj.num;
	        return this;

	    },
	    clone: function () {
	        return new AreaLibPath().copy(this);
	    },
	});

	var xmlStream$4 = String2XML();
	function AreaLibPathList(element) {
	  this.list = [];
	  this.readXml(element);
	}
	AreaLibPathList.prototype = Object.assign({
	  getList: function () {
	    return this.list;
	  },
	  removeChildByNum: function (num) {
	    let index = this.getIndexByNum(num);
	    if (index >= 0) {
	      this.list.splice(index, 1);
	    }
	  },
	  getChildByNum: function (num) {
	    let length = this.list.length;
	    let result = null;
	    for (let i = 0; i < length; i++) {
	      if (this.list[i].getNum() == num) {
	        result = this.list[i];
	      }
	    }
	    return result;
	  },
	  getIndexByNum: function (num) {
	    let length = this.list.length;
	    let result = -1;
	    for (let i = 0; i < length; i++) {
	      if (this.list[i].getNum() == num) {
	        result = i;
	      }
	    }
	    return result;
	  },
	  addChild: function (navPath) {
	    // NodeUnit.areaPathNum ++ ;
	    navPath.setNum(NodeUnit.areaPathNum);
	    this.list.push(navPath);
	  },
	  setChildByNum: function (num, navPath) {
	    let _index = this.getIndexByNum(num);
	    if (_index >= 0) {
	      let child = this.list[_index];
	      navPath.setNum(child.getNum());
	      //navPath.setName(child.getName())
	      this.list.splice(_index, 1, navPath);
	    }
	  },
	  readAreaPath: function (eleAreaPath) {
	    if (eleAreaPath) {
	      let areaPath = new AreaLibPath();
	      // var strLoopIndex = eleNavPath.getAttribute("循环");
	      var strName = eleAreaPath.getAttribute("名称");
	      var strNum = eleAreaPath.getAttribute("标识");
	      var strType = eleAreaPath.getAttribute("类型");
	      var strAscription = eleAreaPath.getAttribute("属方");

	      areaPath.setName(strName);
	      areaPath.setNum(Number(strNum));
	      areaPath.setType(Number(strType));
	      areaPath.setAscription(strAscription);
	      if (Number(strNum) > NodeUnit.areaPathNum) {
	        NodeUnit.areaPathNum = Number(strNum);
	      }

	      var areaPointElements = eleAreaPath.getElementsByTagName("形状")[0];
	      if (areaPointElements) {
	        let areaPoints = areaPointElements.children;
	        for (let i = 0; i < areaPoints.length; i++) {
	          var childElement = areaPoints[i];

	          var strlon = childElement.getAttribute("经度");
	          var strlat = childElement.getAttribute("纬度");
	          var strhei = childElement.getAttribute("高度");

	          let areaPoint = {
	            position: {},
	          };
	          areaPoint.position.x = Number(strlon);
	          areaPoint.position.y = Number(strlat);
	          areaPoint.position.z = Number(strhei);

	          areaPath.AddAreaPoint(areaPoint);
	        }
	      }

	      return areaPath;
	    } else {
	      return null;
	    }
	  },
	  readXml: function (element) {
	    if (element.length == 0) {
	      return;
	    }
	    let areaPathElements = element[0].children;
	    for (let i = 0; i < areaPathElements.length; i++) {
	      let areaPath = this.readAreaPath(areaPathElements[i]);
	      if (areaPath) {
	        this.list.push(areaPath);
	      }
	    }
	  },
	  writeNavPath: function (node, navPath) {
	    var navPointCount = navPath.getAreaPointCount();
	    if (navPointCount > 0) {
	      var node_navPath = xmlStream$4.createElement("区域");
	      node.appendChild(node_navPath);
	      node.append("\n\t");
	      node_navPath.setAttribute("名称", navPath.getName());
	      node_navPath.setAttribute("标识", navPath.getNum());
	      for (let k = 0; k < navPointCount; k++) {
	        var navPoint = navPath.getAreaPointByIndex(k);
	        var node_navPoint = xmlStream$4.createElement("区域点");
	        node_navPath.appendChild(node_navPoint);
	        node_navPath.append("\n\t");

	        node_navPoint.setAttribute("经度", navPoint.position.x);
	        node_navPoint.setAttribute("纬度", navPoint.position.y);
	        node_navPoint.setAttribute("高度", navPoint.position.z);
	      }
	    }
	  },
	  writeXml: function (node) {
	    for (let i = 0; i < this.list.length; i++) {
	      this.writeNavPath(node, this.list[i]);
	    }
	  },
	});

	var RoutePath = function () {
	    this.NavPointlist = [];
	    this.name=null;
	    this.num = null;
	    this.id = -1;
	    this.width = 1;
	    this.color = "#000000";
	};
	RoutePath.prototype = Object.assign({
	    getList:function(){
	        return this.NavPointlist;
	    },
	    setWidth:function(width){
	        this.width = width;
	    },
	    getWidth: function () {
	        return this.width;
	    },
	    setColor:function(color){
	        this.color = color;
	    },
	    getColor: function () {
	        return this.color;
	    },
	    setId: function (id) {
	        this.id = id;
	    },
	    getId:function(){
	        return this.id;
	    },
	    setName:function(name){
	        this.name = name;
	    },
	    getName:function(){
	        return this.name;
	    },
	    setNum:function(num){
	        this.num = num;
	    },
	    getNum:function(){
	        return this.num;
	    },
	    setNavPointList:function(pointList){
	        this.NavPointlist = pointList;
	    },
	    getNavPointCount: function () {
	        return this.NavPointlist.length;
	    },
	    getNavPointByIndex: function (nIndex) {
	        var result;
	        result = this.NavPointlist[nIndex];
	        return result;
	    },
	    setNavPointByIndex: function (nIndex, navPoint) {
	        this.NavPointlist[nIndex] = navPoint;
	    },
	    removeNavPointByIndex: function (nIndex) {
	        if (this.NavPointlist.length < 1) {
	            this.NavPointlist = [];
	        } else {
	            this.NavPointlist.splice(nIndex, 1);
	        }
	    },
	    insertNavPointByIndex(nIndex, navPoint) {
	        this.NavPointlist.splice(nIndex, 0, navPoint);
	    },
	}, {
	    /**
	     * 添加导航点 
	     *{
	     *   position:{
	     *       x：,
	     *       y: ,
	     *       z:,
	     *             }，
	     *   stamp:
	     * }
	     * @param {Object} NavPoint 
	     */
	    AddNavPoint: function (NavPoint) {
	        this.NavPointlist.push(NavPoint);
	    },
	    copy: function ( source ) {
	        let obj = Object.assign(source);
			this.name = obj.name;
			this.NavPointlist = [...obj.NavPointlist];
			this.id = obj.id;
			this.width = obj.width;
			this.num = obj.num;
			return this;

		},
	    clone: function () {
			return new RoutePath().copy( this );
		},
	});

	var xmlStream$3 = String2XML();

	function RoutePathList(element) {
	    this.list = [];
	    this.readXml(element);
	}
	RoutePathList.prototype = Object.assign({
	    getList: function () {
	        return this.list;
	    },

	    getChildById: function (id) {
	        let length = this.list.length;
	        let result = null;
	        for (let i = 0; i < length; i++) {
	            if (this.list[i].getId() == id) {
	                result = this.list[i];
	            }
	        }
	        return result;
	    },
	    getIndexById: function (id) {
	        let length = this.list.length;
	        let result = -1;
	        for (let i = 0; i < length; i++) {
	            if (this.list[i].getId() == id) {
	                result = i;
	            }
	        }
	        return result;
	    },
	    addChild: function (navPath) {
	        NodeUnit.routePathNum++;
	        navPath.setId(NodeUnit.routePathNum);
	        this.list.push(navPath);
	    },
	    setChildById: function (id, navPath) {
	        let _index = this.getIndexById(id);
	        if (_index >= 0) {
	            let child = this.list[_index];
	            navPath.setNum(child.getNum());
	            //navPath.setName(child.getName())
	            this.list.splice(_index, 1, navPath);
	        }
	    },
	    readRoutePath: function (eleNavPath) {
	        if (eleNavPath) {
	            let routePath = new RoutePath();
	            var strWidth = eleNavPath.getAttribute("宽度");
	            var strName = eleNavPath.getAttribute("名称");
	            var strId = eleNavPath.getAttribute("标识");
	            var strNum = eleNavPath.getAttribute("编号");

	            routePath.setWidth(Number(strWidth));
	            routePath.setName(strName);
	            routePath.setNum(Number(strNum));
	            routePath.setId(Number(strId));
	            if (Number(strId) > NodeUnit.routePathNum) {
	                NodeUnit.routePathNum = Number(strId);
	            }

	            var navPointElements = eleNavPath.children[0].children;
	            for (let i = 0; i < navPointElements.length; i++) {
	                var childElement = navPointElements[i];
	                var strtime = childElement.getAttribute("时间");
	                var strlon = childElement.getAttribute("经度");
	                var strlat = childElement.getAttribute("纬度");
	                var strhei = childElement.getAttribute("高度");

	                var navPoint = {
	                    position: {

	                    }
	                };
	                navPoint.stamp = Number(strtime);
	                navPoint.position.x = Number(strlon);
	                navPoint.position.y = Number(strlat);
	                navPoint.position.z = Number(strhei);

	                routePath.AddNavPoint(navPoint);
	            }
	            return routePath;
	        } else {
	            return null;
	        }

	    },
	    readXml: function (element) {
	        if (element.length == 0) {
	            return;
	        }
	        let navPathElements = element[0].children;
	        for (let i = 0; i < navPathElements.length; i++) {
	            let routePath = this.readRoutePath(navPathElements[i]);
	            if (routePath) {
	                this.list.push(routePath);
	            }
	        }
	    },
	    writeNavPath: function (node, navPath) {
	        var navPointCount = navPath.getNavPointCount();
	        if (navPointCount > 0) {

	            var node_navPath = xmlStream$3.createElement("路线");
	            node.appendChild(node_navPath);
	            node.append("\n\t");
	            node_navPath.setAttribute("标识", navPath.getId());
	            node_navPath.setAttribute("名称", navPath.getName());
	            node_navPath.setAttribute("编号", navPath.getNum());
	            node_navPath.setAttribute("宽度", navPath.getWidth());
	            var points_ele = xmlStream$3.createElement("点集");
	            node_navPoint.appendChild(points_ele);
	            for (let k = 0; k < navPointCount; k++) {
	                var navPoint = navPath.getNavPointByIndex(k);
	                var node_navPoint = xmlStream$3.createElement("路点");
	                points_ele.appendChild(node_navPoint);
	                points_ele.append("\n\t");
	                node_navPoint.setAttribute("时间", navPoint.stamp);
	                node_navPoint.setAttribute("经度", navPoint.position.x);
	                node_navPoint.setAttribute("纬度", navPoint.position.y);
	                node_navPoint.setAttribute("高度", navPoint.position.z);

	            }

	        }
	    },
	    writeXml: function (node) {
	        for (let i = 0; i < this.list.length; i++) {
	            this.writeNavPath(node, this.list[i]);
	        }
	    }
	});

	var environment$1 = function () {
	    this.cloud = {};
	    this.weather = {};
	    this.ocean = {};
	    this.vision = {};
	    this.infrared = {};
	    this.sonar = {};
	    this.radar = [];
	    this.id = -1;
	};
	environment$1.prototype = Object.assign({
	    getList: function () {
	        return this.NavPointlist;
	    },
	    setId: function (id) {
	        this.id = id;
	    },
	    getId: function () {
	        return this.id;
	    },
	    setCloud: function (element) {
	        this.cloud = element;
	    },
	    getCloud: function () {
	        return this.cloud
	    },
	    setWeather: function (element) {
	        this.weather = element;
	    },
	    getWeather: function () {
	        return this.weather
	    },
	    setOcean: function (element) {
	        this.ocean = element;
	    },
	    getOcean: function () {
	        return this.ocean
	    },
	    setVision: function (element) {
	        this.vision = element;
	    },
	    getVision: function () {
	        return this.vision
	    },
	    setInfrared: function (element) {
	        this.infrared = element;
	    },
	    getInfrared: function () {
	        return this.infrared
	    },
	    setSonar: function (element) {
	        this.sonar = element;
	    },
	    getSonar: function () {
	        return this.sonar
	    },
	    addRadar: function (element) {
	        this.radar.push(element);
	    },
	    getRadarCount: function () {
	        return this.radar.length
	    },
	    getRadarByIndex: function (index) {
	        var result;
	        result = this.radar[index];
	        return result;
	    },
	    removeNavPointByIndex: function (nIndex) {

	    },
	    insertNavPointByIndex(nIndex, navPoint) {

	    }
	}, {
	    copy: function (source) {
	        let obj = Object.assign(source);
	        this.cloud = obj.cloud;
	        this.weather = obj.weather;
	        this.ocean = obj.ocean;
	        this.vision = obj.vision;
	        this.infrared = obj.infrared;
	        this.sonar = obj.sonar;
	        this.radar = obj.radar;
	        this.id = obj.id;

	        return this;

	    },
	    clone: function () {
	        return new environment$1().copy(this);
	    },
	});

	var xmlStream$2 = String2XML();

	function environmentList(element) {
	    this.list = [];
	    this.readXml(element);
	}
	environmentList.prototype = Object.assign({
	    getList: function () {
	        return this.list;
	    },

	    getChildById: function (id) {
	        let length = this.list.length;
	        let result = null;
	        for (let i = 0; i < length; i++) {
	            if (this.list[i].getId() == id) {
	                result = this.list[i];
	            }
	        }
	        return result;
	    },
	    getIndexById: function (id) {
	        let length = this.list.length;
	        let result = -1;
	        for (let i = 0; i < length; i++) {
	            if (this.list[i].getId() == id) {
	                result = i;
	            }
	        }
	        return result;
	    },
	    addChild: function (navPath) {
	        NodeUnit.routePathNum++;
	        navPath.setId(NodeUnit.routePathNum);
	        this.list.push(navPath);
	    },
	    setChildById: function (id, navPath) {
	        let _index = this.getIndexById(id);
	        if (_index >= 0) {
	            this.list[_index];
	            // navPath.setNum(child.getNum())
	            //navPath.setName(child.getName())
	            this.list.splice(_index, 1, navPath);
	        }
	    },
	    getElement: function (eleNavPath) {
	        if (eleNavPath) {
	            let _environment = new environment$1();
	            var areaId = eleNavPath.getAttribute("区域标识");

	            _environment.setId(Number(areaId));
	            if (Number(areaId) > NodeUnit.routePathNum) {
	                NodeUnit.routePathNum = Number(areaId);
	            }

	            var navPointElements = eleNavPath.children;

	            for (let i = 0; i < navPointElements.length; i++) {
	                let childElement = navPointElements[i];
	                if (childElement.localName == "云层") {
	                    var height = Number(childElement.getAttribute("高度"));
	                    var maxHeight = Number(childElement.getAttribute("最大高度"));
	                    var concentration = Number(childElement.getAttribute("浓度"));
	                    var element = { height, maxHeight, concentration };
	                    _environment.setCloud(element);
	                } else if (childElement.localName == "天气") {
	                    var temp = Number(childElement.getAttribute("温度"));
	                    var humidity = Number(childElement.getAttribute("湿度"));
	                    var pressure = Number(childElement.getAttribute("气压"));
	                    var rainfall = Number(childElement.getAttribute("雨量"));
	                    let weather = { wind: [], temp, humidity, pressure, rainfall };
	                    var wind = childElement.children[0].children;
	                    for (let i = 0; i < wind.length; i++) {
	                        let childElement = wind[i];
	                        let height = Number(childElement.getAttribute("高度"));
	                        let wind_d = Number(childElement.getAttribute("风向"));
	                        let wind_s = Number(childElement.getAttribute("风速"));
	                        let element = { height, wind_d, wind_s };
	                        weather.wind.push(element);
	                    }
	                    _environment.setWeather(weather);
	                } else if (childElement.localName == "海洋") {
	                    var seaState = Number(childElement.getAttribute("海况"));
	                    var wave_d = Number(childElement.getAttribute("浪向"));
	                    var wave_h = Number(childElement.getAttribute("浪高"));
	                    let ocean = { flow: [], seaState, wave_d, wave_h };
	                    var flow = childElement.children[0].children;
	                    for (let i = 0; i < flow.length; i++) {
	                        let childElement = flow[i];
	                        let depth = Number(childElement.getAttribute("深度"));
	                        let flow_d = Number(childElement.getAttribute("流向"));
	                        let flow_s = Number(childElement.getAttribute("速度"));
	                        let element = { depth, flow_d, flow_s };
	                        ocean.flow.push(element);
	                    }
	                    _environment.setOcean(ocean);
	                } else if (childElement.localName == "视觉") {
	                    var maximumRange = Number(childElement.getAttribute("最大范围"));
	                    var identificationRange = Number(childElement.getAttribute("识别范围"));
	                    var element = { maximumRange, identificationRange };
	                    _environment.setVision(element);
	                } else if (childElement.localName == "红外") {
	                    var maximumRange = Number(childElement.getAttribute("最大范围"));
	                    var identificationRange = Number(childElement.getAttribute("识别范围"));
	                    var element = { maximumRange, identificationRange };
	                    _environment.setInfrared(element);
	                } else if (childElement.localName == "声呐") {
	                    var maximumRange = Number(childElement.getAttribute("最大范围"));
	                    var sonar = { thermocline: [], maximumRange };
	                    var thermocline = childElement.children[0].children;
	                    for (let i = 0; i < thermocline.length; i++) {
	                        let childElement = thermocline[i];
	                        let depth = Number(childElement.getAttribute("深度"));
	                        let temp = Number(childElement.getAttribute("温度"));
	                        let element = { depth, temp };
	                        sonar.thermocline.push(element);
	                    }
	                    _environment.setSonar(sonar);
	                } else if (childElement.localName == "雷达探测范围") {
	                    let radar = childElement.children;
	                    for (let i = 0; i < radar.length; i++) {
	                        let childElement = radar[i];
	                        let frequency = Number(childElement.getAttribute("频率"));
	                        let range = Number(childElement.getAttribute("范围"));
	                        let element = { frequency, range };
	                        _environment.addRadar(element);
	                    }
	                }
	            }
	            return _environment;
	        } else {
	            return null;
	        }

	    },
	    readXml: function (element) {
	        if (element.length == 0) {
	            return;
	        }
	        let navPathElements = element[0].children;
	        for (let i = 0; i < navPathElements.length; i++) {
	            let _environment = this.getElement(navPathElements[i]);
	            if (_environment) {
	                this.list.push(_environment);
	            }
	        }
	    },
	    writeEnvironmentList: function (element, node) {
	        if (typeof node == "string") {
	            console.log(node);
	            var root = element.getRootNode().children[0];
	            var createNode = xmlStream$2.createElement("环境列表");
	            root.appendChild(createNode);
	            root.append("\n\t");
	            var weather = xmlStream$2.createElement("天气");
	            weather.setAttribute("类型", node);
	            createNode.appendChild(weather);
	            createNode.append("\n\t");

	        } else {
	            var createNode = xmlStream$2.createElement("环境");
	            
	            createNode.setAttribute("区域标识", node.getId());
	            for (const key in node) {
	                switch (key) {
	                    case "cloud":
	                        var element_cloud = xmlStream$2.createElement("云层");
	                        createNode.appendChild(element_cloud);
	                        createNode.append("\n\t");
	                        element_cloud.setAttribute("高度", node[key].height);
	                        element_cloud.setAttribute("最大高度", node[key].maxHeight);
	                        element_cloud.setAttribute("浓度", node[key].concentration);
	                        break;
	                    case "weather":
	                        var element_weather = xmlStream$2.createElement("天气");
	                        createNode.appendChild(element_weather);
	                        createNode.append("\n\t");
	                        element_weather.setAttribute("温度", node[key].temp);
	                        element_weather.setAttribute("湿度", node[key].humidity);
	                        element_weather.setAttribute("气压", node[key].pressure);
	                        element_weather.setAttribute("雨量", node[key].rainfall);
	                        var element_wind = xmlStream$2.createElement("风速表");
	                        element_weather.appendChild(element_wind);
	                        var windNode = node[key].wind;
	                        for (let i = 0; i < windNode.length; i++) {
	                            var element_wind_s = xmlStream$2.createElement("风速");
	                            element_wind.appendChild(element_wind_s);
	                            element_wind.append("\n\t");
	                            element_wind_s.setAttribute("高度", windNode[i].height);
	                            element_wind_s.setAttribute("风向", windNode[i].wind_d);
	                            element_wind_s.setAttribute("速度", windNode[i].wind_s);
	                        }
	                        break;
	                    case "ocean":
	                        var element_ocean = xmlStream$2.createElement("海洋");
	                        createNode.appendChild(element_ocean);
	                        createNode.append("\n\t");
	                        element_ocean.setAttribute("海况", node[key].seaState);
	                        element_ocean.setAttribute("浪向", node[key].wave_d);
	                        element_ocean.setAttribute("浪高", node[key].wave_h);
	                        var element_flow = xmlStream$2.createElement("洋流表");
	                        element_ocean.appendChild(element_flow);
	                        var flowNode = node[key].flow;
	                        for (let i = 0; i < flowNode.length; i++) {
	                            var element_flow_s = xmlStream$2.createElement("流速");
	                            element_flow.appendChild(element_flow_s);
	                            element_flow.append("\n\t");
	                            element_flow_s.setAttribute("深度", flowNode[i].depth);
	                            element_flow_s.setAttribute("流向", flowNode[i].flow_d);
	                            element_flow_s.setAttribute("速度", flowNode[i].flow_s);
	                        }
	                        break;
	                    case "vision":
	                        var element_vision = xmlStream$2.createElement("视觉");
	                        createNode.appendChild(element_vision);
	                        createNode.append("\n\t");
	                        element_vision.setAttribute("最大范围", node[key].maximumRange);
	                        element_vision.setAttribute("识别范围", node[key].identificationRange);
	                        break;
	                    case "infrared":
	                        var element_infrared = xmlStream$2.createElement("红外");
	                        createNode.appendChild(element_infrared);
	                        createNode.append("\n\t");
	                        element_infrared.setAttribute("最大范围", node[key].maximumRange);
	                        element_infrared.setAttribute("识别范围", node[key].identificationRange);
	                        break;
	                    case "sonar":
	                        var element_sonar = xmlStream$2.createElement("声呐");
	                        createNode.appendChild(element_sonar);
	                        createNode.append("\n\t");
	                        element_sonar.setAttribute("最大范围", node[key].maximumRange);
	                        var element_thermocline = xmlStream$2.createElement("温跃层");
	                        element_sonar.appendChild(element_thermocline);
	                        var thermoclineNode = node[key].thermocline;
	                        for (let i = 0; i < thermoclineNode.length; i++) {
	                            var element_temp = xmlStream$2.createElement("测温");
	                            element_thermocline.appendChild(element_temp);
	                            element_thermocline.append("\n\t");
	                            element_temp.setAttribute("深度", thermoclineNode[i].depth);
	                            element_temp.setAttribute("温度", thermoclineNode[i].temp);
	                        }
	                        break;
	                    case "radar":
	                        var element_radar = xmlStream$2.createElement("雷达探测范围");
	                        element_sonar.appendChild(element_radar);
	                        var radarNode = node[key];
	                        for (let i = 0; i < radarNode.length; i++) {
	                            var element_temp = xmlStream$2.createElement("探测");
	                            element_radar.appendChild(element_temp);
	                            element_radar.append("\n\t");
	                            element_temp.setAttribute("频率", radarNode[i].frequency);
	                            element_temp.setAttribute("范围", radarNode[i].range);
	                        }
	                        break;
	                }
	            }
	        }


	        // }
	    },
	    writeXml: function (element) {
	        for (let i = 0; i < this.list.length; i++) {
	            this.writeEnvironmentList(element, this.list[i]);
	        }
	    }
	});

	var environment = function () {
	    this.equipment = {};
	};
	environment.prototype = Object.assign({
	    setList: function (key, value) {
	        this.equipment[key] = value;
	    }
	}, {
	    copy: function (source) {
	        let obj = Object.assign(source);
	        this.cloud = obj.cloud;
	        this.weather = obj.weather;
	        this.ocean = obj.ocean;
	        this.vision = obj.vision;
	        this.infrared = obj.infrared;
	        this.sonar = obj.sonar;
	        this.radar = obj.radar;
	        this.id = obj.id;

	        return this;

	    },
	    clone: function () {
	        return new environment().copy(this);
	    },
	});

	String2XML();

	function equipmentList(element) {
	    this.list = {};
	    this._equipment = new environment();
	    this.readXml(element);
	}
	equipmentList.prototype = Object.assign({
	    getList: function () {
	        return this.list;
	    },
	    readXml: function (element) {
	        if (element.length == 0) {
	            return;
	        }
	        let equipmentElements = element[0].children;
	        for (let i = 0; i < equipmentElements.length; i++) {
	            let _environment = this.getElement(equipmentElements[i]);
	            if (_environment) {
	                // this.list.push(_environment);
	                this.list = Object.assign(_environment);
	            }
	        }
	    },
	    getElement: function (eleequipment) {
	        if (eleequipment) {
	            var modelId = eleequipment.getAttribute("标识");
	            var name = eleequipment.getAttribute("名称");
	            this._equipment.setList(modelId,name);
	            return this._equipment.equipment
	        } else {
	            return null;
	        }

	    },
	    writeEnvironmentList: function (element, node) {},
	    writeXml: function (element) {
	        for (let i = 0; i < this.list.length; i++) {
	            this.writeEnvironmentList(element, this.list[i]);
	        }
	    }
	});

	var news = function () {
	    this.news = [];
	};
	news.prototype = Object.assign({
	    setList: function (id) {
	        this.news.push(id);
	    }
	}, {
	    copy: function (source) {
	        let obj = Object.assign(source);
	        this.id = obj.id;

	        return this;

	    },
	    clone: function () {
	        return new news().copy(this);
	    },
	});

	String2XML();

	function newsList(element) {
	    this.list = {};
	    this.news = new news();
	    this.readXml(element);
	}
	newsList.prototype = Object.assign({
	    getList: function () {
	        return this.list;
	    },
	    readXml: function (element) {
	        console.log(element);
	        if (element.length == 0) {
	            return;
	        }
	        let newsElements = element[0].children;
	        for (let i = 0; i < newsElements.length; i++) {
	            let _news = this.getElement(newsElements[i]);
	            if (_news) {
	                this.list = Object.assign(_news);
	            }
	        }
	    },
	    getElement: function (newsElements) {
	        if (newsElements) {
	            var modelId = newsElements.getAttribute("序号");
	            this.news.setList(modelId);
	            return this.news.news
	        } else {
	            return null;
	        }

	    },
	    writeEnvironmentList: function (element, node) {},
	    writeXml: function (element) {
	        for (let i = 0; i < this.list.length; i++) {
	            this.writeEnvironmentList(element, this.list[i]);
	        }
	    }
	});

	var xmlStream$1 = String2XML();
	var GeoData = function () {
	    this.interestAreaId = -1;
	    this.operationAreaId = -1;
	    this.operationRouteId = -1;
	    this.interestPoint = {
	        x:0,
	        y:0,
	        z:0
	    };
	};
	GeoData.prototype = Object.assign({
	    getInterestAreaId:function(){
	        return this.interestAreaId;
	    },
	    setInterestAreaId:function(interestAreaId){
	        this.interestAreaId = interestAreaId;
	    },
	    getOperationAreaId:function(){
	        return this.operationAreaId;
	    },
	    setOperationAreaId:function(operationAreaId){
	        this.operationAreaId = operationAreaId;
	    },
	    getOperationRouteId:function(){
	        return this.operationRouteId;
	    },
	    setOperationRouteId:function(operationRouteId){
	        this.operationRouteId = operationRouteId;
	    },
	    getInterestPoint:function(){
	        return this.interestPoint;
	    },
	    setInterestPoint:function(interestPoint){
	        this.interestPoint = interestPoint;
	    },
	    getInterestPointIsHave:function(){
	        if((this.interestPoint.x==0&&this.interestPoint.y==0)||this.interestPoint == null){
	            return false;
	        }else {
	            return true;
	        }
	    }
	},{
	    writeXml:function(element){
	        var geoDataNode = xmlStream$1.createElement("地理数据");
	        if(this.getInterestAreaId()>0){
	            geoDataNode.setAttribute("兴趣区",this.getInterestAreaId());
	        }
	        if(this.getOperationAreaId()>0){
	            geoDataNode.setAttribute("操作区",this.getOperationAreaId());
	        }
	        if(this.getOperationRouteId()>0){
	            geoDataNode.setAttribute("操作路线",this.getOperationRouteId());
	        }
	        if(this.getInterestPointIsHave()){
	            var interestPointele = xmlStream$1.createElement("兴趣点"); 
	            interestPointele.setAttribute("经度",this.interestPoint.x);
	            interestPointele.setAttribute("纬度",this.interestPoint.y);
	            interestPointele.setAttribute("高度",this.interestPoint.z);
	            geoDataNode.appendChild(interestPointele);
	        }
	        element.append("\n\t");
	        element.appendChild(geoDataNode);
	    }
	});

	var Platform = function () {
	    this.sPlatform = "";
	    this.aPlatform = [];

	    // execute at_time 0.1 sec absolute

	    // WsfPlatform p = WsfSimulation.CreatePlatform("COMMERCIAL_JET");
	    // p.ProcessInput("icon B-747");
	    // p.ProcessInput("side red");
	    
	    // lat = RANDOM.Uniform(30.,50.);
	    // lon = RANDOM.Uniform(70.,130.);
	    // head = RANDOM.Uniform(-180.,180.);
	    // string loc = write_str("position ",lat,"n ",lon,"w altitude 30000 ft msl");
	    // p.ProcessInput(loc);
	    
	    // string temp = (string)i;
	    // if(i< 10) temp = write_str("0",temp);
	    // if(i< 100) temp = write_str("0",temp);
	    // if(i< 1000) temp = write_str("0",temp);
	    // string name = write_str("commercial-",temp);
	    // WsfPlatform pa = WsfSimulation.AddPlatform(p,name);

	    // end_execute
	};

	Platform.prototype = Object.assign({
	    save:function(){
	        // 创建一个Blob对象，将数组转换为文本  
	        var blob = new Blob([this.aPlatform.join("\n")], {type: "text/plain;charset=utf-8"});  
	        
	        // 创建一个URL代表这个Blob对象  
	        var url = URL.createObjectURL(blob);  
	        
	        // 创建一个a元素用于下载文件  
	        var a = document.createElement("a");  
	        a.href = url;  
	        a.download = "output.txt"; // 文件名，你可以按需修改  
	        a.style.display = 'none';  
	        
	        // 将a元素添加到DOM中，然后触发点击事件以开始下载  
	        document.body.appendChild(a);  
	        a.click();  
	        
	        // 然后从DOM中移除a元素  
	        document.body.removeChild(a);
	    },
	    setPlatformType:function(type){
	        let s = "platform_type "+type+" WSF_PLATFORM";
	        // this.sPlatform += s;
	        this.typePlatform.push(s);

	    },
	    initPlatform:function(name,type){
	        let sPlatform = "platform " + name + " "+type;
	        this.aPlatform.push(sPlatform);
	        this.aPlatform.push("end_platform");
	    },
	    ProcessInput:function(s){
	        this.aPlatform.splice(this.aPlatform.length-1,0,s);
	        console.log(this.aPlatform);
	    },

	});

	// import TXXML from '../TX/TXXML';

	// window.txXMLconst = new TXXML();

	var xmlStream = String2XML();

	var CGFEntity = function (parent, nodeType) {
	    this.name = null;
	    this.id = -1;
	    this.typeId = -1;
	    this.modelId = -1;
	    this.doctrineId = -1;
	    this.side = -1;
	    this.speed = 0;
	    this.heading = 0;
	    this.targetId = -1;
	    this.AOIId = -1;
	    this.parent = parent;
	    this.nodeType = nodeType;
	    this.formationId = -1;

	    this.carrier = -1; //载体
	    this.base = -1; //基地

	    this.hangingBullet = []; // 挂弹
	    this.bait = []; // 诱饵
	    this.sensor = []; // 传感器

	    this.visible = true; // 兵力是否可见

	    this.areaId = -1;
	    
	    this.children = [];
	    if (parent) {
	        parent.addChild(this);
	    }
	    this.position = {
	        x: 0,
	        y: 0,
	        z: 0
	    };

	    this.geoData = null;
	    this.navPath = new NavPath();

	    this.ckList = [];
	    this.qbList = [];
	    this.txList = null;

	    this.realCGF = false;
	};
	CGFEntity.prototype = Object.assign({
	    getName: function () {
	        return this.name;
	    },
	    setName: function (name) {
	        this.name = name;
	    },
	    getId: function () {
	        return this.id;
	    },
	    setId: function (id) {
	        this.id = id;
	    },
	    getTypeId: function () {
	        return this.typeId;
	    },
	    setTypeId: function (typeId) {
	        this.typeId = typeId;
	    },
	    getModelId: function () {
	        return this.modelId;
	    },
	    setModelId: function (modelId) {
	        this.modelId = modelId;
	    },
	    getDoctrineId: function () {
	        return this.doctrineId;
	    },
	    setDoctrineId: function (doctrineId) {
	        this.doctrineId = doctrineId;
	    },
	    getSide: function () {
	        return this.side;
	    },
	    setSide: function (side) {
	        this.side = side;
	    },
	    getSpeed: function () {
	        return this.speed;
	    },
	    setSpeed: function (speed) {
	        this.speed = speed;
	    },
	    getHeading: function () {
	        return this.heading;
	    },
	    setHeading: function (heading) {
	        this.heading = heading;
	    },
	    getTargetId: function () {
	        return this.targetId;
	    },
	    setTargetId: function (targetId) {
	        this.targetId = targetId;
	    },
	    getAOIId: function () {
	        return this.AOIId;
	    },
	    setAOIId: function (AOIId) {
	        this.AOIId = AOIId;
	    },
	    getNodeType: function () {
	        return this.nodeType;
	    },
	    setNodeType: function (nodeType) {
	        this.nodeType = nodeType;
	    },
	    getFormationId: function () {
	        return this.formationId;
	    },
	    setFormationId: function (formationId) {
	        this.formationId = formationId;
	    },
	    getGeoData: function () {

	        return this.geoData;
	    },
	    setGeoData: function (geoData) {
	        this.geoData = geoData;
	    },
	    getPosition: function () {
	        return this.position;
	    },
	    setPosition: function (position) {
	        this.position = position;
	    },
	    getNavPath: function () {
	        return this.navPath;
	    },
	    setNavPath: function (navPath) {
	        this.navPath = navPath;
	    },
	    getCarrier: function () {
	        return this.carrier;
	    },
	    setCarrier: function (carrier) {
	        this.carrier = carrier;
	    },
	    getBase: function () {
	        return this.base;
	    },
	    setBase: function (base) {
	        this.base = base;
	    },
	    getAreaId:function(){
	        return this.areaId;
	    },
	    setAreaId:function(areaId){
	        this.areaId = areaId;
	    },
	    getChildren: function () {
	        return this.children;
	    },
	    getParent: function () {
	        return this.parent;
	    },
	    setParent: function (parent) {
	        if (this.parent != null) {
	            this.parent.takeChild(this);
	        }

	        if (parent != null) {
	            parent.addChild(this);
	        }
	    },
	    addHangingBullet(node) {
	        this.hangingBullet.push(node);
	    },
	    getHangingBullet() {
	        return this.hangingBullet
	    },
	    setBait(node) {
	        this.bait.push(node);
	    },
	    getBait() {
	        return this.bait
	    },
	    setSensor(node) {
	        this.sensor.push(node);
	    },
	    getSensor() {
	        return this.sensor
	    },

	    setRealCGF(realCGF){
	        this.realCGF = realCGF;
	    },
	    getRealCGF(){
	        return this.realCGF
	    }
	}, {
	    addChild: function (child) {
	        if (child == null) {
	            return;
	        }

	        child.parent = this;
	        child.side = this.side;
	        this.children.push(child);
	    },
	    addChildren: function (children) {
	        for (let i = 0; i < children.length; i++) {
	            children[i].parent = this;
	            children[i].side = this.side;
	        }
	        this.children.concat(children);
	    },
	    insertChild: function (index, child) {
	        child.parent = this;
	        child.side = this.side;
	        this.children.splice(index, 0, child);
	    },
	    insertChildren: function (index, children) {
	        for (let i = 0; i < children.length; i++) {
	            children[i].parent = this;
	            children[i].side = this.side;
	            this.children.splice(index + i, 0, children[i]);
	        }
	    },
	    removeChild: function (child) {
	        var i = this.children.indexOf(child);
	        if (i >= 0) {
	            this.removeChildrenPrivate(i, 1, true);
	        }
	    },
	    removeAllChildren: function () {
	        this.removeChildrenPrivate(0, this.children.length, false);
	    },
	    removeChildrenPrivate: function (from, count, destroy) {
	        if (from < 0 || count <= 0) {
	            return;
	        }
	        this.children.splice(from, count);

	    },
	    takeChild: function (index) {
	        if (index < 0) {
	            return null;
	        }

	        let n = children.length;

	        if (index >= n) {
	            return null;
	        }

	        var pChild = this.children[index];

	        this.removeChildrenPrivate(index, 1, false);

	        return pChild;
	    },
	    child: function (index) {
	        if (index < 0) {
	            return null;
	        }

	        let n = this.children.length;

	        if (index >= n) {
	            return null;
	        }

	        return this.children[index];
	    },
	    childCount: function () {
	        return this.children.length;
	    },
	    indexOfChild: function (child) {
	        return this.children.indexOf(child);
	    },
	    //初始地理数据
	    initGeoData: function (geoData) {
	        let _geoData = new GeoData();
	        var interestArea = geoData.getAttribute("兴趣区") || -1;
	        var operationArea = geoData.getAttribute("操作区") || -1;
	        var operationRoute = geoData.getAttribute("操作路线") || -1;
	        _geoData.setInterestAreaId(Number(interestArea));
	        _geoData.setOperationAreaId(Number(operationArea));
	        _geoData.setOperationRouteId(Number(operationRoute));

	        var interestPoints = geoData.children;
	        for (let interest_i = 0; interest_i < interestPoints.length; interest_i++) {
	            var childElement = interestPoints[interest_i];
	            var _strlon = childElement.getAttribute("经度");
	            var _strlat = childElement.getAttribute("纬度");
	            var _strhight = childElement.getAttribute("高度");
	            _geoData.interestPoint.x = Number(_strlon);
	            _geoData.interestPoint.y = Number(_strlat);
	            _geoData.interestPoint.z = Number(_strhight);
	        }
	        this.setGeoData(_geoData);
	    },
	    readXml: function (element) {
	        var nodeName = element.nodeName;
	        if (nodeName == '指挥') {
	            var strName = element.getAttribute('名称');
	            var strId = Number(element.getAttribute("标识"));
	            var strTypeId = element.getAttribute("类型");
	            var strDoctrinelId = element.getAttribute("行为");
	            var strFormationId = element.getAttribute("编队") || -1;
	            var strCarrier = element.getAttribute("载体") || -1;
	          
	            // this.carrier = null; //载体
	            // this.base = null;  //基地
	            // var strAreaId = element.getAttribute("区域") || -1;
	            this.setName(strName);
	            this.setId(strId);
	            if (strId > NodeUnit.nodeId) {
	                NodeUnit.nodeId = strId;
	            }
	            this.setTypeId(strTypeId);
	            this.setDoctrineId(strDoctrinelId);
	            this.setFormationId(strFormationId);
	            // this.setAreaId(Number(strAreaId));
	            this.setNodeType(NodeUnit.NodeGroup);

	            this.setCarrier(Number(strCarrier));

	            

	            var childElements = element.children;
	            for (let i = 0; i < childElements.length; ++i) {
	                var childElement = childElements[i];
	                if (childElement.nodeName == "指挥" || childElement.nodeName == "兵力") {
	                    var pCGFEntity = new CGFEntity(this, NodeUnit.NodeType.Unkown);
	                    pCGFEntity.readXml(childElement);
	                } else {
	                    var geoData = childElement.getElementsByTagName("地理数据")[0];
	                    if (geoData) {
	                        this.initGeoData(geoData);
	                    }
	                }

	            }

	        } else if (nodeName == '兵力') {
	            var strName = element.getAttribute('名称');
	            var strId = Number(element.getAttribute("标识"));
	            var strTypeId = element.getAttribute("类型");
	            var strModelId = element.getAttribute("型号");
	            var strDoctrinelId = element.getAttribute("行为");

	            var strBase = element.getAttribute("基地") || -1;
	            // var strAreaId = element.getAttribute("区域") || -1;

	            var boolRealCGF = element.getAttribute("实兵") || false;
	            if (strId > NodeUnit.nodeId) {
	                NodeUnit.nodeId = strId;
	            }
	            this.setName(strName);
	            this.setId(strId);
	            this.setTypeId(Number(strTypeId));
	            this.setModelId(Number(strModelId));
	            this.setDoctrineId(Number(strDoctrinelId));
	            // this.setAreaId(Number(strAreaId));

	            this.setNodeType(NodeUnit.NodeCGF);

	            this.setBase(Number(strBase));
	            this.setRealCGF(boolRealCGF);
	            {
	                var geoData = element.getElementsByTagName("地理数据")[0];
	                if (geoData) {
	                    this.initGeoData(geoData);
	                }

	            } {
	                var eleMotion = element.getElementsByTagName("机动")[0]; //机动
	                var strspeed = eleMotion.getAttribute("速度");
	                var strheading = eleMotion.getAttribute("航向");

	                this.setSpeed(Number(strspeed));
	                this.setHeading(Number(strheading));
	            }

	            {
	                var elePosition = element.getElementsByTagName("位置")[0];
	                var strlon = elePosition.getAttribute("经度");
	                var strlat = elePosition.getAttribute("纬度");
	                var strhei = elePosition.getAttribute("高度");

	                this.position.x = Number(strlon);
	                this.position.y = Number(strlat);
	                this.position.z = Number(strhei);
	            }

	            var eleNavPath = element.getElementsByTagName("导航线")[0];
	            if (eleNavPath) {
	                var strLoopIndex = eleNavPath.getAttribute("循环");
	                this.navPath.SetLoopIndex(Number(strLoopIndex));

	                var navPointElements = eleNavPath.children;
	                for (let i = 0; i < navPointElements.length; i++) {
	                    var childElement = navPointElements[i];
	                    var strtime = childElement.getAttribute("时间");
	                    var strlon = childElement.getAttribute("经度");
	                    var strlat = childElement.getAttribute("纬度");
	                    var strhei = childElement.getAttribute("高度");
	                    var strspeed = childElement.getAttribute("速度") || 0;

	                    var navPoint = {
	                        position: {

	                        }
	                    };
	                    navPoint.stamp = Number(strtime);
	                    navPoint.position.x = Number(strlon);
	                    navPoint.position.y = Number(strlat);
	                    navPoint.position.z = Number(strhei);
	                    navPoint.speed = Number(strspeed);
	                    this.navPath.AddNavPoint(navPoint);
	                }
	            }

	            var hangingBullet = element.getElementsByTagName("挂弹")[0];
	            if (hangingBullet) {
	                var arms = hangingBullet.getElementsByTagName("武器");
	                for (let i = 0; i < arms.length; i++) {
	                    var serialNumber = arms[i].getAttribute("序号");
	                    var name = arms[i].getAttribute("名称");
	                    var ammunition_node = arms[i].children;
	                    var ammunition = [];
	                    for (let k = 0; k < ammunition_node.length; k++) {
	                        var serialNumber_ammunition = ammunition_node[k].getAttribute("序号");
	                        var name_ammunition = ammunition_node[k].getAttribute("名称");
	                        var quantity_ammunition = Number(ammunition_node[k].getAttribute("数量"));
	                        ammunition.push({
	                            serialNumber_ammunition,
	                            quantity_ammunition,
	                            name_ammunition
	                        });
	                    }

	                    var temp_arms = {
	                        serialNumber,
	                        ammunition,
	                        name
	                    };
	                    this.addHangingBullet(temp_arms);
	                }
	            }

	            var bait = element.getElementsByTagName("诱饵")[0];
	            if (bait) {
	                var load_element = bait.getElementsByTagName("装载");
	                for (let i = 0; i < load_element.length; i++) {
	                    var serialNumber = load_element[i].getAttribute("序号");
	                    var name = load_element[i].getAttribute("名称");
	                    var quantity = load_element[i].getAttribute("数量");
	                    var load = {
	                        serialNumber,
	                        quantity,
	                        name
	                    };
	                    this.setBait(load);
	                }
	            }
	            var sensorPlan = element.getElementsByTagName("传感器计划")[0];
	            if (sensorPlan) {
	                var sensor_element = sensorPlan.getElementsByTagName("传感器");
	                for (let i = 0; i < sensor_element.length; i++) {
	                    var serialNumber = sensor_element[i].getAttribute("序号");
	                    var name = sensor_element[i].getAttribute("名称");
	                    var model = sensor_element[i].getAttribute("模式");
	                    var scanningMode = sensor_element[i].getAttribute("扫描方式");
	                    var startAngle = sensor_element[i].getAttribute("起始角");
	                    var endangle = sensor_element[i].getAttribute("终止角");
	                    var sensor = {
	                        serialNumber,
	                        model,
	                        scanningMode,
	                        startAngle,
	                        endangle,
	                        name
	                    };
	                    this.setSensor(sensor);
	                }
	            }
	        }
	    },
	    writeXml: function (xmlObject, navPathNodes) {
	        if (this.parent == null) {
	            //stream.writeStartElement(this->getName());
	            var node = xmlStream.createElement(this.getName());
	            xmlObject.appendChild(node);
	            xmlObject.append("\n\t");
	            for (let i = 0; i < this.children.length; i++) {
	                this.children[i].writeXml(node, navPathNodes);
	            }
	            //stream.writeEndElement();
	            return;
	        }
	        // txXMLconst.initXML(this)
	        if (this.getNodeType() == NodeUnit.NodeGroup) {
	            var node = xmlStream.createElement("指挥");
	            xmlObject.append("\n\t");
	            xmlObject.appendChild(node);
	            xmlObject.append("\n\t");
	            node.setAttribute("标识", this.getId());
	            node.setAttribute("名称", this.getName());
	            node.setAttribute("类型", this.getTypeId());
	            if (this.getDoctrineId() > 0) {
	                node.setAttribute("行为", this.getDoctrineId());
	            }
	            if (this.getFormationId() > 0) {
	                node.setAttribute("编队", this.getFormationId());
	            }
	            if (this.getCarrier() > 0) {
	                node.setAttribute("载体", this.getCarrier());
	            }
	            // node.setAttribute("区域", this.getAreaId());
	            if (this.geoData) {
	                this.geoData.writeXml(node);
	            }
	            for (let j = 0; j < this.children.length; j++) {
	                let child = this.children[j];
	                child.writeXml(node, navPathNodes);
	            }

	        } else {
	            var node = xmlStream.createElement("兵力");
	            xmlObject.append("\n\t");
	            xmlObject.appendChild(node);
	            xmlObject.append("\n\t");
	            node.setAttribute("标识", this.getId());
	            node.setAttribute("名称", this.getName());
	            node.setAttribute("类型", this.getTypeId());
	            node.setAttribute("型号", this.getModelId());
	            node.setAttribute("实兵", this.getRealCGF());
	            if (this.getDoctrineId() > 0) {
	                node.setAttribute("行为", this.getDoctrineId());
	            }
	            if (this.getFormationId() > 0) {
	                node.setAttribute("编队", this.getFormationId());
	            }
	            if (this.getBase() > 0) {
	                node.setAttribute("基地", this.getBase());
	            }
	            // node.setAttribute("区域", this.getAreaId());
	            if (this.geoData) {
	                this.geoData.writeXml(node);
	            }
	            var node_maneuver = xmlStream.createElement("机动");
	            node.append("\n\t");
	            node.appendChild(node_maneuver);
	            node.append("\n\t");
	            node_maneuver.setAttribute("速度", this.getSpeed());
	            node_maneuver.setAttribute("航向", this.getHeading());

	            var node_position = xmlStream.createElement("位置");
	            node.appendChild(node_position);
	            node.append("\n\t");
	            node_position.setAttribute("经度", this.position.x);
	            node_position.setAttribute("纬度", this.position.y);
	            node_position.setAttribute("高度", this.position.z);
	            if (window.navPath_value > 0) {
	                if ((this.getModelId() == 2125770525 || this.getModelId() == 2118634858 || this.getModelId() == 2135514786) && this.side == 1) {
	                    let navPathData = navPathNodes.getChildByNum(window.navPath_value);
	                    console.log(navPathData);
	                    var node_navPath = xmlStream.createElement("导航线");
	                    node.appendChild(node_navPath);
	                    node.append("\n\t");
	                    node_navPath.setAttribute("循环", -1);
	                    for (let k = 0; k < navPathData.NavPointlist.length; k++) {
	                        const element = navPathData.NavPointlist[k];
	                        var node_navPoint = xmlStream.createElement("航路点");
	                        node_navPath.appendChild(node_navPoint);
	                        node_navPath.append("\n\t");
	                        node_navPoint.setAttribute("时间", element.stamp);
	                        node_navPoint.setAttribute("经度", element.position.x);
	                        node_navPoint.setAttribute("纬度", element.position.y);
	                        node_navPoint.setAttribute("高度", element.position.z);
	                        node_navPoint.setAttribute("速度", navPoint.speed);
	                    }
	                } else {
	                    var navPointCount = this.navPath.getNavPointCount();
	                    if (navPointCount > 0) {
	                        var node_navPath = xmlStream.createElement("导航线");
	                        node.appendChild(node_navPath);
	                        node.append("\n\t");
	                        node_navPath.setAttribute("循环", this.navPath.getLoopIndex());
	                        for (let k = 0; k < navPointCount; k++) {
	                            var navPoint = this.navPath.getNavPointByIndex(k);
	                            var node_navPoint = xmlStream.createElement("航路点");
	                            node_navPath.appendChild(node_navPoint);
	                            node_navPath.append("\n\t");
	                            node_navPoint.setAttribute("时间", navPoint.stamp);
	                            node_navPoint.setAttribute("经度", navPoint.position.x);
	                            node_navPoint.setAttribute("纬度", navPoint.position.y);
	                            node_navPoint.setAttribute("高度", navPoint.position.z);
	                            node_navPoint.setAttribute("速度", navPoint.speed);

	                        }
	                    }
	                }
	            } else {
	                var navPointCount = this.navPath.getNavPointCount();
	                if (navPointCount > 0) {
	                    var node_navPath = xmlStream.createElement("导航线");
	                    node.appendChild(node_navPath);
	                    node.append("\n\t");
	                    node_navPath.setAttribute("循环", this.navPath.getLoopIndex());
	                    for (let k = 0; k < navPointCount; k++) {
	                        var navPoint = this.navPath.getNavPointByIndex(k);
	                        var node_navPoint = xmlStream.createElement("航路点");
	                        node_navPath.appendChild(node_navPoint);
	                        node_navPath.append("\n\t");
	                        node_navPoint.setAttribute("时间", navPoint.stamp);
	                        node_navPoint.setAttribute("经度", navPoint.position.x);
	                        node_navPoint.setAttribute("纬度", navPoint.position.y);
	                        node_navPoint.setAttribute("高度", navPoint.position.z);
	                        node_navPoint.setAttribute("速度", navPoint.speed);
	                    }
	                }
	            }

	            {
	                var hangingBullet = this.getHangingBullet();
	                if (hangingBullet.length > 0) {
	                    var node_hangingBullet = xmlStream.createElement("挂弹");
	                    node.appendChild(node_hangingBullet);
	                    node.append("\n\t");
	                    for (let i = 0; i < hangingBullet.length; i++) {
	                        var node_arms = xmlStream.createElement("武器");
	                        node_hangingBullet.appendChild(node_arms);
	                        node_hangingBullet.append("\n\t");
	                        node_arms.setAttribute("序号", hangingBullet[i].serialNumber);
	                        node_arms.setAttribute("名称", hangingBullet[i].name);
	                        var ammunition = hangingBullet[i].ammunition;
	                        for (let j = 0; j < ammunition.length; j++) {
	                            var node_ammunition = xmlStream.createElement("弹药");
	                            node_arms.appendChild(node_ammunition);
	                            node_arms.append("\n\t");
	                            node_ammunition.setAttribute("序号", ammunition[j].serialNumber_ammunition);
	                            node_ammunition.setAttribute("名称", ammunition[j].name_ammunition);
	                            node_ammunition.setAttribute("数量", ammunition[j].quantity_ammunition);
	                        }
	                    }
	                }
	            }

	            {
	                var bait = this.getBait();
	                if (bait.length > 0) {
	                    var node_bait = xmlStream.createElement("诱饵");
	                    node.appendChild(node_bait);
	                    node.append("\n\t");
	                    for (let i = 0; i < bait.length; i++) {
	                        var node_element = xmlStream.createElement("装载");
	                        node_bait.appendChild(node_element);
	                        node_bait.append("\n\t");
	                        node_element.setAttribute("序号", bait[i].serialNumber);
	                        node_element.setAttribute("名称", bait[i].name);
	                        node_element.setAttribute("数量", bait[i].quantity);
	                    }
	                }
	            }

	            {
	                var sensor = this.getSensor();
	                if (sensor.length > 0) {
	                    var node_bait = xmlStream.createElement("传感器计划");
	                    node.appendChild(node_bait);
	                    node.append("\n\t");
	                    for (let i = 0; i < sensor.length; i++) {
	                        var node_element = xmlStream.createElement("传感器");
	                        node_bait.appendChild(node_element);
	                        node_bait.append("\n\t");
	                        node_element.setAttribute("序号", sensor[i].serialNumber);
	                        node_element.setAttribute("模式", sensor[i].model);
	                        node_element.setAttribute("扫描方式", sensor[i].scanningMode);
	                        node_element.setAttribute("起始角", sensor[i].startAngle);
	                        node_element.setAttribute("终止角", sensor[i].endangle);
	                    }
	                }
	            }

	            if (this.visible) {
	                if (this.side == 2) {
	                    var root = xmlObject.getRootNode().children[0];
	                    var news = root.getElementsByTagName('情报列表');
	                    if (news.length > 0) {
	                        // 更新情报列表标签
	                        var newsList = news[0];
	                    } else {
	                        // 创建情报列表标签
	                        var newsList = xmlStream.createElement("情报列表");
	                        root.appendChild(newsList);
	                        root.append("\n\t");
	                    }
	                    // 判断是否存在重复兵力，存在赋值为false
	                    let type = true;
	                    for (let q = 0; q < newsList.children.length; q++) {
	                        const element = newsList.children[q].getAttribute("序号");
	                        if (element == this.id) {
	                            type = false;
	                        }
	                    }
	                    // 值为true说明不是重复兵力添加到情报列表内，否则不添加
	                    if (type) {
	                        var cgf = xmlStream.createElement("兵力");
	                        cgf.setAttribute("序号", this.id);
	                        newsList.appendChild(cgf);
	                        newsList.append("\n\t");
	                    }
	                }
	            }

	            if (this.regionList) {
	                console.Log(this.regionList);

	            }   

	        }
	    },

	    writeTxt:function(platforms,platformTypes){
	        if (this.parent == null) {
	            //stream.writeStartElement(this->getName());
	            
	            for (let i = 0; i < this.children.length; i++) {
	                this.children[i].writeTxt(platforms,platformTypes);
	            }
	            //stream.writeEndElement();
	            return;
	        }
	        if (this.getNodeType() == NodeUnit.NodeGroup) ; else {
	            let platform = new Platform();
	            
	            platform.initPlatform(this.getName(),this.getModelId());
	            platform.ProcessInput("position "+  this.position.y + "n "+this.position.x +"e " );
	            platform.ProcessInput("heading "+ this.getHeading() + " deg");
	            platform.ProcessInput("altitude "+ this.position.z + " m");
	            platform.ProcessInput("side "+ sideToSim(this.side) );

	            {//设置路径点
	                if(this.navPath.getList().length>0){
	                    platform.ProcessInput("route " );
	                    let NavPointlist = this.navPath.getList(); 
	                    for(let nav_i=0;nav_i<NavPointlist.length;nav_i++){
	                        //   position 40.11804730599107n 113.60665077285927e altitude 0 m heading 90 deg speed 10 m/s
	                        let point = NavPointlist[nav_i];
	                        let sPoint = "position "+ point.position.y + "n "+point.position.x +"e " + "altitude "+point.position.z + " m " + "heading 0 deg " + "speed "+ point.speed + " m/s";
	                        platform.ProcessInput(sPoint); 

	                    }
	                    platform.ProcessInput("end_route " );
	                }
	            }
	            platforms.push(platform);
	            platformTypes.push(this.getModelId());


	            // node.setAttribute("标识", this.getId());
	            // node.setAttribute("名称", this.getName());
	            // node.setAttribute("类型", this.getTypeId());
	            // node.setAttribute("型号", this.getModelId());
	            
	            // if (this.geoData) {
	            //     this.geoData.writeXml(node);
	            // }
	            // var node_maneuver = xmlStream.createElement("机动");
	            // node.append("\n\t");
	            // node.appendChild(node_maneuver);
	            // node.append("\n\t");
	            // node_maneuver.setAttribute("速度", this.getSpeed());
	            // node_maneuver.setAttribute("航向", this.getHeading());

	            // var node_position = xmlStream.createElement("位置");
	            // node.appendChild(node_position);
	            // node.append("\n\t");
	            // node_position.setAttribute("经度", this.position.x);
	            // node_position.setAttribute("纬度", this.position.y);
	            // node_position.setAttribute("高度", this.position.z);
	        

	        }   
	    },
	    copy: function (source) {
	        let obj = Object.assign(source);

	        this.name = obj.name;
	        this.id = obj.id;
	        this.typeId = obj.typeId;
	        this.modelId = obj.modelId;
	        this.doctrineId = obj.doctrineId;
	        this.side = obj.side;
	        this.speed = obj.speed;
	        this.heading = obj.heading;
	        this.targetId = obj.targetId;
	        this.AOIId = obj.AOIId;
	        this.parent = null;
	        this.nodeType = obj.nodeType;
	        this.formationId = obj.formationId;

	        this.carrier = obj.carrier; //载体
	        this.base = obj.base; //基地
	        this.position = obj.position;
	        this.hangingBullet = obj.hangingBullet; //武器
	        this.bait = obj.bait; //诱饵
	        this.sensor = obj.sensor; //传感器
	        for (let i = 0; i < obj.children.length; i++) {
	            this.addChild(obj.children[i].clone());
	        }
	        this.geoData = obj.geoData;
	        this.navPath = obj.navPath;

	        this.realCGF = obj.realCGF;
	        return this;
	    },
	    clone: function () {
	        return new CGFEntity(null, this.nodeType).copy(this);
	    }
	});

	var CGFDataModel = function () {
	    this.vecNodes = [];
	    this.file = null;
	    this.navPathNodes = null;
	    this.areaPathNodes = null;

	    this.routePathNodes = null;

	    this.environmentNodes = null;

	    this.areaLibPathNodes = null;

	    this.Init();
	};
	CGFDataModel.prototype.Init = function () {
	    var pRootCGFEntity = new CGFEntity(null, NodeUnit.NodeType.NodeGroup);
	    pRootCGFEntity.setName("红方");
	    pRootCGFEntity.setSide(SideEnum.SideRed);
	    this.vecNodes.push(pRootCGFEntity);

	    var pRootCGFEntity = new CGFEntity(null, NodeUnit.NodeType.NodeGroup);
	    pRootCGFEntity.setName("蓝方");
	    pRootCGFEntity.setSide(SideEnum.SideBlue);
	    this.vecNodes.push(pRootCGFEntity);
	};

	CGFDataModel.prototype.getCGFEntityById = function (id) {

	    let pResult = null;
	    for (let i = 0; i < this.vecNodes.length; i++) {
	        var pCGFEntity = this.vecNodes[i];
	        if (pResult) {
	            return pResult
	        } else {
	            getCGFEntity(pCGFEntity);
	        }

	    }

	    function getCGFEntity(pCGFEntity) {
	        if (pCGFEntity.parent == null) {
	            for (let i = 0; i < pCGFEntity.children.length; i++) {
	                getCGFEntity(pCGFEntity.children[i]);
	            }
	            return;
	        }
	        if(pCGFEntity.getId() == id){
	            pResult = pCGFEntity;
	            return
	        }else {
	            for (let j = 0; j < pCGFEntity.children.length; j++) {
	                let child = pCGFEntity.children[j];
	                getCGFEntity(child);
	            }
	        }
	        // if (pCGFEntity.getNodeType() == NodeUnit.NodeGroup) {
	           
	        //     for (let j = 0; j < pCGFEntity.children.length; j++) {
	        //         let child = pCGFEntity.children[j];
	        //         getCGFEntity(child);
	        //     }
	        // } else {
	        //     if (pCGFEntity.getId() == id) {
	        //         pResult = pCGFEntity
	        //         return
	        //     }

	        // }
	    }

	    return pResult;
	};
	CGFDataModel.prototype.GetNodeCGFEntity = function () {
	    var pResult = [];
	    function traverse( pCGFEntity ) {
	        const children = pCGFEntity.children;
	        if(children.length>0){
	            for ( let pcgf_i = 0, l = children.length; pcgf_i < l; pcgf_i ++ ) {
	                traverse(children[ pcgf_i ]);
	            }
	        }else {
	            pResult.push(pCGFEntity);
	        }
		}
	    for (let i = 0; i < this.vecNodes.length; i++) {
	        if (this.vecNodes[i].children.length>0) {
	            traverse(this.vecNodes[i]);
	        }
	    }
	    return pResult;
	};
	CGFDataModel.prototype.GetNodeCGFEntityBySide = function (nSide) {
	    var pResult = [];
	    function traverse( pCGFEntity ) {
	        const children = pCGFEntity.children;
	        if(children.length>0){
	            for ( let pcgf_i = 0, l = children.length; pcgf_i < l; pcgf_i ++ ) {
	                traverse(children[ pcgf_i ]);
	            }
	        }else {
	            pResult.push(pCGFEntity);
	        }
		}
	    for (let i = 0; i < this.vecNodes.length; i++) {
	        if (this.vecNodes[i].children.length>0&&this.vecNodes[i].getSide() == nSide) {
	            traverse(this.vecNodes[i]);
	        }
	    }
	    return pResult;
	};
	CGFDataModel.prototype.GetRootCGFEntity = function (nSide) {
	    var pResult = null;
	    for (let i = 0; i < this.vecNodes.length; i++) {
	        if (this.vecNodes[i].getSide() == nSide) {
	            pResult = this.vecNodes[i];
	            break;
	        }
	    }
	    return pResult;
	};

	CGFDataModel.prototype.GetRootCGFEntitynSide = function (nSide) {
	    var pResult = [];
	    for (let i = 0; i < this.vecNodes.length; i++) {
	        if (this.vecNodes[i].getSide() != nSide) {
	            pResult = pResult.concat(this.vecNodes[i]);
	            break;
	        }
	    }
	    return pResult;
	};
	CGFDataModel.prototype.GetRootCGFEntitys = function () {
	    return this.vecNodes;
	};
	CGFDataModel.prototype.Clear = function () {
	    this.vecNodes = [];
	    this.file = null;
	    this.navPathNodes = null;
	    this.areaPathNodes = null;
	    this.routePathNodes = null;
	    this.environmentNodes = null;
	    this.equipmentNodes = null;

	    this.areaLibPathNodes = null;
	};

	CGFDataModel.prototype.LoadXml = function (filePath) {
	    this.Clear();
	    let _this = this;
	    const xhr = new XMLHttpRequest();
	    xhr.open("GET", filePath, false);
	    xhr.onload = () => {
	        _this.loadXmlString(xhr.responseText);
	    };
	    xhr.onerror = () => {
	        console.log(xhr.statusText);
	    };
	    xhr.send();
	};
	CGFDataModel.prototype.loadXmlString = function (xmlString) {
	    this.Clear();
	    var _this = this;
	    this.file = String2XML(xmlString);
	    var cgfRootNode = _this.file.getElementsByTagName('作战兵力');
	    if (cgfRootNode == null) {
	        return false;
	    }
	    var childElements = cgfRootNode[0].children;
	    for (var i = 0; i < childElements.length; i++) {
	        var childElement = childElements[i];
	        var nodeName = childElement.nodeName;
	        var pRootCGFEntity = new CGFEntity(null, NodeUnit.NodeType.NodeGroup);
	        pRootCGFEntity.setName(nodeName);
	        if (nodeName == "红方") {
	            pRootCGFEntity.setSide(SideEnum.SideRed);
	        } else if (nodeName == "蓝方") {
	            pRootCGFEntity.setSide(SideEnum.SideBlue);
	        } else if (nodeName == "绿方") {
	            pRootCGFEntity.setSide(SideEnum.SideGreen);
	        } else if (nodeName == "橙方") {
	            pRootCGFEntity.setSide(SideEnum.SideOrange);
	        } else if (nodeName == "黄方") {
	            pRootCGFEntity.setSide(SideEnum.SideYellow);
	        } else if (nodeName == "紫方") {
	            pRootCGFEntity.setSide(SideEnum.SidePurple);
	        }

	        var eleCGFList = childElement.children;
	        for (var j = 0; j < eleCGFList.length; j++) {
	            var eleCGF = eleCGFList[j];
	            var pCGFEntity = new CGFEntity(pRootCGFEntity, NodeUnit.NodeType.Unkown);
	            pCGFEntity.readXml(eleCGF);
	        }
	        this.vecNodes.push(pRootCGFEntity);
	    }

	    let navPaths = _this.file.getElementsByTagName('导航线组');
	    //let navPathElements = navPaths[0].children;
	    this.navPathNodes = new NavPathList(navPaths);

	    // let areaPaths = _this.file.getElementsByTagName('区域组');

	    // this.areaPathNodes = new AreaPathList(areaPaths);

	    let areaLibPaths = _this.file.getElementsByTagName('区域库');

	    this.areaPathNodes = new AreaLibPathList(areaLibPaths);

	    let routePaths = _this.file.getElementsByTagName('路线库');

	    this.routePathNodes = new RoutePathList(routePaths);

	    let environment = _this.file.getElementsByTagName('环境库');

	    this.environmentNodes = new environmentList(environment);

	    let equipment = _this.file.getElementsByTagName('装备列表');

	    this.equipmentNodes = new equipmentList(equipment);

	    let news = _this.file.getElementsByTagName('情报列表');

	    this.newsNodes = new newsList(news);
	};
	CGFDataModel.prototype.save = function () {
	    this.writeXml();
	    DownloadXML(XML2String(this.file), "XD");
	};
	CGFDataModel.prototype.upload = function () {
	    this.writeXml();
	    return XML2String(this.file)
	};
	CGFDataModel.prototype.writeXml = function () {
	    var CGFGroup = this.file.getElementsByTagName("作战兵力")[0];
	    for (let node_i = CGFGroup.children.length - 1; node_i >= 0; node_i--) {
	        let node = CGFGroup.children[node_i];
	        node.remove();
	    }
	    for (let i = 0; i < this.vecNodes.length; i++) {
	        var pCGFEntity = this.vecNodes[i];
	        pCGFEntity.writeXml(CGFGroup,this.navPathNodes);
	    }
	    let navPathNode = this.file.getElementsByTagName("导航线组");
	    if (navPathNode) {
	        if (navPathNode.length < 1) {
	            let navPathelement = this.file.createElement("导航线组");
	            this.file.getElementsByTagName("通用想定")[0].appendChild(navPathelement);
	            
	            this.navPathNodes.writeXml(navPathelement);
	        } else {
	            let navPathList = navPathNode[0];
	            for (let node_i = navPathList.children.length - 1; node_i >= 0; node_i--) {
	                let node = navPathList.children[node_i];
	                node.remove();
	            }
	            this.navPathNodes.writeXml(navPathList);
	        }
	    }

	    let areaPathNode = this.file.getElementsByTagName("区域组");
	    if (areaPathNode) {
	        if (areaPathNode.length < 1) ; else {
	            let areaPathList = areaPathNode[0];
	            for (let areanode_i = areaPathList.children.length - 1; areanode_i >= 0; areanode_i--) {
	                let node = areaPathList.children[areanode_i];
	                node.remove();
	            }
	            this.areaPathNodes.writeXml(areaPathList);
	        }
	    }
	    // 环境库 this.environmentNodes
	    let environmentNode = this.file.getElementsByTagName("环境库");
	    if (environmentNode) {
	        if (environmentNode.length < 1) ; else {
	            let environmentList = environmentNode[0];
	            for (let environment_i = environmentList.children.length - 1; environment_i >= 0; environment_i--) {
	                let node = environmentList.children[environment_i];
	                node.remove();
	            }
	            this.environmentNodes.writeXml(environmentList);
	        }
	    }
	};


	CGFDataModel.prototype.saveAFsim = function(){

	    let platforms = [];
	    let types = [];
	    for (let i = 0; i < this.vecNodes.length; i++) {
	        var pCGFEntity = this.vecNodes[i];
	        pCGFEntity.writeTxt(platforms,types);

	    }
	    return [platforms,types]
	};

	// var xmlStream = String2XML();
	var EquipSchemaNode = function(parent,name,typeId){
			this.name = name;
			this.typeId = typeId;
			this.parent = parent;
			this.nodeType = null;
			this.children = [];
	        this.lastChild = false;
			if(parent){
				parent.addChild(this);
			}
		};
	EquipSchemaNode.prototype = Object.assign({
	        setLastChild:function(type){
	            this.lastChild = type;
	        },
	        getName:function(){
	            return this.name;
	        },
	        setName:function(name){
	            this.name = name;
	        },
	        getTypeId:function(){
	            return this.typeId;
	        },
	        setTypeId:function(typeId){
	            this.typeId = typeId;
	        },
	        getNodeType:function(){
	            return this.nodeType;
	        },
	        setNodeType:function(nodeType){
	            this.nodeType = nodeType;
	        },	
	        getNavPath:function()
	        {
	            return this.navPath;
	        },
	        getChildren:function(){
	            return this.children;
	        },
	        getParent:function(){
	            return this.parent;
	        },
	        setParent:function(parent){
	            if (this.parent != null)
	            {
	                this.parent.takeChild(this);
	            }

	            if (parent != null)
	            {
	                parent.addChild(this);
	            }
	        }
	    },  
	    {
	        
	    addChild:function(child){
	        if (child == null)
	        {
	            return;
	        }

	        child.parent = this;
	        child.setNodeType(this.getNodeType());
	        this.children.push(child);
	    },
	    addChildren:function(children){
	        for (let i = 0; i < children.length; i++)
	        {
	            children[i].parent = this;
	            children[i].setNodeType(this.getNodeType());
	        }
	        this.children.concat(children);
	    },
	    insertChild:function(index,child){
	        child.parent = this;
	        child.setNodeType(this.getNodeType());
	        this.children.splice(index,0, child);
	    },
	    insertChildren:function(index,children){
	        for (let i = 0; i < children.length; i++)
	        {
	            children[i].parent = this;
	            children[i].setNodeType(this.getNodeType());
	            this.children.splice(index + i,0, children[i]);
	        }
	    },
	    removeChild:function(child){
	        var i = this.children.indexOf(child);
	        if (i >= 0)
	        {
	            removeChildrenPrivate(i, 1, true);
	        }
	    },
	    removeAllChildren:function(){
	        this.removeChildrenPrivate(0, this.children.length, false);
	    },
	    removeChildrenPrivate:function(from,count,destroy){
	        if (from < 0 || count <= 0)
	        {
	            return;
	        }
	        this.children.splice(from,count);

	    },
	    takeChild:function(index){
	        if (index < 0)
	        {
	            return null;
	        }

	        let n = children.length;

	        if (index >= n)
	        {
	            return null;
	        }

	        var pChild = this.children[index];

	        this.removeChildrenPrivate(index, 1, false);

	        return pChild;
	    },
	    child:function(index){
	        if (index < 0)
	        {
	            return null;
	        }

	        let n = children.length;

	        if (index >= n)
	        {
	            return null;
	        }

	        return this.children[index];
	    },
	    childCount:function(){
	        return this.children.length;
	    },
	    indexOfChild:function(child){
	        return this.children.indexOf(child);
	    },
	    readXml:function(element){

	        var strName =element.getAttribute('name');
	        var strTypeId =element.getAttribute('id');
	        this.setName(strName);
	        this.setTypeId(Number(strTypeId));
	        if(this.parent == null){
	            this.setNodeType(this.getTypeId());
	        }
	        var childElements = element.children;
	        this.setLastChild(childElements.length < 1);
	        for(let i=0;i<childElements.length;i++){
	            var childElement = childElements[i];
	            var nodeName = childElement.nodeName;
	            if(nodeName == "node"){
	                var pEquipSchemaNode = new EquipSchemaNode(this, "", 0);
	                pEquipSchemaNode.readXml(childElement);
	            }
	        }
	        
	    },	
	});

	var EquipNode = function(name,typeId,modelId){
	    this.name = name;
	    this.typeId = typeId;
	    this.modelId = modelId;
	    this.speed = 0;
	    this.hangingBullet = []; // 挂弹
	    this.bait = []; // 诱饵
	    this.sensor = []; // 传感器
	    this.communication = []; // 通讯设备
	};
	EquipNode.prototype = Object.assign({
	    getName:function(){
	        return this.name;
	    },
	    setName:function(name){
	        this.name = name;
	    },
	    getTypeId:function(){
	        return this.typeId;
	    },
	    setTypeId:function(typeId){
	        this.typeId = typeId;
	    },
	    getModelId:function(){
	        return this.modelId;
	    },
	    setModelId:function(modelId){
	        this.modelId = modelId;
	    },	
	    setHangingBullet(node){
	        this.hangingBullet.push(node);
	    },
	    getHangingBullet(){
	        return this.hangingBullet
	    },
	    setBait(node){
	        this.bait.push(node);
	    },
	    getBait(){
	        return this.bait
	    },
	    setSensor(node){
	        this.sensor.push(node);
	    },
	    getSensor(){
	        return this.sensor
	    },
	    setSpeed(speed){
	        this.speed = Number(speed);
	    },
	    getSpeed(){
	        return this.speed
	    },
	    setCommunication(communication){
	        this.communication.push(communication);
	    },
	    getCommunication(){
	        return this.communication
	    }
	});

	var DoctrineNode = function(name,id,typeId){
	    this.name = name;
	    this.typeId = typeId;
	    this.id = id;
	};
	DoctrineNode.prototype = Object.assign({
	    getName:function(){
	        return this.name;
	    },
	    setName:function(name){
	        this.name = name;
	    },
	    getTypeId:function(){
	        return this.typeId;
	    },
	    setTypeId:function(typeId){
	        this.typeId = typeId;
	    },
	    getId:function(){
	        return this.id;
	    },
	    setId:function(id){
	        this.id = id;
	    },
	});

	var FormationNode = function(name,typeId,id){
	    this.name = name;
	    this.typeId = typeId;
	    this.id = id;
	};
	FormationNode.prototype = Object.assign({
	    getName:function(){
	        return this.name;
	    },
	    setName:function(name){
	        this.name = name;
	    },
	    getTypeId:function(){
	        return this.typeId;
	    },
	    setTypeId:function(typeId){
	        this.typeId = typeId;
	    },
	    getId:function(){
	        return this.id;
	    },
	    setId:function(id){
	        this.id = id;
	    },	
	    
	});

	var EquipDataModel = function () {
	    this.mapEquipSchemaNodes = [];

	    this.mapEquipments = [];

	    this.mapDoctrines = [];

	    this.mapFormations = [];

	    this.file = null;

	};
	EquipDataModel.prototype.GettRootEquipSchemaNodes = function () {
	    return this.mapEquipSchemaNodes;
	};
	EquipDataModel.prototype.GetRootEquipSchemaNode = function (nodeType) {
	    var pResult = null;

	    for (let i = 0; i < this.mapEquipSchemaNodes.length; i++) {
	        let pEquipSchemaNode = this.mapEquipSchemaNodes[i];
	        if (pEquipSchemaNode.getNodeType() == nodeType) {
	            pResult = pEquipSchemaNode;
	            break;
	        }
	    }
	    return pResult;
	};
	EquipDataModel.prototype.findEquipSchemaNode = function (pEquipSchemaNode, typeId) {
	    if (pEquipSchemaNode.getTypeId() == typeId) {
	        return pEquipSchemaNode;
	    }

	    let pResult = null;
	    let childs = pEquipSchemaNode.getChildren();
	    for (let i = 0; i < childs.length; i++) {
	        pResult = this.findEquipSchemaNode(childs[i], typeId);
	        if (pResult != null) {
	            break;
	        }
	    }
	    return pResult;
	};
	EquipDataModel.prototype.GetEquipSchemaNode = function (typeId) {
	    let pResult = null;

	    for (let i = 0; i < this.mapEquipSchemaNodes.length; i++) {
	        let pEquipSchemaNode = this.mapEquipSchemaNodes[i];
	        pResult = this.findEquipSchemaNode(pEquipSchemaNode, typeId);
	        if (pResult != null) {
	            break;
	        }
	    }
	    return pResult;
	};
	EquipDataModel.prototype.GetRootEquipNodes = function () {
	    return this.mapEquipments;
	};
	EquipDataModel.prototype.GetEquipNodes = function (pEquipSchemaNode) {
	    let results = [];

	    for (let i = 0; i < this.mapEquipments.length; i++) {
	        let pEquipNode = this.mapEquipments[i];
	        if (pEquipNode.getTypeId() == pEquipSchemaNode.getTypeId()) {
	            // results[pEquipNode.getModelId()] = pEquipNode;	
	            results.push(pEquipNode);
	        }
	    }
	    return results;
	};
	//获取tkb 
	EquipDataModel.prototype.GetEquipNode = function (modelId) {
	    let pResult = null;

	    for (let i = 0; i < this.mapEquipments.length; i++) {
	        let pEquipNode = this.mapEquipments[i];
	        if (pEquipNode.getModelId() == modelId) {
	            pResult = pEquipNode;
	            break
	        }
	    }
	    return pResult;
	};
	//获取所有实体行为
	EquipDataModel.prototype.GetRootDoctrineNodes = function () {
	    return this.mapDoctrines;
	};
	// 获取行为列表
	EquipDataModel.prototype.GetDoctrineNodes = function (pEquipSchemaNode) {
	    let results = [];

	    let pTemp = pEquipSchemaNode;
	    while (pTemp != null) {

	        for (let i = 0; i < this.mapDoctrines.length; i++) {
	            let pDoctrineNode = this.mapDoctrines[i];
	            if (pDoctrineNode.getTypeId() == pTemp.getTypeId()) {
	                // results[pEquipNode.getModelId()] = pEquipNode;
	                results.push(pDoctrineNode);
	            }
	        }
	        pTemp = pTemp.parent;
	    }

	    return results;
	};
	//获取队形
	EquipDataModel.prototype.GetFormationNodes = function (id) {
	    let results = [];
	    for (let i = 0; i < this.mapFormations.length; i++) {
	        let formationNode = this.mapFormations[i];
	        if (id == formationNode.getTypeId()) {
	            results.push(formationNode);
	        }
	    }
	    return results;
	};


	EquipDataModel.prototype.Clear = function () {

	    this.mapEquipSchemaNodes = [];
	    this.mapEquipments = [];
	    this.mapDoctrines = [];
	    this.mapFormations = [];
	    this.file = null;
	};

	EquipDataModel.prototype.LoadXml = function (filePath) {
	    // console.log("EquipDataModelLoadXml");
	    this.Clear();
	    let _this = this;
	    const xhr = new XMLHttpRequest();
	    xhr.open("GET", filePath, false);
	    xhr.onload = () => {
	        // console.log(xhr.responseText)
	        _this.file = String2XML(xhr.responseText);

	        var TKBSchemaNode = _this.file.getElementsByTagName('TKBSchema');
	        if (TKBSchemaNode == null) {
	            return false;
	        }
	        var childElements = TKBSchemaNode[0].children;
	        for (let i = 0; i < childElements.length; i++) {
	            var childElement = childElements[i];
	            //var nodeName = childElement.nodeName;
	            var pEquipSchemaNode = new EquipSchemaNode(null, "", 0);
	            pEquipSchemaNode.readXml(childElement);
	            // _this.mapEquipSchemaNodes[pEquipSchemaNode.getTypeId()] = pEquipSchemaNode;
	            _this.mapEquipSchemaNodes.push(pEquipSchemaNode);
	        }
	        // console.log(_this.mapEquipSchemaNodes)
	        //tkb
	        var node = _this.file.getElementsByTagName('TKB')[0].getElementsByTagName("node");
	        for (let node_t = 0; node_t < node.length; node_t++) {
	            var model = Number(node[node_t].getAttribute("model"));
	            var type = Number(node[node_t].getAttribute("type"));
	            var name = node[node_t].getAttribute("name");
	            var pEquipNode = new EquipNode(name, type, model);

	            var speed = node[node_t].getAttribute("motionMaxVel");
	            if (speed) {
	                pEquipNode.setSpeed(Number(speed));
	            }

	            let weaponChildNode = node[node_t].getElementsByTagName('weapon');
	            if (weaponChildNode.length > 0) {
	                for (let weapon_i = 0; weapon_i < weaponChildNode.length; weapon_i++) {
	                    let weaponName = weaponChildNode[weapon_i].getAttribute('name');
	                    let weaponIndex = weaponChildNode[weapon_i].getAttribute('index');
	                    let ammunition = [];

	                    let weaponChildren = weaponChildNode[weapon_i].children;

	                    for (let munition_i = 0; munition_i < weaponChildren.length; munition_i++) {
	                        let munitionIndex = weaponChildren[munition_i].getAttribute('index');
	                        let munitionName = weaponChildren[munition_i].getAttribute('name');
	                        let munitionLoads = weaponChildren[munition_i].getAttribute('loads');
	                        let temp = {
	                            "serialNumber_ammunition": munitionIndex,
	                            "quantity_ammunition": munitionLoads,
	                            "name_ammunition": munitionName,
	                        };
	                        ammunition.push(temp);
	                    }
	                    let weaponJson = {
	                        "serialNumber": weaponIndex,
	                        "name": weaponName,
	                        "ammunition": ammunition
	                    };
	                    pEquipNode.setHangingBullet(weaponJson);
	                }
	            }
	            let sensorChildNode = node[node_t].getElementsByTagName('sensor');
	            if (sensorChildNode.length > 0) {
	                for (let sensor_i = 0; sensor_i < sensorChildNode.length; sensor_i++) {
	                    let sensorIndex = sensorChildNode[sensor_i].getAttribute('index');
	                    let sensorName = sensorChildNode[sensor_i].getAttribute('name');
	                    let sensorJson = {
	                        "serialNumber": sensorIndex,
	                        "name": sensorName,
	                        "model": "",
	                        "scanningMode": "",
	                        "startAngle": "",
	                        "endangle": "",
	                    };
	                    pEquipNode.setSensor(sensorJson);
	                }
	            }
	            let decoyChildNode = node[node_t].getElementsByTagName('decoy');
	            if (decoyChildNode.length > 0) {
	                for (let decoy_i = 0; decoy_i < decoyChildNode.length; decoy_i++) {
	                    let decoyIndex = decoyChildNode[decoy_i].getAttribute('index');
	                    let decoyName = decoyChildNode[decoy_i].getAttribute('name');
	                    let decoyNumber = 10;
	                    let tempBait = {
	                        "serialNumber": decoyIndex,
	                        "name": decoyName,
	                        "quantity": decoyNumber,
	                    };
	                    pEquipNode.setBait(tempBait);
	                }
	            }
	            let communicationChildNode = node[node_t].getElementsByTagName('communication');
	            if (communicationChildNode.length > 0) {
	                for (let communication_i = 0; communication_i < communicationChildNode.length; communication_i++) {
	                    let communicationIndex = communicationChildNode[communication_i].getAttribute('index');
	                    let communicationName = communicationChildNode[communication_i].getAttribute('name');
	                    let communicationType = communicationChildNode[communication_i].getAttribute('type');
	                    let communicationJson = {
	                        "serialNumber": communicationIndex,
	                        "name": communicationName,
	                        "type": communicationType,
	                    };
	                    pEquipNode.setCommunication(communicationJson);
	                }
	            }
	            // _this.mapEquipments[pEquipNode.getModelId()] = pEquipNode;
	            _this.mapEquipments.push(pEquipNode);
	        }
	        //bkb
	        // console.log(_this.file)
	        // console.log(_this.file.getElementsByTagName("BKB"))
	        var nodeBKB = _this.file.getElementsByTagName("BKB")[0].getElementsByTagName("node");
	        for (let node_b = 0; node_b < nodeBKB.length; node_b++) {
	            var id = Number(nodeBKB[node_b].getAttribute("id"));
	            var type = Number(nodeBKB[node_b].getAttribute("type"));
	            var name = nodeBKB[node_b].getAttribute("name");
	            var pDoctrineNode = new DoctrineNode(name, id, type);
	            // _this.mapDoctrines[pDoctrineNode.getId()] = pDoctrineNode;
	            _this.mapDoctrines.push(pDoctrineNode);
	        }

	        //Formation

	        var nodeFormations = _this.file.getElementsByTagName('Formations')[0].getElementsByTagName("CGF");

	        for (let node_f = 0; node_f < nodeFormations.length; node_f++) {
	            let type = Number(nodeFormations[node_f].getAttribute("type"));
	            let _formations = nodeFormations[node_f].children;
	            for (let i = 0; i < _formations.length; i++) {
	                let id = Number(_formations[i].getAttribute("id"));
	                let name = _formations[i].getAttribute("name");
	                let pFormationNode = new FormationNode(name, type, id);
	                _this.mapFormations.push(pFormationNode);
	            }
	        }
	    };
	    xhr.onerror = () => { console.log(xhr.statusText); };
	    xhr.send();

	};

	var REVISION = '0.01';

	function isArray(arg) {
	    if (typeof arg === 'object') {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    }
	    return false;
	}
	function addSide(name,side){

	}

	function getCGFList(vecNodes){
	    let is_Array =  isArray(vecNodes);
	    let results = [];

	    function traverse( pCGFEntity ) {
	        const children = pCGFEntity.children;
	        if(children.length>0){
	            for ( let pcgf_i = 0, l = children.length; pcgf_i < l; pcgf_i ++ ) {
	                traverse(children[ pcgf_i ]);
	            }
	        }else {
	            results.push(pCGFEntity);
	        }
		}
	    if(is_Array){
	        for(let i=0;i<vecNodes.length;i++){
	            if(vecNodes[i].children.length>0){
	                traverse(vecNodes[i]);
	            }
	        }
	    }else {
	        traverse(vecNodes);
	    }
	    return results
	}


	function SideTOColor(side) {
	    let color = "#000";
	    if (side == 1) {
	        color = "#FF0000";
	    } else if (side == 2) {
	        color = "#0000FF";
	    } else if (side == 3) {
	        color = "#00FF00";
	    } else if (side == 4) {
	        color = "#FFA500";
	    } else if (side == 5) {
	        color = "#FFFF00";
	    } else {
	        color = "#880088";
	    }
	    return color;
	}

	exports.AreaAscriptions = AreaAscriptions;
	exports.AreaTypes = AreaTypes;
	exports.CGFDataModel = CGFDataModel;
	exports.CGFEntity = CGFEntity;
	exports.EquipDataModel = EquipDataModel;
	exports.GeoData = GeoData;
	exports.NodeUnit = NodeUnit;
	exports.REVISION = REVISION;
	exports.SideEnum = SideEnum;
	exports.SideTOColor = SideTOColor;
	exports.addSide = addSide;
	exports.getCGFList = getCGFList;
	exports.AreaLibPath = AreaLibPath;
	exports.RoutePath = RoutePath;
	Object.defineProperty(exports, '__esModule', { value: true });

}));
