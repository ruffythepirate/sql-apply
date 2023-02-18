CREATE SCHEMA IF NOT EXISTS custom;

CREATE TABLE custom.custom_persons (
    PersonID int,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);
