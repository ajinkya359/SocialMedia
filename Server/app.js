const express=require('express')
const app=express();
const bodyParser=require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/',require('../routes/index.js'))

app.use('/users',require('../routes/users.js'))
app.get("*",(req,res)=>{
    res.status(404).send('You did something wrong');
})
const PORT=3000;
app.listen(PORT,console.log(`Server has started on ${PORT}`));