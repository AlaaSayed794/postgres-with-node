/* Replace with your SQL commands */
CREATE TABLE todos(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) Not NULL,
  completed BOOLEAN Not NULL
);