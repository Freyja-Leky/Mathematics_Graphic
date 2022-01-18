
//--------------------------------------------------------------------//
//Getting Data from Json
var graphData = [];
var prtData = [];
var courseData = [];

$.ajaxSettings.async = false;

$.getJSON('../data/graph.json',function (json) {
    graphData = json;
})


$.getJSON('../data/PRTRecord.json',function (json) {
    json.Data.forEach(function (data) {
        prtData.push(data);
    })
})


$.getJSON('../data/StudentRecord.json',function (json) {
    json.Data.forEach(function (data) {
        courseData.push(data);
    })
})

console.log(courseData);

$.ajaxSettings.async = true;

//--------------------------------------------------------------------//
//Selector Data

function selectSubjectData() {
    let data = [];
    for (let i = 0; i < prtData.length; i++){
        let str = "<option value='"+prtData[i].subject_ID+"'>"+prtData[i].subject_ID+"</option>";
        data.push(str);
    }
    return data;
}

function selectTaskData(subject) {
    let data = [];
    for ( let i = 0; i < prtData.length; i++){
        if (subject == prtData[i].subject_ID){
            for (let j = 0; j < prtData[i].task.length; j++){
                let str = "<option value='"+j+"'>"+prtData[i].task[j].task_ID+"</option>";
                data.push(str);
            }
            break;
        }
    }
    return data;
}

function selectPRTData(subject,task) {
    let data = [];
    for (let i = 0; i < prtData.length; i ++){
        if (subject == prtData[i].subject_ID){
            for (let j = 0; j < prtData[i].task[task].PRT.length; j++){
                let str = "<option value='"+prtData[i].task[task].PRT[j].PRT_ID+"'>"+prtData[i].task[task].PRT[j].PRT_ID+"</option>";
                data.push(str);
            }
            break;
        }

    }
    return data;
}

function selectStudentData(subject,task) {
    let data = [];
    for (let i = 0; i < courseData.length; i++){
        if (subject == courseData[i].subject_ID){
            for (let j = 0; j < courseData[i].task[task].student.length; j++){
                let str = "<option value='"+j+"'>"+courseData[i].task[task].student[j].student_ID+"</option>";
                data.push(str);
            }
            break;
        }
    }
    return data;
}


//--------------------------------------------------------------------//
//Partial Graph

partialGraphTrueNode = {
    itemStyle:{
        color: '#6667AB',
        borderColor: '#E6E6FA',
        borderWidth: 3
    },
    category: 'Succeed'
};

partialGraphFalseNode = {
    itemStyle:{
        color: '#F8F8FF',
        borderColor: '#E6E6FA',
        borderWidth: 1.5,
        borderType: "dashed",
    },
    label:{
        color: 'rgba(0,0,0,0.5)'
    },
    category: 'Failed'
}

function createNodes(trueNodes,falseNodes){
    var N = [];
    N.push({
        id: 0,
        name: "問題",
        itemStyle: {
            color:'#ffffff',
            borderColor: '#6667AB'},
        symbolSize: 40
    });
    for (var i = 0;i < trueNodes.length;i++){
        N.push({
            id: i+1,
            name: trueNodes[i],
            itemStyle: partialGraphTrueNode.itemStyle,
            category: partialGraphTrueNode.category
        });
    }
    for (var j =0;j < falseNodes.length;j++){
        N.push({
            id: i+j+1,
            name: falseNodes[j],
            itemStyle: partialGraphFalseNode.itemStyle,
            label: partialGraphFalseNode.label,
            category: partialGraphFalseNode.category
        });
    }
    return N;
}

function createEdges(nodes) {
    var E = [];
    for (var i = 1;i < nodes.length;i++){
        E.push({
            source: nodes[0].id,
            target: nodes[i].id
        })
    }
    return E;
}

//Classify Right and Wrong Nodes
function prepareNodes(subject,task,prt){
    var trueNodes = [];
    var falseNodes = [];
    for (let i = 0;i < prtData.length; i++){
        if (prtData[i].subject_ID == subject){
            if (prt == prtData[i].task[task].PRT[0].PRT_ID){
                trueNodes = prtData[i].task[task].PRT[0].nodes;
                falseNodes = [];
                break;
            }
            else{
                let origin = prtData[i].task[task].PRT[0].nodes;
                for (let j = 1;j < prtData[i].task[task].PRT.length; j++){
                    if (prt == prtData[i].task[task].PRT[j].PRT_ID)
                        trueNodes = prtData[i].task[task].PRT[j].nodes;
                }
                for (let j = 0;j < origin.length; j++){
                    if (trueNodes.indexOf(origin[j])<0)
                        falseNodes.push(origin[j]);
                }
            }
        }
    }
    return [trueNodes,falseNodes];
}

// Option maker
function prtPartialGraphOption(subject,task,prt) {
    var option = {};
    var nodeData = prepareNodes(subject,task,prt);
    var nodes = createNodes(nodeData[0],nodeData[1]);
    var edges = createEdges(nodes);

    option = {
        legend:[
            {
                data: [partialGraphTrueNode.category,partialGraphFalseNode.category]
            }
        ],
        series: [{
            type: 'graph',
            layout: 'force',
            symbolSize: 50,
            data: nodes,
            links: edges,
            roam: true,
            // center: ['50%', '50%'],
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
            },
            categories: [
                {
                    name: partialGraphTrueNode.category,
                    itemStyle: partialGraphTrueNode.itemStyle
                },
                {
                    name: partialGraphFalseNode.category,
                    itemStyle: partialGraphFalseNode.itemStyle
                }
            ]
        }]
    };

    return option;
}

//--------------------------------------------------------------------//
//Global Graph

partialGraphNode = {
    itemStyle:{
        color: '#E6E6FA',
        borderColor: '#6667AB'
    },
    label:{
        show: true,
        color: '#000000',
        fontWeight: 'bold'
    }
}

globalGraphNode = {
    itemStyle:{
        color:'#ffffff',
        borderColor: '#6667AB'
    }
}

function comfirmNode(node,partNodes) {
    for (let i = 0; i < partNodes.length;i++){
        if (partNodes[i].name == node)
            return true;
    }
    return false;
}

function createPinGNodes(partNodes) {
    var N = [];
    for (let i = 0; i < graphData.nodes.length; i++){
        if (comfirmNode(graphData.nodes[i].name,partNodes)){
            N.push({
                id: graphData.nodes[i].id,
                name: graphData.nodes[i].name,
                symbolSize: graphData.nodes[i].size,
                x: graphData.nodes[i].x,
                y: graphData.nodes[i].y,
                itemStyle: partialGraphNode.itemStyle,
                label: partialGraphNode.label
            })
        }
        else {
            N.push({
                id: graphData.nodes[i].id,
                name: graphData.nodes[i].name,
                symbolSize: graphData.nodes[i].size,
                x: graphData.nodes[i].x,
                y: graphData.nodes[i].y,
                itemStyle: globalGraphNode.itemStyle,
                label: {
                    show: graphData.nodes[i].size >25
                }
            })
        }
    }
    return N;
}

// Option maker
function prtGlobalGraphOption(partOption) {
    var option = {};
    var nodes = createPinGNodes(partOption.series[0].data);
    var edges = graphData.edges;

    option = {
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        tooltip: {
            show: true,
            formatter: function (params) {
                return params.data.name;
            }
        },
        series: [{
            type: 'graph',
            layout: 'force',
            data: nodes,
            links: edges,
            roam: true,
            zoom: 0.4,
            center: [-50,-200],
            label: {
                position: 'right',
                formatter: '{b}',
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

    return option;
}

//--------------------------------------------------------------------//
//Student VIS Graph

function visGraphData(subject,task,student) {
    var nodes = [];
    var edges = [];
    for (let i = 0; i < courseData.length; i++){
        if (courseData[i].subject_ID == subject){
            let node_count = 0;
            let edge_count = 0;

            let new_node;
            let last_node;
            let flag = false;

            for (let j = 0; j < courseData[i].task[task].student[student].prt.length; j++){
                //First Node
                if (node_count == 0){
                    nodes.push({id:node_count,label:courseData[i].task[task].student[student].prt[j]});
                    last_node = node_count;
                    node_count++;
                    continue;
                }

                //Check Repeat Node
                for (let k =0 ; k < node_count; k++){
                    if (nodes[k].label == courseData[i].task[task].student[student].prt[j]){
                        new_node = k;
                        flag = true;
                        break;
                    }
                }

                //New Node
                if (!flag){
                    new_node = node_count;
                    nodes.push({id:node_count,label:courseData[i].task[task].student[student].prt[j]});
                    node_count++;
                }

                //Edge
                edges.push({from:last_node, to: new_node, label: (edge_count+1).toString(), id: edge_count});
                edge_count++;
                last_node = new_node;
            }
            break;
        }
    }

    var data = {
        nodes: nodes,
        edges: edges
    }

    return data;
}

function visGraphOption() {
    var option = {
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

    return option;
}


