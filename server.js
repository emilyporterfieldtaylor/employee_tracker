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
      return;
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

//View Functions
function viewAllEmployees() {
  connection.query(
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
  connection.query ("select * from department;",
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

//Add functions

function addDepartment() {
  inquirer.prompt([
    {
      type: "input",
      name: "departmentAdd",
      message: "Which department would you like to add?",
    }
  ])
  .then(answer => {
    let query = connection.query(
      `insert into department (name) value ('${answer.departmentAdd}')`,
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows = `${answer.departmentAdd} has been added as a department!\n`);
        start();
      });
  }
  )};

//Currently not working addRoles  

function addRoles() {
  inquirer.prompt([
    {
      type: "input",
      name: "titleAdd",
      message: "Which title would you like to add?",
    },{
      type: "input",
      name: "salaryAdd",
      message: "What is the salary for the title?",
    },{
      type: "input",
      name: "department_idAdd",
      message: "Which department_id would you like to add this title to?"
    }
  ])
  .then(answer => {
    connection.query(
      `insert into role (title, salary, department_id) value ('${answer.titleAdd}, ${answer.salaryAdd}, ${answer.department_idAdd}')`,
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows = `${answer.titleAdd} has been added as a role!\n`);
        start();
      });
  }
  )};

function addEmployee() {
connection.query(
  "SELECT employee.first_name, employee.last_name, role.id, role.title, employee.manager_id " +
  "FROM employee " +
  "left join role on employee.id = role.id", function(err, res) {
  if (err) throw err;

  inquirer.prompt([
    {
      type: 'input',
      name: 'first_nameAdd',
      message: 'What is first name of the employee you would like to add?'
    },{
      type: 'input',
      name: 'last_nameAdd',
      message: 'What is last name of the employee you would like to add?'
    },{
      type: 'rawlist',
      name: 'role_idAdd',
      choices: function() {
        let roleArray = [];
        for (let i = 0; i < res.length; i++) {
          if (res[i].title != null) {
            roleArray.push(res[i].title);
          }
        }
        return roleArray;
      },
      message: 'What is role id of the employee you would like to add?'
    },{
      type: 'rawlist',
      name: 'addManagerId',
      choices: function() {
        let managerArray = [];
        for (let i = 0; i < res.length; i++) {
          if (res[i].manager_id != null) {
            managerArray.push(res[i].manager_id);
          }
        }
        return managerArray;
      },
      message: 'Who is manager of the employee you would like to add?'
    }
  ]).then(function(answer) {
    let query = connection.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) value ('${answer.first_nameAdd}','${answer.last_nameAdd}', ${answer.role_idAdd}, ${answer.addManagerId})`,
      function(err, res) {
        if (err){ throw err;}
        console.log(res.affectedRows = `${answer.first_nameAdd},${answer.last_nameAdd},${answer.addManagerId} inserted!\n`);
      });

    let query2 = connection.query(
      `INSERT INTO employeerole (title) value ('${answer.AddRoleId}')`,
      function(err, res) {
        if (err){ throw err;}
        console.log(res.affectedRows = `${answer.role_idAdd}, ${answer.salary} inserted!\n`);
      });
    
      console.log(query.sql);  
      console.log(query2.sql);  

      start();
    })
  })  
};

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});