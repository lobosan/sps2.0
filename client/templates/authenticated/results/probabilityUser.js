buildProbabilityUser = function (probability) {
    return new Highcharts.Chart({
        chart: {
            renderTo: 'probability-user',
            type: 'column'
        },
        title: {
            text: 'Probability'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Alternatives'
            },
            type: 'Alternatives',
            labels: {
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                },
                formatter: function () {
                    return 'a' + (parseInt(this.value) + 1);
                }
            }
        },
        yAxis: {
            title: {
                enabled: true,
                text: 'Probability'
            },
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            labels: {
                formatter: function () {
                    return this.value + "%";
                }
            },
            min: 0
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.y:.2f}%'
        },
        series: [{
            name: 'Probability',
            color: 'rgba(126,167,181,0.8)',
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                align: 'center',
                format: '{point.y:.2f}%', // two decimal
                y: 30, // pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
                }
            },
            data: probability
        }],
        credits: {
            enabled: false
        }
    });
};