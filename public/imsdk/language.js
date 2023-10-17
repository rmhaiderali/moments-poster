var GLanguage = {
    "EN": {
},
    "TR": {
 },
};


var language = "EN";
var langObj = null;
//var areaLan = ["ZH", "EN", "TW", "HK", "TH", "ES", "FR", "TR", "VI", "DE", "PT", "ID", "RU", "AR"];
var areaLan = ["EN", "TR"];

if (getQueryString("setLan") == null || $.trim(getQueryString("setLan")) == "") {
    language = getQueryString("language")? $.trim(getQueryString("language")).toUpperCase() : "EN";
    if(areaLan.indexOf(language) < 0) {
        language = "EN";
    }
} else {
    language = $.trim(getQueryString("setLan"));
}

$('.wrapper').addClass('lang-'+language.toLowerCase());


langObj = GLanguage[language];

initLang(langObj);

// function initLang(obj){
// 	$("[data-lang]").each(function(index){
// 		var texts = $(this).attr("data-lang");
// 		$(this).html(obj[texts]);
// 	});
// }

function initLang(obj) {
    $("[data-lang]").each(function(index) {
        var texts = $(this).attr("data-lang");
        $(this).html(obj[texts]);
    });
    $("[data-placeholder]").each(function(index) {
        var texts = $(this).attr("data-placeholder");
        $(this).attr("placeholder", obj[texts]);
    });
}

//获取url中的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var q = window.location.pathname.substr(1).match(reg_rewrite);
    if (r != null) {
        return unescape(r[2]);
    } else if (q != null) {
        return unescape(q[2]);
    } else {
        return '';
    }
}

if (/iPad/ig.test(navigator.userAgent)) {
    $('.wrapper').addClass('ipad');
};