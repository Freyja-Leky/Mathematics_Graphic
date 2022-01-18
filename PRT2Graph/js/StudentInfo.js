//Get UI
var selectSubject = $("#subjectID");
var selectTask = $("#taskID");
var selectStudent = $("#studentID");

var btnRefresh = $("#refresh");
var divReturn = document.getElementById("divReturn");
var btnReturn = $('#return');
var divSelect = document.getElementById("divSelect");
var selectPRT = $("#prtID");
var divChart = document.getElementById("chart");

//Option and data parameters
var visOption;
var visData;

//Vis Net and Echart
var studentNet;
var prtChart;

var subject;
var task;

function initStudentInfo() {
    selectSubject.append("<option>Nothing Selected</option>");
    let data = selectSubjectData();
    for (let i = 0; i < data.length; i++){
        selectSubject.append(data[i]);
    }
}

//--------------------------------------------------------------------//
//Graph functions

//Clear Student Net Drawn by VIS
function clearSN(){
    if (studentNet != null){
        studentNet.destroy();
        studentNet = null;
    }
}

//Clear PRT Graph Drawn by Echarts
function clearPC(){
    if (prtChart != null){
        prtChart.clear();
        prtChart.dispose();
        prtChart = null;
    }
}

//Draw PRT Graph by Echarts
function drawPRTGraph(subject, task, prt) {

    divReturn.style.display = "block";

    clearSN();

    if (prtChart != null)
        prtChart.clear();
    else{
        prtChart = echarts.init(divChart);
    }

    prtChart.hideLoading();
    prtChart.setOption(prtPartialGraphOption(subject,task,prt));
}

function initSelectPRT() {
    selectPRT[0].selectedIndex = -1;
    selectPRT.selectpicker('refresh');
}

//Refresh Selector with Student Net
function refactorSelectPRT(data) {
    selectPRT.find("option").remove();
    for (let i = 0; i < data.length; i++){
        let str = "<option value='"+data[i].label+"'>"+data[i].label+"</option>";
        selectPRT.append(str);
    }
    initSelectPRT();
}

//Select to draw PRT Graph, same as selectPRT.change
function setStudentNetClick() {
    studentNet.on("click",function (params) {
        if (this.getNodeAt(params.pointer.DOM)==null){
            return;
        }
        selectPRT.val(visData.nodes[this.getNodeAt(params.pointer.DOM)].label);
        selectPRT.selectpicker('refresh');
        drawPRTGraph(subject,task,visData.nodes[this.getNodeAt(params.pointer.DOM)].label);
    })
}

//--------------------------------------------------------------------//
//UI Settings

selectSubject.change(function () {
    selectTask.find("option").remove();
    selectStudent.find("option").remove();

    let subject = $(this).val();
    if (subject!=""){
        let data = selectTaskData(subject);
        for (let i = 0; i < data.length; i++){
            selectTask.append(data[i]);
        }
    }

    selectTask.selectpicker('refresh');
    selectTask[0].selectedIndex = -1;
    selectStudent.selectpicker('refresh');
    selectStudent[0].selectedIndex = -1;
})

selectTask.change(function () {
    selectStudent.find("option").remove();

    let subject = $("#subjectID option:selected").val();
    let task = $(this).val();

    let data = selectStudentData(subject,task);
    for (let i = 0; i < data.length; i++)
        selectStudent.append(data[i]);

    selectStudent.selectpicker('refresh');
    selectStudent[0].selectedIndex = -1;
})

selectStudent.change(function (){
    subject = $("#subjectID option:selected").val();
    task = $("#taskID option:selected").val();
    let student = $(this).val();

    clearSN();
    clearPC();

    if (subject == null || task == null ||student == null){
        divSelect.style.display = "none";
        return;
    }

    divSelect.style.display = "block";

    visData = visGraphData(subject,task,student);
    visOption = visGraphOption();

    refactorSelectPRT(visData.nodes);

    studentNet = new vis.Network(divChart,visData,visOption);
    setStudentNetClick();
})

selectPRT.change(function () {
    let prt = $(this).val();
    drawPRTGraph(subject,task,prt);
})

btnReturn.click(function () {
    divReturn.style.display = "none";

    initSelectPRT();
    clearPC();

    studentNet = new vis.Network(divChart,visData,visOption);
    setStudentNetClick();
})

//--------------------------------------------------------------------//
//Main

$(window).on('load',function (){
    $('.selectpicker').selectpicker('refresh');
});

initStudentInfo();