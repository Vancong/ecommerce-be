const express=require('express');
const dotenv=require('dotenv');
dotenv.config();
const bodyPaser=require('body-parser');
const database=require('./config/database');
const app=express();
const cors=require('cors');
const cookieParser= require('cookie-parser')

const isProduction = process.env.NODE_ENV === "production";

app.use(cors({
  origin: isProduction 
    ? "https://thegioinuochoa.netlify.app" 
    : "http://localhost:3000",
  credentials: true,
}));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit:'50mb'}));
const PORT=process.env.PORT||3001;

database.connect();

const routes=require('./routes/index');
app.use(bodyPaser.json());
app.use(express.json());   
app.use(cookieParser());
routes.index(app);


app.get('/',(req,res) =>{
      res.send("hello"); 
})



app.listen(PORT, () =>{
    console.log("Dang chay cong",PORT)
});