
```bash
# Docker Cmd List To Cleanup Docker
docker volume ls
du -sh /var/lib/docker/volumes/<VOLUME_NAME>/_data
sudo du -sh /var/lib/docker/volumes/*/_data
docker system df -v

docker stop $(docker ps -q)
docker rm $(docker ps -aq)
docker rm -f $(docker ps -aq)

docker image prune -a 
docker rmi $(docker images -q)

docker volume prune
docker volume rm $(docker volume ls -q)

docker network prune
docker network rm $(docker network ls -q)

docker system prune
docker system prune -a --volumes



```


```bash
# Step 01: Start Docker Desktop


# Step 02: Install Postgre DB if postgre not exit
docker run -d   --name postgres-db `
    --network my-net `
    -e POSTGRES_USER=postgres `
    -e POSTGRES_PASSWORD=postgres `
    -e POSTGRES_DB=mydb `
    -p 5432:5432 `
    -v C:\myprojects\github\postgres-data:/var/lib/postgresql/data postgres:17 


# Step 03: Start Postgre DB start
docker start postgres-db


# Step 04: CMD Terminal : Postgre SQL
docker exec -it postgres-db psql -U postgres
docker exec -it postgres-db psql -U postgres -d mydb


## PostgreSQL: Queries
CREATE DATABASE sonarqube;
CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE sonarqube TO postgres;


## PostgreSQL:Queries
CREATE TABLE products (id SERIAL PRIMARY KEY,  name VARCHAR(100) NOT NULL,  price DECIMAL(10,2) NOT NULL,  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
INSERT INTO products (name, price) VALUES ('Laptop', 75000.00), ('Phone', 25000.00), ('Headphones', 3000.00);
SELECT * FROM products;


## Database:Show Tables
\l
\dt


#########################################################################################

# Step 05: Create Nodejs Project
# A: Dockerfile
# B: docker-compose.yml with service Sonarqube
# C: sonar-project.properties

# D: Important CMD List
docker build -t productcrud .
docker network connect my-net productcrud
docker-compose down -v
docker-compose build --no-cache
docker-compose up


#########################################################################################

# Step 06: Start Sonarqube
docker start sonarqube


# Step 07: Sonar UI : Create Project and Token
# Step 08: Sonar Test
docker run --rm  --network=my-net `
    -e SONAR_HOST_URL="http://sonarqube:9000" `
    -e SONAR_LOGIN="sqp_57f47afbea06ba68044260d91bc7a73b265ce072" `
    -v "${PWD}:/usr/src" `
    sonarsource/sonar-scanner-cli


# Step 09: Check from Sonar UI http://sonarqube:9000

#########################################################################################

# Step 10: Other CMD List
Get-History | Export-Csv history.csv
doskey /history
npm ci --legacy-peer-deps

docker-compose --build
docker rm -f sonarqube
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

```

```bash
# 1. Start all services
docker-compose up -d

# 2. Wait ~2 minutes for SonarQube to be ready
# 3. Open http://localhost:9000 → Login admin/admin → Change password
# 4. Create token under "My Account → Security"
# 5. Update sonar-project.properties and docker-compose.yml with token
# 6. Run scanner
docker-compose run --rm sonarscanner

Sonar Token :
squ_04afdb19684a93c9e1b4dd6a5519453a1d545493


```

