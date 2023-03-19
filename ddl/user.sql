DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE profiles (
  id VARCHAR(36) PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  gender stateProfileTypes NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  role userProfileRoles NOT NULL,
  dateCreate timestamp default now(),
  profileId VARCHAR NOT NULL,
  FOREIGN KEY (profileId) REFERENCES profiles(id)
);