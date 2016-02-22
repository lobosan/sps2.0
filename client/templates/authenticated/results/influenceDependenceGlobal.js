buildInfluenceDependenceGlobal = function (infDep) {

    var maxDep = _.max(_.pluck(infDep, 0));
    var maxInf = _.max(_.pluck(infDep, 1));

    return new Highcharts.Chart({
        chart: {
            renderTo: 'influence-dependence-global',
            type: 'scatter'
        },
        title: {
            text: 'Connectivity Global'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Dependence'
            },
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            minorTickLength: 0,
            tickLength: 0,
            min: 0,
            max: maxDep,
            plotLines: [{
                color: '#DDD',
                value: maxDep / 2,
                width: 1
            }]
        },
        yAxis: {
            title: {
                enabled: true,
                text: 'Influence'
            },
            min: 0,
            max: maxInf,
            gridLineColor: 'transparent',
            plotLines: [{
                value: maxInf / 2,
                color: '#DDD',
                width: 1
            }]
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x}, {point.y}'
                }
            }
        },
        series: [{
            name: 'Influence',
            color: 'rgba(72,194,169,0.8)',
            data: infDep
        }],
        credits: {
            enabled: false
        }
    });
};