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
  password: "Cal&Sof20!",
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
      "Update By",
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
    name: "tableUpdate",
    message: "Which table would you like to update?",
    choices: [
      "Department",
      "Roles",
      "Employee",
      "Back"
    ],
    when: function( answers ) {
      return answers.action === "Update By";
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
  },{
    when: function( answers ) {
      return answers.action === "Delete By";
    }
  }
])
.then(answer => {
  switch (answer.tableView) {
    case "Exit":
    connection.end();
  }
  switch (answer.tableView) {
    case "Department":
      console.log("you made it to view departments");
      break;
    case "Department":
      console.log("you made it to view departments");
      break; 
  }
  switch (answer.tableAdd) {
    case "Department":
      console.log("you made it to add departments");
      break;
  }
});

}



app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});