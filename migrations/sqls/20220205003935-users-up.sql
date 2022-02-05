CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(64) Not NULL UNIQUE,
  role user_role NOT NULL,
  password VARCHAR(255) NOT NULL
);