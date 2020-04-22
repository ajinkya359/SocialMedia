const express = require("express")
const router = express.Router();

const bcrypt = require("bcrypt")
const mySqlConnection = require("../Database/database")
let user

router.get("/register", (req, res) => {
    res.status(200).send('register form will be here')
})

router.get("/login", (req, res) => {
    res.status(200).send("login page here!")
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
})

module.exports = router