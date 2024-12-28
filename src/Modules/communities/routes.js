const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authMiddleware } = require('../Auth/controller');
const { createCommunity, joinCommunity, createPost, fetchPosts, likePost, dislikePost, reportPost, addComment, deleteComment, deletePost, leaveCommunity, getCommunityPosts, getCommunityUsers, getPostDetails, likeComment, dislikeComment, getCommunityMembers } = require('./controller');
const Community = require('./model');
const Post = require('./postModel')

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

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

router.post('/create', 
    authMiddleware.verifyToken, 
    upload.single('image'), 
    createCommunity
);

router.post('/join',  joinCommunity);
router.get('/:communityId/members', authMiddleware.verifyToken, getCommunityMembers);


router.post('/post',  upload.single('image'), createPost);
router.get('/posts', fetchPosts);
router.post('/community/post/like', authMiddleware.verifyToken, likePost);
router.post('/community/post/dislike', authMiddleware.verifyToken, dislikePost);
router.post('/community/post/report', reportPost);
router.post('/community/post/comment', addComment);
router.delete('/community/post/comment', deleteComment);
router.delete('/community/post', deletePost);
router.post('/community/leave', leaveCommunity);
router.get('/community/:communityId/posts', authMiddleware.verifyToken, getCommunityPosts);
router.get('/community/:communityId/users', getCommunityUsers);
router.get('/community/post/:postId', getPostDetails);
router.post('/community/post/comment/like', likeComment);
router.post('/community/post/comment/dislike', dislikeComment);
router.get('/:communityId/members', authMiddleware.verifyToken, getCommunityMembers);

router.get('/global', async (req, res) => {
    try {
        if (!req.headers['content-type']) {
            req.headers['content-type'] = 'application/json';
        }
        
        const { limit = 10, page = 1 } = req.query
        const skip = (page - 1) * parseInt(limit)
        const query = {}
        
        const totalCount = await Community.countDocuments(query)
        const communities = await Community.find(query)
            .populate('admin', 'name email profileImage')
            .populate('doctors', 'name email profileImage')
            .populate('users', 'name email profileImage')
            .populate({
                path: 'posts',
                options: { sort: { createdAt: -1 }, limit: 5 },
                populate: {
                    path: 'user',
                    select: 'name email profileImage'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))

        return res.status(200).json({
            success: true,
            totalCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            communities
        })
    } catch (error) {
        console.error('Community fetch error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error fetching communities',
            error: error.message 
        })
    }
})

router.get('/you/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { limit = 10, page = 1 } = req.query
        const skip = (page - 1) * parseInt(limit)
        
        const query = {
            $or: [
                { admin: id },
                { doctors: id },
                { users: id }
            ]
        }
        
        const totalCount = await Community.countDocuments(query)
        
        const communities = await Community.find(query)
            .populate('admin', 'name email profileImage')
            .populate('doctors', 'name email profileImage')
            .populate('users', 'name email profileImage')
            .populate({
                path: 'posts',
                options: { sort: { createdAt: -1 }, limit: 5 },
                populate: {
                    path: 'user',
                    select: 'name email profileImage'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))

        res.status(200).json({
            totalCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            communities
        })
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching communities',
            error: error.message 
        })
    }
})

router.get('/', async (req, res) => {
    try {
        const communities = await Community.find()
            .populate('admin', 'name email')
            .populate('doctors', 'name email')
            .populate('users', 'name email')
            .sort({ createdAt: -1 })
        if (!communities) {
            return res.status(404).json({
                success: false,
                message: 'No communities found'
            })
        }
        res.status(200).json({
            success: true,
            data: communities
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching communities',
            error: error.message
        })
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

router.get('/posts/:communityId', async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query
        const skip = (page - 1) * parseInt(limit)
        
        const posts = await Post.find({ community: req.params.communityId })
            .populate('user', 'name email profileImage')
            .populate('likes', 'name email profileImage')
            .populate('threads')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
        
        const totalCount = await Post.countDocuments({ community: req.params.communityId })
        
        res.status(200).json({
            success: true,
            totalCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            posts
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching posts',
            error: error.message
        })
    }
})

router.post('/search', async (req, res) => {
    try {
        const { query = '' } = req.query
        const searchQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { subtitle: { $regex: query, $options: 'i' } }
            ]
        }
        const communities = await Community.find(searchQuery)
            .populate('admin', 'name email profileImage')
            .populate('doctors', 'name email profileImage')
            .populate('users', 'name email profileImage')
            .populate({
                path: 'posts',
                options: { sort: { createdAt: -1 }, limit: 5 },
                populate: {
                    path: 'user',
                    select: 'name email profileImage'
                }
            })
            .sort({ createdAt: -1 })
            
        res.status(200).json({
            success: true,
            communities
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching communities',
            error: error.message
        })
    }
})

module.exports = router;
