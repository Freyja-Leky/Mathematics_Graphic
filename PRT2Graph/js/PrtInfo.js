//Get UI
var selectSubject = $("#subjectID");
var selectTask = $("#taskID");
var selectPRT = $("#prtID");

var btnRefresh = $("#refresh");
var btnPart = $("#part");
var btnGlobal = $("#global");
var Chart = echarts.init(document.getElementById('chart'));

//Option parameters
var option_part;
var option_global;

function initPRTInfo() {
    selectSubject.append("<option>Nothing Selected</option>");
    let data = selectSubjectData();
    for (let i = 0; i < data.length; i++){
        selectSubject.append(data[i]);
    }
}

//--------------------------------------------------------------------//
//UI Settings

selectSubject.change(function () {
    selectTask.find("option").remove();
    selectPRT.find("option").remove();

    let subject = $(this).val();
    if (subject!=""){
        let data = selectTaskData(subject);
        for (let i = 0; i < data.length; i++){
            selectTask.append(data[i]);
        }
    }

    selectTask.selectpicker('refresh');
    selectTask[0].selectedIndex = -1;
    selectPRT.selectpicker('refresh');
    selectPRT[0].selectedIndex = -1;
})

selectTask.change(function () {
    selectPRT.find("option").remove();

    let subject = $("#subjectID option:selected").val();
    let task = $(this).val();

    let data = selectPRTData(subject,task);
    for (let i = 0; i < data.length; i++)
        selectPRT.append(data[i]);

    selectPRT.selectpicker('refresh');
    selectPRT[0].selectedIndex = -1;
})

btnPart.click(function () {

    if (btnPart.is('.active')){
        return;
    }

    btnGlobal.removeClass("active");
    btnPart.addClass("active");

    Chart.clear();
    Chart.setOption(option_part);
})

btnGlobal.click(function () {

    if (btnGlobal.is('.active')){
        return;
    }

    btnPart.removeClass("active");
    btnGlobal.addClass("active");

    Chart.clear();
    if (option_global == null)
        option_global = prtGlobalGraphOption(option_part);
    Chart.hideLoading();
    Chart.setOption(option_global);

    })

btnRefresh.click(function (){
    var subject = $("#subjectID option:selected").val();
    var task = $("#taskID option:selected").val();
    var prt = $("#prtID option:selected").val();

    btnPart.removeClass("active");
    btnGlobal.removeClass("active");

    Chart.clear();

    if (subject == null || task == null || prt == null){
        btnPart.attr("disabled",true);
        btnGlobal.attr("disabled",true);
        return;
    }

    btnPart.attr("disabled",false);
    btnGlobal.attr("disabled",false);

    btnPart.addClass("active");

    option_part = null;
    option_global = null;

    option_part = prtPartialGraphOption(subject,task,prt);

    Chart.hideLoading();
    Chart.setOption(option_part);
})

//--------------------------------------------------------------------//
//Main

$(window).on('load',function (){
    $('.selectpicker').selectpicker('refresh');
});

initPRTInfo();