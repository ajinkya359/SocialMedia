const express=require('express');
const BodyParser=require('body-parser');
const app=express();
app.use(BodyParser.json());


app.use('/',)
app.get("*",(req,res)=>{
    res.status(404).send('You did some thind wrong')
});
const PORT=5000;
app.listen(PORT,console.log(`Server is started on port${PORT}`))
