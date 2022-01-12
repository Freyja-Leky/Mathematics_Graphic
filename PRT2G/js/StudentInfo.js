//Get UI
var btnRefresh = $("#refresh");
var divReturn = document.getElementById("divReturn");
var btnReturn = $('#return');
var divSelect = document.getElementById("divSelect");
var selectPRT = $("#prtID");
var divChart = document.getElementById("chart");


//Option parameters
var vis_option = {
    edges:{
        arrows: "to",
        color:{
            color: '#6667AB',
            opacity: 1.0
        },
    },
    nodes:{
        color:{
            border: '#6667AB',
            background: '#E6E6FA'
        },
        shape: "circle"
    },
    interaction:{
        dragView: false,
        dragNodes: false,
        zoomView: false
    }
};

var e_option

//Json data

var Sdata = [];
var Pdata = [];

var data = {};

var vis_net;
var myChart;

$.ajaxSettings.async = false;

$.getJSON('../data/StudentRecord.json',function (json) {
    json.Data.forEach(function (data) {
        Sdata.push(data);
    })
})

$.getJSON('../data/PRTRecord.json',function (json) {
    json.Data.forEach(function (data) {
        Pdata.push(data);
    })
})

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

function prtMaker(subject, task, prt) {
    divReturn.style.display = "block";

    if (vis_net != null){
        console.log("vis_net destroy")
        vis_net.destroy();
        vis_net = null;
    }
    console.log("prtMaker:"+prt);

    e_option = {};
    e_nodes = [];
    e_edges = [];

    if (myChart != null)
        myChart.clear();
    else{
        console.log("myChart init");
        myChart = echarts.init(divChart);
    }



    for (var i = 0; i < Pdata.length; i++) {
        if (subject == Pdata[i].subject_ID) {
            for (var j = 0; j < Pdata[i].task[task].PRT.length; j++) {
                console.log(Pdata[i].task[task].PRT[j].PRT_ID);
                if (prt == Pdata[i].task[task].PRT[j].PRT_ID) {
                    console.log(Pdata[i].task[task].PRT[j].nodes);
                    e_nodes = Pdata[i].task[task].PRT[j].nodes;
                    break;
                }
            }
            break;
        }
    }

    e_nodes = createNodes(e_nodes);
    e_edges = createEdges(e_nodes);
    console.log(e_edges);
    console.log(e_nodes);


        e_option = {
            series: [{
                type: 'graph',
                layout: 'force',
                symbolSize: 50,
                data: e_nodes,
                links: e_edges,
                roam: true,
                center: ['50%', '50%'],
                label: {
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
        myChart.setOption(e_option);
}



btnRefresh.click(function (){
    subject = $("#subjectID option:selected").val();
    task = $("#taskID option:selected").val();
    student = $("#studentID option:selected").val();

    if (vis_net != null){
        vis_net.destroy();
        vis_net = null;
    }

    if (myChart != null){
        myChart.clear();
        myChart.dispose();
        myChart = null;
    }




    if (subject == null || task == null ||student == null){
        divSelect.style.display = "none";
        return;
    }

    divSelect.style.display = "block";
    selectPRT.find("option").remove();

    data = {}
    var vis_nodes = [];
    var vis_edges = [];

    for (var i = 0;i < Sdata.length;i++){
        if (Sdata[i].subject_ID == subject){
            var node_count = 0;
            var edge_count = 0;
            for (var k = 0; k< Sdata[i].task[task].student[student].prt.length;k++){

                //First Node
                if (node_count == 0){
                    vis_nodes.push({id:node_count, label:Sdata[i].task[task].student[student].prt[k]});
                    node_count++;
                    str = "<option value='"+Sdata[i].task[task].student[student].prt[k]+"'>"+Jdata[i].task[task].student[student].prt[k]+"</option>";
                    selectPRT.append(str);
                    continue;
                }

                var new_node;
                var last_node;
                var flag = false;

                //Repeat Node
                for (var l = 0; l < node_count;l++){
                    if (vis_nodes[l].label == Sdata[i].task[task].student[student].prt[k]){
                        new_node = l;
                        flag = true;
                        break;
                    }
                }

                if (!flag){
                    new_node = node_count;
                    vis_nodes.push({id:node_count, label:Sdata[i].task[task].student[student].prt[k]});
                    node_count++;
                    str = "<option value='"+Sdata[i].task[task].student[student].prt[k]+"'>"+Jdata[i].task[task].student[student].prt[k]+"</option>";
                    selectPRT.append(str);
                }

                //Repeat Edge
                if (edge_count != 0)
                    last_node = vis_edges[edge_count-1].to;
                else
                    last_node = vis_nodes[0].id;
                vis_edges.push({from:last_node, to: new_node, label: (edge_count+1).toString(), id: edge_count});
                edge_count++;
            }
            break;
        }
    }

    selectPRT[0].selectedIndex = -1;
    selectPRT.selectpicker('refresh');


    data = {
        nodes: vis_nodes,
        edges: vis_edges
    };
    vis_net = new vis.Network(divChart,data,vis_option);

    vis_net.on("click",function (params) {
        if (this.getNodeAt(params.pointer.DOM)==null){
            return;
        }
        selectPRT.val(data.nodes[this.getNodeAt(params.pointer.DOM)].label);
        selectPRT.selectpicker('refresh');
        prtMaker(subject,task,data.nodes[this.getNodeAt(params.pointer.DOM)].label);

    })
})

selectPRT.change(function () {
    subject = $("#subjectID option:selected").val();
    task = $("#taskID option:selected").val();
    prt = $(this).val();
    console.log("selectPRT:"+prt);
    prtMaker(subject,task,prt);
})

btnReturn.click(function () {
    divReturn.style.display = "none";
    selectPRT[0].selectedIndex = -1;
    selectPRT.selectpicker('refresh');
    myChart.clear();
    myChart.dispose();
    myChart = null;
    vis_net = new vis.Network(divChart,data,vis_option);
    vis_net.on("click",function (params) {
        if (this.getNodeAt(params.pointer.DOM)==null){
            return;
        }
        selectPRT.val(data.nodes[this.getNodeAt(params.pointer.DOM)].label);
        selectPRT.selectpicker('refresh');
        prtMaker(subject,task,data.nodes[this.getNodeAt(params.pointer.DOM)].label);
    })

})