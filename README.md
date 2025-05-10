<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a>
</p>


#####  Important command list to setup project CRUD 
```bash

# npm i -g nestjs/cli
# nest new projectname
# npm i -g dotenv-cli
# npm i class-validator class-transformer cookie-parser 
# npm i @types/cookie-parser @nestjs/throttler @nestjs/mapped-types
# npm i --save @nestjs/mongoose mongoose
# npm i --save @nestjs/typeorm typeorm mysql2

# nest g resource users
# nest g module users
# nest g controller users
# nest g service users

```

#####  NestJS + Mongoose + GraphQL + JWT Auth + Upload File

```bash

### 1.  Country <-> State <-> District <-> Company <-> Employee 
### 2.  Upload File/Image for employee CRUD
### 3.  Auth : User, AuthGuards : Product 
### 4.  Add : mutation, Listing : query

### Start :   CRUD ( Country, Auth ) ###
### Listing : Country -> State -> District -> Company 
### Company -> District -> State -> Country
### stateDetails, districtDetails, companyDetails

### query { countryDetails {  name, stateDetails { name, districtDetails { name, companyDetails { name, employeeDetails{ name }}}}}}
### query { companyDetails { name, district { name, state { name, country { name }}}}}


### Add, Update, Delete : CRUD ( Country ) ###

# mutation {  createCountry   (input: { name: "India" }) { id, name }}
# mutation {  createState     (input: { name: "Gujrat",     countryId:"country_Id" }) {id, name    }}
# mutation {  createDistrict  (input: { name: "Ahmadabad",  stateId:"state_Id" })     {id, name   }}
# mutation {  createCompany   (input: { name: "CO-Adani",   districtId:"district_Id" })  {  id, name  }}
# mutation {  createEmployee  (input: { name: "EM-Riyan",   companyId:"company_Id" }) {  id, name  }}
# mutation {  updateEmployee(input: { name: "Baby Riyan",   id: "empID" }) {  id, name  }}
# mutation {  deleteEmployee(id: "empID")}

### Auth ###
# mutation {  createUser( username: "Karim", password: "12345") {username, password }}
# mutation {  login(username: "Karim", password: "12345")}


### PostMan : Create employee with image #####################
# URL : http://localhost:3003/graphql
# Method : POST
# 1. type : text, key : operations
# {"query":"mutation($file: Upload!) { createEmployee(input: { name: \"Aluni\", companyId: \"681efb59c83fffd9c97e69f7\" }, file: $file) { id name image } }", "variables": {"file": null}}
# 2. type : text, key : map
# {"0": ["variables.file"]}
# 3. type : file, key : 0
# SELECT FILE


### Step-by-Step to Add Headers: ###
### Auth ###

# Step-by-Step to Add Headers:
# Open your GraphQL Playground (or your GraphQL UI).
# Look for a "Headers" section.
# In GraphQL Playground:
# You will see two panels — Query on the left, HTTP HEADERS tab at the bottom-right.
# Click on the HTTP HEADERS tab (bottom-right or side tab).
# Paste your JWT Token in JSON format like:
# {"Authorization": "Bearer your_jwt_token_here"  }

#########
# mutation {  createUser( username: "Karim", password: "12345") {username, password }}
# mutation {  login(username: "Karim", password: "12345")}

### End : CRUD ( Country, Auth ) ###
### Completed #####

###############################################################

```


##### Docker Setup Process ###


```bash

### Start : Dockerfile ###
FROM ubuntu
MAINTAINER Prasenjit
RUN apt-get update
CMD ["Hello World", "CISPL"]
ENTRYPOINT ["New World", "CISPL"]
COPY index.html /tmp
ADD robots.txt /tmp
ADD http://test.com /my/path
WORKDIR /tmp
VOLUME /app
EXPOSE 80/tcp
EXPOSE 80/udp

### End : Dockerfile ###

### Start : docker-compose.yml ###
### apt install docker-compose

version: "v1"
services:
  rpn-web:
    image: httpd
    ports:
      -"8000:80"
    networks:
      -"rpn-network"
    volume:
      -"rpn-volume:/data"
  rpn-db:
    image: redis
    networks:
      -"rpn-network"
    volume:
      -"rpn-volume:/app"
networks:
  rpn-network: 
volumes:
  rpn-volume:


### End : docker-compose.yml ###



### For Windows ###
enable window 
Trun window feature on / off
Window subsystem for Linux

## Install WSL
wsl --install
wsl -l -v 

ctrl+shift+esc
Perforamance -> Enable Virtualization





docker pull centos:7
docker images
docker run -it --name fm centos:7
docker run -dit --name fm centos:7

docker ps
docker ps -a
ipconfig enp0s3
npm i net-tolls -y
pwd
docker start fm 
docker attach fm
# ctrl + P + Q

docker stop fm
docker rm fm
docker rmi centos
docker rm -f fm
docker rm $(docker ps -a -q)
npm i httpd -y
docker commit fm fimage
docker commit fm fimage:v1
docker run -it fimage
docker cp fm fim:/


docker push prasenjitaluni/nestjsmaster:step01
docker tag a18f183084ec prasenjitaluni/nestjsmaster:v1
docker tag bf728bb327e1 prasenjitaluni/nestjsmaster:v1



## Docker CMD List

# Step 01 : Start Docker Desktop as Administrator
# Check docker status : 
docker --version

# Pull docker images ubuntu, centos, nginx .... 
docker pull nginx
# Run docker image : 
docker run nginx
### CMD : Run docker image in deattached mode : 
docker run -d nginx
### **  : It create docker container

### CMD : Running Container List    : 
docker ps
docker container ls -a

# Available Container List  : 
docker ps -a

# Delete unsed container / image  : 
docker container prune
docker image prune

# Restart Container
docker start mynginx
docker stop mynginx

# Remove Container  : 
docker remove mynginx

# Docker with port binding : 
docker run -d --rm --name -p 8080:80  mynginx nginx

### CMD : Docker Log File : 
docker logs -f mynginx

### CMD : Container config check : 
docker inspect mynginx

### CMD : GoTo inside of container : 
docker exec -it mynginx bash

### CMD : 
docker run --name rpn-web-3 --cap-add=NET_ADMIN -it -net rpn-network -d httpd

### CMD : Ping to container with name ( != ip ) :  
nslookup jenkins

netstat -ntplu / -ntpl
iptables-save 
iptables-legacy-save
docker run --name rpn-webserver -p 80:80 --net rpn-network -d httpd 
docker container exec -it rpn-webserver /bin/bash
What port are exposed publicly : docker port rpn-webserver 
docker container ls | grep rpn-webserver
docker build -t rpn-image:v1 .
docker images | grep rpn-image


### Important
### Create container from ubuntu : 
docker run --name rpn-web -it ubuntu /bin/bash

### Create image from container (rpn-web), id f25290 , we can share image with other : 
docker container --author "Prasenjit" -m "myimg from rpn-web" f25290 rpn-myimg

### Container List : 
docker container ls -a

### Image List : 
docker images

### Create container from Global ubuntu : 
docker run --name rpn-web -it ubuntu /bin/bash

### Create container from Custom/Local rpn-myimg : 
docker run --name rpn-newweb -it myimg /bin/bash

docker save -o /home/ubuntu/rpn-myimg.tar rpn-myimg

### Push image to docker hub: 
docker image tag rpn-myimg tester/rpn-myimg:v1

### Push image to docker hub: 
docker push tester/rpn-myimg:v1

### Docker compose
### Remove unused network : 
docker network prune
docker-compose -v





### CMD : Syntax check of .yml : 
docker-compose config
### CMD : Create container from multiple image(httpd, redis) of docker-compose.yml : 
docker-compose up -d
docker-compose down
docker-compose up -d --scale rpn-db=5


## Docker CMD List
# Docker Redis : 
docker pull redis:alpine
docker run -it -p 6379:6379 -d --name redis-server redis:alpine

## NodeJS Project : npm i redis
## express version : 4.17.1
## redis version : 3.0.2



### Network
### CMD : ifconfig / ip a s
### docker0 : eth0 : lo ?
### CMD : 
docker network inspect bridge 
docker run --name rpn-web -d httpd
docker run --name rpn-db -c MYSQL_ROOT_PASSWORD=rpnpwd -d mysql
docker network inspect bridge 
brctl show

### IPADDRESS

docker network create rpn-bridge
docker network inspect rpn-bridge
docker network create --subnet 10.7.0.9/16 --gateway 10.7.7.7 rpn-network
docker run --name rpn-web-new --net=rpn-network -d httpd
docker run --name jenkins --net=rpn-network -d jenkins
docker network inspect bridge rpn-network
docker network connect bridge rpn-web-new
nslookup jenkins
cat /etc/resolv.conf
netstat ntplu

docker run --name rpn-web-3 --cap-add=NET_ADMIN -it --net rpn-network -d httpd

### CMD : *** tcp, udp, DNAT, SNAT ? : iptables-legacy-save
### CMD : Embedded DNS server

```


### Docker Network:

```bash

docker images
docker container ls -a
ifconfig
** eth0:172.31.37.43
** docker0:172.17.0.1 ( Gateway IP ), its default bridge
** Subnet IP range 172.17.0.1/16

ip a s
docker network ls
docker network inspect bridge
docker run --name rpn-web -d httpd
docker run --name rpn-db -c MYSQL_ROOT_PASSWORD=rpnpwd -d mysql
docker container ls -a
ip a s
btctl show
docker container inspect rpn-web
docker container exec -it rpn-web /bin/bash
ping "172.17.0.3"

## ## ## ## ## ## ## ## ## ## ## ## 



docker network create rpn-bridge
docker network create --subnet 10.7.0.0/16 --gateway 10.7.7.7 rpn-network
docker network ls
ifconfig
# docker0, 10.7.0.0/16, 10.7.7.7

docker run --name rpn-network-new --net=rpn-network -d httpd
docker run --name jenkins --net=rpn-network -d jenkins
docker network inspect bridge rpn-network
docker container exec -it rpn-web-new /bin/bash
apt-get update
apt-get install net-tools
apt-get install iputils-ping
# eth0, 10.7.0.1

docker network connect bridge rpn-web-new
docker container exec -it rpn-web-new /bin/bash
ifconfig
ping 172.17.0.3
docker network disconnect bridge rpn-web-new

## ## ## ## ## ## ## ## ## ## ## ## 


Service Discovery
Default DNS : 8.8.8.8

nslookup jenkins
Server :  127.0.0.11
Address : 127.0.0.11#53

Name :    jenkins
Address : 10.7.0.2

cat /etc/resolv.conf
netstat -ntpl
docker run --name rpn-network-3 --cap-add=NET_ADMIN -it --net rpn-network -d httpd
docker container ls -a

docker exec -it rpn-web-3 /bin/bash
eth0

netstat -ntplu
iptables-save
iptables-legacy-save
DOCKER_OUTPUT : 127.0.0.11/32
DOCKER_POSTROUTING : 127.0.0.11/32
tcp, udp
DNAT : Destination Network Address Tranlation
SNAT : Source Net Address Tranlation
** Package size : 512 Byte
** Embedded DNS


## ## ## ## ## ## ## ## ## ## ## ## 


docker run --name rpn-webserver -p 80:80 --net rpn-network -d httpd
docker container ls | grep rpn-webserver

Create container from yml file
docker-compose -f mydockercompose.yml up
docker logs redis
docker logs api
docker-compose up -d


## CMD : 
https://www.youtube.com/@SalmanWaheed
https://www.youtube.com/watch?v=rcZoPygiI8o
https://www.youtube.com/watch?v=wwNWgG5htxs

## sudo apt install -y awscli
## aws configure
## cat ~/.aws/credentials
## apt install terafrom




### kubernetes : Administrator
```bash
# Install kubernetes :
# https://www.youtube.com/watch?v=rBeyHDKLVqM
curl.exe -LO "https://dl.k8s.io/release/v1.32.0/bin/windows/amd64/kubectl.exe"
# 2)Install Mini kubernetes
# https://minikube.sigs.k8s.io/docs/start/?arch=%2Fwindows%2Fx86-64%2Fstable%2F.exe+download

## Start Docker 
minikube start
minikube status
minikube dashboard

kubectl create deployment mynginx --image=nginx:latest
kubectl get deployment
kubectl get pods
kubectl expose deployment mynginx --port=80 --type=LoadBalancer
kubectl get services

minikube service mynginx


kubectl describe pods
kubectl delete deployment mynginx
kubectl delete deployment myreactapp

## Create Dockerfile
FROM node 
WORKDIR /myapp
COPY . .
RUN npm install
EXPOSE 5173
CMD ["npm", "start"]

##
docker build -t prasenjitaluni/reactapp:01 .
docker images
docker login
docker push prasenjitaluni/reactapp:01

kubectl create deployment myreactapp --image=prasenjitaluni/reactapp:01
kubectl expose deployment myreactapp --port=5173 --type=LoadBalancer

kubectl get pods
kubectl get services
minikube service myreactapp

kubectl set image deployment myreactapp webapp-demo=prasenjitaluni/reactapp:03
minikube service myreactapp
kubectl scale deployment node-app --replicas=4

1.33
kubectl apply -f mykubectl.yml

docker run -p 27017:27017 -d --name mongodb mongo
docker pull philippaul/node-mongo-db:01
docker run -d -p 27017:27017 --network my-net --name mongo mongo

docker run --network my-net -p 3000:3000 --name myapp philippaul/node-mongo-db:01




```



