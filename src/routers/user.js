const express = require('express')
const router = new express.Router()

const auth = require('../middleware/auth')
const {sendWelcomeMail,sendGoodByeMail} = require('../emails/account')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
//Users
router.get("/users", async(req, res) => {
    try {

        const users = await User.find({})
        if (!users) {
            return res.status(404).send()
        }
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
});

router.get('/users/mee',auth,async (req,res)=>{
    try {
        console.log('test')
        res.send(req.user)
    } catch (e) {
        res.status(500).send({'error':e})
    }
    
})

router.get("/users/:id", async(req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(400).send();
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
});

router.post("/users", async(req, res) => {
    const user = new User(req.body);
    try {
        sendWelcomeMail(user.email,user.name)
        const token = await user.generateAuthToken()
        await user.save()

        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
});

router.patch('/users/me', auth , async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    console.log(updates, isValidOperation);
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" })
    }
    try {
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
       // const user = await User.findById(req.params.id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth , async(req, res) => {

    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        sendGoodByeMail(req.user.email,req.user.name)
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async(req, res) => {
    try {
        
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        
        res.send({ user, token })
    
    } catch (e) {
        res.status(400).send({ "error": e })
    }
})


router.post('/users/logout',auth,async (req,res)=>{
    try {
         req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
         })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send({'error':e})
    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try {
        req.user.tokens = []
       await req.user.save()

       res.send({'sucess':'logout sucess'});
   } catch (e) {
       res.status(500).send(e)
   }
})

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpeg|png|jpg)$/)){
            cb(new Error('File must be image with extension jpeg,jpg,png!'))
        }
        cb(undefined,true)
    }
})


router.post('/users/me/avatar',auth,upload.single('avatar'), async (req,res)=>{

    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
    
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


router.delete('/users/avatar',auth, async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


router.get('/users/:id/avatar',async (req,res)=>{

    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
    

})
module.exports = router