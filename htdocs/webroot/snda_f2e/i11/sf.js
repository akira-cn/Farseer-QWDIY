/* Fix to Improve IE6 */
if(document.uniqueID && !window.XMLHttpRequest){
/* Image Cache */
    try {
        document.execCommand('BackgroundImageCache',false,true);
    }
    catch(e){
    };
};
// namespace
YAHOO.namespace('YAHOO.TW.CBY');
var YUD = YAHOO.util.Dom;
var YUC = YAHOO.util.Connect;
var YUE = YAHOO.util.Event;
var YUJ = YAHOO.lang.JSON;
var CBY = YAHOO.TW.CBY;
/* path */
switch(true){
    case (location.href.indexOf('localhost') != -1 || location.href.indexOf('127.0.0.') != -1) : {
        CBY.ImageUrl = 'i11/';
        CBY.RestUrl = 'service/index.php';
        break;
    }
    default: {
        CBY.ImageUrl = 'http://xxx.xxx.com';
        CBY.RestUrl = '';
    }
};
// Static String
CBY.AjaxFailMsg = '伺服器錯誤，請稍後再試！';
// Tools
CBY.Util = {
    cbytest:function(ttest){
        alert(ttest);
    }
};

// Classes
CBY.Class = {

};
// Modules
CBY.Module={
    test:function(dModule){
        CBY.Util.cbytest('whatever');
    }
};
// initialization
(function(){
    var doWhileExist = function(sModuleId,oFunction){
        if(document.getElementById(sModuleId)){oFunction(document.getElementById(sModuleId));}                
    };
        doWhileExist('sfmt',CBY.Module.test);
    //CBY.Module.test();
})();
