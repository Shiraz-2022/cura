const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    isGlobal: { type: Boolean, default: true },
    location: {
        name: { type: String },
        
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
       
    }
}, { timestamps: true });

const Community = mongoose.model('Community', CommunitySchema);
module.exports = Community;
