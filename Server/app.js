const express = require("express");
const app = express();
const cors = require("cors");
const socket=require('socket.io');
const session = require("express-session");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.static("../public"));
app.set("views engine", "ejs");
app.set("views", "../views");
onlineusers=[ ];

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(
  session({
    secret: "seCRet",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
    }, // This time is in millisecond.
  })
);

app.use("/", require("../routes/index.js"));

app.use("/users", require("../routes/users.js"));
app.get("*", (req, res) => {
  res.status(404).send("You did something wrong");
}); 
const PORT = 5000;
const server=app.listen(PORT, console.log(`Server has started on ${PORT}`));


const io=socket(server);

io.on('connection',(socket)=>{
  socket.on('newUser',(userName)=>{
    console.log('online users are');
    socket.username=userName;
    if(onlineusers.indexOf(socket.username)==-1){
    onlineusers.push(socket.username);}
    onlineusers.forEach(name=>{
      console.log(name);
    })
    io.sockets.emit("newUser",onlineusers);
  })
  
  socket.on('chat-message',(from,message)=>{
        console.log("message from "+from+message);
        socket.broadcast.emit('chat-message',from,message);
    })
    socket.on('disconnect',()=>{
        console.log(socket.username+"disconnected");
        onlineusers.splice(onlineusers.indexOf(socket.username),1);
        io.sockets.emit('newUser',onlineusers);
    })
});