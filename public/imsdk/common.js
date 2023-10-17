//公共参数变量
var commonParams = {};
//前端锁，false为上锁，true为解锁，建议执行后台时设置并根据情况控制锁以防并发
var isInit = true;

//获取url中的参数
function getUrlRequest(pa){
	var url = window.location.href.replace(/#+.*$/, ''),
		params = url.substring(url.indexOf("?")+1,url.length).split("&"),
		param = {} ;
	for (var i=0; i<params.length; i++){
		var pos = params[i].indexOf('='),//查找name=value
			key = params[i].substring(0,pos),
			val = params[i].substring(pos+1);//提取value
		param[key] = val;
	}
	return (typeof(param[pa])=="undefined") ? "" : param[pa];
}
var userAgent = navigator.userAgent || navigator.vendor || window.opera; //区分平台
var iOSBridge; //全局 iOS Bridge

// iOS JS Bridge 初始化代码的定义
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    //alert("first1111");
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}

/**
 *  iOS 初始化及注册 Native 调用 JS 回调代码
 *  parametersJSON:Unity传递过来的json字符串
 */
if (/iPad|iPhone|iPod|Macintosh/.test(userAgent) && !window.MSStream) {
    //alert("iOS device init");
    setupWebViewJavascriptBridge(function (bridge) {
        //alert("ios初始化");
        //注册 Native 调用 JS 的回调函数
        bridge.registerHandler('IMSDKJSHandler', function (parametersJSON, responseCallback) {
            //在这里处理 Native 调用 JS，携带参数为 parametersJSON，responseCallback 忽略即可
        });
        //alert('unity 回调过来了');
        iOSBridge = bridge;

    })
}

/**
 * 游戏内浏览器MSDK方法
 * @var href_url 游戏内客户端跳转链接
 * @var share_title 分享标题
 * @var share_desc 分享文案
 * @var share_img_url 分享图片地址,url绝对路径
 * @var share_campaign 分享活动标识
 * @function goToUrl 调用游戏内客户端跳转功能，赋值href_url跳转到指定页面
 * @function share 调用游戏内客户端分享功能，赋值share_title, share_desc, share_img_url调整分享内容
 */
var jsCallNativeClickUrl = {
    href_url: "",
    share_title: "",
    share_desc: "",
    share_img_url: "",
    share_campaign: "",
    arg: "",
    goToUrl: function () {
        jsCallNativeClickUrl.arg = "{\"type\":\"url\",\"url\":\"" + jsCallNativeClickUrl.href_url + "\",\"closeView\":\"true\"}";
        jsCallNativeClickUrl.run();
    },
    share: function () {
        jsCallNativeClickUrl.arg = '{"type":"share","title":"' + jsCallNativeClickUrl.share_title + '","desc":"' + jsCallNativeClickUrl.share_desc + '","url":"' + jsCallNativeClickUrl.share_img_url + '","adjust_campaign":"' + jsCallNativeClickUrl.share_campaign + '"}';
        jsCallNativeClickUrl.run();
    },
    run: function () {
        //alert(userAgent);
        if (/android/i.test(userAgent)) {
            //Android平台JS调用Native
            if (window.IMSDK) {
                IMSDK.jsCallNative(jsCallNativeClickUrl.arg);
            } else {
                alert("no IMSDK js support");
            }
        } else if (/iPad|iPhone|iPod|Macintosh/.test(userAgent) && !window.MSStream) {
            console.log("call iOS native");
            if (iOSBridge) {
                iOSBridge.callHandler('jsCallNative', jsCallNativeClickUrl.arg, function (response) {
                    // 调⽤ Native 回调，⼀般可以忽略
                    console.log(response)
                });
            } else {
                alert("no IMSDK js support");
            }
        } else {
            alert("your service no support");
        }
    },
    close: function () {
        jsCallNativeClickUrl.arg = "{'action': 'close'}";
        jsCallNativeClickUrl.run();
    },
    hideBar: function () {
        jsCallNativeClickUrl.arg = "{'hideToolBar': true}";
        jsCallNativeClickUrl.run();
    },
    showBar: function () {
        jsCallNativeClickUrl.arg = "{'hideToolBar': false}";
        jsCallNativeClickUrl.run();
    },
    callBack: function () {
        jsCallNativeClickUrl.arg = "{'action': 'callback'}";
        jsCallNativeClickUrl.run();
    }
}
/**
 * loading前端遮罩层
 * @function init 展示遮罩层
 * @function remove 移除遮罩层
 */
var loading = {
    init: function () {
        var loadDom = $('#loadingSvg').length;
        if (loadDom == 0) {
            $('body').append(loading.loadingSvg);
        } else {
            $('#loadingSvg').show();
        }
    },
    remove: function () {
        // $('#loadingSvg').remove();
        $('#loadingSvg').hide();
    },
    loadingSvg: "<div id='loadingSvg' style='width: 100%;height: 100%;position: fixed;left: 0;top: 0;background: rgba(0,0,0,.7);z-index: 99999'><div style='width: 150px;height: 150px;position: absolute;left: 50%;top: 50%;margin-left: -75px;margin-top: -75px'><svg width='150px' height='150px' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' class='uil-default'><rect x='0' y='0' width='100' height='100' fill='none' class='bk'></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(0 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(30 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.08333333333333333s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(60 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.16666666666666666s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(90 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.25s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(120 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.3333333333333333s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(150 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.4166666666666667s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(180 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(210 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5833333333333334s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(240 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.6666666666666666s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(270 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.75s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(300 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.8333333333333334s' repeatCount='indefinite'/></rect><rect  x='46.5' y='40' width='7' height='20' rx='5' ry='5' fill='#d6d6d6' transform='rotate(330 50 50) translate(0 -30)'>  <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.9166666666666666s' repeatCount='indefinite'/></rect></svg></div></div>"
}

//锁定
function lock() {
    isInit = false;
    loading.init();
}
//解锁
function unlock() {
    loading.remove();
    isInit = true;
}

/**
 * 控制倒计时函数，内部逻辑根据需求自行调整
 * @param {timestamp} startTime 开始时间戳
 * @param {timestamp} endTime 结束时间戳
 */
function countTime(startTime, endTime) {
    leftTime = parseInt(endTime) - parseInt(startTime);

    var h = Math.floor(leftTime / 60 / 60 % 24);
    var m = Math.floor(leftTime / 60 % 60);
    var s = Math.floor(leftTime % 60);

    //默认赋值方法，dom对象根据实际开发情况自行调整
    $("#hour").html(PrefixInteger(h,2));
    $("#minute").html(PrefixInteger(m,2));
    $("#second").html(PrefixInteger(s,2));

    setTimeout(function () {
      countTime(parseInt(startTime) + 1, endTime);
    }, 1000);
}

/**
 * 时间格式化
 * @param {int} num 数值
 * @param {int} n 格式化位数
 */
function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

//对应语言地区编码
var localCode = {
    "ZH":"zh",
    "TW":"zh-tw",
    "HK":"zh-hk",
    "EN":"en",
    "FR":"fr",
    "DE":"de",
    "ID":"id",
    "PT":"pt",
    "RU":"ru",
    "ES":"es",
    "TR":"tr",
    "VI":"vi",
    "AR":"ar",
    "TH":"th"
}

/**
 * 数字根据不同地区进行格式化
 * @param {str} 格式化数字字符
 */
function localNumString(str) {
    return Number(str).toLocaleString(localCode[commonParams.language.toUpperCase()]);
}

/**
 * 日期根据不同地区进行格式化
 * @param {str} 格式化日期字符，例：2020/07/13 10:00:00
 */
function localDateString(str) {
    var d = new Date(str.replace(/-/g, "/"));//iOS不识别“-”分割的日期，正则匹配替换成“/”
    return d.toLocaleString(localCode[commonParams.language.toUpperCase()], {hour12: false});
    //return d.toLocaleDateString(localCode[commonParams.language.toUpperCase()]) + " " + d.toLocaleTimeString(localCode[commonParams.language.toUpperCase()]);
}

/**
 * 获取url传参并赋值给公共变量，根据自己活动入口实际情况修改添加删减
 */
function getCommonParams() {
    /** 玩家openid，可靠性低 */
    var openid = getUrlRequest('openid').trim();

    /** 玩家登录态ticket，**重要必传**，调用后台时必须做非空校验！！ */
    var ticket = getUrlRequest('sTicket').trim();

    /** 语言参数，用于获取当前玩家设置何种语言，注意避免和多语言js参数冲突，视情况自己调整 */
    var language = getUrlRequest('language').trim();

    /** 玩家当前服务器大区id，非必要 */
    var area_id = getUrlRequest('area_id').trim();

    /** 玩家uid，可靠性低，后台建议调用idip查询uid */
    var uid = getUrlRequest('uid').trim();

    /** 玩家所处国家或地区，非必要 */
    var region = getUrlRequest('region').trim();

    /** 校验签名，非必要 */
    //var sign = getUrlRequest('sign').trim();

    /** 游戏id，比如1320是全球，1321是日韩，详情咨询游戏侧，非必要 */
    //var gameid = getUrlRequest('gameid').trim();

    /** 当前赛区，比如北美，日韩，返回对应赛区编号，非必要 */
    //var game_area = getUrlRequest('game_area').trim();

    /** 当前赛季，非必要 */
    //var game_season = getUrlRequest('game_season').trim();

    /** 游戏内的昵称，经url_encode之后的值 */
    //var nickname = getUrlRequest('nickname').trim();

    /** 头像id或url，经url_encode之后的值 */
    //var head_pic = getUrlRequest('head_pic').trim();

    /** 头像框id，经url_encode之后的值 */
    //var headbox = getUrlRequest('headbox').trim();

    commonParams = {
        'sTicket': ticket,
        'iUin': openid,
        'language': language,
        'area_id': area_id,
        'uid': uid,
        'region': region
    };

    return commonParams;
}

//获取公共变量
getCommonParams();

//系统弹窗
function sysTips(id){ 
	$('#pop9 .systemtip').text(langObj[id]);
    openDialog('pop9');

}
//获奖提示错误弹窗
function msgTips(id){
    $('#msg .systemtip').text(langObj[id]);
    openDialog('msg');
}
//兑换提示弹窗
function excTips(id){
    $('#exc .systemtip').text(langObj[id]);
    openDialog('exc');
}


/*校验是否全由8-12位数字组成 */
function isUid(str) {
	var reg=/^[0-9]{8,12}$/;   /*定义验证表达式*/
	return reg.test(str);     /*进行验证*/
}
/*校验是否全数字组成 */
function isNum(str) {
	var reg= /^\d+$/;   /*定义验证表达式*/
	return reg.test(str);     /*进行验证*/
}
/*校验邮箱 */
function isMail(str) {
	var reg=/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/; 
	return reg.test(str);     /*进行验证*/
}
//计算百分比
function Percentage(num, total) {
	if(num > total){
		num = total;
	}
	if(total <= 0){
		return  "0%";
	}
    return (Math.round(num / total * 10000) / 100.00 + "%");// 小数点后两位百分比   
}

//格式化日期时间
function formatTime(timestamp) {
	var date = new Date(timestamp * 1000 - 3600000*8);//时间戳为10位需*1000，时间戳为13位的话不需乘1000- 3600000*8
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	D = (date.getDate()<10?"0"+date.getDate():date.getDate()) + ' ';
	h = (date.getHours()<10?"0"+date.getHours():date.getHours()) + ':';
	m = (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes());
	s = (date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds());
	//return Y + M + D + h + m + s;
	return  Y + M + D + h + m;
}


