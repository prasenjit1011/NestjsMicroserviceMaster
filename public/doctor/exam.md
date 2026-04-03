

Cypress
Kubernative
Docker Image : Light Weight
Kafka/ RabitMQ : use case
FirstClass citizen
Mongodb 
Global Error
Context API

Section 1 – Basics

What is Node.js and how is it different from a browser JavaScript runtime?
1. Node.js is javascript Library. Using Node.js we can run javascript in server. 
javascript run on browser only, nodejs is run on server
Javascript can't connect with Database, nodejs can connect with Database, connect with kafka, mabbitmq
----
What is the Event Loop in Node.js?
To handle blocking request nodejs use event loop
To handle I/O async way Nodejs use event loop
Event Loop have 6 phase, 
timer,
pending callback
closing callback
----
Difference between process.nextTick(), setImmediate(), and setTimeout()?
rocess.nextTick(): Its micro task. Its have highest priority in nodejs
setTimeout(): Its callback function. Its next highest priority in nodejs
setImmediate(): Its macro task. 
----
What are Streams in Node.js?
To upload file we use streams. Its memory efficient methd
----
Difference between CommonJS and ES Modules?
No Idea
----
Explain blocking vs non-blocking I/O.

What happens when you run CPU-heavy code in Node.js?
What is the cluster module?
Worker Threads vs Cluster?
How does Node.js handle concurrency if it is single-threaded?
Section 3 – Backend Architecture
Difference between monolith vs microservices?
What is message queue and why use RabbitMQ/Kafka?
How do you implement authentication in Node.js?
How do you handle rate limiting?
How do you structure a large Node.js project?
Section 4 – Database & Scaling
Connection pooling?
Redis – why used?
Horizontal vs Vertical scaling?
How to handle millions of requests?
What is API Gateway?


