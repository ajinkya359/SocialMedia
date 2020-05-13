const express = require('express');
const router = express.Router();
const mySqlConnection = require("../Database/database")

router.get('/', (req, res) => res.status(200).send('home-page'));

router.get('/dashboard', (req, res) => {
    if (req.session.user)
        res.render("dashboard.ejs", {
            name: req.session.user.name,
            image: req.session.user.image
        });
    // res.status(200).send(req.session.user);
    else
        res.status(401).send("You are not logged in");
})
router.get('/chat', (req, res) => {
    if (req.session.user) {
        res.render("chat.ejs", {
            name: req.session.user.name
        });
    } else {
        res.status(404).send("Sorry But you need to login first");
    }
})
router.post('/addfriend', (req, res) => {
    var values = [
        [req.body.friendid, req.body.userid]
    ]
    if(!req.body.friendid||!req.body.userid)
    {
        res.send("USer or friend id not found");
    }
    else if(req.body.friendid===req.body.userid)
    {
        res.send("You cannot add yourself as friend")
    }
    else{
        mySqlConnection.query(
            "select * from frienduni where friendid=? and userid=?",
            [req.body.friendid,req.body.userid],
            (err,rows)=>{
                if(err) res.send(err);
                else if(rows.length) res.send("He is already you friend")
                else{
                    mySqlConnection.query(
                        'insert into frienduni (friendid,userid) values ?',
                        [values],
                        (err) => {
                            if (err) res.send(err)
                            else res.send("Friend added");
                        }
                    )
                }
            }
        )
    }
    
    
})
router.get('/people', (req, res) => {
if(req.session.user){
    mySqlConnection.query(
        "select * from users",
        (err, rows) => {
            if (err) res.send(err);
            else {
                var users = []
                rows.forEach(user => {
                    users.push([user.name, user.id]);
                });
                res.render('people.ejs', {
                    h: users,
                    id: req.session.user.id
                })
            }
        }
    )}
    else{
        res.send("Login first");
    }
})
module.exports = router;