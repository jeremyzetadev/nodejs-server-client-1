import express from 'express';
const app = express();

const users = [
    {
        name:'Name',
        age:31,
    }
]

app.get('/users',(req,res)=>{
    res.json(users);
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})