let myChart1 = echarts.init(document.getElementById('chart1'));
let myChart2 = echarts.init(document.getElementById('chart2'));

let option1 = {
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['白', '蓝', '黑', '红', '绿']
    },
    title: {
        text: '五色使用率',
        subtext: '数据仅供参考',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [
        {
            name: '色块使用率',
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            color : [ '#e2e2e2', '#1E9FFF', '#393D49', '#FF5722', '#5FB878'],
            data: [
                {value: 566, name: '白'},
                {value: 946, name: '蓝'},
                {value: 734, name: '黑'},
                {value: 832, name: '红'},
                {value: 585, name: '绿'}
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

let option2 = {
    grid: {
        left: '15%',
        right: '15%'
    },
    title: {
        text: '天梯卡组使用率/胜率统计',
        subtext: '数据仅供参考',
        left: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    dataZoom: [
        {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: 30        // 右边在 60% 的位置。
        },
        {   // 这个dataZoom组件，也控制x轴。
            type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: 30         // 右边在 60% 的位置。
        }
    ],
    xAxis: [
        {
            type: 'category',
            data: ['红蓝', '死灵', '黑巨', '白红', '咆哮绿', '黑白系命', '三色混', '法伤', '神器', '三色化灵', '绿蓝化灵', '其他'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            name: '使用次数(周)',
            type: 'value'
        },
        {
            name: '平均胜率(%)',
            type: 'value',
            max: 100,
            axisLabel: {
                show: true,
                interval: 'auto',//居中显示
                formatter: '{value} %'//以百分比显示
            },
        }

    ],
    series: [
        {
            name: '使用次数',
            type: 'bar',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#83bff6'},
                        {offset: 0.5, color: '#188df0'},
                        {offset: 1, color: '#188df0'}
                    ]
                )
            },
            barWidth: '50%',
            data: [4032, 5441, 4121, 2020, 2155, 2858, 2585, 1874, 3120, 1992, 1859, 4212]
        },
        {
            name: '平均胜率',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
                trigger: 'axis',
                formatter: '{c}%'
            },
            data: [53, 61, 57, 51, 52, 54, 52, 54, 51, 51, 52, 46]
        }
    ]
};


myChart1.setOption(option1);
myChart2.setOption(option2);