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
router.post('/addfollower', (req, res) => {
    var values = [
        [req.body.friendid, req.body.userid]
    ]
    if(!req.body.friendid||!req.body.userid)
    {
        res.send("USer or friend id not found");
    }
    else if(req.body.friendid===req.body.userid)
    {
        res.send("You cannot follow yourself")
    }
    else{
        mySqlConnection.query(
            "select * from following where tofollowid=? and userid=?",
            [req.body.friendid,req.body.userid],
            (err,rows)=>{
                if(err) res.send(err);
                else if(rows.length) res.send("you are already following")
                else{
                    mySqlConnection.query(
                        'insert into following (tofollowid,userid) values ?',
                        [values],
                        (err) => {
                            if (err) res.send(err)
                            else res.send("You are following him now");
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
                    users.push([user.name, user.id,user.image]);
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
router.get('/following',(req,res)=>{
    if(req.session.user){
        mySqlConnection.query(
            'select * from following where userid=?',
            [req.session.user.id],
            (err,rows)=>{
                if(err) res.send(err);
                else if(!rows.length) res.send("You are not following anyone.");
                else{
                    var friendsid=[];

                    rows.forEach(id=>{
                        friendsid.push(id.tofollowid);
                    });
                    mySqlConnection.query(
                        'select * from users where id in ?',
                        [([friendsid])],
                        (err,friendrows)=>{

                            if(err) res.send(err);
                            else res.render('followers.ejs',{
                                h:friendrows
                            })
                        }
                    )
                }
            }
        )
    }
    else{
        res.send("Login first to view who you are following")
    }
})

router.get('/friends',(req,res)=>{
    if(req.session.user){
        mySqlConnection.query(
            'select * from frienduni where userid=?',
            [req.session.user.id],
            (err,rows)=>{
                if(err) res.send(err);
                else if(!rows.length) res.send("You dont have any friends");
                else{
                    var friendsid=[];
                    rows.forEach(id=>{
                        friendsid.push(id.friendid);
                    });
                    mySqlConnection.query(
                        'select * from users where id in ?',
                        [([friendsid])],
                        (err,friendrows)=>{
                            if(err) res.send(err);
                            else res.render('friends.ejs',{
                                h:friendrows
                            })
                        }
                    )
                }
            }
        )
    }
    else{
        res.send("Login first to view your friends")
    }
})
module.exports = router;