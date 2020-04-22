const express=require('express')
const app=express();
const BodyParser=require('body-parser')
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));

app.use('/',require('../routes/index.js'))

app.use('/users',require('../routes/users.js'))
app.get("*",(req,res)=>{
    res.status(404).send('You did something wrong');
})
const PORT=3000;
app.listen(PORT,console.log(`Server has started on ${PORT}`));