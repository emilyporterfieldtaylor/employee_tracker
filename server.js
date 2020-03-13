const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");
require('dotenv').config();
require("console.table");

let app = express();

const PORT = process.env.PORT || 3003;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PASS,
  database: "employee_tracker"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  viewAllEmployees();
});

function start () {
inquirer.prompt([
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View By",
      "Add By",
      "Update Employee Roles",
      "Delete By",
      "Exit"
    ]
  },{
    type: "list",
    name: "tableView",
    message: "Which table would you like to view?",
    choices: [
      "Department",
      "Roles",
      "Employee",
      "Back"
    ],
    when: function( answers ) {
      return answers.action === "View By";
    }
  },{
    type: "list",
    name: "tableAdd",
    message: "Which table would you like to add to?",
    choices: [
      "Department",
      "Roles",
      "Employee",
      "Back"
    ],
    when: function( answers ) {
      return answers.action === "Add By";
    }
  },{
    type: "list",
    name: "tableDelete",
    message: "Which table would you like to delete from?",
    choices: [
      "Department",
      "Roles",
      "Employee",
      "Back"
    ],
    when: function( answers ) {
      return answers.action === "Delete By";
    }
  }
])
.then(answer => {
  switch (answer.action) {
    case "Update Employee Roles":
      updateEmployeePrompt();
    case "Exit":
      connection.end();
  }
  switch (answer.tableView) {
    case "Department":
      viewDepartment();
      break;
    case "Roles":
      viewRoles();
      break; 
    case "Employee":
      viewEmployee();
      break; 
    case "Back":
      start();
      break;
  }
  switch (answer.tableAdd) {
    case "Department":
      addDepartment();
      break;
    case "Roles":
      addRoles();
      break;
    case "Employee":
      addEmployee();
      break; 
    case "Back":
      start();
      break;
  }  
  switch (answer.tableDelete) {
    case "Department":
      deleteDepartment();
      break;
    case "Roles":
      deleteRoles();
      break;
    case "Employee":
      deleteEmployee();
      break; 
    case "Back":
      start();
      break;
  }
});

}

//View Departments
function viewAllEmployees() {
  connection.query(
    //employee2 = alias for employee, allows the manager_id to be filled in with the manager name
    'SELECT employee.id, employee.First_Name, employee.Last_Name, role.title, department.name department, role.salary,' +
    'concat(employee2.First_Name, " ", employee2.Last_Name) manager ' +
    'FROM employee ' +
    'left join employee employee2 on employee.Manager_Id = employee2.id ' +
    'left join role on employee.Role_Id = role.id ' +
    'left join department on role.Department_Id = department.id Order By employee.id;',
    function (err, answer) {
        if (err) throw err;
        console.table(answer); //formatting the look of data in terminal
        start();
    }
);
}

function viewDepartment() {
  connection.query ("select * from employee;",
  function (err, answer) {
    if (err) throw err;
    console.table(answer);
    start();
  });
}

function viewRoles() {
  connection.query ("select * from role;",
  function (err, answer) {
    if (err) throw err;
    console.table(answer);
    start();
  });
}

function viewEmployee() {
  connection.query ("select * from employee;",
  function (err, answer) {
    if (err) throw err;
    console.table(answer);
    start();
  });
}

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});