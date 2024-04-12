const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin')
const postModel = mongoose.model("post")
const userModel = mongoose.model("user")

router.get('/allpost', requireLogin, (req, res) => {
    postModel.find()
        .populate("postedBy", "_id name dp")
        .populate("comments.postedBy", "_id name")
	.sort("-createdAt")
        .then(posts => {
            res.json({ posts })
        }).catch(err => console.log(err))
})

router.get('/followingpost', requireLogin, (req, res) => {
    postModel.find({postedBy:{$in:req.user.following}})
        .populate("postedBy", "_id name dp")
        .populate("comments.postedBy", "_id name")
	.sort("-createdAt")
        .then(posts => {
            res.json({ posts })
        }).catch(err => console.log(err))
})

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body, picture } = req.body;
    req.user.password = undefined;
    const post = new postModel({
        title,
        body,
        picture,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({ post: { result } })
    }).catch((err) => {
        console.log(err);
    })
})

router.get('/mypost', requireLogin, (req, res) => {
    postModel.find({ postedBy: req.user._id })
        .populate('postedBy', '_id name dp')
        .then((mypost) => {
            res.status(200).json({ mypost })
        }).catch((err) => { console.log(err) })
})

router.put('/like', requireLogin, async (req, res) => {
    const { postId } = req.body;

    if (!postId) {
        return res.status(400).json({ error: 'postId is required' });
    }

    try {
        const result = await postModel.findByIdAndUpdate(postId, {
            $push: { likes: req.user._id }
        }, {
            new: true,
        })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy","_id name dp")
        .exec()

        if (!result) {
            return res.status(404).json({ error: 'Post not found' });
        }

        return res.json(result);
    } catch (err) {
        console.error('Error in updating like:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/unlike', requireLogin, async (req, res) => {
    const { postId } = req.body;

    if (!postId) {
        return res.status(400).json({ error: 'postId is required' });
    }

    try {
        const result = await postModel.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user._id }
        }, {
            new: true,
        })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy","_id name dp")
        .exec();
        if (!result) {
            return res.status(404).json({ error: 'Post not found' });
        }
        return res.status(200).json(result);

    } catch (err) {
        console.error('Error in updating like:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/comment', requireLogin, async (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }

    if (!comment.text) {
        return res.status(400).json({ error: 'Comment is required' });
    }

    try {
        const result = await postModel.findByIdAndUpdate(req.body.postId, {
            $push: { comments: comment }
        }, {
            new: true,
        })
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name dp")
            .exec();

        if (!result) {
            return res.status(404).json({ error: 'Post not found' });
        }
        return res.json(result);

    } catch (err) {
        console.error('Error in updating like:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
    try {
        const post = await postModel.findOne({ _id: req.params.postId }).populate("postedBy", "_id").exec();        
        if (!post) {
            return res.status(422).json({ error: "Post not found" });
        }
        if (post.postedBy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const deletedPostDetails = post;
        const result = await post.deleteOne();
        res.json({Message:"Post Deleted",result,deletedPostDetails});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete post" });
    }
});

router.get('/likeslist/:id',requireLogin,(req,res)=>{
    postModel.findOne({_id:req.params.id})
    .select('likes')
    .then(userData=>{
        userModel.find({_id:userData.likes})
        .select("_id name dp")
        .then((result)=>{
            if(!result){
                return res.status(422).json({err:"User Not found"})
            }
            res.json(result)
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router;