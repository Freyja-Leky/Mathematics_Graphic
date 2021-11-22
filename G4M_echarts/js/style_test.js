var myChart = echarts.init(document.getElementById('main'));

window.onresize = function (){
    myChart.resize();
}

function rgb2rgba(color, a) {
    rgb = color.substring(4,color.length-1);
    rgba = "rgba("+rgb+","+a+")";
    return rgba;
}

var option;

myChart.showLoading();

jQuery.getJSON('data/test.json',function (graph){
    myChart.hideLoading();
    var categories = [];
    graph.nodes.forEach(function (node) {
        node.label = {
            show: node.size > 20,
            position: (node.id == 0)?"inside":"top"
        };
        node.itemStyle = {
            color: rgb2rgba(node.color,node.study),
            borderColor: "#000"
        };
        node.symbolSize = node.size;
    });

    option = {
        title: {
            text: 'G4M'
        },
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series:[{
            type: 'graph',
            layout: 'force',
            data: graph.nodes,
            links: graph.edges,
            categories: categories,
            roam: true,
            label:{
                formatter: '{b}',
                color: "#000"
            },
            lineStyle: {
                color: "#000",
                curveness: 0
            },
            force:{
                repulsion: 1000,
                edgeLength: [10,100],
            }
        }]
    };
    myChart.setOption(option);
});