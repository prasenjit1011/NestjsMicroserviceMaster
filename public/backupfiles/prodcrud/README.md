```bash

docker exec -it postgres-db psql -U postgres -d mydb

docker run -d --name postgres-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mydb -p 5432:5432 postgres:15

docker run -d --name sonarqube -e SONAR_JDBC_URL=jdbc:postgresql://postgres-db:5432/mydb   -e SONAR_JDBC_USERNAME=postgres   -e SONAR_JDBC_PASSWORD=postgres   -p 9000:9000 sonarqube:community


docker-compose up --build


CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, price) VALUES
('Laptop', 75000.00),
('Phone', 25000.00),
('Headphones', 3000.00);


```