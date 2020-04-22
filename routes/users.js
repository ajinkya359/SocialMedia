

const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const mySqlConnection = require("../Database/database")
let user

router.get("/register", (req, res) => {
    res.status(200).send('register form will be here')
})

router.get("/login", (req, res) => {
    res.status(200).send("login page here!")
})

module.exports = router