const express = require("express");
require("./db/mongoose.js");
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')



const app = express();
const port = process.env.PORT;

const multer = require('multer')

const upload = multer({ 
    dest:'images'
})

app.post('/upload',upload.single('upload'),(req,res)=>{

    res.send()


})

app.use(express.json());

// app.use((req,res,next)=>{
//     res.status(503).send("Site is currently down, Check back soon!")
// })
// app.use((req,res,next)=>{
//     console.log(req.method,req.path)
//     if(req.method==='GET'){
//         res.send('Get Method Disabled!')
//     }else{
//         next()
//     }
// })

app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log("server is up on port " + port);
});

