const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin')
const postModel = mongoose.model("post")
const user = mongoose.model("user")

router.get('/user/:id', requireLogin, (req, res) => {
    try{
    user.findOne({ _id: req.params.id })
        .select("-password")
        .then(async (user) => {
            if(user){
                try {
                    const posts = await postModel.find({ postedBy: req.params.id })
                        .populate("postedBy", "_id name")
                        .exec();
                    if (!posts) {
                        return res.status(200).json({ err: "User Not Found" })
                    }
                    return res.status(200).json({ posts, user })
                }
                catch (error) {
                    res.status(422).json({ err: "Internal server error" + error })
                }
            }else{
                return res.status(400).json({err:"User not found"})
            }
            
        }).catch(err => {
            return res.status(404).json({ error: 'user not found' });
        })
    }catch(err){
        res.status(422).json({err:"something went wrong "+err});
    }
})

router.put("/follow", requireLogin, async(req, res) => {
    try{
        const followedUser = await user.findByIdAndUpdate(req.body.followId,{
            $push:{followers:req.user._id},
        },{
            new:true,
        }).select("-password")

        const currentUser = await user.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true,
        }).select("-password")

        res.json({currentUser,followedUser})
    }catch(err){
        res.status(422).json({err});
    }
})

router.put("/unfollow", requireLogin, async(req, res) => {
    try{
        const followedUser = await user.findByIdAndUpdate(req.body.unfollowId,{
            $pull:{followers:req.user._id},
        },{
            new:true,
        }).select("-password")

        const currentUser = await user.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true,
        }).select("-password")

        res.json({currentUser,followedUser})
    }catch(err){
        res.status(422).json({err});
    }
})

router.put('/updatedp',requireLogin,(req,res)=>{
    user.findByIdAndUpdate(req.user._id,{$set:{dp:req.body.dp}},{new:true})
    .then(result =>{
        res.status(200).json(result)
    }).catch(err =>{
        res.status(422).json({err:"dp cannot update"})
    })
})

router.post('/searchuser',(req,res)=>{
    const userPattern = new RegExp("^"+req.body.query);
    user.find({email:{$regex:userPattern}})
    .select("_id name email dp")
    .then((user)=>{
        res.status(200).json({user})
    }).catch(err=>{
        console.log(err)
    })
})
router.get('/followinglist/:id',requireLogin,(req,res)=>{
    user.findOne({_id:req.params.id})
    .select('following')
    .then(userData=>{
        user.find({_id:userData.following})
        .select('_id name dp')
        .then((result)=>{
            res.status(200).json({result})
        })
    }).catch(err=>{
        console.log(err)
    })
})
router.get('/followerlist/:id',requireLogin,(req,res)=>{
    user.findOne({_id:req.params.id})
    .select("followers")
    .then(userData =>{
        user.find({_id:userData.followers})
        .select("_id name dp")
        .then((result)=>{
            res.status(200).json({result})
        })
    }).catch(err=>{
        console.log(err)
    })
})
router.put('/removeFollower',requireLogin,async(req,res)=>{
    try{
        const followedUser = await user.findByIdAndUpdate(req.body.followerId,{
            $pull:{following:req.user._id},
        },{
            new:true,
        }).select("-password")

        const currentUser = await user.findByIdAndUpdate(req.user._id,{
            $pull:{followers:req.body.followerId}
        },{
            new:true,
        }).select("-password")

        res.json({currentUser,followedUser})
    }catch(err){
        res.status(422).json({err});
    }
})
router.post('/addStory',requireLogin,async(req,res)=>{
    try{
        const addStory = await user.findByIdAndUpdate(req.user._id,{
            $push:{
                stories:{
                    user:req.user._id,
                    storyPic:req.body.pic,
                    storyDate:new Date(),
                }
            }
        },{new:true})
        .exec();

        if(!addStory){
            res.status(422).json({msg:"Something went wrong..."})
        }else{
            res.status(201).json({addStory})
        }

    }catch(err){
        res.status(422).json({err})
        console.log(err);
    }
})
router.get('/getStory',requireLogin,async(req,res)=>{
    try{
        const story = await user.find({"stories.storyDate":{"$lte":new Date(Date.now() +1*24*60*60*1000)}}) //less than 24 hours
        .select("_id name pic stories")
        
        if(!story){
            res.status(422).json({msg:"Story not awailable"})
        }else{
            res.status(200).json({story})
        }
    }catch(err){
        console.log(err);
        res.status(422).json({err})
    }
})
module.exports = router;