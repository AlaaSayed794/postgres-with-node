CREATE TABLE todos(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) Not NULL,
  completed BOOLEAN Not NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL
);