const express = require('express')
const app = express();
const port = process.env.PORT || 8000;
const dotenv =require('dotenv')
const mongoose = require('mongoose')

dotenv.config();

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Database Connected")
}).catch((e)=>{
    console.log(e)
})

app.get('/', (req,res)=>{
    res.send('hellow')
})

app.listen(port, ()=>{
    console.log(`server is running at port ${port}`)
})


