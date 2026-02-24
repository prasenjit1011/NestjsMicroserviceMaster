console.clear();

console.log("Starting Food API...");
console.log("-----------------------------")
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());


/* ******************************************************/

const snowflake = require('snowflake-sdk');

// Create connection
const connection = snowflake.createConnection({
  account: 'CYFODET-DS26957',
  username: 'MRALUNI',
  password: 'Lnsel345Lnsel345',  // replace with your actual password
  role: 'ACCOUNTADMIN',
  warehouse: 'COMPUTE_WH',
  database: 'SNOWFLAKE_SAMPLE_DATA',
  schema: 'TPCH_SF1'
});

// Connect
connection.connect((err, conn) => {
    if (err) {
        console.error('❌ Unable to connect: ' + err.message);
        return;
    }
    console.log('✅ Connected with id: ' + conn.getId()+' ::::::::::\n\n');

    /* ***********************************************************/
    console.log("Fetching table structure...");

    connection.execute({
        sqlText: `DESCRIBE TABLE CUSTOMER`, 
        complete: function(err, stmt, rows) {
            if (err) {
                console.error('❌ Failed to fetch table structure: ' + err.message);
                return;
            }
            console.log(`✅ Table structure for CUSTOMER:`);
            console.table(rows); // will display columns like name, type, null?, default, etc.
        }
    });


    /* ***********************************************************/

    connection.execute({
        sqlText: `INSERT INTO CUSTOMER 
                (C_CUSTKEY, C_NAME, C_ADDRESS, C_NATIONKEY, C_PHONE, C_ACCTBAL, C_MKTSEGMENT, C_COMMENT) 
                VALUES 
                (101, 'John Doe', '123 Main Street', 1, '123-456-7890', 5000.75, 'AUTO', 'New customer')`,
        complete: function(err, stmt) {
            if (err) {
                console.error('❌ Insert failed: ' + err.message);
            } else {
                console.log("✅ Insert successful");
            }
        }
    });

    /* ***********************************************************/










    // Run SELECT query
    connection.execute({
        sqlText: `SELECT C_CUSTKEY,C_NAME,C_ADDRESS FROM CUSTOMER LIMIT 5`, // adjust limit as needed
        complete: function(err, stmt, rows) {
        if (err) {
            console.error('❌ Failed to execute statement: ' + err.message);
            return;
        }
        console.log(`✅ Successfully executed query: ${stmt.getSqlText()}`);
        console.table(rows); // pretty print results
        }
    });

    /* ***********************************************************/

    console.log("Re-running the query...");
    // Run SELECT query
    connection.execute({
        sqlText: `SELECT C_CUSTKEY,C_NAME,C_ADDRESS FROM CUSTOMER LIMIT 5`, // adjust limit as needed
        complete: function(err, stmt, rows) {
        if (err) {
            console.error('❌ Failed to execute statement: ' + err.message);
            return;
        }
        console.log(`✅ Successfully executed query:::::::: ${stmt.getSqlText()}`);
        console.table(rows); // pretty print results
        }
    });

  




});


/* ******************************************************/













app.get('/', (req, res) => {
    res.json(foods);
});
  

app.listen(PORT, () => {
  //console.log(`Food API listening on port ${PORT}`);
});
