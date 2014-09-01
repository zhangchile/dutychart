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
    var datetime = new Date("2014/11/11 " + time);
    return datetime.getTime();
}

for(var i=0,n = userdata.length; i < n; i++) {
    date[i] = userdata[i].date;
    weekdate[i] = userdata[i].weekdate;
    duration[i] = parseFloat(userdata[i].duration);
    start_time[i] = userdata[i].start_time;
    end_time[i] = userdata[i].end_time;

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
    avg_dru_arr[i] = parseFloat(avg_duration);
}
// console.log(avg_dru_arr);

//渲染图表配置
$(document).ready(function(){

$(function () {
 $('#container').highcharts({
        title: {
            text: '工作时长'
        },
        subtitle: {
            text: '这么多时间你都干了些什么？'
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
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: ' 小时'
        },
        series: [{
            type: 'column',
            name: '你',
            data: duration
        }, {
            type: 'spline',
            name: '平均',
            data: avg_dru_arr,
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }]
    });
});

// $(function () {

//     var data2 = [];
//     for (var i = userdata.length - 1; i >= 0; i--) {
//         //把时间换成点
//         data2[i] = [new Date(date[i]).getTime(),
//                     isNaN(parseFloat(start_time[i].substring(0,5).replace(':','.')))  ? null : parseFloat(start_time[i].substring(0,5).replace(':','.')), 
//                     isNaN(parseFloat(end_time[i].substring(0,5).replace(':','.'))) ? null : parseFloat(end_time[i].substring(0,5).replace(':','.'))];

//     };

// // console.log(data2);
//     $('#container2').highcharts({
    
//         chart: {
//             type: 'arearange'
//         },
        
//         title: {
//             text: '工作时间'
//         },
    
//         xAxis: {
//             type: 'datetime',
//             tickInterval: 24*3600*1000
//         },
        
//         yAxis: {
//             reversed: true,
//             // tickInterval : 0.5,
//             title: {
//                 text: '时间'
//             }
//         },

//         tooltip: {
//             crosshairs: true,
//             shared: true,
//         },
    
//         series: [{
//             name: '时间',
//             data: data2,
//             dataLabels: {
//                 enabled: true,
//                 yHigh: 20,
//                 yLow: -20
//             }
//         }]
    
//     });
// });

$(function () {

    var start_data3 = [];
    var end_data3 = [];
    for (var i = userdata.length - 1; i >= 0; i--) {
        //把时间换成点
        start_data3[i] = isNaN(parseFloat(start_time[i].substring(0,5).replace(':','.')))  ? null : parseFloat(start_time[i].substring(0,5).replace(':','.'));
        end_data3[i] = isNaN(parseFloat(end_time[i].substring(0,5).replace(':','.'))) ? null : parseFloat(end_time[i].substring(0,5).replace(':','.'));
    };
        $('#container3').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '工作时间'
            },
            subtitle: {
                text: '你喜欢早到还是晚退？'
            },
            xAxis: {
                categories: date
            },
            yAxis: {
                reversed:true,
                title: {
                    text: '时间'
                },
                max: 24
            },
            tooltip: {
                crosshairs: true,
                shared: true,
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            series: [{
                name: '到达',
                data: start_data3
            }, {
                name: '离开',
                data: end_data3
            }]
        });
    });

$(function () {

var Mon = {n:0, total: 0};
var Tue = {n:0, total: 0};
var Wed = {n:0, total: 0};
var Thur = {n:0, total: 0};
var Fir = {n:0, total: 0};
for (var i = userdata.length - 1; i >= 0; i--) {
    if(!isNaN(userdata[i].duration) && userdata[i].duration > 0)
    if(userdata[i].weekdate == '一') {
        Mon.n++;
        Mon.total += parseFloat(userdata[i].duration);
    } else if(userdata[i].weekdate == '二') {
        Tue.n++;
        Tue.total += parseFloat(userdata[i].duration);
    } else if(userdata[i].weekdate == '三') {
        Wed.n++;
        Wed.total += parseFloat(userdata[i].duration);
    } else if(userdata[i].weekdate == '四') {
        Thur.n++;
        Thur.total += parseFloat(userdata[i].duration);
    } else if(userdata[i].weekdate == '五') {
        Fir.n++;
        Fir.total += parseFloat(userdata[i].duration);
    }
}
//calculate weekdate avgerage
var Mon_avg = parseFloat(Mon.total / Mon.n).toFixed(2);
var Tue_avg = parseFloat(Tue.total / Tue.n).toFixed(2);
var Wed_avg = parseFloat(Wed.total / Wed.n).toFixed(2);
var Thur_avg = parseFloat(Thur.total / Thur.n).toFixed(2);
var Fir_avg = parseFloat(Fir.total / Fir.n).toFixed(2);

    $('#container4').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: '一周统计'
        },
        subtitle: {
            text: '你更喜欢在哪天工作？'
        },
        xAxis: {
            categories: ['周一', '周二', '周三', '周四', '周五'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 8,
            tickInterval:0.5,
            title: {
                text: '时间 (小时)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' 小时'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: '工作时长',
            data: [parseFloat(Mon_avg), parseFloat(Tue_avg), parseFloat(Wed_avg), parseFloat(Thur_avg), parseFloat(Fir_avg)]
        }]
    });
});



$("#time").html( date[0] + ' 到 ' + date[userdata.length - 1] );
});//onload end
