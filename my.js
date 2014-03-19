 
// 本代码引入了很多 Underscore.js 1.5.2 的api函数 ，
// 使用本代码 不需要再引入underscore 不依赖任何外部脚本，
// 唯一的全局变量 为_diaobao
(function() {
  var root = this;
    // 保存"_"(下划线变量)被覆盖之前的值
    // 如果出现命名冲突或考虑到规范, 
    // 可通过_.noConflict()方法恢复"_"被Diaobao占用之前的值, 并返回Underscore对象以便重新命名
  var previousDiaobao = root._diaobao;

  var breaker = {};

  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  var _  = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };
 
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._diaobao = _;
  } else {
    root._diaobao = _;
  }

  // Current version.
  _.VERSION = '0.1.0';

  
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  _.extend = function(obj) {  //浅拷贝
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };
 
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };


  
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {  
      return typeof obj === 'function';
    };
  }

  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  _.isNull = function(obj) {
    return obj === null;
  };

  _.isUndefined = function(obj) {
    return obj === void 0;
  };
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  
  _.noConflict = function(){
    root._diaobao = previousDiaobao;
    return this;
  };
  var noMatch = /(.)^/;
  
  _.trim =function(str){
    return str.replace(/^\s+/,"").replace(/\s+$/,"");
  };

// 序列化参数  
  _.params=function (obj) {
      var result=[];
      for (var i in obj) {
        if(obj[i] !== undefined || obj[i] !== null){
          result.push(encodeURIComponent(i)+"="+encodeURIComponent(obj[i]));
        }
      }
      return result.join("&");
  };

 _.sendMessage=function(url,data ,callback) {
    // 根据 url 中是否出现过 "?" 来决定添加时间戳参数时使用 "?" 还是 "&"  
      var url = url ,
          script,
          paramPrefix = url.indexOf("?") == -1 ? "?" : "&";
      url = url + paramPrefix + _.params(data) +  "&rnd=" + Math.ceil( new Date() );  
      script = document.createElement("script");
      document.body.appendChild(script);
      
      script.src = url;  
      script.onload = function() { 
        if (callback) {
          callback();  
        }  
        document.body.removeChild(script);
      }  
   }

 // 深拷贝
  _.deepextend = function(destination,source){
    for(var property in source){
        var copy = source[property];
        if(destination === copy) continue; //如果相等则跳过 避免循环引用

        if(typeof copy === "object"){
         destination[property] = arguments.callee(destination[property] || {},copy);
        }else{
           destination[property] =copy; 
        }
    }
    return destination ; 
    };


 
  // 将一个url问号后的参数解析成对象
  _.urlParam = function(url){
     var obj ={},arr,index,info;
     if ( ( index =  url.indexOf("?")+1 ) >1 ){
      arr = url.substring(index).split("&");
       _.each( arr,function(i){
        info = i.split("=");
        obj[info[0]] = info[1]; 
       });
     }
     return obj ;
    };

  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };


  _.interval = function(fn,timeout){
    var timer ;
    (function(){
      clearInterval(timer);
      timer = setInterval(fn,timeout);
    })();
  };

  _.browser = (function(ua){
        var b ={
            msie: /msie/.test(ua) && !/opera/.test(ua),
            opera: /opera/.test(ua),
            safari:/webkit/.test(ua) && !/chrome/.test(ua),
            firefox: /firefox/.test(ua),
            chrome: /chrome/.test(ua)
        };
        var vMark ="" ;
        for (var i in b){
            if(b[i]){
                vMark = i ; 
            }
        }
        if(b.safari){
            vMark ="version";
        }
        // b.version = RegExp("(?:" + vMark + ")[\\/: ]([\\d.]+)").test(ua) ? RegExp.$1 : "0";

        b.version = RegExp("(?:" + vMark + ")[\\/:]([\\d.]+)").test(ua) ? RegExp.$1 :   "0";
        b.ie = b.msie; 
        b.ie6 = b.msie && parseInt(b.version) ===6 ;
        b.ie7 = b.msie && parseInt(b.version) ===7 ;
        b.ie8 = b.msie && parseInt(b.version) ===8 ;
        b.ie9 = b.msie && parseInt(b.version) ===9 ;

        return b ; 

    })(root.navigator.userAgent.toLowerCase());

   _.getScrollTop = function(elem){
     var doc = elem ? elem.ownerDocument:document ; 
     return doc.document.scrollTop || doc.body.srcollTop ; 
    };

   _.getScrollLeft=function(elem){
      var doc  =elem ? elem.ownerDocument : document ; 
      return doc.document.documentElement.scrollLeft || doc.body.scrollLeft ; 
    };

  _.hasClass=function(elem,className){
        var names = elem.className.split(/\s+/);
        for(var i=0,len=names.length; i<len; i++ ){
            if(names[i] == className) return true ;
        }
        return false ;
    };
    _.addClass= function(elem,className){
      if(!_.hadClass(elem,className)) o.className += " " +className ;
      return elem;
    };
    _.removeClass=function(elem,className){
      var names = elem.className.split(/\s+/);
      for(var i=0,len = names.length; i<len; i++ ){
        if(names[i] == className) delete names[i] ;
      }
      elem.className = names.join(" ");
      return elem ;
    };
    _.getById= function(id){ return document.getElementById(id)};
    _.getByClass=function(className,context){  //根据集合 得到dom节点
      context = context || document ; //默认 选择区间是document
      //支持原生 则用原生的方法
      if(context.getElementsByClassName){
        return context.getElementsByClassName(className);
      }
      var elems = context.getElementsByTagName("*"),
          ret =[] ;
      for(var i =0 , l = elems.length; i<l ; i++){
        if(_.hasClass(elems[i],className)) ret.push(elems[i]);
      }
      return ret ;
    };
    _.curStyle=function(elem){
        return(this.curStyle = document.defaultView 
            ? function(elem ){ return document.defaultView.getComputedStyle(elem,null);}
            :function(elem){ return elem.curStyle ;}
            )(elem);
    };
 
  _.removeElem = function(elem){//删除节点
     if(elem.nodeType ===1) elem = [elem]; //将单个元素数组化
        
     for(var i=0,l =elem.length; i<l; i++ ){
        elem[0].parentNode.removeChild(elem[0]); //进行出栈操作
     }

    };
    //交换节点
   _.swapElem =function(elem1,elem2){

      var tmp = document.createTextNode("");
      elem1.parentNode().replaceChild(tmp,elem1);
      elem2.parentNode.replaceChild(elem2,elem1);
      tmp.parentNode.replaceChild(elme1,tmp);
      document.removeChild(tmp); //删除文本节点

    };

    _.getStyle = function(elem,name){
        return (this.getStyle = document.defaultView
             ? function(elem,name){
               var style =document.defaultView.getComputedStyle(elem,null);
               return name in style ? style[ name ] : style.getPropertyValue( name) ; 
              }
              :function(elem , name){  //ie 系列
                var style = elem.currentStyle;
                // 透明度
                if(name == 'opacity'){
                    if(/alpha\(opacity=(.*)\)/i.test(style.filter) ){
                        var opacity= parseFloat(RegExp.$1);
                        return opacity ? opacity/100 :0 ;
                    }
                    return 1 ;
                };
                if(name == "float"){ name ="styleFloat" ; }
                var ret = style[name] || style[_.camelize(name)];
                //单位装换
                if(!/^\-?\d+(px)?$/i.test(ret) && /^\-?\d/.test(ret) ){
                    style = elem.style, left = style.left ,
                    rsLeft = elem.runtimeStyle.left ;
                    elem.runtimeStyle.left =elem.currentStyle.left;
                    style.left = ret || 0 ; 
                    ret = style.pixelLeft +"px";
                    style.left = left ;
                    elem.runtimeStyle.left = rsLeft ;
                }
                return ret ;

              }
            )(elem,name);
    };
   _.setStyle =  function(elems,style,value){
        if(!elems.length) { elems = [elems]; }  //单个元素 变成单个单元素数组
        //单个属性对象化
        if(typeof style =="string"){ var s = style; style={}; style[s] = value;};
        _.each(elems,function(elem){
            for(var name in style){
                var value = style[name];
                if(name == "opacity" && B.ie){
                    //ie透明度设置
                  elem.style.filter = (elem.currentStyle.filter|| " ").replace(/alpha\([^)]*\)/, "")+ "alpha(opacity=" + value * 100 + ")";
                }else if(name == "float"){
                    elem.style[B.ie ? "styleFloat" : "cssFloat" ] = value ;
                }else{
                    elem.style[_.camelize( name ) ] = value ;
                }
            }

        });
        return _ ;
    }

 _.ajax = function(args){
    /**
      args{
       url: String,
       method : get/psot (default get )
       data: { key:value }
       Cache: Boolean  default false 
      }
     */
    function paramsData(data){
        var arr =[];
        for(var i in data){
            if(data != undefined){
                arr.push(encodeURIComponent(i)+"="+encodeURIComponent(data[i]) );
            }
        }
        return arr.join("&");
    }
    //step1
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    agrs.method = args.method || "get"; 
    data = paramsData(args.data);

    if(/get/i.test(args.method) ){
        args.url.indexOf("?") <0 ? args.url +="?"+data : args.url +="&"+data 
    }
    if(!args.cache){
        if(args.url.indexOf("?")<0) args.url +="?";
        args.url += "&"+(new Date());
    }
    //step2
    xhr.open(args.method,args.url,true);
 //step3
    xhr.onreadstatechange= function(){
        if(xhr.readyState===4 && xhr.status === 200){
         if(args.success){
           args.success(xhr.responseText, xhr.responseXML); //step5
         }
        }
    };
   //step4
    if(/post/i.test(args.method)){ //post
        xhr.setRequestHeader("Content-Type","application/x-www-from-urlencoded");
        xhr.send(data);
    }else{  //get 
        send();  
    }
};


  _.cookie = function(key, value, options) {
          // key and at least value given, set cookie...
          if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
              options = _.extend({}, options);

              if (value === null || value === undefined) {
                  options.expires = -1;
              }

              if (typeof options.expires === 'number') {
                  var days = options.expires, t = options.expires = new Date();
                  t.setDate(t.getDate() + days);
              }

              value = String(value);

              return (document.cookie = [
                  encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                  options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                  options.path    ? '; path=' + options.path : '',
                  options.domain  ? '; domain=' + options.domain : '',
                  options.secure  ? '; secure' : ''
              ].join(''));
          }

          // key and possibly options given, get cookie...
          options = value || {};
          var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

          var pairs = document.cookie.split('; ');
          for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
              if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
          }
          return null;
  };
  _.val = function(elem,value){
    if(arguments[1]){
      elem.value= value;
      return _ ;
    }else{
      return elem.value ; 
    }
  }
  //事件 的事件对象修复函数
  _.guid = 1 ;
  _.fixEvent= function  (event){
      if(event) return event ;  //如果存在标准的事件 则不修复 直接返回标准事件对象
      event = window.event;
      event.pageX = event.clientX+ _.getScrollLeft;
      event.pageY = event.clientY + _.getScrollTop;
      event.target = event.srcElement;
      event.stopPropagation = function(){ this.cancelBubble =true; };
      event.preventDefault =function (){ this.returnValue = false ;};
      if(event.type == "mouseout"){
          event.relatedTarget = event.toElement;
      }else if( event.type == "mouseover"){
          event.relatedTarget = event.formElement;
      }
      return event ;
    };

 _.handleEvent = function(){ 
        var returnValue = true , event =_.fixEvent();
        var handlers = this.events[event.type]; //拿到dom 元素的 此类事件处理函数集合
        for(var i in handlers){
            this.$$handleEvent = handlers[i];
            if(this.$$handleEvent(event) ===false ){
                returnValue = false ;
            }
        }
        return returnValue ;
    };
 // addEvent 适合的事件 click mousedown ,mousemove mouseup, blur , focus 
  _.addEvent = function(element,type,handler){
       if(root.addEventListener){  //W3C 
           element.addEventListener(type,handler, false);
       }
       else{
             
               //给处理函数绑定一个绑定次数属性
              if(!handler.$$guid) handler.$$guid = _.guid++ ;
               //给绑定元素 添加一个事件集合对象
              if(!element.events) element.events = { } ;
              //将原来的 某类型 事件 存起来的放到 对象中
              var handlers = element.events[type];  
              
              if(!handlers){ //如果还不存在的情况下
               handlers = element.events[type] = {} ; //初始化
               if(element["on" + type]){ 
                //把原来的 对dom上添加的此类型的dom的事件函数放到handles对象先存起来
                  handlers[0] = element["on"+type];
               }
              } 
              handlers[handler.$$guid] = handler;
              element["on"+type] = _.handleEvent;
       }
  };

  _.removeEvent = function(element,type,handler){
      if(root.addEventListener){
         element.removeEventListener(type,handler,false);
     }else{
         if(element.events && element.events[type]){
                // console.log(element.events );
                delete element.events[type][handler.$$guid ];
          }
       }
  };


  /*
  //单独抽离出来的 滚轮事件 来自火狐
  // creates a global "addwheelListener" method
  // example: addWheelListener( elem, function( event ) { console.log( e.deltaY ); 
  event.preventDefault(); } );
*/

(function(window,document) {
 
    var prefix = "", _addEventListener, onwheel, support;
 
    // detect event model
    if ( window.addEventListener ) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }
 
    // detect available wheel event
    if ( document.onmousewheel !== undefined ) {
        // Webkit and IE support at least "mousewheel"
        support = "mousewheel"
    }
    try {
        // Modern browsers support "wheel"
        WheelEvent("wheel");
        support = "wheel";
    } catch (e) {}
    if ( !support ) {
        // let's assume that remaining browsers are older Firefox
        support = "DOMMouseScroll";
    }

    _.addWheelListener = function( elem, callback, useCapture ) {
        _addWheelListener( elem, support, callback, useCapture );
 
        // handle MozMousePixelScroll in older Firefox
        if( support == "DOMMouseScroll" ) {
            _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
        }
    };
 
    function _addWheelListener( elem, eventName, callback, useCapture ) {
        elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
            !originalEvent && ( originalEvent = window.event );
 
            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                delatZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };
             
            // calculate deltaY (and deltaX) according to the event
            if ( support == "mousewheel" ) {
                event.deltaY = - 1/40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
            } else {
                event.deltaY = originalEvent.detail;
            }
 
            // it's time to fire the callback
            return callback( event );
 
        }, useCapture || false );
    }
 
})(window,document);


// _.addCustomEvent= function(element,type,handler){
//      if(element.nodeType ===1 &&  arguments.length ===3 ){
//         _.customEventAll.node =element ; 
//         element.customEvent = {type:type};
//      }
// };
// _.triggerCustomEvent = function(element,type,handler){

// }

   _.camelize=function(s){
        return s.replace(/-([a-z])/ig, function(all,letter){ return letter.toUpperCase(); });
    };
    _.repeat=function(s,n){ //重复字符串
     return new Array(n+1).join(s);
    };
    _.trim= function(s){
        return this.replace(/^\s+/,"").replace(/\s+$/,"");
    };

    _.animate=function(elem,start,alter, dur,fx,complete){
      //elem,start,alter, dur,fx  dom 元素 开始量 变化量 持续时间  运动函数
       var curTime = 0; timeout = 1000/60 ;
       var timer = setInterval(function(){
         
        for(var i in start){
            if(i =="opacity"){
                if(_.browser.msie && alter[i] !== 0){
                   var opacity =fx(start[i],alter[i],curTime,dur);
                   elem.style.filter="alpha(opacity=" +opacity*100+")";
                }else if(alter[i] !== 0 ){
                  elem.style.opacity= fx(start[i],alter[i],curTime,dur);
                 }
            }else if(alter[i] !== 0 ){
              elem.style[i]= fx(start[i],alter[i],curTime,dur) + "px";
            }
         }
         // 返回一个清除定时器的函数
         if(curTime >= dur) {
          clearInterval(timer);
          curTime = dur ; //设置这个属性保证精准
          if(complete){
             complete();
          }
        };
        curTime+= timeout;
        return function(){ clearInterval(timer) } ; //
       },timeout);
    };

  _.animateTo = function(elem,end,dur,fx,complete){
    //elem ,end , dur ,fx , complete 
    var start ={}, alter ={};
    for( var  i in end){
       start[i]= parseFloat(_.getStyle(elem,i));
       alter[i] = end[i] - start[i];
    }
    _.animate(elem,start,alter,dur,fx,complete);

  };


  //动画算法
  _.tween = {
    //线性
    Linear:function (start,alter,curTime,dur) {return start+curTime/dur*alter;}, 
    //平方
    Quad:{ 
        easeIn:function (start,alter,curTime,dur) {
            return start+Math.pow(curTime/dur,2)*alter;
        },
        easeOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur;
            return start-(Math.pow(progress,2)-2*progress)*alter;
        },
        easeInOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur*2;
            return (progress<1?Math.pow(progress,2):-((--progress)*(progress-2) - 1))*alter/2+start;
        }
    },
    Cubic:{ 
        easeIn:function (start,alter,curTime,dur) {
            return start+Math.pow(curTime/dur,3)*alter;
        },
        easeOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur;
            return start-(Math.pow(progress,3)-Math.pow(progress,2)+1)*alter;
        },
        easeInOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur*2;
            return (progress<1?Math.pow(progress,3):((progress-=2)*Math.pow(progress,2) + 2))*alter/2+start;
        }
    },
    Quart:{ 
        easeIn:function (start,alter,curTime,dur) {
            return start+Math.pow(curTime/dur,4)*alter;
        },
        easeOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur;
            return start-(Math.pow(progress,4)-Math.pow(progress,3)-1)*alter;
        },
        easeInOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur*2;
            return (progress<1?Math.pow(progress,4):-((progress-=2)*Math.pow(progress,3) - 2))*alter/2+start;
        }
    },
    Quint:{ 
        easeIn:function (start,alter,curTime,dur) {
            return start+Math.pow(curTime/dur,5)*alter;
        },
        easeOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur;
            return start-(Math.pow(progress,5)-Math.pow(progress,4)+1)*alter;
        },
        easeInOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur*2;
            return (progress<1?Math.pow(progress,5):((progress-=2)*Math.pow(progress,4) +2))*alter/2+start;
        }
    },
    Sine :{ 
        easeIn:function (start,alter,curTime,dur) {
            return start-(Math.cos(curTime/dur*Math.PI/2)-1)*alter;
        },
        easeOut:function (start,alter,curTime,dur) {
            return start+Math.sin(curTime/dur*Math.PI/2)*alter;
        },
        easeInOut:function (start,alter,curTime,dur) {
            return start-(Math.cos(curTime/dur*Math.PI/2)-1)*alter/2;
        }
    },
    Expo: { 
        easeIn:function (start,alter,curTime,dur) {
            return curTime?(start+alter*Math.pow(2,10*(curTime/dur-1))):start;
        },
        easeOut:function (start,alter,curTime,dur) {
            return (curTime==dur)?(start+alter):(start-(Math.pow(2,-10*curTime/dur)+1)*alter);
        },
        easeInOut:function (start,alter,curTime,dur) {
            if (!curTime) {return start;}
            if (curTime==dur) {return start+alter;}
            var progress =curTime/dur*2;
            if (progress < 1) {
                return alter/2*Math.pow(2,10* (progress-1))+start;
            } else {
                return alter/2* (-Math.pow(2, -10*--progress) + 2) +start;
            }
        }
    },
    Circ :{ 
        easeIn:function (start,alter,curTime,dur) {
            return start-alter*Math.sqrt(-Math.pow(curTime/dur,2));
        },
        easeOut:function (start,alter,curTime,dur) {
            return start+alter*Math.sqrt(1-Math.pow(curTime/dur-1));
        },
        easeInOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur*2;
            return (progress<1?1-Math.sqrt(1-Math.pow(progress,2)):(Math.sqrt(1 - Math.pow(progress-2,2)) + 1))*alter/2+start;
        }
    },
    Elastic: {
        easeIn:function (start,alter,curTime,dur,extent,cycle) {
            if (!curTime) {return start;}
            if ((curTime==dur)==1) {return start+alter;}
            if (!cycle) {cycle=dur*0.3;}
            var s;
            if (!extent || extent< Math.abs(alter)) {
                extent=alter;
                s = cycle/4;
            } else {s=cycle/(Math.PI*2)*Math.asin(alter/extent);}
            return start-extent*Math.pow(2,10*(curTime/dur-1)) * Math.sin((curTime-dur-s)*(2*Math.PI)/cycle);
        },
        easeOut:function (start,alter,curTime,dur,extent,cycle) {
            if (!curTime) {return start;}
            if (curTime==dur) {return start+alter;}
            if (!cycle) {cycle=dur*0.3;}
            var s;
            if (!extent || extent< Math.abs(alter)) {
                extent=alter;
                s =cycle/4;
            } else {s=cycle/(Math.PI*2)*Math.asin(alter/extent);}
            return start+alter+extent*Math.pow(2,-curTime/dur*10)*Math.sin((curTime-s)*(2*Math.PI)/cycle);
        },
        easeInOut:function (start,alter,curTime,dur,extent,cycle) {
            if (!curTime) {return start;}
            if (curTime==dur) {return start+alter;}
            if (!cycle) {cycle=dur*0.45;}
            var s;
            if (!extent || extent< Math.abs(alter)) {
                extent=alter;
                s =cycle/4;
            } else {s=cycle/(Math.PI*2)*Math.asin(alter/extent);}
            var progress = curTime/dur*2;
            if (progress<1) {
                return start-0.5*extent*Math.pow(2,10*(progress-=1))*Math.sin( (progress*dur-s)*(2*Math.PI)/cycle);
            } else {
                return start+alter+0.5*extent*Math.pow(2,-10*(progress-=1)) * Math.sin( (progress*dur-s)*(2*Math.PI)/cycle);
            }
        }
    },
    Back:{
        easeIn: function (start,alter,curTime,dur,s){
            if (typeof s == "undefined") {s = 1.70158;}
            return start+alter*(curTime/=dur)*curTime*((s+1)*curTime - s);
        },
        easeOut: function (start,alter,curTime,dur,s) {
            if (typeof s == "undefined") {s = 1.70158;}
            return start+alter*((curTime=curTime/dur-1)*curTime*((s+1)*curTime + s) + 1);
        },
        easeInOut: function (start,alter,curTime,dur,s){
            if (typeof s == "undefined") {s = 1.70158;}
            if ((curTime/=dur/2) < 1) {
                return start+alter/2*(Math.pow(curTime,2)*(((s*=(1.525))+1)*curTime- s));
            }
            return start+alter/2*((curTime-=2)*curTime*(((s*=(1.525))+1)*curTime+ s)+2);
        }
    },
    Bounce:{
        easeIn: function(start,alter,curTime,dur){
            return start+alter-Tween.Bounce.easeOut(0,alter,dur-curTime,dur);
        },
        easeOut: function(start,alter,curTime,dur){
            if ((curTime/=dur) < (1/2.75)) {
                return alter*(7.5625*Math.pow(curTime,2))+start;
            } else if (curTime < (2/2.75)) {
                return alter*(7.5625*(curTime-=(1.5/2.75))*curTime + .75)+start;
            } else if (curTime< (2.5/2.75)) {
                return alter*(7.5625*(curTime-=(2.25/2.75))*curTime + .9375)+start;
            } else {
                return alter*(7.5625*(curTime-=(2.625/2.75))*curTime + .984375)+start;
            }
        },
        easeInOut: function (start,alter,curTime,dur){
            if (curTime< dur/2) {
                return Tween.Bounce.easeIn(0,alter,curTime*2,dur) *0.5+start;
            } else {
                return Tween.Bounce.easeOut(0,alter,curTime*2-dur,dur) *0.5 + alter*0.5 +start;
            }
        }
    }
};





}).call(this);