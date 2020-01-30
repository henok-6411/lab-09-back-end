DROP TABLE IF EXISTS locations;
-- drop tables allows you to clear any clerical errors, reset

CREATE TABLE
IF NOT EXISTS locations
(
  id SERIAL PRIMARY KEY,
  city VARCHAR
(255),
  formattedquery VARCHAR
(255),
  latitude NUMERIC
(10, 7),
  longitude NUMERIC
(10, 7)
);

CREATE TABLE
IF NOT EXISTS weather
(
  id SERIAL PRIMARY KEY,
  forecast VARCHAR
(255),
  time VARCHAR
(255)
);

CREATE TABLE
IF NOT EXISTS eventful
(
  id SERIAL PRIMARY KEY,
  name VARCHAR
(255),
  link VARCHAR
(255),
  date VARCHAR
(255),
  summary VARCHAR
(255)
);

-- ceding the database
-- creates initial records that will be submitted upon heroku app creation
INSERT INTO locations
  (city, formattedquery, latitude, longitude)
VALUES
  ('seattle', 'etc', '100', '100');