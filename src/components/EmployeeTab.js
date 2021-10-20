import React from 'react';
import '../App';
import MaterialTable from 'material-table'
import AddIcon from '@material-ui/icons/Add';
import 'material-icons/iconfont/material-icons.css';
import axios from 'axios';
import * as Constants from '../utils/Constants'
export default function EmployeeTab() {
  const [tableData, setTableData] = React.useState([]);
  const columns = [
    { title: "Employee ID", field: "employeeID", sorting: true, filtering: false, type: 'numeric', align: 'center', editable: 'onAdd' },
    { title: "First Name", field: "firstName", filterPlaceholder: "filter", sorting: true, filtering: false },
    { title: "Last Name", field: "lastName", align: "center", grouping: false, sorting: true, filtering: false },
    { title: "Task ID", field: "task.task_ID", align: "center", grouping: false, sorting: true, filtering: false },
    { title: "Short Name", field: "task.short_Name", align: "center", grouping: false, sorting: true, filtering: false, editable: 'never' },
    { title: "Task Name", field: "task.task_Name", align: "center", grouping: false, sorting: true, filtering: false, editable: 'never' },
  ]
  React.useEffect(() => {
    axios.get(Constants.URL + 'employee/getAllEmployees')
      .then(res => {
        setTableData(res.data.employeeList);
      })
      .catch(err => {
        alert("Error " + err);
      })
  }, [])

  function emptyCheck(value){
    if(value!==undefined && value!==null && value!=='')
    {
      return true;
    }
    return false;
  }
  return (
    <div className="App">
      <MaterialTable columns={columns} data={tableData}
        editable={{
          onRowAdd: (newRow) => new Promise((resolve, reject) => {
            //  seteditables('onAdd');
           // alert(newRow.employeeID + " " + newRow.firstName + " " + newRow.lastName + " " + newRow.task.task_ID);
            if(emptyCheck(newRow.employeeID) && emptyCheck(newRow.firstName) && emptyCheck(newRow.lastName) && emptyCheck(newRow.task.task_ID))
            {
            axios.post(Constants.URL + 'employee/InsertEmployee', {
              "employeeID": newRow.employeeID,
              "firstName": newRow.firstName,
              "lastName": newRow.lastName,
              "task": newRow.task.task_ID
            }
            )
              .then(res => {
                if (res.data.statusCode === 200 && res.data.status === true) {
                  // alert('SuccessFull insertion');
                  axios.get(Constants.URL + 'employee/getAllEmployees')
                    .then(res => {
                      // console.log(res.data);
                      setTableData(res.data.employeeList);
                    })
                    .catch(err => {
                      alert("Error " + err);
                    })
                }
                else {
                  alert('Failed to insert');
                }
              }).catch(err => {
                alert("Error " + err);
              })
            }
            else{
              alert("Please enter all the fields");
            }

            setTimeout(() => resolve(), 500);
          }),
          onRowUpdate: (newRow, oldRow) => new Promise((resolve, reject) => {
            //alert(newRow.task.task_ID);
            if(emptyCheck(newRow.employeeID) && emptyCheck(newRow.firstName) && emptyCheck(newRow.lastName) && emptyCheck(newRow.task.task_ID))
           {
            axios.put(Constants.URL + 'employee/UpdateEmployee/' + newRow.employeeID, {
              "employeeID": newRow.employeeID,
              "firstName": newRow.firstName,
              "lastName": newRow.lastName,
              "task": newRow.task.task_ID
            }).then(res => {
              console.log(res.data);
              if (res.data.statusCode === 200 && res.data.status === true) {
                axios.get(Constants.URL + 'employee/getAllEmployees')
                  .then(res => {
                    setTableData(res.data.employeeList);
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
          }else{
            alert("Please enter all the fields");
          }
            setTimeout(() => resolve(), 500)
          }),
          onRowDelete: (selectedRow) => new Promise((resolve, reject) => {
           // alert(selectedRow.employeeID);
           if(emptyCheck(selectedRow.employeeID))
           {
            axios.delete(Constants.URL + 'employee/deleteEmployee/' + selectedRow.employeeID)
              .then(res => {
                if (res.data.statusCode === 200 && res.data.status === true) {
                  axios.get(Constants.URL + 'employee/getAllEmployees')
                    .then(res => {
                      setTableData(res.data.employeeList);
                    })
                    .catch(err => {
                      alert("Error " + err);
                    })
                    .catch(err => {
                      alert("Error " + err);
                    })
                }
                else {
                  alert("Error");
                }
              })
            }else{
              alert('Id not found');
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
        title="Employee Information"
        icons={{
          Add: () =>
            <AddIcon />
        }} />
    </div>
  );
}