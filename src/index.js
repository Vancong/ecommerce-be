const express=require('express');
const dotenv=require('dotenv');
const bodyPaser=require('body-parser');
const mongoose=require('mongoose');
const database=require('./config/database');
const app=express();
dotenv.config();

const PORT=process.env.PORT||3001;

database.connect();

const routes=require('./routes/index');
app.use(bodyPaser.json());
routes.index(app);


app.get('/',(req,res) =>{
      res.send("hello"); 
})


app.listen(PORT, () =>{
    console.log("Dang chay cong",PORT)
});