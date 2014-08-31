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
var total_real = userdata.length;
var max = 0;
var min = 0;
var earliest = 0;//最早到
var latest = 0;//最晚走

var toTime = function(time) {
    var date =  date;
    var datetime = new Date("2014/11/11 " + time);
    return datetime.getTime();
}

for(var i=0,n = userdata.length; i < n; i++) {
    date.push(userdata[i].date);
    weekdate.push(userdata[i].weekdate);
    duration.push(parseFloat(userdata[i].duration));
    start_time.push(userdata[i].start_time);
    end_time.push(userdata[i].end_time);

    if(userdata[i].duration == 0) total_real -= 1;
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
var avg_duration = parseFloat(total_duration / total_real).toFixed(2);
var avg_dru_arr = [];
for(var i=0,n=userdata.length; i < n; i++) { 
    avg_dru_arr.push(parseFloat(avg_duration));
}
// console.log(avg_dru_arr);

//渲染图表配置
$(document).ready(function(){
$(function () {
 $('#container').highcharts({
        title: {
            text: '工作时长'
        },
        xAxis: {
            categories: date
        },
        yAxis: {
            min: 8,
            tickInterval:0.5,
            title: {
                text: '时长（小时）'
            }
        },
        series: [{
            type: 'column',
            name: '你',
            data: duration
        }, {
            type: 'spline',
            name: 'Average',
            data: avg_dru_arr,
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }]
    });
});

$(function () {

    var data2 = [];
    for (var i = userdata.length - 1; i >= 0; i--) {
        //把时间换成点
        data2[i] = [new Date(date[i]).getTime(),
                    isNaN(parseFloat(start_time[i].substring(0,5).replace(':','.')))  ? null : parseFloat(start_time[i].substring(0,5).replace(':','.')), 
                    isNaN(parseFloat(end_time[i].substring(0,5).replace(':','.'))) ? null : parseFloat(end_time[i].substring(0,5).replace(':','.'))];

    };

// console.log(data2);
    $('#container2').highcharts({
    
        chart: {
            type: 'arearange'
        },
        
        title: {
            text: '工作时间'
        },
    
        xAxis: {
            type: 'datetime',
            tickInterval: 24*3600*1000
        },
        
        yAxis: {
            reversed: true,
            tickInterval : 0.5,
            title: {
                text: '时间'
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
        },
    
        series: [{
            name: '时间',
            data: data2,
            dataLabels: {
                enabled: true,
                yHigh: 20,
                yLow: -20
            }
        }]
    
    });
});



});//onload end