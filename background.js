var content1 = $("frame1").children[1].children[1].contentDocument;//获取框架内的dom
var content2 = content1.querySelector("frameset").children[1].contentDocument;//
var content3 = content2.querySelector("frameset").children[1].contentDocument;
var tablelist = content3.querySelector(".TableList");
var dataArr = tablelist.querySelectorAll(".TableData");
var dataCount = dataArr.length;

//将数据解析成二维数组
var userdata = new Array([]);

for(var i = 0; i < dataCount; i++) {
    var row = dataArr[i].querySelectorAll("td");
    //赋值
    var datetime = row[0].innerHTML;
    var weekdate = datetime.substr(datetime.indexOf('(') + 1, 1);//获取星期
    var date     = datetime.substr(0, datetime.indexOf('(') - 1);//获取日期

    userdata[i]['date']       = date;
    userdata[i]['weekdate']   = weekdate;
    userdata[i]['start_time'] = row[1].innerHTML;
    userdata[i]['end_time']   = row[2].innerHTML;
    userdata[i]['duration']   = duration(row[2].innerHTML, row[1].innerHTML);
    userdata[i]['info']       = row[3].innerHTML;

}

function duration(start, end) {
    var start_time = new Date('2014/11/11 ' + start );
    var end_time = new Date('2014/11/11 ' + end );

    var duration = (( end_time ).getTime() - ( start_time ).getTime() ) /3600/1000);
    return isNaN(duration) ? 0 : duration.toFixed(2);
}

