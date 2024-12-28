const Community = require('./model');
const Post = require('./postModel');
const User = require('../Auth/model').User;
const cloudinary = require('../../config/cloudinary')

const createCommunity = async (req, res) => {
    try {
        const { title, subtitle, adminId } = req.body
        let doctors = req.body.doctors ? JSON.parse(req.body.doctors) : []
        let location = req.body.location ? JSON.parse(req.body.location) : null

        if (!adminId || adminId === 'null') {
            return res.status(400).json({ 
                message: 'Admin ID is required' 
            })
        }

        let imageUrl = ''
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'communities',
                    resource_type: 'auto',
                    transformation: [
                        { width: 1000, crop: "limit" },
                        { quality: "auto" },
                        { fetch_format: "auto" }
                    ]
                })
                imageUrl = result.secure_url
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError)
                return res.status(500).json({ 
                    message: 'Error uploading image',
                    error: uploadError.message 
                })
            }
        }

        const communityData = {
            title,
            subtitle,
            image: imageUrl,
            admin: adminId,
            doctors: Array.isArray(doctors) ? doctors : [],
            location
        }

        const community = new Community(communityData)
        await community.save()

        const populatedCommunity = await Community.findById(community._id)
            .populate('admin', 'name email')
            .populate('doctors', 'name email')

        res.status(201).json(populatedCommunity)
    } catch (error) {
        console.error('Create community error:', error)
        res.status(500).json({ 
            message: 'Error creating community', 
            error: error.message 
        })
    }
}

const joinCommunity = async (req, res) => {
    const { communityId, userId } = req.body
    try {
        if (!communityId || !userId) {
            return res.status(400).json({ 
                message: 'Community ID and User ID are required' 
            })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            })
        }

        const community = await Community.findById(communityId)
        if (!community) {
            return res.status(404).json({ 
                message: 'Community not found' 
            })
        }

        const isUserAlreadyJoined = community.users.some(id => 
            id && id.toString() === userId.toString()
        )

        if (isUserAlreadyJoined) {
            return res.status(400).json({ 
                message: 'User already joined this community' 
            })
        }

        community.users = community.users.filter(id => id != null)
        community.users.push(userId)
        await community.save()

        const updatedCommunity = await Community.findById(communityId)
            .populate('admin', 'name email')
            .populate('doctors', 'name email')
            .populate('users', 'name email')

        res.status(200).json(updatedCommunity)
    } catch (error) {
        console.error('Join community error:', error)
        res.status(500).json({ 
            message: 'Error joining community', 
            error: error.message 
        })
    }
}

const createPost = async (req, res) => {
    const { title, subtitle, content, communityId, userId } = req.body;
    try {
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'posts'
            });
            imageUrl = result.secure_url;
        }

        const post = new Post({
            title,
            subtitle,
            content,
            image: imageUrl,
            community: communityId,
            user: userId
        });
        await post.save();

        const community = await Community.findById(communityId);
        community.posts.push(post._id);
        await community.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};

const fetchPosts = async (req, res) => {
    try {
        const posts = await Post.find({ community: req.params.communityId })
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'user',
                        select: 'name email'
                    },
                    {
                        path: 'replies',
                        populate: {
                            path: 'user',
                            select: 'name email'
                        }
                    }
                ]
            });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

const likePost = async (req, res) => {
    const { postId, userId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error liking post', error });
    }
};

const dislikePost = async (req, res) => {
    const { postId, userId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.likes = post.likes.filter(id => id.toString() !== userId);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error disliking post', error });
    }
};

const reportPost = async (req, res) => {
    const { postId, userId, reason } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Logic to report the post (e.g., notify admin, log the report)
        // This could involve saving the report to a separate collection or notifying an admin

        res.status(200).json({ message: 'Post reported successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error reporting post', error });
    }
};

const addComment = async (req, res) => {
    const { postId, userId, content, parentCommentId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const newComment = {
            user: userId,
            content,
            likes: [],
            replies: []
        };

        if (!parentCommentId) {
            post.comments.push(newComment);
        } else {
            const findAndAddReply = (comments) => {
                for (let comment of comments) {
                    if (comment._id.toString() === parentCommentId) {
                        comment.replies.push(newComment);
                        return true;
                    }
                    if (comment.replies && comment.replies.length > 0) {
                        if (findAndAddReply(comment.replies)) return true;
                    }
                }
                return false;
            };

            const found = findAndAddReply(post.comments);
            if (!found) return res.status(404).json({ message: 'Parent comment not found' });
        }

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

const deleteComment = async (req, res) => {
    const { postId, commentId, userId, parentCommentId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const community = await Community.findById(post.community);
        const isAdmin = community.admin.toString() === userId;
        const isDoctor = community.doctors.includes(userId);

        const findAndDeleteComment = (comments) => {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i]._id.toString() === commentId) {
                    const isCommentOwner = comments[i].user.toString() === userId;
                    if (isAdmin || isDoctor || isCommentOwner) {
                        comments.splice(i, 1);
                        return true;
                    }
                    return false;
                }
                if (comments[i].replies && comments[i].replies.length > 0) {
                    if (findAndDeleteComment(comments[i].replies)) return true;
                }
            }
            return false;
        };

        const deleted = findAndDeleteComment(post.comments);
        if (!deleted) {
            return res.status(403).json({ message: 'Not authorized or comment not found' });
        }

        await post.save();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
};

const deletePost = async (req, res) => {
    const { postId, userId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const community = await Community.findById(post.community);
        const isAdmin = community.admin.toString() === userId;
        const isPostOwner = post.user.toString() === userId;

        if (isAdmin || isPostOwner) {
            await Post.findByIdAndDelete(postId);
            community.posts = community.posts.filter(p => p.toString() !== postId);
            await community.save();
            res.status(200).json({ message: 'Post deleted successfully' });
        } else {
            res.status(403).json({ message: 'Not authorized to delete this post' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
};

const leaveCommunity = async (req, res) => {
    const { communityId, userId } = req.body;
    try {
        const community = await Community.findById(communityId);
        if (!community) return res.status(404).json({ message: 'Community not found' });

        community.users = community.users.filter(id => id.toString() !== userId);
        await community.save();
        res.status(200).json({ message: 'Successfully left community' });
    } catch (error) {
        res.status(500).json({ message: 'Error leaving community', error });
    }
};

const getCommunityPosts = async (req, res) => {
    const { communityId } = req.params;
    try {
        const posts = await Post.find({ community: communityId })
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'user',
                        select: 'name email'
                    },
                    {
                        path: 'replies',
                        populate: {
                            path: 'user',
                            select: 'name email'
                        }
                    }
                ]
            });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching community posts', error });
    }
};

const getCommunityUsers = async (req, res) => {
    const { communityId } = req.params;
    try {
        const community = await Community.findById(communityId)
            .populate('users', 'name email')
            .populate('doctors', 'name email')
            .populate('admin', 'name email');
        
        if (!community) return res.status(404).json({ message: 'Community not found' });

        res.status(200).json({
            admin: community.admin,
            doctors: community.doctors,
            users: community.users
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching community users', error });
    }
};

const getPostDetails = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId)
            .populate('user', 'name email')
            .populate('likes', 'name email')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'user',
                        select: 'name email'
                    },
                    {
                        path: 'likes',
                        select: 'name email'
                    },
                    {
                        path: 'replies',
                        populate: [
                            {
                                path: 'user',
                                select: 'name email'
                            },
                            {
                                path: 'likes',
                                select: 'name email'
                            }
                        ]
                    }
                ]
            });

        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post details', error });
    }
};

const likeComment = async (req, res) => {
    const { postId, commentId, userId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const findAndLikeComment = (comments) => {
            for (let comment of comments) {
                if (comment._id.toString() === commentId) {
                    if (!comment.likes.includes(userId)) {
                        comment.likes.push(userId);
                    }
                    return true;
                }
                if (comment.replies && comment.replies.length > 0) {
                    if (findAndLikeComment(comment.replies)) return true;
                }
            }
            return false;
        };

        const found = findAndLikeComment(post.comments);
        if (!found) return res.status(404).json({ message: 'Comment not found' });

        await post.save();
        res.status(200).json({ message: 'Comment liked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error liking comment', error });
    }
};

const dislikeComment = async (req, res) => {
    const { postId, commentId, userId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const findAndDislikeComment = (comments) => {
            for (let comment of comments) {
                if (comment._id.toString() === commentId) {
                    comment.likes = comment.likes.filter(id => id.toString() !== userId);
                    return true;
                }
                if (comment.replies && comment.replies.length > 0) {
                    if (findAndDislikeComment(comment.replies)) return true;
                }
            }
            return false;
        };

        const found = findAndDislikeComment(post.comments);
        if (!found) return res.status(404).json({ message: 'Comment not found' });

        await post.save();
        res.status(200).json({ message: 'Comment disliked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error disliking comment', error });
    }
};

const getCommunityMembers = async (req, res) => {
    const { communityId } = req.params
    try {
        const community = await Community.findById(communityId)
            .populate('admin', 'name email profileImage')
            .populate('doctors', 'name email profileImage')
            .populate('users', 'name email profileImage')

        if (!community) {
            return res.status(404).json({ message: 'Community not found' })
        }

        res.status(200).json({
            admin: community.admin,
            doctors: community.doctors,
            users: community.users
        })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching community members', error: error.message })
    }
}

module.exports = {
    createCommunity, joinCommunity, createPost, fetchPosts, 
    likePost, dislikePost, reportPost, addComment, 
    deleteComment, deletePost, leaveCommunity, 
    getCommunityPosts, getCommunityUsers, getPostDetails, 
    likeComment, dislikeComment, getCommunityMembers
};