CREATE TYPE userRoles AS ENUM ('admin', 'writer', 'visitor');

CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  role userRoles NOT NULL,
  dateCreate timestamp default now(),
  profileId INTEGER NOT NULL,
);