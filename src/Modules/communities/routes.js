const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authMiddleware } = require('../Auth/controller');
const { createCommunity, joinCommunity, createPost, fetchPosts, likePost, dislikePost, reportPost, addComment, deleteComment, deletePost, leaveCommunity, getCommunityPosts, getCommunityUsers, getPostDetails, likeComment, dislikeComment, getCommunityMembers } = require('./controller');
const Community = require('./model');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, '/tmp');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image file'), false);
        }
    }
});

router.post('/create', 
    authMiddleware.verifyToken, 
    upload.single('image'), 
    createCommunity
);

router.post('/join', authMiddleware.verifyToken, joinCommunity);
router.get('/:communityId/members', authMiddleware.verifyToken, getCommunityMembers);


router.post('/community/post', authMiddleware.verifyToken, upload.single('image'), createPost);
router.get('/community/posts', fetchPosts);
router.post('/community/post/like', likePost);
router.post('/community/post/dislike', dislikePost);
router.post('/community/post/report', reportPost);
router.post('/community/post/comment', addComment);
router.delete('/community/post/comment', deleteComment);
router.delete('/community/post', deletePost);
router.post('/community/leave', leaveCommunity);
router.get('/community/:communityId/posts', getCommunityPosts);
router.get('/community/:communityId/users', getCommunityUsers);
router.get('/community/post/:postId', getPostDetails);
router.post('/community/post/comment/like', likeComment);
router.post('/community/post/comment/dislike', dislikeComment);
router.get('/:communityId/members', authMiddleware.verifyToken, getCommunityMembers);

router.get('/', async (req, res) => {
    try {
        const communities = await Community.find()
            .populate('admin', 'name email')
            .populate('doctors', 'name email')
            .populate('users', 'name email')
            .sort({ createdAt: -1 })
        res.status(200).json(communities)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching communities', error: error.message })
    }
})

router.get('/:communityId', authMiddleware.verifyToken, async (req, res) => {
    try {
        const community = await Community.findById(req.params.communityId)
            .populate('admin', 'name email profileImage')
            .populate('doctors', 'name email profileImage')
            .populate('users', 'name email profileImage')
        
        if (!community) {
            return res.status(404).json({ message: 'Community not found' })
        }
        
        res.status(200).json(community)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching community', error: error.message })
    }
})

module.exports = router;
