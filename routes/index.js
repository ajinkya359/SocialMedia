const express = require('express');
const router = express.Router();
const mySqlConnection = require("../Database/database")

router.get('/', (req, res) => res.status(200).send('home-page'));

router.get('/dashboard',(req,res)=>{
    if(req.session.user)
        res.render("dashboard.ejs",{name:req.session.user.name,image:req.session.user.image});
        // res.status(200).send(req.session.user);
    else
        res.status(401).send("You are not logged in");
})
router.get('/chat',(req,res)=>{
    if(req.session.user)
    {
       res.render("chat.ejs",{name:req.session.user.name});
    }
    else{
        res.status(404).send("Sorry But you need to login first");
    }
})
router.get('/people',(req,res)=>{
     mySqlConnection.query(
         "select * from users",
         (err,rows)=>{
             if(err) res.send(err);
             else {
                 var users=[]
                 rows.forEach(user => {
                     users.push(user.name);
                 });
                 res.render('people.ejs',{h:users})
             }  
         }
     )
})
module.exports = router;