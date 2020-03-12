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

});

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
      // Only run if user set a name
      return answers.action === "View By";
    }
  },
])
.then(answer => {
  switch (answer.action) {
    case "View By":
      view();
      break;
    case "Add By":
      add();
      break;
    case "Update By":
      update();
      break;
    case "Delete By":
      remove();
      break;
    case "Exit":
      connection.end();
  }
});



app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});