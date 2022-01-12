
var myChart = echarts.init(document.getElementById('main'));
window.onresize = function (){
    myChart.resize();
}

var option;

myChart.showLoading();

jQuery.getJSON('../data/graph.json',function (graph){
    myChart.hideLoading();
    var categories = [];
    graph.nodes.forEach(function (node) {
        node.label = {
            show: node.size > 20
        };
        // node.itemStyle = {
        //     color: node.color
        // };
        node.symbolSize = node.size;
        node.category = node.attributes.group;
        var cat = node.attributes.group;
        categories.push(cat);
    });
    categories = jQuery.unique(categories)
    var num = categories.length;
    for (var i = 0; i < num;i++){
        categories[i] = {
            name: categories[i]
        };
    }
    option = {
        tooltip: {
            show: true,
            formatter: function (params) {
                return params.data.name;
            }
        },
        color: [
            '#FFB6C1',
            '#DC143C',
            '#9370DB',
            '#E6E6FA',
            '#6495ED',
            '#5F9EA0',
            '#3CB371',
            '#F5F5DC',
            '#FFD700',
            '#FFA500',
            '#BC8F8F',
            '#800000',
            '#696969',
            '#BA55D3',
            '#D2691E'
        ],
        legend: [
            {
                // orient: 'vertical',
                // show: false,
                // selectedMode:'mulitple',
                left: "8%",
                data: categories.map(function (a){
                    return a.name;
                })
            }
        ],
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series:[{
            type: 'graph',
            layout: 'none',
            data: graph.nodes,
            links: graph.edges,
            categories: categories,
            roam: true,
            label:{
                position: 'right',
                formatter: '{b}'

            },
            lineStyle: {
                color: "source",
                curveness: 0.3
            },
            emphasis: {
                focus: 'adjacency',
                lineStyle: {
                    width: 10
                },
                label: {
                    show: true
                }
            }
        }]
    };
    myChart.setOption(option);
});