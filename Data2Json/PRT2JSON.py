# @Time : 2021/12/7 16:37
# Author : Freyja
# Description :
import pandas as pd
import json

data = pd.read_excel(r"Q2PRT.xlsx", dtype=str)
row = data.shape[0]
col = data.shape[1]

taskList = data.iloc[:, [0, 1]].fillna(method="ffill")
prtList = data.iloc[:, 2:col]
col_prt = prtList.shape[1]


def prtMaker(c):
    PRT_ID = prtList.iat[c, 0]
    nodes = []
    for i in range(1, col_prt):
        if not pd.isnull(prtList.iat[c, i]):
            nodes.append(prtList.iat[c, i])
    PRT = {"PRT_ID": PRT_ID, "nodes": nodes}
    return PRT


def taskMaker(start):
    task_ID = taskList.iat[start, 1]
    PRT = []
    p = start
    while p < row and taskList.iat[p, 1] == taskList.iat[start, 1]:
        PRT.append(prtMaker(p))
        p += 1
    task = {"task_ID": task_ID, "PRT": PRT}
    return p, task


def subjectMaker(start):
    subject_ID = taskList.iat[start, 0]
    task = []
    p = start
    while p < row and taskList.iat[p, 0] == taskList.iat[start, 0]:
        end, t = taskMaker(p)
        task.append(t)
        p = end
    subject = {"subject_ID": subject_ID, "task": task}
    return p, subject


def dataMaker():
    start = 0
    while start < row:
        end, s = subjectMaker(start)
        Jdata['Data'].append(s)
        start = end
    with open("record.json", "w", encoding="utf-8") as f:
        f.write(json.dumps(Jdata, ensure_ascii=False))


Jdata = {'Data': []}
dataMaker()
print(json.dumps(Jdata, ensure_ascii=False))
