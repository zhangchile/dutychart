var getData = function(content) {

    // var content1 = document.querySelector("#frame1").children[1].children[1].contentDocument;//获取框架内的dom
    // var content2 = content1.querySelector("frameset").children[1].contentDocument;//
    // var content3 = content2.querySelector("frameset").children[1].contentDocument;
    var content3 = content;
    var tablelist = content3.querySelector(".TableList");
    var dataArr = tablelist.querySelectorAll(".TableData");
    var dataCount = dataArr.length;

    //将数据解析成数组对象
    var userdata = new Array();

    for(var i = 0; i < dataCount; i++) {
        var row = dataArr[i].querySelectorAll("td");
        //赋值
        var datetime = row[0].innerHTML;
        var weekdate = datetime.substr(datetime.indexOf('(') + 1, 1);//获取星期
        var date     = datetime.substr(0, datetime.indexOf('(') - 1);//获取日期

        userdata[i] = {
            "date": date,
            "weekdate": weekdate,
            "start_time" : row[1].innerHTML,
            "end_time" : row[2].innerHTML,
            "duration" : duration(row[1].innerHTML, row[2].innerHTML),
            "info" : row[3].innerHTML
        }

    }
    return userdata;
}

function duration(start, end) {
    var start_time = new Date('2014/11/11 ' + start );
    var end_time = new Date('2014/11/11 ' + end );
    var dur = ( end_time.getTime() - start_time.getTime() )/3600/1000;
    return isNaN(dur) ? 0 : dur.toFixed(2);
}

Date.prototype.Format = function(fmt) { //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  

var addButton = function() {

    var img = document.createElement("img");
    img.id = "gotop";
    img.src = chrome.extension.getURL("img/logo.png");
    img.alt = "56微统计";
    img.title = "56微统计";
    img.setAttribute("style","width: 80px;position: fixed;bottom: 113px;z-index: 99;left: 300px;top:5px;cursor:pointer;opacity: 0.7;");
    img.onclick = function (){ 
        var date2 = new Date().Format("yyyy-MM-dd");
        var time2 = new Date().getTime() - 24*3600*31*1000;//一个月前
        var date1 = new Date(time2).Format("yyyy-MM-dd");
        var url = 'http://oa.corp.56.com/general/attendance/personal/report/search.php?DATE1='+date1+'&DATE2='+date2;
        createIframe(url);

    }
    img.onmouseover = function() {
        this.style.opacity = 1;
    }
    img.onmouseout = function() {
        this.style.opacity = 0.7;
    }
    var content = document.querySelector("#frame1").children[0].contentDocument;
    content.body.appendChild(img);
}


//standby
var addMenu = function() {
    var content1 = document.querySelector("#frame1").children[1].children[1].contentDocument;//获取框架内的dom
    var content2 = content1.querySelector("frameset").children[0].contentDocument;//
    var topmenuDom = content2.querySelector("frameset").children[0].contentDocument;//
    var oldMenu = topmenuDom.querySelector("#navMenu").innerHTML;
    topmenuDom.querySelector("#navMenu").innerHTML = oldMenu+'<a href="report" target="menu_main" title="56微统计" hidefocus="hidefocus" class=""><span><img src="/images/menu/attendance.gif" width="16" height="16" align="absmiddle">56微统计</span></a>';

}

//创建查询iframe
var createIframe = function(src) {
    var ifr = document.createElement('iframe'); 
    ifr.id = "frm";
    ifr.src = src; 
    ifr.onload = function(){
        //加载后发送数据
        send(ifr);
    } 
    document.body.appendChild(ifr);
}


var send = function(ifr) {
    data = getData(ifr.contentDocument)
    //发送数据给backgound
    chrome.extension.sendRequest({data: data}, function(response) {
    });
}

var createDiv = function(id, css) {
    var div = document.createElement('div');
    div.className = css;
    div.id = id;
    return div;
}

var loadScript = function(src) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = src;
    document.getElementsByTagName("head").item(0).appendChild(script);
}

var loadCss = function(href) {
    var style = document.createElement('link');
    style.href = href;
    style.rel = 'stylesheet';
    style.type = 'text/css';
    document.getElementsByTagName("head").item(0).appendChild(style);
}

//加载图形库
var initLibs = function() {
    loadScript(chrome.extension.getURL('js/libs/highcharts-4.0.3/highcharts.js'));
}


//初始化
window.onload= function() {
    addButton();
    //加载图形库
    // initLibs();
    //加载样式
    // loadCss(chrome.extension.getURL("css/style.css"));
}