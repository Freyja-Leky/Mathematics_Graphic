var btnRefresh = $("#refresh");
var btnPart = $("#part");
var btnGlobal = $("#global");
var myChart = echarts.init(document.getElementById('chart'));

var nodes = [];
var edges = [];

var option_part;
var option_global;

var subject;
var task;
var prt;

function createNodes(nodes){
    var N = [];
    N.push({
        id: 0,
        name: "問題",
        itemStyle: {
            color: '#ffffff',
            borderColor: '#6667AB'
        },
        symbolSize: 40
    })
    for (var i = 0;i < nodes.length;i++){
        N.push({
            id: i+1,
            name: nodes[i],
            itemStyle: {
                color:'#E6E6FA',
                borderColor: '#6667AB'
            }
        })
    }
    return N;
}

function createEdges(nodes) {
    var E = [];
    for (var i = 1;i < nodes.length;i++){
        E.push({
            source: nodes[i].id,
            target: nodes[0].id
        })
    }
    return E;
}

function comfirmNodes(node) {
    for (var i = 0;i < nodes.length; i++){
        if (node.name == nodes[i].name){
            return true;
        }
    }
    return false;
}

$.ajaxSettings.async = false;

btnPart.click(function () {

    if (btnPart.is('.active')){
        return;
    }

    btnGlobal.removeClass("active");
    btnPart.addClass("active");
    myChart.clear();
    myChart.setOption(option_part);
})

btnGlobal.click(function () {

    if (btnGlobal.is('.active')){
        return;
    }

    btnPart.removeClass("active");
    btnGlobal.addClass("active");

    myChart.clear();

    $.getJSON('data/graph.json',function (graph) {
        myChart.hideLoading();
        graph.nodes.forEach(function (node) {
            node.label = {
                show: node.size > 25
            };
            if (comfirmNodes(node))
            {
                node.itemStyle = {
                    color: '#E6E6FA',
                    borderColor: '#6667AB'
                },
                node.label = {
                    show: true,
                    color: '#000000',
                    fontWeight: 'bold'
                }
            }
            else {
                node.itemStyle = {
                    color:'#ffffff',
                    borderColor: '#6667AB'
                };
            }
            node.symbolSize = node.size;
        });
        option_global = {
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            tooltip: {
                show: true,
                formatter: function (params) {
                    return params.data.name;
                }
            },
            series:[{
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.edges,
                roam: true,
                zoom: 0.4,
                center: [-50,-200],
                label:{
                    position: 'right',
                    formatter: '{b}'
                },
                lineStyle: {
                    color: '#6667AB',
                    curveness: 0.3
                },
                force: {
                    repulsion: 2000
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 5
                    },
                    label: {
                        show: true
                    }
                }
            }]
        };
        myChart.setOption(option_global);
    })

})

btnRefresh.click(function (){
    subject = $("#subjectID option:selected").val();
    task = $("#taskID option:selected").val();
    prt = $("#prtID option:selected").val();

    btnPart.removeClass("active");
    btnGlobal.removeClass("active");

    myChart.clear();

    if (subject == null || task == null || prt == null){
        btnPart.attr("disabled",true);
        btnGlobal.attr("disabled",true);
        return;
    }

    btnPart.attr("disabled",false);
    btnGlobal.attr("disabled",false);

    btnPart.addClass("active");
    nodes = [];
    edges = [];

    $.getJSON('data/record.json',function (json) {
        json.Data.forEach(function (data) {
            if (data.subject_ID == subject){
                for (var i = 0; i < data.task[task].PRT[prt].nodes.length; i++)
                {
                    nodes.push(data.task[task].PRT[prt].nodes[i]);
                }
            }
        })
    })

    nodes = createNodes(nodes);
    edges = createEdges(nodes);

    option_part = {
        series:[{
            type: 'graph',
            layout: 'force',
            symbolSize: 50,
            data: nodes,
            links: edges,
            roam: true,
            center: ['50%','50%'],
            label:{
                show: true,
                position: 'right',
                formatter: '{b}'
            },
            lineStyle: {
                color: '#6667AB',
                curveness: 0.3
            },
            force: {
                repulsion: 2000
            }
        }]
    };
    myChart.hideLoading();
    myChart.setOption(option_part);
})

