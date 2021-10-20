import React, { useEffect } from "react";
import axios from "axios";
import * as Constants from '../utils/Constants'
import AddIcon from '@material-ui/icons/Add';
import 'material-icons/iconfont/material-icons.css';
import '../App';
import MaterialTable from 'material-table'
export default function TaskTab() {
    const [tableData, setTableData] = React.useState([]);
    let art = [];
    let arr = [];
    let mySet = new Set()
    const [task, settask] = React.useState([]);

    React.useEffect(() => {
        axios.get(Constants.URL + 'employee/getAllEmployees')
            .then(res => {
                settask(res.data.employeeList);
                task.map((value, key) => {
                    mySet.add(value.task.task_ID);
                })
                Array.from(mySet).map((value, key) => {
                    arr.push(value);
                })
                console.log("Unique " + arr)
            })
            .catch(err => {
                alert("Error " + err);
            })
    }, [])

    task.map((value, key) => {
        art.push(value.task.task_ID);
    })

    const columns = [
        {
            title: "Task ID", field: "task_ID", sorting: true, filtering: false, type: 'numeric', editable: 'never', align: 'center', type: 'numeric',
            render: (rowData) => <div style={{ background: result(rowData.task_ID) ? "#008000aa" : "#FFFF33" }}>{rowData.task_ID}</div>
        },
        { title: "Short Name", field: "short_Name", filterPlaceholder: "filter", sorting: true, filtering: false },
        { title: "Task Name", field: "task_Name", align: "center", grouping: false, sorting: true, filtering: false, },
    ]
    function result(id) {
        return art.includes(id);
    }

   React.useEffect(() => {
        axios.get(Constants.URL + 'task/getAllTasks')
            .then(res => {
                // console.log(res.data);
                setTableData(res.data.taskList);
            })
            .catch(err => {
                alert("Error " + err);
            })

    }, [])

    function emptyCheck(value) {
        if (value !==undefined && value !== null && value !== '') {
            return true;
        }
        return false;
    }
    return (
        <div className="App">
            <MaterialTable columns={columns} data={tableData}
                editable={{
                    onRowAdd: (newRow) => new Promise((resolve, reject) => {
                        if (emptyCheck(newRow.task_ID) && emptyCheck(newRow.short_Name) && emptyCheck(newRow.task_Name)) {
                            axios.post(Constants.URL + 'task/insertTask', {
                                "task_ID": newRow.task_ID,
                                "short_Name": newRow.short_Name,
                                "task_Name": newRow.task_Name
                            }
                            )
                                .then(res => {
                                    if (res.data.statusCode === 200 && res.data.status === true) {
                                        // alert('SuccessFull insertion');

                                        axios.get(Constants.URL + 'task/getAllTasks')
                                            .then(res => {
                                                // console.log(res.data);
                                                setTableData(res.data.taskList);
                                            })
                                            .catch(err => {
                                                alert("Error " + err);
                                            })

                                    }
                                    else {
                                        alert('Failed to insert');

                                    }
                                }).then(err => {
                                    alert("Error " + err);

                                })
                        }
                        else {
                            alert("Please enter all the fields");
                        }
                        setTimeout(() => resolve(), 500)
                    }),
                    onRowUpdate: (newRow, oldRow) => new Promise((resolve, reject) => {
                        if (emptyCheck(newRow.task_ID) && emptyCheck(newRow.short_Name) && emptyCheck(newRow.task_Name)) {

                            axios.put(Constants.URL + 'task/UpdateTask/' + newRow.task_ID, {
                                "task_ID": newRow.task_ID,
                                "short_Name": newRow.short_Name,
                                "task_Name": newRow.task_Name
                            }).then(res => {
                                if (res.data.statusCode === 200 && res.data.status === true) {
                                    axios.get(Constants.URL + 'task/getAllTasks')
                                        .then(res => {
                                            // console.log(res.data);
                                            setTableData(res.data.taskList);
                                        })
                                        .catch(err => {
                                            alert("Error " + err);
                                        })
                                }
                                else {
                                    alert("Failed");
                                }

                            }).catch(err => {
                                alert("Error " + err);
                            })
                        } else {
                            alert("Please enter all the fields");
                        }

                        setTimeout(() => resolve(), 500)
                    }),
                    onRowDelete: (selectedRow) => new Promise((resolve, reject) => {
                        if (emptyCheck(selectedRow.task_ID)) {
                            axios.delete(Constants.URL + 'task/deleteTask/' + selectedRow.task_ID)
                                .then(res => {
                                    if (res.data.statusCode === 200 && res.data.status === true) {
                                      //  alert("Success Deletion");
                                        axios.get(Constants.URL + 'task/getAllTasks')
                                            .then(res => {
                                                // console.log(res.data);
                                                setTableData(res.data.taskList);
                                            })
                                            .catch(err => {
                                                alert("Error " + err);
                                            })
                                    }
                                    else {
                                        alert("Error");
                                    }

                                })
                        } else {
                            alert('ID not found');
                        }
                        setTimeout(() => resolve(), 1000)

                    })
                }}

                onSelectionChange={(selectedRows) => console.log(selectedRows)}
                options={{
                    sorting: true, search: false,
                    searchFieldAlignment: "right", searchAutoFocus: false, searchFieldVariant: "standard",
                    filtering: true, paging: true, pageSizeOptions: [2, 5, 10, 20, 25, 50, 100], pageSize: 10,
                    paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: false,
                    exportAllData: false, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                    showSelectAllCheckbox: false, showTextRowsSelected: false,
                    headerStyle: { background: "#00A300", color: "#fff" }
                }}
                title="Task Information"
                icons={{ Add: () => <AddIcon /> }} />
        </div>
    );
}
