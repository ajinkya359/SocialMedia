const express = require("express")
const router = express.Router();

const bcrypt = require("bcrypt")
const mySqlConnection = require("../Database/database")
let user

router.get("/register", (req, res) => {
    if(!req.session.user){
        res.status(200).send("Registraion form here");
    }
    else{
        res.status(401).send("You are already logged in");
    }
})

router.get("/login", (req, res) => {
    if(!req.session.user){
        res.status(200).send("Login page here");
    }
    else {
        res.status(401).send("Logout first to login again");
    }
})


router.post('/login',(req,res)=>{
    const {email,password}=req.body;
    mySqlConnection.query(
        "select * from users where email=?",
        [email],
        (err,rows)=>{
            if(err) res.status(500).send(err);
            else if(rows.length===0) res.status(404).send("The user is not registered");
            else{
                const user=rows[0];
                if(bcrypt.compareSync(password,user.hash)){
                    req.session.user=user;
                    res.status(200).send(user);
                }
                else res.send("incorrect password");
            }
        }
    )
})
router.post('/register',(req,res)=>{
    let errors=[];
    const {name,email,password,phone}=req.body;
    if(!name||!email||!password||!phone)
    {
        errors.push({msg:"Please enter all fields"});
    }
    if(password.length<6)
    {
        errors.push({msg:"Password should be atleast of length 6"});
    }
    mySqlConnection.query(
        "Select * from users where email = ?",
        [email],
        (err,rows)=>{
            if(err) res.status(500).send(err);
            else if(rows.length) errors.push({msg:"Email has already been taken"});
            if(errors.length>0){
                res.status(400).send(errors);
            }
            else{
                hash=bcrypt.hashSync(password,10);
                mySqlConnection.query(
                    "Insert into users(name,email,phone,hash) values ?",
                    [[[name,email,phone,hash]]],
                    (err)=>{
                        if(err) res.send(err)
                        else res.status(200).send("Successfully Registered")
                    }
                )
            }
        }
    )
});

router.get('/logout',(req,res)=>{
    if(req.session.user){
        req.session.destroy();
        res.status(200).send("logout successfull");
    }
    else{
        res.status(400).send('you are not logged out');
    }
})

module.exports = router