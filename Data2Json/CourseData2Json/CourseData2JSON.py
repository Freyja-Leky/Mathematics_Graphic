# @Time : 2022/1/19 15:53
# Author : Freyja
# Description :
import glob, os
import pandas as pd
import re
import json

# pattern for recognize prt
pattern = re.compile(r'prt[\S]*T$|prt[\S]*F$')

# J for json, input for new, student for new after process
Jdata = {'Data': []}
input_data = None
student_data = None

subject = -1
task = -1


# ---------------------------------------------------------------------------------------------
# data process part
# turn input Answer into student data with Name, str, prt

def getJsonFile():
    if os.path.exists("StudentRecord.json"):
        global Jdata
        with open("StudentRecord.json", "r", encoding="utf-8") as f:
            Jdata = json.load(f)
        f.close()


def getInputData():
    global input_data
    input_data = pd.read_csv("CourseData.csv", dtype=str)


def input2Student(taskNo):
    global student_data

    student_data = pd.DataFrame()
    student_data['name'] = input_data['姓'] + " " + input_data['名']
    student_data['str'] = input_data['解答 ' + str(taskNo)]
    student_data['prt'] = None

    for i in range(0, student_data.shape[0]):
        if pattern.findall(student_data.at[i, 'str']):
            student_data.at[i, 'prt'] = pattern.findall(student_data.at[i, 'str'])[0]


# ---------------------------------------------------------------------------------------------
# dataMaker part
# student = [{'student_ID': XXX, 'prt':[]},{}]
def studentMaker():
    student = []
    for i in range(0, student_data.shape[0]):
        if student_data.at[i, 'prt']:
            flag = False
            for j in range(0, len(student)):
                if student[j]["student_ID"] == student_data.at[i, 'name']:
                    student[j]["prt"].append(student_data.at[i, 'prt'])
                    flag = True
                    break
            if not flag:
                student.append({"student_ID": student_data.at[i, 'name'], "prt": [student_data.at[i, 'prt']]})
    return student


# new task. single task = {}
def taskMaker(task_ID):
    single_task = {"task_ID": task_ID, "student": studentMaker()}
    return single_task


# new subject with first task.
# subject = {}, task = []
# def subjectMaker(subject_ID, task_ID):
#     task = []
#     task.append(taskMaker(task_ID))
#     subject = {"subject_ID": subject_ID, "task": task}
#     return subject


# ---------------------------------------------------------------------------------------------
# check part

def findExistSubject(subject_ID):
    for i in range(0, len(Jdata['Data'])):
        if str(subject_ID) == str(Jdata['Data'][i]['subject_ID']):
            global subject
            subject = i
            break


def findExistTask(task_ID):
    if subject != -1:
        for i in range(0, len(Jdata['Data'][subject]['task'])):
            if task_ID == str(Jdata['Data'][subject]['task'][i]['task_ID']):
                global task
                task = i
                break


def run(Num, subject_ID):
    global Jdata
    # check subject
    findExistSubject(subject_ID)
    # new subject
    if subject == -1:
        print("New subject")
        Jdata['Data'].append({"subject_ID": subject_ID, "task": []})
        for i in range(1, int(Num) + 1):
            input2Student(i)
            task_ID = input("No." + str(i) + " task_ID = ")
            Jdata['Data'][len(Jdata['Data'])-1]['task'].append(taskMaker(task_ID))
    # existed subject
    else:
        for i in range(1, int(Num) + 1):
            input2Student(i)
            global task
            task = -1
            # check task
            task_ID = input("No." + str(i) + " task_ID = ")
            findExistTask(task_ID)
            # new task
            if task == -1:
                Jdata['Data'][subject]['task'].append(taskMaker(task_ID))
            # existed task
            else:
                Jdata['Data'][subject]['task'][task]['student'].extend(studentMaker())


def main():

    getJsonFile()
    getInputData()

    subject_ID = input("Please enter the subject ID :")
    print("___________________________________________")
    Num = input("Please enter the number of tasks : ")
    print("___________________________________________")
    run(Num, subject_ID)

    with open("StudentRecord.json", "w", encoding="utf-8") as f:
        f.write(json.dumps(Jdata, ensure_ascii=False))
    f.close()

    print(Jdata)

main()

