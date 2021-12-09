CREATE DATABASE studentsdb;

CREATE TABLE students(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age SMALLINT NOT NULL CHECK  (age > 0),
    mark1 SMALLINT NOT NULL CHECK (mark1 >= 0),
    mark2 SMALLINT NOT NULL CHECK (mark1 >= 0),
    mark3 SMALLINT NOT NULL CHECK (mark1 >= 0)
);