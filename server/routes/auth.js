const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const user = mongoose.model("user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')


router.post('/signup', (req, res) => {
    const { name, email, password,dp } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ err: "Please add all the fields" })
    }
    user.findOne({email:email})
    .then((exist)=>{
        if(exist) {
            return res.status(406).json({msg:"user already exist with this email"})
        }
        else{
            bcrypt.hash(password,10)
            .then(hashedPassword =>{
                const userData = new user({
                    name,
                    email,
                    password:hashedPassword,
                    dp
                })
                userData.save().then(user=>res.status(201).json({msg:"SignUp Successfully"}))
                .catch((error)=>console.log(error));
            })          
        }
    }).catch((error)=>{
        console.log(error)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(422).json({err:"Please provide email or password"})
    }
    user.findOne({email:email})
    .then((exist)=>{
        if(!exist){
            return res.status(422).json({err:"Invalid email or password"})
        }else{
            bcrypt.compare(password,exist.password)
            .then((match)=>{
                if(match){
                    const token = jwt.sign({_id:exist._id},JWT_SECRET);
                    const {_id,name,email,followers,following,dp} = exist;
                    res.json({token,user:{_id,name,email,followers,following,dp}});
                }else{
                    return res.status(422).json({err:"Invalid email or password"})
                }
            }).catch((error)=>{
                console.log(error)
            })
        }
    }).catch((error)=>{
        console.log(error)
    })
})
module.exports = router