const express=require('express');
const multer=require('multer');
const router=express.Router();
const app=express();

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})
var u=multer({storage:storage});

app.get('/uploads',(req,res)=>{
    res.send("receiving at the uploads")
})
app.post('/uploads',u.single('PostImage'),(req,res)=>{
    console.log(req.file);
    res.send('Done');
})
  
app.get('/test',(req,res)=>{
    res.send("haha");
})
app.get('*',(req,res)=>{
    res.send("Hi my name is ajinyka");
})
const PORT=3000;
app.listen(PORT,console.log(`Test server has started on port ${PORT}`));