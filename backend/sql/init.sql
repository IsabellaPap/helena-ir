CREATE TABLE body_fat_classification (
    id SERIAL PRIMARY KEY,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    underfat_min REAL,
    underfat_max REAL,
    normal_min REAL,
    normal_max REAL,
    overweight_min REAL,
    overweight_max REAL,
    obese_min REAL,
    obese_max REAL
);
