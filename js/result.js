//用户数据
var bg =  chrome.extension.getBackgroundPage();
var userdata = bg.userdata;
console.log(userdata);
//数据预处理
//原始数据
var date = [];
var duration = [];
var weekdate = [];
var start_time = [];
var end_time = [];

var total_duration = 0;
var max = 0;
var min = 0;
var earliest = 0;//最早到
var latest = 0;//最晚走

var toTime = function(time) {
    var date = new Date("2014/11/11 " + time);
    return date.getTime();
}

for(var i=0,n=userdata.length; i < n; i++) {
    date.push(userdata[i].date);
    weekdate.push(userdata[i].weekdate);
    duration.push(parseFloat(userdata[i].duration));
    start_time.push(userdata[i].start_time);
    end_time.push(userdata[i].end_time);

    total_duration += parseFloat(userdata[i].duration);
    //求最大最小值工作时间的index
    if ( parseFloat(userdata[i].duration) > parseFloat(userdata[max].duration) ) {
        max = i;
    } else if ( parseFloat(userdata[i].duration) < parseFloat(userdata[min].duration) ) {
        min = i;
    }

    //求最早
    if(toTime(userdata[i].start_time) < toTime(userdata[earliest].start_time) ) {
        earliest = i;
    }
    //求最晚
    if(toTime(userdata[i].end_time) > toTime(userdata[latest].end_time) ) {
        latest = i;
    }
}

//统计数据

var avg_duration = parseFloat(total_duration / userdata.length).toFixed(2);


$(function () { 
    $('#container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: '工作时长'
        },
        xAxis: {
            categories: date
        },
        yAxis: {
            title: {
                text: '时间（小时）'
            }
        },
        series: [{
            name: '你',
            data: duration
        }]
    });
});