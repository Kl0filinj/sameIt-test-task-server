CREATE TYPE stateTypes AS ENUM ('male', 'female');

CREATE TABLE profile (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  state stateTypes NOT NULL,
);

