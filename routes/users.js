const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt")
const mySqlConnection = require("../Database/database")
let user

router.get("/register", (req, res) => {
    if(!req.session.user){
        // res.render('register.ejs');
        res.render("register.ejs");
        // res.status(200).send("Registraion form here");
    }
    else{
        res.status(401).send("You are already logged in");
    }
})

router.get("/login", (req, res) => {
    if(!req.session.user){
res.render("login.ejs");
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
                    res.render("dashboard.ejs",{name:req.session.user.name});
                    // res.status(200).send(user);
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
                        else res.status(200).redirect("localhost:3000/users/login")
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

router.post("/contacts", (req, res) => {
    if (req.session.user) {
        const { name, phone, relationship, email } = req.body
        let errors = []
        if (!name || !phone )
            errors.push({ msg: "name or phone number cannot be empty" })
        else {
            var sql = `INSERT INTO friends (name, email, phone, relationship, userID) VALUES ?`
            const values = [
                [name, email, phone, relationship, req.session.user.id],
            ]

            mySqlConnection.query(sql, [values], err => {
                if (err) res.status(500).send(err)
                res.status(200).send("contact saved")
            })
        }
    } else res.status(401).send("login to post")
})

router.get("/contacts", (req, res) => {
    if (req.session.user) {
        mySqlConnection.query(
            "SELECT * FROM friends WHERE userID = ?",
            [req.session.user.id],
            (err, rows) => {
                if (err) res.status(500).send(err)
                req.session.contacts = rows
                res.status(200).send(rows)
            },
        )
    } else res.status(401).send("login to view")
})

router.post("/contacts/:contactID", (req, res) => {
    if (req.session.user) {
        const { name, phone, relationship, email } = req.body
        mySqlConnection.query(
            "SELECT * FROM friends WHERE id = ? AND userID = ?",
            [req.params.contactID, req.session.user.id],
            (err, rows) => {
                if (err) res.status(500).send(err)
                if (!rows.length) res.status(401).send("you don't have this contact")
                else {
                    mySqlConnection.query(
                        "UPDATE friends SET name=?, phone=?, relationship=?, email=? WHERE contactID = ?",
                        [name, phone, relationship, email, req.params.contactID],
                        err => {
                            if (err) res.status(500).send(err)
                            res.status(200).send("updated")
                        },
                    )
                }
            },
        )
    } else res.status(401).send("login to update")
})
module.exports = router