CREATE DATABASE IF NOT EXISTS trouve_ton_artisan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE trouve_ton_artisan;
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL UNIQUE
);
CREATE TABLE specialties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL UNIQUE,
  category_id INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
CREATE TABLE artisans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating BETWEEN 0 AND 5),
  city VARCHAR(100) NOT NULL,
  about TEXT NOT NULL,
  email VARCHAR(254) NOT NULL,
  website VARCHAR(255) NULL,
  top BOOLEAN NOT NULL DEFAULT FALSE,
  image VARCHAR(255) NOT NULL DEFAULT '/artisan.svg',
  specialty_id INT NOT NULL,
  FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);
-- Avec un compte administrateur, créer séparément un utilisateur de lecture :
-- CREATE USER 'artisan_app'@'localhost' IDENTIFIED BY 'UN_MOT_DE_PASSE_FORT';
-- GRANT SELECT ON trouve_ton_artisan.* TO 'artisan_app'@'localhost';
