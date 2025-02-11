const express = require('express')
 const db = require('./db');
const app = express()
 require('dotenv').config(); // .env file 
//body parser
const bodyParser = require('body-parser') ;
app.use(bodyParser.json()) ; // req.body 
const PORT = process.env.PORT||3000  // THIS IS IMPORT FROM .ENV


//IMPORT person router file 
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
//use routers
app.use('/user',userRoutes) ;
app.use('/candidate',candidateRoutes) ;



app.listen(PORT , ()=>{
    console.log("server is listening on port 3000")
})