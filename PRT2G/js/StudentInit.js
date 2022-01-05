
var selectSubject = $("#subjectID");
var selectTask = $("#taskID");
var selectStudent = $("#studentID");

var Jdata = []

$.ajaxSettings.async = false;

$.getJSON('../data/StudentRecord.json',function (json){
    selectSubject.append("<option>Nothing Selected</option>");
    json.Data.forEach(function (data) {
        Jdata.push(data);
        str = "<option value='"+data.subject_ID+"'>"+data.subject_ID+"</option>";
        selectSubject.append(str);
    })
});

selectSubject.change(function () {
    selectTask.find("option").remove();
    selectStudent.find("option").remove();
    var subject = $(this).val();
    if (subject!=""){
        for (var i = 0;i < Jdata.length;i++){
            if(Jdata[i].subject_ID == subject){
                for (var j = 0;j < Jdata[i].task.length;j++){
                    str = "<option value='"+j+"'>"+Jdata[i].task[j].task_ID+"</option>";
                    console.log(str);
                    selectTask.append(str);
                }
                break;
            }
        }
    }
    selectTask.selectpicker('refresh');
    selectTask[0].selectedIndex = -1;
    selectStudent.selectpicker('refresh');
    selectStudent[0].selectedIndex = -1;
})

selectTask.change(function () {
    selectStudent.find("option").remove();
    var subject = $("#subjectID option:selected").val();
    var task = $(this).val();
    for (var i = 0;i < Jdata.length;i++){
        if(Jdata[i].subject_ID == subject) {
            for (var k = 0;k < Jdata[i].task[task].student.length; k++){
                str = "<option value='"+k+"'>"+Jdata[i].task[task].student[k].student_ID+"</option>";
                selectStudent.append(str);
            }
            break;
        }
    }
    selectStudent.selectpicker('refresh');
    selectStudent[0].selectedIndex = -1;
})

$(window).on('load',function (){
    $('.selectpicker').selectpicker('refresh');
});