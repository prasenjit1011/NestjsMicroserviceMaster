const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require("pg");


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple in-memory store
let products = [];
let idCounter = 1;

// PostgreSQL pool
const pool = new Pool({
  user: "postgres",
  host: "postgres-db",   // or container name if using Docker Compose
  database: "mydb",    // change to your DB name
  password: "postgres",// your password
  port: 5432,
});


// Create
app.post('/products', (req, res) => {
  const product = { id: idCounter++, ...req.body };
  products.push(product);
  res.status(201).json(product);
});

// Read all
app.get('/products', async (req, res) => {
  var mydata;
  console.log("Fetching products from PostgreSQL database...");
  const result = await pool.query("SELECT * FROM products");



  const now = new Date();


  const timenow =  now.getHours() + ":" +      now.getMinutes() + ":" +  now.getSeconds() + ":" +  now.getMilliseconds() + "  " +      now.getDate() + "/" +     (now.getMonth() + 1) + "/" + now.getFullYear(); 

  mydata = {
    timenow, 
    myproducts: result.rows, 
    products
  };
  res.json(mydata);
});

// Read one
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  product ? res.json(product) : res.status(404).send({ error: 'Not found' });
});

// Update
app.put('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).send({ error: 'Not found' });
  products[index] = { id: parseInt(req.params.id), ...req.body };
  res.json(products[index]);
});

// Delete
app.delete('/products/:id', (req, res) => {
  products = products.filter(p => p.id != req.params.id);
  res.send({ message: 'Deleted' });
});


app.get('/', (req, res) => {
  res.json(products);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Node Server running on port ${PORT}`));
