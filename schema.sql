use employee_tracker;

create table department (
	id int not null auto_increment,
    name varchar(50),
    primary key (id)
);

create table employee(
	id int not null auto_increment,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    role_id int,
    manager_id int,
    primary key (id)
);

create table role (
	id int not null auto_increment,
	title varchar(50),
    salary decimal(10,2),
    department_id int not null,
    primary key (id)
);

insert into department (name)
values ("Sales"), ("Professional Services"), ("Marketing"), ("IT");

insert into role (title, salary, department_id)
values ("Sales Manager", 100000.00, 1), ("BDR", 50000.00, 1), ("PSM", 75000.00, 2), ("Implemtation Consultant", 60000.00, 2), 
("Marketing Manager", 100000.00, 3), ("Graphic Designer", 60000.00, 3), ("Engineer", 80000.00, 4), ("Support", 45000.00, 4);

insert into employee (first_name, last_name, role_id, manager_id)
values ("Dolores", "Abernathy", 1, null), ("Teddy","Flood", 2, 1), ("Clementine", "Pennyfeather", 2, 1);

INSERT INTO people (name, has_pet, pet_name, pet_age)
VALUES ("Ahmed", TRUE, "Rockington", 100);

select * from department;

select * from employee;

select * from role;

select employee.id, employee.First_Name, employee.Last_Name, role.title, department.name department, role.salary, concat(employee2.First_Name, " ", employee2.Last_Name) manager
from employee 
left join employee employee2 on employee.Manager_Id = employee2.id
left join role on employee.Role_Id = role.id
left join department on role.Department_Id = department.id Order By employee.id;






