const express=require('express');
const cors=require('cors');
const app=express();
const port= process.env.PORT || 5000;

//middlewares

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('motor fixer server is running');
})

app.listen(port,()=>{
    console.log(`server listening at port ${port}`)
})