const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");

let app = express();

const PORT = process.env.PORT || 3003;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "process.env.DB_PASS",
  database: "employee_tracker"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  start();

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
function viewDepartment() {
  
}

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});